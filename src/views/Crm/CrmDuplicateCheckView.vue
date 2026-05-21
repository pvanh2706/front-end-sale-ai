<template>
  <AdminLayout>
    <div class="space-y-4 pb-10">
      <!-- ── Header ─────────────────────────────────────────────────────────── -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Kiểm tra trùng dữ liệu</h1>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Quản lý và hợp nhất các bản ghi Lead &amp; Deal trùng lặp trên toàn hệ thống.
          </p>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" class="gap-1.5" size="sm">
            <Upload class="h-4 w-4" />
            Import CSV
          </Button>
          <Button class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600" size="sm" @click="handleScan">
            <ScanSearch class="h-4 w-4" />
            Quét toàn hệ thống
          </Button>
        </div>
      </div>

      <!-- ── KPI Cards ─────────────────────────────────────────────────────── -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800"
        >
          <div class="mb-2 flex items-start justify-between">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ kpi.label }}</span>
            <component :is="kpi.icon" class="h-5 w-5" :class="kpi.iconClass" />
          </div>
          <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ kpi.value }}</div>
          <div class="mt-1 text-xs" :class="kpi.trendClass">{{ kpi.trend }}</div>
        </div>
      </div>

      <!-- ── Sticky Filter Bar ──────────────────────────────────────────────── -->
      <div class="sticky top-0 z-10 space-y-3 rounded-xl border border-gray-200 bg-white/80 p-3 shadow-theme-xs backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
        <div class="flex flex-col gap-3 lg:flex-row">
          <!-- Search -->
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm kiếm theo Tên, Email hoặc Số điện thoại..."
              class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
            />
          </div>
          <!-- Tab + Filters -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Type filter: Lead / Deal -->
            <div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                v-for="tab in typeTabs"
                :key="tab.value"
                class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                :class="activeTypeFilter === tab.value
                  ? 'bg-white text-brand-500 shadow-theme-xs dark:bg-gray-700 dark:text-brand-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                @click="activeTypeFilter = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
            <!-- Match field filter: Phone / Email / Company -->
            <div class="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
              <button
                v-for="tab in filterTabs"
                :key="tab.value"
                class="rounded-md px-3 py-1 text-xs font-medium transition-colors"
                :class="activeTab === tab.value
                  ? 'bg-white text-brand-500 shadow-theme-xs dark:bg-gray-700 dark:text-brand-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                @click="activeTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
            <Button variant="outline" size="sm" class="gap-1.5 text-xs" @click="showAdvancedFilter = !showAdvancedFilter">
              <SlidersHorizontal class="h-3.5 w-3.5" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </div>

        <!-- Active Filter Tags -->
        <div v-if="activeFilterTags.length" class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">Bộ lọc:</span>
          <div
            v-for="tag in activeFilterTags"
            :key="tag.id"
            class="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
          >
            {{ tag.label }}
            <button @click="removeFilterTag(tag.id)">
              <X class="h-3 w-3 cursor-pointer hover:text-brand-600" />
            </button>
          </div>
          <button class="text-xs text-brand-500 hover:underline dark:text-brand-400" @click="clearAllFilters">
            Xóa tất cả
          </button>
        </div>
      </div>

      <!-- ── Match Groups ──────────────────────────────────────────────────── -->
      <div v-if="filteredGroups.length" class="space-y-4">
        <div
          v-for="group in paginatedGroups"
          :key="group.id"
          class="overflow-hidden rounded-xl bg-white shadow-theme-xs dark:bg-gray-800"
          :class="group.level === 'exact'
            ? 'border-2 border-error-500/40'
            : 'border border-gray-200 dark:border-gray-700'"
        >
          <!-- Card Header -->
          <div
            class="flex flex-wrap items-center justify-between gap-2 border-b p-3"
            :class="group.level === 'exact'
              ? 'border-error-500/30 bg-error-50 dark:bg-error-500/10'
              : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50'"
          >
            <div class="flex items-center gap-3">
              <!-- Score badge -->
              <span
                class="rounded-full px-3 py-0.5 text-xs font-bold"
                :class="group.level === 'exact'
                  ? 'bg-error-500 text-white'
                  : group.level === 'high'
                    ? 'bg-warning-500 text-white'
                    : 'bg-gray-500 text-white'"
              >
                {{ group.level === 'exact' ? 'Exact' : group.level === 'high' ? 'High' : 'Medium' }}
                {{ group.score }}%
              </span>
              <!-- Match tags -->
              <div class="flex gap-1">
                <Badge
                  v-for="tag in group.tags"
                  :key="tag"
                  variant="outline"
                  class="text-[10px] font-bold uppercase"
                  :class="group.level === 'exact' ? 'border-error-500/40 text-error-500' : 'border-warning-500/40 text-warning-500'"
                >
                  {{ tag }}
                </Badge>
              </div>
            </div>
            <!-- Actions -->
            <div class="flex items-center gap-2">
              <RouterLink
                v-if="group.recordA.type === 'deal'"
                :to="`/crm-deals/${group.recordA.id}`"
                class="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                Xem #{{ group.recordA.displayId }}
              </RouterLink>
              <Button
                variant="ghost"
                size="sm"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Bỏ qua tạm thời"
                @click="ignoreGroup(group.id)"
              >
                <EyeOff class="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="gap-1.5 border-success-300 text-success-600 hover:bg-success-50 dark:border-success-500/40 dark:text-success-400 dark:hover:bg-success-500/10"
                @click="openNotDupDialog(group)"
              >
                <CheckCircle2 class="h-3.5 w-3.5" />
                Không phải trùng
              </Button>
              <Button
                size="sm"
                class="gap-1.5 text-white"
                :class="group.level === 'exact' ? 'bg-error-500 hover:bg-error-600' : 'bg-brand-500 hover:bg-brand-600'"
                @click="openMergeDialog(group)"
              >
                <GitMerge class="h-3.5 w-3.5" />
                {{ group.level === 'exact' ? 'Hợp nhất ngay' : 'Hợp nhất' }}
              </Button>
            </div>
          </div>

          <!-- ── Desktop Table ─────────────────────────────────────────────── -->
          <div class="hidden overflow-x-auto md:block">
            <table class="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                  <th class="w-14 p-3 text-center text-xs font-medium text-gray-500">Master</th>
                  <th class="p-3 text-xs font-medium text-gray-500">Thông tin</th>
                  <th class="p-3 text-xs font-medium text-gray-500">
                    Bản ghi A
                    <Badge variant="outline" class="ml-1 text-[10px]">{{ group.recordA.type === 'deal' ? 'Deal' : 'Lead' }} #{{ group.recordA.displayId }}</Badge>
                    <Badge v-if="group.recordA.pipeline" variant="outline" class="ml-1 text-[10px] text-primary-500">{{ group.recordA.pipeline }}</Badge>
                  </th>
                  <th class="p-3 text-xs font-medium text-gray-500">
                    Bản ghi B
                    <Badge variant="outline" class="ml-1 text-[10px]">{{ group.recordB.type === 'deal' ? 'Deal' : 'Lead' }} #{{ group.recordB.displayId }}</Badge>
                    <Badge v-if="group.recordB.pipeline" variant="outline" class="ml-1 text-[10px] text-primary-500">{{ group.recordB.pipeline }}</Badge>
                  </th>
                </tr>
              </thead>
              <tbody class="text-sm">
                <tr
                  v-for="(field, fIdx) in group.fields"
                  :key="fIdx"
                  class="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <td class="p-3 text-center">
                    <input
                      v-if="field.isMasterKey"
                      :name="`master-${group.id}`"
                      type="radio"
                      :value="group.masterSelected"
                      class="cursor-pointer accent-brand-500"
                      :checked="group.masterSelected === (fIdx === 0 ? 'A' : 'B')"
                      @change="group.masterSelected = fIdx === 0 ? 'A' : 'B'"
                    />
                  </td>
                  <td class="p-3 text-xs font-medium text-gray-500 dark:text-gray-400">{{ field.label }}</td>
                  <td
                    class="p-3 text-gray-900 dark:text-white"
                    :class="{
                      'bg-brand-50 dark:bg-brand-500/10': field.highlight === 'same',
                      'bg-warning-50 italic dark:bg-warning-500/10': field.highlight === 'diff',
                    }"
                  >
                    {{ field.valueA || '—' }}
                  </td>
                  <td
                    class="p-3 text-gray-900 dark:text-white"
                    :class="{
                      'bg-brand-50 dark:bg-brand-500/10': field.highlight === 'same',
                      'bg-warning-50 italic dark:bg-warning-500/10': field.highlight === 'diff',
                    }"
                  >
                    {{ field.valueB || '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ── Mobile Card Stack ─────────────────────────────────────────── -->
          <div class="grid grid-cols-2 gap-3 p-3 md:hidden">
            <div class="rounded-lg border border-brand-200 bg-brand-50 p-3 dark:border-brand-500/30 dark:bg-brand-500/10">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-[10px] font-semibold uppercase text-brand-500">Master (A)</span>
                <input type="radio" :name="`m-${group.id}`" checked class="accent-brand-500" @change="group.masterSelected = 'A'" />
              </div>
              <template v-for="field in group.fields.slice(0, 3)" :key="field.label">
                <p class="text-xs font-medium text-gray-500">{{ field.label }}</p>
                <p class="mb-1 text-sm text-gray-900 dark:text-white">{{ field.valueA || '—' }}</p>
              </template>
            </div>
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
              <div class="mb-2 flex items-center justify-between">
                <span class="text-[10px] font-semibold uppercase text-gray-400">Bản sao (B)</span>
                <input type="radio" :name="`m-${group.id}`" class="accent-brand-500" @change="group.masterSelected = 'B'" />
              </div>
              <template v-for="field in group.fields.slice(0, 3)" :key="field.label">
                <p class="text-xs font-medium text-gray-500">{{ field.label }}</p>
                <p class="mb-1 text-sm text-gray-900 dark:text-white">{{ field.valueB || '—' }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Empty State ───────────────────────────────────────────────────── -->
      <div
        v-else
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-800"
      >
        <ShieldCheck class="mb-4 h-16 w-16 text-gray-200 dark:text-gray-600" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Chưa phát hiện bản ghi trùng nào</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Hệ thống quét tự động hằng ngày lúc 02:00.</p>
        <Button class="mt-6 bg-brand-500 text-white hover:bg-brand-600" @click="handleScan">
          Chạy quét thủ công
        </Button>
      </div>

      <!-- ── Whitelist: Đã đánh dấu không phải trùng ────────────────────────── -->
      <div
        v-if="whitelistedPairs.length > 0"
        class="overflow-hidden rounded-xl border border-success-200 bg-success-50/40 dark:border-success-500/20 dark:bg-success-500/5"
      >
        <div class="flex items-center justify-between border-b border-success-200 px-4 py-3 dark:border-success-500/20">
          <div class="flex items-center gap-2">
            <CheckCircle2 class="h-4 w-4 text-success-500" />
            <span class="text-sm font-semibold text-success-700 dark:text-success-400">
              Đã đánh dấu không phải trùng ({{ whitelistedPairs.length }})
            </span>
          </div>
          <span class="text-xs text-gray-400 dark:text-gray-500">Các cặp này không bị cảnh báo lại</span>
        </div>
        <div class="divide-y divide-success-100 dark:divide-success-500/10">
          <div
            v-for="entry in whitelistedPairs"
            :key="entry.pairKey"
            class="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
          >
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ entry.nameA }}</span>
                <span class="text-xs text-gray-400">vs</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ entry.nameB }}</span>
              </div>
              <div v-if="entry.companyA || entry.companyB" class="mt-1 flex flex-wrap items-center gap-1.5">
                <span v-if="entry.companyA" class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">{{ entry.companyA }}</span>
                <span v-if="entry.companyA && entry.companyB" class="text-xs text-gray-400">→</span>
                <span v-if="entry.companyB" class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">{{ entry.companyB }}</span>
              </div>
              <p v-if="entry.reason" class="mt-1 text-xs italic text-gray-400 dark:text-gray-500">"{{ entry.reason }}"</p>
              <p class="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{{ entry.markedAt }}</p>
            </div>
            <button
              class="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition hover:border-error-300 hover:text-error-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-error-500/40 dark:hover:text-error-400"
              @click="undoNotDuplicate(entry.pairKey)"
            >
              Hoàn tác
            </button>
          </div>
        </div>
      </div>

      <!-- ── Pagination ────────────────────────────────────────────────────── -->
      <div
        v-if="filteredGroups.length"
        class="flex flex-col items-center gap-3 border-t border-gray-200 pt-4 md:flex-row md:justify-between dark:border-gray-700"
      >
        <!-- Keyboard shortcuts hint -->
        <div class="hidden items-center gap-4 text-xs text-gray-400 md:flex dark:text-gray-500">
          <span class="flex items-center gap-1">
            <kbd class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">M</kbd>
            Merge selected
          </span>
          <span class="flex items-center gap-1">
            <kbd class="rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-800">Shift+N</kbd>
            Mark as unique
          </span>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {{ (currentPage - 1) * pageSize + 1 }}–{{ Math.min(currentPage * pageSize, filteredGroups.length) }}
            trên {{ filteredGroups.length }}
          </span>
          <div class="flex gap-1">
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              v-for="p in totalPages"
              :key="p"
              class="flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition"
              :class="p === currentPage
                ? 'bg-brand-500 text-white'
                : 'border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'"
              @click="currentPage = p"
            >
              {{ p }}
            </button>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 disabled:opacity-40 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Merge Confirm Dialog ──────────────────────────────────────────── -->
    <Dialog :open="showMergeDialog" @update:open="showMergeDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Xác nhận hợp nhất</DialogTitle>
          <DialogDescription class="text-gray-500 dark:text-gray-400">
            Hành động này sẽ gộp 2 bản ghi thành 1. Bản ghi Master sẽ được giữ lại.
          </DialogDescription>
        </DialogHeader>

        <div v-if="pendingMergeGroup" class="my-2 space-y-2 text-sm">
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
            <span class="text-xs font-medium text-brand-500">Master được giữ lại:</span>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ pendingMergeGroup.masterSelected === 'A'
                ? pendingMergeGroup.fields[0]?.valueA
                : pendingMergeGroup.fields[0]?.valueB }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ pendingMergeGroup.recordA.type === 'deal' ? 'Deal' : 'Lead' }}
              #{{ pendingMergeGroup.masterSelected === 'A'
                ? pendingMergeGroup.recordA.displayId
                : pendingMergeGroup.recordB.displayId }}
            </p>
          </div>
          <div class="rounded-lg border border-error-500/30 bg-error-50 p-3 dark:bg-error-500/10">
            <span class="text-xs font-medium text-error-500">Bản ghi sẽ bị xóa:</span>
            <p class="mt-1 font-semibold text-gray-900 dark:text-white">
              {{ pendingMergeGroup.masterSelected === 'A'
                ? pendingMergeGroup.fields[0]?.valueB
                : pendingMergeGroup.fields[0]?.valueA }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ pendingMergeGroup.recordB.type === 'deal' ? 'Deal' : 'Lead' }}
              #{{ pendingMergeGroup.masterSelected === 'A'
                ? pendingMergeGroup.recordB.displayId
                : pendingMergeGroup.recordA.displayId }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showMergeDialog = false">Hủy</Button>
          <Button
            class="bg-error-500 text-white hover:bg-error-600"
            :disabled="isMerging"
            @click="confirmMerge"
          >
            <Loader2 v-if="isMerging" class="mr-1.5 h-4 w-4 animate-spin" />
            Xác nhận hợp nhất
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- ── Not Duplicate Confirm Dialog ──────────────────────────────────── -->
    <Dialog :open="showNotDupDialog" @update:open="showNotDupDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Xác nhận không phải trùng</DialogTitle>
          <DialogDescription class="text-gray-500 dark:text-gray-400">
            Hệ thống sẽ lưu cặp bản ghi này vào danh sách ngoại lệ và không cảnh báo lại trong tương lai.
          </DialogDescription>
        </DialogHeader>

        <div v-if="pendingNotDupGroup" class="my-2 space-y-3">
          <!-- Hai bản ghi sẽ được giữ nguyên -->
          <div class="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Hai bản ghi sẽ được giữ nguyên</p>
            <div class="space-y-1.5">
              <div class="flex items-start gap-2 text-sm">
                <span class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">A</span>
                <div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ pendingNotDupGroup.fields[0]?.valueA }}</span>
                  <span v-if="pendingNotDupGroup.fields.find(f => f.label.toLowerCase().includes('công ty') || f.label.toLowerCase().includes('hkd'))?.valueA" class="ml-1.5 text-xs text-gray-400">
                    — {{ pendingNotDupGroup.fields.find(f => f.label.toLowerCase().includes('công ty') || f.label.toLowerCase().includes('hkd'))?.valueA }}
                  </span>
                </div>
              </div>
              <div class="flex items-start gap-2 text-sm">
                <span class="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-400">B</span>
                <div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ pendingNotDupGroup.fields[0]?.valueB }}</span>
                  <span v-if="pendingNotDupGroup.fields.find(f => f.label.toLowerCase().includes('công ty') || f.label.toLowerCase().includes('hkd'))?.valueB" class="ml-1.5 text-xs text-gray-400">
                    — {{ pendingNotDupGroup.fields.find(f => f.label.toLowerCase().includes('công ty') || f.label.toLowerCase().includes('hkd'))?.valueB }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Lý do -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Lý do <span class="text-xs font-normal text-gray-400">(tuỳ chọn)</span>
            </label>
            <textarea
              v-model="notDupReason"
              rows="2"
              placeholder="VD: Đây là cùng 1 người mua cho 2 hộ kinh doanh khác nhau..."
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Ghi chú -->
          <div class="flex items-start gap-1.5 rounded-lg bg-brand-50 px-3 py-2.5 text-xs text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Bạn có thể hoàn tác bất cứ lúc nào từ mục "Đã đánh dấu không trùng" bên dưới.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="showNotDupDialog = false">Hủy</Button>
          <Button
            class="gap-1.5 bg-success-500 text-white hover:bg-success-600"
            @click="confirmNotDuplicate"
          >
            <CheckCircle2 class="h-4 w-4" />
            Xác nhận không phải trùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import {
  BarChart2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  EyeOff,
  GitMerge,
  Loader2,
  ScanSearch,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserX,
  X,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

// ── Types ─────────────────────────────────────────────────────────────────────

type MatchLevel = 'exact' | 'high' | 'medium'
type RecordType = 'lead' | 'deal'

interface MatchField {
  label: string
  valueA: string
  valueB: string
  highlight: 'same' | 'diff' | 'none'
  isMasterKey?: boolean
}

interface MatchGroup {
  id: string
  score: number
  level: MatchLevel
  tags: string[]
  recordA: { id: string; type: RecordType; displayId: string; pipeline?: string }
  recordB: { id: string; type: RecordType; displayId: string; pipeline?: string }
  masterSelected: 'A' | 'B'
  fields: MatchField[]
}

interface FilterTag {
  id: string
  label: string
}

// ── State ─────────────────────────────────────────────────────────────────────

const pageTitle = ref('Kiểm tra trùng dữ liệu')
const searchQuery = ref('')
const activeTab = ref<'phone' | 'email' | 'company'>('phone')
const showAdvancedFilter = ref(false)
const currentPage = ref(1)
const pageSize = 5

const showMergeDialog = ref(false)
const isMerging = ref(false)
const pendingMergeGroup = ref<MatchGroup | null>(null)

// ── Whitelist (mark as not duplicate) ─────────────────────────────────────────

interface WhitelistEntry {
  pairKey: string
  nameA: string
  nameB: string
  companyA?: string
  companyB?: string
  reason?: string
  markedAt: string
}

const whitelistedPairs = ref<WhitelistEntry[]>([])
const whitelistSet = computed(() => new Set(whitelistedPairs.value.map((e) => e.pairKey)))
const showNotDupDialog = ref(false)
const pendingNotDupGroup = ref<MatchGroup | null>(null)
const notDupReason = ref('')

// ── KPI Cards (computed so whitelist count is reactive) ───────────────────────

const kpis = computed(() => [
  { label: 'Tổng cụm trùng',           value: '1,248', trend: '+12% so với tháng trước',       trendClass: 'text-brand-500',                        icon: BarChart2,     iconClass: 'text-brand-500' },
  { label: 'Lead trùng hôm nay',        value: '42',    trend: 'Đang chờ xử lý',                trendClass: 'text-gray-500 dark:text-gray-400',      icon: UserX,         iconClass: 'text-warning-500' },
  { label: 'Deal nghi ngờ trùng',       value: '18',    trend: 'Cần ưu tiên xử lý',             trendClass: 'text-error-500',                        icon: CreditCard,    iconClass: 'text-error-500' },
  { label: 'Không phải trùng',          value: String(whitelistedPairs.value.length), trend: whitelistedPairs.value.length > 0 ? 'Có thể hoàn tác' : 'Chưa có', trendClass: 'text-success-500', icon: CheckCircle2, iconClass: 'text-success-500' },
])


const typeTabs = [
  { label: 'Tất cả', value: 'all' as const },
  { label: 'Lead',   value: 'lead' as const },
  { label: 'Deal',   value: 'deal' as const },
]

const filterTabs = [
  { label: 'Điện thoại', value: 'phone' as const },
  { label: 'Email', value: 'email' as const },
  { label: 'Công ty', value: 'company' as const },
]

const route = useRoute()
const activeTypeFilter = ref<'all' | 'lead' | 'deal'>('all')

onMounted(() => {
  const t = route.query.type
  if (t === 'lead' || t === 'deal') activeTypeFilter.value = t
})

const activeFilterTags = ref<FilterTag[]>([
  { id: 'scope', label: 'Phạm vi: Toàn bộ' },
  { id: 'score', label: 'Độ trùng: > 80%' },
])

// ── Mock data ─────────────────────────────────────────────────────────────────

const matchGroups = ref<MatchGroup[]>([
  // ── Deal vs Deal ─────────────────────────────────────────────
  {
    id: 'g-01',
    score: 100,
    level: 'exact',
    tags: ['Trùng SĐT', 'Trùng Email'],
    recordA: { id: 'd-09', type: 'deal', displayId: '8821', pipeline: 'B2B Enterprise' },
    recordB: { id: 'd-12', type: 'deal', displayId: '9042', pipeline: 'B2B Enterprise' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên khách hàng', valueA: 'Nguyễn Văn An', valueB: 'Nguyễn Văn An', highlight: 'same', isMasterKey: true },
      { label: 'Số điện thoại', valueA: '0901 234 567', valueB: '0901 234 567', highlight: 'same', isMasterKey: true },
      { label: 'Email', valueA: 'an.nguyen@company.vn', valueB: 'an.nguyen@company.vn', highlight: 'same' },
      { label: 'Giá trị', valueA: '280.000.000 VNĐ', valueB: '300.000.000 VNĐ', highlight: 'diff' },
      { label: 'Người phụ trách', valueA: 'Trần Thị B', valueB: 'Lê Văn C', highlight: 'none' },
      { label: 'Ngày tạo', valueA: '12/10/2023', valueB: '25/10/2023', highlight: 'none' },
    ],
  },
  {
    id: 'g-03',
    score: 78,
    level: 'medium',
    tags: ['Trùng Công ty'],
    recordA: { id: 'd-06', type: 'deal', displayId: '6601', pipeline: 'B2B Enterprise' },
    recordB: { id: 'd-13', type: 'deal', displayId: '6720', pipeline: 'SMB Retail' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên khách hàng', valueA: 'Hoàng Anh Tuấn', valueB: 'Hoang A. Tuan', highlight: 'diff', isMasterKey: true },
      { label: 'Công ty', valueA: 'Fintech Việt Nam JSC', valueB: 'Fintech VN JSC', highlight: 'diff' },
      { label: 'Số điện thoại', valueA: '0902 111 222', valueB: '0902 111 333', highlight: 'diff' },
      { label: 'Giá trị', valueA: '120.000.000 VNĐ', valueB: '125.000.000 VNĐ', highlight: 'diff' },
      { label: 'Nguồn', valueA: 'Referral', valueB: 'Website', highlight: 'diff' },
    ],
  },
  {
    id: 'g-05',
    score: 92,
    level: 'high',
    tags: ['Trùng Email', 'Trùng Công ty'],
    recordA: { id: 'd-10', type: 'deal', displayId: '4409', pipeline: 'SMB Retail' },
    recordB: { id: 'd-14', type: 'deal', displayId: '4521', pipeline: 'SMB Retail' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên khách hàng', valueA: 'Trần Đức Thành', valueB: 'Trần Đức Thành', highlight: 'same', isMasterKey: true },
      { label: 'Công ty', valueA: 'Ngân hàng TechBank', valueB: 'TechBank', highlight: 'diff' },
      { label: 'Email', valueA: 'thanh.td@techbank.vn', valueB: 'thanh.td@techbank.vn', highlight: 'same' },
      { label: 'Giá trị', valueA: '850.000.000 VNĐ', valueB: '800.000.000 VNĐ', highlight: 'diff' },
    ],
  },
  // ── Lead vs Lead ─────────────────────────────────────────────
  {
    id: 'g-02',
    score: 85,
    level: 'high',
    tags: ['Trùng Email'],
    recordA: { id: 'l-09', type: 'lead', displayId: '7714' },
    recordB: { id: 'l-07', type: 'lead', displayId: '8853' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên khách hàng', valueA: 'Phạm Minh Tuấn', valueB: 'P. Minh Tuan', highlight: 'diff', isMasterKey: true },
      { label: 'Công ty', valueA: 'Techcom Corp', valueB: 'Techcom Corp', highlight: 'same', isMasterKey: true },
      { label: 'Email', valueA: 'tuan.pm@techcom.vn', valueB: 'tuan.pm@techcom.vn', highlight: 'same' },
      { label: 'Nguồn', valueA: 'Outbound', valueB: 'Website', highlight: 'diff' },
    ],
  },
  {
    id: 'g-04',
    score: 100,
    level: 'exact',
    tags: ['Trùng SĐT'],
    recordA: { id: 'l-04', type: 'lead', displayId: '5012' },
    recordB: { id: 'l-05', type: 'lead', displayId: '5188' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên khách hàng', valueA: 'Vũ Thị Hoa', valueB: 'Vũ Thị Hoa', highlight: 'same', isMasterKey: true },
      { label: 'Số điện thoại', valueA: '0935 678 901', valueB: '0935 678 901', highlight: 'same', isMasterKey: true },
      { label: 'Email', valueA: 'hoa.vu@bachphu.vn', valueB: 'vuhoabp@gmail.com', highlight: 'diff' },
      { label: 'Nguồn', valueA: 'Event', valueB: 'Facebook Ads', highlight: 'diff' },
      { label: 'Ngày tạo', valueA: '03/01/2024', valueB: '15/01/2024', highlight: 'none' },
    ],
  },
  {
    id: 'g-06',
    score: 80,
    level: 'high',
    tags: ['Trùng SĐT'],
    recordA: { id: 'l-11', type: 'lead', displayId: '3312' },
    recordB: { id: 'l-02', type: 'lead', displayId: '3498' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên khách hàng', valueA: 'Lý Thị Ngọc', valueB: 'Ly Ngoc', highlight: 'diff', isMasterKey: true },
      { label: 'Số điện thoại', valueA: '0911 345 678', valueB: '0911 345 678', highlight: 'same', isMasterKey: true },
      { label: 'Email', valueA: 'ngoc.lt@fashionx.vn', valueB: 'lyngoc.work@gmail.com', highlight: 'diff' },
      { label: 'Nguồn', valueA: 'Website', valueB: 'Zalo', highlight: 'diff' },
    ],
  },
  // ── Edge case: cùng liên hệ, mua cho 2 hộ kinh doanh khác nhau ──────────
  {
    id: 'g-07',
    score: 96,
    level: 'high',
    tags: ['Trùng SĐT', 'Trùng Email'],
    recordA: { id: 'l-15', type: 'lead', displayId: '9101' },
    recordB: { id: 'l-16', type: 'lead', displayId: '9102' },
    masterSelected: 'A',
    fields: [
      { label: 'Tên liên hệ',    valueA: 'Trần Minh Khoa',       valueB: 'Trần Minh Khoa',       highlight: 'same', isMasterKey: true },
      { label: 'Số điện thoại',  valueA: '0909 111 222',          valueB: '0909 111 222',          highlight: 'same', isMasterKey: true },
      { label: 'Email',          valueA: 'khoa.tran@gmail.com',   valueB: 'khoa.tran@gmail.com',   highlight: 'same' },
      { label: 'Công ty / HKD',  valueA: 'Cửa hàng Minh Phát',   valueB: 'Nhà hàng Thanh Sơn',   highlight: 'diff' },
      { label: 'Nguồn',          valueA: 'Zalo',                  valueB: 'Facebook',              highlight: 'diff' },
      { label: 'Ngày tạo',       valueA: '10/03/2024',            valueB: '22/03/2024',            highlight: 'none' },
    ],
  },
])

// ── Computed ──────────────────────────────────────────────────────────────────

function pairKey(g: MatchGroup): string {
  return [g.recordA.id, g.recordB.id].sort().join('|')
}

const filteredGroups = computed<MatchGroup[]>(() => {
  let groups = matchGroups.value

  // Deals: only flag duplicates within the same pipeline
  groups = groups.filter((g) => {
    if (g.recordA.type !== 'deal') return true
    return g.recordA.pipeline === g.recordB.pipeline
  })

  // Exclude whitelisted pairs
  groups = groups.filter((g) => !whitelistSet.value.has(pairKey(g)))

  if (activeTypeFilter.value !== 'all') {
    groups = groups.filter((g) => g.recordA.type === activeTypeFilter.value)
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return groups
  return groups.filter((group) =>
    group.fields.some(
      (field) =>
        field.valueA.toLowerCase().includes(q) ||
        field.valueB.toLowerCase().includes(q),
    ),
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredGroups.value.length / pageSize)))

const paginatedGroups = computed<MatchGroup[]>(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredGroups.value.slice(start, start + pageSize)
})

// ── Methods ───────────────────────────────────────────────────────────────────

function removeFilterTag(id: string): void {
  const idx = activeFilterTags.value.findIndex((t) => t.id === id)
  if (idx >= 0) activeFilterTags.value.splice(idx, 1)
}

function clearAllFilters(): void {
  activeFilterTags.value = []
  searchQuery.value = ''
}

function handleScan(): void {
  toast('Đang quét toàn hệ thống...', { description: 'Quá trình có thể mất vài phút.' })
}

function ignoreGroup(groupId: string): void {
  const idx = matchGroups.value.findIndex((g) => g.id === groupId)
  if (idx >= 0) matchGroups.value.splice(idx, 1)
  toast('Đã bỏ qua cụm trùng này')
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
}

function openMergeDialog(group: MatchGroup): void {
  pendingMergeGroup.value = group
  showMergeDialog.value = true
}

async function confirmMerge(): Promise<void> {
  if (!pendingMergeGroup.value) return
  isMerging.value = true

  await new Promise<void>((resolve) => setTimeout(resolve, 800))

  const groupId = pendingMergeGroup.value.id
  const idx = matchGroups.value.findIndex((g) => g.id === groupId)
  if (idx >= 0) matchGroups.value.splice(idx, 1)

  isMerging.value = false
  showMergeDialog.value = false
  pendingMergeGroup.value = null

  toast.success('Đã hợp nhất 2 bản ghi thành công.')
  if (currentPage.value > totalPages.value) currentPage.value = Math.max(1, totalPages.value)
}

function openNotDupDialog(group: MatchGroup): void {
  pendingNotDupGroup.value = group
  notDupReason.value = ''
  showNotDupDialog.value = true
}

function confirmNotDuplicate(): void {
  if (!pendingNotDupGroup.value) return
  const g = pendingNotDupGroup.value
  const key = pairKey(g)
  const nameA = g.fields[0]?.valueA ?? 'Bản ghi A'
  const nameB = g.fields[0]?.valueB ?? 'Bản ghi B'
  const companyField = g.fields.find((f) =>
    f.label.toLowerCase().includes('công ty') || f.label.toLowerCase().includes('hkd'),
  )
  whitelistedPairs.value.push({
    pairKey: key,
    nameA,
    nameB,
    companyA: companyField?.valueA,
    companyB: companyField?.valueB,
    reason: notDupReason.value.trim() || undefined,
    markedAt: new Date().toLocaleString('vi-VN'),
  })
  showNotDupDialog.value = false
  pendingNotDupGroup.value = null
  toast.success('Đã đánh dấu không phải trùng', {
    description: 'Cặp bản ghi này sẽ không xuất hiện cảnh báo trong tương lai.',
  })
  if (currentPage.value > totalPages.value) currentPage.value = Math.max(1, totalPages.value)
}

function undoNotDuplicate(key: string): void {
  const idx = whitelistedPairs.value.findIndex((e) => e.pairKey === key)
  if (idx >= 0) whitelistedPairs.value.splice(idx, 1)
  toast('Đã hoàn tác. Cặp bản ghi sẽ xuất hiện lại trong danh sách.')
}
</script>
