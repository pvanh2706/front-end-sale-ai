<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Tạo tài khoản thành viên</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Tạo tài khoản cho nhân viên trong công ty. Thành viên chỉ cần đăng nhập bằng email và mật khẩu được cung cấp.
      </p>
    </div>

    <!-- ── Form tạo tài khoản ─────────────────────────────────── -->
    <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div class="flex items-center gap-2">
          <UserPlus class="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Thêm thành viên mới</span>
        </div>
        <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Điền đầy đủ thông tin bên dưới để tạo tài khoản</p>
      </div>

      <div class="bg-white px-5 py-6 dark:bg-gray-800/20">
        <form @submit.prevent="handleCreate" class="space-y-5" novalidate>
          <!-- Row 1: Tên + Bộ phận + Chức vụ -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Tên nhân viên <span class="text-error-500">*</span>
              </Label>
              <Input
                v-model="form.fullName"
                placeholder="Nguyễn Văn A"
                :class="errors.fullName ? 'border-error-500 focus:ring-error-500/20' : ''"
              />
              <p v-if="errors.fullName" class="text-xs text-error-500">{{ errors.fullName }}</p>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Bộ phận</Label>
              <select
                v-model="form.department"
                class="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="">-- Chọn bộ phận --</option>
                <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Chức vụ</Label>
              <Input v-model="form.jobTitle" placeholder="VD: Sales Executive" />
            </div>
          </div>

          <!-- Row 2: Email -->
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">
              Email đăng nhập <span class="text-error-500">*</span>
            </Label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <Input
                v-model="form.email"
                type="email"
                placeholder="nhanvien@congty.com"
                class="pl-9"
                :class="emailError ? 'border-error-500 focus:ring-error-500/20' : emailOk ? 'border-success-500 focus:ring-success-500/20' : ''"
                @blur="validateEmail"
              />
              <CheckCircle v-if="emailOk" class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success-500" />
              <AlertCircle v-if="emailError" class="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-error-500" />
            </div>
            <!-- Cảnh báo email trùng -->
            <div v-if="emailError === 'duplicate'" class="flex items-center gap-1.5 rounded-lg border border-error-200 bg-error-50 px-3 py-2 dark:border-error-500/30 dark:bg-error-500/10">
              <AlertCircle class="h-4 w-4 shrink-0 text-error-500" />
              <p class="text-xs text-error-600 dark:text-error-400">
                Email <strong>{{ form.email }}</strong> đã được sử dụng bởi một tài khoản khác trong hệ thống.
              </p>
            </div>
            <p v-else-if="emailError === 'invalid'" class="text-xs text-error-500">Email không hợp lệ</p>
            <p v-else-if="emailError === 'required'" class="text-xs text-error-500">Vui lòng nhập email</p>
          </div>

          <!-- Row 3: Mật khẩu -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Mật khẩu <span class="text-error-500">*</span>
                </Label>
                <button
                  type="button"
                  class="flex items-center gap-1 text-xs text-primary-500 hover:underline font-medium"
                  @click="generatePassword"
                >
                  <RefreshCw class="h-3 w-3" />
                  Tạo tự động
                </button>
              </div>
              <div class="relative">
                <Input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Tối thiểu 8 ký tự"
                  class="pr-10"
                  :class="errors.password ? 'border-error-500' : ''"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
              <!-- Strength bar -->
              <div v-if="form.password" class="flex items-center gap-1.5">
                <div
                  v-for="i in 4" :key="i"
                  class="h-1 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength ? strengthBarClass : 'bg-gray-200 dark:bg-gray-700'"
                />
                <span class="text-[10px] font-semibold uppercase min-w-[52px]" :class="strengthTextClass">
                  {{ strengthLabel }}
                </span>
              </div>
              <p v-if="errors.password" class="text-xs text-error-500">{{ errors.password }}</p>
            </div>

            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">
                Xác nhận mật khẩu <span class="text-error-500">*</span>
              </Label>
              <div class="relative">
                <Input
                  v-model="form.confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  placeholder="Nhập lại mật khẩu"
                  class="pr-10"
                  :class="errors.confirmPassword ? 'border-error-500' : ''"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="showConfirm = !showConfirm"
                >
                  <Eye v-if="!showConfirm" class="h-4 w-4" />
                  <EyeOff v-else class="h-4 w-4" />
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="text-xs text-error-500">{{ errors.confirmPassword }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
            <button
              type="button"
              class="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              @click="resetForm"
            >
              Xoá trắng
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
              <UserPlus v-else class="h-4 w-4" />
              {{ isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── Danh sách thành viên ──────────────────────────────── -->
    <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Thành viên ({{ members.length }})
          </span>
        </div>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm..."
            class="h-8 w-48 rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-xs focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800/20">
        <table class="w-full">
          <thead class="border-b border-gray-100 dark:border-gray-700">
            <tr class="text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
              <th class="px-5 py-3">Nhân viên</th>
              <th class="px-4 py-3">Bộ phận / Chức vụ</th>
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Trạng thái</th>
              <th class="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-if="filteredMembers.length === 0">
              <td colspan="5" class="py-12 text-center">
                <Users class="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p class="text-sm text-gray-400">Chưa có thành viên nào</p>
              </td>
            </tr>
            <tr
              v-for="member in filteredMembers"
              :key="member.id"
              class="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/40"
            >
              <td class="px-5 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-500/20 dark:text-primary-400">
                    {{ initials(member.fullName) }}
                  </div>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ member.fullName }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-gray-700 dark:text-gray-300">{{ member.department || '—' }}</p>
                <p class="text-xs text-gray-400">{{ member.jobTitle || '—' }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ member.email }}</span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="member.active
                    ? 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="member.active ? 'bg-success-500' : 'bg-gray-400'" />
                  {{ member.active ? 'Hoạt động' : 'Chưa đăng nhập' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    class="rounded-lg p-1.5 text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors"
                    title="Sao chép thông tin đăng nhập"
                    @click="copyCredentials(member)"
                  >
                    <Copy class="h-3.5 w-3.5" />
                  </button>
                  <button
                    class="rounded-lg p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10 transition-colors"
                    title="Xoá tài khoản"
                    @click="deleteMember(member.id)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue-sonner'
import {
  AlertCircle, CheckCircle, Copy, Eye, EyeOff,
  Loader2, Mail, RefreshCw, Search, Trash2,
  UserPlus, Users,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Member {
  id: string
  fullName: string
  department: string
  jobTitle: string
  email: string
  password: string
  active: boolean
  createdAt: string
}

const departments = [
  'Sales', 'Marketing', 'Kỹ thuật', 'Kế toán / Tài chính',
  'Nhân sự', 'Vận hành', 'Chăm sóc khách hàng', 'Ban giám đốc',
]

const members = ref<Member[]>([
  {
    id: '1',
    fullName: 'Nguyễn Thị Lan',
    department: 'Sales',
    jobTitle: 'Sales Executive',
    email: 'lan.nguyen@salio.ai',
    password: 'Salio@2024',
    active: true,
    createdAt: '2024-11-01',
  },
  {
    id: '2',
    fullName: 'Trần Minh Tuấn',
    department: 'Marketing',
    jobTitle: 'Marketing Specialist',
    email: 'tuan.tran@salio.ai',
    password: 'Salio@2024',
    active: false,
    createdAt: '2024-11-15',
  },
])

const form = ref({
  fullName: '',
  department: '',
  jobTitle: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const errors = ref({ fullName: '', password: '', confirmPassword: '' })
const emailError = ref<'' | 'required' | 'invalid' | 'duplicate'>('')
const emailOk = ref(false)
const showPassword = ref(false)
const showConfirm = ref(false)
const isSubmitting = ref(false)
const searchQuery = ref('')

const filteredMembers = computed(() =>
  members.value.filter((m) => {
    const q = searchQuery.value.toLowerCase()
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.department.toLowerCase().includes(q)
    )
  }),
)

// Password strength
const passwordStrength = computed(() => {
  const pw = form.value.password
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
})

const strengthBarClass = computed(() => {
  const m: Record<number, string> = { 1: 'bg-error-500', 2: 'bg-warning-500', 3: 'bg-success-500', 4: 'bg-success-500' }
  return m[passwordStrength.value] ?? 'bg-gray-200'
})
const strengthTextClass = computed(() => {
  const m: Record<number, string> = { 1: 'text-error-500', 2: 'text-warning-500', 3: 'text-success-500', 4: 'text-success-500' }
  return m[passwordStrength.value] ?? 'text-gray-400'
})
const strengthLabel = computed(() => {
  const m: Record<number, string> = { 1: 'Yếu', 2: 'Trung bình', 3: 'Mạnh', 4: 'Rất mạnh' }
  return m[passwordStrength.value] ?? ''
})

function validateEmail() {
  const email = form.value.email.trim()
  emailOk.value = false
  if (!email) { emailError.value = 'required'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { emailError.value = 'invalid'; return }
  // Kiểm tra trùng với danh sách thành viên + tài khoản admin
  const existing = ['admin@salio.ai', ...members.value.map((m) => m.email)]
  if (existing.includes(email.toLowerCase())) { emailError.value = 'duplicate'; return }
  emailError.value = ''
  emailOk.value = true
}

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!'
  const pw = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  form.value.password = pw
  form.value.confirmPassword = pw
  showPassword.value = true
  showConfirm.value = true
}

function validate(): boolean {
  let ok = true
  errors.value = { fullName: '', password: '', confirmPassword: '' }

  if (!form.value.fullName.trim()) {
    errors.value.fullName = 'Vui lòng nhập tên nhân viên'
    ok = false
  }
  validateEmail()
  if (emailError.value) ok = false

  if (!form.value.password) {
    errors.value.password = 'Vui lòng nhập mật khẩu'
    ok = false
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Mật khẩu tối thiểu 8 ký tự'
    ok = false
  }
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    ok = false
  }
  return ok
}

async function handleCreate() {
  if (!validate()) return
  isSubmitting.value = true
  await new Promise((r) => setTimeout(r, 700))

  const newMember: Member = {
    id: Date.now().toString(),
    fullName: form.value.fullName.trim(),
    department: form.value.department,
    jobTitle: form.value.jobTitle.trim(),
    email: form.value.email.trim().toLowerCase(),
    password: form.value.password,
    active: false,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  members.value.unshift(newMember)
  toast.success(`Đã tạo tài khoản cho ${newMember.fullName}`, {
    description: `Email: ${newMember.email}`,
  })
  resetForm()
  isSubmitting.value = false
}

function resetForm() {
  form.value = { fullName: '', department: '', jobTitle: '', email: '', password: '', confirmPassword: '' }
  errors.value = { fullName: '', password: '', confirmPassword: '' }
  emailError.value = ''
  emailOk.value = false
  showPassword.value = false
  showConfirm.value = false
}

function initials(name: string) {
  return name.trim().split(' ').filter(Boolean).slice(-2).map((w) => w[0].toUpperCase()).join('')
}

async function copyCredentials(member: Member) {
  const text = `Email: ${member.email}\nMật khẩu: ${member.password}`
  await navigator.clipboard.writeText(text)
  toast.success('Đã sao chép thông tin đăng nhập')
}

function deleteMember(id: string) {
  members.value = members.value.filter((m) => m.id !== id)
  toast.success('Đã xoá tài khoản thành viên')
}
</script>
