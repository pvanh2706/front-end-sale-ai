<template>
  <AdminLayout>
    <div class="flex h-full min-h-0">

      <!-- ───── Panel cây tài liệu (secondary sidebar) ───── -->
      <aside
        class="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-6 p-4 overflow-y-auto flex-1 custom-scrollbar">

          <!-- Space header -->
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400 shrink-0">
              <component :is="libraryIcon" class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <h2 class="truncate text-theme-sm font-semibold text-gray-900 dark:text-white">{{ libraryTitle }}</h2>
              <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ librarySubtitle }}</p>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800/70">
            <button
              type="button"
              class="w-full rounded-lg px-3 py-2 text-left text-theme-sm transition-colors"
              :class="!isPersonalLibrary
                ? 'bg-brand-50 font-semibold text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'"
              @click="goLibrarySection('company')"
            >
              Tài liệu công ty
            </button>
            <button
              type="button"
              class="mt-1 w-full rounded-lg px-3 py-2 text-left text-theme-sm transition-colors"
              :class="isPersonalLibrary
                ? 'bg-brand-50 font-semibold text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5'"
              @click="goLibrarySection('personal')"
            >
              Tài liệu cá nhân
            </button>
          </div>

          <!-- Cây trang -->
          <div class="flex flex-col gap-1">
            <div v-for="node in pageTree" :key="node.id" class="flex flex-col">
              <!-- Level 1 -->
              <button
                type="button"
                class="flex items-center gap-1.5 rounded px-3 py-1.5 text-theme-sm text-gray-700 hover:bg-gray-200/60 dark:text-gray-300 dark:hover:bg-white/5 w-full text-left"
                @click="toggleNode(node.id)"
              >
                <ChevronDown
                  class="h-4 w-4 shrink-0 text-gray-400 transition-transform"
                  :class="expandedNodes.includes(node.id) ? '' : '-rotate-90'"
                />
                <span class="truncate">{{ node.label }}</span>
              </button>

              <!-- Level 2 -->
              <div v-if="expandedNodes.includes(node.id)" class="ml-4 flex flex-col border-l border-gray-200 dark:border-gray-700 mt-1">
                <div v-for="child in node.children" :key="child.id" class="flex flex-col">
                  <button
                    type="button"
                    class="flex items-center gap-1.5 rounded px-3 py-1.5 text-theme-sm w-full text-left transition-colors"
                    :class="activePageId === child.id
                      ? 'font-semibold text-brand-500 dark:text-brand-400'
                      : 'text-gray-700 hover:bg-gray-200/60 dark:text-gray-300 dark:hover:bg-white/5'"
                    @click="selectPage(child)"
                  >
                    <ChevronDown
                      v-if="child.children?.length"
                      class="h-4 w-4 shrink-0 text-gray-400 transition-transform"
                      :class="expandedNodes.includes(child.id) ? '' : '-rotate-90'"
                      @click.stop="toggleNode(child.id)"
                    />
                    <ChevronRight v-else class="h-4 w-4 shrink-0 text-gray-300" />
                    <span class="truncate">{{ child.label }}</span>
                  </button>

                  <!-- Level 3 -->
                  <div v-if="child.children?.length && expandedNodes.includes(child.id)"
                    class="ml-4 flex flex-col border-l border-gray-200 dark:border-gray-700 mt-1"
                  >
                    <div v-for="grandchild in child.children" :key="grandchild.id" class="flex flex-col">
                      <button
                        type="button"
                        class="flex items-center gap-1.5 rounded px-3 py-1.5 text-theme-sm text-gray-600 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-white/5 w-full text-left"
                        @click="toggleNode(grandchild.id)"
                      >
                        <ChevronDown
                          v-if="grandchild.children?.length"
                          class="h-4 w-4 shrink-0 text-gray-400 transition-transform"
                          :class="expandedNodes.includes(grandchild.id) ? '' : '-rotate-90'"
                        />
                        <ChevronRight v-else class="h-4 w-4 shrink-0 text-gray-300" />
                        <span class="truncate">{{ grandchild.label }}</span>
                      </button>

                      <!-- Level 4 -->
                      <div v-if="grandchild.children?.length && expandedNodes.includes(grandchild.id)"
                        class="ml-4 flex flex-col border-l border-gray-200 dark:border-gray-700 mt-1"
                      >
                        <button
                          v-for="leaf in grandchild.children"
                          :key="leaf.id"
                          type="button"
                          class="flex items-center gap-1.5 rounded px-3 py-1.5 text-theme-sm text-gray-500 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-white/5 w-full text-left"
                        >
                          <StickyNote class="h-4 w-4 shrink-0 text-gray-300" />
                          <span class="truncate">{{ leaf.label }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer panel -->
        <div class="border-t border-gray-200 dark:border-gray-800 p-3 flex flex-col gap-1">
          <button
            v-for="foot in footerNav"
            :key="foot.label"
            type="button"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-theme-sm text-gray-600 hover:bg-gray-200/60 dark:text-gray-400 dark:hover:bg-white/5 w-full text-left transition-colors"
          >
            <component :is="foot.icon" class="h-4 w-4 shrink-0" />
            <span>{{ foot.label }}</span>
          </button>
          <Button
            variant="outline"
            class="mt-2 w-full gap-2 text-theme-sm"
          >
            <UserPlus class="h-4 w-4" />
            Mời thành viên
          </Button>
        </div>
      </aside>

      <!-- ───── Vùng nội dung chính ───── -->
      <main class="flex flex-1 flex-col overflow-y-auto bg-white dark:bg-gray-950">

        <!-- Toolbar -->
        <header class="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white/90 px-6 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
          <nav class="flex items-center gap-1.5 text-theme-xs text-gray-500 dark:text-gray-400">
            <button
              v-for="(crumb, i) in breadcrumbs"
              :key="i"
              type="button"
              class="hover:text-brand-500 transition-colors"
              :class="i === breadcrumbs.length - 1 ? 'font-semibold text-gray-900 dark:text-white' : ''"
            >
              {{ crumb }}
            </button>
            <ChevronRight v-if="breadcrumbs.length > 1" class="h-3 w-3 mx-0.5 shrink-0" />
          </nav>

          <div class="flex items-center gap-2">
            <!-- Cộng tác viên -->
            <div class="hidden sm:flex items-center -space-x-2 mr-1">
              <div
                v-for="(avatar, i) in collaborators.slice(0, 3)"
                :key="i"
                class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-theme-xs font-semibold text-brand-600 dark:border-gray-950 dark:bg-brand-500/20 dark:text-brand-400"
              >
                {{ avatar }}
              </div>
              <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-theme-xs font-semibold text-gray-600 dark:border-gray-950 dark:bg-gray-700 dark:text-gray-300">
                +{{ collaborators.length - 3 }}
              </div>
            </div>

            <Separator orientation="vertical" class="h-6 hidden sm:block" />

            <Button variant="ghost" size="sm" class="gap-1.5 text-gray-600 dark:text-gray-400">
              <Pencil class="h-4 w-4" />
              <span class="hidden lg:inline">Chỉnh sửa</span>
            </Button>
            <Button variant="ghost" size="sm" class="gap-1.5 text-gray-600 dark:text-gray-400">
              <Share2 class="h-4 w-4" />
              <span class="hidden lg:inline">Chia sẻ</span>
            </Button>
            <Button
              size="sm"
              class="bg-brand-500 text-white hover:bg-brand-600"
              @click="handleSave"
            >
              Lưu
            </Button>
            <Button variant="ghost" size="icon-sm" class="text-gray-500">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </div>
        </header>

        <!-- Bài viết -->
        <article class="mx-auto w-full max-w-4xl flex-1 px-6 py-12">

          <!-- Tiêu đề & meta -->
          <header class="mb-10">
            <h1 class="mb-5 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              {{ currentPage.title }}
            </h1>
            <div class="flex flex-wrap items-center gap-5 text-theme-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-theme-xs font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                  {{ currentPage.author.slice(0, 1) }}
                </div>
                <span>Cập nhật bởi <strong class="text-gray-900 dark:text-white">{{ currentPage.author }}</strong></span>
              </div>
              <div class="flex items-center gap-1.5">
                <Calendar class="h-4 w-4" />
                <span>{{ currentPage.date }}</span>
              </div>
              <Badge
                class="gap-1 bg-success-50 text-success-500 dark:bg-success-500/10 dark:text-success-400"
              >
                <CheckCircle2 class="h-3.5 w-3.5" />
                {{ currentPage.status }}
              </Badge>
            </div>
          </header>

          <!-- Empty state -->
          <section class="flex flex-col items-center justify-center py-16 text-center">
            <div class="mb-6 flex h-52 w-52 items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <FileText class="h-20 w-20 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Trang này chưa có nội dung</h2>
            <p class="mb-8 max-w-md text-theme-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ emptyDescription }}
            </p>
            <Button class="gap-2 bg-brand-500 text-white hover:bg-brand-600">
              <Plus class="h-4 w-4" />
              Thêm nội dung đầu tiên
            </Button>
          </section>

          <!-- Trang con -->
          <section class="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800">
            <h3 class="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <GitBranch class="h-5 w-5 text-brand-500" />
              Trang con
            </h3>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                v-for="child in childPages"
                :key="child.id"
                type="button"
                class="group flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50 dark:border-gray-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
                @click="selectChildPage(child)"
              >
                <div class="shrink-0 rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-500 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400">
                  <FileText class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-theme-sm font-semibold text-gray-900 transition-colors group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
                    {{ child.title }}
                  </p>
                  <p class="mt-0.5 line-clamp-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    {{ child.excerpt }}
                  </p>
                </div>
              </button>
            </div>
          </section>

          <!-- Footer bài viết -->
          <footer class="mt-16 border-t border-gray-200 pt-10 dark:border-gray-800">
            <!-- Like / Comment / View -->
            <div class="mb-8 flex items-center gap-6">
              <button
                type="button"
                class="flex items-center gap-2 text-theme-sm text-gray-500 hover:text-brand-500 transition-colors dark:text-gray-400"
                @click="liked = !liked"
              >
                <ThumbsUp class="h-5 w-5" :class="liked ? 'text-brand-500' : ''" />
                <span>{{ liked ? 'Đã thích' : 'Thích' }}</span>
              </button>
              <button type="button" class="flex items-center gap-2 text-theme-sm text-gray-500 hover:text-brand-500 transition-colors dark:text-gray-400">
                <MessageSquare class="h-5 w-5" />
                <span>{{ commentCount }} bình luận</span>
              </button>
              <span class="flex items-center gap-2 text-theme-sm text-gray-500 dark:text-gray-400">
                <Eye class="h-5 w-5" />
                <span>{{ viewCount }} lượt xem</span>
              </span>
            </div>

            <!-- Ô bình luận -->
            <div class="flex gap-4">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-theme-sm font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                QT
              </div>
              <div class="flex-1">
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 focus-within:border-brand-300 focus-within:ring-1 focus-within:ring-brand-500/20 transition-all dark:border-gray-700 dark:bg-gray-900">
                  <Textarea
                    v-model="commentText"
                    :rows="3"
                    placeholder="Viết bình luận của bạn..."
                    class="bg-transparent border-none shadow-none focus-visible:ring-0 resize-none p-0 text-theme-sm text-gray-700 dark:text-gray-200"
                  />
                  <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-gray-400">
                      <button type="button" class="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Bold class="h-4 w-4" />
                      </button>
                      <button type="button" class="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Italic class="h-4 w-4" />
                      </button>
                      <button type="button" class="rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <Paperclip class="h-4 w-4" />
                      </button>
                    </div>
                    <Button
                      size="sm"
                      class="bg-brand-500 text-white hover:bg-brand-600"
                      :disabled="!commentText.trim()"
                      @click="handleSendComment"
                    >
                      Gửi bình luận
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import {
  Bold,
  Building2,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  FileText,
  GitBranch,
  HelpCircle,
  Italic,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Pencil,
  Plus,
  Share2,
  StickyNote,
  ThumbsUp,
  Trash2,
  UserRound,
  UserPlus,
} from 'lucide-vue-next'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

// ─── Types ───────────────────────────────────────────────────

interface TreeNode {
  id: number
  label: string
  children?: TreeNode[]
}

interface ChildPage {
  id: number
  title: string
  excerpt: string
}

interface PageInfo {
  title: string
  author: string
  date: string
  status: string
}

const route = useRoute()
const router = useRouter()
const isPersonalLibrary = computed(() => route.path === '/doc-library/personal')
const libraryTitle = computed(() =>
  isPersonalLibrary.value ? 'Tài liệu cá nhân' : 'Tài liệu công ty',
)
const librarySubtitle = computed(() =>
  isPersonalLibrary.value ? 'Không gian riêng của bạn' : 'Kho tri thức nội bộ',
)
const libraryIcon = computed(() => (isPersonalLibrary.value ? UserRound : Building2))
const emptyDescription = computed(() =>
  isPersonalLibrary.value
    ? 'Tạo ghi chú cá nhân đầu tiên của bạn hoặc chọn một thư mục con để tiếp tục làm việc.'
    : 'Bắt đầu xây dựng kho tài liệu công ty bằng cách thêm nội dung mới hoặc chọn từ các trang con bên dưới.',
)

function goLibrarySection(type: 'company' | 'personal') {
  router.push(type === 'company' ? '/doc-library/company' : '/doc-library/personal')
}

const footerNav = [
  { label: 'Trung tâm hỗ trợ', icon: HelpCircle },
  { label: 'Thùng rác', icon: Trash2 },
]

interface LibraryCaseConfig {
  pageTree: TreeNode[]
  expandedNodes: number[]
  activePageId: number | null
  breadcrumbs: string[]
  collaborators: string[]
  currentPage: PageInfo
  childPages: ChildPage[]
}

const companyCase: LibraryCaseConfig = {
  pageTree: [
    {
      id: 1,
      label: '1. Quy trình vận hành',
      children: [
        {
          id: 11,
          label: '1.2. Tài liệu ISO/IEC 27001:2022',
          children: [
            {
              id: 111,
              label: 'Chính sách bảo mật',
            },
            {
              id: 112,
              label: 'Quản lý rủi ro',
              children: [
                { id: 1121, label: 'Biểu mẫu đánh giá' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: '2. Hướng dẫn sử dụng',
      children: [
        { id: 21, label: '2.1. Onboarding nhân viên' },
        { id: 22, label: '2.2. Quy trình bán hàng' },
      ],
    },
  ],
  expandedNodes: [1, 11],
  activePageId: 11,
  breadcrumbs: ['Thư viện tài liệu', 'Tài liệu công ty'],
  collaborators: ['NA', 'MB', 'VC', 'TD', 'PH'],
  currentPage: {
    title: '1.2. Tài liệu ISO/IEC 27001:2022',
    author: 'Nguyễn Văn A',
    date: '24 thg 5, 2024',
    status: 'Đã duyệt',
  },
  childPages: [
    {
      id: 1,
      title: '01. Chính sách Hệ thống QLTT',
      excerpt: 'Các quy định chung về bảo mật và vận hành...',
    },
    {
      id: 2,
      title: '02. Phạm vi áp dụng ISO',
      excerpt: 'Xác định ranh giới và khả năng áp dụng của hệ thống...',
    },
    {
      id: 3,
      title: '03. Đánh giá rủi ro bảo mật',
      excerpt: 'Quy trình nhận diện và xử lý rủi ro ATTT...',
    },
  ],
}

const personalCase: LibraryCaseConfig = {
  pageTree: [
    {
      id: 101,
      label: '1. Công việc cá nhân',
      children: [
        { id: 111, label: '1.1. Kế hoạch quý Q2' },
        {
          id: 112,
          label: '1.2. Mục tiêu học tập',
          children: [
            { id: 1121, label: 'Lộ trình AI cho Sales' },
            { id: 1122, label: 'Checklist thực hành hàng tuần' },
          ],
        },
      ],
    },
    {
      id: 102,
      label: '2. Tài liệu tham khảo',
      children: [
        { id: 121, label: '2.1. Ghi chú webinar' },
        { id: 122, label: '2.2. Tài liệu self-learning' },
      ],
    },
  ],
  expandedNodes: [101, 112],
  activePageId: 111,
  breadcrumbs: ['Thư viện tài liệu', 'Tài liệu cá nhân'],
  collaborators: ['QT', 'NA', 'LP', 'HN'],
  currentPage: {
    title: '1.1. Kế hoạch quý Q2',
    author: 'Bạn',
    date: '02 thg 5, 2026',
    status: 'Bản nháp',
  },
  childPages: [
    {
      id: 101,
      title: '01. Checklist công việc tuần',
      excerpt: 'Danh sách đầu việc cá nhân cần theo dõi trong tuần...',
    },
    {
      id: 102,
      title: '02. Ghi chú buổi họp 1:1',
      excerpt: 'Tổng hợp ý chính và action items sau buổi họp...',
    },
    {
      id: 103,
      title: '03. Mẫu email chăm sóc khách hàng',
      excerpt: 'Mẫu email theo từng tình huống chăm sóc sau bán...',
    },
  ],
}

// ─── Page tree ───────────────────────────────────────────────

const pageTree = ref<TreeNode[]>([])
const expandedNodes = ref<number[]>([])
const activePageId = ref<number | null>(null)
const breadcrumbs = ref<string[]>([])
const collaborators = ref<string[]>([])
const currentPage = ref<PageInfo>({
  title: '',
  author: '',
  date: '',
  status: '',
})
const childPages = ref<ChildPage[]>([])

function applyLibraryCase(config: LibraryCaseConfig) {
  pageTree.value = config.pageTree
  expandedNodes.value = [...config.expandedNodes]
  activePageId.value = config.activePageId
  breadcrumbs.value = [...config.breadcrumbs]
  collaborators.value = [...config.collaborators]
  currentPage.value = { ...config.currentPage }
  childPages.value = [...config.childPages]
}

applyLibraryCase(isPersonalLibrary.value ? personalCase : companyCase)

function toggleNode(id: number) {
  const idx = expandedNodes.value.indexOf(id)
  if (idx >= 0) {
    expandedNodes.value.splice(idx, 1)
  } else {
    expandedNodes.value.push(id)
  }
}

function selectPage(node: TreeNode) {
  activePageId.value = node.id
}

// ─── Toolbar ─────────────────────────────────────────────────

function handleSave() {
  toast.success('Đã lưu tài liệu')
}

// ─── Page content ────────────────────────────────────────────

function selectChildPage(child: ChildPage) {
  const activeCase = isPersonalLibrary.value ? personalCase : companyCase
  currentPage.value = {
    title: child.title,
    author: activeCase.currentPage.author,
    date: activeCase.currentPage.date,
    status: activeCase.currentPage.status,
  }
  breadcrumbs.value = [activeCase.breadcrumbs[0], child.title]
}

watch(isPersonalLibrary, (value: boolean) => {
  applyLibraryCase(value ? personalCase : companyCase)
})

// ─── Footer ──────────────────────────────────────────────────

const liked = ref(false)
const commentCount = ref(12)
const viewCount = ref(245)
const commentText = ref('')

function handleSendComment() {
  if (!commentText.value.trim()) return
  commentCount.value++
  commentText.value = ''
  toast.success('Đã gửi bình luận')
}
</script>
