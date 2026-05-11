<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Bảo mật</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Quản lý mật khẩu, phiên đăng nhập và xác thực hai lớp.
      </p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="space-y-6">
      <div v-for="n in 3" :key="n" class="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
    </div>

    <template v-else>
      <!-- ── Đổi mật khẩu ──────────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <KeyRound class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Đổi mật khẩu</span>
          </div>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Nên dùng mật khẩu mạnh, ít nhất 8 ký tự</p>
        </div>
        <div class="space-y-4 bg-white px-5 py-5 dark:bg-gray-800/20">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <!-- Current password -->
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Mật khẩu hiện tại</Label>
              <div class="relative">
                <Input
                  v-model="pwForm.currentPassword"
                  :type="showPw.current ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="h-9 pr-9 text-sm"
                />
                <button
                  type="button"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showPw.current = !showPw.current"
                >
                  <EyeOff v-if="showPw.current" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
            <!-- New password -->
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Mật khẩu mới</Label>
              <div class="relative">
                <Input
                  v-model="pwForm.newPassword"
                  :type="showPw.new ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="h-9 pr-9 text-sm"
                />
                <button
                  type="button"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showPw.new = !showPw.new"
                >
                  <EyeOff v-if="showPw.new" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
              <!-- Strength bar -->
              <div class="flex gap-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="i <= pwStrength.score ? pwStrength.color : 'bg-gray-200 dark:bg-gray-700'"
                />
              </div>
              <p v-if="pwForm.newPassword" class="text-xs" :class="pwStrength.textColor">
                {{ pwStrength.label }}
              </p>
            </div>
            <!-- Confirm password -->
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Xác nhận mật khẩu mới</Label>
              <div class="relative">
                <Input
                  v-model="pwForm.confirmPassword"
                  :type="showPw.confirm ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="h-9 pr-9 text-sm"
                  :class="pwMismatch ? 'border-error-500 focus-visible:ring-error-500/30' : ''"
                />
                <button
                  type="button"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showPw.confirm = !showPw.confirm"
                >
                  <EyeOff v-if="showPw.confirm" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
              <p v-if="pwMismatch" class="text-xs text-error-500">Mật khẩu không khớp</p>
            </div>
          </div>
          <div class="flex justify-end">
            <Button
              size="sm"
              :disabled="isSavingPw || !pwForm.currentPassword || !pwForm.newPassword || pwMismatch || pwForm.newPassword.length < 8"
              @click="handleChangePassword"
            >
              <Loader2 v-if="isSavingPw" class="mr-2 h-4 w-4 animate-spin" />
              <KeyRound v-else class="mr-2 h-4 w-4" />
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </div>

      <!-- ── Xác thực hai lớp ──────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Xác thực hai lớp (2FA)</span>
            </div>
            <Badge
              v-if="security.twoFactorEnabled"
              class="bg-success-50 text-success-500 border-success-200 dark:bg-success-500/10 dark:border-success-500/30"
            >
              <ShieldCheck class="mr-1 h-3 w-3" /> Đã bật
            </Badge>
            <Badge v-else variant="outline" class="text-gray-400">Chưa bật</Badge>
          </div>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Thêm lớp bảo vệ khi đăng nhập</p>
        </div>
        <div class="space-y-4 bg-white px-5 py-5 dark:bg-gray-800/20">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Bật xác thực hai lớp</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Yêu cầu mã xác thực mỗi khi đăng nhập</p>
            </div>
            <Switch v-model:checked="security.twoFactorEnabled" @update:checked="saveSecurity" />
          </div>
          <template v-if="security.twoFactorEnabled">
            <Separator />
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Phương thức xác thực</Label>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <button
                  v-for="method in twoFactorMethods"
                  :key="method.value"
                  type="button"
                  class="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
                  :class="
                    security.twoFactorMethod === method.value
                      ? 'border-brand-300 bg-brand-50 dark:border-brand-500/40 dark:bg-brand-500/10'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-transparent dark:hover:border-gray-600'
                  "
                  @click="security.twoFactorMethod = method.value; saveSecurity()"
                >
                  <component
                    :is="method.icon"
                    class="h-5 w-5 shrink-0"
                    :class="security.twoFactorMethod === method.value ? 'text-brand-500' : 'text-gray-400'"
                  />
                  <div>
                    <p
                      class="text-sm font-medium"
                      :class="security.twoFactorMethod === method.value ? 'text-brand-700 dark:text-brand-300' : 'text-gray-700 dark:text-gray-300'"
                    >
                      {{ method.label }}
                    </p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">{{ method.description }}</p>
                  </div>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- ── Tùy chọn bảo mật khác ─────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <Settings2 class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Tùy chọn bảo mật</span>
          </div>
        </div>
        <div class="divide-y divide-gray-100 bg-white dark:divide-gray-700/50 dark:bg-gray-800/20">
          <!-- Login notifications -->
          <div class="flex items-center justify-between px-5 py-4">
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Thông báo đăng nhập</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Gửi email khi có đăng nhập từ thiết bị lạ</p>
            </div>
            <Switch v-model:checked="security.loginNotifications" @update:checked="saveSecurity" />
          </div>
          <!-- Session timeout -->
          <div class="flex items-center justify-between px-5 py-4">
            <div>
              <p class="text-sm font-medium text-gray-800 dark:text-gray-200">Tự động đăng xuất</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Đăng xuất sau thời gian không hoạt động</p>
            </div>
            <Select v-model="sessionTimeoutStr" @update:model-value="onTimeoutChange">
              <SelectTrigger class="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="opt in timeoutOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <!-- ── Phiên đăng nhập ───────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div>
            <div class="flex items-center gap-2">
              <Monitor class="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Phiên đăng nhập</span>
            </div>
            <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {{ security.sessions.length }} thiết bị đang đăng nhập
            </p>
          </div>
          <Button
            v-if="security.sessions.length > 1"
            variant="outline"
            size="sm"
            class="text-error-500 hover:bg-error-50 hover:border-error-300 dark:hover:bg-error-500/10"
            :disabled="isRevokingAll"
            @click="handleRevokeAll"
          >
            <Loader2 v-if="isRevokingAll" class="mr-2 h-3.5 w-3.5 animate-spin" />
            <LogOut v-else class="mr-2 h-3.5 w-3.5" />
            Đăng xuất tất cả
          </Button>
        </div>
        <div class="divide-y divide-gray-100 bg-white dark:divide-gray-700/50 dark:bg-gray-800/20">
          <div
            v-for="session in security.sessions"
            :key="session.id"
            class="flex items-center gap-4 px-5 py-4"
          >
            <!-- Device icon -->
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
            >
              <Smartphone v-if="session.os.toLowerCase().includes('ios') || session.os.toLowerCase().includes('android')" class="h-5 w-5 text-gray-500" />
              <Tablet v-else-if="session.os.toLowerCase().includes('ipad')" class="h-5 w-5 text-gray-500" />
              <Monitor v-else class="h-5 w-5 text-gray-500" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ session.device }}</p>
                <Badge
                  v-if="session.isCurrent"
                  class="bg-success-50 text-success-600 border-success-200 text-[10px] dark:bg-success-500/10 dark:border-success-500/30"
                >
                  Hiện tại
                </Badge>
              </div>
              <p class="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                {{ session.ip }} · {{ session.location }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                Hoạt động: {{ formatRelative(session.lastActive) }}
              </p>
            </div>
            <Button
              v-if="!session.isCurrent"
              variant="ghost"
              size="sm"
              class="shrink-0 text-error-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
              :disabled="revokingId === session.id"
              @click="handleRevokeSession(session.id)"
            >
              <Loader2 v-if="revokingId === session.id" class="h-4 w-4 animate-spin" />
              <X v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <p v-if="security.updatedAt" class="text-right text-xs text-gray-400 dark:text-gray-500">
        Cập nhật lần cuối: {{ formatDate(security.updatedAt) }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  MessageSquare,
  Monitor,
  Settings2,
  ShieldCheck,
  Smartphone,
  Tablet,
  X,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  changePassword,
  fetchSecurity,
  revokeAllSessions,
  revokeSession,
  updateSecurity,
  type SecuritySettings,
} from '@/services/security'
import { toast } from 'vue-sonner'

// ── State ─────────────────────────────────────────────────────────────────────

const isLoading = ref(true)
const isSavingPw = ref(false)
const isRevokingAll = ref(false)
const revokingId = ref<string | null>(null)

const security = ref<SecuritySettings>({
  userId: '',
  twoFactorEnabled: false,
  twoFactorMethod: 'app',
  loginNotifications: true,
  sessionTimeout: 30,
  updatedAt: '',
  sessions: [],
})

// ── Password form ─────────────────────────────────────────────────────────────

const pwForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })
const showPw = reactive({ current: false, new: false, confirm: false })

const pwMismatch = computed(
  () => !!pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword,
)

const pwStrength = computed(() => {
  const pw = pwForm.newPassword
  if (!pw) return { score: 0, color: '', textColor: '', label: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++
  const map = [
    { score: 1, color: 'bg-error-500', textColor: 'text-error-500', label: 'Rất yếu' },
    { score: 2, color: 'bg-warning-500', textColor: 'text-warning-500', label: 'Yếu' },
    { score: 3, color: 'bg-brand-400', textColor: 'text-brand-500', label: 'Trung bình' },
    { score: 4, color: 'bg-success-500', textColor: 'text-success-500', label: 'Mạnh' },
  ]
  const level = map[score - 1] ?? map[0]
  return { ...level, score }
})

// ── 2FA methods ───────────────────────────────────────────────────────────────

const twoFactorMethods = [
  { value: 'app', icon: ShieldCheck, label: 'Ứng dụng Authenticator', description: 'Google / Authy / Microsoft' },
  { value: 'sms', icon: MessageSquare, label: 'SMS', description: 'Mã OTP gửi qua tin nhắn' },
  { value: 'email', icon: Mail, label: 'Email', description: 'Mã OTP gửi qua email' },
]

// ── Session timeout ───────────────────────────────────────────────────────────

const timeoutOptions = [
  { value: '0', label: 'Không bao giờ' },
  { value: '15', label: '15 phút' },
  { value: '30', label: '30 phút' },
  { value: '60', label: '1 giờ' },
  { value: '240', label: '4 giờ' },
  { value: '480', label: '8 giờ' },
]

const sessionTimeoutStr = ref('30')

function onTimeoutChange(val: string): void {
  security.value.sessionTimeout = Number(val)
  saveSecurity()
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  isLoading.value = true
  const result = await fetchSecurity()
  if (result.isSuccess && result.data) {
    security.value = result.data
    sessionTimeoutStr.value = String(result.data.sessionTimeout)
  } else {
    toast.error('Không thể tải cài đặt bảo mật')
  }
  isLoading.value = false
})

// ── Actions ───────────────────────────────────────────────────────────────────

async function saveSecurity(): Promise<void> {
  const result = await updateSecurity({
    twoFactorEnabled: security.value.twoFactorEnabled,
    twoFactorMethod: security.value.twoFactorMethod,
    loginNotifications: security.value.loginNotifications,
    sessionTimeout: security.value.sessionTimeout,
  })
  if (result.isSuccess && result.data) {
    security.value.updatedAt = result.data.updatedAt
  }
}

async function handleChangePassword(): Promise<void> {
  if (pwForm.newPassword.length < 8) return
  if (pwMismatch.value) return
  isSavingPw.value = true
  const result = await changePassword({
    currentPassword: pwForm.currentPassword,
    newPassword: pwForm.newPassword,
  })
  isSavingPw.value = false
  if (result.isSuccess) {
    toast.success('Đã đổi mật khẩu thành công')
    pwForm.currentPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
  } else {
    toast.error(result.error ?? 'Đổi mật khẩu thất bại')
  }
}

async function handleRevokeSession(sessionId: string): Promise<void> {
  revokingId.value = sessionId
  const result = await revokeSession(sessionId)
  revokingId.value = null
  if (result.isSuccess) {
    security.value.sessions = security.value.sessions.filter((s) => s.id !== sessionId)
    toast.success('Đã đăng xuất thiết bị')
  } else {
    toast.error(result.error ?? 'Thao tác thất bại')
  }
}

async function handleRevokeAll(): Promise<void> {
  isRevokingAll.value = true
  const result = await revokeAllSessions()
  isRevokingAll.value = false
  if (result.isSuccess) {
    security.value.sessions = security.value.sessions.filter((s) => s.isCurrent)
    toast.success('Đã đăng xuất tất cả thiết bị khác')
  } else {
    toast.error(result.error ?? 'Thao tác thất bại')
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}
</script>
