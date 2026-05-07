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

export interface CrmKanbanKpiItem {
  label: string
  value: string
  valueClass?: string
}

export interface CrmDealCard {
  id: string
  title: string
  company: string
  value: string
  source?: string
  aiScore?: number
  isAiSuggested?: boolean
  aiNote?: string
  daysLeft?: string
  statusLabel?: string
  statusClass?: string
  assignees?: number[]
  hasActions?: boolean
  isWon?: boolean
  isLost?: boolean
  lostReason?: string
}

export interface CrmKanbanColumn {
  id: string
  name: string
  color: string
  total: string
  cards: CrmDealCard[]
}

export interface CrmDealsKanbanPayload {
  selectedPipeline: string
  kpis: CrmKanbanKpiItem[]
  columns: CrmKanbanColumn[]
}

export interface CreateCrmDealPayload {
  title: string
  company?: string
  value?: string
  stage: string
  source?: string
  contact?: string
  note?: string
}

export interface CreateCrmDealResponse {
  card: CrmDealCard
  stage: string
  kanban: CrmDealsKanbanPayload
}
