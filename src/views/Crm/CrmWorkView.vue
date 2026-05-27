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

      <!-- AI Chat CTA -->
      <div class="flex flex-col gap-3 rounded-xl border border-brand-200 bg-gradient-to-r from-brand-50 to-white px-5 py-4 dark:border-brand-500/30 dark:from-brand-500/10 dark:to-gray-900 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 shadow-theme-sm">
            <Sparkles class="h-5 w-5 text-white" />
          </div>
          <div>
            <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">Hỏi đáp với AI</p>
            <p class="text-theme-xs text-gray-500 dark:text-gray-400">Tổng hợp công việc hôm nay, phân tích pipeline và dự báo rủi ro ngay lập tức</p>
          </div>
        </div>
        <Button type="button" class="shrink-0 gap-2 bg-brand-500 text-white hover:bg-brand-600" @click="handleAiChat">
          <MessageCircle class="h-4 w-4" />
          Mở chat AI
        </Button>
      </div>

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

      <RevenueChart />

      <RevenueDashboard />

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import {
  CalendarPlus,
  ClipboardList,
  Handshake,
  MessageCircle,
  PersonStanding,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-vue-next'

import { RouterLink } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import { useCrmStore } from '@/stores/useCrmStore'
import RevenueChart from '@/components/crm/RevenueChart.vue'
import RevenueDashboard from '@/components/crm/RevenueDashboard.vue'
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

const router = useRouter()
const pageTitle = ref('CRM & Công việc')
const crmStore = useCrmStore()
const { kpis, pipeline, error, totalTasksToday } = storeToRefs(crmStore)

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

onMounted(() => {
  void crmStore.fetchDashboard()
})

function handleAddTask(): void {
  toast.success('Mở form thêm công việc')
}

function handleAiChat(): void {
  void router.push('/crm-ai-chat')
}
</script>
