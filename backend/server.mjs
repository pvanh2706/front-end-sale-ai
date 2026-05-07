import cors from 'cors'
import express from 'express'
import http from 'node:http'
import multer from 'multer'
import { Server as SocketIOServer } from 'socket.io'
import { WebSocketServer } from 'ws'
import {
  createDeal,
  deleteDeal,
  getDealById,
  listDeals,
  listDealsForKanban,
  updateDeal,
  updateDealStage,
  validateStage,
} from './deals.mjs'

const app = express()
const port = Number(process.env.PORT ?? 4000)

app.use(cors())
app.use(express.json())

const HARD_FILE_LIMIT_BYTES = 1024 * 1024 * 1024

const PLAN_LIMITS = {
  free: {
    maxFileSizeBytes: 25 * 1024 * 1024,
    maxFilesPerUpload: 5,
    maxStorageBytes: 1 * 1024 * 1024 * 1024,
  },
  trial: {
    maxFileSizeBytes: 25 * 1024 * 1024,
    maxFilesPerUpload: 5,
    maxStorageBytes: 1 * 1024 * 1024 * 1024,
  },
  standard: {
    maxFileSizeBytes: 50 * 1024 * 1024,
    maxFilesPerUpload: 10,
    maxStorageBytes: 50 * 1024 * 1024 * 1024,
  },
  pro: {
    maxFileSizeBytes: 100 * 1024 * 1024,
    maxFilesPerUpload: 20,
    maxStorageBytes: 500 * 1024 * 1024 * 1024,
  },
  enterprise: {
    maxFileSizeBytes: 500 * 1024 * 1024,
    maxFilesPerUpload: 50,
    maxStorageBytes: Number.POSITIVE_INFINITY,
  },
}

const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: HARD_FILE_LIMIT_BYTES,
  },
})

const orgState = new Map()
const orgLibraryState = new Map()
const chatContexts = new Map()
const wsClientsByOrg = new Map()

const dashboardChatState = new Map()
const conversationMessagesState = new Map()
const crmDashboardState = new Map()
const crmDealsKanbanState = new Map()

const COMPANY_ROOT_ID = 'company-root'
const PERSONAL_ROOT_ID = 'personal-root'
const SHARED_ROOT_ID = 'shared-root'
const ROOT_TYPES = new Set(['company', 'personal', 'shared'])

const COMPANY_ROOT_NAME = 'Tài liệu công ty'
const PERSONAL_ROOT_NAME = 'Tài liệu cá nhân'
const SHARED_ROOT_NAME = 'Tài liệu được chia sẻ với tôi'

let idCounter = 1

function nextId() {
  idCounter += 1
  return String(idCounter)
}

function bytesToMB(value) {
  return Number((value / (1024 * 1024)).toFixed(2))
}

function getPlan(planRaw) {
  const plan = String(planRaw ?? '').toLowerCase()
  return PLAN_LIMITS[plan] ? plan : null
}

function getOrCreateOrg(orgId) {
  if (!orgState.has(orgId)) {
    orgState.set(orgId, {
      usedBytes: 0,
      files: [],
    })
  }
  return orgState.get(orgId)
}

function serializeLimit(plan) {
  const limit = PLAN_LIMITS[plan]
  return {
    plan,
    maxFileSizeMB: bytesToMB(limit.maxFileSizeBytes),
    maxFilesPerUpload: limit.maxFilesPerUpload,
    maxStorageGB: Number.isFinite(limit.maxStorageBytes)
      ? Number((limit.maxStorageBytes / (1024 * 1024 * 1024)).toFixed(2))
      : null,
    hardFileLimitMB: bytesToMB(HARD_FILE_LIMIT_BYTES),
  }
}

function decodeBase64Url(input) {
  try {
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
    return Buffer.from(normalized, 'base64').toString('utf8')
  } catch {
    return ''
  }
}

function getAuthContext(req) {
  const authorization = req.headers.authorization ?? ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''
  const defaultContext = {
    orgId: String(req.query.org_id ?? req.body?.org_id ?? 'demo-org'),
    role: String(req.query.role ?? req.body?.role ?? 'admin'),
    userId: 'demo-user',
  }

  if (!token.includes('.')) {
    return defaultContext
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    return defaultContext
  }

  try {
    const payloadText = decodeBase64Url(parts[1])
    const payload = JSON.parse(payloadText)
    return {
      orgId: String(payload.org_id ?? payload.orgId ?? defaultContext.orgId),
      role: String(payload.role ?? defaultContext.role),
      userId: String(payload.sub ?? payload.user_id ?? defaultContext.userId),
    }
  } catch {
    return defaultContext
  }
}

function getAuthContextFromToken(tokenRaw, fallbackOrgId = 'demo-org') {
  const token = String(tokenRaw ?? '')
  if (!token.includes('.')) {
    return {
      orgId: fallbackOrgId,
      role: 'admin',
      userId: 'demo-user',
    }
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    return {
      orgId: fallbackOrgId,
      role: 'admin',
      userId: 'demo-user',
    }
  }

  try {
    const payloadText = decodeBase64Url(parts[1])
    const payload = JSON.parse(payloadText)
    return {
      orgId: String(payload.org_id ?? payload.orgId ?? fallbackOrgId),
      role: String(payload.role ?? 'admin'),
      userId: String(payload.sub ?? payload.user_id ?? 'demo-user'),
    }
  } catch {
    return {
      orgId: fallbackOrgId,
      role: 'admin',
      userId: 'demo-user',
    }
  }
}

function sendApiError(res, error) {
  console.error(error)
  const message = String(error?.message ?? '')
  if (message.includes('DATABASE_URL')) {
    res.status(500).json({ message: 'DATABASE_URL is missing. Please configure PostgreSQL connection in .env' })
    return
  }
  res.status(500).json({ message: 'Internal server error' })
}

function nowIso() {
  return new Date().toISOString()
}

function createFolderNode(name, parentId = null, extra = {}) {
  return {
    id: nextId(),
    name,
    type: 'folder',
    parent_id: parentId,
    children: [],
    documents_count: 0,
    status: 'approved',
    has_content: true,
    updated_at: nowIso(),
    ...extra,
  }
}

function createDocumentNode(name, parentId, status = 'approved') {
  return {
    id: nextId(),
    name,
    type: 'document',
    parent_id: parentId,
    children: [],
    documents_count: 0,
    status,
    has_content: status === 'approved',
    updated_at: nowIso(),
  }
}

function seedLibraryTree() {
  const companyRoot = createFolderNode(COMPANY_ROOT_NAME, null, {
    id: COMPANY_ROOT_ID,
    root_type: 'company',
    workspace_type: 'company',
    is_system: true,
  })
  const personalRoot = createFolderNode(PERSONAL_ROOT_NAME, null, {
    id: PERSONAL_ROOT_ID,
    root_type: 'personal',
    workspace_type: 'personal',
    is_system: true,
  })
  const sharedRoot = createFolderNode(SHARED_ROOT_NAME, null, {
    id: SHARED_ROOT_ID,
    root_type: 'shared',
    workspace_type: 'shared',
    is_system: true,
  })

  const sales = createFolderNode('Sales Playbook', companyRoot.id)
  const onboarding = createFolderNode('Onboarding', companyRoot.id)
  const scripts = createFolderNode('Call Scripts', companyRoot.id)
  const companyOverview = createFolderNode('Company Overview', companyRoot.id)
  const policy = createFolderNode('Policy', companyRoot.id)
  const nested = createFolderNode('Q2 Documents', scripts.id)
  const personalNotes = createFolderNode('Ghi chú cá nhân', personalRoot.id)
  const sharedDocs = createFolderNode('Tài liệu dự án chung', sharedRoot.id)

  const nodes = [
    companyRoot,
    personalRoot,
    sharedRoot,
    sales,
    onboarding,
    scripts,
    companyOverview,
    policy,
    nested,
    createDocumentNode('Company Overview.pdf', companyOverview.id, 'approved'),
    createDocumentNode('New Joiner Checklist.docx', onboarding.id, 'approved'),
    createDocumentNode('Cold Call Script.md', scripts.id, 'approved'),
    createDocumentNode('Quarterly Pricing.docx', nested.id, 'draft'),
    createDocumentNode('Security Policy.pdf', policy.id, 'pending'),
    personalNotes,
    createDocumentNode('Ke hoach cong viec tuan.md', personalNotes.id, 'approved'),
    sharedDocs,
    createDocumentNode('Project Charter.pdf', sharedDocs.id, 'approved'),
  ]

  return nodes
}

function findNodeById(nodes, nodeId) {
  return nodes.find((node) => node.id === nodeId) ?? null
}

function isNodeUnderRoot(nodes, nodeId, rootId) {
  let current = findNodeById(nodes, nodeId)
  while (current) {
    if (current.id === rootId) {
      return true
    }
    if (!current.parent_id) {
      return false
    }
    current = findNodeById(nodes, current.parent_id)
  }
  return false
}

function getRootByType(nodes, rootType) {
  if (rootType === 'company') {
    return findNodeById(nodes, COMPANY_ROOT_ID)
  }
  if (rootType === 'personal') {
    return findNodeById(nodes, PERSONAL_ROOT_ID)
  }
  if (rootType === 'shared') {
    return findNodeById(nodes, SHARED_ROOT_ID)
  }
  return null
}

function ensureLibraryRoots(library) {
  const nodes = library.nodes
  let companyRoot = findNodeById(nodes, COMPANY_ROOT_ID)
  let personalRoot = findNodeById(nodes, PERSONAL_ROOT_ID)
  let sharedRoot = findNodeById(nodes, SHARED_ROOT_ID)

  if (!companyRoot) {
    companyRoot = createFolderNode(COMPANY_ROOT_NAME, null, {
      id: COMPANY_ROOT_ID,
      root_type: 'company',
      workspace_type: 'company',
      is_system: true,
    })
    nodes.push(companyRoot)
  } else {
    companyRoot.name = COMPANY_ROOT_NAME
    companyRoot.parent_id = null
    companyRoot.type = 'folder'
    companyRoot.root_type = 'company'
    companyRoot.workspace_type = 'company'
    companyRoot.is_system = true
  }

  if (!personalRoot) {
    personalRoot = createFolderNode(PERSONAL_ROOT_NAME, null, {
      id: PERSONAL_ROOT_ID,
      root_type: 'personal',
      workspace_type: 'personal',
      is_system: true,
    })
    nodes.push(personalRoot)
  } else {
    personalRoot.name = PERSONAL_ROOT_NAME
    personalRoot.parent_id = null
    personalRoot.type = 'folder'
    personalRoot.root_type = 'personal'
    personalRoot.workspace_type = 'personal'
    personalRoot.is_system = true
  }

  if (!sharedRoot) {
    sharedRoot = createFolderNode(SHARED_ROOT_NAME, null, {
      id: SHARED_ROOT_ID,
      root_type: 'shared',
      workspace_type: 'shared',
      is_system: true,
    })
    nodes.push(sharedRoot)
  } else {
    sharedRoot.name = SHARED_ROOT_NAME
    sharedRoot.parent_id = null
    sharedRoot.type = 'folder'
    sharedRoot.root_type = 'shared'
    sharedRoot.workspace_type = 'shared'
    sharedRoot.is_system = true
  }

  // Migration: move all orphan nodes under company system root.
  for (const node of nodes) {
    if (!node.parent_id && node.id !== COMPANY_ROOT_ID && node.id !== PERSONAL_ROOT_ID && node.id !== SHARED_ROOT_ID) {
      node.parent_id = COMPANY_ROOT_ID
    }
  }
}

function getOrCreateLibraryState(orgId) {
  if (!orgLibraryState.has(orgId)) {
    orgLibraryState.set(orgId, {
      nodes: seedLibraryTree(),
    })
  }
  const library = orgLibraryState.get(orgId)
  ensureLibraryRoots(library)
  return library
}

function getOrCreateDashboardChats(orgId) {
  if (!dashboardChatState.has(orgId)) {
    dashboardChatState.set(orgId, [
      {
        id: 'chat-1',
        title: 'Phân tích báo giá Q2',
        lastQuestion: 'Hãy tóm tắt 3 điểm chính để gửi khách hàng.',
        messageCount: 32,
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
      {
        id: 'chat-2',
        title: 'So sánh hợp đồng A và B',
        lastQuestion: 'Nội dung thanh toán khác nhau như thế nào?',
        messageCount: 18,
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        pinned: true,
      },
      {
        id: 'chat-3',
        title: 'Gợi ý email follow-up',
        lastQuestion: 'Cho mình bản email ngắn gọn, lịch sự.',
        messageCount: 12,
        updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
      {
        id: 'chat-4',
        title: 'Tổng hợp chính sách đổi trả',
        lastQuestion: 'Tạo 5 FAQ ngắn gọn cho team sales.',
        messageCount: 9,
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
      {
        id: 'chat-5',
        title: 'Checklist onboarding',
        lastQuestion: 'Cần thêm bước nào để giảm sai sót?',
        messageCount: 15,
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        pinned: false,
      },
    ])
  }

  return dashboardChatState.get(orgId)
}

function seedCrmDashboard() {
  return {
    kpis: [
      {
        id: 'leads-new',
        label: 'Leads moi',
        value: '24',
        trend: 'up',
        changeText: '+12%',
        tone: 'brand',
      },
      {
        id: 'deals-tracked',
        label: 'Deal theo doi',
        value: '8',
        trend: 'up',
        changeText: '+5%',
        tone: 'success',
      },
      {
        id: 'tasks-today',
        label: 'Cong viec hom nay',
        value: '11',
        trend: 'up',
        changeText: 'Han chot 18:00',
        tone: 'warning',
      },
      {
        id: 'conversion-rate',
        label: 'Ty le chuyen doi',
        value: '32%',
        trend: 'down',
        changeText: '-2%',
        tone: 'error',
      },
    ],
    pipeline: [
      { id: 'new', name: 'New', count: 3, percent: 60, value: '450tr VND', tone: 'brand' },
      { id: 'qualified', name: 'Qualified', count: 2, percent: 40, value: '820tr VND', tone: 'brand' },
      { id: 'proposal', name: 'Proposal', count: 1, percent: 25, value: '300tr VND', tone: 'warning' },
      { id: 'negotiation', name: 'Negotiation', count: 1, percent: 20, value: '280tr VND', tone: 'warning' },
      { id: 'won', name: 'Won', count: 1, percent: 100, value: '550tr VND', tone: 'success' },
    ],
    tasks: [
      { id: 'task-1', title: 'Gui bao gia cho Cong ty ABC', meta: 'Truoc 10:30 · Quan trong', done: false },
      { id: 'task-2', title: 'Goi dien xac nhan lich hen voi Mr. Tung', meta: 'Truoc 14:00', done: false },
      { id: 'task-3', title: 'Cap nhat tai lieu ky thuat cho deal TechPro', meta: 'Truoc 16:30', done: false },
    ],
  }
}

function getOrCreateCrmDashboard(orgId) {
  if (!crmDashboardState.has(orgId)) {
    crmDashboardState.set(orgId, seedCrmDashboard())
  }
  return crmDashboardState.get(orgId)
}

function seedCrmDealsKanban() {
  return {
    selectedPipeline: 'Ban hang B2B',
    kpis: [
      { label: 'Tong deal dang mo', value: '124' },
      { label: 'Doanh thu du kien', value: '4.8 ty' },
      { label: 'Ty le chuyen doi', value: '28%', valueClass: 'text-primary-500' },
      { label: 'Deal sap het han', value: '7', valueClass: 'text-error-500' },
    ],
    columns: [
      {
        id: 'new',
        name: 'Moi',
        color: '#6B7280',
        total: '₫ 1.2B',
        cards: [
          {
            id: 'card-1',
            title: 'Trien khai ERP Giai doan 1',
            company: 'Cong ty CP TechNova',
            value: '₫ 450.000.000',
            source: 'WEBSITE',
            aiScore: 92,
            daysLeft: '3 ngay',
            assignees: [1],
            hasActions: true,
          },
          {
            id: 'card-ai-1',
            title: 'Goi tu van Chuyen doi so',
            company: 'Logistics Global JSC',
            value: '₫ 820.000.000',
            source: 'INBOUND',
            aiScore: 98,
            isAiSuggested: true,
            aiNote: 'Khach hang vua xem bao gia',
            assignees: [1],
          },
        ],
      },
      {
        id: 'preparing',
        name: 'Dang chuan bi',
        color: '#3B82F6',
        total: '₫ 2.1B',
        cards: [
          {
            id: 'card-3',
            title: 'Cung cap thiet bi IoT',
            company: 'Nong nghiep Xanh',
            value: '₫ 250.000.000',
            source: 'DIRECT',
            daysLeft: 'Tre 2 ngay',
            statusClass: 'text-error-500',
            assignees: [1],
          },
        ],
      },
      {
        id: 'contacted',
        name: 'Da lien he',
        color: '#06B6D4',
        total: '₫ 3.4B',
        cards: [],
      },
      {
        id: 'negotiating',
        name: 'Dam phan',
        color: '#F59E0B',
        total: '₫ 850M',
        cards: [],
      },
      {
        id: 'quoted',
        name: 'Bao gia',
        color: '#8B5CF6',
        total: '₫ 1.1B',
        cards: [],
      },
      {
        id: 'won',
        name: 'Thang',
        color: '#10B981',
        total: '₫ 3.5B',
        cards: [
          {
            id: 'card-won-1',
            title: 'He thong Quan ly Nhan su',
            company: 'Tap doan Vingroup',
            value: '₫ 2.100.000.000',
            source: 'PROJECT',
            aiScore: 95,
            statusLabel: 'Da chot',
            statusClass: 'text-success-500',
            assignees: [1],
            isWon: true,
          },
          {
            id: 'card-won-2',
            title: 'Bao tri ha tang Network',
            company: 'FPT Software',
            value: '₫ 750.000.000',
            source: 'SERVICE',
            aiScore: 88,
            statusLabel: 'Thanh cong',
            statusClass: 'text-success-500',
            isWon: true,
          },
        ],
      },
      {
        id: 'lost',
        name: 'Thua',
        color: '#EF4444',
        total: '₫ 120M',
        cards: [
          {
            id: 'card-lost-1',
            title: 'Landing Page Marketing',
            company: 'Shopify VN',
            value: '₫ 120.000.000',
            source: 'WEBSITE',
            statusLabel: 'Gia cao',
            statusClass: 'text-error-500',
            isLost: true,
            lostReason: 'Mat vao tay doi thu B',
          },
        ],
      },
    ],
  }
}

function getOrCreateCrmDealsKanban(orgId) {
  if (!crmDealsKanbanState.has(orgId)) {
    crmDealsKanbanState.set(orgId, seedCrmDealsKanban())
  }
  return crmDealsKanbanState.get(orgId)
}

function parseMoneyValueToNumber(value) {
  const digits = String(value ?? '').replace(/[^0-9]/g, '')
  if (!digits) {
    return 0
  }
  return Number(digits)
}

function formatMoneyCompactVnd(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '₫ 0'
  }
  if (value >= 1_000_000_000) {
    return `₫ ${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  }
  if (value >= 1_000_000) {
    return `₫ ${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  }
  return `₫ ${value.toLocaleString('vi-VN')}`
}

function isUrgentDeal(card) {
  const value = String(card?.daysLeft ?? '').toLowerCase()
  return value.includes('trễ') || value.includes('tre') || value.includes('ngày') || value.includes('ngay')
}

function buildCrmDealsKanbanResponse(kanban) {
  const columns = kanban.columns.map((column) => {
    const totalValue = column.cards.reduce((sum, card) => sum + parseMoneyValueToNumber(card.value), 0)
    return {
      ...column,
      total: formatMoneyCompactVnd(totalValue),
    }
  })

  const allCards = columns.flatMap((column) => column.cards)
  const wonCards = columns.find((column) => column.id === 'won')?.cards ?? []
  const lostCards = columns.find((column) => column.id === 'lost')?.cards ?? []
  const openCards = allCards.filter((card) => !card.isWon && !card.isLost)
  const openRevenue = openCards.reduce((sum, card) => sum + parseMoneyValueToNumber(card.value), 0)
  const urgentCount = openCards.filter((card) => isUrgentDeal(card)).length
  const resolvedCount = wonCards.length + lostCards.length
  const winRate = resolvedCount > 0 ? Math.round((wonCards.length / resolvedCount) * 100) : 0

  return {
    selectedPipeline: kanban.selectedPipeline,
    kpis: [
      { label: 'Tổng deal đang mở', value: String(openCards.length) },
      { label: 'Doanh thu dự kiến', value: formatMoneyCompactVnd(openRevenue) },
      { label: 'Tỷ lệ chuyển đổi', value: `${winRate}%`, valueClass: 'text-primary-500' },
      { label: 'Deal sắp hết hạn', value: String(urgentCount), valueClass: 'text-error-500' },
    ],
    columns,
  }
}

function getOrCreateConversationMessages(conversationId) {
  if (!conversationMessagesState.has(conversationId)) {
    const messages = [
      {
        id: `msg-${conversationId}-1`,
        conversationId,
        role: 'user',
        content: 'Phân tích ba điểm chính trong báo giá Q2 này',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
      {
        id: `msg-${conversationId}-2`,
        conversationId,
        role: 'assistant',
        content:
          'Dựa trên báo giá Q2, ba điểm chính là:\n\n1. **Giá cạnh tranh**: Mức giá được điều chỉnh dựa trên phân tích thị trường\n2. **Điều khoản thanh toán**: Hỗ trợ linh hoạt với nhiều kỳ hạn\n3. **Khối lượng tối thiểu**: Được giảm so với quý trước để thu hút khách hàng mới',
        createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      },
      {
        id: `msg-${conversationId}-3`,
        conversationId,
        role: 'user',
        content: 'Hãy tạo một email tóm tắt để gửi cho khách hàng',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      },
      {
        id: `msg-${conversationId}-4`,
        conversationId,
        role: 'assistant',
        content: `Kính gửi [Tên Khách hàng],\n\nChúng tôi rất vui được gửi cho bạn báo giá đặc biệt cho Quý II/2026. Báo giá này được tối ưu hóa dựa trên nhu cầu kinh doanh của bạn.\n\nCác điểm nổi bật:\n- Giá cạnh tranh với thị trường\n- Điều khoản thanh toán linh hoạt\n- Khối lượng tối thiểu cạnh tranh\n\nChúng tôi mong chờ cơ hội hợp tác với bạn.\n\nTrân trọng,\n[Tên Của Bạn]`,
        createdAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      },
    ]

    conversationMessagesState.set(conversationId, messages)
  }

  return conversationMessagesState.get(conversationId)
}

function canAccessNode(node, role) {
  if (node.type === 'folder') {
    return true
  }

  if (role === 'admin' || role === 'editor') {
    return true
  }

  return node.status === 'approved'
}

function cloneNode(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    parent_id: node.parent_id,
    children: [],
    documents_count: 0,
    status: node.status,
    has_content: node.has_content,
    updated_at: node.updated_at,
    ...(node.is_system ? { is_system: true } : {}),
    ...(node.root_type ? { root_type: node.root_type } : {}),
    ...(node.workspace_type ? { workspace_type: node.workspace_type } : {}),
  }
}

function buildChildrenIndex(nodes) {
  const map = new Map()
  for (const node of nodes) {
    const parentId = node.parent_id ?? '__root__'
    if (!map.has(parentId)) {
      map.set(parentId, [])
    }
    map.get(parentId).push(node)
  }
  return map
}

function countDocumentsRecursive(node, childrenMap, role) {
  if (node.type === 'document') {
    return canAccessNode(node, role) ? 1 : 0
  }

  const children = childrenMap.get(node.id) ?? []
  return children.reduce((sum, child) => sum + countDocumentsRecursive(child, childrenMap, role), 0)
}

function generateAiResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase()
  
  if (lowerMessage.includes('báo giá') || lowerMessage.includes('gia')) {
    return `Dựa trên báo giá của bạn, dưới đây là những điểm quan trọng:\n\n1. **Giá cạnh tranh**: Mức giá được thiết lập dựa trên phân tích thị trường hiện tại\n2. **Điều khoản thanh toán**: Hỗ trợ thanh toán linh hoạt với các kỳ hạn khác nhau\n3. **Khối lượng tối thiểu**: Được điều chỉnh để phù hợp với nhu cầu kinh doanh\n\nBạn có muốn tôi giải thích thêm về bất kỳ điểm nào?`
  }
  
  if (lowerMessage.includes('email') || lowerMessage.includes('gửi')) {
    return `Tôi sẽ giúp bạn soạn email chuyên nghiệp:\n\nKính gửi [Tên khách hàng],\n\nChúng tôi xin được gửi đến bạn báo giá đặc biệt cho Quý II/2026. Báo giá này được tối ưu hóa dựa trên nhu cầu kinh doanh của bạn.\n\nCác điểm nổi bật:\n- Giá cạnh tranh với thị trường\n- Điều khoản thanh toán linh hoạt\n- Khối lượng tối thiểu cạnh tranh\n\nChúng tôi rất mong chờ cơ hội hợp tác với bạn. Vui lòng liên hệ nếu có bất kỳ câu hỏi nào.\n\nTrân trọng,\n[Tên của bạn]`
  }
  
  if (lowerMessage.includes('phân tích') || lowerMessage.includes('so sánh')) {
    return `Tôi sẽ phân tích chi tiết cho bạn:\n\n**Điểm tương đồng:**\n- Cả hai đều có điều khoản thanh toán linh hoạt\n- Cùng mức giá cạnh tranh\n\n**Điểm khác biệt:**\n- Hợp đồng A có thời hạn 12 tháng\n- Hợp đồng B có thời hạn 6 tháng (linh hoạt hơn)\n- Hợp đồng B có hỗ trợ kỹ thuật 24/7\n\nTôi khuyến nghị chọn hợp đồng B nếu bạn cần tính linh hoạt cao.`
  }
  
  if (lowerMessage.includes('faq') || lowerMessage.includes('câu hỏi') || lowerMessage.includes('thường gặp')) {
    return `Dưới đây là 5 câu hỏi thường gặp:\n\n**1. Chính sách đổi trả?**\nChúng tôi hỗ trợ đổi trả trong vòng 30 ngày.\n\n**2. Thời gian giao hàng?**\nTừ 3-5 ngày làm việc.\n\n**3. Hỗ trợ sau bán hàng?**\nCó hỗ trợ trực tiếp qua điện thoại và email.\n\n**4. Thanh toán như thế nào?**\nChấp nhận chuyển khoản, thẻ tín dụng, hoặc COD.\n\n**5. Được giảm giá không?**\nCó giảm giá cho đơn hàng từ 100 sản phẩm trở lên.`
  }
  
  return `Cảm ơn bạn đã gửi câu hỏi: "${userMessage}"\n\nDựa trên thông tin từ các tài liệu, tôi sẽ cung cấp thông tin chi tiết. Nếu bạn cần làm rõ hơn, vui lòng cung cấp thêm bối cảnh hoặc chọn một tài liệu cụ thể từ thư viện bên trái.\n\nCó điều gì khác tôi có thể giúp bạn?`
}

function toTreeNodes(nodes, childrenMap, role, includeCounts, parentId = null) {
  const parentKey = parentId ?? '__root__'
  const children = childrenMap.get(parentKey) ?? []
  const filteredChildren = children.filter((node) => canAccessNode(node, role))

  return filteredChildren.map((node) => {
    const cloned = cloneNode(node)
    const childNodes = toTreeNodes(nodes, childrenMap, role, includeCounts, node.id)

    // Support lazy loading for large folders.
    if (node.type === 'folder' && childNodes.length > 100) {
      cloned.children = childNodes.slice(0, 100)
      cloned.has_more_children = true
      cloned.total_children = childNodes.length
    } else {
      cloned.children = childNodes
      cloned.has_more_children = false
      cloned.total_children = childNodes.length
    }

    if (includeCounts) {
      cloned.documents_count = countDocumentsRecursive(node, childrenMap, role)
    }

    return cloned
  })
}

function removeNodeRecursive(nodes, nodeId) {
  const childrenIds = nodes.filter((item) => item.parent_id === nodeId).map((item) => item.id)
  for (const childId of childrenIds) {
    removeNodeRecursive(nodes, childId)
  }
  const index = nodes.findIndex((item) => item.id === nodeId)
  if (index >= 0) {
    nodes.splice(index, 1)
  }
}

function addWsClient(orgId, ws) {
  if (!wsClientsByOrg.has(orgId)) {
    wsClientsByOrg.set(orgId, new Set())
  }
  wsClientsByOrg.get(orgId).add(ws)
}

function removeWsClient(orgId, ws) {
  const set = wsClientsByOrg.get(orgId)
  if (!set) {
    return
  }
  set.delete(ws)
  if (set.size === 0) {
    wsClientsByOrg.delete(orgId)
  }
}

function broadcastLibraryEvent(orgId, event, payload) {
  const channel = `library.${orgId}`
  const listeners = wsClientsByOrg.get(orgId)
  if (!listeners || listeners.size === 0) {
    return
  }

  const message = JSON.stringify({ channel, event, payload, emitted_at: nowIso() })

  for (const ws of listeners) {
    if (ws.readyState === 1) {
      ws.send(message)
    }
  }
}

app.get('/api/doc-library/limits', (req, res) => {
  const plan = getPlan(req.query.plan)
  if (!plan) {
    res.status(400).json({
      ok: false,
      error: 'Plan khong hop le. Dung: free, trial, standard, pro, enterprise',
    })
    return
  }

  res.json({
    ok: true,
    data: serializeLimit(plan),
  })
})

app.get('/api/doc-library/orgs/:orgId/storage', (req, res) => {
  const plan = getPlan(req.query.plan)
  if (!plan) {
    res.status(400).json({
      ok: false,
      error: 'Plan khong hop le. Dung: free, trial, standard, pro, enterprise',
    })
    return
  }

  const orgId = req.params.orgId
  const org = getOrCreateOrg(orgId)
  const planLimit = PLAN_LIMITS[plan]

  const maxStorageBytes = planLimit.maxStorageBytes
  const remainingBytes = Number.isFinite(maxStorageBytes)
    ? Math.max(0, maxStorageBytes - org.usedBytes)
    : Number.POSITIVE_INFINITY

  res.json({
    ok: true,
    data: {
      orgId,
      plan,
      usedStorageMB: bytesToMB(org.usedBytes),
      remainingStorageMB: Number.isFinite(remainingBytes) ? bytesToMB(remainingBytes) : null,
      maxStorageMB: Number.isFinite(maxStorageBytes) ? bytesToMB(maxStorageBytes) : null,
      totalFiles: org.files.length,
    },
  })
})

app.post('/api/doc-library/upload', upload.array('files'), (req, res) => {
  const plan = getPlan(req.body.plan)
  const orgId = String(req.body.orgId ?? '').trim()

  if (!plan) {
    res.status(400).json({
      ok: false,
      error: 'Plan khong hop le. Dung: free, trial, standard, pro, enterprise',
    })
    return
  }

  if (!orgId) {
    res.status(400).json({
      ok: false,
      error: 'Thieu orgId',
    })
    return
  }

  const files = Array.isArray(req.files) ? req.files : []
  if (files.length === 0) {
    res.status(400).json({
      ok: false,
      error: 'Khong co file nao duoc gui len',
    })
    return
  }

  const limit = PLAN_LIMITS[plan]

  if (files.length > limit.maxFilesPerUpload) {
    res.status(413).json({
      ok: false,
      code: 'UPLOAD_FILE_COUNT_LIMIT_EXCEEDED',
      error: `Gioi han ${limit.maxFilesPerUpload} file/lan upload cho plan ${plan}`,
      details: {
        uploadedFileCount: files.length,
        maxFilesPerUpload: limit.maxFilesPerUpload,
      },
    })
    return
  }

  for (const file of files) {
    if (file.size > HARD_FILE_LIMIT_BYTES) {
      res.status(413).json({
        ok: false,
        code: 'UPLOAD_HARD_FILE_LIMIT_EXCEEDED',
        error: 'File vuot hard limit 1GB cua he thong',
        details: {
          fileName: file.originalname,
          fileSizeMB: bytesToMB(file.size),
          hardFileLimitMB: bytesToMB(HARD_FILE_LIMIT_BYTES),
        },
      })
      return
    }

    if (file.size > limit.maxFileSizeBytes) {
      res.status(413).json({
        ok: false,
        code: 'UPLOAD_PLAN_FILE_SIZE_LIMIT_EXCEEDED',
        error: `Plan ${plan} chi cho phep toi da ${bytesToMB(limit.maxFileSizeBytes)} MB/file`,
        details: {
          fileName: file.originalname,
          fileSizeMB: bytesToMB(file.size),
          planFileSizeLimitMB: bytesToMB(limit.maxFileSizeBytes),
        },
      })
      return
    }
  }

  const org = getOrCreateOrg(orgId)
  const uploadBytes = files.reduce((sum, file) => sum + file.size, 0)

  if (Number.isFinite(limit.maxStorageBytes) && org.usedBytes + uploadBytes > limit.maxStorageBytes) {
    res.status(413).json({
      ok: false,
      code: 'UPLOAD_ORG_STORAGE_QUOTA_EXCEEDED',
      error: `Vuot tong storage cua org theo plan ${plan}`,
      details: {
        orgId,
        currentUsedMB: bytesToMB(org.usedBytes),
        uploadBatchMB: bytesToMB(uploadBytes),
        maxStorageMB: bytesToMB(limit.maxStorageBytes),
      },
    })
    return
  }

  const now = nowIso()
  const acceptedFiles = files.map((file) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
    const fileRecord = {
      id,
      name: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      uploadedAt: now,
      status: 'queued_for_rag_pipeline',
    }

    org.files.push(fileRecord)
    return {
      id: fileRecord.id,
      name: fileRecord.name,
      mimeType: fileRecord.mimeType,
      sizeMB: bytesToMB(fileRecord.sizeBytes),
      uploadedAt: fileRecord.uploadedAt,
      status: fileRecord.status,
    }
  })

  org.usedBytes += uploadBytes

  res.status(201).json({
    ok: true,
    data: {
      orgId,
      plan,
      acceptedCount: acceptedFiles.length,
      files: acceptedFiles,
      quota: {
        usedStorageMB: bytesToMB(org.usedBytes),
        remainingStorageMB: Number.isFinite(limit.maxStorageBytes)
          ? bytesToMB(Math.max(0, limit.maxStorageBytes - org.usedBytes))
          : null,
        maxStorageMB: Number.isFinite(limit.maxStorageBytes)
          ? bytesToMB(limit.maxStorageBytes)
          : null,
      },
    },
  })
})

app.delete('/api/doc-library/orgs/:orgId/files/:fileId', (req, res) => {
  const org = orgState.get(req.params.orgId)
  if (!org) {
    res.status(404).json({ ok: false, error: 'Khong tim thay org' })
    return
  }

  const idx = org.files.findIndex((f) => f.id === req.params.fileId)
  if (idx < 0) {
    res.status(404).json({ ok: false, error: 'Khong tim thay file' })
    return
  }

  const [removed] = org.files.splice(idx, 1)
  org.usedBytes = Math.max(0, org.usedBytes - removed.sizeBytes)

  res.json({
    ok: true,
    data: {
      orgId: req.params.orgId,
      fileId: removed.id,
      removedSizeMB: bytesToMB(removed.sizeBytes),
      usedStorageMB: bytesToMB(org.usedBytes),
    },
  })
})

app.get('/api/v1/library/tree', (req, res) => {
  const auth = getAuthContext(req)
  const includeCounts = String(req.query.include_counts ?? 'false') === 'true'
  const parentId = req.query.parent_id ? String(req.query.parent_id) : null
  const rootTypeRaw = req.query.root_type ? String(req.query.root_type) : null
  const rootType = rootTypeRaw && ROOT_TYPES.has(rootTypeRaw) ? rootTypeRaw : null
  const library = getOrCreateLibraryState(auth.orgId)
  const childrenMap = buildChildrenIndex(library.nodes)
  const sourceParentId = rootType && !parentId ? getRootByType(library.nodes, rootType)?.id ?? null : parentId
  const tree = toTreeNodes(library.nodes, childrenMap, auth.role, includeCounts, sourceParentId)

  // When fetching the full root (no parentId filter), always ensure system roots come first
  if (!parentId && !rootType) {
    tree.sort((a, b) => {
      const aSystem = a.is_system ? 0 : 1
      const bSystem = b.is_system ? 0 : 1
      if (aSystem !== bSystem) return aSystem - bSystem
      // company root before personal root
      if (a.id === COMPANY_ROOT_ID) return -1
      if (b.id === COMPANY_ROOT_ID) return 1
      return 0
    })
  }

  res.json(tree)
})

// Chat Endpoints
app.get('/api/chat/conversations', (req, res) => {
  const auth = getAuthContext(req)
  const chats = getOrCreateDashboardChats(auth.orgId)
  const conversations = chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    updatedAt: chat.updatedAt,
  }))

  res.json(conversations)
})

app.get('/api/chat/conversations/:conversationId/messages', (req, res) => {
  const conversationId = String(req.params.conversationId)
  const messages = getOrCreateConversationMessages(conversationId)

  res.json(messages)
})

app.post('/api/chat/conversations/:conversationId/messages', (req, res) => {
  const conversationId = String(req.params.conversationId)
  const { message } = req.body ?? {}
  const messageText = String(message ?? '').trim()

  if (!messageText) {
    res.status(400).json({ ok: false, error: 'Message is required' })
    return
  }

  const messages = getOrCreateConversationMessages(conversationId)

  // Add user message
  const userMessage = {
    id: `msg-${conversationId}-${Date.now()}-user`,
    conversationId,
    role: 'user',
    content: messageText,
    createdAt: nowIso(),
  }

  messages.push(userMessage)

  // Generate AI response based on user message
  const aiResponse = generateAiResponse(messageText)
  const assistantMessage = {
    id: `msg-${conversationId}-${Date.now()}-ai`,
    conversationId,
    role: 'assistant',
    content: aiResponse,
    createdAt: nowIso(),
  }

  messages.push(assistantMessage)

  res.status(201).json({
    conversationId,
    assistantMessage,
    message: assistantMessage,
  })
})

app.post('/api/chat/stream', (req, res) => {
  const { conversationId, message } = req.body ?? {}
  const messageText = String(message ?? '').trim()

  if (!conversationId || !messageText) {
    res.status(400).json({ ok: false, error: 'conversationId and message are required' })
    return
  }

  const messages = getOrCreateConversationMessages(conversationId)

  // Add user message
  const userMessage = {
    id: `msg-${conversationId}-${Date.now()}-user`,
    conversationId,
    role: 'user',
    content: messageText,
    createdAt: nowIso(),
  }

  messages.push(userMessage)

  // Generate AI response
  const responseText = generateAiResponse(messageText)

  // Save AI message
  const assistantMessage = {
    id: `msg-${conversationId}-${Date.now()}-ai`,
    conversationId,
    role: 'assistant',
    content: responseText,
    createdAt: nowIso(),
  }

  messages.push(assistantMessage)

  // Stream AI response
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Simulate streaming response with delays
  let charIndex = 0
  const streamInterval = setInterval(() => {
    if (charIndex >= responseText.length) {
      clearInterval(streamInterval)
      res.write('data: {"type":"done"}\n\n')
      res.end()
      return
    }

    const chunk = responseText[charIndex]
    res.write(`data: {"delta":"${chunk.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"}\n\n`)
    charIndex++
  }, 15)

  req.on('close', () => {
    clearInterval(streamInterval)
  })
})

app.get('/api/v1/library/documents', (req, res) => {
  const auth = getAuthContext(req)
  const limit = Number(req.query.limit ?? 5)
  const library = getOrCreateLibraryState(auth.orgId)

  const items = library.nodes
    .filter((node) => node.type === 'document')
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, Number.isFinite(limit) ? limit : 5)
    .map((node, index) => ({
      id: node.id,
      name: node.name,
      format: extractFormat(node.name),
      sizeBytes: 1024 * 100 * (index + 1),
      uploadedBy: `u-${index + 1}`,
      uploadedByName: `User ${index + 1}`,
      createdAt: node.updated_at,
    }))

  res.json({ items })
})

app.post('/api/v1/library/folders', (req, res) => {
  const auth = getAuthContext(req)
  const { name, parent_id: parentIdRaw, root_type: rootTypeRaw } = req.body ?? {}
  const nameText = String(name ?? '').trim()
  const rootType = rootTypeRaw ? String(rootTypeRaw) : null

  if (!nameText) {
    res.status(400).json({ message: 'Folder name is required' })
    return
  }

  if (rootType && !ROOT_TYPES.has(rootType)) {
    res.status(400).json({ message: 'root_type must be company or personal' })
    return
  }

  let parentId = parentIdRaw ? String(parentIdRaw) : null
  const library = getOrCreateLibraryState(auth.orgId)
  const scopedRoot = rootType ? getRootByType(library.nodes, rootType) : null

  if (rootType && !scopedRoot) {
    res.status(404).json({ message: 'Root folder not found' })
    return
  }

  if (!parentId && scopedRoot) {
    parentId = scopedRoot.id
  }

  if (parentId && !library.nodes.some((node) => node.id === parentId && node.type === 'folder')) {
    res.status(404).json({ message: 'Parent folder not found' })
    return
  }

  if (scopedRoot && parentId && !isNodeUnderRoot(library.nodes, parentId, scopedRoot.id)) {
    res.status(400).json({ message: 'Parent folder must be inside selected root_type' })
    return
  }

  const folder = createFolderNode(nameText, parentId)
  library.nodes.push(folder)

  broadcastLibraryEvent(auth.orgId, 'folder.created', {
    id: folder.id,
    name: folder.name,
    parent_id: folder.parent_id,
  })

  res.status(201).json(folder)
})

app.post('/api/v1/library/documents', upload.single('file'), (req, res) => {
  const auth = getAuthContext(req)
  const title = String(req.body?.title ?? '').trim()
  let parentId = req.body?.parent_id ? String(req.body.parent_id) : null
  const rootType = req.body?.root_type ? String(req.body.root_type) : null
  const file = req.file ?? null
  const library = getOrCreateLibraryState(auth.orgId)

  if (rootType && !ROOT_TYPES.has(rootType)) {
    res.status(400).json({ message: 'root_type must be company or personal' })
    return
  }

  const scopedRoot = rootType ? getRootByType(library.nodes, rootType) : null
  if (!parentId && scopedRoot) {
    parentId = scopedRoot.id
  }

  if (!title) {
    res.status(400).json({ message: 'Document title is required' })
    return
  }

  if (parentId && !library.nodes.some((node) => node.id === parentId && node.type === 'folder')) {
    res.status(404).json({ message: 'Parent folder not found' })
    return
  }

  if (scopedRoot && parentId && !isNodeUnderRoot(library.nodes, parentId, scopedRoot.id)) {
    res.status(400).json({ message: 'Parent folder must be inside selected root_type' })
    return
  }

  const document = createDocumentNode(title, parentId, 'approved')
  library.nodes.push(document)

  broadcastLibraryEvent(auth.orgId, 'document.created', {
    id: document.id,
    name: document.name,
    parent_id: document.parent_id,
    file_name: file?.originalname ?? null,
    file_size_bytes: file?.size ?? null,
  })

  res.status(201).json(document)
})

app.delete('/api/v1/library/nodes/:id', (req, res) => {
  const auth = getAuthContext(req)
  const nodeId = String(req.params.id)
  const library = getOrCreateLibraryState(auth.orgId)
  const node = library.nodes.find((item) => item.id === nodeId)

  if (!node) {
    res.status(404).json({ message: 'Node not found' })
    return
  }

  if (node.is_system) {
    res.status(403).json({ message: 'Không thể sửa thư mục hệ thống' })
    return
  }

  removeNodeRecursive(library.nodes, nodeId)

  const event = node.type === 'folder' ? 'folder.deleted' : 'document.deleted'
  broadcastLibraryEvent(auth.orgId, event, { id: nodeId, parent_id: node.parent_id })

  res.json({ ok: true, id: nodeId })
})

app.post('/api/v1/chats/:chatId/context', (req, res) => {
  const auth = getAuthContext(req)
  const chatId = String(req.params.chatId)
  const nodeId = String(req.body?.node_id ?? '')
  const nodeType = String(req.body?.node_type ?? '')
  const library = getOrCreateLibraryState(auth.orgId)

  const node = library.nodes.find((item) => item.id === nodeId && item.type === nodeType)
  if (!node) {
    res.status(404).json({ message: 'Context node not found' })
    return
  }

  const context = {
    chat_id: chatId,
    node_id: node.id,
    node_type: node.type,
    node_name: node.name,
    org_id: auth.orgId,
    updated_at: nowIso(),
  }

  chatContexts.set(chatId, context)
  res.json(context)
})

app.get('/api/v1/chat/dashboard-stats', (req, res) => {
  const auth = getAuthContext(req)
  const library = getOrCreateLibraryState(auth.orgId)
  const chats = getOrCreateDashboardChats(auth.orgId)
  const messages = conversationMessagesState

  const documentCount = library.nodes.filter((node) => node.type === 'document').length
  const newDocsThisWeek = Math.min(documentCount, 12)
  
  // Count total questions answered across all conversations
  let totalQuestionsAnswered = 0
  for (const msgs of messages.values()) {
    const assistantMsgs = msgs.filter((m) => m.role === 'assistant')
    totalQuestionsAnswered += assistantMsgs.length
  }
  
  // Calculate storage used from messages (rough estimate)
  let totalStorageBytes = 0
  for (const msgs of messages.values()) {
    for (const msg of msgs) {
      totalStorageBytes += msg.content.length * 2 // UTF-8 rough estimate
    }
  }
  const storageUsedGB = Number((totalStorageBytes / (1024 * 1024 * 1024)).toFixed(2))

  res.json({
    documentsCount: documentCount,
    newDocumentsThisWeek: newDocsThisWeek,
    sessionsThisMonth: chats.length * 20,
    sessionsPercentChange: 18,
    questionsAnswered: totalQuestionsAnswered,
    avgResponseTime: 2.6,
    storageUsed: storageUsedGB,
    storageLimit: 50,
  })
})

app.get('/api/v1/chats', (req, res) => {
  const auth = getAuthContext(req)
  const limit = Number(req.query.limit ?? 5)
  const chats = getOrCreateDashboardChats(auth.orgId)
  const items = chats
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, Number.isFinite(limit) ? limit : 5)

  res.json({ items })
})

app.post('/api/v1/chats/:chatId/pin', (req, res) => {
  const auth = getAuthContext(req)
  const chats = getOrCreateDashboardChats(auth.orgId)
  const chat = chats.find((item) => item.id === req.params.chatId)
  if (!chat) {
    res.status(404).json({ message: 'Chat not found' })
    return
  }

  chat.pinned = true
  res.json({ ok: true, id: chat.id })
})

app.post('/api/v1/chats/:chatId/delete', (req, res) => {
  const auth = getAuthContext(req)
  const chats = getOrCreateDashboardChats(auth.orgId)
  const index = chats.findIndex((item) => item.id === req.params.chatId)
  if (index < 0) {
    res.status(404).json({ message: 'Chat not found' })
    return
  }

  const [removed] = chats.splice(index, 1)
  res.json({ ok: true, id: removed.id })
})

app.get('/api/v1/chat/ai-suggestions', (req, res) => {
  res.json({
    items: [
      {
        type: 'new_docs',
        title: '3 tài liệu mới chưa đọc',
        description: 'Từ team Marketing tuần này',
        actionUrl: '/chat-tai-lieu/library?filter=unread',
      },
      {
        type: 'deadline',
        title: 'Báo giá ABC sắp hết hạn',
        description: 'Hết hạn 15/05/2026 (còn 10 ngày)',
        actionUrl: '/chat-tai-lieu/chat?context=baogia_abc',
      },
      {
        type: 'trending',
        title: 'Tài liệu Pricing Q2 hot nhất',
        description: 'Được hỏi 24 lần trong tuần',
        actionUrl: '/chat-tai-lieu/library?doc=pricing_q2',
      },
      {
        type: 'reminder',
        title: 'Chưa chat về Deal Vingroup',
        description: '3 tuần qua - review lại?',
        actionUrl: '/chat-tai-lieu/chat?context=deal_vingroup',
      },
    ],
  })
})

app.get('/api/v1/chat/popular-questions', (req, res) => {
  const limit = Number(req.query.limit ?? 5)
  const items = [
    'Chính sách hoàn tiền',
    'Quy trình ký hợp đồng điện tử',
    'Báo giá năm 2026',
    'Hỗ trợ kỹ thuật sau bán hàng',
    'Điều khoản bảo mật dữ liệu',
  ]

  res.json({ items: items.slice(0, Number.isFinite(limit) ? limit : 5) })
})

app.get('/api/v1/crm/dashboard', (req, res) => {
  const auth = getAuthContext(req)
  const dashboard = getOrCreateCrmDashboard(auth.orgId)
  res.json(dashboard)
})

app.put('/api/v1/crm/tasks/:taskId', (req, res) => {
  const auth = getAuthContext(req)
  const taskId = String(req.params.taskId)
  const done = Boolean(req.body?.done)
  const dashboard = getOrCreateCrmDashboard(auth.orgId)

  const task = dashboard.tasks.find((item) => item.id === taskId)
  if (!task) {
    res.status(404).json({ message: 'Task not found' })
    return
  }

  task.done = done
  res.json(task)
})

app.get('/api/v1/crm/deals/kanban', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const kanban = await listDealsForKanban({ orgId: auth.orgId })
    res.json(kanban)
  } catch (error) {
    sendApiError(res, error)
  }
})

app.post('/api/v1/crm/deals', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const title = String(req.body?.title ?? '').trim()
    const stage = String(req.body?.stage ?? '').trim()

    if (!title || !stage || !validateStage(stage)) {
      res.status(400).json({ message: 'title and valid stage are required' })
      return
    }

    const deal = await createDeal({
      orgId: auth.orgId,
      userId: auth.userId,
      payload: {
        ...req.body,
        title,
        stage,
      },
    })

    const kanban = await listDealsForKanban({ orgId: auth.orgId })

    io.to(`org:${auth.orgId}`).emit('deal.created', {
      deal,
      orgId: auth.orgId,
      actorId: auth.userId,
    })

    res.status(201).json({
      card: deal
        ? {
            id: deal.id,
            title: deal.title,
            company: deal.company ?? deal.contact ?? '—',
            value: `₫ ${Number(deal.value).toLocaleString('vi-VN')}`,
            source: (deal.source ?? 'manual').toUpperCase(),
            hasActions: true,
            assignees: [1],
          }
        : null,
      stage,
      kanban,
      deal,
    })
  } catch (error) {
    sendApiError(res, error)
  }
})

app.get('/api/deals', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const result = await listDeals({ orgId: auth.orgId, query: req.query })
    res.json(result)
  } catch (error) {
    sendApiError(res, error)
  }
})

app.post('/api/deals', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const title = String(req.body?.title ?? '').trim()
    if (!title) {
      res.status(400).json({ message: 'title is required' })
      return
    }

    const deal = await createDeal({
      orgId: auth.orgId,
      userId: auth.userId,
      payload: {
        ...req.body,
        title,
      },
    })

    io.to(`org:${auth.orgId}`).emit('deal.created', {
      deal,
      orgId: auth.orgId,
      actorId: auth.userId,
    })

    res.status(201).json(deal)
  } catch (error) {
    sendApiError(res, error)
  }
})

app.get('/api/deals/:id', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const deal = await getDealById({ orgId: auth.orgId, dealId: String(req.params.id) })
    if (!deal) {
      res.status(404).json({ message: 'Deal not found' })
      return
    }
    res.json(deal)
  } catch (error) {
    sendApiError(res, error)
  }
})

app.patch('/api/deals/:id', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const dealId = String(req.params.id)
    const updated = await updateDeal({
      orgId: auth.orgId,
      userId: auth.userId,
      dealId,
      patch: req.body ?? {},
    })

    if (!updated) {
      res.status(404).json({ message: 'Deal not found' })
      return
    }

    io.to(`org:${auth.orgId}`).emit('deal.updated', {
      dealId,
      changes: req.body ?? {},
      newStage: updated.stage,
      actorId: auth.userId,
      deal: updated,
    })

    res.json(updated)
  } catch (error) {
    sendApiError(res, error)
  }
})

app.patch('/api/deals/:id/stage', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const dealId = String(req.params.id)
    const stage = String(req.body?.stage ?? '').trim()

    if (!validateStage(stage)) {
      res.status(400).json({ message: 'Invalid stage' })
      return
    }

    const updated = await updateDealStage({
      orgId: auth.orgId,
      userId: auth.userId,
      dealId,
      stage,
    })

    if (!updated) {
      res.status(404).json({ message: 'Deal not found' })
      return
    }

    io.to(`org:${auth.orgId}`).emit('deal.updated', {
      dealId,
      changes: { stage },
      newStage: stage,
      actorId: auth.userId,
      deal: updated,
    })

    res.json(updated)
  } catch (error) {
    sendApiError(res, error)
  }
})

app.delete('/api/deals/:id', async (req, res) => {
  try {
    const auth = getAuthContext(req)
    const dealId = String(req.params.id)
    const deleted = await deleteDeal({
      orgId: auth.orgId,
      userId: auth.userId,
      dealId,
    })

    if (!deleted) {
      res.status(404).json({ message: 'Deal not found' })
      return
    }

    io.to(`org:${auth.orgId}`).emit('deal.deleted', {
      dealId,
      actorId: auth.userId,
    })

    res.status(204).send()
  } catch (error) {
    sendApiError(res, error)
  }
})

app.get('/api/v1/chats/:chatId/context', (req, res) => {
  const chatId = String(req.params.chatId)
  const context = chatContexts.get(chatId)
  if (!context) {
    res.status(404).json({ message: 'No context for this chat' })
    return
  }
  res.json(context)
})

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      ok: false,
      code: 'UPLOAD_HARD_FILE_LIMIT_EXCEEDED',
      error: 'File vuot hard limit 1GB cua he thong',
      details: {
        hardFileLimitMB: bytesToMB(HARD_FILE_LIMIT_BYTES),
      },
    })
    return
  }

  console.error(err)
  res.status(500).json({
    ok: false,
    error: 'Loi he thong',
  })
})

const server = http.createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  const tokenFromAuth = socket.handshake.auth?.token
  const tokenFromHeader = String(socket.handshake.headers.authorization ?? '').replace(/^Bearer\s+/i, '')
  const token = tokenFromAuth || tokenFromHeader
  const auth = getAuthContextFromToken(token)

  socket.join(`org:${auth.orgId}`)
  socket.join(`user:${auth.userId}`)
  socket.emit('socket.ready', { orgId: auth.orgId, userId: auth.userId })
})

const wsServer = new WebSocketServer({ server, path: '/ws/library' })

wsServer.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const orgId = url.searchParams.get('org_id') ?? 'demo-org'

  addWsClient(orgId, ws)

  ws.send(
    JSON.stringify({
      channel: `library.${orgId}`,
      event: 'connected',
      payload: { org_id: orgId },
      emitted_at: nowIso(),
    }),
  )

  ws.on('close', () => {
    removeWsClient(orgId, ws)
  })
})

server.listen(port, () => {
  console.log(`Doc Library backend running on http://localhost:${port}`)
  console.log(`Library websocket running on ws://localhost:${port}/ws/library?org_id=demo-org`)
})

function extractFormat(filename) {
  const idx = filename.lastIndexOf('.')
  if (idx < 0) {
    return 'file'
  }
  return filename.slice(idx + 1).toLowerCase()
}
