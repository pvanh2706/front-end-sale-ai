<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="flex max-h-[90vh] w-full max-w-[520px] flex-col gap-0 overflow-hidden rounded-t-2xl p-0 md:rounded-2xl"
      :show-close-button="false"
    >
      <!-- Handle bar (mobile only) -->
      <div class="flex justify-center py-3 md:hidden">
        <div class="h-1.5 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <!-- Header -->
      <DialogHeader
        class="flex flex-row items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800 md:pt-6 md:border-none"
      >
        <div>
          <DialogTitle class="text-theme-xl font-bold text-gray-900 dark:text-white">
            Xuất chat
          </DialogTitle>
          <DialogDescription class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Tải xuống lịch sử hội thoại của bạn dưới định dạng phù hợp
          </DialogDescription>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          class="mt-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          @click="$emit('update:open', false)"
          aria-label="Đóng"
        >
          <X class="h-4 w-4" />
        </Button>
      </DialogHeader>

      <!-- Scrollable body -->
      <div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-6 py-5">

        <!-- Section 1: Định dạng file -->
        <section>
          <h3 class="mb-3 flex items-center gap-2 text-theme-sm font-semibold text-gray-900 dark:text-white">
            <FileText class="h-4 w-4" />
            Định dạng file
          </h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="fmt in fileFormats"
              :key="fmt.id"
              type="button"
              class="relative flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-left transition-all"
              :class="selectedFormat === fmt.id
                ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
                : 'border-gray-200 bg-white hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-500/50'"
              @click="selectedFormat = fmt.id"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg"
                :class="selectedFormat === fmt.id
                  ? 'bg-brand-100 dark:bg-brand-500/20'
                  : 'bg-gray-100 dark:bg-gray-700'"
              >
                <component
                  :is="fmt.icon"
                  class="h-5 w-5"
                  :class="selectedFormat === fmt.id
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'text-gray-500 dark:text-gray-400'"
                />
              </div>
              <div class="flex-1">
                <p
                  class="text-theme-sm font-semibold"
                  :class="selectedFormat === fmt.id
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'text-gray-900 dark:text-white'"
                >
                  {{ fmt.label }}
                </p>
                <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ fmt.description }}</p>
              </div>
              <CheckCircle2
                v-if="selectedFormat === fmt.id"
                class="absolute right-3 top-3 h-5 w-5 text-brand-500 dark:text-brand-400"
              />
            </button>
          </div>
        </section>

        <!-- Section 2: Phạm vi xuất -->
        <section>
          <h3 class="mb-4 flex items-center gap-2 text-theme-sm font-semibold text-gray-900 dark:text-white">
            <CalendarRange class="h-4 w-4" />
            Phạm vi xuất
          </h3>
          <div class="space-y-4">
            <label
              v-for="range in exportRanges"
              :key="range.id"
              class="flex cursor-pointer items-center gap-3"
            >
              <div
                class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                :class="selectedRange === range.id
                  ? 'border-brand-500 dark:border-brand-400'
                  : 'border-gray-300 dark:border-gray-600'"
                @click="selectedRange = range.id"
              >
                <div
                  v-if="selectedRange === range.id"
                  class="h-2.5 w-2.5 rounded-full bg-brand-500 dark:bg-brand-400"
                ></div>
              </div>
              <span class="text-theme-sm text-gray-700 dark:text-gray-300">{{ range.label }}</span>
            </label>
          </div>
        </section>

        <!-- Section 3: Tùy chọn nâng cao -->
        <section>
          <h3 class="mb-4 flex items-center gap-2 text-theme-sm font-semibold text-gray-900 dark:text-white">
            <SlidersHorizontal class="h-4 w-4" />
            Tùy chọn nâng cao
          </h3>
          <div class="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
            <label
              v-for="opt in advancedOptions"
              :key="opt.id"
              class="flex cursor-pointer items-start gap-3"
            >
              <Checkbox
                :id="opt.id"
                v-model:checked="opt.checked"
                class="mt-0.5 shrink-0"
              />
              <span class="text-theme-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {{ opt.label }}
              </span>
            </label>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <DialogFooter
        class="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Info class="h-4 w-4 shrink-0" />
          <p class="text-theme-xs font-medium">
            Ước tính kích thước file: <span class="text-gray-900 dark:text-white">~1.2 MB</span>
          </p>
        </div>
        <div class="flex w-full items-center gap-3 md:w-auto">
          <Button
            variant="ghost"
            class="flex-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:flex-none"
            @click="$emit('update:open', false)"
          >
            Hủy
          </Button>
          <Button
            class="flex-1 bg-brand-500 text-white hover:bg-brand-600 md:flex-none"
            :disabled="isDownloading"
            @click="handleDownload"
          >
            <LoaderCircle v-if="isDownloading" class="mr-2 h-4 w-4 animate-spin" />
            <Download v-else class="mr-2 h-4 w-4" />
            Tải xuống
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  CalendarRange,
  CheckCircle2,
  Code2,
  Download,
  FileText,
  Info,
  LoaderCircle,
  SlidersHorizontal,
  Type,
  X,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// --- File formats ---
const fileFormats = [
  { id: 'pdf', label: 'PDF', description: 'Tài liệu cố định', icon: FileText },
  { id: 'word', label: 'Microsoft Word', description: 'Có thể chỉnh sửa', icon: FileText },
  { id: 'text', label: 'Text thuần', description: 'Chỉ văn bản đơn giản', icon: Type },
  { id: 'markdown', label: 'Markdown', description: 'Định dạng nhẹ', icon: Code2 },
] as const

type FormatId = (typeof fileFormats)[number]['id']
const selectedFormat = ref<FormatId>('pdf')

// --- Export ranges ---
const exportRanges = [
  { id: 'all', label: 'Toàn bộ hồ sơ chat (245 tin nhắn)' },
  { id: 'session', label: 'Phiên chat hiện tại (32 tin nhắn)' },
  { id: 'custom', label: 'Tùy chọn khoảng thời gian' },
] as const

type RangeId = (typeof exportRanges)[number]['id']
const selectedRange = ref<RangeId>('all')

// --- Advanced options ---
const advancedOptions = reactive([
  { id: 'opt-citations', label: 'Bao gồm trích dẫn nguồn (citations)', checked: true },
  { id: 'opt-timestamp', label: 'Bao gồm timestamp tin nhắn', checked: false },
  { id: 'opt-attachments', label: 'Bao gồm tài liệu đã đính kèm', checked: true },
  { id: 'opt-sensitive', label: 'Ẩn thông tin nhạy cảm', checked: false },
])

// --- Download action ---
const isDownloading = ref(false)

async function handleDownload() {
  isDownloading.value = true
  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 1200))
    toast.success(`Đã xuất chat thành công (định dạng ${selectedFormat.value.toUpperCase()})`)
    emit('update:open', false)
  } finally {
    isDownloading.value = false
  }
}
</script>
