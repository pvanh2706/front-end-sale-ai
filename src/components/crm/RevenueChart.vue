<template>
  <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
    <!-- Header -->
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2">
        <BarChart2 class="h-5 w-5 text-brand-500" />
        <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Biểu đồ doanh thu</h2>
      </div>

      <div class="flex items-center gap-2">
        <!-- Set target button -->
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-warning-200 bg-warning-50 px-3 py-1.5 text-theme-xs font-medium text-warning-600 transition-colors hover:bg-warning-100 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400 dark:hover:bg-warning-500/20"
          @click="openDialog"
        >
          <Target class="h-3.5 w-3.5" />
          Thêm mục tiêu
        </button>

        <!-- Period Tabs -->
        <div class="flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="rounded-md px-3 py-1.5 text-theme-xs font-medium transition-colors"
            :class="
              activeTab === tab.key
                ? 'bg-brand-500 text-white shadow-theme-xs'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            "
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Summary KPIs -->
    <div class="mb-5 grid grid-cols-3 gap-3">
      <div
        v-for="kpi in currentKpis"
        :key="kpi.label"
        class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
      >
        <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
        <p class="mt-1 text-theme-sm font-semibold" :class="kpi.valueClass">{{ kpi.value }}</p>
        <p class="mt-0.5 flex items-center gap-0.5 text-theme-xs" :class="kpi.changeClass">
          <TrendingUp v-if="kpi.up" class="h-3 w-3" />
          <TrendingDown v-else class="h-3 w-3" />
          {{ kpi.change }}
        </p>
      </div>
    </div>

    <!-- Chart -->
    <div class="h-56 w-full">
      <VChart :option="chartOption" autoresize class="h-full w-full" />
    </div>

    <!-- ── Set Target Dialog ───────────────────────────────────────────────── -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-50 dark:bg-warning-500/15">
              <Target class="h-4 w-4 text-warning-500" />
            </div>
            Thiết lập mục tiêu doanh thu
          </DialogTitle>
          <DialogDescription>
            Đặt mục tiêu cho từng tháng. Đường mục tiêu sẽ cập nhật ngay trên biểu đồ.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-1">
          <!-- Month select -->
          <div class="space-y-1.5">
            <Label>Tháng</Label>
            <Select v-model="form.monthIdx">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Chọn tháng..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="(label, idx) in monthLabels"
                  :key="idx"
                  :value="String(idx)"
                >
                  {{ label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Target value -->
          <div class="space-y-1.5">
            <Label>Mục tiêu doanh thu (triệu VND)</Label>
            <div class="relative">
              <Input
                v-model="form.value"
                type="number"
                min="0"
                placeholder="Ví dụ: 2500"
                class="pr-16"
              />
              <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-theme-xs text-gray-400">
                tr VND
              </span>
            </div>
            <p v-if="currentTargetDisplay" class="text-theme-xs text-gray-400">
              Mục tiêu hiện tại: <span class="font-medium text-warning-500">{{ currentTargetDisplay }}</span>
            </p>
          </div>

          <!-- Quick presets -->
          <div>
            <p class="mb-2 text-theme-xs text-gray-400">Gợi ý nhanh</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="preset in presets"
                :key="preset.label"
                type="button"
                class="rounded-md border border-gray-200 px-2.5 py-1 text-theme-xs text-gray-600 transition-colors hover:border-warning-300 hover:bg-warning-50 hover:text-warning-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-warning-500/40 dark:hover:bg-warning-500/10"
                @click="form.value = preset.value"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button
            class="bg-warning-500 text-white hover:bg-warning-600"
            :disabled="!form.value || !form.monthIdx"
            @click="handleSave"
          >
            Lưu mục tiêu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </article>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { BarChart2, Target, TrendingDown, TrendingUp } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

use([BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent, MarkLineComponent, CanvasRenderer])

type Period = 'day' | 'week' | 'month'

const tabs = [
  { key: 'day' as Period, label: 'Ngày' },
  { key: 'week' as Period, label: 'Tuần' },
  { key: 'month' as Period, label: 'Tháng' },
]

const activeTab = ref<Period>('month')

// ─── Reactive month targets ───────────────────────────────────────────────────

const monthLabels = ['T6/24', 'T7/24', 'T8/24', 'T9/24', 'T10/24', 'T11/24', 'T12/24', 'T1/25', 'T2/25', 'T3/25', 'T4/25', 'T5/25']
const monthTargets = ref<number[]>([1500, 1500, 1500, 1800, 1800, 2000, 2000, 2000, 2000, 2500, 2500, 2500])

// ─── Mock Data ────────────────────────────────────────────────────────────────

const dayData = {
  labels: ['13/5', '14/5', '15/5', '16/5', '17/5', '18/5', '19/5', '20/5', '21/5', '22/5', '23/5', '24/5', '25/5', '26/5'],
  revenue: [42, 58, 35, 70, 83, 61, 45, 90, 74, 55, 68, 92, 48, 110],
  target:  [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
  kpis: { total: '831tr', avg: '59.4tr', best: '110tr', totalChange: '+12.4%', avgChange: '+8.1%', bestChange: '+22%', totalUp: true, avgUp: true, bestUp: true },
}

const weekData = {
  labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
  revenue: [320, 410, 285, 560, 490, 610, 430, 720, 540, 680, 590, 760],
  target:  [400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400, 400],
  kpis: { total: '6.4 tỷ', avg: '533tr', best: '760tr', totalChange: '+18.3%', avgChange: '+11.5%', bestChange: '+15%', totalUp: true, avgUp: true, bestUp: true },
}

const monthData = computed(() => ({
  labels: monthLabels,
  revenue: [1200, 1450, 980, 1680, 1920, 2100, 2450, 1800, 1650, 2300, 2780, 3100],
  target: monthTargets.value,
  kpis: { total: '23.4 tỷ', avg: '1.95 tỷ', best: '3.1 tỷ', totalChange: '+31.2%', avgChange: '+19.8%', bestChange: '+25%', totalUp: true, avgUp: true, bestUp: true },
}))

const dataMap = computed(() => ({
  day: dayData,
  week: weekData,
  month: monthData.value,
}))

// ─── KPI cards ───────────────────────────────────────────────────────────────

const currentKpis = computed(() => {
  const d = dataMap.value[activeTab.value].kpis
  return [
    { label: 'Tổng doanh thu', value: d.total, change: d.totalChange, up: d.totalUp, valueClass: 'text-brand-500', changeClass: d.totalUp ? 'text-success-500' : 'text-error-500' },
    { label: 'Trung bình', value: d.avg, change: d.avgChange, up: d.avgUp, valueClass: 'text-gray-900 dark:text-white', changeClass: d.avgUp ? 'text-success-500' : 'text-error-500' },
    { label: 'Cao nhất', value: d.best, change: d.bestChange, up: d.bestUp, valueClass: 'text-success-500', changeClass: d.bestUp ? 'text-success-500' : 'text-error-500' },
  ]
})

// ─── Dialog state ─────────────────────────────────────────────────────────────

const showDialog = ref(false)

const form = reactive({
  monthIdx: '',
  value: '',
})

const presets = [
  { label: '1 tỷ', value: '1000' },
  { label: '1.5 tỷ', value: '1500' },
  { label: '2 tỷ', value: '2000' },
  { label: '2.5 tỷ', value: '2500' },
  { label: '3 tỷ', value: '3000' },
]

const currentTargetDisplay = computed(() => {
  if (form.monthIdx === '') return ''
  const idx = Number(form.monthIdx)
  const val = monthTargets.value[idx]
  return val >= 1000 ? `${val / 1000} tỷ VND` : `${val} tr VND`
})

// Pre-fill current target when month changes
watch(() => form.monthIdx, (idx) => {
  if (idx !== '') {
    form.value = String(monthTargets.value[Number(idx)])
  }
})

function openDialog() {
  // Default to last month (T5/25)
  form.monthIdx = String(monthLabels.length - 1)
  form.value = String(monthTargets.value[monthLabels.length - 1])
  showDialog.value = true
}

function handleSave() {
  const idx = Number(form.monthIdx)
  const val = Number(form.value)
  if (!form.value || isNaN(val) || val <= 0) return

  monthTargets.value = monthTargets.value.map((t, i) => (i === idx ? val : t))
  showDialog.value = false
  toast.success(`Đã cập nhật mục tiêu ${monthLabels[idx]}: ${val >= 1000 ? `${val / 1000} tỷ` : `${val} tr`} VND`)
}

// ─── ECharts option ──────────────────────────────────────────────────────────

const chartOption = computed(() => {
  const current = dataMap.value[activeTab.value]

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: { seriesName: string; value: number }[]) =>
        params.map((p) => `${p.seriesName}: <b>${p.value} tr VND</b>`).join('<br/>'),
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: { color: '#f1f5f9', fontSize: 12 },
    },
    legend: {
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { color: '#667085', fontSize: 12 },
    },
    grid: { top: 32, right: 12, bottom: 32, left: 58 },
    xAxis: {
      type: 'category',
      data: current.labels,
      axisLabel: { color: '#667085', fontSize: 11 },
      axisLine: { lineStyle: { color: '#e4e7ec' } },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#667085',
        fontSize: 11,
        formatter: (val: number) => (val >= 1000 ? `${val / 1000}tỷ` : `${val}tr`),
      },
      splitLine: { lineStyle: { color: '#f2f4f7', type: 'dashed' } },
    },
    series: [
      {
        name: 'Doanh thu',
        type: 'bar',
        data: current.revenue,
        barMaxWidth: 36,
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#465fff' }, { offset: 1, color: '#8ea5ff' }] },
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          itemStyle: {
            color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#3641f5' }, { offset: 1, color: '#465fff' }] },
          },
        },
      },
      {
        name: 'Mục tiêu',
        type: 'line',
        data: current.target,
        symbol: 'none',
        lineStyle: { color: '#f79009', width: 1.5, type: 'dashed' },
        itemStyle: { color: '#f79009' },
      },
    ],
  }
})
</script>
