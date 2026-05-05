<template>
  <AdminLayout>
    <div class="pb-8">
      <section class="px-4 pt-6 md:px-8 md:pt-8">
        <h1 class="text-[22px] font-bold text-gray-900 dark:text-white md:text-[28px]">
          {{ greeting }}
        </h1>
        <p class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400 md:text-base">
          Tài khoản: {{ accountName }}
        </p>
      </section>

      <section class="px-4 pt-4 md:px-8 md:pt-6">
        <form class="relative" @submit.prevent="submitSearch">
          <Search class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            ref="searchInputRef"
            v-model="searchQuery"
            class="h-14 rounded-xl border-2 border-primary-100 bg-white pl-12 pr-28 text-theme-sm shadow-theme-xs focus-visible:border-primary-500 focus-visible:ring-4 focus-visible:ring-primary-100/40 dark:bg-gray-900"
            placeholder="Hỏi AI hoặc tìm tài liệu..."
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {{ shortcutHint }}
          </span>
        </form>

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="chip in promptChips"
            :key="chip"
            type="button"
            class="rounded-full bg-primary-50 px-3 py-1.5 text-theme-xs font-medium text-primary-700 transition-all duration-200 hover:bg-primary-100"
            @click="openChatWithQuery(chip)"
          >
            {{ chip }}
          </button>
        </div>
      </section>

      <section class="mt-8 px-4 md:px-8">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <template v-if="loading">
            <div v-for="index in 4" :key="index" class="h-36 animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800"></div>
          </template>

          <template v-else>
            <article class="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="inline-flex rounded-full bg-primary-100 p-2 text-primary-700">📚</div>
              <p class="mt-3 text-theme-xs text-gray-500 dark:text-gray-400">Tài liệu trong thư viện</p>
              <p class="mt-1 text-title-xs font-bold text-primary-700">{{ statsValue?.documentsCount ?? 0 }}</p>
              <p class="mt-1 text-theme-xs text-success-500">↑ +{{ statsValue?.newDocumentsThisWeek ?? 0 }} tuần này</p>
            </article>

            <article class="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="inline-flex rounded-full bg-blue-100 p-2 text-blue-700">💬</div>
              <p class="mt-3 text-theme-xs text-gray-500 dark:text-gray-400">Phiên chat tháng này</p>
              <p class="mt-1 text-title-xs font-bold text-blue-700">{{ statsValue?.sessionsThisMonth ?? 0 }}</p>
              <p class="mt-1 text-theme-xs" :class="(statsValue?.sessionsPercentChange ?? 0) >= 0 ? 'text-success-500' : 'text-error-500'">
                {{ (statsValue?.sessionsPercentChange ?? 0) >= 0 ? '↑' : '↓' }} {{ Math.abs(statsValue?.sessionsPercentChange ?? 0) }}% so với tháng trước
              </p>
            </article>

            <article class="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="inline-flex rounded-full bg-violet-100 p-2 text-violet-700">✦</div>
              <p class="mt-3 text-theme-xs text-gray-500 dark:text-gray-400">Câu hỏi đã trả lời</p>
              <p class="mt-1 text-title-xs font-bold text-violet-700">{{ statsValue?.questionsAnswered ?? 0 }}</p>
              <p class="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">Trung bình {{ statsValue?.avgResponseTime ?? 0 }}s/câu</p>
            </article>

            <article class="rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
              <div class="inline-flex rounded-full bg-emerald-100 p-2 text-emerald-700">💾</div>
              <p class="mt-3 text-theme-xs text-gray-500 dark:text-gray-400">Dung lượng đã dùng</p>
              <p class="mt-1 text-theme-xl font-bold text-emerald-700">
                {{ statsValue?.storageUsed ?? 0 }} / {{ statsValue?.storageLimit ?? 0 }} GB
              </p>
              <div class="mt-3 h-1.5 rounded-full bg-gray-200">
                <div class="h-1.5 rounded-full bg-emerald-500" :style="{ width: `${storagePercent}%` }"></div>
              </div>
            </article>
          </template>
        </div>
      </section>

      <section class="mt-8 grid grid-cols-1 gap-6 px-4 md:px-8 xl:grid-cols-2">
        <section v-if="loading || aiSuggestions.length" class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div class="flex items-center justify-between">
            <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">✨ Gợi ý cho bạn</h2>
            <button type="button" class="text-theme-sm text-primary-600 hover:underline" @click="refreshSuggestions">↻</button>
          </div>

          <div class="mt-3 space-y-3">
            <template v-if="loading">
              <div v-for="index in 3" :key="`ai-${index}`" class="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>
            </template>
            <template v-else>
              <article
                v-for="item in aiSuggestions"
                :key="item.title"
                class="rounded-xl border border-primary-100 bg-gradient-to-br from-primary-50 to-violet-50 p-4"
              >
                <p class="text-sm font-medium text-gray-900">{{ suggestionIcon(item.type) }} {{ item.title }}</p>
                <p class="mt-1 text-theme-xs text-gray-600">{{ item.description }}</p>
                <button type="button" class="mt-2 text-theme-sm text-primary-600 hover:underline" @click="router.push(item.actionUrl)">Xem ngay →</button>
              </article>
            </template>
          </div>
        </section>

        <section class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">🔍 Câu hỏi phổ biến</h2>
          <div class="mt-3 space-y-2">
            <button
              v-for="question in popularQuestions"
              :key="question"
              type="button"
              class="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-theme-sm text-gray-700 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-300"
              @click="openChatWithQuery(question)"
            >
              <span>{{ question }}</span>
              <span>→</span>
            </button>
          </div>
        </section>
      </section>

      <section class="mt-12 border-t border-gray-200 px-4 pt-8 md:px-8 dark:border-gray-800">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="action in quickActions"
            :key="action.title"
            type="button"
            class="rounded-xl border border-gray-200 bg-white p-4 text-left transition-all duration-200 hover:border-primary-300 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]"
            @click="action.onClick()"
          >
            <p class="text-2xl">{{ action.icon }}</p>
            <p class="mt-2 text-theme-sm font-medium text-gray-900 dark:text-white">{{ action.title }}</p>
            <p class="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">{{ action.description }}</p>
          </button>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { Search } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Input } from '@/components/ui/input'
import { useChatDashboard } from '@/composables/useChatDashboard'
import { useAuthStore } from '@/stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')

const {
  stats,
  aiSuggestions,
  popularQuestions,
  loading,
  error,
  refresh,
} = useChatDashboard()

const statsValue = computed(() => stats.value)
const shortcutHint = computed(() => (navigator.platform.toLowerCase().includes('mac') ? '⌘K' : 'Ctrl+K'))
const accountName = computed(() => authStore.user?.name ?? 'Người dùng')

const storagePercent = computed(() => {
  if (!statsValue.value || statsValue.value.storageLimit <= 0) {
    return 0
  }
  return Math.min(100, Math.round((statsValue.value.storageUsed / statsValue.value.storageLimit) * 100))
})

const promptChips = [
  'Tóm tắt báo giá Q2',
  'So sánh hợp đồng A và B',
  'Tạo email follow-up khách hàng',
  'Tìm chính sách hoàn tiền',
]

const quickActions = [
  {
    icon: '💬',
    title: 'Bắt đầu chat mới',
    description: 'Hỏi AI bất cứ điều gì',
    onClick: () => router.push('/chat-tai-lieu/chat'),
  },
  {
    icon: '📁',
    title: 'Xem toàn bộ thư viện',
    description: 'Duyệt tất cả tài liệu',
    onClick: () => router.push('/chat-tai-lieu/library'),
  },
  {
    icon: '📊',
    title: 'Phân tích sử dụng',
    description: 'Báo cáo chi tiết',
    onClick: () => router.push('/chat-tai-lieu/analytics'),
  },
]

const greeting = computed(() => {
  const hour = new Date().getHours()
  const userName = accountName.value
  if (hour >= 5 && hour < 11) {
    return `👋 Chào buổi sáng, ${userName}!`
  }
  if (hour >= 11 && hour < 18) {
    return `👋 Chào buổi chiều, ${userName}!`
  }
  return `👋 Chào buổi tối, ${userName}!`
})

function submitSearch(): void {
  const query = searchQuery.value.trim()
  if (!query) {
    return
  }
  void router.push(`/chat-tai-lieu/chat?q=${encodeURIComponent(query)}`)
}

function openChatWithQuery(query: string): void {
  void router.push(`/chat-tai-lieu/chat?q=${encodeURIComponent(query)}`)
}

function refreshSuggestions(): void {
  void refresh()
}

function suggestionIcon(type: string): string {
  if (type === 'new_docs') {
    return '📌'
  }
  if (type === 'deadline') {
    return '⏰'
  }
  if (type === 'trending') {
    return '🔥'
  }
  return '💡'
}

function onShortcut(event: KeyboardEvent): void {
  const withCommand = navigator.platform.toLowerCase().includes('mac') ? event.metaKey : event.ctrlKey
  if (!withCommand || event.key.toLowerCase() !== 'k') {
    return
  }

  event.preventDefault()
  const input = searchInputRef.value
  if (input) {
    input.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onShortcut)
})

watch(
  () => error.value,
  (value) => {
    if (value) {
      toast.error(value)
    }
  },
)
</script>
