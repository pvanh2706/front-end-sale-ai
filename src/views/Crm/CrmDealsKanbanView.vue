<template>
  <AdminLayout>
    <div class="flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden">
      <div class="shrink-0 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <button class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
              <span class="text-primary-500">Pipeline:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ selectedPipeline }}</span>
              <ChevronDown class="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <Search class="h-4 w-4" />
            </button>
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <SlidersHorizontal class="h-4 w-4" />
            </button>
            <Button class="gap-1.5 bg-primary-500 text-white hover:bg-primary-600" size="sm" @click="openCreateDialog()">
              <Plus class="h-4 w-4" />
              Tạo Deal
            </Button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="kpi in kpis"
            :key="kpi.label"
            class="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
          >
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
            <p class="text-xl font-semibold" :class="kpi.valueClass ?? 'text-gray-900 dark:text-white'">{{ kpi.value }}</p>
          </div>
        </div>
      </div>

      <div class="custom-scrollbar flex-1 overflow-x-auto overflow-y-hidden bg-gray-50 p-4 dark:bg-gray-950">
        <div v-if="isLoading" class="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 dark:border-gray-700 dark:bg-gray-900/50">
          <p class="text-sm text-gray-500">Đang tải Kanban...</p>
        </div>

        <div v-else class="kanban-container h-full">
          <div
            v-for="column in columns"
            :key="column.id"
            class="kanban-column flex h-full shrink-0 flex-col"
            @dragover.prevent
            @drop="handleDrop(column.id)"
          >
            <div class="mb-3">
              <div class="mb-2 h-1.5 w-full rounded-full" :style="{ background: column.color }"></div>
              <div class="flex items-center justify-between">
                <h4 class="flex items-center gap-1.5 text-sm font-medium text-gray-800 dark:text-gray-200">
                  {{ column.name }}
                  <span class="font-normal text-gray-400 dark:text-gray-500">({{ column.cards.length }})</span>
                </h4>
                <div class="flex items-center gap-1">
                  <span class="text-xs text-gray-400 dark:text-gray-500">{{ column.total }}</span>
                  <button class="rounded p-1 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10" @click="openCreateDialog(column.id)">
                    <Plus class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div class="custom-scrollbar flex-1 space-y-3 overflow-y-auto pr-1" :class="column.cards.length === 0 ? 'flex items-center justify-center' : ''">
              <div
                v-if="column.cards.length === 0"
                class="flex h-full min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100/50 px-3 dark:border-gray-700 dark:bg-gray-800/30"
              >
                <p class="text-center text-xs italic text-gray-400 dark:text-gray-600">
                  Chưa có deal - kéo deal vào đây hoặc bấm + để tạo
                </p>
              </div>

              <div
                v-for="card in column.cards"
                :key="card.id"
                class="cursor-grab rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800"
                :class="card.isOptimistic ? 'animate-pulse border-primary-300' : ''"
                draggable="true"
                @dragstart="handleDragStart(card.id, column.id)"
              >
                <div class="mb-2 flex items-start justify-between">
                  <Badge variant="secondary" class="text-[10px] font-bold uppercase">{{ card.source }}</Badge>
                  <div class="flex items-center gap-2">
                    <button class="text-gray-400 hover:text-primary-500" @click="openEditDialog(card, column.id)">
                      <Pencil class="h-3.5 w-3.5" />
                    </button>
                    <button class="text-gray-400 hover:text-error-500" @click="removeDeal(card.id)">
                      <Trash2 class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <RouterLink
                  :to="`/crm-deals/${card.id}`"
                  class="mb-1 block text-sm font-medium text-gray-900 hover:text-primary-500 dark:text-white dark:hover:text-primary-400"
                >
                  {{ card.title }}
                </RouterLink>
                <p class="mb-3 text-xs text-gray-500 dark:text-gray-400">{{ card.company }}</p>

                <div class="mb-2 flex items-center justify-between">
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ card.value }}</p>
                  <div v-if="card.aiScore" class="flex items-center gap-1 text-primary-500">
                    <Star class="h-3.5 w-3.5 fill-current" />
                    <span class="text-xs font-bold">{{ card.aiScore }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Dialog :open="showDealDialog" @update:open="showDealDialog = $event">
      <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader class="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">{{ editingDealId ? 'Cập nhật Deal' : 'Tạo Deal mới' }}</DialogTitle>
          <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">Điền thông tin chi tiết để lưu deal vào CRM</DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-1.5">
            <Label for="deal-title">Tên deal <span class="text-error-500">*</span></Label>
            <Input id="deal-title" v-model="form.title" placeholder="VD: Triển khai ERP giai đoạn 1" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="deal-company">Công ty</Label>
              <Input id="deal-company" v-model="form.company" placeholder="Tên công ty" />
            </div>
            <div class="space-y-1.5">
              <Label for="deal-contact">Người liên hệ</Label>
              <Input id="deal-contact" v-model="form.contact" placeholder="Họ tên" />
            </div>
          </div>

          <div class="space-y-1.5">
            <Label for="deal-contact-title">Chức vụ người liên hệ</Label>
            <Input id="deal-contact-title" v-model="form.contactTitle" placeholder="VD: Giám đốc mua hàng, Trưởng phòng IT" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="deal-phone">Số điện thoại</Label>
              <Input id="deal-phone" v-model="form.phone" type="tel" placeholder="VD: 0901 234 567" />
            </div>
            <div class="space-y-1.5">
              <Label for="deal-email">Email</Label>
              <Input id="deal-email" v-model="form.email" type="email" placeholder="VD: contact@congty.com" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="deal-value">Giá trị</Label>
              <Input id="deal-value" v-model="form.value" type="number" min="0" placeholder="0" />
            </div>
            <div class="space-y-1.5">
              <Label for="deal-probability">Xác suất chốt (%)</Label>
              <Input id="deal-probability" v-model="form.probability" type="number" min="0" max="100" placeholder="0-100" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label>Giai đoạn <span class="text-error-500">*</span></Label>
              <Select v-model="form.stage">
                <SelectTrigger><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="column in columns" :key="column.id" :value="column.id">{{ column.name }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label>Nguồn</Label>
              <Select v-model="form.source">
                <SelectTrigger><SelectValue placeholder="Chọn nguồn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div class="space-y-1.5">
            <Label for="deal-note">Mô tả</Label>
            <Textarea id="deal-note" v-model="form.description" rows="3" placeholder="Mô tả deal" />
          </div>
        </div>

        <DialogFooter class="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button variant="outline" @click="showDealDialog = false">Hủy</Button>
          <Button class="bg-primary-500 text-white hover:bg-primary-600" :disabled="isSubmitting" @click="submitDeal">
            <Loader2 v-if="isSubmitting" class="mr-1.5 h-4 w-4 animate-spin" />
            {{ editingDealId ? 'Lưu thay đổi' : 'Tạo Deal' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { createDeal, deleteDeal, listDealsKanban, updateDeal, updateDealStage } from '@/services/deals'
import type { DealCard, DealStage, DealsKanbanPayload, KanbanColumn, KanbanKpi } from '@/types/deals'
import {
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

interface DealForm {
  title: string
  company: string
  contact: string
  contactTitle: string
  phone: string
  email: string
  value: string
  probability: string
  stage: DealStage
  source: string
  description: string
}

const selectedPipeline = ref('Bán hàng B2B')
const showDealDialog = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)
const editingDealId = ref<string | null>(null)

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'new', name: 'Mới', color: '#6B7280', total: '₫ 0', cards: [] },
  { id: 'preparing', name: 'Đang chuẩn bị', color: '#3B82F6', total: '₫ 0', cards: [] },
  { id: 'contacted', name: 'Đã liên hệ', color: '#06B6D4', total: '₫ 0', cards: [] },
  { id: 'negotiating', name: 'Đàm phán', color: '#F59E0B', total: '₫ 0', cards: [] },
  { id: 'quoted', name: 'Báo giá', color: '#8B5CF6', total: '₫ 0', cards: [] },
  { id: 'won', name: 'Thắng', color: '#10B981', total: '₫ 0', cards: [] },
  { id: 'lost', name: 'Thua', color: '#EF4444', total: '₫ 0', cards: [] },
]

const columns = ref<KanbanColumn[]>(structuredClone(DEFAULT_COLUMNS))
const kpis = ref<KanbanKpi[]>([])
const dragging = ref<{ dealId: string; fromStage: DealStage } | null>(null)

const form = ref<DealForm>({
  title: '',
  company: '',
  contact: '',
  value: '',
  probability: '0',
  stage: 'new',
  source: 'website',
  description: '',
})

let socket: ReturnType<typeof getSocket> | null = null

function applyKanban(payload: DealsKanbanPayload): void {
  selectedPipeline.value = payload.selectedPipeline || selectedPipeline.value
  kpis.value = payload.kpis ?? []
  columns.value = payload.columns?.length ? payload.columns : structuredClone(DEFAULT_COLUMNS)
}

function resetForm(stage: DealStage = 'new'): void {
  form.value = {
    title: '',
    company: '',
    contact: '',
    contactTitle: '',
    phone: '',
    email: '',
    value: '',
    probability: '0',
    stage,
    source: 'website',
    description: '',
  }
}

function openCreateDialog(stage?: DealStage): void {
  editingDealId.value = null
  resetForm(stage ?? 'new')
  showDealDialog.value = true
}

function openEditDialog(card: DealCard, stage: DealStage): void {
  editingDealId.value = card.id
  form.value = {
    title: card.title,
    company: card.company,
    contact: '',
    contactTitle: '',
    phone: '',
    email: '',
    value: card.value.replace(/[^0-9]/g, ''),
    probability: '0',
    stage,
    source: card.source?.toLowerCase() ?? 'website',
    description: '',
  }
  showDealDialog.value = true
}

function findColumn(stage: DealStage): KanbanColumn | undefined {
  return columns.value.find((column) => column.id === stage)
}

function removeCardById(dealId: string): { card: DealCard; stage: DealStage } | null {
  for (const column of columns.value) {
    const index = column.cards.findIndex((item) => item.id === dealId)
    if (index >= 0) {
      const [card] = column.cards.splice(index, 1)
      return { card, stage: column.id }
    }
  }
  return null
}

function addCardToStage(stage: DealStage, card: DealCard): void {
  const column = findColumn(stage)
  if (!column) {
    return
  }
  column.cards.unshift(card)
}

function moveCard(dealId: string, toStage: DealStage): { fromStage: DealStage; toStage: DealStage } | null {
  const removed = removeCardById(dealId)
  if (!removed) {
    return null
  }
  addCardToStage(toStage, removed.card)
  return { fromStage: removed.stage, toStage }
}

async function loadKanban(showError = true): Promise<void> {
  isLoading.value = true
  const result = await listDealsKanban()
  isLoading.value = false

  if (!result.isSuccess) {
    if (showError) {
      toast.error(result.error || 'Không thể tải dữ liệu Kanban')
    }
    return
  }

  applyKanban(result.data)
}

async function submitDeal(): Promise<void> {
  const title = form.value.title.trim()
  if (!title) {
    toast.error('Tên deal là bắt buộc')
    return
  }

  const value = Number(form.value.value || '0')
  if (value < 0) {
    toast.error('Giá trị phải lớn hơn hoặc bằng 0')
    return
  }

  isSubmitting.value = true

  if (!editingDealId.value) {
    const tempId = `temp-${Date.now()}`
    const optimisticCard: DealCard = {
      id: tempId,
      title,
      company: form.value.company || form.value.contact || '—',
      value: `₫ ${value.toLocaleString('vi-VN')}`,
      source: form.value.source.toUpperCase(),
      hasActions: true,
      assignees: [1],
      isOptimistic: true,
    }

    addCardToStage(form.value.stage, optimisticCard)

    const result = await createDeal({
      title,
      company: form.value.company,
      contact: form.value.contact,
      stage: form.value.stage,
      value,
      probability: Number(form.value.probability || '0'),
      source: form.value.source,
      description: form.value.description,
    })

    if (!result.isSuccess) {
      removeCardById(tempId)
      isSubmitting.value = false
      toast.error(result.error || 'Tạo deal thất bại')
      return
    }

    applyKanban(result.data.kanban)
    toast.success(`Đã tạo deal: ${title}`)
  } else {
    const dealId = editingDealId.value
    const snapshot = structuredClone(columns.value)

    moveCard(dealId, form.value.stage)
    const target = findColumn(form.value.stage)
    const card = target?.cards.find((item) => item.id === dealId)
    if (card) {
      card.title = title
      card.company = form.value.company || form.value.contact || '—'
      card.value = `₫ ${value.toLocaleString('vi-VN')}`
      card.source = form.value.source.toUpperCase()
    }

    const result = await updateDeal(dealId, {
      title,
      company: form.value.company,
      contact: form.value.contact,
      stage: form.value.stage,
      value,
      probability: Number(form.value.probability || '0'),
      source: form.value.source,
      description: form.value.description,
    })

    if (!result.isSuccess) {
      columns.value = snapshot
      isSubmitting.value = false
      toast.error(result.error || 'Cập nhật deal thất bại')
      return
    }

    toast.success('Đã cập nhật deal')
    void loadKanban(false)
  }

  isSubmitting.value = false
  showDealDialog.value = false
}

async function removeDeal(dealId: string): Promise<void> {
  const snapshot = structuredClone(columns.value)
  const removed = removeCardById(dealId)
  if (!removed) {
    return
  }

  const result = await deleteDeal(dealId)
  if (!result.isSuccess) {
    columns.value = snapshot
    toast.error(result.error || 'Xóa deal thất bại')
    return
  }

  toast.success('Đã xóa deal')
}

function handleDragStart(dealId: string, fromStage: DealStage): void {
  dragging.value = { dealId, fromStage }
}

async function handleDrop(toStage: DealStage): Promise<void> {
  if (!dragging.value) {
    return
  }

  const { dealId, fromStage } = dragging.value
  dragging.value = null

  if (fromStage === toStage) {
    return
  }

  const moved = moveCard(dealId, toStage)
  if (!moved) {
    return
  }

  const result = await updateDealStage(dealId, toStage)
  if (!result.isSuccess) {
    moveCard(dealId, fromStage)
    toast.error(result.error || 'Không thể cập nhật giai đoạn')
    return
  }
}

function bindRealtime(): void {
  socket = getSocket()

  const sync = () => {
    void loadKanban(false)
  }

  socket.on('deal.created', sync)
  socket.on('deal.updated', sync)
  socket.on('deal.deleted', sync)
}

onMounted(() => {
  void loadKanban()
  bindRealtime()
})

onUnmounted(() => {
  if (socket) {
    socket.off('deal.created')
    socket.off('deal.updated')
    socket.off('deal.deleted')
  }
  disconnectSocket()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.kanban-container {
  display: flex;
  gap: 16px;
  min-width: max-content;
  padding-bottom: 8px;
  scroll-snap-type: x mandatory;
}

.kanban-column {
  width: 280px;
  min-width: 280px;
  scroll-snap-align: start;
}

@media (max-width: 768px) {
  .kanban-column {
    width: 85vw;
    min-width: 85vw;
  }
}

@media (min-width: 769px) and (max-width: 1279px) {
  .kanban-column {
    width: calc(50vw - 20px);
    min-width: calc(50vw - 20px);
  }
}
</style>
