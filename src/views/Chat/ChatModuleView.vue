<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { RouterView } from 'vue-router'
import { fetchChatConversations } from '@/services/chat'
import { isSuccess } from '@/types/common'
import { useLibraryStore } from '@/stores/library'

const queryClient = useQueryClient()
const libraryStore = useLibraryStore()

function warmUpRouteChunks(): void {
  const preload = () => {
    void import('@/views/Chat/ChatView.vue')
    void import('@/views/DocLibrary/DocLibraryView.vue')
  }

  if ('requestIdleCallback' in window) {
    ;(window as Window & { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void }).requestIdleCallback(preload, { timeout: 1200 })
    return
  }

  globalThis.setTimeout(preload, 200)
}

onMounted(() => {
  warmUpRouteChunks()

  void queryClient.prefetchQuery({
    queryKey: ['chat', 'conversations'],
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    queryFn: async () => {
      const result = await fetchChatConversations()
      if (!isSuccess(result)) {
        throw new Error(result.error)
      }
      return result.data
    },
  })

  void libraryStore.fetchTree({ background: true })
})
</script>
