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
              @permissions="handleNodePermissions"
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
            <Button variant="ghost" size="sm" class="gap-1.5 text-gray-600 dark:text-gray-400" @click="openEditDialog">
              <Pencil class="h-4 w-4" />
              <span class="hidden lg:inline">Chỉnh sửa</span>
            </Button>
            <div
              v-if="currentRootType === 'company'"
              class="hidden items-center gap-1.5 rounded-full border border-success-200 bg-success-50 px-3 py-1 text-theme-xs font-medium text-success-700 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400 lg:flex"
            >
              <CheckCircle2 class="h-3.5 w-3.5" />
              Đã phê duyệt &amp; ban hành
            </div>
            <Button
              size="sm"
              class="bg-primary-500 text-white hover:bg-primary-600"
              @click="handleSave"
            >
              Lưu
            </Button>
          </div>
        </header>

        <!-- Bài viết -->
        <article class="mx-auto w-full max-w-4xl flex-1 px-6 py-12">

          <!-- Tiêu đề & meta -->
          <header v-if="selectedLibraryNode" class="mb-10">
            <h1 class="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              {{ selectedLibraryNode.name }}
            </h1>
            <div v-if="currentPage.date" class="flex items-center gap-1.5 text-theme-sm text-gray-500 dark:text-gray-400">
              <Calendar class="h-4 w-4" />
              <span>Cập nhật: {{ currentPage.date }}</span>
            </div>
          </header>

          <!-- ── File viewer (khi tài liệu đã được upload) ──────────────────── -->
          <section
            v-if="selectedLibraryNode?.type === 'document' && currentFileUrl"
            class="mb-10 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
          >
            <!-- Image viewer -->
            <template v-if="currentFileMime?.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(currentFileUrl ?? '')">
              <img
                :src="currentFileUrl!"
                :alt="selectedLibraryNode!.name"
                class="max-h-[640px] w-full object-contain bg-gray-100 dark:bg-gray-900"
              />
            </template>
            <!-- PDF inline viewer -->
            <template v-else-if="currentFileMime === 'application/pdf' || /\.pdf$/i.test(currentFileUrl ?? '')">
              <iframe
                :src="currentFileUrl!"
                class="h-[700px] w-full border-0"
                title="PDF viewer"
              />
            </template>
            <!-- Other: download card -->
            <template v-else>
              <div class="flex flex-col items-center justify-center gap-5 py-16 bg-gray-50 dark:bg-gray-900">
                <div class="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <FileText class="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <div class="text-center space-y-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ selectedLibraryNode!.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Tệp đã được lưu trữ trên máy chủ</p>
                </div>
                <a
                  :href="currentFileUrl!"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors shadow-sm"
                >
                  <Download class="h-4 w-4" />
                  Tải xuống / Xem tệp
                </a>
              </div>
            </template>
          </section>

          <!-- Folder contents (has children) -->
          <section
            v-if="selectedLibraryNode?.type === 'folder' && selectedLibraryNode.children.length > 0"
            class="space-y-10"
          >
            <!-- Sub-folders list -->
            <div v-if="folderChildren.length > 0">
              <div class="mb-4 flex items-center gap-2">
                <FolderOpen class="h-5 w-5 text-brand-500" />
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                  Thư mục con
                  <span class="ml-1.5 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-500 dark:bg-brand-500/10">
                    {{ folderChildren.length }}
                  </span>
                </h3>
              </div>
              <div class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
                <button
                  v-for="child in folderChildren"
                  :key="child.id"
                  type="button"
                  class="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  @click="handleTreeSelect(child)"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 transition-colors group-hover:bg-brand-100 dark:bg-brand-500/10 dark:group-hover:bg-brand-500/20">
                    <FolderOpen class="h-5 w-5 text-brand-500" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 group-hover:text-brand-500 dark:text-white">
                      {{ child.name }}
                    </p>
                    <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ child.children.length > 0 ? `${child.children.length} mục` : child.total_children ? `${child.total_children} mục` : 'Thư mục' }}
                    </p>
                  </div>
                  <ChevronRight class="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </button>
              </div>
            </div>

            <!-- Documents list -->
            <div>
              <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <FileText class="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                    Tài liệu
                    <span class="ml-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {{ documentChildren.length }}
                    </span>
                  </h3>
                </div>
                <Button
                  size="sm"
                  class="gap-1.5 bg-primary-500 text-white hover:bg-primary-600"
                  @click="openAddDocumentDialog"
                >
                  <Plus class="h-4 w-4" />
                  Thêm tài liệu
                </Button>
              </div>
              <div
                v-if="documentChildren.length > 0"
                class="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
              >
                <button
                  v-for="doc in documentChildren"
                  :key="doc.id"
                  type="button"
                  class="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  @click="handleTreeSelect(doc)"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 transition-colors group-hover:bg-brand-50 dark:bg-gray-800 dark:group-hover:bg-brand-500/10">
                    <FileText class="h-5 w-5 text-gray-400 group-hover:text-brand-500 dark:text-gray-500" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-gray-900 group-hover:text-brand-500 dark:text-white">
                      {{ doc.name }}
                    </p>
                    <p v-if="doc.updated_at" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Cập nhật: {{ formatDate(doc.updated_at) }}
                    </p>
                  </div>
                  <ChevronRight class="h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
                </button>
              </div>
            </div>
          </section>

          <!-- Empty state -->
          <section
            v-if="showEmptyState"
            class="flex flex-col items-center justify-center py-16 text-center"
          >
            <div class="mb-6 flex h-52 w-52 items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <FileText class="h-20 w-20 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Trang này chưa có nội dung</h2>
            <p class="mb-8 max-w-md text-theme-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {{ emptyDescription }}
            </p>
            <Button
              v-if="selectedLibraryNode"
              class="gap-2 bg-primary-500 text-white hover:bg-primary-600"
              @click="openAddDocumentDialog"
            >
              <Plus class="h-4 w-4" />
              Thêm tài liệu
            </Button>
          </section>

        </article>
      </main>
    </div>

    <!-- Share dialog -->
    <Dialog v-model:open="showShareDialog">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Chia sẻ tài liệu</DialogTitle>
          <DialogDescription>Chia sẻ theo Team, Role hoặc Email cá nhân.</DialogDescription>
        </DialogHeader>

        <!-- Share Tabs -->
        <div class="flex gap-1 border-b border-gray-200 dark:border-gray-700 -mx-1 px-1">
          <button
            v-for="tab in shareTabs"
            :key="tab.id"
            type="button"
            class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors"
            :class="shareActiveTab === tab.id
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'"
            @click="shareActiveTab = tab.id"
          >
            <component :is="tab.icon" class="h-3.5 w-3.5" />
            {{ tab.label }}
          </button>
        </div>

        <div class="space-y-4 py-2">

          <!-- Tab: Team -->
          <template v-if="shareActiveTab === 'team'">
            <div class="space-y-1.5">
              <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Chọn Team</Label>
              <Select v-model="shareTeamId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="-- Chọn một Team --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="team in shareGroups?.teams ?? []"
                    :key="team.id"
                    :value="team.id"
                  >
                    {{ team.name }} ({{ team.members.length }} thành viên)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Mức quyền</Label>
              <Select v-model="sharePermLevel">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Chỉ xem</SelectItem>
                  <SelectItem value="downloader">Xem & Tải xuống</SelectItem>
                  <SelectItem value="editor">Xem & Chỉnh sửa</SelectItem>
                  <SelectItem value="full">Toàn quyền</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="sm"
              class="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60"
              :disabled="!shareTeamId"
              @click="submitShareByTeam"
            >
              Chia sẻ cho Team
            </Button>
          </template>

          <!-- Tab: Role -->
          <template v-else-if="shareActiveTab === 'role'">
            <div class="space-y-1.5">
              <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Chọn Role</Label>
              <Select v-model="shareRoleId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="-- Chọn một Role --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="role in shareGroups?.roles ?? []"
                    :key="role.id"
                    :value="role.id"
                  >
                    {{ role.name }} — {{ role.description }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Mức quyền</Label>
              <Select v-model="sharePermLevel">
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Chỉ xem</SelectItem>
                  <SelectItem value="downloader">Xem & Tải xuống</SelectItem>
                  <SelectItem value="editor">Xem & Chỉnh sửa</SelectItem>
                  <SelectItem value="full">Toàn quyền</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              size="sm"
              class="bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-60"
              :disabled="!shareRoleId"
              @click="submitShareByRole"
            >
              Chia sẻ cho Role
            </Button>
          </template>

          <!-- Tab: Email -->
          <template v-else>
            <div class="space-y-2">
              <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Email cá nhân</Label>
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
          </template>

          <!-- Current access list -->
          <div v-if="shareAccessList.length > 0" class="space-y-2">
            <div class="flex items-center justify-between">
              <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Đang chia sẻ với</Label>
              <span class="text-[11px] text-gray-400 dark:text-gray-500">{{ shareAccessList.length }} đối tượng</span>
            </div>
            <div class="max-h-44 overflow-y-auto space-y-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2">
              <div
                v-for="entry in shareAccessList"
                :key="entry.id"
                class="flex items-center justify-between rounded-lg px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <div class="flex items-center gap-2.5 min-w-0">
                  <div
                    class="h-7 w-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                    :style="{ backgroundColor: entry.color }"
                  >
                    <Users v-if="entry.type === 'team'" class="h-3.5 w-3.5" />
                    <Shield v-else-if="entry.type === 'role'" class="h-3.5 w-3.5" />
                    <Mail v-else class="h-3.5 w-3.5" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ entry.name }}</p>
                    <p class="text-[11px] text-gray-400 dark:text-gray-500 capitalize">
                      {{ entry.type === 'team' ? 'Team' : entry.type === 'role' ? 'Role' : 'Email' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <span
                    class="rounded-full px-2 py-0.5 text-[11px] font-medium border"
                    :class="sharePermLevelClass[entry.level]"
                  >
                    {{ sharePermLevelLabel[entry.level] ?? entry.level }}
                  </span>
                  <button
                    type="button"
                    class="text-gray-400 hover:text-error-500 transition-colors"
                    title="Thu hồi quyền"
                    @click="revokeAccess(entry.id)"
                  >
                    <X class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <!-- Copy link (always visible) -->
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
          <DialogTitle>Tải tài liệu lên</DialogTitle>
          <DialogDescription>
            Chọn tệp để tải lên thư mục đang chọn.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Tệp tài liệu</Label>
            <input
              ref="documentFileInputRef"
              type="file"
              class="hidden"
              :accept="acceptedFileExtensions"
              @change="onDocumentFileSelected"
            />
            <div
              class="rounded-lg border border-dashed p-4 transition-colors"
              :class="isDocumentDropzoneActive
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10'
                : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'"
              @dragover.prevent="onDocumentDragOver"
              @dragleave.prevent="onDocumentDragLeave"
              @drop.prevent="onDocumentDrop"
            >
              <div v-if="selectedDocumentFile" class="space-y-2">
                <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ selectedDocumentFile.name }}</p>
                <p class="text-theme-xs text-gray-500 dark:text-gray-400">Dung lượng: {{ formatFileSize(selectedDocumentFile.size) }}</p>
                <div class="flex gap-2">
                  <Button type="button" variant="outline" size="sm" @click="openDocumentFilePicker">Chọn lại tệp</Button>
                  <Button type="button" variant="ghost" size="sm" class="text-error-500 hover:text-error-500" @click="clearSelectedDocumentFile">
                    Bỏ chọn
                  </Button>
                </div>
              </div>
              <div v-else class="space-y-2">
                <p class="text-theme-sm text-gray-700 dark:text-gray-300">Chưa có tệp nào được chọn.</p>
                <p class="text-theme-xs text-gray-500 dark:text-gray-400">Kéo thả tệp vào đây hoặc chọn từ máy tính.</p>
                <Button type="button" variant="outline" size="sm" @click="openDocumentFilePicker">Chọn tệp từ máy tính</Button>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <Label class="text-theme-sm font-medium text-gray-700 dark:text-gray-300">Mô tả, hướng dẫn hoặc nội dung tài liệu</Label>
            <Textarea
              v-model="newDocumentDescription"
              :rows="4"
              placeholder="Nhập mô tả ngắn, hướng dẫn sử dụng hoặc nội dung tóm tắt của tài liệu"
              class="resize-none"
            />
          </div>

          <div class="rounded-lg border border-warning-500/30 bg-warning-50 p-3 dark:bg-warning-500/10">
            <p class="text-theme-sm font-semibold text-warning-500">Yêu cầu tệp tải lên</p>
            <p class="mt-1 text-theme-xs text-gray-700 dark:text-gray-300">
              Định dạng hỗ trợ: {{ allowedDocumentExtensions.join(', ') }}.
            </p>
            <p class="text-theme-xs text-gray-700 dark:text-gray-300">
              Dung lượng tối đa: {{ maxDocumentSizeMB }}MB mỗi tệp.
            </p>
          </div>
        </div>

        <!-- Upload progress bar -->
        <div v-if="isCreatingDocument" class="space-y-2 px-1">
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{{ uploadProgress < 100 ? 'Đang tải lên máy chủ...' : 'Đang xử lý...' }}</span>
            <span class="font-medium">{{ uploadProgress }}%</span>
          </div>
          <div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              class="h-full rounded-full bg-primary-500 transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
            />
          </div>
        </div>

        <!-- Upload error -->
        <div
          v-if="uploadError"
          class="mx-1 rounded-lg border border-error-500/30 bg-error-50 px-3 py-2.5 dark:bg-error-500/10"
        >
          <p class="text-xs font-semibold text-error-500">Lỗi kết nối API</p>
          <p class="mt-0.5 text-xs text-error-500/80">{{ uploadError }}</p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="showAddDocumentDialog = false">Hủy</Button>
          <Button
            type="button"
            :class="[
              'disabled:bg-primary-200 disabled:text-primary-500',
              canSubmitDocumentUpload
                ? 'bg-primary-900 text-white hover:bg-primary-900 shadow-theme-sm'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200',
            ]"
            :disabled="isCreatingDocument || !canSubmitDocumentUpload"
            @click="submitNewDocument"
          >
            <Loader2 v-if="isCreatingDocument" class="mr-2 h-4 w-4 animate-spin" />
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
              <SelectItem value="shared">
                <span class="flex items-center gap-2">
                  <Share2 class="h-4 w-4 text-orange-500" />
                  Tài liệu được chia sẻ với tôi
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
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import {
  Bold,
  Copy,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Loader2,
  Mail,
  MessageSquare,
  Paperclip,
  Pencil,
  Plus,
  Share2,
  Shield,
  UserRound,
  Users,
  X,
} from 'lucide-vue-next'

import { get } from '@/services/api'
import {
  uploadFileExternal,
  extractExternalFileUrl,
  extractExternalFileId,
} from '@/services/library'
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

interface PageInfo {
  title: string
  date: string
}

const router = useRouter()
const currentRootType = computed(() => selectedLibraryNode.value?.root_type ?? null)

const emptyDescription = computed(() => {
  if (!selectedLibraryNode.value) return 'Chọn thư mục hoặc tài liệu trong cây bên trái để xem nội dung.'
  if (selectedLibraryNode.value.type === 'folder') return 'Thư mục này chưa có tài liệu nào. Bấm "Thêm tài liệu" để tải lên.'
  return 'Tài liệu này chưa có tệp đính kèm. Bấm "Thêm tài liệu" để tải lên.'
})

const folderChildren = computed<LibraryNode[]>(() =>
  selectedLibraryNode.value?.children.filter((c) => c.type === 'folder') ?? [],
)

const documentChildren = computed<LibraryNode[]>(() =>
  selectedLibraryNode.value?.children.filter((c) => c.type === 'document') ?? [],
)

const showEmptyState = computed(() => {
  const node = selectedLibraryNode.value
  if (!node) return true
  if (node.type === 'folder') return node.children.length === 0
  return !currentFileUrl.value
})


const libraryStore = useLibraryStore()
const selectedLibraryNode = ref<LibraryNode | null>(null)
const showAddDocumentDialog = ref(false)
const treeRef = ref<InstanceType<typeof LibraryTree> | null>(null)
const isCreatingDocument = ref(false)
const uploadProgress = ref(0)
const uploadError = ref<string | null>(null)
// fileUrlMap: nodeId → external file URL (populated from backend node or after upload)
const fileUrlMap = ref<Record<string, string>>({})
const fileMimeMap = ref<Record<string, string>>({})

// Derived: always prefer fileUrlMap (in-session), fall back to node.file_url (persisted in backend)
const currentFileUrl = computed<string | null>(() => {
  const node = selectedLibraryNode.value
  if (!node || node.type !== 'document') return null
  return fileUrlMap.value[node.id] ?? node.file_url ?? null
})

const currentFileMime = computed<string | null>(() => {
  const node = selectedLibraryNode.value
  if (!node || node.type !== 'document') return null
  return fileMimeMap.value[node.id] ?? node.file_mime ?? null
})
const latestCreatedDocumentId = ref<string | null>(null)
const isAddDocumentButtonEmphasized = ref(false)
const newDocumentDescription = ref('')
const documentFileInputRef = ref<HTMLInputElement | null>(null)
const selectedDocumentFile = ref<File | null>(null)
const allowedDocumentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'png', 'jpg', 'jpeg']
const acceptedFileExtensions = allowedDocumentExtensions.map((ext) => `.${ext}`).join(',')
const maxDocumentSizeMB = 25
const maxDocumentSizeBytes = maxDocumentSizeMB * 1024 * 1024
const canSubmitDocumentUpload = computed(() => selectedDocumentFile.value !== null)
const isDocumentDropzoneActive = ref(false)

// ─── Share dialog ─────────────────────────────────────────────
const showShareDialog = ref(false)
const shareEmail = ref('')
const shareRole = ref<'viewer' | 'editor' | 'commenter'>('viewer')
const shareLink = computed(() => `${window.location.origin}/doc-library?doc=${encodeURIComponent(currentPage.value.title)}`)
const shareLinkCopied = ref(false)
const shareActiveTab = ref<'team' | 'role' | 'email'>('team')
const shareTeamId = ref('')
const shareRoleId = ref('')
const sharePermLevel = ref<'viewer' | 'downloader' | 'editor' | 'full'>('viewer')

interface ShareGroup { id: string; name: string; description: string; color: string; members: { id: string }[] }
interface ShareGroupsData { teams: ShareGroup[]; roles: (ShareGroup & { permissions: string[] })[] }

interface ShareAccessEntry {
  id: string
  type: 'team' | 'role' | 'email'
  name: string
  level: string
  color: string
}

const shareAccessList = ref<ShareAccessEntry[]>([])

const sharePermLevelLabel: Record<string, string> = {
  viewer: 'Chỉ xem',
  downloader: 'Xem & Tải',
  editor: 'Xem & Sửa',
  full: 'Toàn quyền',
  commenter: 'Bình luận',
}

const sharePermLevelClass: Record<string, string> = {
  viewer: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
  downloader: 'bg-brand-50 text-brand-500 border-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20',
  editor: 'bg-success-50 text-success-500 border-success-100 dark:bg-success-500/10 dark:border-success-500/20',
  full: 'bg-warning-50 text-warning-500 border-warning-100 dark:bg-warning-500/10 dark:border-warning-500/20',
  commenter: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
}

const shareTabs = [
  { id: 'team', label: 'Theo Team', icon: Users },
  { id: 'role', label: 'Theo Role', icon: Shield },
  { id: 'email', label: 'Theo Email', icon: Mail },
]

const { data: shareGroupsResult } = useQuery({
  queryKey: ['permission-groups'],
  queryFn: () => get<{ success: boolean; data: ShareGroupsData }>('/v1/permission-groups'),
  enabled: showShareDialog,
})

const shareGroups = computed<ShareGroupsData | null>(() => {
  const apiRes = shareGroupsResult.value
  if (!apiRes?.isSuccess || !apiRes.data) return null
  const backendRes = apiRes.data as unknown as { success: boolean; data: ShareGroupsData }
  return backendRes?.data ?? null
})

function openShareDialog(): void {
  shareEmail.value = ''
  shareRole.value = 'viewer'
  shareLinkCopied.value = false
  shareActiveTab.value = 'team'
  shareTeamId.value = ''
  shareRoleId.value = ''
  sharePermLevel.value = 'viewer'
  // Seed with some initial mock access entries
  shareAccessList.value = [
    { id: 'init-1', type: 'team', name: 'Sales Team', level: 'viewer', color: '#465fff' },
    { id: 'init-2', type: 'email', name: 'huong.le@acme.com', level: 'downloader', color: '#667085' },
  ]
  showShareDialog.value = true
}

function submitShareInvite(): void {
  const email = shareEmail.value.trim()
  if (!email) return
  if (shareAccessList.value.some((e) => e.name === email)) {
    toast.error('Email này đã được thêm')
    return
  }
  shareAccessList.value.push({
    id: `email-${Date.now()}`,
    type: 'email',
    name: email,
    level: shareRole.value,
    color: '#667085',
  })
  toast.success(`Đã thêm ${email}`)
  shareEmail.value = ''
}

function submitShareByTeam(): void {
  const team = shareGroups.value?.teams.find((t) => t.id === shareTeamId.value)
  if (!team) return
  if (shareAccessList.value.some((e) => e.id === team.id)) {
    toast.error('Team này đã được thêm')
    return
  }
  shareAccessList.value.push({
    id: team.id,
    type: 'team',
    name: team.name,
    level: sharePermLevel.value,
    color: team.color ?? '#465fff',
  })
  toast.success(`Đã chia sẻ cho team "${team.name}"`)
  shareTeamId.value = ''
}

function submitShareByRole(): void {
  const role = shareGroups.value?.roles.find((r) => r.id === shareRoleId.value)
  if (!role) return
  if (shareAccessList.value.some((e) => e.id === role.id)) {
    toast.error('Role này đã được thêm')
    return
  }
  shareAccessList.value.push({
    id: role.id,
    type: 'role',
    name: role.name,
    level: sharePermLevel.value,
    color: role.color ?? '#12b76a',
  })
  toast.success(`Đã chia sẻ cho role "${role.name}"`)
  shareRoleId.value = ''
}

function revokeAccess(entryId: string): void {
  const entry = shareAccessList.value.find((e) => e.id === entryId)
  if (!entry) return
  shareAccessList.value = shareAccessList.value.filter((e) => e.id !== entryId)
  toast.success(`Đã thu hồi quyền của "${entry.name}"`)
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
  editTitle.value = selectedLibraryNode.value?.name ?? currentPage.value.title
  editStatus.value = 'approved'
  showEditDialog.value = true
}

function submitEdit(): void {
  const title = editTitle.value.trim()
  if (!title) {
    toast.error('Tiêu đề không được để trống')
    return
  }
  currentPage.value = { ...currentPage.value, title }
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

const collaborators = ref<string[]>([]) // kept for future real-time collaborator feature

const currentPage = ref<PageInfo>({
  title: '',
  date: '',
})

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return ''
  }
}

onMounted(() => {
  void libraryStore.fetchTree()
  libraryStore.initRealtime()
})

onUnmounted(() => {
  // Revoke any object URLs created for local file viewing
  for (const url of Object.values(fileUrlMap.value)) {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
  }
  libraryStore.releaseRealtime()
})

function handleTreeSelect(node: LibraryNode): void {
  selectedLibraryNode.value = node
  currentPage.value = {
    title: node.name,
    date: node.updated_at ? formatDate(node.updated_at) : '',
  }
  // Restore file URL from backend node data (persisted)
  if (node.type === 'document') {
    if (node.file_url) {
      fileUrlMap.value[node.id] = node.file_url
    }
    if (node.file_mime) {
      fileMimeMap.value[node.id] = node.file_mime
    }
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
        title: targetNode.name,
        date: targetNode.updated_at ? formatDate(targetNode.updated_at) : '',
      }
      isAddDocumentButtonEmphasized.value = false
      return
    }
  }

  newDocumentDescription.value = ''
  showAddDocumentDialog.value = true
}

function openDocumentFilePicker(): void {
  documentFileInputRef.value?.click()
}

function onDocumentFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  if (!file) {
    selectedDocumentFile.value = null
    return
  }
  if (!isAllowedDocumentFile(file)) {
    toast.error(`Định dạng không hỗ trợ. Chỉ chấp nhận: ${allowedDocumentExtensions.join(', ')}`)
    return
  }
  if (file.size > maxDocumentSizeBytes) {
    toast.error(`Tệp vượt quá ${maxDocumentSizeMB}MB. Vui lòng chọn tệp nhỏ hơn.`)
    return
  }
  selectedDocumentFile.value = file
}

function onDocumentDragOver(): void {
  isDocumentDropzoneActive.value = true
}

function onDocumentDragLeave(): void {
  isDocumentDropzoneActive.value = false
}

function onDocumentDrop(event: DragEvent): void {
  isDocumentDropzoneActive.value = false
  const file = event.dataTransfer?.files?.[0] ?? null
  if (!file) {
    return
  }
  if (!isAllowedDocumentFile(file)) {
    toast.error(`Định dạng không hỗ trợ. Chỉ chấp nhận: ${allowedDocumentExtensions.join(', ')}`)
    return
  }
  if (file.size > maxDocumentSizeBytes) {
    toast.error(`Tệp vượt quá ${maxDocumentSizeMB}MB. Vui lòng chọn tệp nhỏ hơn.`)
    return
  }
  selectedDocumentFile.value = file
}

function clearSelectedDocumentFile(): void {
  selectedDocumentFile.value = null
  isDocumentDropzoneActive.value = false
  if (documentFileInputRef.value) {
    documentFileInputRef.value.value = ''
  }
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  return `${(bytes / 1024).toFixed(2)} KB`
}

function isAllowedDocumentFile(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return allowedDocumentExtensions.includes(extension)
}

async function submitNewDocument(): Promise<void> {
  const file = selectedDocumentFile.value
  if (!file) {
    toast.error('Vui lòng chọn tệp tài liệu để tải lên')
    return
  }

  if (!isAllowedDocumentFile(file)) {
    toast.error(`Định dạng không hỗ trợ. Chỉ chấp nhận: ${allowedDocumentExtensions.join(', ')}`)
    return
  }

  if (file.size > maxDocumentSizeBytes) {
    toast.error(`Tệp vượt quá ${maxDocumentSizeMB}MB. Vui lòng chọn tệp nhỏ hơn.`)
    return
  }

  const parentId = selectedLibraryNode.value?.type === 'folder'
    ? selectedLibraryNode.value.id
    : selectedLibraryNode.value?.parent_id ?? null

  isCreatingDocument.value = true
  uploadProgress.value = 0
  uploadError.value = null

  try {
    // ── Step 1: Upload to external API ────────────────────────────────────────
    const uploadResult = await uploadFileExternal(file, (pct) => {
      uploadProgress.value = pct
    })

    let externalFileUrl: string | null = null
    let externalFileId: string | null = null

    if (uploadResult.isSuccess && uploadResult.data) {
      console.log('[DocLibrary] Upload API raw response:', uploadResult.data)
      externalFileUrl = extractExternalFileUrl(uploadResult.data)
      externalFileId = extractExternalFileId(uploadResult.data)
      uploadProgress.value = 100
      if (!externalFileUrl) {
        console.warn('[DocLibrary] URL not found in response. Using object URL as fallback. Keys:', Object.keys(uploadResult.data))
      }
    } else {
      uploadError.value = uploadResult.error ?? 'Tải tệp lên thất bại'
      toast.error(uploadError.value)
      return
    }

    // Fallback: nếu không lấy được URL từ API, tạo object URL local (chỉ tồn tại trong session)
    const viewUrl = externalFileUrl ?? URL.createObjectURL(file)

    // ── Step 2: Create library node (lưu file_url vào backend) ───────────────
    const node = await libraryStore.createDocument(file.name, parentId, externalFileUrl, file.type || null)
    if (!node) return

    // ── Step 3: Store file URL locally (để hiển thị ngay, không cần refetch) ─
    fileUrlMap.value[node.id] = viewUrl
    if (file.type) {
      fileMimeMap.value[node.id] = file.type
    }

    selectedLibraryNode.value = node
    currentPage.value = { title: node.name, date: node.updated_at ? formatDate(node.updated_at) : '' }
    latestCreatedDocumentId.value = node.id
    isAddDocumentButtonEmphasized.value = true

    showAddDocumentDialog.value = false
    newDocumentDescription.value = ''
    clearSelectedDocumentFile()
    uploadProgress.value = 0
    uploadError.value = null

    toast.success(
      externalFileUrl
        ? 'Đã tải tài liệu lên thành công'
        : 'Đã thêm tài liệu (tệp chưa được lưu trữ ngoài)',
    )
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

function handleNodePermissions(node: LibraryNode): void {
  void router.push(`/chat-tai-lieu/permissions/${node.id}?type=${node.type}&name=${encodeURIComponent(node.name)}`)
}

async function submitGlobalNewFolder(): Promise<void> {
  const name = globalNewFolderName.value.trim()
  if (!name) return

  // Resolve parent: root folder of the chosen workspace
  let rootId: string
  if (globalNewFolderWorkspace.value === 'company') {
    rootId = 'company-root'
  } else if (globalNewFolderWorkspace.value === 'personal') {
    rootId = 'personal-root'
  } else {
    rootId = 'shared-root'
  }

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
