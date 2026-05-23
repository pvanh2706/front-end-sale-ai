export type EntityType = 'lead' | 'deal' | 'deployment'

export type TriggerType =
  | 'field_changed'
  | 'record_created'
  | 'status_changed'
  | 'assigned_to_user'
  | 'activity_added'
  | 'no_activity'
  | 'deal_won'
  | 'deal_lost'

export interface TriggerConfig {
  type: TriggerType | null
  field?: string
  fromValue?: string
  toValue?: string
  duration?: number
  durationUnit?: 'hours' | 'days' | 'weeks'
}

export type ConditionOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'is_empty'
  | 'is_not_empty'

export interface Condition {
  id: string
  field: string
  operator: ConditionOperator
  value: string
}

export type ActionType =
  | 'notify_user'
  | 'create_task'
  | 'send_email'
  | 'change_assignee'
  | 'change_stage'
  | 'add_tag'
  | 'add_comment'

export interface ActionConfig {
  id: string
  type: ActionType | null
  userIds?: string[]
  message?: string
  taskTitle?: string
  taskAssigneeId?: string
  taskDueDays?: number
  emailTo?: string
  emailSubject?: string
  emailBody?: string
  assigneeId?: string
  stageId?: string
  tag?: string
  comment?: string
}

export interface AutomationRule {
  id: string
  name: string
  description: string
  entityType: EntityType
  trigger: TriggerConfig
  conditions: Condition[]
  actions: ActionConfig[]
  active: boolean
  createdAt: string
  runCount: number
  lastRun?: string
}
