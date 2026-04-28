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
        <div class="md:hidden flex flex-col items-center text-center mt-8 mb-10 px-6">
          <div
            class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-[#6ba3e8]"
            style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
          </div>
          <h1 class="text-[32px] font-bold tracking-tight text-[#003866] mb-1">Sales.AI</h1>
          <p class="text-[16px] text-[#414750]">Tạo tài khoản để bắt đầu hành trình AI của bạn</p>
        </div>

        <!-- Tablet nav header (md only, hidden on lg) -->
        <nav class="hidden md:flex lg:hidden items-center justify-between px-6 py-8">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-[#6ba3e8] rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.99 14.99 0 006.16-12.12A14.99 14.99 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
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
        <main class="grow flex items-center justify-center px-6 md:px-4 py-4 md:py-8 lg:py-10 lg:px-24">
          <div
            class="w-full max-w-md md:max-w-140 lg:max-w-110 bg-white rounded-2xl p-6 md:p-12 lg:bg-transparent lg:shadow-none lg:p-10 md:flex md:flex-col md:gap-8 lg:block"
            style="box-shadow: 0 10px 20px rgba(107,163,232,0.12)">

            <!-- Title section -->
            <div class="hidden md:flex flex-col items-center md:mb-0 lg:mb-8 lg:items-start">
              <!-- Tablet: icon + heading -->
              <div class="w-16 h-16 bg-[#f2f3f9] rounded-2xl flex items-center justify-center mb-4 lg:hidden">
                <UserPlus class="w-8 h-8 text-[#6ba3e8]" />
              </div>
              <!-- Desktop heading -->
              <h2 class="hidden lg:block text-[32px] font-semibold tracking-tight text-[#191c20] mb-2">
                Tạo tài khoản mới
              </h2>
              <p class="hidden lg:block text-[16px] text-[#414750]">
                Điền thông tin để bắt đầu sử dụng Sales.AI
              </p>
              <!-- Tablet heading -->
              <h2 class="lg:hidden text-[32px] font-semibold text-[#191c20] mb-2 text-center">Đăng ký</h2>
              <p class="lg:hidden text-sm text-[#414750] text-center">
                Tạo tài khoản để bắt đầu hành trình AI của bạn
              </p>
            </div>

            <!-- Form -->
            <form @submit.prevent="onSubmit" class="space-y-5 md:space-y-6">

              <!-- Full name -->
              <FormField name="fullName" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel class="text-[14px] font-semibold text-[#414750] ml-1">Họ và tên</FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <User
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c1c7d2] group-focus-within:text-[#1e60a1] transition-colors" />
                      <Input
                        v-bind="componentField"
                        class="pl-12 h-14 rounded-xl border-[#c1c7d2] bg-[#f8f9ff] focus:border-[#1e60a1] focus:ring-[#6ba3e8]/30 transition-all"
                        placeholder="Nguyễn Văn A"
                        type="text"
                        autocomplete="name" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Email -->
              <FormField name="email" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel class="text-[14px] font-semibold text-[#414750] ml-1">Email</FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <Mail
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c1c7d2] group-focus-within:text-[#1e60a1] transition-colors" />
                      <Input
                        v-bind="componentField"
                        class="pl-12 h-14 rounded-xl border-[#c1c7d2] bg-[#f8f9ff] focus:border-[#1e60a1] focus:ring-[#6ba3e8]/30 transition-all"
                        placeholder="example@email.com"
                        type="text"
                        autocomplete="email" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Password -->
              <FormField name="password" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel class="text-[14px] font-semibold text-[#414750] ml-1">Mật khẩu</FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <Lock
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c1c7d2] group-focus-within:text-[#1e60a1] transition-colors" />
                      <Input
                        v-bind="componentField"
                        :type="showPassword ? 'text' : 'password'"
                        class="pl-12 pr-12 h-14 rounded-xl border-[#c1c7d2] bg-[#f8f9ff] focus:border-[#1e60a1] focus:ring-[#6ba3e8]/30 transition-all"
                        placeholder="Tối thiểu 8 ký tự"
                        autocomplete="new-password" />
                      <button
                        type="button"
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

              <!-- Confirm password -->
              <FormField name="confirmPassword" v-slot="{ componentField }">
                <FormItem>
                  <FormLabel class="text-[14px] font-semibold text-[#414750] ml-1">Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <div class="relative group">
                      <ShieldCheck
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#c1c7d2] group-focus-within:text-[#1e60a1] transition-colors" />
                      <Input
                        v-bind="componentField"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="pl-12 pr-12 h-14 rounded-xl border-[#c1c7d2] bg-[#f8f9ff] focus:border-[#1e60a1] focus:ring-[#6ba3e8]/30 transition-all"
                        placeholder="Nhập lại mật khẩu"
                        autocomplete="new-password" />
                      <button
                        type="button"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-[#c1c7d2] hover:text-[#414750] transition-colors"
                        @click="showConfirmPassword = !showConfirmPassword">
                        <Eye v-if="!showConfirmPassword" class="w-5 h-5" />
                        <EyeOff v-else class="w-5 h-5" />
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <!-- Terms checkbox (tablet+) -->
              <div class="flex items-start gap-3 px-1">
                <Checkbox
                  id="terms"
                  v-model:checked="agreedToTerms"
                  class="mt-0.5 w-5 h-5 rounded border-[#c1c7d2] text-[#1e60a1] focus:ring-[#6ba3e8]/30 shrink-0" />
                <label for="terms" class="text-sm text-[#414750] cursor-pointer select-none leading-relaxed">
                  Tôi đồng ý với
                  <a href="#" class="text-[#1e60a1] font-semibold hover:underline">Điều khoản dịch vụ</a>
                  và
                  <a href="#" class="text-[#1e60a1] font-semibold hover:underline">Chính sách bảo mật</a>
                </label>
              </div>

              <!-- Error message -->
              <p v-if="registerError" class="text-sm text-red-600 text-center">{{ registerError }}</p>

              <!-- Submit button -->
              <button
                type="submit"
                :disabled="isLoading || !agreedToTerms"
                class="w-full h-14 bg-[#6ba3e8] text-white text-[14px] font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-[#1e60a1] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style="box-shadow: 0 10px 20px rgba(107,163,232,0.12)">
                <span v-if="isLoading">Đang tạo tài khoản...</span>
                <template v-else>
                  <span>Tạo tài khoản</span>
                  <ArrowRight class="hidden md:block w-5 h-5" />
                </template>
              </button>
            </form>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-5 md:my-0 lg:my-5">
              <div class="grow h-px bg-[#e1e2e8]"></div>
              <span class="text-[12px] font-medium text-[#727781] whitespace-nowrap">Hoặc đăng ký với</span>
              <div class="grow h-px bg-[#e1e2e8]"></div>
            </div>

            <!-- Social buttons -->
            <!-- Mobile: circular icons -->
            <div class="flex justify-center gap-6 md:hidden">
              <button
                type="button"
                class="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-[#f2f3f9] transition-colors"
                style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-6 h-6" />
              </button>
              <button
                type="button"
                class="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-[#f2f3f9] transition-colors"
                style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
                <svg class="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                class="w-14 h-14 rounded-full bg-white flex items-center justify-center hover:bg-[#f2f3f9] transition-colors"
                style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
              </button>
            </div>

            <!-- Tablet: Google + SSO buttons -->
            <div class="hidden md:grid lg:hidden grid-cols-2 gap-4">
              <button
                type="button"
                class="h-14 border border-[#e1e2e8] rounded-xl flex items-center justify-center gap-3 hover:bg-[#f2f3f9] transition-colors active:scale-[0.98]">
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
                <span class="text-sm font-semibold text-[#191c20]">Google</span>
              </button>
              <button
                type="button"
                class="h-14 border border-[#e1e2e8] rounded-xl flex items-center justify-center gap-3 hover:bg-[#f2f3f9] transition-colors active:scale-[0.98]">
                <Building2 class="w-5 h-5 text-blue-600" />
                <span class="text-sm font-semibold text-[#191c20]">SSO</span>
              </button>
            </div>

            <!-- Desktop: Google + Microsoft buttons -->
            <div class="hidden lg:grid grid-cols-2 gap-4">
              <button
                type="button"
                class="flex items-center justify-center gap-2 px-4 py-3 border border-[#c1c7d2] rounded-xl bg-white hover:bg-[#f2f3f9] transition-colors font-semibold text-sm text-[#414750]">
                <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
                Google
              </button>
              <button
                type="button"
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

            <!-- Sign in link -->
            <p class="text-center text-sm text-[#414750] mt-5 md:mt-0 lg:mt-5">
              Đã có tài khoản?
              <RouterLink to="/login" class="text-[#1e60a1] font-semibold ml-1 hover:underline">
                Đăng nhập ngay
              </RouterLink>
            </p>
          </div>
        </main>

        <!-- ---- FOOTER ---- -->

        <!-- Mobile footer -->
        <footer class="md:hidden flex flex-col items-center gap-2 px-6 py-6 border-t border-blue-100/30 mt-4">
          <div class="flex gap-4">
            <span class="text-[12px] text-[#727781] hover:text-[#1e60a1] cursor-pointer transition-colors">Privacy Policy</span>
            <span class="text-[12px] text-[#727781] hover:text-[#1e60a1] cursor-pointer transition-colors">Terms of Service</span>
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
          <!-- Illustration -->
          <div class="relative w-full max-w-115 aspect-square flex items-center justify-center">
            <div
              class="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[48px] transform rotate-3"
              style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)"></div>
            <div
              class="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-[48px] transform -rotate-2"
              style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)"></div>

            <div class="relative z-20 w-80 h-80 flex items-center justify-center">
              <div class="w-48 h-48 bg-[#6ba3e8]/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-[#1e60a1]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
            </div>

            <!-- Badge -->
            <div
              class="absolute top-8 right-8 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3"
              style="box-shadow: 0 2px 8px rgba(107,163,232,0.08)">
              <div class="w-10 h-10 rounded-full bg-[#d1fadf] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#027a48]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="text-left">
                <div class="text-[14px] font-semibold text-[#191c20]">Miễn phí 30 ngày</div>
                <div class="text-[11px] text-[#727781]">Không cần thẻ tín dụng</div>
              </div>
            </div>
          </div>

          <!-- Feature text -->
          <div class="space-y-4 max-w-sm">
            <h3 class="text-[24px] font-semibold text-[#1e60a1]">Bắt đầu miễn phí ngay hôm nay</h3>
            <p class="text-[18px] text-[#3a637e] leading-relaxed opacity-80">
              Tham gia cùng hàng nghìn doanh nghiệp đang tăng trưởng với nền tảng AI bán hàng thông minh.
            </p>
          </div>

          <!-- Steps -->
          <div class="flex flex-col gap-3 w-full max-w-xs text-left">
            <div v-for="(step, i) in steps" :key="i" class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-[#6ba3e8]/20 flex items-center justify-center shrink-0">
                <span class="text-[12px] font-bold text-[#1e60a1]">{{ i + 1 }}</span>
              </div>
              <span class="text-sm text-[#3a637e]">{{ step }}</span>
            </div>
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
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe, Building2, User, UserPlus, ShieldCheck } from 'lucide-vue-next'

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const router = useRouter()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreedToTerms = ref(false)
const isLoading = ref(false)
const registerError = ref('')

const steps = ref([
  'Tạo tài khoản trong 2 phút',
  'Kết nối dữ liệu bán hàng',
  'Nhận insight AI ngay lập tức',
])

const schema = toTypedSchema(
  z
    .object({
      fullName: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
      email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
      password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
      confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    }),
)

const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit(async (values: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}) => {
  if (!agreedToTerms.value) {
    registerError.value = 'Vui lòng đồng ý với điều khoản dịch vụ'
    return
  }

  isLoading.value = true
  registerError.value = ''

  // Simulate async request
  await new Promise((resolve) => setTimeout(resolve, 800))

  isLoading.value = false
  toast.success('Tạo tài khoản thành công! Vui lòng đăng nhập.')
  router.push('/login')
})
</script>
