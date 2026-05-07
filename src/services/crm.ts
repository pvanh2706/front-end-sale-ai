import { get, post, put } from '@/services/api'
import type { ApiResponse } from '@/types/common'
import type {
  CreateCrmDealPayload,
  CreateCrmDealResponse,
  CrmDashboardPayload,
  CrmDealsKanbanPayload,
  CrmTaskItem,
} from '@/types/crm'

const CRM_DASHBOARD_ENDPOINT = '/v1/crm/dashboard'
const CRM_DEALS_KANBAN_ENDPOINT = '/v1/crm/deals/kanban'
const CRM_DEALS_ENDPOINT = '/v1/crm/deals'

export function getCrmDashboard(): Promise<ApiResponse<CrmDashboardPayload>> {
  return get<CrmDashboardPayload>(CRM_DASHBOARD_ENDPOINT)
}

export function updateCrmTaskStatus(taskId: string, done: boolean): Promise<ApiResponse<CrmTaskItem>> {
  return put<CrmTaskItem>(`/v1/crm/tasks/${taskId}`, { done })
}

export function getCrmDealsKanban(): Promise<ApiResponse<CrmDealsKanbanPayload>> {
  return get<CrmDealsKanbanPayload>(CRM_DEALS_KANBAN_ENDPOINT)
}

export function createCrmDeal(payload: CreateCrmDealPayload): Promise<ApiResponse<CreateCrmDealResponse>> {
  return post<CreateCrmDealResponse>(CRM_DEALS_ENDPOINT, payload)
}
