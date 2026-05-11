<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Cài đặt thông báo</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Chọn loại thông báo và kênh nhận thông báo phù hợp với bạn.
      </p>
    </div>

    <!-- Global master toggle -->
    <div
      class="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/50"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
          <Bell class="h-5 w-5 text-brand-500" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">Bật tất cả thông báo</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Tắt để tạm dừng mọi thông báo</p>
        </div>
      </div>
      <Switch v-model:checked="masterEnabled" />
    </div>

    <!-- Channel cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div
        v-for="channel in channels"
        :key="channel.key"
        class="flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
        :class="
          channel.enabled
            ? 'border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10'
            : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/30'
        "
      >
        <component
          :is="channel.icon"
          class="h-5 w-5 shrink-0"
          :class="channel.enabled ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500'"
        />
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium"
            :class="channel.enabled ? 'text-brand-700 dark:text-brand-300' : 'text-gray-700 dark:text-gray-300'"
          >
            {{ channel.label }}
          </p>
          <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ channel.description }}</p>
        </div>
        <Switch v-model:checked="channel.enabled" :disabled="!masterEnabled" />
      </div>
    </div>

    <!-- Notification groups -->
    <div class="space-y-6">
      <div
        v-for="group in notificationGroups"
        :key="group.key"
        class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
      >
        <!-- Group header -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <component :is="group.icon" class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">{{ group.label }}</span>
          </div>
          <!-- Channel column headers -->
          <div class="hidden sm:flex items-center gap-8 pr-1">
            <span
              v-for="ch in activeChannels"
              :key="ch.key"
              class="w-16 text-center text-xs font-medium text-gray-400 dark:text-gray-500"
            >
              {{ ch.shortLabel }}
            </span>
          </div>
        </div>

        <!-- Rows -->
        <div class="divide-y divide-gray-100 bg-white dark:divide-gray-700/50 dark:bg-gray-800/20">
          <div
            v-for="item in group.items"
            :key="item.key"
            class="flex items-center justify-between px-5 py-3.5"
          >
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.label }}</p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{{ item.description }}</p>
            </div>
            <!-- Channel toggles per row -->
            <div class="flex items-center gap-8 pr-1">
              <div
                v-for="ch in activeChannels"
                :key="ch.key"
                class="flex w-16 justify-center"
              >
                <Switch
                  v-model:checked="item.channels[ch.key]"
                  :disabled="!masterEnabled || !ch.enabled"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiet hours -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700">
      <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div class="flex items-center gap-2">
          <MoonStar class="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Giờ yên tĩnh</span>
        </div>
        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Tạm tắt thông báo trong khoảng thời gian nhất định.</p>
      </div>
      <div class="space-y-4 bg-white px-5 py-5 dark:bg-gray-800/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Bật chế độ yên tĩnh</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Không nhận thông báo ngoài giờ làm việc</p>
          </div>
          <Switch v-model:checked="quietHours.enabled" :disabled="!masterEnabled" />
        </div>

        <template v-if="quietHours.enabled">
          <Separator />
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Từ</Label>
              <Select v-model="quietHours.from">
                <SelectTrigger class="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="t in timeOptions" :key="t.value" :value="t.value">{{ t.label }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Đến</Label>
              <Select v-model="quietHours.to">
                <SelectTrigger class="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="t in timeOptions" :key="t.value" :value="t.value">{{ t.label }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Áp dụng cho ngày</Label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="d in weekDays"
                :key="d.key"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                :class="
                  quietHours.days.includes(d.key)
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                "
                @click="toggleDay(d.key)"
              >
                {{ d.label }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Digest email -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-700">
      <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div class="flex items-center gap-2">
          <Mail class="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Email tóm tắt</span>
        </div>
        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Nhận email tổng hợp hoạt động định kỳ.</p>
      </div>
      <div class="space-y-4 bg-white px-5 py-5 dark:bg-gray-800/20">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Gửi email tóm tắt</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Tổng hợp tin nhắn, deal và nhiệm vụ trong ngày</p>
          </div>
          <Switch v-model:checked="digest.enabled" :disabled="!masterEnabled" />
        </div>
        <template v-if="digest.enabled">
          <Separator />
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-700 dark:text-gray-300">Tần suất:</span>
            <div class="flex gap-2">
              <button
                v-for="opt in digestOptions"
                :key="opt.value"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                :class="
                  digest.frequency === opt.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                "
                @click="digest.frequency = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-6 dark:border-gray-700">
      <Button variant="outline" size="sm" @click="resetSettings">Đặt lại mặc định</Button>
      <Button size="sm" :disabled="isSaving" @click="saveSettings">
        <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
        <Save v-else class="mr-2 h-4 w-4" />
        Lưu thay đổi
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Loader2, Mail, MessageSquare, MoonStar, Save, ShieldAlert, Briefcase, ListChecks, MonitorSmartphone } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'vue-sonner'

// ── Master toggle ─────────────────────────────────────────────────────────────

const masterEnabled = ref(true)
const isSaving = ref(false)

// ── Channels ──────────────────────────────────────────────────────────────────

const channels = ref([
  { key: 'email', label: 'Email', shortLabel: 'Email', description: 'Gửi tới hộp thư của bạn', icon: Mail, enabled: true },
  { key: 'desktop', label: 'Desktop', shortLabel: 'Desktop', description: 'Push notification trình duyệt', icon: MonitorSmartphone, enabled: true },
  { key: 'inapp', label: 'Trong ứng dụng', shortLabel: 'App', description: 'Chuông thông báo trong Salio', icon: Bell, enabled: true },
])

const activeChannels = computed(() => channels.value)

// ── Notification groups ───────────────────────────────────────────────────────

type ChannelMap = Record<string, boolean>

interface NotificationItem {
  key: string
  label: string
  description: string
  channels: ChannelMap
}

interface NotificationGroup {
  key: string
  label: string
  icon: unknown
  items: NotificationItem[]
}

const notificationGroups = ref<NotificationGroup[]>([
  {
    key: 'messages',
    label: 'Tin nhắn',
    icon: MessageSquare,
    items: [
      { key: 'new_message', label: 'Tin nhắn mới', description: 'Khi bạn nhận được tin nhắn trong cuộc trò chuyện', channels: { email: false, desktop: true, inapp: true } },
      { key: 'mention', label: 'Được @nhắc tên', description: 'Khi ai đó nhắc tên bạn trong cuộc trò chuyện', channels: { email: true, desktop: true, inapp: true } },
      { key: 'reply', label: 'Trả lời tin nhắn', description: 'Khi có người trả lời tin nhắn của bạn', channels: { email: false, desktop: true, inapp: true } },
    ],
  },
  {
    key: 'deals',
    label: 'Deals & CRM',
    icon: Briefcase,
    items: [
      { key: 'deal_assigned', label: 'Deal được giao', description: 'Khi một deal mới được giao cho bạn', channels: { email: true, desktop: true, inapp: true } },
      { key: 'deal_updated', label: 'Deal thay đổi trạng thái', description: 'Khi deal bạn theo dõi chuyển giai đoạn', channels: { email: false, desktop: false, inapp: true } },
      { key: 'deal_won', label: 'Deal thành công', description: 'Khi deal được đánh dấu Won', channels: { email: true, desktop: true, inapp: true } },
      { key: 'deal_lost', label: 'Deal thất bại', description: 'Khi deal được đánh dấu Lost', channels: { email: false, desktop: false, inapp: true } },
    ],
  },
  {
    key: 'tasks',
    label: 'Nhiệm vụ',
    icon: ListChecks,
    items: [
      { key: 'task_assigned', label: 'Nhiệm vụ được giao', description: 'Khi bạn được giao một nhiệm vụ mới', channels: { email: true, desktop: true, inapp: true } },
      { key: 'task_due', label: 'Sắp đến hạn', description: 'Nhắc nhở trước 24 giờ khi nhiệm vụ đến hạn', channels: { email: true, desktop: true, inapp: true } },
      { key: 'task_overdue', label: 'Quá hạn', description: 'Khi nhiệm vụ đã qua hạn mà chưa hoàn thành', channels: { email: true, desktop: false, inapp: true } },
    ],
  },
  {
    key: 'system',
    label: 'Hệ thống',
    icon: ShieldAlert,
    items: [
      { key: 'security_alert', label: 'Cảnh báo bảo mật', description: 'Đăng nhập từ thiết bị lạ hoặc thay đổi mật khẩu', channels: { email: true, desktop: true, inapp: true } },
      { key: 'system_update', label: 'Cập nhật hệ thống', description: 'Thông báo về tính năng mới hoặc bảo trì', channels: { email: true, desktop: false, inapp: true } },
      { key: 'billing', label: 'Thanh toán & Hóa đơn', description: 'Xác nhận thanh toán và thông báo hết hạn', channels: { email: true, desktop: false, inapp: true } },
    ],
  },
])

// ── Quiet hours ───────────────────────────────────────────────────────────────

const quietHours = ref({
  enabled: false,
  from: '22:00',
  to: '07:00',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
})

const weekDays = [
  { key: 'Mon', label: 'T2' },
  { key: 'Tue', label: 'T3' },
  { key: 'Wed', label: 'T4' },
  { key: 'Thu', label: 'T5' },
  { key: 'Fri', label: 'T6' },
  { key: 'Sat', label: 'T7' },
  { key: 'Sun', label: 'CN' },
]

function toggleDay(key: string): void {
  const idx = quietHours.value.days.indexOf(key)
  if (idx === -1) quietHours.value.days.push(key)
  else quietHours.value.days.splice(idx, 1)
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  const label = `${String(h).padStart(2, '0')}:${m}`
  return { value: label, label }
})

// ── Digest ────────────────────────────────────────────────────────────────────

const digest = ref({ enabled: true, frequency: 'daily' as 'realtime' | 'daily' | 'weekly' })

const digestOptions: { value: 'realtime' | 'daily' | 'weekly'; label: string }[] = [
  { value: 'realtime', label: 'Ngay lập tức' },
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
]

// ── Save / reset ──────────────────────────────────────────────────────────────

async function saveSettings(): Promise<void> {
  isSaving.value = true
  await new Promise((r) => setTimeout(r, 800))
  isSaving.value = false
  toast.success('Đã lưu cài đặt thông báo')
}

function resetSettings(): void {
  masterEnabled.value = true
  channels.value.forEach((c) => (c.enabled = true))
  quietHours.value = { enabled: false, from: '22:00', to: '07:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
  digest.value = { enabled: true, frequency: 'daily' }
  toast('Đã đặt lại về mặc định')
}
</script>
