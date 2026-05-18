import { prisma } from './prisma.mjs'

// Fallback khi Prisma chưa generate enum DealStage
const DealStage = {
  new: 'new',
  preparing: 'preparing',
  contacted: 'contacted',
  negotiating: 'negotiating',
  quoted: 'quoted',
  won: 'won',
  lost: 'lost',
}

// ─── In-memory fallback (khi DB chưa sẵn sàng) ────────────────────────────────

const memDeals = new Map()   // orgId → Deal[]

function getMemDeals(orgId) {
  if (!memDeals.has(orgId)) {
    memDeals.set(orgId, seedMemDeals(orgId))
  }
  return memDeals.get(orgId)
}

function newUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function seedMemDeals(orgId) {
  const now = new Date().toISOString()
  const makeStub = (title, company, contact, stage, value, source, aiScore) => ({
    id: newUuid(),
    orgId,
    title,
    description: null,
    stage,
    pipelineId: DEFAULT_PIPELINE_ID,
    value,
    currency: 'VND',
    probability: 0,
    source,
    contactId: null,
    companyId: null,
    contactName: contact,
    companyName: company,
    assigneeId: DEFAULT_ASSIGNEE_ID,
    expectedCloseDate: null,
    aiScore: aiScore ?? null,
    tags: [],
    lastActivityAt: now,
    createdBy: DEFAULT_ASSIGNEE_ID,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    crmId: null,
    activities: [],
  })

  return [
    makeStub('Triển khai ERP giai đoạn 1',         'Công ty TNHH Minh Phát',    'Nguyễn Văn Hùng',    DealStage.new,          450_000_000, 'inbound',  72),
    makeStub('Nâng cấp hệ thống POS',               'Siêu thị Hoàng Gia',        'Trần Thị Lan',        DealStage.new,           85_000_000, 'website',  58),
    makeStub('Tư vấn chuyển đổi số',                'Tập đoàn ABC Holdings',     'Lê Minh Đức',         DealStage.new,          200_000_000, 'referral', null),
    makeStub('Phần mềm quản lý nhân sự HRM',        'Công ty CP Thành Đông',     'Phạm Quang Vinh',     DealStage.preparing,    120_000_000, 'outbound', 65),
    makeStub('Hệ thống camera giám sát AI',         'Khu CN Bắc Phú',            'Vũ Thị Hoa',          DealStage.preparing,    340_000_000, 'event',    80),
    makeStub('Cloud Migration tài chính',            'Fintech Việt Nam JSC',      'Hoàng Anh Tuấn',      DealStage.contacted,    980_000_000, 'referral', 88),
    makeStub('Tích hợp API thanh toán',             'E-commerce Nam Sao',         'Bùi Thanh Tú',        DealStage.contacted,     55_000_000, 'website',  61),
    makeStub('Giải pháp kho thông minh WMS',        'Logistics Đông Dương',      'Nguyễn Thị Mai',      DealStage.contacted,    670_000_000, 'outbound', 74),
    makeStub('Nền tảng CRM doanh nghiệp',           'Tập đoàn Phú Thọ Group',    'Đinh Văn Long',       DealStage.negotiating, 1_500_000_000,'referral', 91),
    makeStub('Bảo mật dữ liệu ISO 27001',           'Ngân hàng TechBank',        'Trần Đức Thành',      DealStage.negotiating,  850_000_000, 'inbound',  85),
    makeStub('Phát triển app mobile B2C',           'Thương hiệu FashionX',      'Lý Thị Ngọc',         DealStage.quoted,       420_000_000, 'website',  78),
    makeStub('Hạ tầng mạng toà nhà văn phòng',     'Tòa nhà Sunrise Tower',     'Phạm Gia Bảo',        DealStage.quoted,       290_000_000, 'outbound', 83),
    makeStub('Triển khai phần mềm kế toán',         'Cty XNK Sao Vàng',          'Ngô Minh Châu',       DealStage.won,          180_000_000, 'referral', 95),
    makeStub('Hệ thống đặt lịch khách sạn',        'Resort Biển Xanh',           'Đặng Hữu Nghĩa',      DealStage.won,          310_000_000, 'event',    90),
    makeStub('Data analytics dashboard',             'VinMart Plus',              'Trịnh Thị Hương',     DealStage.won,          520_000_000, 'inbound',  93),
    makeStub('Chuyển đổi hệ thống email',           'Cty XD Hòa Phát',           'Lê Văn Cường',        DealStage.lost,          60_000_000, 'outbound', null),
    makeStub('Phần mềm quản lý giáo dục LMS',      'CĐ Công Nghệ Miền Nam',     'Phan Thị Thu',        DealStage.lost,         145_000_000, 'website',  null),
  ]
}

export const DEAL_STAGES = [
  DealStage.new,
  DealStage.preparing,
  DealStage.contacted,
  DealStage.negotiating,
  DealStage.quoted,
  DealStage.won,
  DealStage.lost,
]

const STAGE_LABELS = {
  [DealStage.new]: 'Moi',
  [DealStage.preparing]: 'Dang chuan bi',
  [DealStage.contacted]: 'Da lien he',
  [DealStage.negotiating]: 'Dam phan',
  [DealStage.quoted]: 'Bao gia',
  [DealStage.won]: 'Thang',
  [DealStage.lost]: 'Thua',
}

const STAGE_COLORS = {
  [DealStage.new]: '#6B7280',
  [DealStage.preparing]: '#3B82F6',
  [DealStage.contacted]: '#06B6D4',
  [DealStage.negotiating]: '#F59E0B',
  [DealStage.quoted]: '#8B5CF6',
  [DealStage.won]: '#10B981',
  [DealStage.lost]: '#EF4444',
}

const DEFAULT_PIPELINE_ID = process.env.DEFAULT_PIPELINE_ID ?? '00000000-0000-0000-0000-000000000001'
const DEFAULT_ASSIGNEE_ID = process.env.DEFAULT_ASSIGNEE_ID ?? '00000000-0000-0000-0000-000000000010'

function ensureUuid(value, fallback) {
  const input = String(value ?? '').trim()
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(input) ? input : fallback
}

function parseMoneyValueToNumber(value) {
  const raw = typeof value === 'number' ? String(value) : String(value ?? '')
  const digits = raw.replace(/[^0-9]/g, '')
  if (!digits) {
    return 0
  }
  return Number(digits)
}

function formatMoneyVnd(value) {
  return `₫ ${Number(value).toLocaleString('vi-VN')}`
}

function formatMoneyCompactVnd(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return '₫ 0'
  }
  if (value >= 1_000_000_000) {
    return `₫ ${(value / 1_000_000_000).toFixed(1).replace(/\\.0$/, '')}B`
  }
  if (value >= 1_000_000) {
    return `₫ ${(value / 1_000_000).toFixed(1).replace(/\\.0$/, '')}M`
  }
  return formatMoneyVnd(value)
}

function mapDealCard(deal) {
  return {
    id: deal.id,
    title: deal.title,
    company: deal.companyName ?? deal.contactName ?? '—',
    value: formatMoneyVnd(deal.value),
    source: deal.source ? deal.source.toUpperCase() : 'MANUAL',
    aiScore: deal.aiScore,
    isWon: deal.stage === DealStage.won,
    isLost: deal.stage === DealStage.lost,
    hasActions: true,
    assignees: [1],
    updatedAt: deal.updatedAt,
  }
}

function buildKanbanPayload(items) {
  const columns = DEAL_STAGES.map((stage) => {
    const stageDeals = items.filter((item) => item.stage === stage)
    const total = stageDeals.reduce((sum, deal) => sum + Number(deal.value), 0)
    return {
      id: stage,
      name: STAGE_LABELS[stage],
      color: STAGE_COLORS[stage],
      total: formatMoneyCompactVnd(total),
      cards: stageDeals.map(mapDealCard),
    }
  })

  const openDeals = items.filter((item) => item.stage !== DealStage.won && item.stage !== DealStage.lost)
  const wonDeals = items.filter((item) => item.stage === DealStage.won)
  const lostDeals = items.filter((item) => item.stage === DealStage.lost)
  const openRevenue = openDeals.reduce((sum, deal) => sum + Number(deal.value), 0)
  const resolvedCount = wonDeals.length + lostDeals.length
  const winRate = resolvedCount > 0 ? Math.round((wonDeals.length / resolvedCount) * 100) : 0

  return {
    selectedPipeline: 'Ban hang B2B',
    kpis: [
      { label: 'Tổng deal đang mở', value: String(openDeals.length) },
      { label: 'Doanh thu dự kiến', value: formatMoneyCompactVnd(openRevenue) },
      { label: 'Tỷ lệ chuyển đổi', value: `${winRate}%`, valueClass: 'text-primary-500' },
      { label: 'Deal sắp hết hạn', value: '0', valueClass: 'text-error-500' },
    ],
    columns,
  }
}

export function validateStage(stage) {
  return DEAL_STAGES.includes(stage)
}

// ─── In-memory implementations ────────────────────────────────────────────────

function memListDealsForKanban({ orgId }) {
  const deals = getMemDeals(orgId).filter((d) => !d.deletedAt)
  return buildKanbanPayload(deals)
}

function memGetDealById({ orgId, dealId }) {
  const deal = getMemDeals(orgId).find((d) => d.id === dealId && !d.deletedAt)
  return deal ? { ...deal, company: deal.companyName, contact: deal.contactName } : null
}

function memCreateDeal({ orgId, userId, payload }) {
  const stage = validateStage(payload.stage) ? payload.stage : DealStage.new
  const value = parseMoneyValueToNumber(payload.value)
  const now = new Date().toISOString()
  const deal = {
    id: newUuid(),
    orgId,
    title: payload.title,
    description: payload.description ?? null,
    stage,
    pipelineId: ensureUuid(payload.pipelineId, DEFAULT_PIPELINE_ID),
    value,
    currency: payload.currency ?? 'VND',
    probability: Number(payload.probability ?? 0),
    source: payload.source ?? null,
    contactId: null,
    companyId: null,
    contactName: payload.contact ?? null,
    companyName: payload.company ?? null,
    assigneeId: DEFAULT_ASSIGNEE_ID,
    expectedCloseDate: null,
    aiScore: null,
    tags: [],
    lastActivityAt: now,
    createdBy: userId ?? DEFAULT_ASSIGNEE_ID,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    crmId: null,
    activities: [],
  }
  getMemDeals(orgId).unshift(deal)
  return { ...deal, company: deal.companyName, contact: deal.contactName }
}

function memUpdateDeal({ orgId, userId, dealId, patch }) {
  const deals = getMemDeals(orgId)
  const deal = deals.find((d) => d.id === dealId && !d.deletedAt)
  if (!deal) return null

  const now = new Date().toISOString()
  if (patch.title !== undefined) deal.title = patch.title
  if (patch.description !== undefined) deal.description = patch.description
  if (patch.stage && validateStage(patch.stage)) deal.stage = patch.stage
  if (patch.value !== undefined) deal.value = parseMoneyValueToNumber(patch.value)
  if (patch.probability !== undefined) deal.probability = Number(patch.probability)
  if (patch.source !== undefined) deal.source = patch.source
  if (patch.company !== undefined) deal.companyName = patch.company
  if (patch.contact !== undefined) deal.contactName = patch.contact
  deal.updatedAt = now
  deal.lastActivityAt = now
  return { ...deal, company: deal.companyName, contact: deal.contactName }
}

function memDeleteDeal({ orgId, dealId }) {
  const deal = getMemDeals(orgId).find((d) => d.id === dealId && !d.deletedAt)
  if (!deal) return false
  deal.deletedAt = new Date().toISOString()
  return true
}

// ─── DB-backed implementations with in-memory fallback ────────────────────────

export async function createDeal({ orgId, userId, payload }) {
  try {
    const stage = validateStage(payload.stage) ? payload.stage : DealStage.new
    const value = parseMoneyValueToNumber(payload.value)

    const deal = await prisma.deal.create({
      data: {
        orgId,
        title: payload.title,
        description: payload.description ?? null,
        stage,
        pipelineId: ensureUuid(payload.pipelineId, DEFAULT_PIPELINE_ID),
        value,
        currency: payload.currency ?? 'VND',
        probability: Number(payload.probability ?? 0),
        source: payload.source ?? null,
        contactId: ensureUuid(payload.contactId, null),
        companyId: ensureUuid(payload.companyId, null),
        assigneeId: ensureUuid(payload.assigneeId, ensureUuid(userId, DEFAULT_ASSIGNEE_ID)),
        expectedCloseDate: payload.expectedCloseDate ? new Date(payload.expectedCloseDate) : null,
        aiScore: payload.aiScore ? Number(payload.aiScore) : null,
        tags: Array.isArray(payload.tags) ? payload.tags : [],
        createdBy: ensureUuid(userId, DEFAULT_ASSIGNEE_ID),
        crmId: payload.crmId ?? null,
        companyName: payload.company ?? null,
        contactName: payload.contact ?? null,
      },
    })

    await prisma.dealActivity.create({
      data: {
        orgId,
        dealId: deal.id,
        type: 'created',
        title: 'Deal duoc tao',
        metadata: { stage },
        createdBy: ensureUuid(userId, DEFAULT_ASSIGNEE_ID),
      },
    })

    await prisma.auditLog.create({
      data: {
        orgId,
        userId: ensureUuid(userId, DEFAULT_ASSIGNEE_ID),
        entity: 'deal',
        entityId: deal.id,
        action: 'created',
        metadata: { stage },
      },
    })

    return getDealById({ orgId, dealId: deal.id })
  } catch {
    return memCreateDeal({ orgId, userId, payload })
  }
}

export async function listDeals({ orgId, query }) {
  try {
    const where = { orgId, deletedAt: null }

    if (query.stage && validateStage(query.stage)) where.stage = query.stage
    if (query.assignee_id) where.assigneeId = query.assignee_id
    if (query.pipeline_id) where.pipelineId = query.pipeline_id
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { contactName: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    if (query.min_value || query.max_value) {
      where.value = {}
      if (query.min_value) where.value.gte = Number(query.min_value)
      if (query.max_value) where.value.lte = Number(query.max_value)
    }

    const page = Math.max(1, Number(query.page ?? 1))
    const limit = Math.min(100, Math.max(1, Number(query.limit ?? 50)))

    const [items, total] = await Promise.all([
      prisma.deal.findMany({ where, orderBy: { lastActivityAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      prisma.deal.count({ where }),
    ])

    if (query.groupBy === 'stage') {
      const groups = {}
      const totalsByStage = {}
      for (const stage of DEAL_STAGES) { groups[stage] = []; totalsByStage[stage] = 0 }
      for (const item of items) {
        groups[item.stage].push(mapDealCard(item))
        totalsByStage[item.stage]++
      }
      return { groups, totalsByStage, total, page, limit }
    }

    return { items, total, page, limit }
  } catch {
    const deals = getMemDeals(orgId).filter((d) => !d.deletedAt)
    return { items: deals, total: deals.length, page: 1, limit: deals.length }
  }
}

export async function listDealsForKanban({ orgId }) {
  try {
    const items = await prisma.deal.findMany({
      where: { orgId, deletedAt: null },
      orderBy: { lastActivityAt: 'desc' },
    })
    return buildKanbanPayload(items)
  } catch {
    return memListDealsForKanban({ orgId })
  }
}

export async function getDealById({ orgId, dealId }) {
  try {
    const deal = await prisma.deal.findFirst({
      where: { id: dealId, orgId, deletedAt: null },
    })
    if (!deal) return null

    const activities = await prisma.dealActivity.findMany({
      where: { orgId, dealId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    return { ...deal, company: deal.companyName, contact: deal.contactName, activities, attachedDocumentsCount: 0, aiSuggestionsCount: 0 }
  } catch {
    return memGetDealById({ orgId, dealId })
  }
}

export async function updateDeal({ orgId, userId, dealId, patch }) {
  try {
    const existing = await prisma.deal.findFirst({ where: { id: dealId, orgId, deletedAt: null } })
    if (!existing) return null

    const nextStage = patch.stage && validateStage(patch.stage) ? patch.stage : existing.stage

    const updated = await prisma.deal.update({
      where: { id: dealId },
      data: {
        title: patch.title ?? undefined,
        description: patch.description ?? undefined,
        stage: nextStage,
        value: patch.value !== undefined ? parseMoneyValueToNumber(patch.value) : undefined,
        currency: patch.currency ?? undefined,
        probability: patch.probability !== undefined ? Number(patch.probability) : undefined,
        source: patch.source !== undefined ? patch.source : undefined,
        assigneeId: patch.assigneeId ? ensureUuid(patch.assigneeId, existing.assigneeId) : undefined,
        expectedCloseDate: patch.expectedCloseDate ? new Date(patch.expectedCloseDate) : undefined,
        tags: Array.isArray(patch.tags) ? patch.tags : undefined,
        contactName: patch.contact !== undefined ? patch.contact : undefined,
        companyName: patch.company !== undefined ? patch.company : undefined,
        lastActivityAt: new Date(),
      },
    })

    if (existing.stage !== nextStage) {
      await prisma.dealActivity.create({
        data: {
          orgId, dealId, type: 'stage_change',
          title: `Chuyen giai doan tu ${existing.stage} sang ${nextStage}`,
          metadata: { from: existing.stage, to: nextStage },
          createdBy: ensureUuid(userId, existing.assigneeId),
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        orgId, userId: ensureUuid(userId, existing.assigneeId),
        entity: 'deal', entityId: dealId, action: 'updated', metadata: patch,
      },
    })

    return updated
  } catch {
    return memUpdateDeal({ orgId, userId, dealId, patch })
  }
}

export async function updateDealStage({ orgId, userId, dealId, stage }) {
  if (!validateStage(stage)) return null
  return updateDeal({ orgId, userId, dealId, patch: { stage } })
}

export async function deleteDeal({ orgId, userId, dealId }) {
  try {
    const existing = await prisma.deal.findFirst({ where: { id: dealId, orgId, deletedAt: null } })
    if (!existing) return false

    await prisma.deal.update({
      where: { id: dealId },
      data: { deletedAt: new Date(), lastActivityAt: new Date() },
    })

    await prisma.auditLog.create({
      data: {
        orgId, userId: ensureUuid(userId, existing.assigneeId),
        entity: 'deal', entityId: dealId, action: 'deleted', metadata: { softDeleted: true },
      },
    })

    return true
  } catch {
    return memDeleteDeal({ orgId, dealId })
  }
}
