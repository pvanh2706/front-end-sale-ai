<template>
  <div class="min-h-screen flex flex-col md:flex-row">

    <!-- Left Column: Branding (hidden on mobile, visible from md) -->
    <section
      class="hidden md:flex md:w-2/5 lg:w-[60%] flex-col justify-between items-start relative overflow-hidden p-8 lg:p-12"
      :style="pastelMeshStyle"
      aria-hidden="true"
    >
      <div class="z-10 w-full flex flex-col flex-1 justify-center">
        <!-- App logo + headline -->
        <div class="mb-10 lg:mb-12">
          <h2 class="flex items-center gap-3 text-2xl lg:text-[32px] font-bold tracking-tight text-gray-900 mb-3">
            <div class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
            Salio
          </h2>
          <p class="text-gray-500 text-base lg:text-lg max-w-md leading-relaxed">
            Trợ lý thông minh cho đội ngũ Sales — Tối ưu hóa quy trình bán hàng với AI
          </p>
        </div>

        <!-- Dashboard illustration -->
        <div class="relative w-full aspect-video rounded-xl overflow-hidden shadow-theme-xl border border-white/40">
          <div class="absolute inset-0 flex flex-col p-4 gap-3 bg-gradient-to-br from-primary-50 to-white">
            <!-- Mock top bar -->
            <div class="flex items-center gap-2">
              <div class="h-2.5 w-20 bg-primary-200 rounded-full"></div>
              <div class="h-2 w-14 bg-gray-200 rounded-full ml-auto"></div>
              <div class="h-2 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <!-- Mock chart area -->
            <div class="flex flex-1 gap-3 min-h-0">
              <div class="w-1/4 bg-white/70 rounded-lg p-2 flex flex-col gap-1.5">
                <div class="h-2 w-full bg-gray-100 rounded"></div>
                <div class="h-2 w-3/4 bg-gray-100 rounded"></div>
                <div class="h-2 w-1/2 bg-gray-100 rounded"></div>
                <div class="h-2 w-3/4 bg-primary-100 rounded mt-1"></div>
                <div class="h-2 w-1/2 bg-primary-100 rounded"></div>
              </div>
              <div class="flex-1 bg-white/70 rounded-lg flex items-end px-3 py-3 gap-1.5">
                <div
                  v-for="(h, i) in chartBars"
                  :key="i"
                  class="flex-1 rounded-t-sm"
                  :class="i % 2 === 0 ? 'bg-primary-300' : 'bg-primary-500'"
                  :style="{ height: h + '%' }"
                ></div>
              </div>
            </div>
            <!-- Mock stat cards -->
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-white/80 rounded-lg p-2">
                <div class="h-2 w-10 bg-gray-200 rounded mb-1.5"></div>
                <div class="h-3.5 w-8 bg-primary-500 rounded"></div>
              </div>
              <div class="bg-white/80 rounded-lg p-2">
                <div class="h-2 w-12 bg-gray-200 rounded mb-1.5"></div>
                <div class="h-3.5 w-10 bg-success-500 rounded"></div>
              </div>
              <div class="bg-white/80 rounded-lg p-2">
                <div class="h-2 w-8 bg-gray-200 rounded mb-1.5"></div>
                <div class="h-3.5 w-12 bg-warning-500 rounded"></div>
              </div>
            </div>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <!-- Trusted by footer -->
      <div class="z-10 mt-8">
        <p class="text-xs font-medium uppercase tracking-widest text-gray-500 opacity-60">
          Trusted by teams at
        </p>
      </div>

      <!-- Decorative blobs -->
      <div class="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full blur-3xl opacity-40 bg-primary-100 pointer-events-none"></div>
      <div class="absolute bottom-[-5%] left-[10%] w-48 h-48 rounded-full blur-3xl opacity-50 bg-primary-50 pointer-events-none"></div>
    </section>

    <!-- Right Column: Registration Form -->
    <section class="flex-1 flex flex-col items-center justify-center px-6 py-10 md:px-10 md:py-12 lg:py-16 bg-white dark:bg-gray-900">
      <div class="w-full max-w-md space-y-7">

        <!-- Mobile only: logo + app name -->
        <div class="md:hidden flex flex-col items-center gap-3 mb-2">
          <div class="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Salio</h1>
        </div>

        <!-- Page title -->
        <header class="text-center md:text-left">
          <h1 class="text-3xl lg:text-[32px] font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
            Tạo tài khoản
          </h1>
          <p class="text-gray-500 text-base dark:text-gray-400">
            Bắt đầu trải nghiệm Salio miễn phí
          </p>
        </header>

        <!-- Registration form -->
        <form
          @submit.prevent="onSubmit"
          class="space-y-5"
          aria-label="Biểu mẫu tạo tài khoản"
          novalidate
        >
          <!-- Full name -->
          <FormField name="fullName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Họ và tên
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <User
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    class="pl-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Nguyễn Văn A"
                    type="text"
                    autocomplete="name"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Company email -->
          <FormField name="email" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Email công ty
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <Mail
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    class="pl-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="name@company.com"
                    type="email"
                    autocomplete="email"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Company name -->
          <FormField name="companyName" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Tên doanh nghiệp/tổ chức
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <Building2
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    class="pl-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Công ty TNHH AI Solutions"
                    type="text"
                    autocomplete="organization"
                    aria-required="true"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Password -->
          <FormField name="password" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Mật khẩu
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <Lock
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    :type="showPassword ? 'text' : 'password'"
                    class="pl-12 pr-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Tối thiểu 8 ký tự"
                    autocomplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="!showPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </FormControl>
              <!-- Password strength indicator -->
              <div
                v-if="passwordStrength > 0"
                class="flex items-center gap-1.5 mt-1.5 px-1"
                role="status"
                :aria-label="`Độ mạnh mật khẩu: ${passwordStrengthLabel}`"
              >
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors duration-300"
                  :class="i <= passwordStrength ? strengthColorClass : 'bg-gray-200 dark:bg-gray-700'"
                ></div>
                <span class="text-[10px] font-semibold uppercase ml-1.5 min-w-[56px]" :class="strengthTextColorClass">
                  {{ passwordStrengthLabel }}
                </span>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Confirm password -->
          <FormField name="confirmPassword" v-slot="{ componentField }">
            <FormItem>
              <FormLabel class="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                Xác nhận mật khẩu
              </FormLabel>
              <FormControl>
                <div class="relative group">
                  <ShieldCheck
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-primary-500 transition-colors pointer-events-none"
                    aria-hidden="true"
                  />
                  <Input
                    v-bind="componentField"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="pl-12 pr-12 h-12 rounded-xl border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500/20 transition-all"
                    placeholder="Nhập lại mật khẩu"
                    autocomplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:hover:text-gray-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    :aria-label="showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Terms & conditions -->
          <div class="flex items-start gap-3 pt-1">
            <Checkbox
              id="terms"
              v-model:checked="agreedToTerms"
              class="mt-0.5 shrink-0"
              aria-required="true"
            />
            <label
              for="terms"
              class="text-sm text-gray-500 cursor-pointer select-none leading-relaxed dark:text-gray-400"
            >
              Tôi đồng ý với
              <a href="#" class="text-primary-500 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded">Điều khoản dịch vụ</a>
              và
              <a href="#" class="text-primary-500 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded">Chính sách bảo mật</a>
            </label>
          </div>

          <!-- Error message -->
          <p v-if="registerError" role="alert" class="text-sm text-error-500 text-center">
            {{ registerError }}
          </p>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading || !agreedToTerms"
            class="w-full h-12 bg-primary-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-theme-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            :aria-busy="isLoading"
          >
            <span v-if="isLoading">Đang tạo tài khoản...</span>
            <template v-else>
              <span>Tạo tài khoản</span>
              <ArrowRight class="w-4 h-4" aria-hidden="true" />
            </template>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative flex items-center">
          <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span class="flex-shrink mx-4 px-2 text-xs font-medium text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">
            Hoặc đăng ký với
          </span>
          <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <!-- SSO buttons -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Đăng ký với Google"
          >
            <img src="https://www.google.com/favicon.ico" alt="" aria-hidden="true" class="w-5 h-5 object-contain" />
            Google
          </button>
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Đăng ký với Microsoft"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M1 1h10v10H1V1z" fill="#F25022" />
              <path d="M12 1h10v10H12V1z" fill="#7FBA00" />
              <path d="M1 12h10v10H1V12z" fill="#00A4EF" />
              <path d="M12 12h10v10H12V12z" fill="#FFB900" />
            </svg>
            Microsoft
          </button>
        </div>

        <!-- Login link -->
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          Đã có tài khoản?
          <RouterLink
            to="/login"
            class="text-primary-500 font-bold ml-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            Đăng nhập
          </RouterLink>
        </p>
      </div>
    </section>
  </div>

  <!-- Email Conflict Dialog -->
  <EmailConflictDialog
    v-model="showEmailConflict"
    :email="conflictEmail"
    @go-to-login="handleGoToLogin"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Building2, User, ShieldCheck } from 'lucide-vue-next'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import EmailConflictDialog from '@/components/common/EmailConflictDialog.vue'

const router = useRouter()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)
const isLoading = ref(false)
const registerError = ref('')

const showEmailConflict = ref(false)
const conflictEmail = ref('')

const chartBars = [40, 65, 50, 80, 60, 75, 45, 70]

const pastelMeshStyle = {
  backgroundColor: '#faf8ff',
  backgroundImage: [
    'radial-gradient(at 0% 0%, hsla(225,100%,94%,1) 0, transparent 50%)',
    'radial-gradient(at 50% 0%, hsla(270,100%,95%,1) 0, transparent 50%)',
    'radial-gradient(at 100% 0%, hsla(330,100%,96%,1) 0, transparent 50%)',
  ].join(', '),
}

const schema = toTypedSchema(
  z
    .object({
      fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
      email: z.string().min(1, 'Vui lòng nhập email công ty').email('Email không hợp lệ'),
      companyName: z.string().min(2, 'Tên doanh nghiệp tối thiểu 2 ký tự'),
      password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
      confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    }),
)

const { handleSubmit, values } = useForm({ validationSchema: schema })

const passwordStrength = computed(() => {
  const pw = (values as Record<string, string>).password ?? ''
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
})

const strengthColorClass = computed(() => {
  const map: Record<number, string> = {
    1: 'bg-error-500',
    2: 'bg-warning-500',
    3: 'bg-success-500',
    4: 'bg-success-500',
  }
  return map[passwordStrength.value] ?? 'bg-gray-200'
})

const strengthTextColorClass = computed(() => {
  const map: Record<number, string> = {
    1: 'text-error-500',
    2: 'text-warning-500',
    3: 'text-success-500',
    4: 'text-success-500',
  }
  return map[passwordStrength.value] ?? 'text-gray-500'
})

const passwordStrengthLabel = computed(() => {
  const map: Record<number, string> = {
    1: 'Yếu',
    2: 'Trung bình',
    3: 'Mạnh',
    4: 'Rất mạnh',
  }
  return map[passwordStrength.value] ?? ''
})

// Danh sách email đã tồn tại (mock — thay bằng API thực sau)
const EXISTING_EMAILS = ['admin@company.com', 'test@example.com']

const onSubmit = handleSubmit(async (vals) => {
  if (!agreedToTerms.value) {
    registerError.value = 'Vui lòng đồng ý với điều khoản dịch vụ'
    return
  }

  isLoading.value = true
  registerError.value = ''

  await new Promise((resolve) => setTimeout(resolve, 800))

  isLoading.value = false

  // Giả lập email đã tồn tại
  if (EXISTING_EMAILS.includes(vals.email.toLowerCase())) {
    conflictEmail.value = vals.email
    showEmailConflict.value = true
    return
  }

  toast.success('Tạo tài khoản thành công! Vui lòng đăng nhập.')
  router.push('/login')
})

function handleGoToLogin() {
  showEmailConflict.value = false
  router.push('/login')
}
</script>
