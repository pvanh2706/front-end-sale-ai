<template>
  <div class="flex gap-3 items-start">

    <!-- ===== LEFT: Activity card ===== -->
    <div
      class="min-w-0 flex-1 rounded-xl border bg-white dark:bg-gray-900 shadow-theme-xs transition-all"
      :class="[
        item.isNew ? 'border-brand-200 dark:border-brand-500/30' : 'border-gray-200 dark:border-gray-800',
        item.isClosed && mode === 'view' ? 'opacity-60' : '',
      ]"
    >

      <!-- ── VIEW MODE ─────────────────────────────────────── -->
      <template v-if="mode === 'view'">
        <div class="p-4">
          <!-- Header row: badge • title • [closed] • actions -->
          <div class="flex items-start gap-2 mb-1.5">
            <span
              class="mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-theme-xs font-semibold"
              :class="item.badgeClass"
            >{{ item.badge }}</span>

            <p class="min-w-0 flex-1 text-theme-sm font-medium leading-snug text-gray-900 dark:text-white">
              {{ item.title }}
            </p>

            <!-- Closed badge -->
            <span
              v-if="item.isClosed"
              class="shrink-0 rounded-full border border-success-200 bg-success-50 px-2 py-0.5 text-theme-xs font-semibold text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400"
            >Đã đóng</span>

            <!-- Normal action icons -->
            <div v-if="!confirmingDelete" class="flex shrink-0 items-center gap-0.5">
              <!-- Kết quả -->
              <button
                type="button"
                class="rounded-md p-1.5 transition-colors"
                :class="item.result
                  ? 'text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10'
                  : 'text-gray-400 hover:bg-success-50 hover:text-success-500 dark:hover:bg-success-500/10 dark:hover:text-success-400'"
                :title="item.result ? 'Cập nhật kết quả' : 'Thêm kết quả'"
                @click="mode = 'result'"
              >
                <CheckCircle2 class="h-4 w-4" />
              </button>
              <!-- Chỉnh sửa -->
              <button
                type="button"
                class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                title="Chỉnh sửa"
                @click="enterEdit"
              >
                <Pencil class="h-4 w-4" />
              </button>
              <!-- Xóa -->
              <button
                type="button"
                class="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10 dark:hover:text-error-400"
                title="Xóa"
                @click="confirmingDelete = true"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>

            <!-- Delete confirmation inline -->
            <div v-else class="flex shrink-0 items-center gap-2">
              <span class="text-theme-xs font-medium text-error-500">Xác nhận xóa?</span>
              <button
                type="button"
                class="text-theme-xs font-semibold text-error-500 hover:underline"
                @click="doDelete"
              >Xóa</button>
              <button
                type="button"
                class="text-theme-xs text-gray-400 hover:underline"
                @click="confirmingDelete = false"
              >Hủy</button>
            </div>
          </div>

          <!-- Detail -->
          <p v-if="item.detail" class="mb-1 text-theme-sm leading-relaxed text-gray-500">{{ item.detail }}</p>

          <!-- Result pill -->
          <div
            v-if="item.result"
            class="mt-2 inline-flex items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-3 py-0.5 dark:border-success-500/30 dark:bg-success-500/10"
          >
            <CheckCircle2 class="h-3 w-3 shrink-0 text-success-500" />
            <span class="text-theme-xs font-medium text-success-700 dark:text-success-400">{{ item.result }}</span>
          </div>

          <!-- Time -->
          <p class="mt-2 text-theme-xs text-gray-400">{{ item.time }}</p>
        </div>
      </template>

      <!-- ── EDIT MODE ─────────────────────────────────────── -->
      <template v-else-if="mode === 'edit'">
        <div class="space-y-3 p-4">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-theme-sm font-semibold text-gray-900 dark:text-white">
              <Pencil class="h-3.5 w-3.5 text-brand-500" />
              Chỉnh sửa hoạt động
            </span>
            <button
              type="button"
              class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              @click="mode = 'view'"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Tiêu đề -->
          <div class="space-y-1.5">
            <Label for="ei-title" class="text-theme-xs text-gray-500">Tiêu đề</Label>
            <Input id="ei-title" v-model="editForm.title" placeholder="Tiêu đề hoạt động..." />
          </div>

          <!-- Thời gian + Thời lượng -->
          <div class="grid gap-3" :class="showDuration ? 'grid-cols-2' : 'grid-cols-1'">
            <div class="space-y-1.5">
              <Label for="ei-date" class="text-theme-xs text-gray-500">Thời gian</Label>
              <Input id="ei-date" type="datetime-local" v-model="editForm.date" />
            </div>
            <div v-if="showDuration" class="space-y-1.5">
              <Label class="text-theme-xs text-gray-500">Thời lượng</Label>
              <Select v-model="editForm.duration">
                <SelectTrigger><SelectValue placeholder="Chọn..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="d in DURATIONS" :key="d" :value="d">{{ d }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Ghi chú -->
          <div class="space-y-1.5">
            <Label for="ei-note" class="text-theme-xs text-gray-500">Ghi chú</Label>
            <Textarea
              id="ei-note"
              v-model="editForm.note"
              placeholder="Nội dung trao đổi, ghi chú..."
              :rows="3"
              class="resize-none"
            />
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <Button type="button" variant="outline" size="sm" class="border-gray-200 text-theme-xs dark:border-gray-700" @click="mode = 'view'">Hủy</Button>
            <Button type="button" size="sm" class="bg-brand-500 text-white hover:bg-brand-600 text-theme-xs" @click="saveEdit">Lưu</Button>
          </div>
        </div>
      </template>

      <!-- ── RESULT MODE ────────────────────────────────────── -->
      <template v-else-if="mode === 'result'">
        <div class="space-y-3 p-4">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5 text-theme-sm font-semibold text-gray-900 dark:text-white">
              <CheckCircle2 class="h-3.5 w-3.5 text-success-500" />
              Ghi nhận kết quả
            </span>
            <button
              type="button"
              class="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              @click="mode = 'view'"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <!-- Kết quả -->
          <div class="space-y-1.5">
            <Label class="text-theme-xs text-gray-500">Kết quả hoạt động</Label>
            <Select v-model="resultForm.outcome">
              <SelectTrigger><SelectValue placeholder="Chọn kết quả..." /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="o in OUTCOMES" :key="o" :value="o">{{ o }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Ghi chú kết quả -->
          <div class="space-y-1.5">
            <Label for="ri-note" class="text-theme-xs text-gray-500">Ghi chú kết quả</Label>
            <Textarea
              id="ri-note"
              v-model="resultForm.note"
              placeholder="Mô tả chi tiết kết quả..."
              :rows="2"
              class="resize-none"
            />
          </div>

          <!-- Hẹn follow-up -->
          <div class="space-y-1.5">
            <Label for="ri-followup" class="text-theme-xs text-gray-500">Hẹn follow-up (tuỳ chọn)</Label>
            <Input id="ri-followup" type="date" v-model="resultForm.followUpDate" />
          </div>

          <!-- Đóng hoạt động -->
          <div class="flex items-center gap-2">
            <Checkbox id="ri-close" v-model:checked="resultForm.close" />
            <Label for="ri-close" class="cursor-pointer text-theme-xs text-gray-600 dark:text-gray-400">
              Đóng hoạt động này sau khi lưu
            </Label>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <Button type="button" variant="outline" size="sm" class="border-gray-200 text-theme-xs dark:border-gray-700" @click="mode = 'view'">Hủy</Button>
            <Button type="button" size="sm" class="bg-success-600 text-white hover:bg-success-700 text-theme-xs" @click="saveResult">Lưu kết quả</Button>
          </div>
        </div>
      </template>

    </div>

    <!-- ===== RIGHT: AI Suggestion (view mode only) ===== -->
    <Transition name="slide-fade">
      <div
        v-if="mode === 'view'"
        class="hidden lg:block w-72 shrink-0 rounded-xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-4 dark:border-brand-500/30 dark:from-brand-500/10 dark:via-gray-900 dark:to-gray-900"
      >
        <div class="mb-2.5 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <Sparkles class="h-3.5 w-3.5 text-brand-500" />
            <span class="text-theme-xs font-semibold text-brand-600 dark:text-brand-400">AI gợi ý</span>
          </div>
          <button
            type="button"
            class="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            @click="copyToClipboard"
          >
            <Copy class="h-3 w-3" />
            Copy
          </button>
        </div>
        <p class="whitespace-pre-line text-theme-xs leading-relaxed text-gray-600 dark:text-gray-400">
          {{ item.aiSuggestion }}
        </p>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CheckCircle2, Copy, Pencil, Sparkles, Trash2, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// ─── Exported shared types ────────────────────────────────────

export interface CardActivityItem {
  id: string
  title: string
  detail: string
  time: string
  badge: string
  badgeClass: string
  aiSuggestion: string
  isNew?: boolean
  type: string        // 'call' | 'email' | 'message' | 'social' | 'meeting' | 'other'
  subType?: string
  note?: string       // raw note for editing
  date?: string       // ISO datetime for editing
  duration?: string   // call/meeting duration
  result?: string     // filled after result is added
  isClosed?: boolean
}

export interface ActivityResultData {
  outcome: string
  note: string
  followUpDate: string
  close: boolean
}

// ─── Constants ────────────────────────────────────────────────

const DURATIONS = ['15 phút', '30 phút', '45 phút', '1 giờ', '1.5 giờ', '2 giờ', 'Khác']

const OUTCOMES = [
  'Không liên lạc được',
  'Đã liên lạc, chờ phản hồi',
  'Quan tâm, cần theo dõi',
  'Không quan tâm',
  'Hẹn lịch demo',
  'Đã gửi báo giá',
  'Chốt thành công',
]

// ─── Props & Emits ────────────────────────────────────────────

const props = defineProps<{ item: CardActivityItem }>()

const emit = defineEmits<{
  (e: 'update', id: string, changes: Partial<CardActivityItem>): void
  (e: 'remove', id: string): void
  (e: 'result', id: string, data: ActivityResultData): void
}>()

// ─── State ────────────────────────────────────────────────────

const mode = ref<'view' | 'edit' | 'result'>('view')
const confirmingDelete = ref(false)

const editForm = reactive({ title: '', date: '', note: '', duration: '' })
const resultForm = reactive({ outcome: '', note: '', followUpDate: '', close: false })

// ─── Computed ─────────────────────────────────────────────────

const showDuration = computed(
  () => props.item.type === 'call' || props.item.type === 'meeting',
)

// ─── Handlers ─────────────────────────────────────────────────

function enterEdit(): void {
  editForm.title    = props.item.title
  editForm.date     = props.item.date ?? new Date().toISOString().slice(0, 16)
  editForm.note     = props.item.note ?? props.item.detail
  editForm.duration = props.item.duration ?? '30 phút'
  confirmingDelete.value = false
  mode.value = 'edit'
}

function saveEdit(): void {
  if (!editForm.title.trim()) {
    toast.warning('Tiêu đề không được để trống')
    return
  }
  const newDetail = [
    props.item.subType ? `Loại: ${props.item.subType}` : '',
    editForm.note,
  ].filter(Boolean).join(' · ')

  emit('update', props.item.id, {
    title: editForm.title,
    note: editForm.note,
    detail: newDetail,
    date: editForm.date,
    duration: editForm.duration,
  })
  mode.value = 'view'
  toast.success('Đã cập nhật hoạt động')
}

function doDelete(): void {
  emit('remove', props.item.id)
}

function saveResult(): void {
  if (!resultForm.outcome) {
    toast.warning('Vui lòng chọn kết quả hoạt động')
    return
  }
  emit('result', props.item.id, { ...resultForm })
  mode.value = 'view'
  resultForm.outcome = ''
  resultForm.note = ''
  resultForm.followUpDate = ''
  resultForm.close = false
}

function copyToClipboard(): void {
  navigator.clipboard.writeText(props.item.aiSuggestion)
    .then(() => toast.success('Đã sao chép gợi ý AI'))
    .catch(() => toast.error('Không thể sao chép'))
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
