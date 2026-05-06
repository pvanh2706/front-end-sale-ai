export type CrmMetricTone = 'brand' | 'success' | 'warning' | 'error'

export interface CrmKpiMetric {
  id: string
  label: string
  value: string
  trend: 'up' | 'down'
  changeText: string
  tone: CrmMetricTone
}

export interface CrmPipelineStage {
  id: string
  name: string
  count: number
  percent: number
  value: string
  tone: CrmMetricTone
}

export interface CrmTaskItem {
  id: string
  title: string
  meta: string
  done: boolean
}

export interface CrmDashboardPayload {
  kpis: CrmKpiMetric[]
  pipeline: CrmPipelineStage[]
  tasks: CrmTaskItem[]
}
