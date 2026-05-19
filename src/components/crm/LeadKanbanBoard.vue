<template>
  <div class="flex h-full min-h-0 flex-col">

    <!-- Board -->
    <div class="custom-scrollbar flex-1 overflow-x-auto overflow-y-hidden p-4">
      <div class="lead-kanban-container h-full">

        <div
          v-for="column in columns"
          :key="column.id"
          class="lead-kanban-column flex h-full shrink-0 flex-col"
          @dragover.prevent
          @drop="handleDrop(column.id)"
        >
          <!-- Column header -->
          <div class="mb-2 overflow-hidden rounded-xl shadow-theme-xs">
            <!-- Title row -->
            <div
              class="flex items-center justify-between px-3 py-2"
              :style="{ background: column.headerBg }"
            >
              <span class="text-sm font-bold text-white drop-shadow-sm">
                {{ column.name }}
                <span class="ml-1 font-normal opacity-80">({{ column.cards.length }})</span>
              </span>
              <button
                type="button"
                class="rounded p-0.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                @click="openCreateDialog(column.id)"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <!-- Total value -->
            <div class="border-b border-gray-200 bg-white/95 px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800/95">
              <p class="text-base font-bold tabular-nums text-gray-900 dark:text-white">
                {{ column.totalValue }}
              </p>
            </div>

            <!-- Quick Lead (first column only) -->
            <div v-if="column.id === 'lead'" class="bg-white/95 px-3 pb-2 pt-1.5 dark:bg-gray-800/95">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-success-500 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-success-600"
                @click="openCreateDialog('lead')"
              >
                <Plus class="h-3.5 w-3.5" />
                Quick Lead
              </button>
            </div>
          </div>

          <!-- Card list -->
          <div class="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-0.5">
            <div
              v-if="column.cards.length === 0"
              class="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/30"
            >
              <p class="text-xs italic text-gray-400 dark:text-gray-600">Chưa có lead</p>
            </div>

            <div
              v-for="card in column.cards"
              :key="card.id"
              class="group relative cursor-grab rounded-xl border border-gray-200 bg-white shadow-theme-xs transition hover:shadow-theme-sm active:cursor-grabbing dark:border-gray-700 dark:bg-gray-800"
              :class="card.isOptimistic ? 'animate-pulse border-primary-300' : ''"
              draggable="true"
              @dragstart="handleDragStart(card.id, column.id)"
            >
              <!-- Main body -->
              <div class="flex gap-2 p-3">
                <!-- Left content -->
                <div class="min-w-0 flex-1">
                  <!-- Title -->
                  <p class="mb-0.5 text-sm font-semibold leading-snug text-gray-900 hover:text-primary-500 dark:text-white">
                    {{ card.title }}
                  </p>

                  <!-- Repeat tag -->
                  <p v-if="card.isRepeat" class="mb-1 text-xs text-gray-400 dark:text-gray-500">repeat</p>

                  <!-- Assignee -->
                  <p
                    v-if="card.assigneeName"
                    class="mb-0.5 truncate text-xs font-medium"
                    :style="{ color: card.assigneeColor ?? '#465fff' }"
                  >
                    {{ card.assigneeName }}
                  </p>

                  <!-- Company -->
                  <p
                    v-if="card.companyName"
                    class="mb-1 truncate text-xs font-medium text-primary-500 dark:text-primary-400"
                  >
                    {{ card.companyName }}
                  </p>

                  <!-- Date -->
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ card.date }}</p>

                  <!-- Task label -->
                  <p v-if="card.hasTask" class="mt-1 text-xs text-gray-400 dark:text-gray-500">Task</p>
                </div>

                <!-- Right icons -->
                <div class="flex shrink-0 flex-col items-center gap-1.5 pt-0.5">
                  <!-- Badge count -->
                  <span class="mb-0.5 min-w-[18px] rounded-full bg-gray-100 px-1.5 py-0.5 text-center text-[10px] leading-4 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                    {{ card.badgeCount }}
                  </span>
                  <!-- Phone -->
                  <button
                    type="button"
                    class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-white shadow-sm transition hover:bg-brand-600"
                    title="Gọi điện"
                  >
                    <Phone class="h-3 w-3" />
                  </button>
                  <!-- Email -->
                  <button
                    type="button"
                    class="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-brand-300 hover:text-brand-500 dark:border-gray-600 dark:hover:border-brand-500"
                    title="Gửi email"
                  >
                    <Mail class="h-3 w-3" />
                  </button>
                  <!-- Message -->
                  <button
                    type="button"
                    class="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-400 transition hover:border-brand-300 hover:text-brand-500 dark:border-gray-600 dark:hover:border-brand-500"
                    title="Nhắn tin"
                  >
                    <MessageSquare class="h-3 w-3" />
                  </button>
                </div>
              </div>

              <!-- Badges row -->
              <div v-if="card.isViewed" class="px-3 pb-1">
                <span class="inline-flex items-center rounded-md border border-success-200 bg-success-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
                  VIEWED
                </span>
              </div>

              <!-- Footer: Activity + time + avatar -->
              <div class="flex items-center justify-between border-t border-gray-100 px-3 py-2 dark:border-gray-700/60">
                <button
                  type="button"
                  class="flex items-center gap-1 text-xs text-gray-400 transition hover:text-primary-500 dark:text-gray-500"
                >
                  <Plus class="h-3 w-3" />
                  Activity
                </button>
                <div class="flex items-center gap-2">
                  <span v-if="card.activityTime" class="text-[11px] text-gray-400 dark:text-gray-500">
                    {{ card.activityTime }}
                  </span>
                  <!-- Avatar -->
                  <div
                    class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    :style="{ backgroundColor: card.avatarColor ?? '#6B7280' }"
                    :title="card.assigneeName ?? ''"
                  >
                    {{ card.avatarInitials ?? '?' }}
                  </div>
                </div>
              </div>

              <!-- Edit / Delete on hover -->
              <div class="absolute right-1 top-1 hidden items-center gap-0.5 group-hover:flex">
                <button
                  type="button"
                  class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-gray-700"
                  @click.stop="openEditDialog(card, column.id)"
                >
                  <Pencil class="h-3 w-3" />
                </button>
                <button
                  type="button"
                  class="rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
                  @click.stop="removeCard(card.id)"
                >
                  <Trash2 class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Create / Edit Lead Dialog -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader class="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingId ? 'Cập nhật Lead' : 'Tạo Lead mới' }}
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
            Điền thông tin để thêm lead vào CRM
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-1.5">
            <Label for="l-title">Tên lead <span class="text-error-500">*</span></Label>
            <Input id="l-title" v-model="form.title" placeholder="Họ tên hoặc tên cơ hội" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="l-assignee">Người phụ trách</Label>
              <Input id="l-assignee" v-model="form.assigneeName" placeholder="Tên nhân viên" />
            </div>
            <div class="space-y-1.5">
              <Label for="l-company">Công ty</Label>
              <Input id="l-company" v-model="form.companyName" placeholder="Tên công ty" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="l-phone">Số điện thoại</Label>
              <Input id="l-phone" v-model="form.phone" type="tel" placeholder="0901 234 567" />
            </div>
            <div class="space-y-1.5">
              <Label for="l-email">Email</Label>
              <Input id="l-email" v-model="form.email" type="email" placeholder="email@congty.com" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label>Giai đoạn <span class="text-error-500">*</span></Label>
              <Select v-model="form.stage">
                <SelectTrigger><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="col in columns" :key="col.id" :value="col.id">
                    {{ col.name }}
                  </SelectItem>
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
                  <SelectItem value="zalo">Zalo</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button variant="outline" @click="showDialog = false">Hủy</Button>
          <Button class="bg-primary-500 text-white hover:bg-primary-600" @click="submitForm">
            {{ editingId ? 'Lưu thay đổi' : 'Tạo Lead' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, MessageSquare, Pencil, Phone, Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
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

// ─── Types ────────────────────────────────────────────────────

type LeadStage = 'lead' | 'mql' | 'sql' | 'opportunity' | 'customer' | 'evangelist'

interface LeadCard {
  id: string
  title: string
  isRepeat?: boolean
  assigneeName?: string
  assigneeColor?: string
  companyName?: string
  date: string
  hasTask?: boolean
  isViewed?: boolean
  activityTime?: string
  avatarInitials?: string
  avatarColor?: string
  badgeCount: number
  phone?: string
  email?: string
  source?: string
  isOptimistic?: boolean
}

interface LeadColumn {
  id: LeadStage
  name: string
  headerBg: string
  totalValue: string
  cards: LeadCard[]
}

interface LeadForm {
  title: string
  assigneeName: string
  companyName: string
  phone: string
  email: string
  source: string
  stage: LeadStage
}

// ─── Helpers ──────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_COLORS = ['#465fff', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899']
function pickColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

// ─── Mock data ────────────────────────────────────────────────

const columns = ref<LeadColumn[]>([
  {
    id: 'lead',
    name: 'Lead',
    headerBg: 'linear-gradient(135deg,#F59E0B,#D97706)',
    totalValue: '438 764 000',
    cards: [
      {
        id: 'l1', title: 'Tram Máy Sapa', isRepeat: true,
        assigneeName: 'Nguyễn Anh Tùng', assigneeColor: '#465fff',
        date: '13 May', isViewed: true, activityTime: '2 Minutes',
        avatarInitials: 'AT', avatarColor: '#465fff', badgeCount: 0,
      },
      {
        id: 'l2', title: '[AFF] D-Mart Hotel',
        date: 'Hôm nay, 3:54 CH', activityTime: 'Hôm nay 3:54 CH',
        avatarInitials: 'DM', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 'l3', title: 'Forever Green Resort',
        date: '15 Tháng 4', activityTime: 'Hôm nay 3:00 CH',
        avatarInitials: 'FG', avatarColor: '#8B5CF6', badgeCount: 0,
      },
    ],
  },
  {
    id: 'mql',
    name: 'MQL',
    headerBg: 'linear-gradient(135deg,#10B981,#059669)',
    totalValue: '358 773 263',
    cards: [
      {
        id: 'm1', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        assigneeName: 'Chi Hồng', assigneeColor: '#10B981',
        companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT',
        date: '38 phút trước', activityTime: '37 Minutes',
        avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 'm2', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        date: '38 phút trước', activityTime: '38 Minutes',
        avatarInitials: 'PO', avatarColor: '#F59E0B', badgeCount: 0,
      },
      {
        id: 'm3', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API — Nam', isRepeat: true,
        date: '39 phút trước', activityTime: '39 Minutes',
        avatarInitials: 'NA', avatarColor: '#EF4444', badgeCount: 0,
      },
      {
        id: 'm4', title: 'FORM ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        date: '41 phút trước', activityTime: '41 Minutes',
        avatarInitials: 'FK', avatarColor: '#6366F1', badgeCount: 0,
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL',
    headerBg: 'linear-gradient(135deg,#0D9488,#0F766E)',
    totalValue: '896 226 080',
    cards: [
      {
        id: 's1', title: 'Khách sạn Emma', isRepeat: true,
        assigneeName: 'Chi Hồng', assigneeColor: '#10B981',
        companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT',
        date: 'Hôm nay, 4:28 CH', activityTime: 'Hôm nay 4:28 CH',
        avatarInitials: 'KE', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 's2', title: '[AFF] Khách sạn Thành Cao',
        date: 'Hôm nay, 4:12 CH', activityTime: 'Hôm nay 4:12 CH',
        avatarInitials: 'TC', avatarColor: '#06B6D4', badgeCount: 0,
      },
      {
        id: 's3', title: 'Marisol Hotel Đà Nẵng',
        date: '15 Tháng 4', activityTime: 'Hôm nay 4:05 CH',
        avatarInitials: 'MH', avatarColor: '#8B5CF6', badgeCount: 0,
      },
      {
        id: 's4', title: 'Khách sạn 43p_Đà Lạt',
        date: '15 Tháng 4',
        avatarInitials: 'DL', avatarColor: '#F59E0B', badgeCount: 0,
      },
    ],
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    headerBg: 'linear-gradient(135deg,#0EA5E9,#0284C7)',
    totalValue: '0',
    cards: [
      {
        id: 'o1', title: 'Golden Hotel',
        date: '13 May', activityTime: '13 May',
        avatarInitials: 'GH', avatarColor: '#0EA5E9', badgeCount: 0,
      },
      {
        id: 'o2', title: 'Lovera Signature',
        date: '12 May', activityTime: '12 May',
        avatarInitials: 'LS', avatarColor: '#EC4899', badgeCount: 0,
      },
      {
        id: 'o3', title: '[AFF] MonSoon Boutique Hotel Da Lat',
        date: '5 May', activityTime: '5 May',
        avatarInitials: 'MB', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 'o4', title: '[AFF] Khách Sạn Cường Thanh 1 & 2',
        date: '23 March',
        avatarInitials: 'CT', avatarColor: '#6366F1', badgeCount: 0,
      },
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    headerBg: 'linear-gradient(135deg,#3B82F6,#2563EB)',
    totalValue: '332 622 877',
    cards: [
      {
        id: 'c1', title: 'Resort Dakke Mang Den_56p_ezCloudhotel', isRepeat: true,
        assigneeName: 'Bảo Trần', assigneeColor: '#465fff',
        companyName: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ DU LỊCH KHÁNH DƯƠNG MĂNG ĐEN',
        date: '15 May', activityTime: '15 May',
        avatarInitials: 'BT', avatarColor: '#465fff', badgeCount: 0,
      },
      {
        id: 'c2', title: 'FORM ĐĂNG KÝ DÙNG THỬ API Trần Thế Hùng', isRepeat: true,
        date: '13 May', activityTime: '13 May',
        avatarInitials: 'TH', avatarColor: '#8B5CF6', badgeCount: 0,
      },
      {
        id: 'c3', title: 'Agarwood Hotel_16p_ezCloudhotel nâng cao', isRepeat: true,
        assigneeName: 'Chi Hương', assigneeColor: '#10B981',
        companyName: 'CHI NHÁNH CÔNG TY TNHH MỸ NGHỆ THẮNG TRÌNH - KHÁCH SẠN TRĂM HƯƠNG',
        date: '6 Apr', activityTime: '6 Apr',
        avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0,
      },
    ],
  },
  {
    id: 'evangelist',
    name: 'Evangelist',
    headerBg: 'linear-gradient(135deg,#6366F1,#4F46E5)',
    totalValue: '0',
    cards: [],
  },
])

// ─── Dialog state ──────────────────────────────────────────────

const showDialog = ref(false)
const editingId = ref<string | null>(null)

const form = ref<LeadForm>({
  title: '',
  assigneeName: '',
  companyName: '',
  phone: '',
  email: '',
  source: 'website',
  stage: 'lead',
})

// ─── Column helpers ───────────────────────────────────────────

function findColumn(stage: LeadStage): LeadColumn | undefined {
  return columns.value.find((c) => c.id === stage)
}

function removeCardById(id: string): { card: LeadCard; stage: LeadStage } | null {
  for (const col of columns.value) {
    const idx = col.cards.findIndex((c) => c.id === id)
    if (idx >= 0) {
      const [card] = col.cards.splice(idx, 1)
      return { card, stage: col.id }
    }
  }
  return null
}

function addCard(stage: LeadStage, card: LeadCard): void {
  findColumn(stage)?.cards.unshift(card)
}

// ─── Dialog ───────────────────────────────────────────────────

function openCreateDialog(stage?: LeadStage): void {
  editingId.value = null
  form.value = {
    title: '',
    assigneeName: '',
    companyName: '',
    phone: '',
    email: '',
    source: 'website',
    stage: stage ?? 'lead',
  }
  showDialog.value = true
}

function openEditDialog(card: LeadCard, stage: LeadStage): void {
  editingId.value = card.id
  form.value = {
    title: card.title,
    assigneeName: card.assigneeName ?? '',
    companyName: card.companyName ?? '',
    phone: card.phone ?? '',
    email: card.email ?? '',
    source: card.source ?? 'website',
    stage,
  }
  showDialog.value = true
}

function submitForm(): void {
  const title = form.value.title.trim()
  if (!title) {
    toast.error('Tên lead là bắt buộc')
    return
  }

  const now = new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
  const assignee = form.value.assigneeName.trim()

  if (editingId.value) {
    for (const col of columns.value) {
      const card = col.cards.find((c) => c.id === editingId.value)
      if (card) {
        if (col.id !== form.value.stage) {
          removeCardById(editingId.value)
          addCard(form.value.stage, { ...card, title, assigneeName: assignee || undefined, companyName: form.value.companyName.trim() || undefined, source: form.value.source })
        } else {
          card.title = title
          card.assigneeName = assignee || undefined
          card.companyName = form.value.companyName.trim() || undefined
          card.source = form.value.source
        }
        break
      }
    }
    toast.success('Đã cập nhật lead')
  } else {
    const newCard: LeadCard = {
      id: `lead-${Date.now()}`,
      title,
      assigneeName: assignee || undefined,
      assigneeColor: assignee ? pickColor(assignee) : undefined,
      companyName: form.value.companyName.trim() || undefined,
      phone: form.value.phone.trim() || undefined,
      email: form.value.email.trim() || undefined,
      source: form.value.source,
      date: now,
      activityTime: now,
      avatarInitials: assignee ? initials(assignee) : title.slice(0, 2).toUpperCase(),
      avatarColor: pickColor(title),
      badgeCount: 0,
    }
    addCard(form.value.stage, newCard)
    toast.success(`Đã thêm lead: ${title}`)
  }

  showDialog.value = false
}

function removeCard(id: string): void {
  removeCardById(id)
  toast.success('Đã xóa lead')
}

// ─── Drag-drop ────────────────────────────────────────────────

const dragging = ref<{ id: string; fromStage: LeadStage } | null>(null)

function handleDragStart(id: string, fromStage: LeadStage): void {
  dragging.value = { id, fromStage }
}

function handleDrop(toStage: LeadStage): void {
  if (!dragging.value) return
  const { id, fromStage } = dragging.value
  dragging.value = null
  if (fromStage === toStage) return
  const removed = removeCardById(id)
  if (removed) addCard(toStage, removed.card)
}

defineExpose({ openCreateDialog })
</script>

<style scoped>
.lead-kanban-container {
  display: flex;
  gap: 14px;
  min-width: max-content;
  padding-bottom: 8px;
}

.lead-kanban-column {
  width: 270px;
  min-width: 270px;
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,.03); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
