<template>
  <div class="flex h-screen w-full overflow-hidden">

    <!-- Left Column: Dark Branding (lg+ only) -->
    <section
      class="hidden lg:flex lg:w-[60%] relative flex-col justify-between p-12 overflow-hidden"
      :style="abstractMeshStyle"
      aria-hidden="true"
    >
      <!-- Decorative image overlay -->
      <div class="absolute inset-0 opacity-20 pointer-events-none bg-gradient-to-br from-purple-900/40 via-transparent to-pink-900/30"></div>

      <!-- Brand header -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-700" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        </div>
        <span class="text-xl font-semibold text-white tracking-tight">Salio</span>
      </div>

      <!-- Main content -->
      <div class="relative z-10 max-w-xl">
        <h1 class="text-[48px] font-bold leading-tight text-white mb-6">
          Salio — Trợ lý thông minh cho đội ngũ Sales
        </h1>
        <p class="text-lg text-white/80 max-w-md leading-relaxed">
          Salio giúp bạn chốt đơn nhanh hơn và thông minh hơn.
        </p>
      </div>

      <!-- Bottom tagline -->
      <div class="relative z-10 flex items-center gap-4 text-white/60 text-xs font-medium uppercase tracking-widest">
        <span>Trí tuệ nhân tạo</span>
        <span class="w-1 h-1 bg-white/40 rounded-full"></span>
        <span>Tăng trưởng doanh thu</span>
        <span class="w-1 h-1 bg-white/40 rounded-full"></span>
        <span>Tối ưu hóa Sales</span>
      </div>
    </section>

    <!-- Right Column: Login Form -->
    <section class="w-full lg:w-[40%] flex flex-col justify-center items-center px-6 md:px-8 overflow-y-auto bg-[#faf8ff] dark:bg-gray-900">
      <div class="w-full max-w-[440px] py-12 space-y-12">

        <!-- Form header -->
        <div class="space-y-3 text-center lg:text-left">
          <!-- Mobile logo -->
          <div class="lg:hidden flex justify-center mb-2">
            <div class="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
            </div>
          </div>
          <div class="flex flex-col items-center lg:items-start">
            <div class="flex items-center gap-2 mb-1">
              <Sparkles class="w-5 h-5 text-brand-500" aria-hidden="true" />
              <span class="text-sm font-semibold text-brand-500 uppercase tracking-wider">Salio</span>
            </div>
            <h1 class="text-[32px] font-bold text-gray-900 dark:text-white leading-tight">Đăng nhập</h1>
            <p class="text-base text-gray-500 dark:text-gray-400 mt-1">
              Chào mừng quay lại! Vui lòng nhập thông tin của bạn.
            </p>
          </div>
        </div>

        <!-- Login form -->
        <form
          @submit.prevent="onSubmit"
          class="space-y-4"
          aria-label="Biểu mẫu đăng nhập"
          novalidate
        >
          <div class="space-y-3">
            <!-- Email -->
            <FormField name="email" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField"
                    type="email"
                    class="h-11 rounded-lg border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20 transition-all"
                    placeholder="ban@congty.com"
                    autocomplete="username"
                    aria-required="true"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Password -->
            <FormField name="password" v-slot="{ componentField }">
              <FormItem>
                <FormLabel class="text-sm font-medium text-gray-900 dark:text-white">
                  Mật khẩu
                </FormLabel>
                <FormControl>
                  <div class="relative">
                    <Input
                      v-bind="componentField"
                      :type="showPassword ? 'text' : 'password'"
                      class="h-11 pr-11 rounded-lg border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-500/20 transition-all"
                      placeholder="••••••••"
                      autocomplete="current-password"
                      aria-required="true"
                    />
                    <button
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus-visible:outline-none"
                      :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                      @click="showPassword = !showPassword"
                    >
                      <Eye v-if="!showPassword" class="w-5 h-5" />
                      <EyeOff v-else class="w-5 h-5" />
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <!-- Remember me + Forgot password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                id="remember"
                v-model:checked="rememberMe"
                aria-label="Ghi nhớ đăng nhập"
              />
              <span class="text-sm text-gray-500 group-hover:text-gray-700 dark:text-gray-400 select-none transition-colors">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <a
              href="#"
              class="text-sm font-medium text-brand-500 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          <!-- Error message -->
          <p v-if="loginError" role="alert" class="text-sm text-error-500 text-center">
            {{ loginError }}
          </p>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full h-11 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-theme-sm"
            :aria-busy="isLoading"
          >
            {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
          </button>

          <!-- Divider -->
          <div class="relative flex items-center py-1">
            <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span class="flex-shrink mx-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              Hoặc đăng nhập với
            </span>
            <div class="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <!-- SSO buttons -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              aria-label="Đăng nhập với Google"
            >
              <img src="https://www.google.com/favicon.ico" alt="" aria-hidden="true" class="w-5 h-5 object-contain" />
              Tiếp tục với Google
            </button>
            <button
              type="button"
              class="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300"
              aria-label="Đăng nhập với Microsoft"
            >
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M1 1h10v10H1V1z" fill="#F25022" />
                <path d="M12 1h10v10H12V1z" fill="#7FBA00" />
                <path d="M1 12h10v10H1V12z" fill="#00A4EF" />
                <path d="M12 12h10v10H12V12z" fill="#FFB900" />
              </svg>
              Tiếp tục với Microsoft
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="space-y-3 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Chưa có tài khoản?
            <RouterLink
              to="/register"
              class="text-brand-500 font-semibold ml-1 hover:underline"
            >
              Đăng ký ngay
            </RouterLink>
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-600">
            © 2024 AI Sales Agent. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Eye, EyeOff, Sparkles } from 'lucide-vue-next'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)
const loginError = ref('')

// Màu nền dark blue + gradient overlay từ template Stitch
const abstractMeshStyle = {
  backgroundColor: '#004ac6',
  backgroundImage: [
    'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%)',
    'radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)',
    'radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
  ].join(', '),
}

const schema = toTypedSchema(
  z.object({
    email: z.string().min(1, 'Vui lòng nhập email'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
  }),
)

const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values: { email: string; password: string }) => {
  isLoading.value = true
  loginError.value = ''

  await new Promise((resolve) => setTimeout(resolve, 600))

  const success = authStore.login(values.email, values.password)
  isLoading.value = false

  if (success) {
    toast.success('Đăng nhập thành công!')
    const redirect = router.currentRoute.value.query.redirect
    const redirectPath = typeof redirect === 'string' && redirect.startsWith('/')
      ? redirect
      : '/chat'
    router.push(redirectPath)
  } else {
    loginError.value = 'Email hoặc mật khẩu không đúng'
  }
})
</script>
