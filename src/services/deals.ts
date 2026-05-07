import { del, get, patch, post } from '@/services/api'
import type { ApiResponse } from '@/types/common'
import type {
  CreateDealInput,
  Deal,
  DealsKanbanPayload,
  DealsListResponse,
  UpdateDealInput,
  DealStage,
} from '@/types/deals'

export function listDealsKanban(): Promise<ApiResponse<DealsKanbanPayload>> {
  return get<DealsKanbanPayload>('/v1/crm/deals/kanban')
}

export function createDeal(input: CreateDealInput): Promise<ApiResponse<{ deal: Deal; kanban: DealsKanbanPayload }>> {
  return post<{ deal: Deal; kanban: DealsKanbanPayload }>('/v1/crm/deals', input)
}

export function listDeals(params?: Record<string, string | number | undefined>): Promise<ApiResponse<DealsListResponse>> {
  return get<DealsListResponse>('/deals', params)
}

export function getDealById(dealId: string): Promise<ApiResponse<Deal>> {
  return get<Deal>(`/deals/${dealId}`)
}

export function updateDeal(dealId: string, patchBody: UpdateDealInput): Promise<ApiResponse<Deal>> {
  return patch<Deal>(`/deals/${dealId}`, patchBody)
}

export function updateDealStage(dealId: string, stage: DealStage): Promise<ApiResponse<Deal>> {
  return patch<Deal>(`/deals/${dealId}/stage`, { stage })
}

export function deleteDeal(dealId: string): Promise<ApiResponse<void>> {
  return del<void>(`/deals/${dealId}`)
}
