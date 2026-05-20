<template>
  <AdminLayout>
    <div class="-m-4 md:-m-6 flex items-start gap-0 min-h-[calc(100vh-64px)]">
      <!-- ===== LEFT SIDEBAR (30%) ===== -->
      <aside class="hidden lg:flex w-[30%] min-w-[280px] max-w-[380px] flex-col gap-4 p-5 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <!-- Back to Kanban -->
        <button
          type="button"
          class="flex items-center gap-2 self-start rounded-lg px-3 py-1.5 text-theme-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          @click="router.push('/crm-deals')"
        >
          <ArrowLeft class="h-4 w-4" />
          Quay lại Kanban
        </button>

        <!-- Deal Summary Card -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs p-5">
          <!-- Avatar + title -->
          <div class="flex items-start gap-3 mb-5">
            <div class="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 text-xl font-bold shrink-0 overflow-hidden">
              <span v-if="!dealData?.companyName">{{ deal.title.charAt(0) }}</span>
              <span v-else>{{ deal.title.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white leading-tight truncate" :title="deal.title">
                {{ deal.title }}
              </h2>
              <p class="text-theme-xs text-gray-400 mt-0.5">Deal ID: #{{ deal.code }}</p>
            </div>
          </div>

          <!-- Pipeline progress -->
          <div class="space-y-2 mb-5">
            <div class="flex justify-between text-theme-xs font-medium text-gray-400 uppercase tracking-wider">
              <span>{{ currentStageLabel }}</span>
              <span>{{ stageProgress }}%</span>
            </div>
            <div class="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-brand-500 rounded-full transition-all duration-500"
                :style="{ width: `${stageProgress}%` }"
              />
            </div>
            <div class="flex gap-1">
              <div
                v-for="(stage, idx) in stages.slice(0, -1)"
                :key="stage.id"
                class="h-1 flex-1 rounded-full transition-all"
                :class="idx < currentStageIndex ? 'bg-brand-500' : idx === currentStageIndex ? 'bg-brand-300' : 'bg-gray-200 dark:bg-gray-700'"
              />
            </div>
          </div>

          <!-- Metrics tiles -->
          <div class="grid grid-cols-3 gap-2 mb-5">
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <p class="text-theme-xs text-gray-400 mb-1">Giá trị</p>
              <p class="text-theme-sm font-bold text-brand-500 leading-tight">{{ deal.shortValue }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center border-l-2 border-brand-500">
              <p class="text-theme-xs text-gray-400 mb-1">Xác suất</p>
              <p class="text-theme-sm font-bold text-brand-600 dark:text-brand-400">{{ deal.probability }}%</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <p class="text-theme-xs text-gray-400 mb-1">Đóng dự kiến</p>
              <p class="text-theme-xs font-bold text-gray-900 dark:text-white leading-tight">{{ deal.shortCloseDate }}</p>
            </div>
          </div>

          <!-- Key-value list -->
          <div class="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Pipeline</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.pipelineLabel }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Phụ trách</span>
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-brand-500 text-[10px] flex items-center justify-center text-white font-bold">
                  {{ deal.assigneeInitial }}
                </div>
                <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.owner }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Nguồn</span>
              <span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-theme-xs font-medium text-gray-700 dark:text-gray-300">
                {{ deal.source }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Công ty</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.customer }}</span>
            </div>
          </div>

          <!-- Contacts -->
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p class="text-theme-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Người liên hệ</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-if="deal.contactName"
                class="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full pl-1 pr-3 py-1"
              >
                <div class="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] flex items-center justify-center font-bold">
                  {{ deal.contactName.charAt(0) }}
                </div>
                <span class="text-theme-xs text-gray-700 dark:text-gray-300">{{ deal.contactName }}</span>
              </div>
              <button class="w-8 h-8 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span class="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>

        <!-- AI Insight Card -->
        <div class="rounded-xl border border-brand-200 dark:border-brand-500/30 bg-gradient-to-br from-brand-50 to-success-50/50 dark:from-brand-500/10 dark:to-success-500/5 p-4 flex gap-3">
          <span class="material-symbols-outlined text-brand-500 text-[24px] shrink-0" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
          <div>
            <h4 class="text-theme-sm font-semibold text-brand-600 dark:text-brand-400 mb-1">Gợi ý từ AI</h4>
            <p class="text-theme-xs text-gray-600 dark:text-gray-400">{{ aiReason }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-4 gap-2">
          <Button
            v-for="action in quickActions"
            :key="action.label"
            type="button"
            variant="outline"
            class="h-auto flex-col py-2.5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            @click="handleQuickAction(action.label)"
          >
            <component :is="action.icon" class="mb-1 h-4 w-4" />
            <span class="text-[11px] leading-tight">{{ action.label }}</span>
          </Button>
        </div>
      </aside>

      <!-- ===== RIGHT CONTENT (70%) ===== -->
      <div class="flex-1 min-w-0 flex flex-col">
        <!-- Top action bar -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
          <!-- Mobile: deal title -->
          <div class="lg:hidden flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-sm shrink-0">
              {{ deal.title.charAt(0) }}
            </div>
            <span class="text-theme-sm font-semibold text-gray-900 dark:text-white truncate">{{ deal.title }}</span>
          </div>

          <!-- Tabs (desktop) -->
          <nav class="hidden lg:flex items-center gap-5">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="py-3 text-theme-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'text-brand-500 border-brand-500'
                : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
              <span v-if="tab.count" class="ml-1 text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{{ tab.count }}</span>
            </button>
          </nav>

          <!-- Action buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <Button type="button" class="bg-brand-500 text-white hover:bg-brand-600 text-theme-xs" @click="handleAskAi">
              <Sparkles class="mr-1.5 h-3.5 w-3.5" />
              Hỏi AI
            </Button>
            <Button type="button" variant="outline" class="border-gray-200 dark:border-gray-700 text-theme-xs" @click="handleSave">
              <Save class="mr-1.5 h-3.5 w-3.5" />
              Lưu
            </Button>
            <Button type="button" variant="outline" class="border-error-200 text-error-500 hover:bg-error-50 dark:border-error-500/30 text-theme-xs" @click="handleDelete">
              <Trash2 class="mr-1.5 h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>

        <!-- Stage progress bar (desktop) -->
        <div class="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <div class="flex min-w-max">
            <div
              v-for="(stage, idx) in stages.slice(0, -1)"
              :key="stage.id"
              class="stage-chevron flex min-w-[110px] items-center justify-center px-4 py-2 text-[11px] font-medium cursor-pointer transition-all"
              :class="!stage.current && idx >= currentStageIndex ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : ''"
              :style="stage.current
                ? { background: STAGE_COLOR[stage.id as DealStage], color: '#fff' }
                : idx < currentStageIndex
                  ? { background: STAGE_COLOR[stage.id as DealStage] + '28', color: STAGE_COLOR[stage.id as DealStage] }
                  : {}"
              @click="handleStageClick(stage)"
            >
              <Flag v-if="stage.current" class="mr-1 h-3 w-3" />
              {{ stage.label }}
            </div>
          </div>
        </div>

        <!-- Tab content -->
        <div class="flex-1 p-5 space-y-4 pb-10 overflow-y-auto">
          <!-- Tổng quan tab -->
          <template v-if="activeTab === 'overview'">
            <!-- Admin notice banner -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 flex items-center justify-between border-l-4 border-gray-300 dark:border-gray-600">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-400 text-[20px]">visibility_off</span>
                <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                  Đang hiển thị
                  <span class="font-bold text-gray-700 dark:text-gray-300">{{ fieldConfigStore.totalVisible }}/{{ fieldConfigStore.totalFields }}</span>
                  trường dữ liệu.
                </p>
              </div>
              <button
                class="text-theme-sm text-brand-500 font-medium hover:underline flex items-center gap-1 shrink-0"
                @click="showFieldConfigModal = true"
              >
                <span class="material-symbols-outlined text-[16px]">tune</span>
                Tuỳ chỉnh
              </button>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse">
                <div class="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="j in 4" :key="j" class="space-y-2">
                    <div class="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div class="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Accordion sections -->
            <template v-else>
              <section
                v-for="section in fieldConfigStore.visibleSections"
                :key="section.id"
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs overflow-hidden"
              >
                <!-- Section header -->
                <div
                  class="px-5 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  @click="toggleSection(section.id)"
                >
                  <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-brand-500 text-[20px]">{{ section.icon }}</span>
                    {{ section.name }}
                    <span class="text-theme-xs text-gray-400 font-normal">
                      ({{ fieldConfigStore.visibleCountInSection(section.id) }} trường)
                    </span>
                  </h3>
                  <span
                    class="material-symbols-outlined text-gray-400 transition-transform duration-200"
                    :class="expandedSections.has(section.id) ? 'rotate-0' : '-rotate-90'"
                  >expand_less</span>
                </div>

                <!-- Section fields -->
                <Transition name="accordion">
                  <div v-show="expandedSections.has(section.id)" class="p-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      <div
                        v-for="field in visibleFieldsInSection(section.id)"
                        :key="field.fieldId"
                        class="space-y-1 group"
                      >
                        <label class="text-theme-xs text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                          {{ field.labelVI }}
                          <span
                            v-if="field.isAI"
                            class="text-[9px] font-black px-1 py-0.5 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded uppercase"
                          >AI</span>
                        </label>
                        <div
                          class="text-theme-sm text-gray-900 dark:text-white border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 py-1 transition-all"
                          :class="getFieldValue(field.fieldId) === '—' ? 'text-gray-300 dark:text-gray-600 italic' : ''"
                        >
                          <!-- Special rendering for specific field types -->
                          <template v-if="field.fieldId === 'general_amount'">
                            <span class="text-theme-xl font-semibold text-brand-500">{{ deal.value }}</span>
                          </template>
                          <template v-else-if="field.fieldId === 'general_probability'">
                            <div class="flex items-center gap-2">
                              <div class="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div class="h-full bg-brand-500 rounded-full" :style="{ width: `${deal.probability}%` }" />
                              </div>
                              <span class="font-semibold text-brand-500">{{ deal.probability }}%</span>
                            </div>
                          </template>
                          <template v-else-if="field.fieldId === 'general_close_date'">
                            <span class="inline-flex items-center gap-1 bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400 px-2 py-0.5 rounded-full text-theme-xs font-medium">
                              <span class="material-symbols-outlined text-[14px]">event</span>
                              {{ deal.endDate }}
                            </span>
                          </template>
                          <template v-else-if="field.fieldId === 'general_stage'">
                            <Badge class="bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">{{ currentStageLabel }}</Badge>
                          </template>
                          <template v-else>
                            {{ getFieldValue(field.fieldId) }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </section>

              <!-- Empty state if no sections -->
              <div v-if="fieldConfigStore.visibleSections.length === 0" class="text-center py-16 text-gray-400">
                <span class="material-symbols-outlined text-[48px] mb-3 block">visibility_off</span>
                <p class="text-theme-sm">Tất cả trường đã bị ẩn.</p>
                <button class="mt-3 text-brand-500 text-theme-sm hover:underline" @click="showFieldConfigModal = true">
                  Tuỳ chỉnh hiển thị
                </button>
              </div>
            </template>
          </template>

          <!-- Hoạt động tab -->
          <template v-else-if="activeTab === 'activity'">
            <div class="space-y-3">
              <div
                v-for="item in timeline"
                :key="item.id"
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-theme-xs"
              >
                <div class="flex items-start justify-between gap-2 mb-1">
                  <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                  <Badge :class="item.badgeClass" class="shrink-0">{{ item.badge }}</Badge>
                </div>
                <p class="text-theme-sm text-gray-500">{{ item.detail }}</p>
                <p class="text-theme-xs text-gray-400 mt-1">{{ item.time }}</p>
              </div>
            </div>
          </template>

          <!-- Lịch sử tab -->
          <template v-else-if="activeTab === 'history'">
            <div class="space-y-3">
              <div
                v-for="entry in history"
                :key="entry.id"
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-theme-xs"
              >
                <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ entry.title }}</p>
                <p class="text-theme-xs text-gray-400 mt-1">{{ entry.time }}</p>
              </div>
            </div>
          </template>

          <!-- Phụ lục tab -->
          <template v-else-if="activeTab === 'attachments'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="product in products"
                :key="product.name"
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-theme-xs"
              >
                <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</p>
                <p class="text-theme-xs text-gray-500 mt-0.5">{{ product.quantity }} × {{ product.price }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Floating AI button -->
    <div class="fixed bottom-6 right-6 flex flex-col gap-3 z-20">
      <button
        class="bg-brand-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 hover:bg-brand-600 transition-all"
        @click="handleAskAi"
      >
        <span class="material-symbols-outlined text-[24px]" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
      </button>
    </div>

    <!-- Field Config Modal -->
    <DealFieldConfigModal v-model:open="showFieldConfigModal" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ArrowLeft, Flag, Mail, MessageSquare, Phone, Save, Sparkles, SquareCheckBig, Trash2 } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { deleteDeal, getDealById, updateDeal } from '@/services/deals'
import { useDealFieldConfigStore } from '@/stores/useDealFieldConfigStore'
import { DEAL_FIELDS } from '@/types/dealFields'
import DealFieldConfigModal from '@/components/crm/DealFieldConfigModal.vue'
import type { Deal, DealStage } from '@/types/deals'

interface StageItem {
  id: string
  label: string
  current?: boolean
  locked?: boolean
}

interface TimelineItem {
  id: string
  title: string
  detail: string
  time: string
  badge: string
  badgeClass: string
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const dealData = ref<Deal | null>(null)
const showFieldConfigModal = ref(false)
const activeTab = ref('overview')
const expandedSections = ref<Set<string>>(new Set(['general', 'hotel', 'product']))

const fieldConfigStore = useDealFieldConfigStore()

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'activity', label: 'Hoạt động' },
  { id: 'history', label: 'Lịch sử thay đổi' },
  { id: 'attachments', label: 'Phụ lục', count: dealData.value?.attachedDocumentsCount ?? 0 },
]

const stageLabel: Record<DealStage, string> = {
  new: 'Lead mới',
  preparing: 'Chuẩn bị',
  contacted: 'Đã liên hệ',
  negotiating: 'Đàm phán',
  quoted: 'Báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}

const STAGE_COLOR: Record<DealStage, string> = {
  new: '#64748B',
  preparing: '#3B82F6',
  contacted: '#06B6D4',
  negotiating: '#F59E0B',
  quoted: '#8B5CF6',
  won: '#10B981',
  lost: '#EF4444',
}

const stageOrder: DealStage[] = ['new', 'preparing', 'contacted', 'negotiating', 'quoted', 'won', 'lost']

const deal = computed(() => {
  const source = dealData.value
  const title = source?.title ?? 'Đang tải...'
  const amount = Number(source?.value ?? 0)

  function shortAmount(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}T`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return n.toString()
  }

  const assignee = source?.assigneeId ?? '--'
  const closeDate = source?.expectedCloseDate

  return {
    code: source?.id?.slice(-8).toUpperCase() ?? '--------',
    title,
    updatedAt: source ? new Date(source.updatedAt).toLocaleString('vi-VN') : '--',
    updatedBy: assignee,
    value: `${amount.toLocaleString('vi-VN')} ₫`,
    shortValue: shortAmount(amount),
    probability: source?.probability ?? 0,
    owner: assignee,
    assigneeInitial: assignee.charAt(0).toUpperCase(),
    endDate: closeDate ? new Date(closeDate).toLocaleDateString('vi-VN') : 'Chưa có',
    shortCloseDate: closeDate ? new Date(closeDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '--',
    customer: source?.companyName ?? source?.contactName ?? 'Chưa xác định',
    contactName: source?.contactName ?? null,
    source: source?.source ?? 'Organic',
    pipelineLabel: source?.pipelineId ?? 'Mặc định',
  }
})

const stages = computed<StageItem[]>(() => {
  const currentStage = dealData.value?.stage ?? 'new'
  return stageOrder.map((stage) => ({
    id: stage,
    label: stageLabel[stage],
    current: stage === currentStage,
    locked: stageOrder.indexOf(stage) > stageOrder.indexOf(currentStage),
  }))
})

const currentStageIndex = computed(() => {
  const currentStage = dealData.value?.stage ?? 'new'
  return stageOrder.indexOf(currentStage)
})

const currentStageLabel = computed(
  () => stages.value.find((s) => s.current)?.label ?? 'Chưa xác định',
)

const stageProgress = computed(() => {
  const idx = currentStageIndex.value
  const maxIdx = stageOrder.length - 2 // exclude 'lost'
  if (idx < 0) return 0
  return Math.round((idx / maxIdx) * 100)
})

// Mock field values for custom fields (real API will provide these)
const mockFieldValues: Record<string, string> = {
  hotel_city: 'Đà Nẵng',
  hotel_rooms: '185 phòng',
  hotel_name: 'Sunrise Beach Resort & Spa',
  hotel_address: 'Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
  hotel_stars: '5 sao',
  hotel_manager: 'Lê Thu Hà',
  hotel_pms: 'Opera',
  hotel_type: 'Resort biển',
  hotel_website: 'sunrisebeachresort.vn',
  product_expected: 'ezCloudHotel, BE, CMS',
  product_demo_date: '20/11/2024',
  product_demo_done: 'Chưa',
  marketing_mkt_note: 'Khách hàng quan tâm giải pháp tự động hoá',
  marketing_channel: 'Facebook Ads',
  marketing_lead_form: 'Form đăng ký demo tháng 11',
  lead_sdr_status: 'Qualified',
  lead_sdr_call_date: '10/11/2024',
  assessment_health: 'Tốt',
  assessment_interest: '8.5/10',
  assessment_competitor: 'Traveloka Ads',
  assessment_ai_summary: 'Deal có tiềm năng cao, khách hàng quan tâm tính năng AI Automation.',
  meeting_date: '15/11/2024 09:00',
  meeting_type: 'Onsite tại văn phòng khách',
  meeting_result: 'Quan tâm cao, cần báo giá',
  contract_type: 'Hợp đồng Dịch vụ Trọn gói',
  payment_term: '50% trước, 50% khi go-live',
  payment_status: 'Chờ xác nhận',
  payment_date1: 'Chưa xác định',
  upsale_status: 'Chưa tiếp cận',
  lost_reason: '—',
  system_id: dealData.value?.id ?? '--',
  system_contact: dealData.value?.contactName ?? '--',
  system_company: dealData.value?.companyName ?? '--',
}

function getFieldValue(fieldId: string): string {
  const d = dealData.value
  if (!d) return '—'

  const standardValues: Record<string, () => string> = {
    general_deal_title: () => d.title,
    general_amount: () => `${Number(d.value).toLocaleString('vi-VN')} ₫`,
    general_probability: () => `${d.probability}%`,
    general_close_date: () => (d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString('vi-VN') : '—'),
    general_begin_date: () => new Date(d.createdAt).toLocaleDateString('vi-VN'),
    general_assigned_to: () => d.assigneeId,
    general_created_by: () => d.createdBy,
    general_modified_by: () => d.assigneeId,
    general_created_at: () => new Date(d.createdAt).toLocaleString('vi-VN'),
    general_updated_at: () => new Date(d.updatedAt).toLocaleString('vi-VN'),
    general_source: () => d.source ?? 'Organic',
    general_stage: () => stageLabel[d.stage],
    general_pipeline: () => d.pipelineId ?? 'Mặc định',
    system_id: () => d.id,
    system_contact: () => d.contactName ?? '—',
    system_company: () => d.companyName ?? '—',
  }

  return standardValues[fieldId]?.() ?? mockFieldValues[fieldId] ?? '—'
}

function visibleFieldsInSection(sectionId: string) {
  return DEAL_FIELDS.filter(
    (f) => f.sectionId === sectionId && fieldConfigStore.isVisible(f.fieldId),
  )
}

function toggleSection(sectionId: string): void {
  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId)
  } else {
    expandedSections.value.add(sectionId)
  }
}

function handleStageClick(stage: StageItem): void {
  if (!dealData.value || stage.current) return
  toast.info(`Chuyển sang giai đoạn: ${stage.label}`)
}

const aiReason = ref('Xác suất thành công tăng 15% nếu gửi báo giá trong 24h tới. Khách hàng đã xem tài liệu 3 lần.')

const products = ref([
  { name: 'Gói Marketing AI 360', quantity: 1, price: '250.000.000 ₫' },
  { name: 'Setup & Đào tạo', quantity: 1, price: '200.000.000 ₫' },
])

const history = ref([
  { id: 'h-1', title: 'Đã gửi Email báo giá', time: '10:30 AM hôm nay' },
  { id: 'h-2', title: 'Chuyển giai đoạn sang Đàm phán', time: 'Hôm qua, 04:15 PM' },
  { id: 'h-3', title: 'Thêm liên hệ Minh Trần', time: '12/11/2024' },
])

const timeline = ref<TimelineItem[]>([
  {
    id: 't-1',
    title: 'Salio AI đề xuất',
    detail: 'Đã chuẩn bị bản nháp email follow-up cá nhân hóa cho quản lý.',
    time: 'Vừa xong',
    badge: 'AI',
    badgeClass: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300',
  },
  {
    id: 't-2',
    title: 'Đã gửi Email báo giá',
    detail: 'Trạng thái: Đã mở (2 lần)',
    time: '10:30 AM',
    badge: 'Email',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
  },
  {
    id: 't-3',
    title: 'Chuyển sang Đàm phán',
    detail: 'Giai đoạn đã được cập nhật từ Kanban.',
    time: 'Hôm qua, 04:15 PM',
    badge: 'Stage',
    badgeClass: 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300',
  },
])

const quickActions = ref([
  { label: 'Ghi chú', icon: MessageSquare },
  { label: 'Tác vụ', icon: SquareCheckBig },
  { label: 'Email', icon: Mail },
  { label: 'Gọi điện', icon: Phone },
])

async function fetchDeal(): Promise<void> {
  loading.value = true
  const dealId = String(route.params.dealId)
  const result = await getDealById(dealId)
  loading.value = false

  if (!result.isSuccess) {
    toast.error(result.error || 'Không thể tải chi tiết deal')
    return
  }

  dealData.value = result.data

  if (result.data.activities && result.data.activities.length > 0) {
    timeline.value = result.data.activities.map((act) => ({
      id: act.id,
      title: act.title,
      detail: act.metadata ? JSON.stringify(act.metadata) : '',
      time: new Date(act.createdAt).toLocaleString('vi-VN'),
      badge: act.type === 'stage_change' ? 'Stage' : act.type === 'created' ? 'Tạo mới' : 'Hoạt động',
      badgeClass:
        act.type === 'stage_change'
          ? 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300'
          : act.type === 'created'
            ? 'bg-success-50 text-success-500 dark:bg-success-500/15 dark:text-success-300'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    }))
  }
}

function handleAskAi(): void {
  toast.success('Đang mở Chat hỏi đáp theo deal')
}

function handleSave(): void {
  if (!dealData.value) return

  void updateDeal(dealData.value.id, {
    title: dealData.value.title,
    probability: dealData.value.probability,
  }).then((result) => {
    if (!result.isSuccess) {
      toast.error(result.error)
      return
    }
    toast.success('Đã lưu thông tin deal')
    void fetchDeal()
  })
}

function handleDelete(): void {
  if (!dealData.value) return

  void deleteDeal(dealData.value.id).then((result) => {
    if (!result.isSuccess) {
      toast.error(result.error)
      return
    }
    toast.success('Đã xóa deal')
    void router.push('/crm-deals')
  })
}

function handleQuickAction(action: string): void {
  toast.info(`Đang mở: ${action}`)
}

onMounted(() => {
  void fetchDeal()
})
</script>

<style scoped>
.stage-chevron {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
}
.stage-chevron:first-child {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
}
.stage-chevron:last-child {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 2000px;
}

/* Google Material Symbols font */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  vertical-align: middle;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  white-space: nowrap;
}
</style>
