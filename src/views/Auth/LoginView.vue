<template>
  <div class="min-h-screen bg-[#F5F9FF] font-['Inter'] text-[#191c20]">
    <!-- Background blur decorations -->
    <div class="fixed top-0 right-0 -z-10 w-64 h-64 bg-[#6ba3e8]/10 blur-[100px] rounded-full pointer-events-none"></div>
    <div class="fixed bottom-0 left-0 -z-10 w-72 h-72 bg-[#cc972c]/10 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Desktop two-column layout wrapper -->
    <div class="min-h-screen flex flex-col lg:flex-row">

      <!-- ===== LEFT COLUMN (form side, always visible) ===== -->
      <div class="flex flex-col flex-1 lg:max-w-[50%] bg-white">

        <!-- ---- HEADER ---- -->

        <!-- Mobile: Hero logo section (hidden on md+) -->
        <div class="md:hidden flex flex-col items-center text-center mt-8 mb-12 px-6">
          <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-[#6ba3e8]"
            style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <h1 class="text-[32px] font-bold tracking-tight text-[#003866] mb-1">Sales.AI</h1>
          <p class="text-[16px] text-[#414750]">Chào mừng bạn quay trở lại với giải pháp AI thông minh</p>
        </div>

        <!-- Tablet nav header (md only, hidden on lg) -->
        <nav class="hidden md:flex lg:hidden items-center justify-between px-6 py-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-[#6ba3e8] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
            </div>
            <span class="text-xl font-bold tracking-tight text-blue-500">Sales.AI</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm font-semibold text-[#3a637e] cursor-pointer hover:text-[#1e60a1] transition-colors">Help</span>
            <Globe class="w-5 h-5 text-[#3a637e]" />
          </div>
        </nav>

        <!-- Desktop logo header (lg+) -->
        <header class="hidden lg:flex p-8">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#6ba3e8]" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            <span class="text-xl font-bold tracking-tight text-[#1e60a1]">Sales.AI</span>
          </div>
        </header>

        <!-- ---- FORM AREA ---- -->
        <main class="grow flex items-center justify-center px-6 md:px-4 py-4 md:py-8 lg:py-12 lg:px-24">
          <!--
            Card wrapper:
            - Mobile: white card with shadow (bg-white shadow)
            - Tablet: white card with deeper shadow (md:shadow-xl)
            - Desktop: no card, just form (lg:bg-transparent lg:shadow-none lg:p-0)
          -->
          <div
            class="w-full max-w-md md:max-w-140 lg:max-w-110 bg-white rounded-2xl p-6 md:p-12 lg:bg-transparent lg:shadow-none lg:p-10 md:flex md:flex-col md:gap-8 lg:block"
            style="box-shadow: 0 10px 20px rgba(107,163,232,0.12)">

            <!-- Title section (hidden on mobile — hero section above handles it) -->
            <div class="hidden md:flex flex-col items-center mb-8 md:mb-0 lg:mb-8 lg:items-start lg:text-left">
              <div class="w-16 h-16 bg-[#f2f3f9] rounded-2xl flex items-center justify-center mb-4 lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-[#6ba3e8]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </div>
              <!-- Desktop heading -->
              <h2 class="hidden lg:block text-[32px] font-semibold tracking-tight text-[#191c20] mb-2">
                Chào mừng trở lại
              </h2>
              <p class="hidden lg:block text-[16px] text-[#414750]">
                Đăng nhập để tiếp tục quản lý tài liệu AI của bạn
              </p>
              <!-- Tablet heading -->
              <h2 class="lg:hidden text-[32px] font-semibold text-[#191c20] mb-2 text-center">Đăng nhập</h2>
              <p class="lg:hidden text-sm text-[#414750] text-center">
                Chào mừng bạn quay trở lại với giải pháp bán hàng AI
              </p>
            </div>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="space-y-5 md:space-y-6">
              <!-- Email -->
              <FormField name="email" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel class="text-[14px] font-semibold text-[#414750] ml-1">Email</FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <Mail
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c1c7d2] group-focus-within:text-[#1e60a1] transition-colors" />
                      <Input v-bind="componentField"
                        class="pl-12 h-14 rounded-xl border-[#c1c7d2] bg-[#f8f9ff] focus:border-[#1e60a1] focus:ring-[#6ba3e8]/30 transition-all"
                        placeholder="example@email.com" type="text" autocomplete="username" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Password -->
              <FormField name="password" v-slot="{ componentField }">
                <FormItem>
                  <div class="flex justify-between items-center">
                    <FormLabel class="text-[14px] font-semibold text-[#414750] ml-1">Mật khẩu</FormLabel>
                    <a href="#"
                      class="text-[12px] font-semibold text-[#1e60a1] hover:underline transition-colors">Quên mật khẩu?</a>
                  </div>
                  <FormControl>
                    <div class="relative group">
                      <Lock
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c1c7d2] group-focus-within:text-[#1e60a1] transition-colors" />
                      <Input v-bind="componentField"
                        :type="showPassword ? 'text' : 'password'"
                        class="pl-12 pr-12 h-14 rounded-xl border-[#c1c7d2] bg-[#f8f9ff] focus:border-[#1e60a1] focus:ring-[#6ba3e8]/30 transition-all"
                        placeholder="••••••••" autocomplete="current-password" />
                      <button type="button"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-[#c1c7d2] hover:text-[#414750] transition-colors"
                        @click="showPassword = !showPassword">
                        <Eye v-if="!showPassword" class="w-5 h-5" />
                        <EyeOff v-else class="w-5 h-5" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Remember me (tablet only: md, hidden on mobile and desktop) -->
              <div class="hidden md:flex lg:hidden items-center gap-2 px-1">
                <Checkbox id="remember" v-model:checked="rememberMe"
                  class="w-5 h-5 rounded border-[#c1c7d2] text-[#1e60a1] focus:ring-[#6ba3e8]/30" />
                <label for="remember" class="text-sm text-[#414750] cursor-pointer select-none">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <!-- Error message -->
              <p v-if="loginError" class="text-sm text-red-600 text-center">{{ loginError }}</p>

              <!-- Submit button -->
              <button type="submit" :disabled="isLoading"
                class="w-full h-14 bg-[#6ba3e8] text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1e60a1] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style="box-shadow: 0 10px 20px rgba(107,163,232,0.12)">
                <span v-if="isLoading">Đang đăng nhập...</span>
                <template v-else>
                  <span>Đăng nhập</span>
                  <!-- Arrow icon only on tablet/desktop -->
                  <ArrowRight class="hidden md:block w-5 h-5" />
                </template>
              </button>
            </form>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-5 md:my-0 lg:my-5">
              <div class="grow h-px bg-[#e1e2e8]"></div>
              <span class="text-[12px] font-medium text-[#727781] whitespace-nowrap">Hoặc đăng nhập với</span>
              <div class="grow h-px bg-[#e1e2e8]"></div>
            </div>

            <!-- Social buttons -->
            <!-- Mobile: circular icons -->
            <div class="flex justify-center gap-6 md:hidden">
              <button type="button"
                class="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-[#f2f3f9] transition-colors"
                style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-6 h-6" />
              </button>
              <button type="button"
                class="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-[#f2f3f9] transition-colors"
                style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
                <svg class="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button type="button"
                class="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-[#f2f3f9] transition-colors"
                style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
              </button>
            </div>

            <!-- Tablet: Google + SSO buttons -->
            <div class="hidden md:grid lg:hidden grid-cols-2 gap-4">
              <button type="button"
                class="h-14 border border-[#e1e2e8] rounded-xl flex items-center justify-center gap-3 hover:bg-[#f2f3f9] transition-colors active:scale-[0.98]">
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
                <span class="text-sm font-semibold text-[#191c20]">Google</span>
              </button>
              <button type="button"
                class="h-14 border border-[#e1e2e8] rounded-xl flex items-center justify-center gap-3 hover:bg-[#f2f3f9] transition-colors active:scale-[0.98]">
                <Building2 class="w-5 h-5 text-blue-600" />
                <span class="text-sm font-semibold text-[#191c20]">SSO</span>
              </button>
            </div>

            <!-- Desktop: Google + Microsoft buttons -->
            <div class="hidden lg:grid grid-cols-2 gap-4">
              <button type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 border border-[#c1c7d2] rounded-xl bg-white hover:bg-[#f2f3f9] transition-colors font-semibold text-sm text-[#414750]">
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
                Google
              </button>
              <button type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 border border-[#c1c7d2] rounded-xl bg-white hover:bg-[#f2f3f9] transition-colors font-semibold text-sm text-[#414750]">
                <svg class="w-5 h-5" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1h10v10H1V1z" fill="#F25022" />
                  <path d="M12 1h10v10H12V1z" fill="#7FBA00" />
                  <path d="M1 12h10v10H1V12z" fill="#00A4EF" />
                  <path d="M12 12h10v10H12V12z" fill="#FFB900" />
                </svg>
                Microsoft
              </button>
            </div>

            <p class="text-center text-sm text-[#414750] mt-5 md:mt-0 lg:mt-5">
              Chưa có tài khoản?
              <RouterLink to="/register" class="text-[#1e60a1] font-semibold ml-1 hover:underline">Đăng ký ngay</RouterLink>
            </p>
          </div>
        </main>

        <!-- ---- FOOTER ---- -->

        <!-- Mobile footer -->
        <footer class="md:hidden flex flex-col items-center gap-2 px-6 py-6 border-t border-blue-100/30 mt-4">
          <div class="flex gap-4">
            <span class="text-[12px] text-[#727781] hover:text-[#1e60a1] cursor-pointer transition-colors">Privacy
              Policy</span>
            <span class="text-[12px] text-[#727781] hover:text-[#1e60a1] cursor-pointer transition-colors">Terms of
              Service</span>
          </div>
          <p class="text-[12px] text-[#727781] opacity-60">© 2024 Sales.AI. All rights reserved.</p>
        </footer>

        <!-- Tablet/Desktop footer -->
        <footer class="hidden md:flex justify-between items-center px-8 py-6">
          <span class="text-xs text-slate-400">© 2024 Sales.AI. All rights reserved.</span>
          <div class="flex gap-6">
            <a href="#" class="text-xs text-slate-400 hover:text-blue-500 transition-colors">Privacy Policy</a>
            <a href="#" class="text-xs text-slate-400 hover:text-blue-500 transition-colors">Terms of Service</a>
            <a href="#" class="text-xs text-slate-400 hover:text-blue-500 transition-colors">Security</a>
          </div>
        </footer>
      </div>

      <!-- ===== RIGHT COLUMN (Desktop only) ===== -->
      <div class="hidden lg:flex lg:flex-1 bg-[#E8F1FB] relative overflow-hidden items-center justify-center">
        <!-- Decorative blurs -->
        <div class="absolute top-[-10%] right-[-10%] w-100 h-100 rounded-full bg-[#d3e4ff] opacity-20 blur-3xl"></div>
        <div class="absolute bottom-[-5%] left-[-5%] w-75 h-75 rounded-full bg-[#b3dcfd] opacity-30 blur-3xl"></div>

        <div class="relative z-10 flex flex-col items-center text-center gap-8 px-8">
          <!-- Illustration with glassmorphism cards -->
          <div class="relative w-full max-w-115 aspect-square flex items-center justify-center">
            <div class="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[48px] transform rotate-3"
              style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)"></div>
            <div class="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[48px] transform -rotate-2"
              style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)"></div>

            <!-- Placeholder illustration -->
            <div class="relative z-20 w-80 h-80 flex items-center justify-center">
              <div class="w-48 h-48 bg-[#6ba3e8]/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-[#1e60a1]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
            </div>

            <!-- AI Badge -->
            <div
              class="absolute top-8 right-8 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3"
              style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
              <div class="w-10 h-10 rounded-full bg-[#ffdea9] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#5e4100]" fill="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
                </svg>
              </div>
              <div class="text-left">
                <div class="text-[14px] font-semibold text-[#191c20]">Insight Thông Minh</div>
                <div class="text-[11px] text-[#727781]">Tự động hóa 85% quy trình</div>
              </div>
            </div>
          </div>

          <!-- Feature text -->
          <div class="space-y-4 max-w-sm">
            <h3 class="text-[24px] font-semibold text-[#1e60a1]">Tăng trưởng doanh thu đột phá cùng AI</h3>
            <p class="text-[18px] text-[#3a637e] leading-relaxed opacity-80">
              Hệ sinh thái AI toàn diện giúp tối ưu hóa quy trình bán hàng và nâng cao trải nghiệm khách hàng.
            </p>
          </div>

          <!-- Dot indicator -->
          <div class="flex gap-2">
            <div class="w-8 h-2 rounded-full bg-[#6ba3e8]"></div>
            <div class="w-2 h-2 rounded-full bg-[#a2c9ff]"></div>
            <div class="w-2 h-2 rounded-full bg-[#a2c9ff]"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Building2 } from 'lucide-vue-next'

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

  // Simulate async request
  await new Promise((resolve) => setTimeout(resolve, 600))

  const success = authStore.login(values.email, values.password)
  isLoading.value = false

  if (success) {
    toast.success('Đăng nhập thành công!')
    router.push('/')
  } else {
    loginError.value = 'Email hoặc mật khẩu không đúng'
  }
})
</script>
