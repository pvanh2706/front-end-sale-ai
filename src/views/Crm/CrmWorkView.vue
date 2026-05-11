<template>
  <AdminLayout>
    <div class="space-y-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-950 md:p-6">
      <header class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 class="text-title-xs font-semibold text-gray-900 dark:text-white">Chào buổi sáng, Viên!</h1>
          <p class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">Hôm nay bạn có {{ totalTasksToday }} công việc cần xử lý</p>
          <p v-if="error" class="mt-1 text-theme-xs text-error-500">{{ error }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" class="gap-1.5 border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200" @click="handleAddTask">
            <ClipboardList class="h-4 w-4" />
            Thêm công việc
          </Button>
        </div>
      </header>

      <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="stat in kpiStats" :key="stat.id" class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
              <p class="mt-2 text-title-xs font-semibold" :class="stat.valueClass">{{ stat.value }}</p>
              <p class="mt-1 flex items-center gap-1 text-theme-xs" :class="stat.changeClass">
                <TrendingUp v-if="stat.trend === 'up'" class="h-3.5 w-3.5" />
                <TrendingDown v-else class="h-3.5 w-3.5" />
                {{ stat.changeText }}
              </p>
            </div>
            <div class="rounded-lg p-2" :class="stat.iconBoxClass">
              <component :is="stat.icon" class="h-4 w-4" />
            </div>
          </div>
        </article>
      </section>

      <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Pipeline tổng quan</h2>
          <RouterLink to="/crm-deals" class="text-xs text-brand-500 hover:underline dark:text-brand-400">
            Mở Kanban →
          </RouterLink>
        </div>
        <div class="overflow-x-auto custom-scrollbar pb-2">
          <div class="flex min-w-[780px] gap-4">
            <article v-for="stage in pipelineStages" :key="stage.id" class="min-w-[140px] flex-1">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-theme-xs text-gray-500 dark:text-gray-400">{{ stage.name }}</span>
                <span class="text-theme-xs font-medium text-gray-700 dark:text-gray-200">{{ stage.count }}</span>
              </div>
              <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div class="h-full rounded-full" :class="stage.barColorClass" :style="{ width: `${stage.percent}%` }" />
              </div>
              <p class="mt-2 text-theme-xs font-semibold text-gray-700 dark:text-gray-200">{{ stage.value }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div class="space-y-6 xl:col-span-2">
          <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-theme-xl font-semibold text-gray-900 dark:text-white">
                <ListTodo class="h-5 w-5 text-brand-500" />
                Công việc hôm nay
              </h3>
              <Button type="button" variant="ghost" size="sm" class="text-brand-500 hover:text-brand-600" @click="handleViewAllTasks">Xem tất cả</Button>
            </div>

            <div class="space-y-2">
              <div v-for="task in todayTasks" :key="task.id" class="group flex items-center gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-800 dark:hover:bg-gray-950">
                <Checkbox :checked="task.done" :disabled="loading" @update:checked="handleToggleTask(task.id, $event)" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-theme-sm font-medium text-gray-900 dark:text-white" :class="task.done ? 'line-through text-gray-400 dark:text-gray-500' : ''">{{ task.title }}</p>
                  <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ task.meta }}</p>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" class="opacity-0 transition-opacity group-hover:opacity-100">
                  <MoreVertical class="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </article>

          <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center gap-2 text-theme-xl font-semibold text-gray-900 dark:text-white">
                <Flame class="h-5 w-5 text-error-500" />
                Deal cần ưu tiên
              </h3>
            </div>
            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <article v-for="deal in priorityDeals" :key="deal.name" class="rounded-lg border border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-800 dark:hover:border-brand-500/40">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ deal.name }}</h4>
                  <Badge :class="deal.stageClass">{{ deal.stage }}</Badge>
                </div>
                <div class="mt-3 flex items-end gap-1">
                  <span class="text-theme-xl font-semibold text-brand-500">{{ deal.value }}</span>
                  <span class="pb-0.5 text-theme-xs text-gray-500 dark:text-gray-400">VND</span>
                </div>
                <Button type="button" variant="outline" size="sm" class="mt-3 w-full border-gray-300 text-brand-500 hover:bg-brand-500 hover:text-white dark:border-gray-700" @click="handleContactDeal(deal.name)">
                  Liên hệ ngay
                </Button>
              </article>
            </div>
          </article>
        </div>

        <div class="space-y-6">
          <article class="relative overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-success-50 p-5 dark:border-brand-500/30 dark:from-brand-500/10 dark:via-gray-900 dark:to-success-500/10">
            <div class="relative z-10 mb-4 flex items-center gap-2">
              <Sparkles class="h-5 w-5 text-brand-500" />
              <h3 class="text-theme-xl font-semibold text-brand-500">Gợi ý AI</h3>
            </div>
            <div class="relative z-10 space-y-3">
              <article v-for="advice in aiSuggestions" :key="advice.title" class="rounded-lg border border-white/70 bg-white/90 p-3 shadow-theme-xs backdrop-blur-sm dark:border-white/10 dark:bg-gray-900/80">
                <p class="text-theme-xs font-semibold text-brand-500">{{ advice.title }}</p>
                <p class="mt-1 text-theme-sm text-gray-700 dark:text-gray-300">{{ advice.content }}</p>
              </article>
            </div>
            <Sparkles class="absolute -bottom-6 -right-6 h-20 w-20 text-brand-500/10" />
          </article>

          <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <h3 class="mb-4 text-theme-xl font-semibold text-gray-900 dark:text-white">Thông báo gần đây</h3>
            <div class="space-y-4">
              <div v-for="notice in notifications" :key="notice.id" class="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" :class="notice.iconBgClass">
                  <component :is="notice.icon" class="h-4 w-4" :class="notice.iconClass" />
                </div>
                <div>
                  <p class="text-theme-sm text-gray-700 dark:text-gray-300">{{ notice.content }}</p>
                  <p class="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">{{ notice.time }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <footer class="grid grid-cols-2 gap-3 pb-2 md:grid-cols-4">
        <Button v-for="action in quickActions" :key="action.label" type="button" variant="outline" class="h-auto flex-col gap-2 rounded-xl border-gray-200 bg-white py-4 text-center text-gray-700 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-brand-500/10" @click="handleQuickAction(action.label)">
          <component :is="action.icon" class="h-5 w-5 text-brand-500" />
          <span class="text-theme-sm font-medium">{{ action.label }}</span>
        </Button>
      </footer>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import {
  BarChart3,
  Bell,
  CalendarPlus,
  ClipboardList,
  Flame,
  Handshake,
  ListTodo,
  Mail,
  MessageCircle,
  MoreVertical,
  PersonStanding,
  Settings2,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-vue-next'

import { RouterLink } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useCrmStore } from '@/stores/useCrmStore'
import type { CrmMetricTone } from '@/types/crm'

interface KpiStat {
  id: string
  label: string
  value: string
  valueClass: string
  trend: 'up' | 'down'
  changeText: string
  changeClass: string
  icon: unknown
  iconBoxClass: string
}

interface PipelineStage {
  id: string
  name: string
  count: number
  percent: number
  value: string
  barColorClass: string
}

interface PriorityDeal {
  name: string
  stage: string
  value: string
  stageClass: string
}

interface AiSuggestion {
  title: string
  content: string
}

interface NotificationItem {
  id: number
  content: string
  time: string
  icon: unknown
  iconBgClass: string
  iconClass: string
}

interface QuickAction {
  label: string
  icon: unknown
}

const router = useRouter()
const pageTitle = ref('CRM & Công việc')
const crmStore = useCrmStore()
const { kpis, pipeline, tasks, loading, error, totalTasksToday } = storeToRefs(crmStore)

const metricIcons: Record<string, unknown> = {
  'leads-new': PersonStanding,
  'deals-tracked': Handshake,
  'tasks-today': CalendarPlus,
  'conversion-rate': Target,
}

function metricValueClass(tone: CrmMetricTone): string {
  if (tone === 'success') return 'text-success-500'
  if (tone === 'warning') return 'text-warning-500'
  if (tone === 'error') return 'text-error-500'
  return 'text-brand-500'
}

function metricChangeClass(tone: CrmMetricTone): string {
  if (tone === 'warning') return 'text-gray-500 dark:text-gray-400'
  if (tone === 'error') return 'text-error-500'
  return 'text-success-500'
}

function metricIconBoxClass(tone: CrmMetricTone): string {
  if (tone === 'success') return 'bg-success-50 text-success-500 dark:bg-success-500/15 dark:text-success-300'
  if (tone === 'warning') return 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300'
  if (tone === 'error') return 'bg-error-50 text-error-500 dark:bg-error-500/15 dark:text-error-300'
  return 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300'
}

function pipelineBarColorClass(tone: CrmMetricTone): string {
  if (tone === 'success') return 'bg-success-500'
  if (tone === 'warning') return 'bg-warning-500'
  if (tone === 'error') return 'bg-error-500'
  return 'bg-brand-500'
}

const kpiStats = computed<KpiStat[]>(() => kpis.value.map((metric) => ({
  id: metric.id,
  label: metric.label,
  value: metric.value,
  valueClass: metricValueClass(metric.tone),
  trend: metric.trend,
  changeText: metric.changeText,
  changeClass: metricChangeClass(metric.tone),
  icon: metricIcons[metric.id] ?? Target,
  iconBoxClass: metricIconBoxClass(metric.tone),
})))

const pipelineStages = computed<PipelineStage[]>(() => pipeline.value.map((stage) => ({
  id: stage.id,
  name: stage.name,
  count: stage.count,
  percent: stage.percent,
  value: stage.value,
  barColorClass: pipelineBarColorClass(stage.tone),
})))

const todayTasks = computed(() => tasks.value)

const priorityDeals = ref<PriorityDeal[]>([
  {
    name: 'Dự án SmartCity',
    stage: 'Negotiation',
    value: '1,2 tỷ',
    stageClass: 'bg-warning-50 text-warning-500 dark:bg-warning-500/20 dark:text-warning-300',
  },
  {
    name: 'Vận tải Hùng Cường',
    stage: 'Proposal',
    value: '350tr',
    stageClass: 'bg-brand-50 text-brand-500 dark:bg-brand-500/20 dark:text-brand-300',
  },
])

const aiSuggestions = ref<AiSuggestion[]>([
  {
    title: 'Nhắc nhở follow-up',
    content: 'Mr. Nam chưa phản hồi email 3 ngày. Gợi ý gửi thêm tin nhắn Zalo.',
  },
  {
    title: 'Cơ hội chốt deal',
    content: 'Deal TechPro ở stage Proposal quá lâu. Bạn có thể đề xuất ưu đãi 5%.',
  },
])

const notifications = ref<NotificationItem[]>([
  {
    id: 1,
    content: 'Bạn có email mới từ khách hàng Hòa Phát',
    time: '15 phút trước',
    icon: Mail,
    iconBgClass: 'bg-brand-50 dark:bg-brand-500/15',
    iconClass: 'text-brand-500 dark:text-brand-300',
  },
  {
    id: 2,
    content: 'Dự án Vinhomes đã chuyển sang stage Won',
    time: '2 giờ trước',
    icon: Bell,
    iconBgClass: 'bg-success-50 dark:bg-success-500/15',
    iconClass: 'text-success-500 dark:text-success-300',
  },
])

const quickActions = ref<QuickAction[]>([
  { label: 'Hỏi đáp AI', icon: MessageCircle },
  { label: 'Mở lịch hẹn', icon: CalendarPlus },
  { label: 'Báo cáo nhanh', icon: BarChart3 },
  { label: 'Config Pipeline', icon: Settings2 },
])

onMounted(() => {
  void crmStore.fetchDashboard()
})

function handleAddTask(): void {
  toast.success('Mở form thêm công việc')
}

function handleViewAllTasks(): void {
  void router.push('/crm-deals')
}

function handleToggleTask(taskId: string, checked: boolean | 'indeterminate'): void {
  void crmStore.setTaskDone(taskId, checked === true)
}

function handleContactDeal(dealName: string): void {
  toast.success(`Đã tạo nhắc lịch liên hệ cho ${dealName}`)
}

function handleQuickAction(actionName: string): void {
  toast.info(`Đang mở: ${actionName}`)
}
</script>
