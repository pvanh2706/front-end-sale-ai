<template>
  <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
    <!-- Header -->
    <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2">
        <Users class="h-5 w-5 text-brand-500" />
        <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Báo cáo doanh thu</h2>
      </div>

      <div class="flex items-center gap-3">
        <!-- Period selector -->
        <select
          v-model="activePeriod"
          class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-theme-xs text-gray-700 outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>

        <!-- Segment tabs -->
        <div class="flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
          <button
            v-for="seg in segments"
            :key="seg.key"
            type="button"
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-theme-xs font-medium transition-colors"
            :class="
              activeSegment === seg.key
                ? 'bg-brand-500 text-white shadow-theme-xs'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            "
            @click="activeSegment = seg.key"
          >
            <component :is="seg.icon" class="h-3.5 w-3.5" />
            {{ seg.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Summary KPI row -->
    <div class="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div v-for="kpi in summaryKpis" :key="kpi.label" class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
        <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
        <p class="mt-1 text-theme-sm font-semibold" :class="kpi.valueClass">{{ kpi.value }}</p>
      </div>
    </div>

    <!-- Main content: chart + table -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <!-- Horizontal bar chart -->
      <div class="lg:col-span-3">
        <div class="h-64">
          <VChart :option="chartOption" autoresize class="h-full w-full" />
        </div>
      </div>

      <!-- Leaderboard table -->
      <div class="lg:col-span-2">
        <p class="mb-3 text-theme-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {{ activeSegment === 'employee' ? 'Xếp hạng nhân viên' : 'Xếp hạng team' }}
        </p>
        <div class="space-y-2.5">
          <div
            v-for="(item, idx) in rankedData"
            :key="item.name"
            class="flex items-center gap-3"
          >
            <!-- Rank badge -->
            <div
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-theme-xs font-bold"
              :class="rankClass(idx)"
            >
              {{ idx + 1 }}
            </div>

            <!-- Info -->
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-1">
                <p class="truncate text-theme-xs font-medium text-gray-900 dark:text-white">{{ item.name }}</p>
                <span class="shrink-0 text-theme-xs font-semibold" :class="item.rate >= 100 ? 'text-success-500' : item.rate >= 80 ? 'text-warning-500' : 'text-error-500'">
                  {{ item.rate }}%
                </span>
              </div>
              <!-- Progress bar -->
              <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="item.rate >= 100 ? 'bg-success-500' : item.rate >= 80 ? 'bg-warning-500' : 'bg-error-400'"
                  :style="{ width: `${Math.min(item.rate, 100)}%` }"
                />
              </div>
              <p class="mt-0.5 text-theme-xs text-gray-400">{{ item.revenue }} / {{ item.target }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Layers, User, Users } from 'lucide-vue-next'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([BarChart, GridComponent, TooltipComponent, LegendComponent, CanvasRenderer])

type Segment = 'employee' | 'team'
type Period = 'month' | 'quarter' | 'year'

const activeSegment = ref<Segment>('employee')
const activePeriod = ref<Period>('month')

const segments = [
  { key: 'employee' as Segment, label: 'Nhân viên', icon: User },
  { key: 'team' as Segment, label: 'Team', icon: Layers },
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const employeeData: Record<Period, { name: string; revenue: number; target: number }[]> = {
  month: [
    { name: 'Nguyễn Văn Minh', revenue: 3200, target: 3000 },
    { name: 'Đỗ Thị Hoa',      revenue: 2400, target: 2500 },
    { name: 'Trần Thị Lan',    revenue: 2800, target: 3000 },
    { name: 'Lê Thị Mai',      revenue: 1900, target: 2000 },
    { name: 'Phạm Đức Hùng',   revenue: 2100, target: 2500 },
    { name: 'Hoàng Văn Nam',   revenue: 1500, target: 2000 },
  ],
  quarter: [
    { name: 'Nguyễn Văn Minh', revenue: 9400, target: 9000 },
    { name: 'Trần Thị Lan',    revenue: 8200, target: 9000 },
    { name: 'Đỗ Thị Hoa',      revenue: 7600, target: 7500 },
    { name: 'Phạm Đức Hùng',   revenue: 6100, target: 7500 },
    { name: 'Lê Thị Mai',      revenue: 5700, target: 6000 },
    { name: 'Hoàng Văn Nam',   revenue: 4200, target: 6000 },
  ],
  year: [
    { name: 'Nguyễn Văn Minh', revenue: 36000, target: 34000 },
    { name: 'Trần Thị Lan',    revenue: 31500, target: 34000 },
    { name: 'Đỗ Thị Hoa',      revenue: 28700, target: 28000 },
    { name: 'Phạm Đức Hùng',   revenue: 23400, target: 28000 },
    { name: 'Lê Thị Mai',      revenue: 21800, target: 24000 },
    { name: 'Hoàng Văn Nam',   revenue: 16900, target: 24000 },
  ],
}

const teamData: Record<Period, { name: string; revenue: number; target: number }[]> = {
  month: [
    { name: 'Team Bắc',   revenue: 6000, target: 5500 },
    { name: 'Team Nam',   revenue: 4300, target: 5000 },
    { name: 'Team Trung', revenue: 3200, target: 3500 },
    { name: 'Team Online',revenue: 2800, target: 3000 },
  ],
  quarter: [
    { name: 'Team Bắc',   revenue: 17400, target: 16500 },
    { name: 'Team Nam',   revenue: 12600, target: 15000 },
    { name: 'Team Trung', revenue: 9400,  target: 10500 },
    { name: 'Team Online',revenue: 8100,  target: 9000 },
  ],
  year: [
    { name: 'Team Bắc',   revenue: 67000, target: 62000 },
    { name: 'Team Nam',   revenue: 48000, target: 56000 },
    { name: 'Team Trung', revenue: 36500, target: 40000 },
    { name: 'Team Online',revenue: 30500, target: 34000 },
  ],
}

// ─── Computed ─────────────────────────────────────────────────────────────────

const currentRaw = computed(() =>
  activeSegment.value === 'employee'
    ? employeeData[activePeriod.value]
    : teamData[activePeriod.value],
)

// Sorted descending by revenue
const rankedData = computed(() =>
  [...currentRaw.value]
    .sort((a, b) => b.revenue - a.revenue)
    .map((d) => ({
      ...d,
      rate: Math.round((d.revenue / d.target) * 100),
      revenue: d.revenue >= 1000 ? `${(d.revenue / 1000).toFixed(1)} tỷ` : `${d.revenue} tr`,
      target:  d.target  >= 1000 ? `${(d.target  / 1000).toFixed(1)} tỷ` : `${d.target} tr`,
    })),
)

const summaryKpis = computed(() => {
  const data = currentRaw.value
  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0)
  const totalTarget  = data.reduce((s, d) => s + d.target,  0)
  const achieved     = data.filter((d) => d.revenue >= d.target).length
  const avgRate      = Math.round((totalRevenue / totalTarget) * 100)

  const fmt = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)} tỷ` : `${v} tr`

  return [
    { label: 'Tổng doanh thu', value: fmt(totalRevenue), valueClass: 'text-brand-500' },
    { label: 'Tổng mục tiêu',  value: fmt(totalTarget),  valueClass: 'text-gray-700 dark:text-gray-200' },
    { label: 'Đạt mục tiêu',   value: `${achieved}/${data.length}`, valueClass: achieved === data.length ? 'text-success-500' : 'text-warning-500' },
    { label: 'Tỷ lệ hoàn thành', value: `${avgRate}%`,  valueClass: avgRate >= 100 ? 'text-success-500' : avgRate >= 80 ? 'text-warning-500' : 'text-error-500' },
  ]
})

// ─── Chart option (horizontal bar) ───────────────────────────────────────────

const chartOption = computed(() => {
  const sorted = [...currentRaw.value].sort((a, b) => a.revenue - b.revenue) // ascending for horizontal bar (bottom = highest)
  const names    = sorted.map((d) => d.name)
  const revenues = sorted.map((d) => d.revenue)
  const targets  = sorted.map((d) => d.target)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: { seriesName: string; value: number }[]) =>
        params.map((p) => {
          const v = p.value >= 1000 ? `${(p.value / 1000).toFixed(1)} tỷ` : `${p.value} tr`
          return `${p.seriesName}: <b>${v} VND</b>`
        }).join('<br/>'),
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
    grid: { top: 28, right: 16, bottom: 8, left: 8 },
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#667085',
        fontSize: 10,
        formatter: (v: number) => v >= 1000 ? `${v / 1000}tỷ` : `${v}tr`,
      },
      splitLine: { lineStyle: { color: '#f2f4f7', type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        color: '#667085',
        fontSize: 11,
        width: 110,
        overflow: 'truncate',
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: 'Doanh thu',
        type: 'bar',
        data: revenues,
        barMaxWidth: 20,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#8ea5ff' },
              { offset: 1, color: '#465fff' },
            ],
          },
          borderRadius: [0, 4, 4, 0],
        },
      },
      {
        name: 'Mục tiêu',
        type: 'bar',
        data: targets,
        barMaxWidth: 20,
        itemStyle: {
          color: 'transparent',
          borderColor: '#f79009',
          borderWidth: 1.5,
          borderType: 'dashed',
          borderRadius: [0, 4, 4, 0],
        },
      },
    ],
  }
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rankClass(idx: number): string {
  if (idx === 0) return 'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400'
  if (idx === 1) return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
  if (idx === 2) return 'bg-orange-50 text-orange-500 dark:bg-orange-500/10 dark:text-orange-400'
  return 'bg-gray-50 text-gray-400 dark:bg-gray-800/50 dark:text-gray-500'
}
</script>
