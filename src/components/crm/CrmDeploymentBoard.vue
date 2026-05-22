<template>
  <div class="flex h-full min-h-0 flex-col">

    <!-- ─── Quick filter chips ─────────────────────────────────── -->
    <div class="shrink-0 flex items-center gap-1.5 overflow-x-auto px-4 pt-2 pb-0.5">
      <button
        v-for="f in QUICK_FILTERS"
        :key="f.id"
        type="button"
        class="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors"
        :class="activeFilter === f.id
          ? 'bg-white text-gray-900 font-semibold ring-2 ring-gray-400 shadow-sm dark:bg-gray-700 dark:text-white dark:ring-gray-500'
          : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700'"
        @click="activeFilter = f.id"
      >{{ f.name }}</button>
    </div>

    <!-- ─── KPI row ─────────────────────────────────────────────── -->
    <div class="shrink-0 grid grid-cols-4 gap-3 px-4 pt-2">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="kpi-card rounded-xl p-3"
      >
        <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
        <p class="text-xl font-semibold" :class="kpi.valueClass ?? 'text-gray-900 dark:text-white'">{{ kpi.value }}</p>
      </div>
    </div>

    <!-- ─── Search bar ──────────────────────────────────────────── -->
    <div class="relative shrink-0 px-2 pt-2">
      <div class="flex min-h-[36px] cursor-text items-center gap-1.5 rounded-xl border bg-white px-3 py-1.5 shadow-theme-xs transition-all dark:bg-gray-800 border-gray-200 hover:border-gray-300 dark:border-gray-700">
        <Search class="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <div class="flex flex-1 flex-wrap items-center gap-1.5">
          <input
            v-model="searchText"
            placeholder="Tìm kiếm dự án triển khai..."
            class="min-w-[120px] flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
          />
        </div>
        <button
          v-if="searchText"
          type="button"
          class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          @click="searchText = ''"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <!-- ─── Legend ─────────────────────────────────────────────── -->
    <div class="shrink-0 flex flex-wrap items-center gap-x-5 gap-y-1 px-4 pt-1.5 pb-0.5 text-[11px] text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-1 w-5 rounded-full bg-warning-500"></span>
        🧪 Dùng thử
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-1 w-5 rounded-full bg-brand-500"></span>
        🚀 Triển khai thẳng
      </span>
      <span class="flex items-center gap-1 font-medium text-warning-600 dark:text-warning-400">
        <span class="tracking-widest opacity-60">- - -</span>
        Cột chỉ dành cho khách dùng thử
      </span>
    </div>

    <!-- ═══ KANBAN VIEW ═══════════════════════════════════════════ -->
    <div
      v-if="!props.viewMode || props.viewMode === 'kanban'"
      class="deploy-scrollbar flex-1 overflow-x-auto overflow-y-hidden p-2"
    >
      <div class="flex h-full gap-3" style="min-width: max-content">

        <div
          v-for="col in DEPLOY_COLUMNS"
          :key="col.id"
          class="flex h-full w-[208px] shrink-0 flex-col overflow-hidden rounded-xl"
        >
          <!-- Column header -->
          <div
            class="flex items-center justify-between px-3 py-2.5"
            :style="{ background: col.color }"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-bold text-white">{{ col.name }}</span>
              <span class="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {{ filteredCards(col.id).length }}
              </span>
            </div>
          </div>

          <!-- Trial-only label -->
          <div
            v-if="col.trialOnly"
            class="shrink-0 bg-white/90 px-2 py-0.5 text-center text-[9px] font-bold tracking-wide dark:bg-gray-900/90"
            :style="{ color: col.color }"
          >
            CHỈ DÀNH CHO KHÁCH DÙNG THỬ
          </div>

          <!-- Column body -->
          <div
            class="deploy-col-body deploy-scrollbar flex-1 overflow-y-auto p-2 rounded-b-xl transition-colors"
            :class="[
              col.trialOnly ? 'deploy-col-trial' : '',
              dragOverColId === col.id ? 'bg-brand-50 ring-2 ring-inset ring-brand-300 dark:bg-brand-900/20 dark:ring-brand-600' : '',
            ]"
            :style="col.trialOnly ? ({ '--trial-color': col.color } as Record<string, string>) : {}"
            @dragover="onDragOver($event, col.id)"
            @dragleave="onDragLeave($event, col.id)"
            @drop="onDrop($event, col.id)"
          >
            <!-- Cards -->
            <div
              v-for="card in filteredCards(col.id)"
              :key="card.id"
              draggable="true"
              class="deploy-card mb-2 cursor-grab rounded-xl bg-white p-2.5 shadow-theme-xs transition-all hover:shadow-theme-md dark:bg-gray-800"
              :class="[
                card.type === 'trial' ? 'border-t-2 border-t-warning-400' : 'border-t-2 border-t-brand-500',
                draggingCardId === card.id ? 'opacity-40 scale-95' : '',
              ]"
              @dragstart="onDragStart($event, card.id)"
              @dragend="onDragEnd"
              @click="navigateToCard(card.id)"
            >
              <!-- Card header -->
              <div class="mb-1 flex items-start justify-between gap-1.5">
                <span class="line-clamp-2 text-[11px] font-bold leading-tight text-gray-900 dark:text-white">
                  {{ card.customerName }}
                </span>
                <span
                  class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold"
                  :class="card.type === 'trial'
                    ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'"
                >
                  {{ card.type === 'trial' ? '🧪 Dùng thử' : '🚀 Trực tiếp' }}
                </span>
              </div>

              <p class="mb-2 text-[10px] text-gray-500 dark:text-gray-400">{{ card.contactName }}</p>

              <!-- Product tracks -->
              <div class="space-y-1.5 border-t border-gray-100 pt-1.5 dark:border-gray-700">
                <div
                  v-for="track in card.tracks"
                  :key="track.product"
                  class="flex items-start gap-1"
                >
                  <span class="w-14 shrink-0 pt-0.5 text-[9px] font-semibold text-gray-600 dark:text-gray-400">
                    {{ track.product }}
                  </span>
                  <div class="flex flex-1 flex-wrap items-center gap-0.5">
                    <template v-for="(phase, pi) in track.phases" :key="pi">
                      <span v-if="pi > 0" class="text-[8px] text-gray-300 dark:text-gray-600">›</span>
                      <span
                        class="rounded px-1 py-0.5 text-[8px] font-bold leading-none"
                        :class="{
                          'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400': phase.status === 'done',
                          'bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-400 dark:bg-brand-900/30 dark:text-brand-400': phase.status === 'active',
                          'bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-400 dark:bg-warning-900/30 dark:text-warning-400': phase.status === 'trial-active',
                          'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500': phase.status === 'waiting',
                        }"
                      >{{ phase.label }}</span>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Trial countdown -->
              <div
                v-if="card.trialDaysLeft !== undefined"
                class="mt-2 rounded-lg px-2 py-1 text-center text-[10px] font-bold"
                :class="card.trialDaysLeft <= 5
                  ? 'border border-error-200 bg-error-50 text-error-600 dark:border-error-800/40 dark:bg-error-900/20 dark:text-error-400'
                  : 'border border-warning-200 bg-warning-50 text-warning-600 dark:border-warning-800/40 dark:bg-warning-900/20 dark:text-warning-400'"
              >
                {{ card.trialDaysLeft <= 5 ? '⚠' : '⏳' }}
                {{ card.trialDaysLeft <= 0 ? 'Hết hạn dùng thử!' : `Còn ${card.trialDaysLeft} ngày dùng thử` }}
              </div>

              <!-- Converting banner -->
              <div
                v-if="card.isConverting"
                class="mt-2 rounded-lg border border-purple-300 bg-purple-50 px-2 py-1 text-center text-[10px] font-bold text-purple-700 dark:border-purple-700/50 dark:bg-purple-900/20 dark:text-purple-400"
              >
                ✍ Đang ký hợp đồng chính thức
              </div>

              <!-- Card footer -->
              <div class="mt-2 flex items-center justify-between">
                <div class="flex">
                  <div
                    v-for="(av, ai) in card.assignees"
                    :key="av.name"
                    class="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[7px] font-bold text-white ring-2 ring-white dark:ring-gray-800"
                    :class="{ '-ml-1.5': ai > 0 }"
                    :style="{ background: av.color }"
                    :title="av.name"
                  >{{ av.initials }}</div>
                </div>
                <span
                  class="text-[10px] font-bold tabular-nums"
                  :class="card.progress === 100
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-gray-500 dark:text-gray-400'"
                >
                  {{ card.progress }}%{{ card.progress === 100 ? ' ✓' : '' }}
                </span>
              </div>
            </div>

            <!-- Add card button -->
            <button
              type="button"
              class="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-gray-400 transition-colors hover:bg-white/60 hover:text-gray-600 dark:hover:bg-gray-700/60 dark:hover:text-gray-300"
              @click="openCreateDialog(col.id)"
            >
              <Plus class="h-3.5 w-3.5" />
              Thêm dự án
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══ LIST VIEW ════════════════════════════════════════════ -->
    <div
      v-else-if="props.viewMode === 'list'"
      class="deploy-scrollbar flex-1 overflow-auto px-4 py-3"
    >
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Khách hàng</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Loại</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sản phẩm</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Giai đoạn</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Phụ trách</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Tiến độ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="card in allFilteredCards"
              :key="card.id"
              class="cursor-pointer border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/30"
              @click="navigateToCard(card.id)"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span
                    class="inline-block h-2 w-0.5 rounded-full"
                    :style="{ background: card.type === 'trial' ? '#f79009' : '#465fff' }"
                  ></span>
                  <div>
                    <p class="text-[13px] font-semibold text-gray-900 dark:text-white">{{ card.customerName }}</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ card.contactName }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                  :class="card.type === 'trial'
                    ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'"
                >
                  {{ card.type === 'trial' ? '🧪 Dùng thử' : '🚀 Trực tiếp' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="t in card.tracks"
                    :key="t.product"
                    class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  >{{ t.product }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                  :style="{ background: store.columnColor(card.columnId) }"
                >{{ store.columnName(card.columnId) }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex">
                  <div
                    v-for="(av, ai) in card.assignees"
                    :key="av.name"
                    class="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-white dark:ring-gray-800"
                    :class="{ '-ml-1.5': ai > 0 }"
                    :style="{ background: av.color }"
                    :title="av.name"
                  >{{ av.initials }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="card.progress === 100 ? 'bg-success-500' : 'bg-brand-500'"
                      :style="{ width: `${card.progress}%` }"
                    />
                  </div>
                  <span
                    class="min-w-[2.5rem] text-right text-xs font-semibold tabular-nums"
                    :class="card.progress === 100
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-gray-700 dark:text-gray-300'"
                  >{{ card.progress }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="allFilteredCards.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                Không có dự án nào phù hợp
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══ CREATE DIALOG ════════════════════════════════════════ -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo dự án triển khai mới</DialogTitle>
        </DialogHeader>

        <form class="mt-1 space-y-4" @submit.prevent="saveCard">

          <!-- Customer name -->
          <div class="space-y-1.5">
            <Label>Tên khách hàng <span class="text-error-500">*</span></Label>
            <Input v-model="form.customerName" placeholder="Tên khách hàng / khách sạn" />
          </div>

          <!-- Contact name -->
          <div class="space-y-1.5">
            <Label>Người liên hệ</Label>
            <Input v-model="form.contactName" placeholder="Tên người liên hệ" />
          </div>

          <!-- Deployment type -->
          <div class="space-y-1.5">
            <Label>Loại triển khai</Label>
            <div class="flex gap-3">
              <label
                class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-colors"
                :class="form.type === 'trial'
                  ? 'border-warning-400 bg-warning-50 dark:border-warning-600 dark:bg-warning-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
              >
                <input v-model="form.type" type="radio" value="trial" class="hidden" />
                <span class="text-sm font-semibold" :class="form.type === 'trial' ? 'text-warning-700 dark:text-warning-400' : 'text-gray-500 dark:text-gray-400'">
                  🧪 Dùng thử trước
                </span>
              </label>
              <label
                class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-colors"
                :class="form.type === 'direct'
                  ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
              >
                <input v-model="form.type" type="radio" value="direct" class="hidden" />
                <span class="text-sm font-semibold" :class="form.type === 'direct' ? 'text-brand-700 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'">
                  🚀 Triển khai thẳng
                </span>
              </label>
            </div>
          </div>

          <!-- Trial dates (conditional) -->
          <template v-if="form.type === 'trial'">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label>Ngày bắt đầu dùng thử</Label>
                <Input v-model="form.trialStartDate" type="date" />
              </div>
              <div class="space-y-1.5">
                <Label>Ngày kết thúc dùng thử</Label>
                <Input v-model="form.trialEndDate" type="date" />
              </div>
            </div>
          </template>

          <!-- Products -->
          <div class="space-y-1.5">
            <Label>Sản phẩm triển khai</Label>
            <div class="grid grid-cols-3 gap-2">
              <label
                v-for="p in PRODUCTS"
                :key="p"
                class="flex cursor-pointer items-center justify-center rounded-lg border px-2.5 py-2 text-[12px] font-medium transition-colors"
                :class="form.products.includes(p)
                  ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'"
              >
                <input
                  type="checkbox"
                  class="hidden"
                  :checked="form.products.includes(p)"
                  @change="toggleProduct(p)"
                />
                {{ p }}
              </label>
            </div>
          </div>

          <!-- Stage / Column -->
          <div class="space-y-1.5">
            <Label>Giai đoạn hiện tại</Label>
            <Select v-model="form.columnId">
              <SelectTrigger>
                <SelectValue placeholder="Chọn giai đoạn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="col in availableColumns"
                  :key="col.id"
                  :value="col.id"
                >{{ col.name }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Assignee -->
          <div class="space-y-1.5">
            <Label>Nhân viên phụ trách</Label>
            <Input v-model="form.assigneeName" placeholder="Tên nhân viên" />
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea v-model="form.notes" placeholder="Ghi chú thêm..." :rows="2" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="showDialog = false">Hủy</Button>
            <Button type="submit" class="bg-brand-500 hover:bg-brand-600 text-white">
              Tạo dự án
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, Plus } from 'lucide-vue-next'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'vue-sonner'
import {
  useDeploymentStore,
  DEPLOY_COLUMNS,
  PRODUCTS,
  type DeployType,
  type DeployCard,
  type DeployAssignee,
  type DeployPhase,
} from '@/stores/useDeploymentStore'

// ─── Props ────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  viewMode?: 'kanban' | 'list' | 'calendar'
}>(), {
  viewMode: 'kanban',
})

// ─── Store & Router ───────────────────────────────────────────

const router = useRouter()
const store  = useDeploymentStore()

// ─── Constants ────────────────────────────────────────────────

const QUICK_FILTERS = [
  { id: 'all',       name: 'Tất cả' },
  { id: 'mine',      name: 'Của tôi' },
  { id: 'trial',     name: '🧪 Đang dùng thử' },
  { id: 'deploying', name: '🔧 Đang triển khai' },
  { id: 'overdue',   name: '⚠ Sắp hết hạn' },
] as const

// ─── State ────────────────────────────────────────────────────

const activeFilter   = ref<string>('all')
const searchText     = ref('')
const showDialog     = ref(false)
const draggingCardId = ref<string | null>(null)
const dragOverColId  = ref<string | null>(null)

const form = reactive({
  customerName:   '',
  contactName:    '',
  type:           'direct' as DeployType,
  products:       [] as string[],
  columnId:       'new',
  assigneeName:   '',
  trialStartDate: '',
  trialEndDate:   '',
  notes:          '',
})

// ─── Computed ─────────────────────────────────────────────────

const kpis = computed(() => {
  const cards     = store.cards
  const total     = cards.length
  const inTrial   = cards.filter((c) => c.columnId === 'in_trial').length
  const deploying = cards.filter((c) => c.columnId === 'deploying').length
  const done      = cards.filter((c) => c.columnId === 'done').length
  return [
    { label: 'Tổng dự án',      value: String(total) },
    { label: 'Đang dùng thử',   value: String(inTrial),   valueClass: 'text-warning-600 dark:text-warning-400' },
    { label: 'Đang triển khai', value: String(deploying), valueClass: 'text-brand-600 dark:text-brand-400' },
    { label: 'Hoàn thành',      value: String(done),      valueClass: 'text-success-600 dark:text-success-400' },
  ]
})

const allFilteredCards = computed(() => {
  let result = store.cards
  if (searchText.value.trim()) {
    const q = searchText.value.toLowerCase()
    result = result.filter(
      (c) => c.customerName.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q),
    )
  }
  if (activeFilter.value === 'trial')     result = result.filter((c) => c.columnId === 'in_trial')
  if (activeFilter.value === 'deploying') result = result.filter((c) => c.columnId === 'deploying')
  if (activeFilter.value === 'overdue')   result = result.filter((c) => c.trialDaysLeft !== undefined && c.trialDaysLeft <= 5)
  return result
})

const availableColumns = computed(() =>
  form.type === 'direct'
    ? DEPLOY_COLUMNS.filter((c) => !c.trialOnly)
    : DEPLOY_COLUMNS,
)

// ─── Helpers ──────────────────────────────────────────────────

function filteredCards(columnId: string): DeployCard[] {
  return allFilteredCards.value.filter((c) => c.columnId === columnId)
}

function toggleProduct(p: string): void {
  const idx = form.products.indexOf(p)
  if (idx === -1) form.products.push(p)
  else form.products.splice(idx, 1)
}

function resetForm(columnId = 'new'): void {
  form.customerName   = ''
  form.contactName    = ''
  form.type           = 'direct'
  form.products       = []
  form.columnId       = columnId
  form.assigneeName   = ''
  form.trialStartDate = ''
  form.trialEndDate   = ''
  form.notes          = ''
}

// ─── Navigation ───────────────────────────────────────────────

function navigateToCard(id: string): void {
  router.push({ name: 'CrmDeploymentDetail', params: { deploymentId: id } })
}

// ─── Dialog handlers ──────────────────────────────────────────

function openCreateDialog(defaultColumnId = 'new'): void {
  resetForm(defaultColumnId)
  showDialog.value = true
}

function saveCard(): void {
  if (!form.customerName.trim()) {
    toast.error('Vui lòng nhập tên khách hàng')
    return
  }

  const palette = ['#465fff', '#3450cc', '#f79009', '#e03131', '#059669', '#6554c0']
  const initials = form.assigneeName.trim()
    ? form.assigneeName.trim().split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'
  const assignees: DeployAssignee[] = form.assigneeName.trim()
    ? [{ name: form.assigneeName.trim(), initials, color: palette[Math.floor(Math.random() * palette.length)] }]
    : []

  const buildPhases = (): DeployPhase[] => {
    if (form.type === 'trial') {
      return [
        { label: 'Setup DT', status: 'waiting' },
        { label: 'Dùng thử', status: 'waiting' },
        { label: 'TK',       status: 'waiting' },
        { label: 'ĐT',       status: 'waiting' },
      ]
    }
    return [
      { label: 'TK', status: 'waiting' },
      { label: 'ĐT', status: 'waiting' },
    ]
  }

  const newCard: DeployCard = {
    id:             `dp-${Date.now()}`,
    columnId:       form.columnId,
    customerName:   form.customerName.trim(),
    contactName:    form.contactName.trim(),
    type:           form.type,
    tracks:         form.products.length
      ? form.products.map((p) => ({ product: p, phases: buildPhases() }))
      : [{ product: 'ezCloud', phases: buildPhases() }],
    assignees,
    progress:       0,
    trialStartDate: form.trialStartDate || undefined,
    trialEndDate:   form.trialEndDate   || undefined,
    notes:          form.notes          || undefined,
    activities:     [],
  }

  store.addCard(newCard)
  toast.success('Đã tạo dự án triển khai')
  showDialog.value = false
}

// ─── Drag & Drop ──────────────────────────────────────────────

function onDragStart(e: DragEvent, cardId: string): void {
  draggingCardId.value = cardId
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragEnd(): void {
  draggingCardId.value = null
  dragOverColId.value  = null
}

function onDragOver(e: DragEvent, colId: string): void {
  const card = store.cards.find((c) => c.id === draggingCardId.value)
  if (!card) return
  const col = DEPLOY_COLUMNS.find((c) => c.id === colId)
  if (col?.trialOnly && card.type === 'direct') return
  e.preventDefault()
  dragOverColId.value = colId
}

function onDragLeave(e: DragEvent, colId: string): void {
  if (!(e.currentTarget as HTMLElement)?.contains(e.relatedTarget as Node)) {
    if (dragOverColId.value === colId) dragOverColId.value = null
  }
}

function onDrop(e: DragEvent, colId: string): void {
  e.preventDefault()
  const cardId = draggingCardId.value
  if (!cardId) return
  const card = store.cards.find((c) => c.id === cardId)
  if (!card || card.columnId === colId) {
    draggingCardId.value = null
    dragOverColId.value  = null
    return
  }
  const col = DEPLOY_COLUMNS.find((c) => c.id === colId)
  if (col?.trialOnly && card.type === 'direct') {
    toast.error('Cột này chỉ dành cho khách dùng thử')
    draggingCardId.value = null
    dragOverColId.value  = null
    return
  }
  store.updateCard(cardId, { columnId: colId })
  toast.success(`Đã chuyển "${card.customerName}" sang "${store.columnName(colId)}"`)
  draggingCardId.value = null
  dragOverColId.value  = null
}

// ─── Expose ──────────────────────────────────────────────────

defineExpose({ openCreateDialog })
</script>
