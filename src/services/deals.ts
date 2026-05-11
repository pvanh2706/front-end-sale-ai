import { del, get, patch, post } from '@/services/api'
import {
  mockCreateDeal,
  mockDeleteDeal,
  mockGetDealById,
  mockListKanban,
  mockUpdateDeal,
  mockUpdateDealStage,
} from '@/mocks/dealsMockStore'
import type { ApiResponse } from '@/types/common'
import type {
  CreateDealInput,
  Deal,
  DealsKanbanPayload,
  DealsListResponse,
  UpdateDealInput,
  DealStage,
} from '@/types/deals'

const USE_MOCK = ((import.meta.env.VITE_DEALS_USE_MOCK as string | undefined) ?? 'true') !== 'false'

// ─── Kanban ───────────────────────────────────────────────────────────────────

export function listDealsKanban(): Promise<ApiResponse<DealsKanbanPayload>> {
  if (USE_MOCK) {
    return Promise.resolve({ isSuccess: true, data: mockListKanban() })
  }
  return get<DealsKanbanPayload>('/v1/crm/deals/kanban')
}

// ─── Create ───────────────────────────────────────────────────────────────────

export function createDeal(input: CreateDealInput): Promise<ApiResponse<{ deal: Deal; kanban: DealsKanbanPayload }>> {
  if (USE_MOCK) {
    const result = mockCreateDeal({
      title: input.title,
      company: input.company,
      contact: input.contact,
      stage: input.stage,
      value: input.value as number | string | undefined,
      probability: input.probability,
      source: input.source,
      description: input.description,
    })
    return Promise.resolve({ isSuccess: true, data: result })
  }
  return post<{ deal: Deal; kanban: DealsKanbanPayload }>('/v1/crm/deals', input)
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function listDeals(params?: Record<string, string | number | undefined>): Promise<ApiResponse<DealsListResponse>> {
  return get<DealsListResponse>('/deals', params)
}

export function getDealById(dealId: string): Promise<ApiResponse<Deal>> {
  if (USE_MOCK) {
    const deal = mockGetDealById(dealId)
    if (!deal) return Promise.resolve({ isSuccess: false, error: 'Deal không tồn tại' })
    return Promise.resolve({ isSuccess: true, data: deal })
  }
  return get<Deal>(`/deals/${dealId}`)
}

// ─── Update ───────────────────────────────────────────────────────────────────

export function updateDeal(dealId: string, patchBody: UpdateDealInput): Promise<ApiResponse<Deal>> {
  if (USE_MOCK) {
    const updated = mockUpdateDeal(dealId, {
      title: patchBody.title,
      company: patchBody.company,
      contact: patchBody.contact,
      stage: patchBody.stage,
      value: patchBody.value as number | string | undefined,
      probability: patchBody.probability,
      source: patchBody.source,
      description: patchBody.description,
    })
    if (!updated) return Promise.resolve({ isSuccess: false, error: 'Deal không tồn tại' })
    return Promise.resolve({ isSuccess: true, data: updated })
  }
  return patch<Deal>(`/deals/${dealId}`, patchBody)
}

export function updateDealStage(dealId: string, stage: DealStage): Promise<ApiResponse<Deal>> {
  if (USE_MOCK) {
    const updated = mockUpdateDealStage(dealId, stage)
    if (!updated) return Promise.resolve({ isSuccess: false, error: 'Deal không tồn tại' })
    return Promise.resolve({ isSuccess: true, data: updated })
  }
  return patch<Deal>(`/deals/${dealId}/stage`, { stage })
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function deleteDeal(dealId: string): Promise<ApiResponse<void>> {
  if (USE_MOCK) {
    const ok = mockDeleteDeal(dealId)
    if (!ok) return Promise.resolve({ isSuccess: false, error: 'Deal không tồn tại' })
    return Promise.resolve({ isSuccess: true, data: undefined })
  }
  return del<void>(`/deals/${dealId}`)
}

