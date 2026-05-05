<template>
  <AdminLayout>
    <div class="h-[calc(100vh-11rem)] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-full min-w-0">
        <aside class="hidden w-[340px] shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 lg:flex">
          <div class="border-b border-gray-200 p-4 dark:border-gray-800">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Hồ sơ chat</h2>
              <div class="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <Plus class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                  <Search class="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div class="space-y-1">
              <button
                v-for="node in visibleFolderNodes"
                :key="node.id"
                type="button"
                class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-theme-sm transition-colors"
                :class="[
                  node.id === activeFolderId
                    ? 'bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                  node.level === 1 ? 'ml-4' : '',
                  node.level === 2 ? 'ml-8' : '',
                ]"
                @click="activeFolderId = node.id"
              >
                <button
                  v-if="hasChildren(node.id)"
                  type="button"
                  class="inline-flex h-4 w-4 items-center justify-center rounded text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                  @click.stop="toggleFolderExpand(node.id)"
                >
                  <ChevronRight
                    class="h-3.5 w-3.5 transition-transform"
                    :class="isExpanded(node.id) ? 'rotate-90' : ''"
                  />
                </button>
                <span v-else class="h-4 w-4"></span>
                <FolderOpen v-if="node.id === activeFolderId || isExpanded(node.id)" class="h-4 w-4" />
                <Folder v-else class="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span class="flex-1 truncate">{{ node.name }} ({{ node.count }})</span>
              </button>
            </div>
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

                      <div v-if="message.sources?.length" class="mt-4 flex flex-wrap gap-2">
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
                    <span>Đang chat với {{ activeDocumentCount }} tài liệu</span>
                  </div>
                  <Button variant="link" class="h-auto p-0 text-primary-500">Quản lý</Button>
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

  <!-- Dialog xuất chat -->
  <ExportChatDialog v-model:open="showExportDialog" />

  <!-- Dialog chia sẻ chat -->
  <ShareChatDialog v-model:open="showShareDialog" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import {
  Download,
  Eye,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  LoaderCircle,
  Paperclip,
  Pin,
  Plus,
  Settings,
  Search,
  Send,
  Share2,
  Sparkles,
  Trash2,
} from 'lucide-vue-next'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import ExportChatDialog from '@/views/Chat/ExportChatDialog.vue'
import ShareChatDialog from '@/views/Chat/ShareChatDialog.vue'
import {
  fetchChatConversations,
  fetchConversationMessages,
  pickAssistantText,
  sendChatMessage,
  streamChatMessage,
} from '@/services/chat'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { isSuccess } from '@/types/common'
import type { ChatMessage, ChatSource } from '@/types/chat'

interface FolderNode {
  id: number
  name: string
  count: number
  level: number
  parentId?: number
}

interface UiChatMessage {
  id: string
  role: 'ai' | 'user'
  content: string
  time: string
  sources?: ChatSource[]
  pending?: boolean
}

const folderTree = ref<FolderNode[]>([
  { id: 1, name: 'Khách hàng', count: 12, level: 0 },
  { id: 2, name: 'Doanh nghiệp', count: 5, level: 1, parentId: 1 },
  { id: 3, name: 'Công ty ABC', count: 3, level: 2, parentId: 2 },
  { id: 4, name: 'Báo giá Q2', count: 2, level: 2, parentId: 3 },
])
const expandedFolderIds = ref<number[]>([1, 2, 3])
const activeFolderId = ref(4)

const queryClient = useQueryClient()
const selectedConversationId = ref<string | null>(null)
const displayMessages = ref<UiChatMessage[]>([])
const activeDocumentCount = ref(3)
const draftMessage = ref('')
const messagesError = ref('')
const isSending = ref(false)
const showExportDialog = ref(false)
const showShareDialog = ref(false)

const conversationsQuery = useQuery({
  queryKey: ['chat', 'conversations'],
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
  () => messagesQuery.error.value,
  (error) => {
    if (error instanceof Error) {
      messagesError.value = error.message || 'Không thể tải nội dung cuộc chat'
      toast.error(messagesError.value)
    }
  },
)

const visibleFolderNodes = computed(() =>
  folderTree.value.filter((node) => {
    if (!node.parentId) {
      return true
    }

    let parentId: number | undefined = node.parentId
    while (parentId) {
      if (!expandedFolderIds.value.includes(parentId)) {
        return false
      }

      parentId = folderTree.value.find((item) => item.id === parentId)?.parentId
    }

    return true
  }),
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

function hasChildren(folderId: number): boolean {
  return folderTree.value.some((node) => node.parentId === folderId)
}

function isExpanded(folderId: number): boolean {
  return expandedFolderIds.value.includes(folderId)
}

function toggleFolderExpand(folderId: number): void {
  if (!hasChildren(folderId)) {
    return
  }

  if (isExpanded(folderId)) {
    collapseFolderTree(folderId)
    return
  }

  expandedFolderIds.value = [...expandedFolderIds.value, folderId]
}

function collapseFolderTree(folderId: number): void {
  const descendants = getDescendantIds(folderId)
  expandedFolderIds.value = expandedFolderIds.value.filter(
    (id) => id !== folderId && !descendants.includes(id),
  )
}

function getDescendantIds(folderId: number): number[] {
  const children = folderTree.value
    .filter((node) => node.parentId === folderId)
    .map((node) => node.id)

  return children.flatMap((childId) => [childId, ...getDescendantIds(childId)])
}

function handleComposerKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter') {
    return
  }

  if (event.shiftKey || event.isComposing) {
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