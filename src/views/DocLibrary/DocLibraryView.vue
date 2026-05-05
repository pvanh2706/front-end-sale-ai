<template>
  <AdminLayout>
    <div class="flex h-full min-h-0">

      <!-- ───── Panel cây tài liệu (secondary sidebar) ───── -->
      <aside
        class="hidden md:flex w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex flex-col gap-4 p-4 overflow-y-auto flex-1 custom-scrollbar">

          <!-- Space header — generic library -->
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-400 shrink-0">
              <BookOpen class="h-5 w-5" />
            </div>
            <div class="min-w-0">
              <h2 class="truncate text-theme-sm font-semibold text-gray-900 dark:text-white">Thư viện tài liệu</h2>
              <p class="text-theme-xs text-gray-500 dark:text-gray-400">Kho tri thức nội bộ</p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            class="w-full justify-start bg-primary-500 text-white hover:bg-primary-600"
            @click="showGlobalAddFolderModal = true"
          >
            <Plus class="h-4 w-4" />
            Thêm thư mục
          </Button>

          <!-- Cây trang -->
          <div class="flex min-h-0 flex-1 flex-col">
            <LibraryTree
              ref="treeRef"
              :data="libraryStore.tree"
              :loading="libraryStore.loading"
              :selected-id="selectedLibraryNode?.id ?? null"
              mode="library"
              @select="handleTreeSelect"
              @expand="handleTreeExpand"
              @create-folder="handleCreateFolder"
              @delete-node="handleDeleteNode"
              @rename-node="handleRenameNode"
              @move-node="handleMoveNode"
            />

            <div
              v-if="libraryStore.error"
              class="mt-3 rounded-lg border border-error-500/30 bg-error-50 px-3 py-2 text-theme-xs text-error-500 dark:bg-error-500/10"
            >
              Không tải được Thư viện.
              <button type="button" class="ml-1 font-semibold underline" @click="retryFetchLibrary">Thử lại</button>
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
              class="hover:text-primary-500 transition-colors"
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
                class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-primary-100 text-theme-xs font-semibold text-primary-600 dark:border-gray-950 dark:bg-primary-500/20 dark:text-primary-400"
              >
                {{ avatar }}
              </div>
              <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-theme-xs font-semibold text-gray-600 dark:border-gray-950 dark:bg-gray-700 dark:text-gray-300">
                +{{ collaborators.length - 3 }}
              </div>
            </div>

            <Separator orientation="vertical" class="h-6 hidden sm:block" />

            <Button variant="ghost" size="sm" class="gap-1.5 text-gray-600 dark:text-gray-400" @click="openEditDialog">
              <Pencil class="h-4 w-4" />
              <span class="hidden lg:inline">Chỉnh sửa</span>
            </Button>
            <Button variant="ghost" size="sm" class="gap-1.5 text-gray-600 dark:text-gray-400" @click="openShareDialog">
              <Share2 class="h-4 w-4" />
              <span class="hidden lg:inline">Chia sẻ</span>
            </Button>
            <Button
              size="sm"
              class="bg-primary-500 text-white hover:bg-primary-600"
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
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-theme-xs font-semibold text-primary-600 dark:bg-primary-500/20 dark:text-primary-400">
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
            <Button class="gap-2 bg-primary-500 text-white hover:bg-primary-600" @click="openAddDocumentDialog">
              <Plus class="h-4 w-4" />
              Thêm tài liệu
            </Button>
          </section>

          <!-- Trang con -->
          <section class="mt-16 border-t border-gray-200 pt-8 dark:border-gray-800">
            <h3 class="mb-5 flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
              <GitBranch class="h-5 w-5 text-primary-500" />
              Trang con
            </h3>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                v-for="child in childPages"
                :key="child.id"
                type="button"
                class="group flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-primary-300 hover:bg-primary-50/50 dark:border-gray-800 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/5"
                @click="selectChildPage(child)"
              >
                <div class="shrink-0 rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors group-hover:bg-primary-100 group-hover:text-primary-500 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-primary-500/15 dark:group-hover:text-primary-400">
                  <FileText class="h-5 w-5" />
                </div>
                <div class="min-w-0">
                  <p class="truncate text-theme-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-500 dark:text-white dark:group-hover:text-primary-400">
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
                class="flex items-center gap-2 text-theme-sm text-gray-500 hover:text-primary-500 transition-colors dark:text-gray-400"
                @click="liked = !liked"
              >
                <ThumbsUp class="h-5 w-5" :class="liked ? 'text-primary-500' : ''" />
                <span>{{ liked ? 'Đã thích' : 'Thích' }}</span>
              </button>
              <button type="button" class="flex items-center gap-2 text-theme-sm text-gray-500 hover:text-primary-500 transition-colors dark:text-gray-400">
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
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-theme-sm font-semibold text-primary-600 dark:bg-primary-500/20 dark:text-primary-400">
                QT
              </div>
              <div class="flex-1">
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 focus-within:border-primary-300 focus-within:ring-1 focus-within:ring-primary-500/20 transition-all dark:border-gray-700 dark:bg-gray-900">
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
                      class="bg-primary-500 text-white hover:bg-primary-600"
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

    <!-- Share dialog -->
    <Dialog v-model:open="showShareDialog">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chia sẻ tài liệu</DialogTitle>
          <DialogDescription>Mời thành viên hoặc sao chép liên kết để chia sẻ tài liệu này.</DialogDescription>
        </DialogHeader>
        <div class="space-y-5 py-2">
          <!-- Invite by email -->
          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Mời qua email</Label>
            <div class="flex gap-2">
              <Input
                v-model="shareEmail"
                type="email"
                placeholder="tên@công-ty.com"
                class="flex-1"
                @keydown.enter="submitShareInvite"
              />
              <Select v-model="shareRole">
                <SelectTrigger class="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Xem</SelectItem>
                  <SelectItem value="editor">Sửa</SelectItem>
                  <SelectItem value="commenter">Bình luận</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="sm"
              class="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60"
              :disabled="!shareEmail.trim()"
              @click="submitShareInvite"
            >
              Gửi lời mời
            </Button>
          </div>

          <Separator />

          <!-- Copy link -->
          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Liên kết tài liệu</Label>
            <div class="flex gap-2">
              <Input
                :value="shareLink"
                readonly
                class="flex-1 bg-gray-50 text-gray-500 dark:bg-gray-900"
              />
              <Button type="button" variant="outline" class="shrink-0 gap-1.5" @click="copyShareLink">
                <component :is="shareLinkCopied ? CheckCircle2 : Copy" class="h-4 w-4" />
                {{ shareLinkCopied ? 'Đã sao chép' : 'Sao chép' }}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="showShareDialog = false">Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Share dialog -->
    <Dialog v-model:open="showShareDialog">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chia sẻ tài liệu</DialogTitle>
          <DialogDescription>Mời thành viên hoặc sao chép liên kết để chia sẻ tài liệu này.</DialogDescription>
        </DialogHeader>
        <div class="space-y-5 py-2">
          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Mời qua email</Label>
            <div class="flex gap-2">
              <Input
                v-model="shareEmail"
                type="email"
                placeholder="tên@công-ty.com"
                class="flex-1"
                @keydown.enter="submitShareInvite"
              />
              <Select v-model="shareRole">
                <SelectTrigger class="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Xem</SelectItem>
                  <SelectItem value="editor">Sửa</SelectItem>
                  <SelectItem value="commenter">Bình luận</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="sm"
              class="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60"
              :disabled="!shareEmail.trim()"
              @click="submitShareInvite"
            >
              Gửi lời mời
            </Button>
          </div>

          <Separator />

          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Liên kết tài liệu</Label>
            <div class="flex gap-2">
              <Input
                :value="shareLink"
                readonly
                class="flex-1 bg-gray-50 text-gray-500 dark:bg-gray-900"
              />
              <Button type="button" variant="outline" class="shrink-0 gap-1.5" @click="copyShareLink">
                <component :is="shareLinkCopied ? CheckCircle2 : Copy" class="h-4 w-4" />
                {{ shareLinkCopied ? 'Đã sao chép' : 'Sao chép' }}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="showShareDialog = false">Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit dialog -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
          <DialogDescription>Cập nhật thông tin tài liệu đang xem.</DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2">
          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</Label>
            <Input
              v-model="editTitle"
              type="text"
              placeholder="Nhập tiêu đề tài liệu"
            />
          </div>
          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</Label>
            <Select v-model="editStatus">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" @click="showEditDialog = false">Hủy</Button>
          <Button
            type="button"
            class="bg-primary-500 text-white hover:bg-primary-600"
            @click="submitEdit"
          >
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showAddDocumentDialog">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm tài liệu</DialogTitle>
          <DialogDescription>
            Nhập tiêu đề tài liệu để thêm vào thư mục đang chọn.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-2">
            <label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề tài liệu</label>
            <Input
              v-model="newDocumentTitle"
              type="text"
              placeholder="Ví dụ: Quy trình onboarding 2026"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="showAddDocumentDialog = false">Hủy</Button>
          <Button
            type="button"
            :class="[
              'disabled:bg-primary-200 disabled:text-primary-500',
              hasNewDocumentTitle
                ? 'bg-primary-900 text-white hover:bg-primary-900 shadow-theme-sm'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200',
            ]"
            :disabled="isCreatingDocument"
            @click="submitNewDocument"
          >
            {{ isCreatingDocument ? 'Đang upload...' : 'Thêm tài liệu' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </AdminLayout>

  <!-- ── Global "Thêm thư mục" modal ── -->
  <Dialog v-model:open="showGlobalAddFolderModal">
    <DialogContent class="sm:max-w-sm">
      <DialogHeader>
        <DialogTitle>Thêm thư mục</DialogTitle>
        <DialogDescription>
          Tạo thư mục mới trong Tài liệu công ty hoặc Tài liệu cá nhân.
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4 py-2">
        <div class="space-y-2">
          <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Tên thư mục</Label>
          <Input
            v-model="globalNewFolderName"
            type="text"
            placeholder="Ví dụ: Quy trình bán hàng"
            @keydown.enter="submitGlobalNewFolder"
          />
        </div>
        <div class="space-y-2">
          <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Tạo trong</Label>
          <Select v-model="globalNewFolderWorkspace">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">
                <span class="flex items-center gap-2">
                  <Building2 class="h-4 w-4 text-primary-500" />
                  Tài liệu công ty
                </span>
              </SelectItem>
              <SelectItem value="personal">
                <span class="flex items-center gap-2">
                  <UserRound class="h-4 w-4 text-violet-500" />
                  Tài liệu cá nhân
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" @click="showGlobalAddFolderModal = false">Hủy</Button>
        <Button
          type="button"
          :disabled="!globalNewFolderName.trim() || isCreatingGlobalFolder"
          class="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60"
          @click="submitGlobalNewFolder"
        >
          {{ isCreatingGlobalFolder ? 'Đang tạo...' : 'Tạo thư mục' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import {
  Bold,
  Copy,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
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
  ThumbsUp,
  Trash2,
  UserRound,
  UserPlus,
} from 'lucide-vue-next'

import AdminLayout from '@/components/layout/AdminLayout.vue'
import LibraryTree from '@/components/library/LibraryTree.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useLibraryStore } from '@/stores/library'
import type { LibraryNode, LibraryRootType } from '@/types/library'

// ─── Types ───────────────────────────────────────────────────

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
const emptyDescription = 'Chọn thư mục trong cây bên trái hoặc tạo tài liệu mới.'

function goLibrarySection(type: 'company' | 'personal') {
  router.push(type === 'company' ? '/doc-library/company' : '/doc-library/personal')
}

const footerNav = [
  { label: 'Trung tâm hỗ trợ', icon: HelpCircle },
  { label: 'Thùng rác', icon: Trash2 },
]

interface LibraryCaseConfig {
  breadcrumbs: string[]
  collaborators: string[]
  currentPage: PageInfo
  childPages: ChildPage[]
}

const companyCase: LibraryCaseConfig = {
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

const libraryStore = useLibraryStore()
const selectedLibraryNode = ref<LibraryNode | null>(null)
const showAddDocumentDialog = ref(false)
const treeRef = ref<InstanceType<typeof LibraryTree> | null>(null)
const newDocumentTitle = ref('')
const isCreatingDocument = ref(false)
const latestCreatedDocumentId = ref<string | null>(null)
const isAddDocumentButtonEmphasized = ref(false)
const hasNewDocumentTitle = computed(() => newDocumentTitle.value.trim().length > 0)

// ─── Share dialog ─────────────────────────────────────────────
const showShareDialog = ref(false)
const shareEmail = ref('')
const shareRole = ref<'viewer' | 'editor' | 'commenter'>('viewer')
const shareLink = computed(() => `${window.location.origin}/doc-library?doc=${encodeURIComponent(currentPage.value.title)}`)
const shareLinkCopied = ref(false)

function openShareDialog(): void {
  shareEmail.value = ''
  shareRole.value = 'viewer'
  shareLinkCopied.value = false
  showShareDialog.value = true
}

function submitShareInvite(): void {
  if (!shareEmail.value.trim()) return
  toast.success(`Đã gửi lời mời tới ${shareEmail.value.trim()}`)
  shareEmail.value = ''
}

async function copyShareLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    shareLinkCopied.value = true
    setTimeout(() => { shareLinkCopied.value = false }, 2000)
  } catch {
    toast.error('Không thể sao chép liên kết')
  }
}

// ─── Edit dialog ─────────────────────────────────────────────
const showEditDialog = ref(false)
const editTitle = ref('')
const editStatus = ref<'approved' | 'pending' | 'draft'>('approved')

function openEditDialog(): void {
  editTitle.value = currentPage.value.title
  const s = currentPage.value.status
  editStatus.value = s === 'Đã duyệt' ? 'approved' : s === 'Chờ duyệt' ? 'pending' : 'draft'
  showEditDialog.value = true
}

function submitEdit(): void {
  const title = editTitle.value.trim()
  if (!title) {
    toast.error('Tiêu đề không được để trống')
    return
  }
  const statusLabel = editStatus.value === 'approved' ? 'Đã duyệt' : editStatus.value === 'pending' ? 'Chờ duyệt' : 'Bản nháp'
  currentPage.value = { ...currentPage.value, title, status: statusLabel }
  if (selectedLibraryNode.value) {
    selectedLibraryNode.value = { ...selectedLibraryNode.value, name: title }
  }
  showEditDialog.value = false
  toast.success('Đã cập nhật tài liệu')
}

// ─── Global add folder modal ──────────────────────────────────
const showGlobalAddFolderModal = ref(false)
const globalNewFolderName = ref('')
const globalNewFolderWorkspace = ref<LibraryRootType>('company')
const isCreatingGlobalFolder = ref(false)

const breadcrumbs = computed(() => {
  if (selectedLibraryNode.value) {
    return ['Thư viện tài liệu', selectedLibraryNode.value.name]
  }
  return ['Thư viện tài liệu']
})

const collaborators = ref<string[]>([])
const currentPage = ref<PageInfo>({
  title: '',
  author: '',
  date: '',
  status: '',
})
const childPages = ref<ChildPage[]>([])

function applyLibraryCase(config: LibraryCaseConfig) {
  collaborators.value = [...config.collaborators]
  currentPage.value = { ...config.currentPage }
  childPages.value = [...config.childPages]
}

applyLibraryCase(companyCase)

onMounted(() => {
  void libraryStore.fetchTree()
  libraryStore.initRealtime()
})

onUnmounted(() => {
  libraryStore.releaseRealtime()
})

function handleTreeSelect(node: LibraryNode): void {
  selectedLibraryNode.value = node
  currentPage.value = {
    ...currentPage.value,
    title: node.name,
  }
}

function handleTreeExpand(node: LibraryNode): void {
  if (node.type === 'folder' && node.has_more_children) {
    void libraryStore.fetchChildren(node.id)
  }
}

function openAddDocumentDialog(): void {
  if (isAddDocumentButtonEmphasized.value && latestCreatedDocumentId.value) {
    const targetNode = findNodeById(libraryStore.tree, latestCreatedDocumentId.value)
    if (targetNode) {
      selectedLibraryNode.value = targetNode
      currentPage.value = {
        ...currentPage.value,
        title: targetNode.name,
      }
      isAddDocumentButtonEmphasized.value = false
      return
    }
  }

  showAddDocumentDialog.value = true
}

async function submitNewDocument(): Promise<void> {
  const title = newDocumentTitle.value.trim()

  if (!title) {
    toast.error('Vui lòng nhập tiêu đề tài liệu')
    return
  }

  const parentId = selectedLibraryNode.value?.type === 'folder'
    ? selectedLibraryNode.value.id
    : selectedLibraryNode.value?.parent_id ?? null

  isCreatingDocument.value = true

  try {
    const node = await libraryStore.createDocument(title, parentId)
    if (!node) {
      return
    }

    selectedLibraryNode.value = node
    currentPage.value = {
      ...currentPage.value,
      title: node.name,
    }
    latestCreatedDocumentId.value = node.id
    isAddDocumentButtonEmphasized.value = true

    showAddDocumentDialog.value = false
    newDocumentTitle.value = ''
    toast.success('Đã thêm tài liệu thành công')
  } finally {
    isCreatingDocument.value = false
  }
}

function retryFetchLibrary(): void {
  void libraryStore.fetchTree({ force: true })
}

function addFolderAtRoot(): void {
  treeRef.value?.startAdd(null)
}

async function handleCreateFolder(payload: { name: string; parentId: string | null }): Promise<void> {
  const folder = await libraryStore.createFolder(payload.name, payload.parentId)
  if (folder) {
    selectedLibraryNode.value = folder
    toast.success('Đã thêm thư mục thành công')
  }
}

function handleDeleteNode(node: LibraryNode): void {
  if (node.is_system) {
    toast.error('Không thể xóa thư mục hệ thống')
    return
  }
  void libraryStore.removeNode(node.id).then(() => {
    if (selectedLibraryNode.value?.id === node.id) {
      selectedLibraryNode.value = null
    }
    toast.success('Đã xóa thành công')
  })
}

function handleRenameNode(_payload: { node: LibraryNode; newName: string }): void {
  toast.info('Tính năng đổi tên sẽ sớm ra mắt')
}

function handleMoveNode(_payload: { nodeId: string; newParentId: string }): void {
  toast.info('Tính năng di chuyển thư mục sẽ sớm ra mắt')
}

async function submitGlobalNewFolder(): Promise<void> {
  const name = globalNewFolderName.value.trim()
  if (!name) return

  // Resolve parent: root folder of the chosen workspace
  const rootId = globalNewFolderWorkspace.value === 'company' ? 'company-root' : 'personal-root'

  isCreatingGlobalFolder.value = true
  try {
    const folder = await libraryStore.createFolder(name, rootId)
    if (folder) {
      selectedLibraryNode.value = folder
      showGlobalAddFolderModal.value = false
      globalNewFolderName.value = ''
      toast.success('Đã tạo thư mục thành công')
    }
  } finally {
    isCreatingGlobalFolder.value = false
  }
}


// ─── Toolbar ─────────────────────────────────────────────────

function handleSave() {
  toast.success('Đã lưu tài liệu')
}

// ─── Page content ────────────────────────────────────────────

function selectChildPage(child: ChildPage) {
  currentPage.value = {
    title: child.title,
    author: companyCase.currentPage.author,
    date: companyCase.currentPage.date,
    status: companyCase.currentPage.status,
  }
  selectedLibraryNode.value = {
    id: `preview-${child.id}`,
    name: child.title,
    type: 'document',
    parent_id: null,
    children: [],
    documents_count: 0,
    status: 'approved',
    has_content: true,
    updated_at: new Date().toISOString(),
  }
}

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

function findNodeById(nodes: LibraryNode[], targetId: string): LibraryNode | null {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node
    }

    if (node.children.length) {
      const found = findNodeById(node.children, targetId)
      if (found) {
        return found
      }
    }
  }

  return null
}
</script>
