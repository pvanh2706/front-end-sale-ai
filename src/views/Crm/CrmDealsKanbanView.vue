<template>
  <AdminLayout>
    <div
      class="kanban-bg flex h-[calc(100vh-64px)] min-h-0 flex-col overflow-hidden"
      @click="showPipelineMenu = false"
    >

      <!-- ─── Toolbar ─────────────────────────────────────────────── -->
      <div class="kanban-toolbar shrink-0 px-4 py-3">

        <!-- Row 1: Tabs + Actions -->
        <div class="mb-2 flex flex-wrap items-center justify-between gap-3">

          <!-- Left: Tab + Pipeline -->
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1 rounded-xl bg-black/5 p-1 dark:bg-white/5">
              <button
                type="button"
                class="rounded-lg px-5 py-1.5 text-sm font-semibold transition-colors"
                :class="activeTab === 'lead'
                  ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
                @click="switchTab('lead')"
              >Lead</button>
              <button
                type="button"
                class="rounded-lg px-5 py-1.5 text-sm font-semibold transition-colors"
                :class="activeTab === 'deal'
                  ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
                  : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'"
                @click="switchTab('deal')"
              >Deal</button>
            </div>

            <!-- Pipeline selector (Deal only) -->
            <div v-if="activeTab === 'deal'" class="relative">
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                @click.stop="showPipelineMenu = !showPipelineMenu"
              >
                <span class="text-brand-500">Pipeline:</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ selectedPipelineName }}</span>
                <ChevronDown class="h-4 w-4 text-gray-500" :class="showPipelineMenu ? 'rotate-180' : ''" />
              </button>
              <div
                v-if="showPipelineMenu"
                class="absolute left-0 top-full z-30 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-theme-md dark:border-gray-700 dark:bg-gray-900"
                @click.stop
              >
                <button
                  v-for="pipeline in PIPELINES"
                  :key="pipeline.id"
                  type="button"
                  class="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  :class="selectedPipelineId === pipeline.id
                    ? 'font-semibold text-brand-600 dark:text-brand-400'
                    : 'text-gray-700 dark:text-gray-300'"
                  @click="switchPipeline(pipeline.id)"
                >
                  <span
                    class="inline-block h-2 w-2 shrink-0 rounded-full"
                    :class="selectedPipelineId === pipeline.id ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'"
                  />
                  {{ pipeline.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Right actions -->
          <div class="flex items-center gap-2">
            <!-- View mode switcher (Deal only) -->
            <div
              v-if="activeTab === 'deal'"
              class="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800"
            >
              <button
                v-for="mode in VIEW_MODES"
                :key="mode.id"
                type="button"
                class="rounded p-1.5 transition-colors"
                :class="viewMode === mode.id
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
                :title="mode.label"
                @click="viewMode = mode.id"
              >
                <component :is="mode.icon" class="h-4 w-4" />
              </button>
            </div>

            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <Search class="h-4 w-4" />
            </button>
            <button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <SlidersHorizontal class="h-4 w-4" />
            </button>
            <button
              v-if="activeTab === 'deal'"
              class="rounded-full p-2 text-gray-500 hover:bg-warning-50 hover:text-warning-600 dark:text-gray-400 dark:hover:bg-warning-900/20"
              title="Automation Rules"
              @click.stop="showAutomationDialog = true"
            >
              <Zap class="h-4 w-4" />
            </button>
            <Button
              class="gap-1.5 bg-primary-700 text-white hover:bg-primary-800"
              size="sm"
              @click="activeTab === 'deal' ? openCreateDialog() : leadBoardRef?.openCreateDialog()"
            >
              <Plus class="h-4 w-4" />
              {{ activeTab === 'deal' ? 'Tạo Deal' : 'Tạo Lead' }}
            </Button>
          </div>
        </div>

        <!-- Row 2: Quick filter chips (Deal only) -->
        <div v-if="activeTab === 'deal'" class="mb-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            v-for="f in QUICK_FILTERS"
            :key="f.id"
            type="button"
            class="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors"
            :class="activeQuickFilter === f.id
              ? 'bg-white text-gray-900 font-semibold ring-2 ring-gray-400 shadow-sm dark:bg-gray-700 dark:text-white dark:ring-gray-500'
              : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700'"
            @click="activeQuickFilter = f.id"
          >{{ f.name }}</button>
        </div>

        <!-- Row 3: KPIs (Deal only) -->
        <div v-if="activeTab === 'deal'" class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          <div v-for="kpi in kpis" :key="kpi.label" class="kpi-card rounded-xl p-3">
            <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
            <p class="text-xl font-semibold" :class="kpi.valueClass ?? 'text-gray-900 dark:text-white'">{{ kpi.value }}</p>
          </div>
        </div>
      </div>

      <!-- Duplicate warning banner -->
      <transition name="slide-down">
        <div
          v-if="activeTab === 'deal' && showDuplicateBanner"
          class="mx-4 mt-2 flex shrink-0 items-center gap-2 rounded-xl border border-warning-200 bg-warning-50 px-4 py-2.5 dark:border-warning-800/50 dark:bg-warning-900/20"
        >
          <AlertTriangle class="h-4 w-4 shrink-0 text-warning-500" />
          <p class="text-sm text-warning-700 dark:text-warning-400">
            Phát hiện <strong>2 deal</strong> có thể trùng lặp với khách hàng hiện tại.
          </p>
          <button class="ml-2 shrink-0 text-xs font-medium text-warning-600 underline underline-offset-2 hover:text-warning-700 dark:text-warning-400" @click="$router.push({ path: '/crm-duplicate-check', query: { type: 'deal' } })">
            Xem ngay
          </button>
          <button class="ml-auto shrink-0 rounded p-0.5 text-warning-400 hover:bg-warning-100 hover:text-warning-600" @click="showDuplicateBanner = false">
            <X class="h-4 w-4" />
          </button>
        </div>
      </transition>

      <!-- Bulk action bar -->
      <transition name="slide-up">
        <div
          v-if="selectedCards.size > 0"
          class="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-gray-900 px-5 py-3 shadow-2xl dark:bg-gray-800"
        >
          <span class="text-sm font-medium text-white">{{ selectedCards.size }} deal được chọn</span>
          <div class="h-4 w-px bg-gray-600" />
          <span class="text-xs text-gray-400">Chuyển sang:</span>
          <div class="flex items-center gap-1">
            <button
              v-for="col in columns.slice(0, 5)"
              :key="col.id"
              type="button"
              class="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors hover:bg-white/10"
              :style="{ color: col.color }"
              @click="bulkMoveCards(col.id)"
            >{{ col.name }}</button>
          </div>
          <div class="h-4 w-px bg-gray-600" />
          <button type="button" class="text-xs text-gray-400 hover:text-white" @click="clearSelection">Bỏ chọn</button>
        </div>
      </transition>

      <!-- ─── Lead board ──────────────────────────────────────────── -->
      <LeadKanbanBoard v-if="activeTab === 'lead'" ref="leadBoardRef" class="min-h-0 flex-1" />

      <!-- ─── Deal board ──────────────────────────────────────────── -->
      <template v-else>

        <!-- Deal search / filter bar (kanban only) -->
        <div v-if="viewMode === 'kanban'" ref="dealSearchBarRef" class="relative shrink-0 px-2 pt-1.5">
          <div
            class="flex min-h-[36px] cursor-text items-center gap-1.5 rounded-xl border bg-white px-3 py-1.5 shadow-theme-xs transition-all dark:bg-gray-800"
            :class="showDealFilterPanel
              ? 'border-primary-400 ring-1 ring-primary-200/60 dark:border-primary-500'
              : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
            @click="openDealFilterPanel"
          >
            <Search class="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <div class="flex flex-1 flex-wrap items-center gap-1.5">
              <span
                v-for="chip in activeDealFilterChips"
                :key="chip.key"
                class="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
              >
                {{ chip.label }}
                <button type="button" class="rounded-full text-primary-400 hover:text-primary-700" @click.stop="removeDealFilter(chip.key)">
                  <X class="h-2.5 w-2.5" />
                </button>
              </span>
              <input
                ref="dealSearchInputRef"
                v-model="dealFilterText"
                placeholder="Tìm kiếm deal..."
                class="min-w-[120px] flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
                @focus="showDealFilterPanel = true"
                @keydown.escape="showDealFilterPanel = false"
                @click.stop
              />
            </div>
            <div class="flex shrink-0 items-center gap-0.5">
              <button v-if="hasDealFilters" type="button" class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700" title="Xóa bộ lọc" @click.stop="clearDealFilters">
                <X class="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                class="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="hasDealFilters ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'"
                @click.stop="showDealFilterPanel = !showDealFilterPanel"
              >
                <SlidersHorizontal class="h-3.5 w-3.5" />
                <span v-if="totalDealFilterCount > 0" class="tabular-nums">{{ totalDealFilterCount }}</span>
              </button>
            </div>
          </div>

          <!-- Deal filter panel -->
          <div
            v-if="showDealFilterPanel"
            class="absolute inset-x-2 top-full z-40 mt-1 flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-700 dark:bg-gray-900"
            style="max-height: min(480px, 70vh)"
            @click.stop
          >
            <!-- Left: presets -->
            <div class="flex w-48 shrink-0 flex-col overflow-y-auto border-r border-gray-100 py-2 dark:border-gray-800">
              <p class="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Lọc nhanh</p>
              <button
                v-for="preset in DEAL_FILTER_PRESETS"
                :key="preset.id"
                type="button"
                class="w-full px-3 py-2 text-left text-xs font-medium transition-colors"
                :class="activeDealPreset === preset.id
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'"
                @click="applyDealPreset(preset.id)"
              >{{ preset.name }}</button>
            </div>

            <!-- Right: filter fields -->
            <div class="flex-1 overflow-y-auto p-4">
              <div class="grid grid-cols-2 gap-5">
                <!-- Nguồn -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Nguồn</p>
                  <div class="space-y-1">
                    <label v-for="src in DEAL_SOURCES" :key="src.value" class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                      <input type="checkbox" :value="src.value" v-model="dealFilterSources" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                      {{ src.label }}
                    </label>
                  </div>
                </div>

                <!-- Giai đoạn -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Giai đoạn</p>
                  <div class="space-y-1">
                    <label v-for="stg in DEAL_STAGES_LIST" :key="stg.value" class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                      <input type="checkbox" :value="stg.value" v-model="dealFilterStages" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                      {{ stg.label }}
                    </label>
                  </div>
                </div>

                <!-- Trạng thái -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Trạng thái</p>
                  <div class="space-y-1">
                    <label class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                      <input type="checkbox" v-model="dealFilterOverdue" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                      Quá hạn
                    </label>
                  </div>
                </div>

                <!-- Ngày tạo -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Ngày tạo</p>
                  <div class="space-y-1">
                    <label v-for="opt in DEAL_DATE_RANGE_OPTIONS" :key="opt.value" class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                      <input type="radio" :value="opt.value" v-model="dealFilterDateRange" class="h-3.5 w-3.5 border-gray-300 accent-primary-600" />
                      {{ opt.label }}
                    </label>
                  </div>
                </div>

                <!-- Tên deal -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Tên deal</p>
                  <input v-model="dealFilterName" placeholder="Tìm theo tên deal..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
                </div>

                <!-- Deal ID -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Deal ID</p>
                  <input v-model="dealFilterId" placeholder="Nhập Deal ID..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
                </div>

                <!-- Người phụ trách -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Người phụ trách</p>
                  <input v-model="dealFilterAssignee" placeholder="Tìm theo tên..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
                </div>

                <!-- Công ty -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Công ty / Liên hệ</p>
                  <input v-model="dealFilterText" placeholder="Tìm theo tên/công ty..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
                </div>

                <!-- Số điện thoại -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Số điện thoại</p>
                  <input v-model="dealFilterPhone" placeholder="Nhập số điện thoại..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
                </div>

                <!-- Email -->
                <div>
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Email</p>
                  <input v-model="dealFilterEmail" placeholder="Nhập email..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300" />
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
                <button type="button" class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click="clearDealFilters">Xóa bộ lọc</button>
                <button type="button" class="rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800" @click="showDealFilterPanel = false">Áp dụng</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Kanban view -->
        <div
          v-if="viewMode === 'kanban'"
          class="custom-scrollbar flex-1 overflow-x-auto overflow-y-hidden p-2 dark:bg-gray-950/80"
        >
          <div v-if="isLoading" class="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white/60 dark:border-gray-700 dark:bg-gray-900/50">
            <p class="text-sm text-gray-500">Đang tải Kanban...</p>
          </div>

          <div v-else ref="kanbanContainerRef" class="kanban-container h-full">
            <div
              v-for="(column, colIdx) in dealFilteredColumns"
              :key="column.id"
              class="kanban-column relative flex h-full flex-col"
              :style="{ width: `calc(${colWidths[column.id] ?? (100 / columns.length)}% - ${(columns.length - 1) * 6 / columns.length}px)` }"
              @dragover.prevent
              @drop="handleDrop(column.id)"
            >
              <div
                v-if="colIdx < columns.length - 1"
                class="resize-handle"
                :class="{ 'resize-active': resizingHandle?.leftId === column.id }"
                @mousedown.prevent.stop="startColumnResize($event, column.id, columns[colIdx + 1].id)"
              />
              <!-- Column header -->
              <div class="mb-2 flex flex-col gap-1.5">
                <!-- Title + total — full width (giống Lead Kanban) -->
                <div class="overflow-hidden rounded-xl shadow-theme-xs">
                  <!-- Title row -->
                  <div
                    class="flex items-center justify-between px-3 py-2"
                    :style="{
                      background: `var(--deal-${column.id}-bg)`,
                      borderTop: `3px solid var(--deal-${column.id}-border)`,
                    }"
                  >
                    <span
                      class="text-sm font-bold"
                      :style="{ color: `var(--deal-${column.id}-text)` }"
                    >
                      {{ column.name }}
                      <span class="ml-1 font-normal opacity-60">({{ column.cards.length }})</span>
                    </span>
                    <button
                      type="button"
                      class="rounded p-0.5 opacity-50 transition-opacity hover:opacity-100"
                      :style="{ color: `var(--deal-${column.id}-text)` }"
                      title="Tạo deal nhanh"
                      @click.stop="openQuickDeal(column.id)"
                    >
                      <Plus class="h-4 w-4" />
                    </button>
                  </div>
                  <!-- Total value -->
                  <div class="bg-white/95 px-3 py-1.5 text-center dark:bg-gray-800/95">
                    <p class="text-sm font-bold tabular-nums text-[#6366F1] dark:text-[#818CF8]">
                      {{ column.total }}
                    </p>
                  </div>
                </div>

                <!-- Inline quick deal form (hiện khi nhấn +) -->
                <div v-if="quickDealCol === column.id" class="flex items-center gap-1.5">
                  <Input
                    :id="`qdeal-${column.id}`"
                    v-model="quickDealTitle"
                    class="h-7 flex-1 text-xs"
                    placeholder="Tên deal..."
                    @keyup.enter="submitQuickDeal(column.id)"
                    @keyup.escape="quickDealCol = null"
                  />
                  <button class="rounded p-1 text-success-500 hover:bg-success-50 hover:text-success-600" @click="submitQuickDeal(column.id)">
                    <Check class="h-4 w-4" />
                  </button>
                  <button class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" @click="quickDealCol = null">
                    <X class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Cards list -->
              <div
                class="custom-scrollbar flex-1 space-y-2.5 overflow-y-auto pr-1"
                :class="column.cards.length === 0 ? 'flex items-center justify-center' : ''"
              >
                <div
                  v-if="column.cards.length === 0"
                  class="flex h-full min-h-[100px] w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100/50 px-3 dark:border-gray-700 dark:bg-gray-800/30"
                >
                  <p class="text-center text-xs italic text-gray-400 dark:text-gray-600">
                    Chưa có deal — kéo vào hoặc bấm Quick Deal
                  </p>
                </div>

                <div
                  v-for="card in column.cards"
                  :key="card.id"
                  class="group relative cursor-grab rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing dark:bg-gray-800"
                  :class="[
                    card.isOptimistic ? 'animate-pulse border-brand-300 dark:border-brand-700' : 'border-gray-200 dark:border-gray-700',
                    selectedCards.has(card.id) ? 'ring-2 ring-brand-500 ring-offset-1 dark:ring-offset-gray-900' : '',
                  ]"
                  :style="{ borderLeftWidth: '4px', borderLeftColor: cardStatusColor(card) }"
                  draggable="true"
                  @dragstart="handleDragStart(card.id, column.id)"
                >
                  <!-- Multi-select checkbox -->
                  <div class="absolute -left-1.5 -top-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <input
                      type="checkbox"
                      class="h-4 w-4 cursor-pointer rounded border-gray-300 accent-brand-500"
                      :checked="selectedCards.has(card.id)"
                      @click.stop="toggleCardSelect(card.id)"
                    />
                  </div>

                  <!-- Row 1: Source badge + badges + actions -->
                  <div class="mb-1.5 flex items-start justify-between gap-1">
                    <span
                      class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      :style="sourceStyle(card.source)"
                    >{{ card.source }}</span>
                    <div class="flex shrink-0 items-center gap-1">
                      <span
                        v-if="card.commentCount"
                        class="flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                      >
                        <MessageSquare class="h-2.5 w-2.5" />{{ card.commentCount }}
                      </span>
                      <span
                        v-if="card.notificationCount"
                        class="flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[9px] font-bold text-white"
                      >{{ card.notificationCount }}</span>
                      <button
                        class="text-gray-300 transition-colors hover:text-brand-500 dark:text-gray-600 dark:hover:text-brand-400"
                        @click.stop="openEditDialog(card, column.id)"
                      ><Pencil class="h-3.5 w-3.5" /></button>
                      <button
                        class="text-gray-300 transition-colors hover:text-error-500 dark:text-gray-600 dark:hover:text-error-400"
                        @click.stop="removeDeal(card.id)"
                      ><Trash2 class="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <!-- Title -->
                  <RouterLink
                    :to="`/crm-deals/${card.id}`"
                    class="mb-1 block text-sm font-semibold leading-snug text-gray-900 hover:text-brand-500 dark:text-white dark:hover:text-brand-400"
                  >{{ card.title }}</RouterLink>

                  <!-- Contact + Company -->
                  <p class="mb-2 text-xs text-gray-500 dark:text-gray-400">
                    <span v-if="card.contactName" class="font-medium text-gray-700 dark:text-gray-300">{{ card.contactName }}</span>
                    <span v-if="card.contactName && card.company"> · </span>
                    {{ card.company }}
                  </p>

                  <!-- Value + AI score -->
                  <div class="mb-2 flex items-center justify-between">
                    <p class="text-sm font-bold text-[#6366F1] dark:text-[#818CF8]">{{ card.value }}</p>
                    <div v-if="card.aiScore" class="flex items-center gap-1 text-brand-500">
                      <Star class="h-3.5 w-3.5 fill-current" />
                      <span class="text-xs font-bold">{{ card.aiScore }}</span>
                    </div>
                  </div>

                  <!-- Close date -->
                  <div
                    v-if="card.closeDate"
                    class="mb-2 flex items-center gap-1 text-[11px]"
                    :class="card.isOverdue
                      ? 'text-error-500'
                      : isCloseSoon(card.closeDate) ? 'text-warning-500' : 'text-gray-400 dark:text-gray-500'"
                  >
                    <Calendar class="h-3 w-3 shrink-0" />
                    {{ formatCloseDate(card.closeDate) }}
                    <span v-if="card.isOverdue" class="font-semibold">(Quá hạn)</span>
                    <span v-else-if="isCloseSoon(card.closeDate)" class="font-semibold">(Sắp đến hạn)</span>
                  </div>

                  <!-- Divider -->
                  <div class="my-2 border-t border-gray-100 dark:border-gray-700/60" />

                  <!-- Footer: quick actions + activity + assignee -->
                  <div class="flex items-center justify-between gap-1">
                    <div class="flex flex-wrap items-center gap-1">
                      <button
                        v-if="card.phone"
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-brand-500 transition-colors hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50"
                        title="Gọi điện"
                        @click.stop
                      ><Phone class="h-3 w-3" /></button>
                      <button
                        v-if="card.email"
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        title="Gửi email"
                        @click.stop
                      ><Mail class="h-3 w-3" /></button>
                      <button
                        class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        title="Chat"
                        @click.stop
                      ><MessageCircle class="h-3 w-3" /></button>
                      <button
                        class="flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 transition-colors hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-400 dark:hover:bg-brand-900/50"
                        @click.stop="openActivityDialog(card.id, card.title)"
                      >
                        <Plus class="h-3 w-3" />Activity
                      </button>
                    </div>

                    <!-- Assignee avatar + last activity -->
                    <div class="flex shrink-0 items-center gap-1.5">
                      <span v-if="card.lastActivityAt" class="text-[10px] text-gray-400 dark:text-gray-500">
                        {{ card.lastActivityAt }}
                      </span>
                      <div
                        v-if="card.assigneeName"
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                        :style="{ background: card.assigneeColor || '#6B7280' }"
                        :title="card.assigneeName"
                      >{{ cardInitials(card.assigneeName) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List view stub -->
        <div v-else-if="viewMode === 'list'" class="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <LayoutList class="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Chế độ danh sách đang phát triển</p>
          <p class="text-xs text-gray-400 dark:text-gray-600">Sắp ra mắt — hỗ trợ sort, filter và inline edit</p>
        </div>

        <!-- Calendar view stub -->
        <div v-else class="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <CalendarDays class="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Chế độ lịch đang phát triển</p>
          <p class="text-xs text-gray-400 dark:text-gray-600">Sắp ra mắt — xem deal theo ngày dự kiến đóng</p>
        </div>

      </template>
    </div>

    <!-- ─── Activity Log Dialog ─────────────────────────────────── -->
    <Dialog :open="showActivityDialog" @update:open="showActivityDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-base font-semibold text-gray-900 dark:text-white">Log Activity</DialogTitle>
          <DialogDescription class="truncate text-sm text-gray-500">{{ activityTarget?.dealTitle }}</DialogDescription>
        </DialogHeader>
        <div class="space-y-3 py-3">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in ACTIVITY_TYPES"
              :key="type"
              type="button"
              class="rounded-full px-3 py-1 text-xs font-medium transition-colors"
              :class="activityType === type
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
              @click="activityType = type"
            >{{ type }}</button>
          </div>
          <Textarea v-model="activityNote" placeholder="Ghi chú nhanh..." rows="3" />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showActivityDialog = false">Hủy</Button>
          <Button class="bg-brand-500 text-white hover:bg-brand-600" @click="submitActivity">
            Lưu activity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ─── Automation Dialog ───────────────────────────────────── -->
    <Dialog :open="showAutomationDialog" @update:open="showAutomationDialog = $event">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
            <Zap class="h-5 w-5 text-warning-500" />
            Automation Rules
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-500">Tự động hóa khi deal chuyển giai đoạn</DialogDescription>
        </DialogHeader>
        <div class="space-y-2.5 py-4">
          <div
            v-for="rule in automationRules"
            :key="rule.id"
            class="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50"
          >
            <Zap class="mt-0.5 h-4 w-4 shrink-0 text-warning-500" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ rule.condition }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">→ {{ rule.action }}</p>
            </div>
            <button
              type="button"
              class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors"
              :class="rule.enabled ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'"
              @click="rule.enabled = !rule.enabled"
            >
              <span
                class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                :class="rule.enabled ? 'translate-x-4' : 'translate-x-0.5'"
              />
            </button>
          </div>
          <button
            type="button"
            class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20"
          >
            <Plus class="h-4 w-4" />Thêm rule mới
          </button>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showAutomationDialog = false">Đóng</Button>
          <Button class="bg-brand-500 text-white hover:bg-brand-600" @click="showAutomationDialog = false">Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ─── Deal Dialog ─────────────────────────────────────────── -->
    <Dialog :open="showDealDialog" @update:open="showDealDialog = $event">
      <DialogContent class="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader class="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">{{ editingDealId ? 'Cập nhật Deal' : 'Tạo Deal mới' }}</DialogTitle>
          <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">Điền thông tin chi tiết để lưu deal vào CRM</DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-1.5">
            <Label for="deal-title">Tên deal <span class="text-error-500">*</span></Label>
            <Input id="deal-title" v-model="form.title" placeholder="VD: Triển khai ERP giai đoạn 1" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="deal-company">Công ty</Label>
              <Input id="deal-company" v-model="form.company" placeholder="Tên công ty" />
            </div>
            <div class="space-y-1.5">
              <Label for="deal-contact">Người liên hệ</Label>
              <Input id="deal-contact" v-model="form.contact" placeholder="Họ tên" />
            </div>
          </div>
          <div class="space-y-1.5">
            <Label for="deal-contact-title">Chức vụ người liên hệ</Label>
            <Input id="deal-contact-title" v-model="form.contactTitle" placeholder="VD: Giám đốc mua hàng, Trưởng phòng IT" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="deal-phone">Số điện thoại</Label>
              <Input id="deal-phone" v-model="form.phone" type="tel" placeholder="VD: 0901 234 567" />
            </div>
            <div class="space-y-1.5">
              <Label for="deal-email">Email</Label>
              <Input id="deal-email" v-model="form.email" type="email" placeholder="VD: contact@congty.com" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="deal-value">Giá trị</Label>
              <Input id="deal-value" v-model="form.value" type="number" min="0" placeholder="0" />
            </div>
            <div class="space-y-1.5">
              <Label for="deal-close-date">Ngày dự kiến đóng</Label>
              <Input id="deal-close-date" v-model="form.closeDate" type="date" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label>Giai đoạn <span class="text-error-500">*</span></Label>
              <Select v-model="form.stage">
                <SelectTrigger><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="column in columns" :key="column.id" :value="column.id">{{ column.name }}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label>Nguồn</Label>
              <Select v-model="form.source">
                <SelectTrigger><SelectValue placeholder="Chọn nguồn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label for="deal-note">Mô tả</Label>
            <Textarea id="deal-note" v-model="form.description" rows="3" placeholder="Mô tả deal" />
          </div>
        </div>

        <DialogFooter class="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button variant="outline" @click="showDealDialog = false">Hủy</Button>
          <Button class="bg-primary-700 text-white hover:bg-primary-800" :disabled="isSubmitting" @click="submitDeal">
            <Loader2 v-if="isSubmitting" class="mr-1.5 h-4 w-4 animate-spin" />
            {{ editingDealId ? 'Lưu thay đổi' : 'Tạo Deal' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import LeadKanbanBoard from '@/components/crm/LeadKanbanBoard.vue'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { createDeal, deleteDeal, listDealsKanban, updateDeal, updateDealStage } from '@/services/deals'
import type { DealCard, DealStage, DealsKanbanPayload, KanbanColumn, KanbanKpi } from '@/types/deals'
import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  Loader2,
  Mail,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
  X,
  Zap,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'

// ─── Types ────────────────────────────────────────────────────

type KanbanTab = 'lead' | 'deal'
type ViewMode = 'kanban' | 'list' | 'calendar'

interface DealForm {
  title: string
  company: string
  contact: string
  contactTitle: string
  phone: string
  email: string
  value: string
  closeDate: string
  stage: DealStage
  source: string
  description: string
}

interface AutomationRule {
  id: string
  condition: string
  action: string
  enabled: boolean
}

// ─── Constants ────────────────────────────────────────────────

const PIPELINES = [
  { id: 'b2b', name: 'Bán hàng B2B' },
  { id: 'b2c', name: 'Bán hàng B2C' },
  { id: 'enterprise', name: 'Enterprise' },
  { id: 'partnership', name: 'Hợp tác đối tác' },
] as const

const VIEW_MODES = [
  { id: 'kanban' as ViewMode, icon: LayoutGrid, label: 'Kanban' },
  { id: 'list' as ViewMode, icon: LayoutList, label: 'Danh sách' },
  { id: 'calendar' as ViewMode, icon: CalendarDays, label: 'Lịch' },
]

const QUICK_FILTERS = [
  { id: 'all', name: 'Tất cả' },
  { id: 'my', name: 'Của tôi' },
  { id: 'inbound', name: 'Inbound' },
  { id: 'planned', name: 'Có kế hoạch' },
  { id: 'overdue', name: '⚠ Quá hạn' },
  { id: 'hot', name: '🔥 Hot' },
  { id: 'this_week', name: 'Tuần này' },
] as const

const ACTIVITY_TYPES = ['Gọi điện', 'Email', 'Gặp mặt', 'Demo', 'Ghi chú']

const DEMO_CARDS: Record<DealStage, DealCard[]> = {
  new: [
    {
      id: 'demo-1', title: 'Triển khai ERP giai đoạn 1',
      company: 'Tập đoàn Vingroup', contactName: 'Nguyễn Văn Minh',
      value: '₫ 280,000,000', source: 'REFERRAL', aiScore: 88,
      assigneeName: 'Minh Tú', assigneeColor: '#3B82F6',
      lastActivityAt: '2 giờ trước', closeDate: '2026-06-15',
      phone: '0901234567', email: 'minh@vingroup.net', commentCount: 3,
    },
    {
      id: 'demo-2', title: 'Phần mềm quản lý kho',
      company: 'Masan Group', contactName: 'Trần Thị Lan',
      value: '₫ 170,000,000', source: 'INBOUND', aiScore: 72,
      assigneeName: 'Lan Ngọc', assigneeColor: '#10B981',
      lastActivityAt: '1 ngày trước', closeDate: '2026-05-10', isOverdue: true,
      email: 'lan@masan.com', notificationCount: 2,
    },
  ],
  preparing: [
    {
      id: 'demo-3', title: 'Dịch vụ Cloud B2B 2026',
      company: 'FPT Corporation', contactName: 'Phạm Đức Hùng',
      value: '₫ 320,000,000', source: 'OUTBOUND', aiScore: 95,
      assigneeName: 'Hùng Phát', assigneeColor: '#8B5CF6',
      lastActivityAt: '30 phút trước', closeDate: '2026-05-28',
      phone: '0987654321', email: 'pham.hung@fpt.com', commentCount: 7,
    },
  ],
  contacted: [],
  negotiating: [
    {
      id: 'demo-4', title: 'Hệ thống POS chuỗi F&B',
      company: 'Golden Gate Group', contactName: 'Lê Thị Hoa',
      value: '₫ 800,000,000', source: 'WEBSITE', aiScore: 91,
      assigneeName: 'Minh Tú', assigneeColor: '#3B82F6',
      lastActivityAt: '5 giờ trước', closeDate: '2026-05-20', isOverdue: true,
      phone: '0912345678', email: 'lhoa@goldengate.vn',
      commentCount: 12, notificationCount: 1,
    },
  ],
  quoted: [
    {
      id: 'demo-5', title: 'Tích hợp CRM + ERP',
      company: 'Thaco Auto', contactName: 'Đặng Văn Đức',
      value: '₫ 500,000,000', source: 'EVENT', aiScore: 84,
      assigneeName: 'Đức Long', assigneeColor: '#F59E0B',
      lastActivityAt: '3 ngày trước', closeDate: '2026-06-01',
      email: 'duc@thaco.com.vn',
    },
  ],
  won: [],
  lost: [],
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  { id: 'new', name: 'Mới', color: '#64748B', total: '₫ 450M', cards: DEMO_CARDS.new },
  { id: 'preparing', name: 'Đang chuẩn bị', color: '#3B82F6', total: '₫ 320M', cards: DEMO_CARDS.preparing },
  { id: 'contacted', name: 'Đã liên hệ', color: '#06B6D4', total: '₫ 0', cards: [] },
  { id: 'negotiating', name: 'Đàm phán', color: '#F59E0B', total: '₫ 800M', cards: DEMO_CARDS.negotiating },
  { id: 'quoted', name: 'Báo giá', color: '#8B5CF6', total: '₫ 500M', cards: DEMO_CARDS.quoted },
  { id: 'won', name: 'Thắng', color: '#10B981', total: '₫ 0', cards: [] },
  { id: 'lost', name: 'Thua', color: '#EF4444', total: '₫ 0', cards: [] },
]

// ── Source badge color map (keyed by uppercase source string) ──
const SOURCE_STYLE: Record<string, { background: string; color: string }> = {
  INBOUND:  { background: 'var(--source-inbound-bg)',  color: 'var(--source-inbound-text)'  },
  OUTBOUND: { background: 'var(--source-outbound-bg)', color: 'var(--source-outbound-text)' },
  REFERRAL: { background: 'var(--source-referral-bg)', color: 'var(--source-referral-text)' },
  WEBSITE:  { background: 'var(--source-website-bg)',  color: 'var(--source-website-text)'  },
  EVENT:    { background: 'var(--source-event-bg)',    color: 'var(--source-event-text)'    },
}

function sourceStyle(source: string): { background: string; color: string } {
  return SOURCE_STYLE[source?.toUpperCase()] ?? { background: '#F3F4F6', color: '#374151' }
}

function cardStatusColor(card: DealCard): string {
  if (card.isOverdue) return '#EF4444'
  if (card.closeDate && isCloseSoon(card.closeDate)) return '#F59E0B'
  if (card.lastActivityAt && /phút|giờ/.test(card.lastActivityAt)) return '#10B981'
  return '#D1D5DB'
}

// ─── State ────────────────────────────────────────────────────

const activeTab = ref<KanbanTab>('deal')
const viewMode = ref<ViewMode>('kanban')
const selectedPipelineId = ref<string>('b2b')
const showPipelineMenu = ref(false)
const leadBoardRef = ref<InstanceType<typeof LeadKanbanBoard> | null>(null)
const activeQuickFilter = ref('all')
const showDuplicateBanner = ref(true)
const selectedCards = ref<Set<string>>(new Set())

const selectedPipelineName = computed(
  () => PIPELINES.find((p) => p.id === selectedPipelineId.value)?.name ?? PIPELINES[0].name,
)

const columns = ref<KanbanColumn[]>(structuredClone(DEFAULT_COLUMNS))
const kpis = ref<KanbanKpi[]>([])
const isLoading = ref(false)
const dragging = ref<{ dealId: string; fromStage: DealStage } | null>(null)

// ─── Deal filter ──────────────────────────────────────────────

const DEAL_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'referral', label: 'Referral' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'event', label: 'Event' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
]

const DEAL_STAGES_LIST = [
  { value: 'new' as DealStage, label: 'Mới' },
  { value: 'preparing' as DealStage, label: 'Chuẩn bị' },
  { value: 'contacted' as DealStage, label: 'Đã liên hệ' },
  { value: 'negotiating' as DealStage, label: 'Đàm phán' },
  { value: 'quoted' as DealStage, label: 'Đã báo giá' },
  { value: 'won' as DealStage, label: 'Thành công' },
  { value: 'lost' as DealStage, label: 'Thất bại' },
]

const DEAL_DATE_RANGE_OPTIONS = [
  { value: 'any', label: 'Bất kỳ' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
]

const DEAL_FILTER_PRESETS = [
  { id: 'all', name: 'Tất cả deals' },
  { id: 'overdue', name: 'Quá hạn' },
  { id: 'has_assignee', name: 'Được giao' },
  { id: 'src_website', name: 'Từ Website' },
  { id: 'src_inbound', name: 'Từ Inbound' },
  { id: 'src_zalo', name: 'Từ Zalo' },
  { id: 'src_outbound', name: 'Từ Outbound' },
]

const showDealFilterPanel = ref(false)
const dealSearchBarRef = ref<HTMLElement | null>(null)
const dealSearchInputRef = ref<HTMLInputElement | null>(null)
const dealFilterText = ref('')
const dealFilterSources = ref<string[]>([])
const dealFilterStages = ref<DealStage[]>([])
const dealFilterDateRange = ref('any')
const dealFilterAssignee = ref('')
const dealFilterPhone = ref('')
const dealFilterEmail = ref('')
const dealFilterName = ref('')
const dealFilterId = ref('')
const dealFilterOverdue = ref(false)
const activeDealPreset = ref<string | null>('all')

const hasDealFilters = computed(() =>
  dealFilterText.value.trim() !== '' ||
  dealFilterSources.value.length > 0 ||
  dealFilterStages.value.length > 0 ||
  dealFilterDateRange.value !== 'any' ||
  dealFilterAssignee.value.trim() !== '' ||
  dealFilterPhone.value.trim() !== '' ||
  dealFilterEmail.value.trim() !== '' ||
  dealFilterName.value.trim() !== '' ||
  dealFilterId.value.trim() !== '' ||
  dealFilterOverdue.value,
)

const totalDealFilterCount = computed(() => {
  let n = 0
  if (dealFilterText.value.trim()) n++
  if (dealFilterSources.value.length) n++
  if (dealFilterStages.value.length) n++
  if (dealFilterDateRange.value !== 'any') n++
  if (dealFilterAssignee.value.trim()) n++
  if (dealFilterPhone.value.trim()) n++
  if (dealFilterEmail.value.trim()) n++
  if (dealFilterName.value.trim()) n++
  if (dealFilterId.value.trim()) n++
  if (dealFilterOverdue.value) n++
  return n
})

const activeDealFilterChips = computed(() => {
  const chips: { key: string; label: string }[] = []
  if (dealFilterSources.value.length)
    chips.push({ key: 'sources', label: `Nguồn (${dealFilterSources.value.length})` })
  if (dealFilterStages.value.length)
    chips.push({ key: 'stages', label: `Giai đoạn (${dealFilterStages.value.length})` })
  if (dealFilterDateRange.value !== 'any')
    chips.push({ key: 'dateRange', label: DEAL_DATE_RANGE_OPTIONS.find((o) => o.value === dealFilterDateRange.value)?.label ?? dealFilterDateRange.value })
  if (dealFilterName.value.trim())
    chips.push({ key: 'name', label: `Tên: ${dealFilterName.value.trim()}` })
  if (dealFilterId.value.trim())
    chips.push({ key: 'dealId', label: `ID: ${dealFilterId.value.trim()}` })
  if (dealFilterAssignee.value.trim())
    chips.push({ key: 'assignee', label: `Phụ trách: ${dealFilterAssignee.value.trim()}` })
  if (dealFilterPhone.value.trim())
    chips.push({ key: 'phone', label: `SĐT: ${dealFilterPhone.value.trim()}` })
  if (dealFilterEmail.value.trim())
    chips.push({ key: 'email', label: `Email: ${dealFilterEmail.value.trim()}` })
  if (dealFilterOverdue.value)
    chips.push({ key: 'overdue', label: 'Quá hạn' })
  return chips
})

function matchesDealDateRange(dateStr: string | undefined, range: string): boolean {
  if (!dateStr) return range === 'any'
  const now = new Date()
  const d = new Date(dateStr)
  if (!isNaN(d.getTime())) {
    if (range === 'today') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
    }
    if (range === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return d >= weekAgo
    }
    if (range === 'month') {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }
  } else {
    const s = dateStr.toLowerCase()
    const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    if (range === 'today') return s.includes('phút') || s.includes('giờ') || s.includes('hôm nay')
    if (range === 'week') return s.includes('phút') || s.includes('giờ') || s.includes('hôm nay')
    if (range === 'month') return s.includes(monthNames[now.getMonth()])
  }
  return true
}

const dealFilteredColumns = computed(() => {
  if (!hasDealFilters.value) return columns.value
  const q = dealFilterText.value.trim().toLowerCase()
  const nameQ = dealFilterName.value.trim().toLowerCase()
  const idQ = dealFilterId.value.trim().toLowerCase()
  const phoneQ = dealFilterPhone.value.trim().toLowerCase()
  const emailQ = dealFilterEmail.value.trim().toLowerCase()

  let cols = columns.value
  if (dealFilterStages.value.length) {
    cols = cols.filter((col) => dealFilterStages.value.includes(col.id as DealStage))
  }

  return cols.map((col) => ({
    ...col,
    cards: col.cards.filter((card) => {
      if (q) {
        const hit =
          card.title.toLowerCase().includes(q) ||
          (card.company?.toLowerCase().includes(q) ?? false) ||
          (card.contactName?.toLowerCase().includes(q) ?? false) ||
          (card.assigneeName?.toLowerCase().includes(q) ?? false)
        if (!hit) return false
      }
      if (nameQ && !card.title.toLowerCase().includes(nameQ)) return false
      if (idQ && !card.id.toLowerCase().includes(idQ)) return false
      if (phoneQ && !(card.phone?.toLowerCase().includes(phoneQ) ?? false)) return false
      if (emailQ && !(card.email?.toLowerCase().includes(emailQ) ?? false)) return false
      if (dealFilterSources.value.length && !dealFilterSources.value.includes(card.source ?? '')) return false
      if (dealFilterAssignee.value.trim() && !(card.assigneeName?.toLowerCase().includes(dealFilterAssignee.value.trim().toLowerCase()) ?? false)) return false
      if (dealFilterDateRange.value !== 'any' && !matchesDealDateRange(card.lastActivityAt, dealFilterDateRange.value)) return false
      if (dealFilterOverdue.value && !card.isOverdue) return false
      return true
    }),
  }))
})

function removeDealFilter(key: string): void {
  if (key === 'sources') dealFilterSources.value = []
  if (key === 'stages') dealFilterStages.value = []
  if (key === 'dateRange') dealFilterDateRange.value = 'any'
  if (key === 'assignee') dealFilterAssignee.value = ''
  if (key === 'phone') dealFilterPhone.value = ''
  if (key === 'email') dealFilterEmail.value = ''
  if (key === 'name') dealFilterName.value = ''
  if (key === 'dealId') dealFilterId.value = ''
  if (key === 'overdue') dealFilterOverdue.value = false
  activeDealPreset.value = null
}

function clearDealFilters(): void {
  dealFilterText.value = ''
  dealFilterSources.value = []
  dealFilterStages.value = []
  dealFilterDateRange.value = 'any'
  dealFilterAssignee.value = ''
  dealFilterPhone.value = ''
  dealFilterEmail.value = ''
  dealFilterName.value = ''
  dealFilterId.value = ''
  dealFilterOverdue.value = false
  activeDealPreset.value = 'all'
}

function applyDealPreset(id: string): void {
  clearDealFilters()
  activeDealPreset.value = id
  if (id === 'overdue') dealFilterOverdue.value = true
  else if (id === 'has_assignee') dealFilterAssignee.value = ' '
  else if (id === 'src_website') dealFilterSources.value = ['website']
  else if (id === 'src_inbound') dealFilterSources.value = ['inbound']
  else if (id === 'src_zalo') dealFilterSources.value = ['zalo']
  else if (id === 'src_outbound') dealFilterSources.value = ['outbound']
}

function openDealFilterPanel(): void {
  showDealFilterPanel.value = true
  nextTick(() => dealSearchInputRef.value?.focus())
}

function handleDealOutsideClick(e: MouseEvent): void {
  if (dealSearchBarRef.value && !dealSearchBarRef.value.contains(e.target as Node)) {
    showDealFilterPanel.value = false
  }
}

// ─── Column resize ────────────────────────────────────────────

const kanbanContainerRef = ref<HTMLElement | null>(null)
const colWidths = ref<Record<string, number>>({})

function initColWidths(): void {
  if (!columns.value.length) return
  const equal = 100 / columns.value.length
  const w: Record<string, number> = {}
  columns.value.forEach((col) => { w[col.id] = equal })
  colWidths.value = w
}

const resizingHandle = ref<{ leftId: string; rightId: string; startX: number; startL: number; startR: number } | null>(null)

function startColumnResize(e: MouseEvent, leftId: string, rightId: string): void {
  resizingHandle.value = {
    leftId, rightId, startX: e.clientX,
    startL: colWidths.value[leftId] ?? 0,
    startR: colWidths.value[rightId] ?? 0,
  }
  document.addEventListener('mousemove', onColumnResize)
  document.addEventListener('mouseup', stopColumnResize)
}

function onColumnResize(e: MouseEvent): void {
  if (!resizingHandle.value || !kanbanContainerRef.value) return
  const { leftId, rightId, startX, startL, startR } = resizingHandle.value
  const containerW = kanbanContainerRef.value.getBoundingClientRect().width
  const deltaPct = ((e.clientX - startX) / containerW) * 100
  const minPct = 6
  const newL = Math.max(minPct, Math.min(startL + deltaPct, startL + startR - minPct))
  colWidths.value = { ...colWidths.value, [leftId]: newL, [rightId]: startL + startR - newL }
}

function stopColumnResize(): void {
  resizingHandle.value = null
  document.removeEventListener('mousemove', onColumnResize)
  document.removeEventListener('mouseup', stopColumnResize)
}

// ─── Quick deal state ─────────────────────────────────────────

const quickDealCol = ref<DealStage | null>(null)
const quickDealTitle = ref('')

function openQuickDeal(colId: DealStage): void {
  quickDealCol.value = colId
  quickDealTitle.value = ''
  nextTick(() => {
    const el = document.getElementById(`qdeal-${colId}`)
    el?.focus()
  })
}

// ─── Activity state ───────────────────────────────────────────

const showActivityDialog = ref(false)
const activityTarget = ref<{ dealId: string; dealTitle: string } | null>(null)
const activityType = ref('Ghi chú')
const activityNote = ref('')

function openActivityDialog(dealId: string, dealTitle: string): void {
  activityTarget.value = { dealId, dealTitle }
  activityNote.value = ''
  activityType.value = 'Ghi chú'
  showActivityDialog.value = true
}

function submitActivity(): void {
  toast.success('Đã lưu activity')
  showActivityDialog.value = false
}

// ─── Automation state ─────────────────────────────────────────

const showAutomationDialog = ref(false)
const automationRules = ref<AutomationRule[]>([
  { id: '1', condition: 'Khi deal → Báo giá', action: 'Gửi email nhắc nhở khách hàng', enabled: true },
  { id: '2', condition: 'Khi deal → Thắng', action: 'Tạo task onboarding cho team', enabled: true },
  { id: '3', condition: 'Khi deal quá hạn 7 ngày', action: 'Thông báo cho manager', enabled: false },
  { id: '4', condition: 'Khi deal → Thua', action: 'Tạo lead chăm sóc lại sau 30 ngày', enabled: false },
])

// ─── Deal dialog state ────────────────────────────────────────

const showDealDialog = ref(false)
const isSubmitting = ref(false)
const editingDealId = ref<string | null>(null)

const form = ref<DealForm>({
  title: '', company: '', contact: '', contactTitle: '',
  phone: '', email: '', value: '', closeDate: '',
  stage: 'new', source: 'website', description: '',
})

let socket: ReturnType<typeof getSocket> | null = null

// ─── Helpers ──────────────────────────────────────────────────

function cardInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function isCloseSoon(dateStr: string): boolean {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86_400_000
  return diff >= 0 && diff <= 7
}

function formatCloseDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ─── Multi-select ─────────────────────────────────────────────

function toggleCardSelect(cardId: string): void {
  const s = new Set(selectedCards.value)
  if (s.has(cardId)) s.delete(cardId)
  else s.add(cardId)
  selectedCards.value = s
}

function clearSelection(): void {
  selectedCards.value = new Set()
}

function bulkMoveCards(toStage: DealStage): void {
  const ids = [...selectedCards.value]
  ids.forEach((id) => moveCard(id, toStage))
  clearSelection()
  toast.success(`Đã chuyển ${ids.length} deal sang "${findColumn(toStage)?.name}"`)
}

// ─── Tab / Pipeline ───────────────────────────────────────────

function switchTab(tab: KanbanTab): void {
  if (tab === activeTab.value) return
  activeTab.value = tab
  if (tab === 'deal') {
    kpis.value = []
    void loadKanban()
  }
}

async function switchPipeline(pipelineId: string): Promise<void> {
  selectedPipelineId.value = pipelineId
  showPipelineMenu.value = false
  void loadKanban()
}

// ─── Kanban helpers ───────────────────────────────────────────

function applyKanban(payload: DealsKanbanPayload): void {
  kpis.value = payload.kpis ?? []
  columns.value = payload.columns?.length ? payload.columns : structuredClone(DEFAULT_COLUMNS)
}

function findColumn(stage: DealStage): KanbanColumn | undefined {
  return columns.value.find((col) => col.id === stage)
}

function removeCardById(dealId: string): { card: DealCard; stage: DealStage } | null {
  for (const column of columns.value) {
    const index = column.cards.findIndex((item) => item.id === dealId)
    if (index >= 0) {
      const [card] = column.cards.splice(index, 1)
      return { card, stage: column.id }
    }
  }
  return null
}

function addCardToStage(stage: DealStage, card: DealCard): void {
  const column = findColumn(stage)
  if (!column) return
  column.cards.unshift(card)
}

function moveCard(dealId: string, toStage: DealStage): { fromStage: DealStage; toStage: DealStage } | null {
  const removed = removeCardById(dealId)
  if (!removed) return null
  addCardToStage(toStage, removed.card)
  return { fromStage: removed.stage, toStage }
}

// ─── API ──────────────────────────────────────────────────────

async function loadKanban(showError = true): Promise<void> {
  isLoading.value = true
  const result = await listDealsKanban()
  isLoading.value = false
  if (!result.isSuccess) {
    if (showError) toast.error(result.error || 'Không thể tải dữ liệu Kanban')
    return
  }
  applyKanban(result.data)
}

// ─── Quick Deal ───────────────────────────────────────────────

async function submitQuickDeal(stage: DealStage): Promise<void> {
  const title = quickDealTitle.value.trim()
  quickDealCol.value = null
  quickDealTitle.value = ''
  if (!title) return

  const tempId = `temp-${Date.now()}`
  addCardToStage(stage, {
    id: tempId, title, company: '—', value: '₫ 0',
    source: 'MANUAL', hasActions: true, isOptimistic: true,
  })

  const result = await createDeal({ title, stage })
  if (!result.isSuccess) {
    removeCardById(tempId)
    toast.error(result.error || 'Tạo deal thất bại')
    return
  }
  applyKanban(result.data.kanban)
  toast.success(`Đã tạo deal: ${title}`)
}

// ─── Deal CRUD ────────────────────────────────────────────────

function resetForm(stage: DealStage = 'new'): void {
  form.value = {
    title: '', company: '', contact: '', contactTitle: '',
    phone: '', email: '', value: '', closeDate: '',
    stage, source: 'website', description: '',
  }
}

function openCreateDialog(stage?: DealStage): void {
  editingDealId.value = null
  resetForm(stage ?? 'new')
  showDealDialog.value = true
}

function openEditDialog(card: DealCard, stage: DealStage): void {
  editingDealId.value = card.id
  form.value = {
    title: card.title,
    company: card.company,
    contact: card.contactName ?? '',
    contactTitle: '',
    phone: card.phone ?? '',
    email: card.email ?? '',
    value: card.value.replace(/[^0-9]/g, ''),
    closeDate: card.closeDate ?? '',
    stage,
    source: card.source?.toLowerCase() ?? 'website',
    description: '',
  }
  showDealDialog.value = true
}

async function submitDeal(): Promise<void> {
  const title = form.value.title.trim()
  if (!title) { toast.error('Tên deal là bắt buộc'); return }
  const value = Number(form.value.value || '0')
  if (value < 0) { toast.error('Giá trị phải lớn hơn hoặc bằng 0'); return }

  isSubmitting.value = true

  if (!editingDealId.value) {
    const tempId = `temp-${Date.now()}`
    addCardToStage(form.value.stage, {
      id: tempId, title,
      company: form.value.company || '—',
      contactName: form.value.contact || undefined,
      value: `₫ ${value.toLocaleString('vi-VN')}`,
      source: form.value.source.toUpperCase(),
      phone: form.value.phone || undefined,
      email: form.value.email || undefined,
      closeDate: form.value.closeDate || undefined,
      hasActions: true, isOptimistic: true,
    })

    const result = await createDeal({
      title, company: form.value.company, contact: form.value.contact,
      stage: form.value.stage, value,
      source: form.value.source, description: form.value.description,
    })

    if (!result.isSuccess) {
      removeCardById(tempId)
      isSubmitting.value = false
      toast.error(result.error || 'Tạo deal thất bại')
      return
    }
    applyKanban(result.data.kanban)
    toast.success(`Đã tạo deal: ${title}`)
  } else {
    const dealId = editingDealId.value
    const snapshot = structuredClone(columns.value)
    moveCard(dealId, form.value.stage)
    const card = findColumn(form.value.stage)?.cards.find((c) => c.id === dealId)
    if (card) {
      card.title = title
      card.company = form.value.company || '—'
      card.contactName = form.value.contact || undefined
      card.value = `₫ ${value.toLocaleString('vi-VN')}`
      card.source = form.value.source.toUpperCase()
      card.phone = form.value.phone || undefined
      card.email = form.value.email || undefined
      card.closeDate = form.value.closeDate || undefined
    }

    const result = await updateDeal(dealId, {
      title, company: form.value.company, contact: form.value.contact,
      stage: form.value.stage, value,
      source: form.value.source, description: form.value.description,
    })

    if (!result.isSuccess) {
      columns.value = snapshot
      isSubmitting.value = false
      toast.error(result.error || 'Cập nhật deal thất bại')
      return
    }
    toast.success('Đã cập nhật deal')
    void loadKanban(false)
  }

  isSubmitting.value = false
  showDealDialog.value = false
}

async function removeDeal(dealId: string): Promise<void> {
  const snapshot = structuredClone(columns.value)
  if (!removeCardById(dealId)) return
  const result = await deleteDeal(dealId)
  if (!result.isSuccess) {
    columns.value = snapshot
    toast.error(result.error || 'Xóa deal thất bại')
    return
  }
  toast.success('Đã xóa deal')
}

// ─── Drag-drop ────────────────────────────────────────────────

function handleDragStart(dealId: string, fromStage: DealStage): void {
  dragging.value = { dealId, fromStage }
}

async function handleDrop(toStage: DealStage): Promise<void> {
  if (!dragging.value) return
  const { dealId, fromStage } = dragging.value
  dragging.value = null
  if (fromStage === toStage) return
  const moved = moveCard(dealId, toStage)
  if (!moved) return
  const result = await updateDealStage(dealId, toStage)
  if (!result.isSuccess) {
    moveCard(dealId, fromStage)
    toast.error(result.error || 'Không thể cập nhật giai đoạn')
  }
}

// ─── Realtime ─────────────────────────────────────────────────

function bindRealtime(): void {
  socket = getSocket()
  const sync = () => { if (activeTab.value === 'deal') void loadKanban(false) }
  socket.on('deal.created', sync)
  socket.on('deal.updated', sync)
  socket.on('deal.deleted', sync)
}

const route = useRoute()

onMounted(() => {
  if (route.query.tab === 'lead') activeTab.value = 'lead'
  void loadKanban()
  bindRealtime()
  initColWidths()
  document.addEventListener('click', handleDealOutsideClick)
})

onUnmounted(() => {
  stopColumnResize()
  document.removeEventListener('click', handleDealOutsideClick)
  if (socket) {
    socket.off('deal.created')
    socket.off('deal.updated')
    socket.off('deal.deleted')
  }
  disconnectSocket()
})
</script>

<style scoped>
.kanban-bg {
  background: linear-gradient(
    135deg,
    var(--color-sidebar-bg) 0%,
    color-mix(in srgb, var(--color-sidebar-bg) 35%, white 65%) 100%
  );
}
.dark .kanban-bg {
  background: linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-900) 100%);
}

.kanban-toolbar {
  background: color-mix(in srgb, var(--color-sidebar-bg) 65%, white 35%);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-sidebar-active-border);
}
.dark .kanban-toolbar {
  background: color-mix(in srgb, var(--color-primary-950) 85%, transparent 15%);
  border-bottom: 1px solid var(--color-sidebar-active-border);
}

.kpi-card {
  background: color-mix(in srgb, white 70%, var(--color-sidebar-bg) 30%);
  border: 1px solid var(--color-sidebar-active-border);
  backdrop-filter: blur(4px);
}
.dark .kpi-card {
  background: color-mix(in srgb, var(--color-primary-900) 80%, transparent 20%);
  border: 1px solid var(--color-sidebar-active-border);
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,.04); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.kanban-container {
  display: flex;
  gap: 6px;
  width: 100%;
  height: 100%;
  padding-bottom: 4px;
}

.kanban-column {
  position: relative;
  flex: none;
  min-width: 0;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 14px;
  transform: translateX(50%);
  cursor: col-resize;
  z-index: 20;
  user-select: none;
}

.resize-handle::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  background: transparent;
  border-radius: 1px;
  transition: background 0.15s;
}

.resize-handle:hover::after,
.resize-handle.resize-active::after {
  background: rgba(99, 102, 241, 0.45);
}

@media (max-width: 768px) {
  .kanban-container { overflow-x: auto; }
  .kanban-column { width: 200px !important; }
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
