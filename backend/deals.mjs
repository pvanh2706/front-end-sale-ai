import { DealStage } from '@prisma/client'
import { prisma } from './prisma.mjs'

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

export async function createDeal({ orgId, userId, payload }) {
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
}

export async function listDeals({ orgId, query }) {
  const where = {
    orgId,
    deletedAt: null,
  }

  if (query.stage && validateStage(query.stage)) {
    where.stage = query.stage
  }

  if (query.assignee_id) {
    where.assigneeId = query.assignee_id
  }

  if (query.pipeline_id) {
    where.pipelineId = query.pipeline_id
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { companyName: { contains: query.search, mode: 'insensitive' } },
      { contactName: { contains: query.search, mode: 'insensitive' } },
    ]
  }

  if (query.tag) {
    where.tags = { has: query.tag }
  }

  if (query.min_value || query.max_value) {
    where.value = {}
    if (query.min_value) {
      where.value.gte = Number(query.min_value)
    }
    if (query.max_value) {
      where.value.lte = Number(query.max_value)
    }
  }

  const page = Math.max(1, Number(query.page ?? 1))
  const limit = Math.min(100, Math.max(1, Number(query.limit ?? 50)))

  const [items, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      orderBy: { lastActivityAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.deal.count({ where }),
  ])

  if (query.groupBy === 'stage') {
    const groups = {}
    for (const stage of DEAL_STAGES) {
      groups[stage] = []
    }
    for (const item of items) {
      groups[item.stage].push(mapDealCard(item))
    }

    const totalsByStage = {}
    for (const stage of DEAL_STAGES) {
      totalsByStage[stage] = groups[stage].length
    }

    return { groups, totalsByStage, total, page, limit }
  }

  return {
    items,
    total,
    page,
    limit,
  }
}

export async function listDealsForKanban({ orgId }) {
  const items = await prisma.deal.findMany({
    where: { orgId, deletedAt: null },
    orderBy: { lastActivityAt: 'desc' },
  })

  return buildKanbanPayload(items)
}

export async function getDealById({ orgId, dealId }) {
  const deal = await prisma.deal.findFirst({
    where: {
      id: dealId,
      orgId,
      deletedAt: null,
    },
  })

  if (!deal) {
    return null
  }

  const activities = await prisma.dealActivity.findMany({
    where: { orgId, dealId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return {
    ...deal,
    company: deal.companyName,
    contact: deal.contactName,
    activities,
    attachedDocumentsCount: 0,
    aiSuggestionsCount: 0,
  }
}

export async function updateDeal({ orgId, userId, dealId, patch }) {
  const existing = await prisma.deal.findFirst({ where: { id: dealId, orgId, deletedAt: null } })
  if (!existing) {
    return null
  }

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
        orgId,
        dealId,
        type: 'stage_change',
        title: `Chuyen giai doan tu ${existing.stage} sang ${nextStage}`,
        metadata: { from: existing.stage, to: nextStage },
        createdBy: ensureUuid(userId, existing.assigneeId),
      },
    })
  }

  await prisma.auditLog.create({
    data: {
      orgId,
      userId: ensureUuid(userId, existing.assigneeId),
      entity: 'deal',
      entityId: dealId,
      action: 'updated',
      metadata: patch,
    },
  })

  return updated
}

export async function updateDealStage({ orgId, userId, dealId, stage }) {
  if (!validateStage(stage)) {
    return null
  }

  return updateDeal({ orgId, userId, dealId, patch: { stage } })
}

export async function deleteDeal({ orgId, userId, dealId }) {
  const existing = await prisma.deal.findFirst({ where: { id: dealId, orgId, deletedAt: null } })
  if (!existing) {
    return false
  }

  await prisma.deal.update({
    where: { id: dealId },
    data: {
      deletedAt: new Date(),
      lastActivityAt: new Date(),
    },
  })

  await prisma.auditLog.create({
    data: {
      orgId,
      userId: ensureUuid(userId, existing.assigneeId),
      entity: 'deal',
      entityId: dealId,
      action: 'deleted',
      metadata: { softDeleted: true },
    },
  })

  return true
}
