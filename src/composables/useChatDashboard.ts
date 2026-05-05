import { onMounted, ref } from 'vue'
import { chatService } from '@/services/chat'
import { libraryService } from '@/services/library'
import {
  mockAiSuggestions,
  mockDashboardStats,
  mockPopularQuestions,
  mockRecentChats,
  mockRecentDocuments,
} from '@/mocks/chatDashboard'
import { isSuccess } from '@/types/common'
import type {
  ChatDashboardStats,
  DashboardSuggestion,
  RecentChatItem,
  RecentDocumentItem,
} from '@/types/chatDashboard'

const CACHE_TTL_MS = 30 * 1000

interface CacheState {
  at: number
  stats: ChatDashboardStats | null
  recentChats: RecentChatItem[]
  recentDocs: RecentDocumentItem[]
  aiSuggestions: DashboardSuggestion[]
  popularQuestions: string[]
}

const cacheState: CacheState = {
  at: 0,
  stats: null,
  recentChats: [],
  recentDocs: [],
  aiSuggestions: [],
  popularQuestions: [],
}

export function useChatDashboard() {
  const stats = ref<ChatDashboardStats | null>(null)
  const recentChats = ref<RecentChatItem[]>([])
  const recentDocs = ref<RecentDocumentItem[]>([])
  const aiSuggestions = ref<DashboardSuggestion[]>([])
  const popularQuestions = ref<string[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isMock = ((import.meta.env.VITE_CHAT_DASHBOARD_USE_MOCK as string | undefined) ?? 'true') !== 'false'

  function hydrateFromCache(): boolean {
    if (!cacheState.stats) {
      return false
    }

    if (Date.now() - cacheState.at > CACHE_TTL_MS) {
      return false
    }

    stats.value = cacheState.stats
    recentChats.value = cacheState.recentChats
    recentDocs.value = cacheState.recentDocs
    aiSuggestions.value = cacheState.aiSuggestions
    popularQuestions.value = cacheState.popularQuestions
    return true
  }

  function writeCache(): void {
    cacheState.at = Date.now()
    cacheState.stats = stats.value
    cacheState.recentChats = recentChats.value
    cacheState.recentDocs = recentDocs.value
    cacheState.aiSuggestions = aiSuggestions.value
    cacheState.popularQuestions = popularQuestions.value
  }

  async function fetchFromApi(): Promise<void> {
    const [s, c, d, a, p] = await Promise.all([
      chatService.getDashboardStats(),
      chatService.getRecentSessions(5),
      libraryService.getRecentDocuments(5),
      chatService.getAiSuggestions(),
      chatService.getPopularQuestions(5),
    ])

    if (!isSuccess(s)) {
      throw new Error(s.error)
    }
    if (!isSuccess(c)) {
      throw new Error(c.error)
    }
    if (!isSuccess(d)) {
      throw new Error(d.error)
    }
    if (!isSuccess(a)) {
      throw new Error(a.error)
    }
    if (!isSuccess(p)) {
      throw new Error(p.error)
    }

    stats.value = s.data
    recentChats.value = c.data.items
    recentDocs.value = d.data.items
    aiSuggestions.value = a.data.items
    popularQuestions.value = p.data.items
  }

  function fetchFromMock(): void {
    stats.value = mockDashboardStats
    recentChats.value = mockRecentChats
    recentDocs.value = mockRecentDocuments
    aiSuggestions.value = mockAiSuggestions
    popularQuestions.value = mockPopularQuestions
  }

  async function fetchAll(force = false): Promise<void> {
    if (!force && hydrateFromCache()) {
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      if (isMock) {
        fetchFromMock()
      } else {
        await fetchFromApi()
      }
      writeCache()
    } catch (e) {
      if (isMock) {
        fetchFromMock()
      } else {
        error.value = e instanceof Error ? e.message : 'Không thể tải dữ liệu dashboard'
      }
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void fetchAll(false)
  })

  return {
    stats,
    recentChats,
    recentDocs,
    aiSuggestions,
    popularQuestions,
    loading,
    error,
    refresh: () => fetchAll(true),
  }
}
