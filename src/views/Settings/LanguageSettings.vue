<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ngôn ngữ &amp; Khu vực</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Thiết lập ngôn ngữ hiển thị, múi giờ và định dạng ngày giờ, số liệu.
      </p>
    </div>

    <!-- Loading skeleton -->
    <div v-if="isLoading" class="space-y-6">
      <div v-for="n in 3" :key="n" class="h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
    </div>

    <template v-else>
      <!-- ── Language picker ──────────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <Languages class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Ngôn ngữ hiển thị</span>
          </div>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Chọn ngôn ngữ giao diện ứng dụng</p>
        </div>

        <!-- Current language row -->
        <div class="flex items-center justify-between bg-white px-5 py-4 dark:bg-gray-800/20">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-2xl leading-none dark:border-gray-700 dark:bg-gray-800">
              {{ currentLanguage?.flag }}
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ currentLanguage?.nativeName ?? locale.language }}
                <span class="ml-1.5 text-xs font-normal text-gray-400 dark:text-gray-500">({{ currentLanguage?.name }})</span>
              </p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {{ currentLanguage?.region }} · <span class="font-mono uppercase">{{ locale.language }}</span>
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" @click="showLangDialog = true">
            <Languages class="mr-2 h-4 w-4" />
            Thay đổi
          </Button>
        </div>
      </div>

      <!-- ── Language picker Dialog ──────────────────────────────────────── -->
      <Dialog v-model:open="showLangDialog">
        <DialogContent class="max-w-lg p-0">
          <DialogHeader class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <DialogTitle class="flex items-center gap-2 text-base">
              <Languages class="h-4 w-4 text-gray-500" />
              Chọn ngôn ngữ hiển thị
            </DialogTitle>
            <DialogDescription class="text-xs text-gray-500 dark:text-gray-400">
              Ngôn ngữ ảnh hưởng đến toàn bộ giao diện ứng dụng.
            </DialogDescription>
          </DialogHeader>

          <!-- Search -->
          <div class="px-6 pt-4">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                v-model="langSearch"
                placeholder="Tìm ngôn ngữ…"
                class="h-9 pl-9 text-sm"
              />
            </div>
          </div>

          <!-- Language list -->
          <div class="max-h-80 overflow-y-auto px-6 py-3">
            <div class="space-y-1">
              <button
                v-for="lang in filteredLanguages"
                :key="lang.code"
                type="button"
                class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                :class="
                  pendingLanguage === lang.code
                    ? 'bg-brand-50 dark:bg-brand-500/10'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/40'
                "
                @click="pendingLanguage = lang.code"
              >
                <span class="text-2xl leading-none">{{ lang.flag }}</span>
                <div class="min-w-0 flex-1">
                  <p
                    class="text-sm font-medium"
                    :class="pendingLanguage === lang.code ? 'text-brand-700 dark:text-brand-300' : 'text-gray-800 dark:text-gray-200'"
                  >
                    {{ lang.nativeName }}
                  </p>
                  <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ lang.name }} · {{ lang.region }}</p>
                </div>
                <div
                  v-if="pendingLanguage === lang.code"
                  class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500"
                >
                  <Check class="h-3 w-3 text-white" />
                </div>
              </button>
              <p
                v-if="filteredLanguages.length === 0"
                class="py-6 text-center text-sm text-gray-400 dark:text-gray-500"
              >
                Không tìm thấy ngôn ngữ phù hợp
              </p>
            </div>
          </div>

          <DialogFooter class="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
            <Button variant="outline" size="sm" @click="showLangDialog = false">Huỷ</Button>
            <Button size="sm" @click="confirmLanguage">Áp dụng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- ── Timezone ────────────────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <Globe class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Múi giờ</span>
          </div>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Múi giờ dùng để hiển thị ngày giờ trong ứng dụng</p>
        </div>
        <div class="space-y-4 bg-white px-5 py-5 dark:bg-gray-800/20">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Múi giờ</Label>
              <Select v-model="locale.timezone">
                <SelectTrigger class="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="tz in timezones" :key="tz.value" :value="tz.value">
                    {{ tz.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Ngày đầu tuần</Label>
              <div class="flex rounded-lg border border-gray-200 p-1 dark:border-gray-700">
                <button
                  type="button"
                  class="flex-1 rounded-md py-1.5 text-xs font-medium transition-colors"
                  :class="
                    locale.firstDayOfWeek === 'Mon'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  "
                  @click="locale.firstDayOfWeek = 'Mon'"
                >
                  Thứ Hai
                </button>
                <button
                  type="button"
                  class="flex-1 rounded-md py-1.5 text-xs font-medium transition-colors"
                  :class="
                    locale.firstDayOfWeek === 'Sun'
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  "
                  @click="locale.firstDayOfWeek = 'Sun'"
                >
                  Chủ Nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Date & Time format ──────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <CalendarDays class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Định dạng ngày &amp; giờ</span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 bg-white px-5 py-5 sm:grid-cols-2 dark:bg-gray-800/20">
          <!-- Date format -->
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Định dạng ngày</Label>
            <div class="space-y-2">
              <button
                v-for="fmt in dateFormats"
                :key="fmt.value"
                type="button"
                class="flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors"
                :class="
                  locale.dateFormat === fmt.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600'
                "
                @click="locale.dateFormat = fmt.value"
              >
                <span>{{ fmt.label }}</span>
                <span class="font-mono text-xs opacity-60">{{ fmt.example }}</span>
              </button>
            </div>
          </div>
          <!-- Time format -->
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Định dạng giờ</Label>
            <div class="space-y-2">
              <button
                v-for="fmt in timeFormats"
                :key="fmt.value"
                type="button"
                class="flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors"
                :class="
                  locale.timeFormat === fmt.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-transparent dark:text-gray-300 dark:hover:border-gray-600'
                "
                @click="locale.timeFormat = fmt.value"
              >
                <span>{{ fmt.label }}</span>
                <span class="font-mono text-xs opacity-60">{{ fmt.example }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Number & Currency ───────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        <div class="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-800/50">
          <div class="flex items-center gap-2">
            <Coins class="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">Số liệu &amp; Tiền tệ</span>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 bg-white px-5 py-5 sm:grid-cols-2 dark:bg-gray-800/20">
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Định dạng số</Label>
            <Select v-model="locale.numberFormat">
              <SelectTrigger class="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="nf in numberFormats" :key="nf.value" :value="nf.value">
                  {{ nf.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Ví dụ: <span class="font-mono">{{ numberPreview }}</span>
            </p>
          </div>
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Đơn vị tiền tệ</Label>
            <Select v-model="locale.currency">
              <SelectTrigger class="h-9 text-sm">
                <span class="flex items-center gap-2">
                  <span>{{ currentCurrency?.flag }}</span>
                  <span>{{ currentCurrency?.code }} — {{ currentCurrency?.name }}</span>
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="c in currencies" :key="c.value" :value="c.value">
                  <span class="flex items-center gap-2">
                    <span>{{ c.flag }}</span>
                    <span>{{ c.code }} — {{ c.name }}</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <!-- ── Preview ─────────────────────────────────────────────────────── -->
      <div class="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-800/40">
        <div class="mb-3 flex items-center gap-2">
          <Eye class="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <span class="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Xem trước</span>
        </div>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-lg bg-white px-3 py-2.5 shadow-theme-xs dark:bg-gray-800">
            <p class="text-xs text-gray-400 dark:text-gray-500">Ngôn ngữ</p>
            <p class="mt-0.5 text-sm font-medium text-gray-800 dark:text-gray-200">
              {{ currentLanguage?.flag }} {{ currentLanguage?.nativeName ?? locale.language }}
            </p>
          </div>
          <div class="rounded-lg bg-white px-3 py-2.5 shadow-theme-xs dark:bg-gray-800">
            <p class="text-xs text-gray-400 dark:text-gray-500">Ngày hôm nay</p>
            <p class="mt-0.5 font-mono text-sm font-medium text-gray-800 dark:text-gray-200">{{ previewDate }}</p>
          </div>
          <div class="rounded-lg bg-white px-3 py-2.5 shadow-theme-xs dark:bg-gray-800">
            <p class="text-xs text-gray-400 dark:text-gray-500">Giờ hiện tại</p>
            <p class="mt-0.5 font-mono text-sm font-medium text-gray-800 dark:text-gray-200">{{ previewTime }}</p>
          </div>
          <div class="rounded-lg bg-white px-3 py-2.5 shadow-theme-xs dark:bg-gray-800">
            <p class="text-xs text-gray-400 dark:text-gray-500">Số tiền</p>
            <p class="mt-0.5 font-mono text-sm font-medium text-gray-800 dark:text-gray-200">{{ previewCurrency }}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-700">
        <p v-if="locale.updatedAt" class="text-xs text-gray-400 dark:text-gray-500">
          Cập nhật lần cuối: {{ formatDate(locale.updatedAt) }}
        </p>
        <div class="ml-auto flex items-center gap-3">
          <Button variant="outline" size="sm" @click="resetLocale">Đặt lại mặc định</Button>
          <Button size="sm" :disabled="isSaving" @click="saveLocale">
            <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            <Save v-else class="mr-2 h-4 w-4" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  CalendarDays,
  Check,
  Coins,
  Eye,
  Globe,
  Languages,
  Loader2,
  Save,
  Search,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchLocale, updateLocale, type Language, type LocaleSettings } from '@/services/locale'
import { toast } from 'vue-sonner'

// ── State ─────────────────────────────────────────────────────────────────────

const isLoading = ref(true)
const isSaving = ref(false)

// Fallback list — used immediately before API responds
const FALLBACK_LANGUAGES: Language[] = [
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Việt Nam' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English', flag: '🇺🇸', region: 'United States' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English', flag: '🇬🇧', region: 'United Kingdom' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文（简体）', flag: '🇨🇳', region: 'China' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Japan' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Korea' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'France' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Germany' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'Spain' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭', region: 'Thailand' },
]

const supportedLanguages = ref<Language[]>(FALLBACK_LANGUAGES)

// ── Language dialog ───────────────────────────────────────────────────────────

const showLangDialog = ref(false)
const langSearch = ref('')
const pendingLanguage = ref('')

watch(showLangDialog, (open) => {
  if (open) {
    pendingLanguage.value = locale.value.language
    langSearch.value = ''
  }
})

const filteredLanguages = computed(() => {
  const q = langSearch.value.toLowerCase().trim()
  if (!q) return supportedLanguages.value
  return supportedLanguages.value.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q),
  )
})

function confirmLanguage(): void {
  if (pendingLanguage.value) locale.value.language = pendingLanguage.value
  showLangDialog.value = false
}

const locale = ref<LocaleSettings>({
  userId: '',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  firstDayOfWeek: 'Mon',
  numberFormat: 'dot-comma',
  currency: 'VND',
  updatedAt: '',
  supportedLanguages: [],
})

// ── Static options ────────────────────────────────────────────────────────────

const timezones = [
  { value: 'Asia/Ho_Chi_Minh', label: '(UTC+7) Hồ Chí Minh / Hà Nội' },
  { value: 'Asia/Bangkok', label: '(UTC+7) Bangkok' },
  { value: 'Asia/Singapore', label: '(UTC+8) Singapore' },
  { value: 'Asia/Kuala_Lumpur', label: '(UTC+8) Kuala Lumpur' },
  { value: 'Asia/Tokyo', label: '(UTC+9) Tokyo' },
  { value: 'Asia/Seoul', label: '(UTC+9) Seoul' },
  { value: 'Asia/Shanghai', label: '(UTC+8) Shanghai' },
  { value: 'Asia/Kolkata', label: '(UTC+5:30) Mumbai / Delhi' },
  { value: 'Europe/London', label: '(UTC+0) London' },
  { value: 'Europe/Paris', label: '(UTC+1) Paris / Berlin' },
  { value: 'America/New_York', label: '(UTC-5) New York' },
  { value: 'America/Chicago', label: '(UTC-6) Chicago' },
  { value: 'America/Los_Angeles', label: '(UTC-8) Los Angeles' },
  { value: 'Australia/Sydney', label: '(UTC+10) Sydney' },
  { value: 'UTC', label: '(UTC+0) UTC' },
]

const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'Ngày/Tháng/Năm', example: '11/05/2026' },
  { value: 'MM/DD/YYYY', label: 'Tháng/Ngày/Năm', example: '05/11/2026' },
  { value: 'YYYY-MM-DD', label: 'Năm-Tháng-Ngày (ISO)', example: '2026-05-11' },
  { value: 'DD MMM YYYY', label: 'Ngày Tháng Năm (viết tắt)', example: '11 May 2026' },
]

const timeFormats = [
  { value: '24h', label: '24 giờ', example: '14:30' },
  { value: '12h', label: '12 giờ (AM/PM)', example: '2:30 PM' },
]

const numberFormats = [
  { value: 'dot-comma', label: 'Dấu chấm ngàn, dấu phẩy thập phân (1.234,56)' },
  { value: 'comma-dot', label: 'Dấu phẩy ngàn, dấu chấm thập phân (1,234.56)' },
  { value: 'space-comma', label: 'Dấu cách ngàn, dấu phẩy thập phân (1 234,56)' },
]

const currencies = [
  { value: 'VND', flag: '🇻🇳', code: 'VND', name: 'Đồng Việt Nam' },
  { value: 'USD', flag: '🇺🇸', code: 'USD', name: 'US Dollar' },
  { value: 'EUR', flag: '🇪🇺', code: 'EUR', name: 'Euro' },
  { value: 'GBP', flag: '🇬🇧', code: 'GBP', name: 'British Pound' },
  { value: 'JPY', flag: '🇯🇵', code: 'JPY', name: 'Japanese Yen' },
  { value: 'KRW', flag: '🇰🇷', code: 'KRW', name: 'Korean Won' },
  { value: 'CNY', flag: '🇨🇳', code: 'CNY', name: 'Chinese Yuan' },
  { value: 'SGD', flag: '🇸🇬', code: 'SGD', name: 'Singapore Dollar' },
  { value: 'THB', flag: '🇹🇭', code: 'THB', name: 'Thai Baht' },
  { value: 'AUD', flag: '🇦🇺', code: 'AUD', name: 'Australian Dollar' },
]

const currentCurrency = computed(() => currencies.find((c) => c.value === locale.value.currency))

// ── Computed preview ──────────────────────────────────────────────────────────

const currentLanguage = computed(() =>
  supportedLanguages.value.find((l) => l.code === locale.value.language),
)

const previewDate = computed(() => {
  const now = new Date()
  const d = String(now.getDate()).padStart(2, '0')
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const y = now.getFullYear()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  switch (locale.value.dateFormat) {
    case 'DD/MM/YYYY': return `${d}/${m}/${y}`
    case 'MM/DD/YYYY': return `${m}/${d}/${y}`
    case 'YYYY-MM-DD': return `${y}-${m}-${d}`
    case 'DD MMM YYYY': return `${d} ${months[now.getMonth()]} ${y}`
    default: return `${d}/${m}/${y}`
  }
})

const previewTime = computed(() => {
  const now = new Date()
  const h24 = now.getHours()
  const min = String(now.getMinutes()).padStart(2, '0')
  if (locale.value.timeFormat === '12h') {
    const period = h24 >= 12 ? 'PM' : 'AM'
    const h12 = h24 % 12 || 12
    return `${h12}:${min} ${period}`
  }
  return `${String(h24).padStart(2, '0')}:${min}`
})

const numberPreview = computed(() => {
  switch (locale.value.numberFormat) {
    case 'dot-comma': return '1.234.567,89'
    case 'comma-dot': return '1,234,567.89'
    case 'space-comma': return '1 234 567,89'
    default: return '1.234.567,89'
  }
})

const previewCurrency = computed(() => {
  const symbols: Record<string, string> = {
    VND: '₫', USD: '$', EUR: '€', GBP: '£', JPY: '¥', KRW: '₩',
    CNY: '¥', SGD: 'S$', THB: '฿', AUD: 'A$',
  }
  const sym = symbols[locale.value.currency] ?? locale.value.currency
  const num = locale.value.numberFormat === 'comma-dot' ? '1,250,000.00' : '1.250.000,00'
  return locale.value.currency === 'VND' ? `${num} ${sym}` : `${sym}${num}`
})

// ── Lifecycle ─────────────────────────────────────────────────────────────────

onMounted(async () => {
  isLoading.value = true
  const result = await fetchLocale()
  if (result.isSuccess && result.data) {
    supportedLanguages.value = result.data.supportedLanguages
    const { supportedLanguages: _, ...rest } = result.data
    locale.value = { ...locale.value, ...rest, supportedLanguages: result.data.supportedLanguages }
  } else {
    toast.error('Không thể tải cài đặt ngôn ngữ')
  }
  isLoading.value = false
})

// ── Actions ───────────────────────────────────────────────────────────────────

async function saveLocale(): Promise<void> {
  isSaving.value = true
  const { supportedLanguages: _sl, userId: _uid, updatedAt: _ua, ...input } = locale.value
  const result = await updateLocale(input)
  isSaving.value = false
  if (result.isSuccess && result.data) {
    locale.value.updatedAt = result.data.updatedAt
    toast.success('Đã lưu cài đặt ngôn ngữ')
  } else {
    toast.error(result.error ?? 'Lưu thất bại')
  }
}

function resetLocale(): void {
  locale.value.language = 'vi'
  locale.value.timezone = 'Asia/Ho_Chi_Minh'
  locale.value.dateFormat = 'DD/MM/YYYY'
  locale.value.timeFormat = '24h'
  locale.value.firstDayOfWeek = 'Mon'
  locale.value.numberFormat = 'dot-comma'
  locale.value.currency = 'VND'
  toast('Đã đặt lại về mặc định')
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
