export type DealStage = 'new' | 'preparing' | 'contacted' | 'negotiating' | 'quoted' | 'won' | 'lost'

export interface DealActivity {
  id: string
  type: string
  title: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface Deal {
  id: string
  orgId: string
  title: string
  description?: string | null
  stage: DealStage
  pipelineId: string
  value: number
  currency: string
  probability: number
  source?: string | null
  contactId?: string | null
  companyId?: string | null
  contactName?: string | null
  companyName?: string | null
  assigneeId: string
  teamLeadName?: string | null
  expectedCloseDate?: string | null
  aiScore?: number | null
  tags: string[]
  lastActivityAt: string
  createdBy: string
  createdAt: string
  updatedAt: string
  crmId?: string | null
  activities?: DealActivity[]
  attachedDocumentsCount?: number
  aiSuggestionsCount?: number
}

export interface DealCard {
  id: string
  title: string
  company: string
  contactName?: string
  value: string
  source: string
  aiScore?: number | null
  isWon?: boolean
  isLost?: boolean
  hasActions?: boolean
  assignees?: number[]
  assigneeName?: string
  assigneeColor?: string
  teamLeadName?: string
  lastActivityAt?: string
  closeDate?: string
  isOverdue?: boolean
  phone?: string
  email?: string
  commentCount?: number
  notificationCount?: number
  updatedAt?: string
  isOptimistic?: boolean
}

export interface KanbanColumn {
  id: DealStage
  name: string
  color: string
  total: string
  cards: DealCard[]
}

export interface KanbanKpi {
  label: string
  value: string
  valueClass?: string
}

export interface DealsKanbanPayload {
  selectedPipeline: string
  kpis: KanbanKpi[]
  columns: KanbanColumn[]
}

export interface CreateDealInput {
  title: string
  description?: string
  stage: DealStage
  pipelineId?: string
  value?: string | number
  currency?: string
  probability?: number
  source?: string
  contactId?: string
  companyId?: string
  assigneeId?: string
  expectedCloseDate?: string
  tags?: string[]
  company?: string
  contact?: string
}

export type UpdateDealInput = Partial<CreateDealInput>

export interface DealsListResponse {
  items?: Deal[]
  total?: number
  page?: number
  limit?: number
  groups?: Record<DealStage, DealCard[]>
  totalsByStage?: Record<DealStage, number>
}
