<template>
  <div class="library-tree flex min-h-0 flex-1 flex-col">
    <!-- Search bar -->
    <div class="mb-3 flex items-center gap-2">
      <Input
        v-model="searchText"
        type="text"
        :placeholder="mode === 'chat' ? 'Tìm hồ sơ chat...' : 'Tìm thư viện...'"
        class="h-9"
      />
      <span
        v-if="mode === 'library'"
        class="inline-flex h-2.5 w-2.5 shrink-0 rounded-full"
        :class="connectionDotClass"
        :title="connectionLabel"
      ></span>
    </div>

    <!-- Loading skeleton -->
    <div v-if="loading && !data.length" class="space-y-2">
      <div
        v-for="i in 8"
        :key="i"
        class="h-9 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800"
      ></div>
    </div>

    <!-- Empty state when no data -->
    <div
      v-else-if="flattenedItems.length === 0"
      class="rounded-xl border border-dashed border-gray-300 p-5 text-center dark:border-gray-700"
    >
      <FolderOpen class="mx-auto h-8 w-8 text-gray-400" />
      <p class="mt-2 text-theme-sm text-gray-600 dark:text-gray-300">
        Chưa có tài liệu nào trong Thư viện.
      </p>
    </div>

    <!-- Tree list -->
    <div
      v-else
      class="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-1"
      @click.self="closeMenu"
    >
      <template
        v-for="item in flattenedItems"
        :key="getItemKey(item)"
      >
        <!-- SYSTEM ROOT NODE -->
        <div
          v-if="item.type === 'node' && item.node.is_system"
          class="group relative mb-1"
          @mouseenter="hoveredId = item.node.id"
          @mouseleave="hoveredId = null"
        >
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors"
            :class="item.node.id === selectedId
              ? 'bg-primary-50 dark:bg-primary-500/10'
              : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'"
            @click="handleSelect(item.node)"
          >
            <!-- Root icon badge -->
            <span
              class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              :class="item.node.root_type === 'company'
                ? 'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400'
                : item.node.root_type === 'shared'
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400'"
            >
              <Building2 v-if="item.node.root_type === 'company'" class="h-4 w-4" />
              <Share2 v-else-if="item.node.root_type === 'shared'" class="h-4 w-4" />
              <UserRound v-else class="h-4 w-4" />
            </span>

            <!-- Expand chevron -->
            <span
              class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-gray-400"
              @click.stop="toggleExpand(item.node)"
            >
              <ChevronRight
                class="h-3.5 w-3.5 transition-transform"
                :class="isExpanded(item.node.id) ? 'rotate-90' : ''"
              />
            </span>

            <!-- Name -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span
              class="flex-1 truncate text-[13px] font-semibold text-gray-800 dark:text-gray-100"
              v-html="highlightText(item.node.name)"
            ></span>

            <!-- Hover: only + to add child (no ...) -->
            <span
              v-if="hoveredId === item.node.id && mode === 'library'"
              class="ml-auto flex shrink-0 items-center"
              @click.stop
            >
              <button
                type="button"
                title="Thêm thư mục con"
                class="inline-flex h-6 w-6 items-center justify-center rounded-lg text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-500/20 dark:hover:text-primary-400"
                @click="startAdd(item.node.id)"
              >
                <Plus class="h-3.5 w-3.5" />
              </button>
            </span>
            <!-- badge count when not hovered -->
            <span
              v-else
              class="ml-auto shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] leading-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              {{ item.node.documents_count }}
            </span>
          </button>
        </div>

        <!-- ROOT EMPTY HINT -->
        <div
          v-else-if="item.type === 'root-empty' && mode === 'library'"
          :style="{ paddingLeft: `${8 + item.level * 16}px` }"
          class="mb-0.5 flex items-center gap-2 rounded-lg px-2 py-2"
        >
          <span class="h-4 w-4 shrink-0"></span>
          <span class="italic text-theme-xs text-gray-400 dark:text-gray-600">
            Chưa có thư mục, click
            <button
              type="button"
              class="inline-flex h-4 w-4 items-center justify-center rounded bg-gray-200 text-gray-500 hover:bg-primary-100 hover:text-primary-600 dark:bg-gray-700 dark:hover:bg-primary-500/20"
              @click="startAdd(item.rootId)"
            >
              <Plus class="h-2.5 w-2.5" />
            </button>
            để tạo.
          </span>
        </div>

        <!-- REGULAR NODE ROW -->
        <div
          v-else-if="item.type === 'node'"
          class="group relative mb-0.5"
          :class="dropTargetId === item.node.id ? 'ring-1 ring-primary-400 rounded-lg' : ''"
          @mouseenter="hoveredId = item.node.id"
          @mouseleave="onMouseLeave(item.node.id)"
          @dragover.prevent="onDragOver(item.node)"
          @dragleave="onDragLeave"
          @drop.prevent="onDrop(item.node)"
        >
          <!-- Rename inline mode -->
          <div
            v-if="renameNodeId === item.node.id"
            class="flex items-center gap-1.5 rounded-lg border border-primary-300 bg-primary-50 py-1.5 dark:bg-primary-500/10"
            :style="{ paddingLeft: `${8 + item.level * 16}px`, paddingRight: '6px' }"
          >
            <span class="h-4 w-4 shrink-0"></span>
            <Folder class="h-4 w-4 shrink-0 text-primary-500" />
            <input
              ref="renameInputRef"
              v-model="renameName"
              class="flex-1 bg-transparent text-theme-sm text-gray-800 focus:outline-none dark:text-gray-100"
              @keydown.enter.prevent="confirmRename"
              @keydown.escape="cancelRename"
            />
            <button
              type="button"
              class="inline-flex h-5 w-5 items-center justify-center rounded text-success-600 hover:bg-success-100 dark:hover:bg-success-500/20"
              @click="confirmRename"
            >
              <Check class="h-3 w-3" />
            </button>
            <button
              type="button"
              class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              @click="cancelRename"
            >
              <X class="h-3 w-3" />
            </button>
          </div>

          <!-- Normal row -->
          <button
            v-else
            type="button"
            :draggable="item.node.type === 'folder' && mode === 'library'"
            class="flex w-full items-center gap-1.5 rounded-lg py-1.5 text-left text-theme-sm transition-colors"
            :style="{ paddingLeft: `${8 + item.level * 16}px`, paddingRight: '6px' }"
            :class="rowClass(item.node)"
            @click="handleSelect(item.node)"
            @dragstart="onDragStart(item.node, $event)"
            @dragend="onDragEnd"
          >
            <!-- Expand chevron (folder only) -->
            <button
              v-if="item.node.type === 'folder'"
              type="button"
              class="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-200 dark:text-gray-500 dark:hover:bg-gray-700"
              @click.stop="toggleExpand(item.node)"
            >
              <ChevronRight
                class="h-3.5 w-3.5 transition-transform"
                :class="isExpanded(item.node.id) ? 'rotate-90' : ''"
              />
            </button>
            <span v-else class="h-4 w-4 shrink-0"></span>

            <!-- Icon -->
            <Folder
              v-if="item.node.type === 'folder'"
              class="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
            />
            <FileText v-else class="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />

            <!-- Name with search highlight -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span class="flex-1 truncate" v-html="highlightText(item.node.name)"></span>

            <!-- Hover actions (library mode) -->
            <span
              v-if="hoveredId === item.node.id && mode === 'library'"
              class="ml-auto flex shrink-0 items-center gap-0.5"
              @click.stop
            >
              <button
                v-if="item.node.type === 'folder'"
                type="button"
                title="Thêm thư mục con"
                class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-primary-100 hover:text-primary-600 dark:hover:bg-primary-500/20 dark:hover:text-primary-400"
                @click="startAdd(item.node.id)"
              >
                <Plus class="h-3 w-3" />
              </button>
              <button
                type="button"
                title="Tùy chọn"
                class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                @click="toggleMenu(item.node)"
              >
                <MoreHorizontal class="h-3 w-3" />
              </button>
            </span>

            <!-- Badge + status when not hovered -->
            <template v-else>
              <span
                v-if="item.node.type === 'folder'"
                class="ml-auto shrink-0 rounded-full bg-primary-100 px-1.5 py-0.5 text-[10px] leading-4 text-primary-700 dark:bg-primary-500/20 dark:text-primary-300"
              >
                {{ item.node.documents_count }}
              </span>
              <span
                v-if="item.node.status === 'approved'"
                class="shrink-0 text-success-500"
                title="Đã duyệt"
              >
                <CheckCircle2 class="h-3.5 w-3.5" />
              </span>
              <span
                v-else-if="item.node.status === 'pending'"
                class="shrink-0 text-warning-500"
                title="Chờ duyệt"
              >
                <Clock3 class="h-3.5 w-3.5" />
              </span>
              <span v-else class="shrink-0 text-gray-400" title="Bản nháp">
                <CircleDot class="h-3.5 w-3.5" />
              </span>
            </template>
          </button>

          <!-- Context menu (rename + delete, not for system) -->
          <div
            v-if="menuNodeId === item.node.id"
            class="absolute right-1 top-full z-20 mt-0.5 min-w-[8rem] rounded-xl border border-gray-200 bg-white py-1 shadow-theme-md dark:border-gray-700 dark:bg-gray-900"
            @click.stop
          >
            <button
              v-if="item.node.type === 'folder'"
              class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-theme-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="startRename(item.node)"
            >
              <Pencil class="h-3.5 w-3.5" />
              Đổi tên
            </button>
            <button
              class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-theme-sm text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-500/10"
              @click="handleDelete(item.node)"
            >
              <Trash2 class="h-3.5 w-3.5" />
              Xóa
            </button>
          </div>
        </div>

        <!-- INLINE CREATE FOLDER INPUT -->
        <div
          v-else-if="item.type === 'inline-input'"
          class="mb-0.5 flex items-center gap-1.5 rounded-lg bg-primary-50/70 py-1.5 ring-1 ring-primary-200 dark:bg-primary-500/10 dark:ring-primary-500/30"
          :style="{ paddingLeft: `${8 + item.level * 16}px`, paddingRight: '6px' }"
        >
          <span class="h-4 w-4 shrink-0"></span>
          <Folder class="h-4 w-4 shrink-0 text-primary-500" />
          <input
            ref="pendingInputRef"
            v-model="pendingName"
            class="flex-1 truncate bg-transparent text-theme-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-gray-100"
            placeholder="Tên thư mục..."
            @keydown.enter.prevent="confirmAdd"
            @keydown.escape="cancelAdd"
          />
          <button
            type="button"
            class="inline-flex h-5 w-5 items-center justify-center rounded text-success-600 hover:bg-success-100 dark:hover:bg-success-500/20"
            @click="confirmAdd"
          >
            <Check class="h-3 w-3" />
          </button>
          <button
            type="button"
            class="inline-flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            @click="cancelAdd"
          >
            <X class="h-3 w-3" />
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  FileText,
  Folder,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Plus,
  Share2,
  Trash2,
  UserRound,
  X,
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { useLibraryStore } from '@/stores/library'
import type { LibraryNode, LibraryRootType } from '@/types/library'

type FlatItem =
  | { type: 'node'; node: LibraryNode; level: number }
  | { type: 'inline-input'; parentId: string | null; level: number }
  | { type: 'root-empty'; rootId: string; level: number }

const WORKSPACE_ROOT = '__workspace_root__'
const SYSTEM_ROOT_ORDER: LibraryRootType[] = ['company', 'personal', 'shared']

const props = defineProps<{
  data: LibraryNode[]
  mode: 'chat' | 'library'
  selectedId?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [node: LibraryNode]
  expand: [node: LibraryNode]
  'create-folder': [payload: { name: string; parentId: string | null }]
  'delete-node': [node: LibraryNode]
  'rename-node': [payload: { node: LibraryNode; newName: string }]
  'move-node': [payload: { nodeId: string; newParentId: string }]
}>()

const libraryStore = useLibraryStore()

// Expansion state
const expanded = ref<Set<string>>(new Set())
const searchText = ref('')
const debouncedSearch = ref('')
let debounceTimer: number | null = null

// Hover / menu / inline state
const hoveredId = ref<string | null>(null)
const menuNodeId = ref<string | null>(null)
const pendingParentId = ref<string | null>(null)
const pendingName = ref('')
const pendingInputRef = ref<HTMLInputElement | null>(null)
const renameNodeId = ref<string | null>(null)
const renameName = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

// Drag-drop state
const draggedNodeId = ref<string | null>(null)
const dropTargetId = ref<string | null>(null)

// Watchers
watch(searchText, (value) => {
  if (debounceTimer !== null) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedSearch.value = value.trim().toLowerCase()
  }, 300)
})

watch(
  () => props.data,
  (nodes) => {
    const orderedNodes = orderSystemRoots(nodes)

    // Keep all system roots visible by default.
    for (const rootId of getSystemRootIds(orderedNodes)) {
      expanded.value.add(rootId)
    }

    if (expanded.value.size === 0) {
      const firstFolder = orderedNodes.find((n) => n.type === 'folder')
      if (firstFolder) expanded.value.add(firstFolder.id)
    }
  },
  { immediate: true },
)

watch(
  () => props.selectedId,
  (selectedId) => {
    if (!selectedId) return
    const path = findPathToNode(props.data, selectedId)
    for (const n of path) {
      if (n.type === 'folder') expanded.value.add(n.id)
    }
  },
  { immediate: true },
)

watch(debouncedSearch, (q) => {
  if (!q) return
  const ancestorIds = collectMatchedAncestors(props.data, q)
  for (const id of ancestorIds) expanded.value.add(id)
})

// Connection status
const connectionDotClass = computed(() => {
  if (libraryStore.connectionStatus === 'connected') return 'bg-success-500'
  if (libraryStore.connectionStatus === 'polling') return 'bg-warning-500'
  return 'bg-gray-400'
})

const connectionLabel = computed(() => {
  if (libraryStore.connectionStatus === 'connected') return 'Realtime đã kết nối'
  if (libraryStore.connectionStatus === 'polling') return 'WebSocket ngắt, đang fallback poll 30 giây'
  return 'Đang kết nối realtime'
})

// Filtered + flattened items
const orderedNodes = computed(() => orderSystemRoots(props.data))

const filteredNodes = computed(() => {
  if (!debouncedSearch.value) return orderedNodes.value
  return filterTree(orderedNodes.value, debouncedSearch.value)
})

const flattenedItems = computed(() => {
  const rootIds = getSystemRootIds(filteredNodes.value)
  const effectiveExpanded =
    pendingParentId.value && pendingParentId.value !== WORKSPACE_ROOT
      ? new Set([...expanded.value, ...rootIds, pendingParentId.value])
      : new Set([...expanded.value, ...rootIds])

  const nodes = flattenTree(filteredNodes.value, effectiveExpanded)

  // Insert root-empty and inline-input placeholders
  const result: FlatItem[] = []
  for (const n of nodes) {
    result.push({ type: 'node', ...n })

    // After an expanded system root with 0 visible children, show hint
    if (
      n.node.is_system &&
      n.node.type === 'folder' &&
      n.node.children.length === 0 &&
      !pendingParentId.value // hide hint when inline input is active for this root
    ) {
      result.push({ type: 'root-empty', rootId: n.node.id, level: n.level + 1 })
    }

    // Inline input placement
    if (pendingParentId.value && pendingParentId.value !== WORKSPACE_ROOT && n.node.id === pendingParentId.value) {
      result.push({
        type: 'inline-input',
        parentId: pendingParentId.value,
        level: n.level + 1,
      })
    }
  }

  // Workspace-root level inline input (appended at end)
  if (pendingParentId.value === WORKSPACE_ROOT) {
    result.push({ type: 'inline-input', parentId: null, level: 0 })
  }

  return result as FlatItem[]
})

// Row helpers
function rowClass(node: LibraryNode): string {
  const isSelected = node.id === props.selectedId
  const isDropTarget = dropTargetId.value === node.id

  if (isSelected) return 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
  if (isDropTarget) return 'bg-primary-50/60 text-gray-700 dark:bg-primary-500/10 dark:text-gray-300'
  return 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
}

function getItemKey(item: FlatItem): string {
  if (item.type === 'node') {
    return item.node.id
  }
  if (item.type === 'root-empty') {
    return `empty-${item.rootId}`
  }
  return `inp-${item.parentId ?? 'root'}`
}

function isExpanded(nodeId: string): boolean {
  return expanded.value.has(nodeId)
}

function toggleExpand(node: LibraryNode): void {
  if (node.is_system) {
    expanded.value.add(node.id)
    return
  }

  if (expanded.value.has(node.id)) {
    expanded.value.delete(node.id)
  } else {
    expanded.value.add(node.id)
    emit('expand', node)
  }
}

function handleSelect(node: LibraryNode): void {
  closeMenu()
  emit('select', node)
}

function onMouseLeave(nodeId: string): void {
  if (menuNodeId.value !== nodeId) hoveredId.value = null
}

function closeMenu(): void {
  menuNodeId.value = null
}

// Context menu
function toggleMenu(node: LibraryNode): void {
  menuNodeId.value = menuNodeId.value === node.id ? null : node.id
}

// Inline folder creation
function startAdd(parentId: string | null): void {
  menuNodeId.value = null
  pendingParentId.value = parentId ?? WORKSPACE_ROOT
  pendingName.value = ''
  // Auto-expand the parent
  if (parentId) expanded.value.add(parentId)
  nextTick(() => pendingInputRef.value?.focus())
}

function confirmAdd(): void {
  const name = pendingName.value.trim()
  if (!name) {
    pendingInputRef.value?.focus()
    return
  }
  const actualParentId = pendingParentId.value === WORKSPACE_ROOT ? null : pendingParentId.value
  emit('create-folder', { name, parentId: actualParentId })
  pendingParentId.value = null
  pendingName.value = ''
}

function cancelAdd(): void {
  pendingParentId.value = null
  pendingName.value = ''
}

// Rename
function startRename(node: LibraryNode): void {
  menuNodeId.value = null
  renameNodeId.value = node.id
  renameName.value = node.name
  nextTick(() => {
    if (renameInputRef.value) {
      renameInputRef.value.focus()
      renameInputRef.value.select()
    }
  })
}

function confirmRename(): void {
  const newName = renameName.value.trim()
  if (!newName || !renameNodeId.value) {
    cancelRename()
    return
  }
  const node = findNodeByIdInTree(props.data, renameNodeId.value)
  if (node) emit('rename-node', { node, newName })
  renameNodeId.value = null
  renameName.value = ''
}

function cancelRename(): void {
  renameNodeId.value = null
  renameName.value = ''
}

// Delete
function handleDelete(node: LibraryNode): void {
  menuNodeId.value = null
  emit('delete-node', node)
}

// Drag-drop
function onDragStart(node: LibraryNode, event: DragEvent): void {
  draggedNodeId.value = node.id
  event.dataTransfer?.setData('text/plain', node.id)
}

function onDragEnd(): void {
  draggedNodeId.value = null
  dropTargetId.value = null
}

function onDragOver(node: LibraryNode): void {
  if (!draggedNodeId.value) return
  if (node.type !== 'folder') return
  if (node.id === draggedNodeId.value) return
  dropTargetId.value = node.id
}

function onDragLeave(): void {
  dropTargetId.value = null
}

function onDrop(node: LibraryNode): void {
  const fromId = draggedNodeId.value
  draggedNodeId.value = null
  dropTargetId.value = null
  if (!fromId || node.type !== 'folder' || node.id === fromId) return
  emit('move-node', { nodeId: fromId, newParentId: node.id })
}

// Search highlight
function highlightText(text: string): string {
  if (!debouncedSearch.value) return escapeHtml(text)
  const lc = text.toLowerCase()
  const idx = lc.indexOf(debouncedSearch.value)
  if (idx < 0) return escapeHtml(text)
  return (
    escapeHtml(text.slice(0, idx)) +
    `<mark class="rounded bg-yellow-200 px-0.5 not-italic dark:bg-yellow-600 dark:text-white">${escapeHtml(text.slice(idx, idx + debouncedSearch.value.length))}</mark>` +
    escapeHtml(text.slice(idx + debouncedSearch.value.length))
  )
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// Tree helpers
function flattenTree(
  nodes: LibraryNode[],
  expandedSet: Set<string>,
  level = 0,
): Array<{ node: LibraryNode; level: number }> {
  const result: Array<{ node: LibraryNode; level: number }> = []
  for (const node of nodes) {
    result.push({ node, level })
    if (node.type === 'folder' && expandedSet.has(node.id) && node.children.length) {
      result.push(...flattenTree(node.children, expandedSet, level + 1))
    }
  }
  return result
}

function filterTree(nodes: LibraryNode[], query: string): LibraryNode[] {
  const result: LibraryNode[] = []
  for (const node of nodes) {
    const matchesSelf = node.name.toLowerCase().includes(query)
    const matchedChildren = node.children.length ? filterTree(node.children, query) : []
    // Always include system roots (even if no children match, they are structural)
    if (matchesSelf || matchedChildren.length || node.is_system) {
      result.push({ ...node, children: matchedChildren })
    }
  }
  return result
}

function findPathToNode(nodes: LibraryNode[], targetId: string): LibraryNode[] {
  for (const node of nodes) {
    if (node.id === targetId) return [node]
    if (node.children.length) {
      const path = findPathToNode(node.children, targetId)
      if (path.length) return [node, ...path]
    }
  }
  return []
}

function findNodeByIdInTree(nodes: LibraryNode[], id: string): LibraryNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children.length) {
      const found = findNodeByIdInTree(node.children, id)
      if (found) return found
    }
  }
  return null
}

function orderSystemRoots(nodes: LibraryNode[]): LibraryNode[] {
  const source = Array.isArray(nodes) ? nodes : []
  const rootByType = new Map<LibraryRootType, LibraryNode>()
  const nonSystemNodes: LibraryNode[] = []

  for (const node of source) {
    if (node.parent_id === null && node.is_system && node.root_type && SYSTEM_ROOT_ORDER.includes(node.root_type)) {
      if (!rootByType.has(node.root_type)) {
        rootByType.set(node.root_type, node)
      }
      continue
    }
    nonSystemNodes.push(node)
  }

  const orderedRoots = SYSTEM_ROOT_ORDER
    .map((rootType) => rootByType.get(rootType))
    .filter((node): node is LibraryNode => Boolean(node))

  return [...orderedRoots, ...nonSystemNodes]
}

function getSystemRootIds(nodes: LibraryNode[]): string[] {
  return nodes.filter((node) => node.is_system && node.type === 'folder').map((node) => node.id)
}

function collectMatchedAncestors(nodes: LibraryNode[], query: string): string[] {
  const ids: string[] = []
  function walk(list: LibraryNode[], ancestors: string[]): boolean {
    let anyMatch = false
    for (const node of list) {
      const nextAncestors = node.type === 'folder' ? [...ancestors, node.id] : ancestors
      const matches = node.name.toLowerCase().includes(query)
      const childMatch = node.children.length ? walk(node.children, nextAncestors) : false
      if (matches || childMatch) {
        ids.push(...ancestors)
        if (node.type === 'folder') ids.push(node.id)
        anyMatch = true
      }
    }
    return anyMatch
  }
  walk(nodes, [])
  return [...new Set(ids)]
}

defineExpose({ startAdd })
</script>
