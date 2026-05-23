<template>
  <Dialog v-model:open="isOpen">
    <!-- flex column: header (fixed) + body (scrollable) + footer (fixed) -->
    <DialogContent class="sm:max-w-md flex flex-col gap-0 max-h-[90vh] overflow-hidden p-0">

      <!-- ── Header cố định ── -->
      <DialogHeader class="shrink-0 px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <DialogTitle class="text-gray-900 dark:text-white">Thêm hoạt động mới</DialogTitle>
      </DialogHeader>

      <!-- ── Body cuộn ── -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">

        <!-- ⓪ Hành động nhanh (preset actions) -->
        <Transition name="fade-slide">
          <div v-if="presetActions.length > 0" class="space-y-2">
            <p class="text-theme-xs font-semibold uppercase tracking-wide text-gray-400">Hành động nhanh</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="action in presetActions"
                :key="action.id"
                type="button"
                class="group flex cursor-pointer items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-sm transition-all"
                :class="selectedPresetId === action.id
                  ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-sm dark:border-brand-500 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-600'"
                @click="applyPresetAction(action)"
              >
                <span class="text-base leading-none">{{ action.emoji }}</span>
                <span class="font-medium">{{ action.name }}</span>
                <span
                  class="ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold transition-colors"
                  :class="selectedPresetId === action.id
                    ? 'bg-brand-100 text-brand-600 dark:bg-brand-800 dark:text-brand-300'
                    : 'bg-brand-50 text-brand-400 dark:bg-brand-900/30 dark:text-brand-500'"
                >{{ action.score }}đ</span>
                <span
                  class="rounded-full px-1.5 py-0.5 text-[10px] transition-colors"
                  :class="selectedPresetId === action.id
                    ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700/60 dark:text-gray-500'"
                >{{ action.durationMin }}ph</span>
              </button>
            </div>
            <div class="border-t border-gray-100 dark:border-gray-800" />
          </div>
        </Transition>

        <!-- ① Loại hoạt động -->
        <div class="space-y-2">
          <p class="text-theme-xs font-semibold uppercase tracking-wide text-gray-400">Loại hoạt động</p>
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="type in activityTypes"
              :key="type.id"
              type="button"
              class="flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              :class="selectedTypeId === type.id ? type.activeBg : type.defaultBg"
              @click="selectType(type.id)"
            >
              <component
                :is="type.icon"
                class="h-5 w-5 transition-colors"
                :class="selectedTypeId === type.id ? type.iconColor : 'text-gray-400 dark:text-gray-500'"
              />
              <span
                class="text-[11px] font-medium leading-tight"
                :class="selectedTypeId === type.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'"
              >{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- ② Chi tiết loại (sub-types) -->
        <Transition name="fade-slide">
          <div v-if="selectedType && selectedType.subTypes.length > 0" class="space-y-1.5">
            <p class="text-theme-xs font-semibold uppercase tracking-wide text-gray-400">Chi tiết loại</p>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="sub in selectedType.subTypes"
                :key="sub"
                type="button"
                class="rounded-full border px-3 py-1 text-theme-xs font-medium transition-colors"
                :class="selectedSubType === sub
                  ? 'bg-brand-500 border-brand-500 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-500 dark:hover:text-brand-400'"
                @click="selectedSubType = selectedSubType === sub ? '' : sub"
              >{{ sub }}</button>
            </div>
          </div>
        </Transition>

        <!-- ③ Thông tin chi tiết -->
        <Transition name="fade-slide">
          <div
            v-if="selectedType"
            class="space-y-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 p-4"
          >
            <!-- Tiêu đề -->
            <div class="space-y-1.5">
              <Label for="act-title" class="text-theme-xs text-gray-600 dark:text-gray-400">Tiêu đề hoạt động</Label>
              <Input
                id="act-title"
                v-model="form.title"
                placeholder="Nhập tiêu đề..."
              />
            </div>

            <!-- Thời gian + Thời lượng -->
            <div class="grid gap-3" :class="showDuration ? 'grid-cols-2' : 'grid-cols-1'">
              <div class="space-y-1.5">
                <Label for="act-date" class="text-theme-xs text-gray-600 dark:text-gray-400">
                  {{ selectedTypeId === 'task' ? 'Thời hạn' : 'Thời gian' }}
                </Label>
                <Input id="act-date" type="datetime-local" v-model="form.date" />
              </div>
              <div v-if="showDuration" class="space-y-1.5">
                <Label class="text-theme-xs text-gray-600 dark:text-gray-400">Thời lượng</Label>
                <Select v-model="form.duration">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="d in durations" :key="d" :value="d">{{ d }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Ghi chú -->
            <div class="space-y-1.5">
              <Label for="act-note" class="text-theme-xs text-gray-600 dark:text-gray-400">
                {{ selectedTypeId === 'note' ? 'Nội dung ghi chú' : selectedTypeId === 'task' ? 'Mô tả tác vụ' : 'Ghi chú' }}
              </Label>
              <Textarea
                id="act-note"
                v-model="form.note"
                :placeholder="notePlaceholder"
                :rows="4"
                class="resize-none"
              />
            </div>

          </div>
        </Transition>

        <!-- ④ Kênh liên lạc nhanh -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 space-y-2">
          <p class="text-theme-xs font-semibold uppercase tracking-wide text-gray-400">Mở nhanh kênh liên lạc</p>
          <div class="flex flex-wrap gap-2">
            <a
              v-for="ch in channels"
              :key="ch.id"
              :href="ch.disabled ? undefined : (ch.href ?? undefined)"
              :target="ch.href?.startsWith('http') ? '_blank' : undefined"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-theme-xs font-medium transition-colors"
              :class="[ch.colorClass, ch.disabled ? 'pointer-events-none opacity-40' : '']"
            >
              <component v-if="ch.icon" :is="ch.icon" class="h-3.5 w-3.5 shrink-0" />
              <span
                v-else
                class="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded text-[9px] font-black leading-none"
              >{{ ch.textIcon }}</span>
              {{ ch.label }}
            </a>
          </div>
          <p v-if="!contactPhone && !contactEmail" class="text-theme-xs italic text-gray-400">
            Thêm số điện thoại / email để mở nhanh kênh liên lạc.
          </p>
        </div>

      </div>

      <!-- ── Footer cố định — luôn hiển thị ── -->
      <div class="shrink-0 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800 px-6 py-4 bg-white dark:bg-gray-900">
        <!-- Trạng thái điền form -->
        <p class="text-theme-xs text-gray-400">
          <template v-if="!selectedTypeId">Chọn loại hoạt động để bắt đầu</template>
          <template v-else-if="!form.title.trim()">Nhập tiêu đề để lưu</template>
          <template v-else>
            <span class="text-success-500 font-medium">✓ Sẵn sàng lưu</span>
          </template>
        </p>
        <div class="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            class="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            @click="isOpen = false"
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="outline"
            class="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
            :disabled="!selectedTypeId || !form.title.trim()"
            @click="handleSubmit"
          >
            <Plus class="mr-1.5 h-4 w-4" />
            Lưu hoạt động
          </Button>
        </div>
      </div>

    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Component } from 'vue'
import {
  ListTodo,
  Linkedin,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Share2,
  Smartphone,
  StickyNote,
  Users,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useActionSettingsStore } from '@/stores/useActionSettingsStore'
import type { ActionModule, PresetAction } from '@/stores/useActionSettingsStore'

// ─── Types ────────────────────────────────────────────────────

interface Props {
  open: boolean
  module?: ActionModule
  contactName?: string
  contactPhone?: string
  contactEmail?: string
  initialType?: string
}

export interface ActivitySubmitPayload {
  type: string
  subType: string
  form: ActivityForm
}

interface ActivityForm {
  title: string
  date: string
  duration: string
  note: string
}

interface ActivityType {
  id: string
  label: string
  icon: Component
  iconColor: string
  activeBg: string
  defaultBg: string
  subTypes: string[]
}

interface Channel {
  id: string
  label: string
  icon?: Component
  textIcon?: string
  colorClass: string
  href: string | null
  disabled: boolean
}

// ─── Props & Emits ────────────────────────────────────────────

const props = withDefaults(defineProps<Props>(), {
  contactName: undefined,
  contactPhone: undefined,
  contactEmail: undefined,
  initialType: undefined,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'submitted', payload: ActivitySubmitPayload): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
})

// ─── Activity types ───────────────────────────────────────────

const activityTypes: ActivityType[] = [
  {
    id: 'call',
    label: 'Gọi điện',
    icon: Phone,
    iconColor: 'text-brand-500',
    activeBg: 'border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: ['Cold Call', 'Follow-up Call', 'Demo Call', 'Tư vấn'],
  },
  {
    id: 'email',
    label: 'Gửi Email',
    icon: Mail,
    iconColor: 'text-warning-500',
    activeBg: 'border-warning-400 bg-warning-50 dark:border-warning-500 dark:bg-warning-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: ['Cold Email', 'Email giới thiệu', 'Nurturing', 'Email báo giá'],
  },
  {
    id: 'message',
    label: 'Nhắn tin',
    icon: MessageCircle,
    iconColor: 'text-success-500',
    activeBg: 'border-success-400 bg-success-50 dark:border-success-500 dark:bg-success-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: ['Zalo', 'WhatsApp', 'SMS'],
  },
  {
    id: 'social',
    label: 'Mạng xã hội',
    icon: Share2,
    iconColor: 'text-purple-500',
    activeBg: 'border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: ['LinkedIn InMail', 'Facebook', 'Instagram'],
  },
  {
    id: 'meeting',
    label: 'Gặp trực tiếp',
    icon: Users,
    iconColor: 'text-teal-500',
    activeBg: 'border-teal-400 bg-teal-50 dark:border-teal-500 dark:bg-teal-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: ['Tại văn phòng', 'Tại khách hàng', 'Online (Zoom/Meet)'],
  },
  {
    id: 'note',
    label: 'Ghi chú',
    icon: StickyNote,
    iconColor: 'text-orange-500',
    activeBg: 'border-orange-400 bg-orange-50 dark:border-orange-500 dark:bg-orange-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: [],
  },
  {
    id: 'task',
    label: 'Tác vụ',
    icon: ListTodo,
    iconColor: 'text-indigo-500',
    activeBg: 'border-indigo-400 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: ['Gọi lại', 'Gửi tài liệu', 'Lên lịch demo', 'Xử lý yêu cầu'],
  },
  {
    id: 'other',
    label: 'Khác',
    icon: MoreHorizontal,
    iconColor: 'text-gray-500',
    activeBg: 'border-gray-400 bg-gray-100 dark:border-gray-500 dark:bg-gray-700',
    defaultBg: 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
    subTypes: [],
  },
]

// ─── State ────────────────────────────────────────────────────

// ─── Preset actions ──────────────────────────────────────────
const actionStore = useActionSettingsStore()
const presetActions = computed<PresetAction[]>(() =>
  props.module ? actionStore.getActions(props.module) : []
)
const selectedPresetId = ref<string | null>(null)

const EMOJI_TYPE_MAP: Record<string, string> = {
  '📞': 'call', '📧': 'email', '💬': 'message', '🤝': 'meeting',
  '📊': 'call', '✍️': 'note', '🔁': 'call',   '🎓': 'meeting',
  '🔧': 'note', '🛠️': 'note', '✅': 'note',   '📋': 'meeting',
  '📑': 'note', '🏆': 'task',
}

function applyPresetAction(action: PresetAction): void {
  const targetType = EMOJI_TYPE_MAP[action.emoji] ?? 'note'
  selectType(targetType)
  form.value.title = `${action.emoji} ${action.name}`
  // Pre-fill duration from durationMin
  const dur = action.durationMin
  if      (dur <= 15) form.value.duration = '15 phút'
  else if (dur <= 30) form.value.duration = '30 phút'
  else if (dur <= 45) form.value.duration = '45 phút'
  else if (dur <= 60) form.value.duration = '1 giờ'
  else if (dur <= 90) form.value.duration = '1.5 giờ'
  else                form.value.duration = '2 giờ'
  selectedPresetId.value = action.id
}

// ─── Form state ───────────────────────────────────────────────
const selectedTypeId = ref<string | null>(null)
const selectedSubType = ref<string>('')
const form = ref<ActivityForm>({
  title: '',
  date: new Date().toISOString().slice(0, 16),
  duration: '30 phút',
  note: '',
})

const selectedType = computed<ActivityType | null>(
  () => activityTypes.find((t) => t.id === selectedTypeId.value) ?? null,
)

const showDuration = computed(
  () => selectedTypeId.value === 'call' || selectedTypeId.value === 'meeting',
)

const notePlaceholder = computed(() => {
  switch (selectedTypeId.value) {
    case 'call': return 'Nội dung cuộc gọi, phản hồi của khách hàng...'
    case 'email': return 'Chủ đề, nội dung email, trạng thái gửi...'
    case 'message': return 'Nội dung tin nhắn, phản hồi...'
    case 'social': return 'Nội dung trao đổi, kết quả kết nối...'
    case 'meeting': return 'Nội dung buổi gặp, điểm đã thảo luận, next steps...'
    case 'note': return 'Ghi lại thông tin quan trọng về khách hàng, deal...'
    case 'task': return 'Mô tả chi tiết tác vụ cần thực hiện...'
    default: return 'Nhập ghi chú...'
  }
})

const durations = ['15 phút', '30 phút', '45 phút', '1 giờ', '1.5 giờ', '2 giờ', 'Khác']

// ─── Channel quick-links ──────────────────────────────────────

const channels = computed<Channel[]>(() => {
  const rawPhone = props.contactPhone ?? ''
  const phone = rawPhone.replace(/\D/g, '')
  const email = props.contactEmail ?? ''
  const vnPhone = phone.startsWith('0') ? `84${phone.slice(1)}` : phone

  return [
    {
      id: 'email',
      label: 'Email',
      icon: Mail,
      colorClass: 'border-warning-200 bg-warning-50 text-warning-700 hover:bg-warning-100 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400',
      href: email ? `mailto:${email}` : null,
      disabled: !email,
    },
    {
      id: 'zalo',
      label: 'Zalo',
      textIcon: 'Z',
      colorClass: 'border-sky-200 bg-sky-50 text-sky-600 hover:bg-sky-100 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400',
      href: phone ? `https://zalo.me/${phone}` : null,
      disabled: !phone,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageCircle,
      colorClass: 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400',
      href: phone ? `https://wa.me/${vnPhone}` : null,
      disabled: !phone,
    },
    {
      id: 'sms',
      label: 'SMS',
      icon: Smartphone,
      colorClass: 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
      href: rawPhone ? `sms:${rawPhone}` : null,
      disabled: !rawPhone,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: Linkedin,
      colorClass: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400',
      href: 'https://www.linkedin.com/search/results/people/',
      disabled: false,
    },
  ]
})

// ─── Handlers ─────────────────────────────────────────────────

function selectType(typeId: string): void {
  selectedTypeId.value = typeId
  selectedSubType.value = ''
  const type = activityTypes.find((t) => t.id === typeId)
  if (type) form.value.title = type.label
}

watch(selectedSubType, (sub) => {
  if (sub) form.value.title = sub
})

function resetForm(): void {
  selectedTypeId.value = null
  selectedSubType.value = ''
  selectedPresetId.value = null
  form.value = {
    title: '',
    date: new Date().toISOString().slice(0, 16),
    duration: '30 phút',
    note: '',
  }
}

function handleSubmit(): void {
  if (!selectedTypeId.value) {
    toast.warning('Vui lòng chọn loại hoạt động')
    return
  }
  if (!form.value.title.trim()) {
    toast.warning('Vui lòng nhập tiêu đề hoạt động')
    return
  }
  emit('submitted', {
    type: selectedTypeId.value,
    subType: selectedSubType.value,
    form: { ...form.value },
  })
  toast.success('Đã thêm hoạt động thành công')
  isOpen.value = false
}

watch(isOpen, (val) => {
  if (!val) {
    resetForm()
  } else if (props.initialType) {
    selectType(props.initialType)
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
