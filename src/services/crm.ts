import { get, put } from '@/services/api'
import type { ApiResponse } from '@/types/common'
import type { CrmDashboardPayload, CrmTaskItem } from '@/types/crm'

const CRM_DASHBOARD_ENDPOINT = '/v1/crm/dashboard'

export function getCrmDashboard(): Promise<ApiResponse<CrmDashboardPayload>> {
  return get<CrmDashboardPayload>(CRM_DASHBOARD_ENDPOINT)
}

export function updateCrmTaskStatus(taskId: string, done: boolean): Promise<ApiResponse<CrmTaskItem>> {
  return put<CrmTaskItem>(`/v1/crm/tasks/${taskId}`, { done })
}
