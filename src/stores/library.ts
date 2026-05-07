import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import {
  createLibraryDocument,
  createLibraryFolder,
  deleteLibraryNode,
  fetchLibraryTree,
  setChatContext,
} from '@/services/library'
import { isSuccess } from '@/types/common'
import type { LibraryNode, LibraryNodeType } from '@/types/library'

const CACHE_TTL_MS = 5 * 60 * 1000
const POLL_INTERVAL_MS = 30 * 1000
const RECONNECT_DELAY_MS = 3 * 1000

const COMPANY_ROOT_ID = 'company-root'
const PERSONAL_ROOT_ID = 'personal-root'
const SHARED_ROOT_ID = 'shared-root'

interface FetchTreeOptions {
  force?: boolean
  background?: boolean
}

interface CachedTreePayload {
  tree: LibraryNode[]
  fetchedAt: number
}

export const useLibraryStore = defineStore('library', () => {
  const tree = ref<LibraryNode[]>(ensureSystemRoots([]))
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastFetchedAt = ref<number>(0)
  const cacheHydrated = ref(false)
  const connectionStatus = ref<'idle' | 'connected' | 'disconnected' | 'polling'>('idle')

  const wsClient = ref<WebSocket | null>(null)
  const reconnectTimer = ref<number | null>(null)
  const pollTimer = ref<number | null>(null)
  const realtimeConsumers = ref(0)
  let fetchTreeInFlight: Promise<void> | null = null

  const orgId = computed(() => resolveOrgIdFromToken())
  const cacheKey = computed(() => `library.tree.cache.${orgId.value}`)

  function readCache(): CachedTreePayload | null {
    try {
      const raw = localStorage.getItem(cacheKey.value)
      if (!raw) {
        return null
      }
      const parsed = JSON.parse(raw) as CachedTreePayload
      if (!Array.isArray(parsed.tree) || typeof parsed.fetchedAt !== 'number') {
        return null
      }
      return parsed
    } catch {
      return null
    }
  }

  function writeCache(payload: CachedTreePayload): void {
    localStorage.setItem(cacheKey.value, JSON.stringify(payload))
  }

  function hydrateFromCache(): void {
    const cached = readCache()
    if (!cached) {
      tree.value = ensureSystemRoots(tree.value)
      return
    }

    tree.value = ensureSystemRoots(cached.tree)
    lastFetchedAt.value = cached.fetchedAt
    cacheHydrated.value = true
  }

  async function fetchTree(options: FetchTreeOptions = {}): Promise<void> {
    const { force = false, background = false } = options

    if (force && fetchTreeInFlight) {
      await fetchTreeInFlight
    } else if (!force && fetchTreeInFlight) {
      return fetchTreeInFlight
    }

    fetchTreeInFlight = (async () => {
      if (!tree.value.length) {
        hydrateFromCache()
      }

      const isCacheFresh = Date.now() - lastFetchedAt.value < CACHE_TTL_MS
      if (!force && isCacheFresh && tree.value.length) {
        // Keep fast local render, but always revalidate once from API after cache hydration.
        if (cacheHydrated.value) {
          cacheHydrated.value = false
          void fetchTree({ force: true, background: true })
        }
        return
      }

      if (!background) {
        loading.value = true
      }

      const result = await fetchLibraryTree({ include_counts: true })

      if (isSuccess(result)) {
        const normalizedTree = ensureSystemRoots(result.data)
        tree.value = normalizedTree
        lastFetchedAt.value = Date.now()
        cacheHydrated.value = false
        error.value = null
        writeCache({ tree: normalizedTree, fetchedAt: lastFetchedAt.value })
        loading.value = false
        return
      }

      error.value = result.error
      tree.value = ensureSystemRoots(tree.value)
      loading.value = false
      if (!background) {
        toast.error('Không tải được Thư viện. [Thử lại]')
      }
    })()

    try {
      await fetchTreeInFlight
    } finally {
      fetchTreeInFlight = null
    }
  }

  async function fetchChildren(parentId: string): Promise<void> {
    const result = await fetchLibraryTree({ include_counts: true, parent_id: parentId })
    if (!isSuccess(result)) {
      toast.error(result.error)
      return
    }

    tree.value = updateNodeInTree(tree.value, parentId, (node) => ({
      ...node,
      children: result.data,
      has_more_children: false,
      total_children: result.data.length,
    }))
  }

  async function createFolder(
    name: string,
    parentId?: string | null,
  ): Promise<LibraryNode | null> {
    const trimmed = name.trim()
    if (!trimmed) {
      return null
    }

    const tempNode: LibraryNode = {
      id: `temp-${Date.now()}`,
      name: trimmed,
      type: 'folder',
      parent_id: parentId ?? null,
      children: [],
      documents_count: 0,
      status: 'approved',
      has_content: true,
      updated_at: new Date().toISOString(),
    }

    const previousTree = tree.value
    tree.value = insertNode(tree.value, tempNode)

    const result = await createLibraryFolder({
      name: trimmed,
      parent_id: parentId ?? null,
    })
    if (isSuccess(result)) {
      tree.value = replaceNode(tree.value, tempNode.id, result.data)
      return result.data
    }

    tree.value = previousTree
    toast.error(result.error)
    return null
  }

  async function createDocument(
    title: string,
    parentId?: string | null,
  ): Promise<LibraryNode | null> {
    const trimmed = title.trim()
    if (!trimmed) {
      return null
    }

    const tempNode: LibraryNode = {
      id: `temp-doc-${Date.now()}`,
      name: trimmed,
      type: 'document',
      parent_id: parentId ?? null,
      children: [],
      documents_count: 0,
      status: 'approved',
      has_content: true,
      updated_at: new Date().toISOString(),
    }

    const previousTree = tree.value
    tree.value = insertNode(tree.value, tempNode)

    const result = await createLibraryDocument({
      title: trimmed,
      parent_id: parentId ?? null,
    })

    if (!isSuccess(result)) {
      tree.value = previousTree
      toast.error(result.error)
      return null
    }

    tree.value = replaceNode(tree.value, tempNode.id, result.data)
    void fetchTree({ force: true, background: true })
    return result.data
  }

  async function removeNode(nodeId: string): Promise<void> {
    const previousTree = tree.value
    tree.value = removeNodeById(tree.value, nodeId)

    const result = await deleteLibraryNode(nodeId)
    if (!isSuccess(result)) {
      tree.value = previousTree
      toast.error(result.error)
    }
  }

  async function applyChatContext(chatId: string, nodeId: string, nodeType: LibraryNodeType): Promise<{
    node_name: string
  } | null> {
    const result = await setChatContext(chatId, { node_id: nodeId, node_type: nodeType })
    if (!isSuccess(result)) {
      toast.error(result.error)
      return null
    }
    return { node_name: result.data.node_name }
  }

  function startPollingFallback(): void {
    if (pollTimer.value !== null) {
      return
    }

    connectionStatus.value = 'polling'
    pollTimer.value = window.setInterval(() => {
      void fetchTree({ force: true, background: true })
    }, POLL_INTERVAL_MS)
  }

  function stopPollingFallback(): void {
    if (pollTimer.value !== null) {
      window.clearInterval(pollTimer.value)
      pollTimer.value = null
    }
  }

  function scheduleReconnect(): void {
    if (reconnectTimer.value !== null || realtimeConsumers.value <= 0) {
      return
    }

    reconnectTimer.value = window.setTimeout(() => {
      reconnectTimer.value = null
      initRealtime()
    }, RECONNECT_DELAY_MS)
  }

  function getWsUrl(): string {
    const fromEnv = import.meta.env.VITE_WS_BASE_URL as string | undefined
    if (fromEnv && fromEnv.trim()) {
      return `${fromEnv.replace(/\/$/, '')}/ws/library?org_id=${encodeURIComponent(orgId.value)}`
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ws/library?org_id=${encodeURIComponent(orgId.value)}`
  }

  function initRealtime(): void {
    realtimeConsumers.value += 1
    if (wsClient.value) {
      return
    }

    try {
      wsClient.value = new WebSocket(getWsUrl())
    } catch {
      connectionStatus.value = 'disconnected'
      startPollingFallback()
      scheduleReconnect()
      return
    }

    wsClient.value.onopen = () => {
      connectionStatus.value = 'connected'
      stopPollingFallback()
    }

    wsClient.value.onerror = () => {
      connectionStatus.value = 'disconnected'
      startPollingFallback()
    }

    wsClient.value.onclose = () => {
      wsClient.value = null
      connectionStatus.value = 'disconnected'
      startPollingFallback()
      scheduleReconnect()
    }

    wsClient.value.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as {
          channel?: string
          event?: string
        }

        if (!payload.channel?.startsWith('library.')) {
          return
        }

        if (payload.event && payload.event !== 'connected') {
          void fetchTree({ force: true, background: true })
        }
      } catch {
        // Ignore malformed websocket payloads.
      }
    }
  }

  function releaseRealtime(): void {
    realtimeConsumers.value = Math.max(0, realtimeConsumers.value - 1)

    if (realtimeConsumers.value > 0) {
      return
    }

    if (wsClient.value) {
      wsClient.value.close()
      wsClient.value = null
    }

    if (reconnectTimer.value !== null) {
      window.clearTimeout(reconnectTimer.value)
      reconnectTimer.value = null
    }

    stopPollingFallback()
    connectionStatus.value = 'idle'
  }

  return {
    tree,
    loading,
    error,
    connectionStatus,
    fetchTree,
    fetchChildren,
    createFolder,
    createDocument,
    removeNode,
    applyChatContext,
    initRealtime,
    releaseRealtime,
  }
})

function resolveOrgIdFromToken(): string {
  const token = localStorage.getItem('token')
  if (!token || !token.includes('.')) {
    return 'demo-org'
  }

  try {
    const [, payload] = token.split('.')
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(atob(normalized)) as { org_id?: string; orgId?: string }
    return decoded.org_id ?? decoded.orgId ?? 'demo-org'
  } catch {
    return 'demo-org'
  }
}

function updateNodeInTree(
  nodes: LibraryNode[],
  nodeId: string,
  updater: (node: LibraryNode) => LibraryNode,
): LibraryNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return updater(node)
    }

    if (!node.children.length) {
      return node
    }

    return {
      ...node,
      children: updateNodeInTree(node.children, nodeId, updater),
    }
  })
}

function insertNode(nodes: LibraryNode[], nodeToInsert: LibraryNode): LibraryNode[] {
  if (!nodeToInsert.parent_id) {
    return [...nodes, nodeToInsert]
  }

  return updateNodeInTree(nodes, nodeToInsert.parent_id, (node) => ({
    ...node,
    children: [...node.children, nodeToInsert],
    has_more_children: false,
    total_children: node.children.length + 1,
  }))
}

function replaceNode(nodes: LibraryNode[], tempId: string, realNode: LibraryNode): LibraryNode[] {
  return nodes.map((node) => {
    if (node.id === tempId) {
      return realNode
    }

    if (!node.children.length) {
      return node
    }

    return {
      ...node,
      children: replaceNode(node.children, tempId, realNode),
    }
  })
}

function removeNodeById(nodes: LibraryNode[], nodeId: string): LibraryNode[] {
  return nodes
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: removeNodeById(node.children, nodeId),
    }))
}

function ensureSystemRoots(input: LibraryNode[]): LibraryNode[] {
  const source = Array.isArray(input) ? input : []
  const companyRootFromApi = source.find((node) => node.id === COMPANY_ROOT_ID || (node.is_system && node.root_type === 'company'))
  const personalRootFromApi = source.find((node) => node.id === PERSONAL_ROOT_ID || (node.is_system && node.root_type === 'personal'))
  const sharedRootFromApi = source.find((node) => node.id === SHARED_ROOT_ID || (node.is_system && node.root_type === 'shared'))

  if (!companyRootFromApi || !personalRootFromApi || !sharedRootFromApi) {
    console.warn('[library] API tree missing system roots, fallback placeholders are being used')
  }

  const companyRoot: LibraryNode = {
    id: COMPANY_ROOT_ID,
    name: 'Tài liệu công ty',
    type: 'folder',
    parent_id: null,
    children: companyRootFromApi?.children ?? [],
    documents_count: companyRootFromApi?.documents_count ?? 0,
    status: companyRootFromApi?.status ?? 'approved',
    has_content: companyRootFromApi?.has_content ?? true,
    updated_at: companyRootFromApi?.updated_at ?? new Date().toISOString(),
    is_system: true,
    root_type: 'company',
  }

  const personalRoot: LibraryNode = {
    id: PERSONAL_ROOT_ID,
    name: 'Tài liệu cá nhân',
    type: 'folder',
    parent_id: null,
    children: personalRootFromApi?.children ?? [],
    documents_count: personalRootFromApi?.documents_count ?? 0,
    status: personalRootFromApi?.status ?? 'approved',
    has_content: personalRootFromApi?.has_content ?? true,
    updated_at: personalRootFromApi?.updated_at ?? new Date().toISOString(),
    is_system: true,
    root_type: 'personal',
  }

  const sharedRoot: LibraryNode = {
    id: SHARED_ROOT_ID,
    name: 'Tài liệu được chia sẻ với tôi',
    type: 'folder',
    parent_id: null,
    children: sharedRootFromApi?.children ?? [],
    documents_count: sharedRootFromApi?.documents_count ?? 0,
    status: sharedRootFromApi?.status ?? 'approved',
    has_content: sharedRootFromApi?.has_content ?? true,
    updated_at: sharedRootFromApi?.updated_at ?? new Date().toISOString(),
    is_system: true,
    root_type: 'shared',
  }

  const nonSystemTopLevel = source.filter((node) => !node.is_system && node.parent_id === null)
  if (nonSystemTopLevel.length > 0) {
    companyRoot.children = [...companyRoot.children, ...nonSystemTopLevel]
  }

  const trailingNodes = source.filter(
    (node) => node.id !== companyRootFromApi?.id && node.id !== personalRootFromApi?.id && node.id !== sharedRootFromApi?.id && !(node.parent_id === null && !node.is_system),
  )

  return [companyRoot, personalRoot, sharedRoot, ...trailingNodes.filter((node) => node.parent_id !== null)]
}
