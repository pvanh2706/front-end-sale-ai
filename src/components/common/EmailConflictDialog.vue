<template>
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 bg-gray-900/50 flex items-end md:items-center md:justify-center md:p-6"
        @click.self="emit('update:modelValue', false)"
      >
        <Transition name="sheet-slide">
          <div
            v-if="modelValue"
            role="dialog"
            aria-modal="true"
            aria-labelledby="conflict-title"
            aria-describedby="conflict-desc"
            class="relative w-full md:max-w-[480px] bg-white rounded-t-[24px] md:rounded-2xl overflow-hidden h-[60%] md:h-auto flex flex-col"
            style="box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)"
          >
            <!-- Mobile handle bar -->
            <div class="flex justify-center pt-4 md:hidden flex-shrink-0">
              <div class="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>

            <!-- Close button -->
            <button
              type="button"
              aria-label="Đóng"
              class="absolute right-4 top-4 md:right-6 md:top-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              @click="emit('update:modelValue', false)"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- Scrollable content -->
            <div class="flex-1 overflow-y-auto p-8 pt-10 md:pt-12 flex flex-col items-center text-center">

              <!-- Warning icon -->
              <div class="w-16 h-16 rounded-full bg-warning-50 flex items-center justify-center mb-6 flex-shrink-0">
                <TriangleAlert class="w-8 h-8 text-warning-500" aria-hidden="true" />
              </div>

              <!-- Title -->
              <h2 id="conflict-title" class="text-xl font-semibold text-gray-900 mb-3">
                Email đã được đăng ký
              </h2>

              <!-- Description -->
              <p id="conflict-desc" class="text-sm text-gray-500 mb-8 max-w-sm leading-relaxed">
                Email <span class="font-semibold text-gray-900">{{ email }}</span> đã có tài khoản trên AI Sales Agent.
                Bạn có thể đăng nhập bằng email này hoặc dùng email khác để tạo tài khoản mới.
              </p>

              <!-- Action buttons -->
              <div class="w-full space-y-3">
                <button
                  type="button"
                  class="w-full h-12 bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-600 active:scale-[0.98] transition-all"
                  @click="emit('go-to-login')"
                >
                  Chuyển đến đăng nhập
                </button>
                <button
                  type="button"
                  class="w-full h-12 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  @click="emit('update:modelValue', false)"
                >
                  Dùng email khác
                </button>
              </div>

              <!-- Forgot password link -->
              <div class="mt-8">
                <a
                  href="#"
                  class="text-sm font-medium text-primary-500 hover:underline flex items-center justify-center gap-1"
                >
                  Quên mật khẩu?
                  <span class="font-normal text-gray-500">Khôi phục tại đây</span>
                </a>
              </div>
            </div>

            <!-- Bottom decorative gradient bar -->
            <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-700 to-primary-500 opacity-20 flex-shrink-0"></div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { TriangleAlert, X } from 'lucide-vue-next'

defineProps<{
  modelValue: boolean
  email: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'go-to-login': []
}>()
</script>

<style scoped>
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: opacity 0.25s ease;
}
.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: transform 0.3s ease-out, opacity 0.25s ease;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (min-width: 768px) {
  .sheet-slide-enter-from,
  .sheet-slide-leave-to {
    transform: scale(0.95) translateY(8px);
    opacity: 0;
  }
}
</style>
