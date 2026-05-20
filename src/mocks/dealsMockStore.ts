/**
 * In-memory mock store cho Deals — hỗ trợ đầy đủ CRUD + Kanban
 * Dùng khi VITE_DEALS_USE_MOCK=true (không cần backend hay DB)
 */
import { reactive } from 'vue'
import type { Deal, DealCard, DealStage, DealsKanbanPayload } from '@/types/deals'

// ─── Seed data ────────────────────────────────────────────────────────────────

let _idCounter = 100

function nextId(): string {
  _idCounter += 1
  return `mock-${_idCounter}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function makeDeal(
  title: string,
  companyName: string,
  contactName: string,
  stage: DealStage,
  value: number,
  source: string,
  probability: number,
  aiScore: number | null = null,
  description = '',
): Deal {
  const id = nextId()
  return {
    id,
    orgId: 'demo-org',
    title,
    description,
    stage,
    pipelineId: '00000000-0000-0000-0000-000000000001',
    value,
    currency: 'VND',
    probability,
    source,
    contactId: null,
    companyId: null,
    contactName,
    companyName,
    assigneeId: 'demo-user',
    expectedCloseDate: null,
    aiScore,
    tags: [],
    lastActivityAt: nowIso(),
    createdBy: 'demo-user',
    createdAt: nowIso(),
    updatedAt: nowIso(),
    crmId: null,
    activities: [],
  }
}

const SEED: Deal[] = [
  // ── new ──────────────────────────────────────────────────────────────────
  makeDeal('Triển khai ERP giai đoạn 1',        'Công ty TNHH Minh Phát',    'Nguyễn Văn Hùng',  'new',          450_000_000, 'inbound',  20, 72,  'Khách hàng quan tâm giải pháp ERP cho sản xuất.'),
  makeDeal('Nâng cấp hệ thống POS',              'Siêu thị Hoàng Gia',        'Trần Thị Lan',      'new',           85_000_000, 'website',  15, 58,  'Cần nâng cấp 12 terminal POS.'),
  makeDeal('Tư vấn chuyển đổi số',               'Tập đoàn ABC Holdings',     'Lê Minh Đức',       'new',          200_000_000, 'referral', 25, null, 'Dự án tư vấn chiến lược 2 năm.'),

  // ── preparing ────────────────────────────────────────────────────────────
  makeDeal('Phần mềm quản lý nhân sự HRM',       'Công ty CP Thành Đông',     'Phạm Quang Vinh',   'preparing',    120_000_000, 'outbound', 35, 65,  'HRM tích hợp chấm công và bảng lương.'),
  makeDeal('Hệ thống camera giám sát AI',         'Khu CN Bắc Phú',            'Vũ Thị Hoa',        'preparing',    340_000_000, 'event',    40, 80,  'Lắp đặt 200 camera AI toàn khu CN.'),

  // ── contacted ────────────────────────────────────────────────────────────
  makeDeal('Cloud Migration tài chính',           'Fintech Việt Nam JSC',      'Hoàng Anh Tuấn',    'contacted',    980_000_000, 'referral', 55, 88,  'Di chuyển hạ tầng on-premise lên AWS.'),
  makeDeal('Tích hợp API thanh toán',             'E-commerce Nam Sao',        'Bùi Thanh Tú',      'contacted',     55_000_000, 'website',  50, 61,  'Tích hợp VNPay, MoMo, ZaloPay.'),
  makeDeal('Giải pháp kho thông minh WMS',        'Logistics Đông Dương',      'Nguyễn Thị Mai',    'contacted',    670_000_000, 'outbound', 45, 74,  'WMS tích hợp robot phân loại.'),

  // ── negotiating ──────────────────────────────────────────────────────────
  makeDeal('Nền tảng CRM doanh nghiệp',          'Tập đoàn Phú Thọ Group',    'Đinh Văn Long',     'negotiating', 1_500_000_000,'referral', 65, 91,  'CRM cho 500 nhân viên kinh doanh toàn quốc.'),
  makeDeal('Bảo mật dữ liệu ISO 27001',           'Ngân hàng TechBank',        'Trần Đức Thành',    'negotiating',  850_000_000, 'inbound',  70, 85,  'Triển khai ISMS đạt chuẩn ISO 27001.'),

  // ── quoted ───────────────────────────────────────────────────────────────
  makeDeal('Phát triển app mobile B2C',           'Thương hiệu FashionX',      'Lý Thị Ngọc',       'quoted',       420_000_000, 'website',  75, 78,  'App mua sắm iOS + Android.'),
  makeDeal('Hạ tầng mạng toà nhà văn phòng',     'Tòa nhà Sunrise Tower',     'Phạm Gia Bảo',      'quoted',       290_000_000, 'outbound', 80, 83,  'Cabling, WiFi 6, firewall 20 tầng.'),

  // ── won ──────────────────────────────────────────────────────────────────
  makeDeal('Triển khai phần mềm kế toán',         'Cty XNK Sao Vàng',          'Ngô Minh Châu',     'won',          180_000_000, 'referral', 100, 95, 'FastAccounting tích hợp báo cáo thuế.'),
  makeDeal('Hệ thống đặt lịch khách sạn',        'Resort Biển Xanh',           'Đặng Hữu Nghĩa',    'won',          310_000_000, 'event',    100, 90, 'PMS + booking engine + channel manager.'),
  makeDeal('Data analytics dashboard',            'VinMart Plus',               'Trịnh Thị Hương',   'won',          520_000_000, 'inbound',  100, 93, 'Dashboard BI real-time 200 cửa hàng.'),

  // ── lost ─────────────────────────────────────────────────────────────────
  makeDeal('Chuyển đổi hệ thống email',           'Cty XD Hòa Phát',           'Lê Văn Cường',      'lost',          60_000_000, 'outbound', 0, null,  'Khách chọn giải pháp đối thủ giá thấp hơn.'),
  makeDeal('Phần mềm quản lý giáo dục LMS',      'CĐ Công Nghệ Miền Nam',     'Phan Thị Thu',      'lost',         145_000_000, 'website',  0, null,  'Dự án bị đình hoãn do cắt ngân sách.'),
]

// ─── Reactive store ───────────────────────────────────────────────────────────

const store = reactive<{ deals: Deal[] }>({
  deals: [...SEED],
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STAGE_META: Record<DealStage, { name: string; color: string }> = {
  new:         { name: 'Mới',              color: '#64748B' },
  preparing:   { name: 'Đang chuẩn bị',   color: '#3B82F6' },
  contacted:   { name: 'Đã liên hệ',      color: '#06B6D4' },
  negotiating: { name: 'Đàm phán',        color: '#F59E0B' },
  quoted:      { name: 'Báo giá',         color: '#8B5CF6' },
  won:         { name: 'Thắng',           color: '#10B981' },
  lost:        { name: 'Thua',            color: '#EF4444' },
}

const STAGE_ORDER: DealStage[] = ['new', 'preparing', 'contacted', 'negotiating', 'quoted', 'won', 'lost']

function fmtVnd(value: number): string {
  return `₫ ${value.toLocaleString('vi-VN')}`
}

function fmtCompact(value: number): string {
  if (value <= 0) return '₫ 0'
  if (value >= 1_000_000_000) return `₫ ${(value / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (value >= 1_000_000) return `₫ ${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  return fmtVnd(value)
}

function toDealCard(deal: Deal): DealCard {
  return {
    id: deal.id,
    title: deal.title,
    company: deal.companyName ?? deal.contactName ?? '—',
    value: fmtVnd(deal.value),
    source: (deal.source ?? 'MANUAL').toUpperCase(),
    aiScore: deal.aiScore ?? null,
    isWon: deal.stage === 'won',
    isLost: deal.stage === 'lost',
    hasActions: true,
    assignees: [1],
    updatedAt: deal.updatedAt,
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function mockListKanban(): DealsKanbanPayload {
  const active = store.deals
  const open = active.filter((d) => d.stage !== 'won' && d.stage !== 'lost')
  const won = active.filter((d) => d.stage === 'won')
  const lost = active.filter((d) => d.stage === 'lost')
  const resolvedCount = won.length + lost.length
  const winRate = resolvedCount > 0 ? Math.round((won.length / resolvedCount) * 100) : 0
  const openRevenue = open.reduce((s, d) => s + d.value, 0)

  const columns = STAGE_ORDER.map((stage) => {
    const cards = active.filter((d) => d.stage === stage).map(toDealCard)
    const total = active.filter((d) => d.stage === stage).reduce((s, d) => s + d.value, 0)
    const meta = STAGE_META[stage]
    return { id: stage, name: meta.name, color: meta.color, total: fmtCompact(total), cards }
  })

  return {
    selectedPipeline: 'Bán hàng B2B',
    kpis: [
      { label: 'Tổng deal đang mở',   value: String(open.length) },
      { label: 'Doanh thu dự kiến',   value: fmtCompact(openRevenue) },
      { label: 'Tỷ lệ chuyển đổi',   value: `${winRate}%`, valueClass: 'text-primary-500' },
      { label: 'Deal sắp hết hạn',   value: '3', valueClass: 'text-error-500' },
    ],
    columns,
  }
}

export function mockGetDealById(dealId: string): Deal | null {
  return store.deals.find((d) => d.id === dealId) ?? null
}

export interface MockCreateInput {
  title: string
  company?: string
  contact?: string
  stage?: DealStage
  value?: number | string
  probability?: number | string
  source?: string
  description?: string
}

export function mockCreateDeal(input: MockCreateInput): { deal: Deal; kanban: DealsKanbanPayload } {
  const value = typeof input.value === 'string' ? Number(input.value.replace(/\D/g, '')) : (input.value ?? 0)
  const deal = makeDeal(
    input.title,
    input.company ?? '',
    input.contact ?? '',
    input.stage ?? 'new',
    value,
    input.source ?? 'manual',
    Number(input.probability ?? 0),
    null,
    input.description ?? '',
  )
  store.deals.unshift(deal)
  return { deal, kanban: mockListKanban() }
}

export function mockUpdateDeal(dealId: string, patch: Partial<MockCreateInput>): Deal | null {
  const deal = store.deals.find((d) => d.id === dealId)
  if (!deal) return null

  if (patch.title !== undefined) deal.title = patch.title
  if (patch.company !== undefined) deal.companyName = patch.company
  if (patch.contact !== undefined) deal.contactName = patch.contact
  if (patch.stage !== undefined) deal.stage = patch.stage as DealStage
  if (patch.value !== undefined) {
    deal.value = typeof patch.value === 'string' ? Number(patch.value.replace(/\D/g, '')) : patch.value
  }
  if (patch.probability !== undefined) deal.probability = Number(patch.probability)
  if (patch.source !== undefined) deal.source = patch.source ?? null
  if (patch.description !== undefined) deal.description = patch.description ?? null
  deal.updatedAt = nowIso()
  return deal
}

export function mockUpdateDealStage(dealId: string, stage: DealStage): Deal | null {
  return mockUpdateDeal(dealId, { stage })
}

export function mockDeleteDeal(dealId: string): boolean {
  const idx = store.deals.findIndex((d) => d.id === dealId)
  if (idx < 0) return false
  store.deals.splice(idx, 1)
  return true
}
