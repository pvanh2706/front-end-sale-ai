<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Hồ sơ cá nhân</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Cập nhật thông tin hiển thị, avatar và múi giờ.
      </p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="space-y-6">
      <div class="flex items-center gap-5">
        <div class="h-20 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        <div class="space-y-2">
          <div class="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div class="h-3 w-36 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
      <div v-for="n in 4" :key="n" class="h-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
    </div>

    <template v-else>
      <!-- Avatar section -->
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div class="relative shrink-0">
          <div
            class="relative h-20 w-20 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
          >
            <img
              v-if="profile.avatarUrl"
              :src="profile.avatarUrl"
              alt="Avatar"
              class="h-full w-full object-cover"
            />
            <span
              v-else
              class="flex h-full w-full items-center justify-center text-2xl font-bold text-gray-400 dark:text-gray-500"
            >
              {{ avatarInitials }}
            </span>
            <!-- Upload overlay -->
            <label
              class="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
              :class="isUploading ? 'opacity-100' : ''"
            >
              <Loader2 v-if="isUploading" class="h-6 w-6 animate-spin text-white" />
              <Camera v-else class="h-6 w-6 text-white" />
              <input
                v-if="!isUploading"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handleAvatarChange"
              />
            </label>
          </div>
        </div>

        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">Ảnh đại diện</p>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            JPG, PNG hoặc GIF. Tối đa 5 MB.
          </p>
          <div class="mt-3 flex gap-2">
            <label
              class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Upload class="h-3.5 w-3.5" />
              Tải lên ảnh mới
              <input type="file" accept="image/*" class="sr-only" @change="handleAvatarChange" />
            </label>
            <Button
              v-if="profile.avatarUrl"
              variant="ghost"
              size="sm"
              class="gap-1.5 text-xs text-error-500 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10"
              :disabled="isDeletingAvatar"
              @click="handleDeleteAvatar"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Xóa ảnh
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <!-- Profile form -->
      <Form @submit="handleSave">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <!-- Full name -->
          <FormField v-slot="{ componentField }" name="fullName">
            <FormItem>
              <FormLabel>Họ và tên <span class="text-error-500">*</span></FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Nguyễn Văn A" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Email (read-only) -->
          <div class="space-y-1.5">
            <Label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
              <span class="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                Không thể sửa
              </span>
            </Label>
            <Input :value="profile.email" disabled class="cursor-not-allowed opacity-60" />
          </div>

          <!-- Phone -->
          <FormField v-slot="{ componentField }" name="phone">
            <FormItem>
              <FormLabel>Số điện thoại</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="+84 901 234 567" type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Job title -->
          <FormField v-slot="{ componentField }" name="jobTitle">
            <FormItem>
              <FormLabel>Chức danh</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Sales Manager" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Department -->
          <FormField v-slot="{ componentField }" name="department">
            <FormItem>
              <FormLabel>Phòng ban</FormLabel>
              <FormControl>
                <Input v-bind="componentField" placeholder="Kinh doanh" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Timezone -->
          <FormField v-slot="{ componentField }" name="timezone">
            <FormItem>
              <FormLabel>Múi giờ</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Chọn múi giờ" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="tz in timezones" :key="tz.value" :value="tz.value">
                    {{ tz.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- Bio -->
        <FormField v-slot="{ componentField }" name="bio" class="mt-5">
          <FormItem class="mt-5">
            <FormLabel>Giới thiệu ngắn</FormLabel>
            <FormControl>
              <Textarea
                v-bind="componentField"
                placeholder="Vài dòng về bản thân bạn..."
                class="min-h-[90px] resize-none"
              />
            </FormControl>
            <p class="mt-1 text-right text-xs text-gray-400">
              {{ (form?.values?.bio ?? profile.bio ?? '').length }}/300
            </p>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Last updated -->
        <p v-if="profile.updatedAt" class="mt-1 text-xs text-gray-400">
          Cập nhật lần cuối: {{ formatDate(profile.updatedAt) }}
        </p>

        <Separator class="my-2" />

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            class="text-gray-500"
            :disabled="isSaving"
            @click="resetForm"
          >
            Đặt lại
          </Button>
          <Button
            type="submit"
            class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600"
            :disabled="isSaving"
          >
            <Loader2 v-if="isSaving" class="h-4 w-4 animate-spin" />
            <Save v-else class="h-4 w-4" />
            {{ isSaving ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </Button>
        </div>
      </Form>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Camera, Loader2, Save, Trash2, Upload } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  deleteAvatar,
  fetchProfile,
  updateProfile,
  uploadAvatar,
  type UserProfile,
} from '@/services/profile'
import { toast } from 'vue-sonner'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = toTypedSchema(
  z.object({
    fullName: z.string().min(1, 'Họ tên không được để trống').max(100),
    phone: z.string().max(20).optional().or(z.literal('')),
    jobTitle: z.string().max(100).optional().or(z.literal('')),
    department: z.string().max(100).optional().or(z.literal('')),
    bio: z.string().max(300, 'Giới thiệu tối đa 300 ký tự').optional().or(z.literal('')),
    timezone: z.string().optional().or(z.literal('')),
  }),
)

// ── State ─────────────────────────────────────────────────────────────────────

const isLoading = ref(true)
const isSaving = ref(false)
const isUploading = ref(false)
const isDeletingAvatar = ref(false)

const profile = ref<UserProfile>({
  userId: '',
  fullName: '',
  email: '',
  phone: '',
  jobTitle: '',
  department: '',
  bio: '',
  timezone: 'Asia/Ho_Chi_Minh',
  language: 'vi',
  avatarUrl: '',
  updatedAt: '',
})

// ── Form ──────────────────────────────────────────────────────────────────────

const { handleSubmit, setValues, values: formValues } = useForm({ validationSchema: schema })

// expose for bio char counter
const form = computed(() => ({ values: formValues }))

// ── Computed ──────────────────────────────────────────────────────────────────

const avatarInitials = computed(() => {
  const name = profile.value.fullName || '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const timezones = [
  { value: 'Asia/Ho_Chi_Minh', label: '(UTC+7) Hồ Chí Minh / Hà Nội' },
  { value: 'Asia/Bangkok', label: '(UTC+7) Bangkok' },
  { value: 'Asia/Singapore', label: '(UTC+8) Singapore' },
  { value: 'Asia/Tokyo', label: '(UTC+9) Tokyo' },
  { value: 'Asia/Seoul', label: '(UTC+9) Seoul' },
  { value: 'Europe/London', label: '(UTC+0) London' },
  { value: 'Europe/Paris', label: '(UTC+1) Paris' },
  { value: 'America/New_York', label: '(UTC-5) New York' },
  { value: 'America/Los_Angeles', label: '(UTC-8) Los Angeles' },
  { value: 'UTC', label: '(UTC+0) UTC' },
]

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  isLoading.value = true
  const result = await fetchProfile()
  if (result.isSuccess && result.data) {
    profile.value = result.data
    syncFormValues(result.data)
  } else {
    toast.error('Không thể tải thông tin hồ sơ')
  }
  isLoading.value = false
})

function syncFormValues(p: UserProfile): void {
  setValues({
    fullName: p.fullName,
    phone: p.phone,
    jobTitle: p.jobTitle,
    department: p.department,
    bio: p.bio,
    timezone: p.timezone,
  })
}

// ── Actions ───────────────────────────────────────────────────────────────────

const handleSave = handleSubmit(async (values) => {
  isSaving.value = true
  const result = await updateProfile({
    fullName: values.fullName,
    phone: values.phone ?? '',
    jobTitle: values.jobTitle ?? '',
    department: values.department ?? '',
    bio: values.bio ?? '',
    timezone: values.timezone ?? 'Asia/Ho_Chi_Minh',
  })
  isSaving.value = false
  if (result.isSuccess && result.data) {
    profile.value = result.data
    toast.success('Đã lưu thông tin hồ sơ')
  } else {
    toast.error(result.error ?? 'Lưu thất bại')
  }
})

function resetForm(): void {
  syncFormValues(profile.value)
}

async function handleAvatarChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Ảnh quá lớn — tối đa 5 MB')
    return
  }
  isUploading.value = true
  try {
    const result = await uploadAvatar(file)
    if (result.success) {
      profile.value.avatarUrl = result.data.avatarUrl
      toast.success('Đã cập nhật ảnh đại diện')
    } else {
      toast.error('Tải ảnh thất bại')
    }
  } catch {
    toast.error('Tải ảnh thất bại')
  } finally {
    isUploading.value = false
    input.value = ''
  }
}

async function handleDeleteAvatar(): Promise<void> {
  isDeletingAvatar.value = true
  const result = await deleteAvatar()
  isDeletingAvatar.value = false
  if (result.isSuccess) {
    profile.value.avatarUrl = ''
    toast.success('Đã xóa ảnh đại diện')
  } else {
    toast.error('Xóa ảnh thất bại')
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
