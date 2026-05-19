<template>
  <AdminLayout>
    <div class="h-[calc(100vh-11rem)] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-full min-w-0">
        <aside class="hidden w-[340px] shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 lg:flex">
          <div class="border-b border-gray-200 p-4 dark:border-gray-800">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Hồ sơ chat</h2>
            </div>

            <LibraryTree
              :data="libraryStore.tree"
              :loading="libraryStore.loading"
              :selected-id="selectedContextNode?.id ?? null"
              mode="chat"
              @select="setChatContext"
              @expand="handleTreeExpand"
            />
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <h3 class="mb-3 text-theme-sm font-semibold text-gray-900 dark:text-white">Lịch sử chat</h3>
            <div v-if="conversationList.length" class="space-y-2">
              <div
                v-for="item in conversationList"
                :key="item.id"
                class="group rounded-xl border p-3 transition-all dark:bg-gray-800/40"
                :class="item.id === selectedConversationId
                  ? 'border-primary-200 bg-primary-50/60 dark:border-primary-500/40 dark:bg-primary-500/10'
                  : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50 dark:hover:border-gray-700'"
                @click="selectedConversationId = item.id"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                    <p class="mt-1 text-theme-xs text-gray-500">{{ item.time }}</p>
                  </div>
                  <div class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon-sm" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                      <Pin class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500">
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="isConversationsLoading" class="space-y-2">
              <div v-for="index in 3" :key="index" class="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>
            </div>
            <p v-else class="rounded-xl border border-dashed border-gray-300 px-3 py-4 text-theme-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Chưa có lịch sử chat.
            </p>
          </div>
        </aside>

        <main class="min-w-0 flex-1 bg-gray-50 dark:bg-gray-950">
          <div class="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:px-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-theme-xs text-gray-500">Khách hàng / Doanh nghiệp / Công ty ABC / <span class="font-medium text-primary-500">Báo giá Q2</span></p>
                <h1 class="mt-1 text-title-xs font-semibold text-gray-900 dark:text-white">Báo giá khách hàng ABC - Q2/2026</h1>
              </div>
              <div class="hidden items-center gap-1 md:flex">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                  aria-label="Xem tài liệu"
                  title="Xem tài liệu"
                  @click="showSourcesDialog = true"
                >
                  <Eye class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                  aria-label="Chia sẻ"
                  title="Chia sẻ"
                  @click="showShareDialog = true"
                >
                  <Share2 class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                  aria-label="Tải xuống"
                  title="Tải xuống"
                  @click="showExportDialog = true"
                >
                  <Download class="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  class="text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
                  aria-label="Cài đặt"
                  title="Cài đặt"
                  @click="showSettingsDialog = true"
                >
                  <Settings class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div class="flex h-[calc(100%-78px)] flex-col">
            <section class="custom-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
              <div v-if="isMessagesLoading" class="space-y-3">
                <div v-for="index in 3" :key="index" class="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800"></div>
              </div>
              <article
                v-for="message in displayMessages"
                :key="message.id"
                class="flex"
                :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
              >
                <div class="max-w-3xl" :class="message.role === 'user' ? 'items-end' : 'items-start'">
                  <div v-if="message.role === 'ai'" class="mb-2 flex items-center gap-2 text-theme-xs text-gray-500">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-white">
                      <LoaderCircle v-if="message.pending" class="h-3.5 w-3.5 animate-spin" />
                      <Sparkles v-else class="h-3.5 w-3.5" />
                    </div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Trợ lý AI</span>
                    <span>{{ message.time }}</span>
                  </div>

                  <Card :class="message.role === 'user'
                    ? 'rounded-2xl rounded-tr-sm border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                    : 'rounded-2xl rounded-tl-sm border-primary-100 bg-white dark:border-primary-500/30 dark:bg-gray-900'"
                  >
                    <CardContent class="p-4 md:p-5">
                      <p class="whitespace-pre-line text-theme-sm leading-6 text-gray-700 dark:text-gray-200">{{ message.content }}</p>

                      <div v-if="settingsShowSources && message.sources?.length" class="mt-4 flex flex-wrap gap-2">
                        <div
                          v-for="source in message.sources"
                          :key="source.id ?? source.label"
                          class="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-theme-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        >
                          <FileText class="h-3.5 w-3.5" />
                          <span>{{ source.label }}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <p v-if="message.role === 'user'" class="mt-1 px-1 text-right text-theme-xs text-gray-500">{{ message.time }}</p>
                </div>
              </article>
              <p v-if="messagesError" class="rounded-xl border border-error-200 bg-error-50 px-3 py-2 text-theme-sm text-error-600">
                {{ messagesError }}
              </p>
            </section>

            <footer class="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 md:p-6">
              <div class="mx-auto max-w-4xl space-y-3">
                <div class="flex items-center justify-between gap-3 text-theme-sm">
                  <div class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-primary-500 dark:bg-primary-500/15 dark:text-primary-300">
                    <FileText class="h-4 w-4" />
                    <span>
                      Đang chat với:
                      {{ selectedContextNode ? selectedContextNode.name : 'Tất cả tài liệu được phép truy cập' }}
                    </span>
                  </div>
                  <Button variant="link" class="h-auto p-0 text-primary-500" @click="clearChatContext">Đổi context</Button>
                </div>

                <form class="relative" @submit.prevent="sendMessage">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    class="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-gray-500 hover:text-primary-500"
                  >
                    <Paperclip class="h-4 w-4" />
                  </Button>
                  <Textarea
                    v-model="draftMessage"
                    :rows="2"
                    placeholder="Nhập câu hỏi tại đây..."
                    @keydown="handleComposerKeydown"
                    class="min-h-[64px] rounded-xl border-gray-300 bg-gray-50 py-4 pl-12 pr-14 text-theme-sm text-gray-700 focus-visible:border-primary-500 focus-visible:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary-500 text-white hover:bg-primary-600"
                    :disabled="!draftMessage.trim() || isSending"
                  >
                    <LoaderCircle v-if="isSending" class="h-4 w-4 animate-spin" />
                    <Send v-else class="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  </AdminLayout>

  <!-- Dialog xem tài liệu & trích dẫn -->
  <Dialog v-model:open="showSourcesDialog">
    <DialogContent class="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Eye class="h-5 w-5 text-primary-500" />
          Tài liệu & Trích dẫn
        </DialogTitle>
        <DialogDescription>
          Tài liệu AI đang sử dụng và các đoạn trích dẫn trong cuộc hội thoại này.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-5 py-1">
        <!-- Tài liệu đang chat -->
        <div>
          <p class="mb-2 text-theme-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tài liệu đang chat</p>
          <div class="flex items-center gap-3 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 dark:border-primary-500/30 dark:bg-primary-500/10">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-500/20">
              <FileText class="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="min-w-0">
              <p class="truncate text-theme-sm font-medium text-gray-900 dark:text-white">
                {{ selectedContextNode ? selectedContextNode.name : 'Tất cả tài liệu được phép truy cập' }}
              </p>
              <p class="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                {{ selectedContextNode ? (selectedContextNode.type === 'folder' ? 'Thư mục' : 'Tài liệu') : 'Context mặc định' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Trích dẫn theo từng tin nhắn AI -->
        <div>
          <p class="mb-2 text-theme-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Trích dẫn nội dung</p>

          <div v-if="aiMessagesWithSources.length" class="custom-scrollbar max-h-72 space-y-3 overflow-y-auto pr-1">
            <div
              v-for="msg in aiMessagesWithSources"
              :key="msg.id"
              class="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800/60"
            >
              <p class="mb-2 line-clamp-2 text-theme-xs italic text-gray-600 dark:text-gray-400">
                "{{ msg.content }}"
              </p>
              <div class="flex flex-wrap gap-1.5">
                <div
                  v-for="source in msg.sources"
                  :key="source.id ?? source.label"
                  class="inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-2.5 py-1 text-theme-xs font-medium text-primary-700 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300"
                >
                  <FileText class="h-3 w-3" />
                  {{ source.label }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center dark:border-gray-700">
            <FileText class="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p class="text-theme-sm text-gray-500 dark:text-gray-400">Chưa có trích dẫn nào trong cuộc hội thoại này.</p>
          </div>
        </div>

        <!-- Tất cả nguồn duy nhất -->
        <div v-if="allUniqueSources.length">
          <p class="mb-2 text-theme-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Tất cả nguồn sử dụng ({{ allUniqueSources.length }})</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="source in allUniqueSources"
              :key="source.id ?? source.label"
              class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-theme-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <FileText class="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              {{ source.label }}
            </span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="showSourcesDialog = false">Đóng</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- Dialog xuất chat -->
  <ExportChatDialog v-model:open="showExportDialog" />

  <!-- Dialog chia sẻ chat -->
  <ShareChatDialog v-model:open="showShareDialog" />

  <!-- Dialog cài đặt chat -->
  <Dialog v-model:open="showSettingsDialog">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Cài đặt chat</DialogTitle>
        <DialogDescription>
          Tùy chỉnh trải nghiệm chat với AI cho phiên làm việc hiện tại.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-2">
        <div class="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
          <div>
            <p class="text-theme-sm font-medium text-gray-900 dark:text-gray-100">Hiển thị nguồn trích dẫn</p>
            <p class="text-theme-xs text-gray-500 dark:text-gray-400">Ẩn/hiện danh sách tài liệu nguồn trong phản hồi AI.</p>
          </div>
          <Switch v-model:checked="settingsShowSources" />
        </div>

        <div class="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-3 dark:border-gray-700">
          <div>
            <p class="text-theme-sm font-medium text-gray-900 dark:text-gray-100">Gửi tin bằng Enter</p>
            <p class="text-theme-xs text-gray-500 dark:text-gray-400">
              {{ settingsSendOnEnter ? 'Enter để gửi, Shift+Enter xuống dòng.' : 'Ctrl/Cmd+Enter để gửi, Enter xuống dòng.' }}
            </p>
          </div>
          <Switch v-model:checked="settingsSendOnEnter" />
        </div>

        <div class="rounded-lg border border-error-200 bg-error-50 px-3 py-3 dark:border-error-500/30 dark:bg-error-500/10">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-theme-sm font-medium text-error-700 dark:text-error-400">Xoá toàn bộ lịch sử chat</p>
              <p class="text-theme-xs text-error-500 dark:text-error-400/80">Không thể hoàn tác sau khi xoá.</p>
            </div>
            <Button
              v-if="!showDeleteHistoryConfirm"
              type="button"
              variant="outline"
              size="sm"
              class="border-error-300 text-error-600 hover:bg-error-100 hover:text-error-700 dark:border-error-500/40 dark:text-error-400 dark:hover:bg-error-500/20"
              @click="showDeleteHistoryConfirm = true"
            >
              <Trash2 class="mr-1.5 h-3.5 w-3.5" />
              Xoá lịch sử
            </Button>
          </div>

          <div v-if="showDeleteHistoryConfirm" class="mt-3 flex items-center justify-end gap-2 border-t border-error-200 pt-3 dark:border-error-500/20">
            <p class="mr-auto text-theme-xs font-medium text-error-700 dark:text-error-400">Bạn chắc chắn muốn xoá?</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              class="text-gray-600 hover:text-gray-800 dark:text-gray-400"
              :disabled="isDeletingAllHistory"
              @click="showDeleteHistoryConfirm = false"
            >
              Huỷ
            </Button>
            <Button
              type="button"
              size="sm"
              class="bg-error-500 text-white hover:bg-error-600"
              :disabled="isDeletingAllHistory"
              @click="deleteAllHistory"
            >
              <LoaderCircle v-if="isDeletingAllHistory" class="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Xác nhận xoá
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" @click="showSettingsDialog = false">Đóng</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import {
  Download,
  Eye,
  FileText,
  LoaderCircle,
  Paperclip,
  Pin,
  Settings,
  Send,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-vue-next'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import LibraryTree from '@/components/library/LibraryTree.vue'
import ExportChatDialog from '@/views/Chat/ExportChatDialog.vue'
import ShareChatDialog from '@/views/Chat/ShareChatDialog.vue'
import {
  deleteAllConversations,
  fetchChatConversations,
  fetchConversationMessages,
  pickAssistantText,
  sendChatMessage,
  streamChatMessage,
} from '@/services/chat'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { isSuccess } from '@/types/common'
import type { ChatMessage, ChatSource } from '@/types/chat'
import { useLibraryStore } from '@/stores/library'
import type { LibraryNode } from '@/types/library'

interface UiChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  time: string
  sources?: ChatSource[]
  pending?: boolean
}

const route = useRoute()
const queryClient = useQueryClient()
const libraryStore = useLibraryStore()
const selectedConversationId = ref<string | null>(null)
const selectedContextNode = ref<LibraryNode | null>(null)
const displayMessages = ref<UiChatMessage[]>([])
const draftMessage = ref('')
const messagesError = ref('')
const isSending = ref(false)
const showExportDialog = ref(false)
const showShareDialog = ref(false)
const showSettingsDialog = ref(false)
const showSourcesDialog = ref(false)
const showDeleteHistoryConfirm = ref(false)
const isDeletingAllHistory = ref(false)
const settingsShowSources = ref(true)
const settingsSendOnEnter = ref(true)
const CHAT_CONVERSATIONS_STALE_TIME_MS = 30_000
const CHAT_MESSAGES_STALE_TIME_MS = 20_000

const conversationsQuery = useQuery({
  queryKey: ['chat', 'conversations'],
  staleTime: CHAT_CONVERSATIONS_STALE_TIME_MS,
  gcTime: 5 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: 1,
  queryFn: async () => {
    const result = await fetchChatConversations()
    if (!isSuccess(result)) {
      throw new Error(result.error)
    }
    return result.data
  },
})

watch(
  () => conversationsQuery.data.value,
  (list) => {
    if (!selectedConversationId.value && list?.length) {
      selectedConversationId.value = list[0].id
    }
  },
  { immediate: true },
)

watch(
  () => conversationsQuery.error.value,
  (error) => {
    if (error instanceof Error) {
      toast.error(error.message || 'Không thể tải danh sách hội thoại')
    }
  },
)

const messagesQuery = useQuery({
  queryKey: computed(() => ['chat', 'messages', selectedConversationId.value]),
  enabled: computed(() => Boolean(selectedConversationId.value)),
  staleTime: CHAT_MESSAGES_STALE_TIME_MS,
  gcTime: 5 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: 1,
  placeholderData: (previousData) => previousData,
  queryFn: async () => {
    messagesError.value = ''
    const result = await fetchConversationMessages(selectedConversationId.value as string)
    if (!isSuccess(result)) {
      throw new Error(result.error)
    }
    return result.data
  },
})

watch(
  () => messagesQuery.data.value,
  (list) => {
    if (!list) {
      return
    }

    displayMessages.value = list
      .filter((item) => item.role === 'assistant' || item.role === 'user')
      .map((item) => toUiMessage(item))
  },
  { immediate: true },
)

watch(
  () => showSettingsDialog.value,
  (open) => {
    if (!open) {
      showDeleteHistoryConfirm.value = false
    }
  },
)

watch(
  () => messagesQuery.error.value,
  (error) => {
    if (error instanceof Error) {
      messagesError.value = error.message || 'Không thể tải nội dung cuộc chat'
      toast.error(messagesError.value)
    }
  },
)

const fallbackMutation = useMutation({
  mutationFn: sendChatMessage,
})

const conversationList = computed(() => {
  const list = conversationsQuery.data.value ?? []
  return list.map((item) => ({
    id: item.id,
    title: item.title,
    time: formatRelativeTime(item.updatedAt),
  }))
})

const isConversationsLoading = computed(() => conversationsQuery.isLoading.value)
const isMessagesLoading = computed(() => messagesQuery.isLoading.value)

const aiMessagesWithSources = computed(() =>
  displayMessages.value.filter((m) => m.role === 'ai' && m.sources && m.sources.length > 0),
)

const allUniqueSources = computed(() => {
  const seen = new Set<string>()
  const result: ChatSource[] = []
  for (const msg of aiMessagesWithSources.value) {
    for (const src of msg.sources ?? []) {
      const key = src.id ?? src.label
      if (!seen.has(key)) {
        seen.add(key)
        result.push(src)
      }
    }
  }
  return result
})

onMounted(() => {
  void libraryStore.fetchTree()
  libraryStore.initRealtime()
  
  // Handle query parameter for auto-sending message
  const queryMessage = route.query.q as string | undefined
  if (queryMessage) {
    void nextTick(() => {
      draftMessage.value = decodeURIComponent(queryMessage)
      // Auto-focus and send after a short delay
      setTimeout(() => {
        void sendMessage()
      }, 500)
    })
  }
})

onUnmounted(() => {
  libraryStore.releaseRealtime()
})

const sendMessage = async () => {
  const content = draftMessage.value.trim()
  if (!content || isSending.value) {
    return
  }

  const conversationId = resolveConversationId()

  const tempUserId = `user-${Date.now()}`
  const tempAiId = `ai-${Date.now()}`

  displayMessages.value.push({
    id: tempUserId,
    role: 'user',
    content,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })

  displayMessages.value.push({
    id: tempAiId,
    role: 'ai',
    content: '',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pending: true,
  })

  draftMessage.value = ''
  isSending.value = true

  try {
    await streamChatMessage(
      {
        conversationId,
        message: content,
      },
      {
        onChunk: (chunk) => {
          const pendingMessage = displayMessages.value.find((item) => item.id === tempAiId)
          if (!pendingMessage) {
            return
          }
          pendingMessage.content += chunk
        },
        onDone: () => {
          const pendingMessage = displayMessages.value.find((item) => item.id === tempAiId)
          if (pendingMessage) {
            pendingMessage.pending = false
          }
        },
      },
    )

    const pendingMessage = displayMessages.value.find((item) => item.id === tempAiId)
    if (pendingMessage && !pendingMessage.content.trim()) {
      pendingMessage.content = 'AI đã tiếp nhận yêu cầu của bạn.'
      pendingMessage.pending = false
    }
  } catch {
    const fallbackResponse = await fallbackMutation.mutateAsync({
      conversationId,
      message: content,
    })

    const pendingMessage = displayMessages.value.find((item) => item.id === tempAiId)
    if (!pendingMessage) {
      return
    }

    if (isSuccess(fallbackResponse)) {
      pendingMessage.content =
        pickAssistantText(fallbackResponse.data) ?? 'AI đã tiếp nhận yêu cầu của bạn.'
      pendingMessage.pending = false

      if (!selectedConversationId.value && fallbackResponse.data.conversationId) {
        selectedConversationId.value = fallbackResponse.data.conversationId
      }
    } else {
      pendingMessage.content = 'Không thể lấy phản hồi từ AI. Vui lòng thử lại sau.'
      pendingMessage.pending = false
      toast.error(fallbackResponse.error)
    }
  } finally {
    isSending.value = false

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', conversationId] }),
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }),
    ])
  }
}

function resolveConversationId(): string {
  if (selectedConversationId.value) {
    return selectedConversationId.value
  }

  const firstConversationId = conversationList.value[0]?.id
  if (firstConversationId) {
    selectedConversationId.value = firstConversationId
    return firstConversationId
  }

  return 'default'
}

async function setChatContext(node: LibraryNode): Promise<void> {
  if (node.type !== 'folder' && node.type !== 'document') {
    return
  }

  const conversationId = resolveConversationId()
  const result = await libraryStore.applyChatContext(conversationId, node.id, node.type)
  if (!result) {
    return
  }

  selectedContextNode.value = {
    ...node,
    name: result.node_name,
  }
}

function handleTreeExpand(node: LibraryNode): void {
  if (node.type === 'folder' && node.has_more_children) {
    void libraryStore.fetchChildren(node.id)
  }
}

function clearChatContext(): void {
  selectedContextNode.value = null
}

async function deleteAllHistory(): Promise<void> {
  isDeletingAllHistory.value = true
  try {
    const result = await deleteAllConversations()
    if (!isSuccess(result)) {
      toast.error(result.error || 'Không thể xoá lịch sử chat')
      return
    }
    displayMessages.value = []
    selectedConversationId.value = null
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] }),
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] }),
    ])
    showDeleteHistoryConfirm.value = false
    showSettingsDialog.value = false
    toast.success('Đã xoá toàn bộ lịch sử chat')
  } finally {
    isDeletingAllHistory.value = false
  }
}

function handleComposerKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter') {
    return
  }

  if (event.isComposing) {
    return
  }

  if (settingsSendOnEnter.value) {
    if (event.shiftKey) {
      return
    }
  } else {
    const withCommand = navigator.platform.toLowerCase().includes('mac') ? event.metaKey : event.ctrlKey
    if (!withCommand) {
      return
    }
  }

  if (event.shiftKey && settingsSendOnEnter.value) {
    return
  }

  event.preventDefault()
  void sendMessage()
}

function toUiMessage(message: ChatMessage): UiChatMessage {
  return {
    id: message.id,
    role: message.role === 'assistant' ? 'ai' : 'user',
    content: message.content,
    time: formatMessageTime(message.createdAt),
    sources: message.sources,
  }
}

function formatMessageTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '--:--'
  }

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatRelativeTime(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const now = Date.now()
  const diffMinutes = Math.floor((now - date.getTime()) / 60000)

  if (diffMinutes < 1) {
    return 'Vừa xong'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`
  }

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} giờ trước`
  }

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) {
    return 'Hôm qua'
  }

  return `${diffDays} ngày trước`
}
</script>