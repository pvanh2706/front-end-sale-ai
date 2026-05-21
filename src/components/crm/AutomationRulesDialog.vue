<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="flex flex-col p-0 gap-0 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-theme-xl max-w-lg overflow-hidden"
      :style="view !== 'list' ? { height: '620px' } : {}"
      :show-close-button="false"
    >
      <!-- ── HEADER ── -->
      <div class="flex items-center justify-between px-5 pt-5 pb-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <button
            v-if="view !== 'list'"
            type="button"
            class="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -ml-1"
            @click="goBack"
          >
            <ArrowLeft class="h-4 w-4" />
          </button>
          <div class="w-7 h-7 rounded-lg bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center">
            <Zap class="h-4 w-4 text-warning-500" />
          </div>
          <div>
            <span class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ headerTitle }}</span>
            <span class="ml-2 text-theme-xs text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
              {{ entityType === 'lead' ? 'Lead' : 'Deal' }}: {{ entityName }}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="$emit('update:open', false)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- ── VIEW: RULE LIST ── -->
      <div v-if="view === 'list'" class="flex flex-col">
        <!-- Empty state -->
        <div v-if="rules.length === 0" class="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div class="w-14 h-14 rounded-2xl bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center mb-4">
            <Zap class="h-7 w-7 text-warning-400" />
          </div>
          <p class="text-theme-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Chưa có automation rule</p>
          <p class="text-theme-xs text-gray-400 max-w-[260px] leading-relaxed">
            Tạo rule để tự động hóa các tác vụ khi có thay đổi trên {{ entityType === 'lead' ? 'lead' : 'deal' }} này.
          </p>
        </div>

        <!-- Rule list -->
        <div v-else class="px-5 py-3 space-y-2 max-h-72 overflow-y-auto">
          <div
            v-for="rule in rules"
            :key="rule.id"
            class="flex items-start gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 group"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              :class="rule.active ? 'bg-success-50 dark:bg-success-500/10' : 'bg-gray-100 dark:bg-gray-700'"
            >
              <component :is="getTriggerIcon(rule.trigger)" class="h-4 w-4" :class="rule.active ? 'text-success-500' : 'text-gray-400'" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-theme-sm font-medium text-gray-900 dark:text-white leading-snug">{{ rule.name }}</p>
              <p class="text-theme-xs text-gray-400 mt-0.5 leading-snug">{{ rule.description }}</p>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span class="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                  {{ TRIGGER_LABELS[rule.trigger] }}
                </span>
                <span
                  v-for="action in rule.actions"
                  :key="action"
                  class="text-[10px] bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full"
                >
                  {{ ACTION_LABELS[action] }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="button"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors opacity-0 group-hover:opacity-100"
                @click="deleteRule(rule.id)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                class="relative w-9 h-5 rounded-full transition-colors shrink-0"
                :class="rule.active ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-600'"
                @click="rule.active = !rule.active"
              >
                <span
                  class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                  :class="rule.active ? 'left-[18px]' : 'left-0.5'"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Add button -->
        <div class="px-5 pb-5 pt-3">
          <button
            type="button"
            class="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-theme-sm font-medium text-gray-500 dark:text-gray-400 hover:border-brand-300 hover:text-brand-500 dark:hover:border-brand-500/40 dark:hover:text-brand-400 py-3 transition-all"
            @click="goToTrigger"
          >
            <Plus class="h-4 w-4" />
            Thêm rule mới
          </button>
        </div>
      </div>

      <!-- ── VIEW: SELECT TRIGGER ── -->
      <div v-else-if="view === 'trigger'" class="flex flex-col flex-1 min-h-0">
        <div class="px-5 py-4 flex-1 overflow-y-auto">
          <p class="text-center text-base font-semibold text-gray-900 dark:text-white mb-1">Khi nào rule được kích hoạt?</p>
          <p class="text-center text-theme-xs text-gray-400 mb-5">Chọn sự kiện để bắt đầu luồng automation</p>

          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="t in TRIGGERS"
              :key="t.id"
              type="button"
              class="text-left rounded-xl border-2 p-4 transition-all"
              :class="selectedTrigger === t.id
                ? 'border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-brand-200 hover:bg-white dark:hover:border-brand-500/30 dark:hover:bg-gray-800'"
              @click="selectedTrigger = t.id"
            >
              <div
                class="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                :class="selectedTrigger === t.id ? 'bg-brand-100 dark:bg-brand-500/20' : 'bg-white dark:bg-gray-700'"
              >
                <component :is="t.icon" class="h-5 w-5" :class="selectedTrigger === t.id ? 'text-brand-500' : 'text-gray-400'" />
              </div>
              <p class="text-theme-sm font-semibold text-gray-900 dark:text-white leading-snug mb-1">{{ t.label }}</p>
              <p class="text-theme-xs text-gray-400 leading-snug">{{ t.desc }}</p>
            </button>
          </div>
        </div>

        <div class="shrink-0 px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            :disabled="!selectedTrigger"
            class="w-full py-2.5 rounded-xl text-theme-sm font-semibold transition-all"
            :class="selectedTrigger
              ? 'bg-brand-500 hover:bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'"
            @click="view = 'action'"
          >
            Tiếp theo
            <span v-if="selectedTrigger" class="ml-1 opacity-70">→</span>
          </button>
        </div>
      </div>

      <!-- ── VIEW: SELECT ACTIONS ── -->
      <div v-else-if="view === 'action'" class="flex flex-col flex-1 min-h-0">
        <div class="px-5 py-4 flex-1 overflow-y-auto space-y-4">
          <!-- Trigger summary -->
          <div class="flex items-center gap-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 px-4 py-3">
            <div class="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center shrink-0">
              <component :is="getTriggerById(selectedTrigger!)?.icon" class="h-4 w-4 text-brand-500" />
            </div>
            <div>
              <p class="text-theme-xs text-brand-400 font-medium uppercase tracking-wider">Khi</p>
              <p class="text-theme-sm font-semibold text-brand-700 dark:text-brand-300">{{ getTriggerById(selectedTrigger!)?.label }}</p>
            </div>
          </div>

          <!-- Rule name -->
          <div>
            <label class="text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Tên rule</label>
            <input
              v-model="newRuleName"
              type="text"
              class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-theme-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition"
              :placeholder="`VD: Gửi email khi ${getTriggerById(selectedTrigger!)?.label?.toLowerCase()}`"
            />
          </div>

          <!-- Actions -->
          <div>
            <label class="text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Hành động (chọn nhiều)</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="a in ACTIONS"
                :key="a.id"
                type="button"
                class="flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all"
                :class="selectedActions.includes(a.id)
                  ? 'border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'"
                @click="toggleAction(a.id)"
              >
                <div
                  class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  :class="selectedActions.includes(a.id) ? 'bg-brand-100 dark:bg-brand-500/20' : 'bg-white dark:bg-gray-700'"
                >
                  <component :is="a.icon" class="h-3.5 w-3.5" :class="selectedActions.includes(a.id) ? 'text-brand-500' : 'text-gray-400'" />
                </div>
                <span class="text-theme-xs font-medium" :class="selectedActions.includes(a.id) ? 'text-brand-700 dark:text-brand-300' : 'text-gray-600 dark:text-gray-400'">
                  {{ a.label }}
                </span>
                <div
                  class="ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                  :class="selectedActions.includes(a.id) ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'"
                >
                  <svg v-if="selectedActions.includes(a.id)" viewBox="0 0 8 8" class="w-2.5 h-2.5 text-white" fill="none">
                    <path d="M1.5 4L3 5.5L6.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div class="shrink-0 px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <button
            type="button"
            class="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-theme-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            @click="view = 'trigger'"
          >
            Quay lại
          </button>
          <button
            type="button"
            :disabled="selectedActions.length === 0 || !newRuleName.trim()"
            class="flex-[2] py-2.5 rounded-xl text-theme-sm font-semibold transition-all flex items-center justify-center gap-2"
            :class="selectedActions.length > 0 && newRuleName.trim()
              ? 'bg-brand-500 hover:bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'"
            @click="saveRule"
          >
            <Zap class="h-4 w-4" />
            Lưu rule
          </button>
        </div>
      </div>

    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ArrowLeft, Bell, GitBranch, Mail, Plus, RefreshCw, SquareCheckBig, Trash2, User, X, Zap,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
  open: boolean
  entityType: 'lead' | 'deal'
  entityName: string
}

type TriggerType = 'stage_change' | 'created' | 'field_update' | 'activity_added' | 'no_activity' | 'deal_won' | 'deal_lost'
type ActionType = 'send_notification' | 'create_task' | 'send_email' | 'change_assignee' | 'change_stage' | 'add_tag'

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: TriggerType
  actions: ActionType[]
  active: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const view = ref<'list' | 'trigger' | 'action'>('list')
const selectedTrigger = ref<TriggerType | null>(null)
const selectedActions = ref<ActionType[]>([])
const newRuleName = ref('')

const TRIGGERS: { id: TriggerType; label: string; desc: string; icon: unknown }[] = [
  {
    id: 'stage_change',
    label: 'Khi giai đoạn thay đổi',
    desc: 'Kích hoạt mỗi khi deal/lead chuyển sang giai đoạn mới',
    icon: GitBranch,
  },
  {
    id: 'field_update',
    label: 'Khi trường được cập nhật',
    desc: 'Kích hoạt khi bất kỳ trường dữ liệu nào bị thay đổi',
    icon: RefreshCw,
  },
  {
    id: 'no_activity',
    label: 'Không có hoạt động',
    desc: 'Kích hoạt khi không có hoạt động trong một khoảng thời gian',
    icon: Bell,
  },
  {
    id: 'activity_added',
    label: 'Khi thêm hoạt động',
    desc: 'Kích hoạt mỗi khi ghi nhận cuộc gọi, email, hay ghi chú mới',
    icon: SquareCheckBig,
  },
]

const ACTIONS: { id: ActionType; label: string; icon: unknown }[] = [
  { id: 'send_notification', label: 'Gửi thông báo', icon: Bell },
  { id: 'create_task',       label: 'Tạo tác vụ',    icon: SquareCheckBig },
  { id: 'send_email',        label: 'Gửi email',      icon: Mail },
  { id: 'change_assignee',   label: 'Đổi phụ trách',  icon: User },
  { id: 'change_stage',      label: 'Chuyển giai đoạn', icon: GitBranch },
  { id: 'add_tag',           label: 'Thêm nhãn',      icon: Zap },
]

const TRIGGER_LABELS: Record<TriggerType, string> = {
  stage_change:    'Đổi giai đoạn',
  created:         'Vừa tạo',
  field_update:    'Cập nhật trường',
  activity_added:  'Thêm hoạt động',
  no_activity:     'Không có HĐ',
  deal_won:        'Deal thắng',
  deal_lost:       'Deal thua',
}

const ACTION_LABELS: Record<ActionType, string> = {
  send_notification: 'Thông báo',
  create_task:       'Tạo tác vụ',
  send_email:        'Gửi email',
  change_assignee:   'Đổi phụ trách',
  change_stage:      'Đổi giai đoạn',
  add_tag:           'Thêm nhãn',
}

const rules = ref<AutomationRule[]>([])

const headerTitle = computed(() => {
  if (view.value === 'trigger') return 'Chọn trigger'
  if (view.value === 'action') return 'Cấu hình hành động'
  return 'Automation Rules'
})

function getTriggerById(id: TriggerType) {
  return TRIGGERS.find((t) => t.id === id)
}

function getTriggerIcon(trigger: TriggerType) {
  return TRIGGERS.find((t) => t.id === trigger)?.icon ?? Zap
}

function toggleAction(id: ActionType) {
  const idx = selectedActions.value.indexOf(id)
  if (idx === -1) selectedActions.value.push(id)
  else selectedActions.value.splice(idx, 1)
}

function goToTrigger() {
  view.value = 'trigger'
}

function goBack() {
  if (view.value === 'action') view.value = 'trigger'
  else view.value = 'list'
}

function saveRule() {
  if (!selectedTrigger.value || selectedActions.value.length === 0 || !newRuleName.value.trim()) return
  const trigger = getTriggerById(selectedTrigger.value)!
  rules.value.unshift({
    id: Date.now().toString(),
    name: newRuleName.value.trim(),
    description: `${trigger.label} → ${selectedActions.value.map((a) => ACTION_LABELS[a]).join(', ')}`,
    trigger: selectedTrigger.value,
    actions: [...selectedActions.value],
    active: true,
  })
  toast.success('Đã tạo automation rule')
  resetForm()
  view.value = 'list'
}

function deleteRule(id: string) {
  rules.value = rules.value.filter((r) => r.id !== id)
  toast.success('Đã xóa rule')
}

function resetForm() {
  selectedTrigger.value = null
  selectedActions.value = []
  newRuleName.value = ''
}

watch(() => props.open, (val) => {
  if (!val) {
    view.value = 'list'
    resetForm()
  }
})
</script>
