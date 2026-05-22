<template>
  <div class="flex h-full min-h-0 flex-col">

    <!-- ─── Quick filter chips ───────────────────────────────── -->
    <div class="shrink-0 flex items-center gap-1.5 overflow-x-auto px-4 pt-2 pb-0.5">
      <button
        v-for="f in LEAD_QUICK_FILTERS"
        :key="f.id"
        type="button"
        class="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors"
        :class="activeLeadQuickFilter === f.id
          ? 'bg-white text-gray-900 font-semibold ring-2 ring-gray-400 shadow-sm dark:bg-gray-700 dark:text-white dark:ring-gray-500'
          : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700'"
        @click="activeLeadQuickFilter = f.id"
      >{{ f.name }}</button>
    </div>

    <!-- ─── KPIs ─────────────────────────────────────────────── -->
    <div class="shrink-0 grid grid-cols-3 gap-3 px-4 pt-2">
      <div
        v-for="kpi in leadKpis"
        :key="kpi.label"
        class="kpi-card rounded-xl p-3"
      >
        <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{{ kpi.label }}</p>
        <p class="text-xl font-semibold" :class="kpi.valueClass ?? 'text-gray-900 dark:text-white'">{{ kpi.value }}</p>
      </div>
    </div>

    <!-- ─── Duplicate warning banner ─────────────────────────── -->
    <transition name="slide-down">
      <div
        v-if="showLeadDuplicateBanner"
        class="mx-4 mt-2 shrink-0 flex items-center gap-2 rounded-xl border border-warning-200 bg-warning-50 px-4 py-2.5 dark:border-warning-800/50 dark:bg-warning-900/20"
      >
        <AlertTriangle class="h-4 w-4 shrink-0 text-warning-500" />
        <p class="text-sm text-warning-700 dark:text-warning-400">
          Phát hiện <strong>3 lead</strong> có thể trùng lặp với khách hàng hiện tại.
        </p>
        <button
          class="ml-2 shrink-0 text-xs font-medium text-warning-600 underline underline-offset-2 hover:text-warning-700 dark:text-warning-400"
          @click="$router.push({ path: '/crm-duplicate-check', query: { type: 'lead' } })"
        >Xem ngay</button>
        <button
          class="ml-auto shrink-0 rounded p-0.5 text-warning-400 hover:bg-warning-100 hover:text-warning-600"
          @click="showLeadDuplicateBanner = false"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </transition>

    <!-- ─── Search / Filter bar ─────────────────────────────── -->
    <div ref="searchBarRef" class="relative shrink-0 px-2 pt-2">
      <!-- Input row -->
      <div
        class="flex min-h-[36px] cursor-text items-center gap-1.5 rounded-xl border bg-white px-3 py-1.5 shadow-theme-xs transition-all dark:bg-gray-800"
        :class="showFilterPanel
          ? 'border-primary-400 ring-1 ring-primary-200/60 dark:border-primary-500'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
        @click="openLeadFilterPanel"
      >
        <Search class="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <div class="flex flex-1 flex-wrap items-center gap-1.5">
          <!-- Active filter chips -->
          <span
            v-for="chip in activeLeadFilterChips"
            :key="chip.key"
            class="inline-flex items-center gap-1 rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
          >
            {{ chip.label }}
            <button type="button" class="rounded-full text-primary-400 hover:text-primary-700" @click.stop="removeLeadFilter(chip.key)">
              <X class="h-2.5 w-2.5" />
            </button>
          </span>
          <input
            ref="leadSearchInputRef"
            v-model="leadFilterText"
            placeholder="Tìm kiếm lead..."
            class="min-w-[120px] flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
            @focus="showFilterPanel = true"
            @keydown.escape="showFilterPanel = false"
            @click.stop
          />
        </div>
        <div class="flex shrink-0 items-center gap-0.5">
          <button
            v-if="hasLeadFilters"
            type="button"
            class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            title="Xóa bộ lọc"
            @click.stop="clearLeadFilters"
          >
            <X class="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            class="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="hasLeadFilters ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'"
            @click.stop="showFilterPanel = !showFilterPanel"
          >
            <SlidersHorizontal class="h-3.5 w-3.5" />
            <span v-if="totalLeadFilterCount > 0" class="tabular-nums">{{ totalLeadFilterCount }}</span>
          </button>
        </div>
      </div>

      <!-- Filter panel -->
      <div
        v-if="showFilterPanel"
        class="absolute inset-x-2 top-full z-40 mt-1 flex overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-700 dark:bg-gray-900"
        style="max-height: min(480px, 70vh)"
        @click.stop
      >
        <!-- Left: presets -->
        <div class="flex w-48 shrink-0 flex-col overflow-y-auto border-r border-gray-100 py-2 dark:border-gray-800">
          <p class="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Lọc nhanh</p>
          <button
            v-for="preset in LEAD_FILTER_PRESETS"
            :key="preset.id"
            type="button"
            class="w-full px-3 py-2 text-left text-xs font-medium transition-colors"
            :class="activeLeadPreset === preset.id
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'"
            @click="applyLeadPreset(preset.id)"
          >{{ preset.name }}</button>
        </div>

        <!-- Right: filter fields -->
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-2 gap-5">
            <!-- Nguồn -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Nguồn</p>
              <div class="space-y-1">
                <label
                  v-for="src in LEAD_SOURCES"
                  :key="src.value"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <input type="checkbox" :value="src.value" v-model="leadFilterSources" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                  {{ src.label }}
                </label>
              </div>
            </div>

            <!-- Giai đoạn -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Giai đoạn</p>
              <div class="space-y-1">
                <label
                  v-for="stg in LEAD_STAGES_LIST"
                  :key="stg.value"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <input type="checkbox" :value="stg.value" v-model="leadFilterStages" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                  {{ stg.label }}
                </label>
              </div>
            </div>

            <!-- Trạng thái -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Trạng thái</p>
              <div class="space-y-1">
                <label class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <input type="checkbox" v-model="leadFilterViewed" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                  Đã xem
                </label>
                <label class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <input type="checkbox" v-model="leadFilterHasTask" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                  Có công việc
                </label>
                <label class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <input type="checkbox" v-model="leadFilterRepeat" class="h-3.5 w-3.5 rounded border-gray-300 accent-primary-600" />
                  Repeat
                </label>
              </div>
            </div>

            <!-- Ngày tạo -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Ngày tạo</p>
              <div class="space-y-1">
                <label
                  v-for="opt in DATE_RANGE_OPTIONS"
                  :key="opt.value"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <input type="radio" :value="opt.value" v-model="leadFilterDateRange" class="h-3.5 w-3.5 border-gray-300 accent-primary-600" />
                  {{ opt.label }}
                </label>
              </div>
            </div>

            <!-- Tên lead -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Tên lead</p>
              <input
                v-model="leadFilterName"
                placeholder="Tìm theo tên lead..."
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <!-- Lead ID -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Lead ID</p>
              <input
                v-model="leadFilterId"
                placeholder="Nhập Lead ID..."
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <!-- Người phụ trách -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Người phụ trách</p>
              <input
                v-model="leadFilterAssignee"
                placeholder="Tìm theo tên..."
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <!-- Công ty -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Công ty</p>
              <input
                v-model="leadFilterCompany"
                placeholder="Tìm theo công ty..."
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <!-- Số điện thoại -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Số điện thoại</p>
              <input
                v-model="leadFilterPhone"
                placeholder="Nhập số điện thoại..."
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <!-- Email -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Email</p>
              <input
                v-model="leadFilterEmail"
                placeholder="Nhập email..."
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <button type="button" class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" @click="clearLeadFilters">Xóa bộ lọc</button>
            <button type="button" class="rounded-lg bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800" @click="showFilterPanel = false">Áp dụng</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Board (kanban view) -->
    <div v-if="!props.viewMode || props.viewMode === 'kanban'" class="custom-scrollbar flex-1 overflow-x-auto overflow-y-hidden p-2">
      <div ref="leadContainerRef" class="lead-kanban-container h-full">

        <div
          v-for="(column, colIdx) in filteredColumns"
          :key="column.id"
          class="lead-kanban-column relative flex h-full flex-col"
          :style="{ flexGrow: leadColWidths[column.id] ?? (100 / filteredColumns.length), flexShrink: 0, flexBasis: '0%' }"
          @dragover.prevent
          @drop="handleDrop(column.id)"
        >
          <div
            v-if="colIdx < columns.length - 1"
            class="lead-resize-handle"
            :class="{ 'resize-active': leadResizingHandle?.leftId === column.id }"
            @mousedown.prevent.stop="startLeadResize($event, column.id, columns[colIdx + 1].id)"
          />
          <!-- Column header -->
          <div class="mb-2 overflow-hidden rounded-xl shadow-theme-xs">
            <!-- Title row -->
            <div
              class="flex items-center justify-between px-3 py-2"
              :style="{ background: column.headerBg }"
            >
              <span class="text-sm font-bold text-white drop-shadow-sm">
                {{ column.name }}
                <span class="ml-1 font-normal opacity-80">({{ column.cards.length }})</span>
              </span>
              <button
                type="button"
                class="rounded p-0.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                @click="openCreateDialog(column.id)"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <!-- Total value -->
            <div class="border-b border-gray-200 bg-white/95 px-3 py-2 text-center dark:border-gray-700 dark:bg-gray-800/95">
              <p class="text-base font-bold tabular-nums text-gray-900 dark:text-white">
                {{ column.totalValue }}
              </p>
            </div>

            <!-- Quick Lead (first column only) -->
            <div v-if="column.id === 'lead'" class="bg-white/95 px-3 pb-2 pt-1.5 dark:bg-gray-800/95">
              <button
                type="button"
                class="flex w-full items-center justify-center gap-1.5 rounded-lg bg-success-500 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-success-600"
                @click="openCreateDialog('lead')"
              >
                <Plus class="h-3.5 w-3.5" />
                Quick Lead
              </button>
            </div>
          </div>

          <!-- Card list -->
          <div class="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-0.5">
            <div
              v-if="column.cards.length === 0"
              class="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/30"
            >
              <p class="text-xs italic text-gray-400 dark:text-gray-600">Chưa có lead</p>
            </div>

            <div
              v-for="card in column.cards"
              :key="card.id"
              class="group relative cursor-grab rounded-xl border bg-white shadow-sm transition-all hover:shadow-md active:cursor-grabbing dark:bg-gray-800"
              :class="[
                card.isOptimistic ? 'animate-pulse border-primary-300 dark:border-primary-700' : 'border-gray-200 dark:border-gray-700',
              ]"
              :style="{ borderLeftWidth: '4px', borderLeftColor: column.color ?? '#D1D5DB' }"
              draggable="true"
              @dragstart="handleDragStart(card.id, column.id)"
            >
              <!-- Row 1: Source badge + action buttons -->
              <div class="mb-1.5 flex items-start justify-between gap-1 px-3 pt-3">
                <span
                  v-if="card.source"
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  :style="leadSourceStyle(card.source)"
                >{{ card.source }}</span>
                <span v-else class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-400 dark:bg-gray-700 dark:text-gray-500">—</span>
                <div class="flex shrink-0 items-center gap-1">
                  <span
                    v-if="card.badgeCount"
                    class="flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                  >
                    <MessageSquare class="h-2.5 w-2.5" />{{ card.badgeCount }}
                  </span>
                  <button
                    class="text-gray-300 transition-colors hover:text-primary-500 dark:text-gray-600 dark:hover:text-primary-400"
                    @click.stop="openEditDialog(card, column.id)"
                  ><Pencil class="h-3.5 w-3.5" /></button>
                  <button
                    class="text-gray-300 transition-colors hover:text-error-500 dark:text-gray-600 dark:hover:text-error-400"
                    @click.stop="removeCard(card.id)"
                  ><Trash2 class="h-3.5 w-3.5" /></button>
                </div>
              </div>

              <div class="px-3 pb-2">
                <!-- Title -->
                <RouterLink
                  :to="`/crm-leads/${card.id}`"
                  class="mb-1 block text-sm font-semibold leading-snug text-gray-900 hover:text-primary-500 dark:text-white dark:hover:text-primary-400"
                  @click.stop
                >{{ card.title }}</RouterLink>

                <!-- Assignee + Company -->
                <p v-if="card.assigneeName || card.companyName" class="mb-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="card.assigneeName" class="font-medium" :style="{ color: card.assigneeColor ?? '#465fff' }">{{ card.assigneeName }}</span>
                  <span v-if="card.assigneeName && card.companyName"> · </span>
                  <span v-if="card.companyName" class="font-medium text-primary-500 dark:text-primary-400">{{ card.companyName }}</span>
                </p>

                <!-- Tags row: Repeat, Viewed, HasTask -->
                <div v-if="card.isRepeat || card.isViewed || card.hasTask" class="mb-1.5 flex flex-wrap gap-1">
                  <span v-if="card.isRepeat" class="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">Repeat</span>
                  <span v-if="card.isViewed" class="inline-flex items-center rounded-md border border-success-200 bg-success-50 px-1.5 py-0.5 text-[10px] font-semibold text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">Đã xem</span>
                  <span v-if="card.hasTask" class="inline-flex items-center rounded-md border border-warning-200 bg-warning-50 px-1.5 py-0.5 text-[10px] font-semibold text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">Có task</span>
                </div>

                <!-- Divider -->
                <div class="my-2 border-t border-gray-100 dark:border-gray-700/60" />

                <!-- Footer: quick actions | time + avatar -->
                <div class="flex items-center justify-between gap-1">
                  <div class="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-500 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50"
                      title="Gọi điện"
                      @click.stop
                    ><Phone class="h-3 w-3" /></button>
                    <button
                      type="button"
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      title="Gửi email"
                      @click.stop
                    ><Mail class="h-3 w-3" /></button>
                    <button
                      type="button"
                      class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      title="Nhắn tin"
                      @click.stop
                    ><MessageCircle class="h-3 w-3" /></button>
                    <button
                      class="flex items-center gap-0.5 rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
                      @click.stop
                    >
                      <Plus class="h-3 w-3" />Activity
                    </button>
                  </div>

                  <!-- Time + avatar -->
                  <div class="flex shrink-0 items-center gap-1.5">
                    <span v-if="card.activityTime" class="text-[10px] text-gray-400 dark:text-gray-500">{{ card.activityTime }}</span>
                    <div
                      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      :style="{ background: card.avatarColor ?? '#6B7280' }"
                      :title="card.assigneeName ?? ''"
                    >{{ card.avatarInitials ?? '?' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- List view -->
    <div v-if="props.viewMode === 'list'" class="custom-scrollbar flex-1 overflow-auto p-3">
      <!-- Selection toolbar -->
      <Transition name="fade">
        <div v-if="selectedLeadIds.length > 0" class="mb-2 flex items-center gap-3 rounded-lg border border-error-200 bg-error-50 px-4 py-2 dark:border-error-500/30 dark:bg-error-900/20">
          <span class="text-sm font-medium text-error-600 dark:text-error-400">Đã chọn <strong>{{ selectedLeadIds.length }}</strong> lead</span>
          <button
            class="ml-auto flex items-center gap-1.5 rounded-lg bg-error-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-error-600"
            @click="deleteSelectedLeads"
          >
            <Trash2 class="h-3.5 w-3.5" />
            Xóa đã chọn
          </button>
        </div>
      </Transition>
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
        <!-- Header -->
        <div class="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/90">
          <div class="flex min-w-[800px] items-center gap-3 px-4 py-2.5">
            <input
              type="checkbox"
              class="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-brand-500"
              :checked="allLeadsSelected"
              @change="toggleAllLeads(($event.target as HTMLInputElement).checked)"
            />
            <span class="w-[210px] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Tên lead</span>
            <span class="w-[170px] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Công ty</span>
            <span class="w-[120px] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Giai đoạn</span>
            <span class="w-[90px] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Nguồn</span>
            <span class="w-[120px] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Tags</span>
            <span class="flex-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Phụ trách</span>
            <span class="w-[60px] shrink-0"></span>
          </div>
        </div>
        <!-- Empty state -->
        <div v-if="allLeadCards.length === 0" class="flex items-center justify-center py-12">
          <p class="text-sm text-gray-400 dark:text-gray-600">Không có lead nào phù hợp</p>
        </div>
        <!-- Rows -->
        <div
          v-for="(item, idx) in allLeadCards"
          :key="item.id"
          class="group flex min-w-[800px] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-700/40"
          :class="[
            idx !== allLeadCards.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/50' : '',
            selectedLeadIds.includes(item.id) ? 'bg-brand-50/60 dark:bg-brand-900/10' : '',
          ]"
          :style="{ borderLeft: `3px solid ${item.stageColor}` }"
        >
          <!-- Checkbox -->
          <input
            type="checkbox"
            class="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-brand-500"
            :checked="selectedLeadIds.includes(item.id)"
            @change="toggleLeadRow(item.id, ($event.target as HTMLInputElement).checked)"
            @click.stop
          />
          <!-- Name -->
          <div class="w-[210px] min-w-0 shrink-0">
            <RouterLink
              :to="`/crm-leads/${item.id}`"
              class="block truncate text-sm font-semibold text-gray-900 hover:text-primary-500 dark:text-white dark:hover:text-primary-400"
              @click.stop
            >{{ item.title }}</RouterLink>
          </div>
          <!-- Company -->
          <div class="w-[170px] min-w-0 shrink-0">
            <p v-if="item.companyName" class="truncate text-sm text-gray-700 dark:text-gray-300">{{ item.companyName }}</p>
            <span v-else class="text-xs text-gray-300 dark:text-gray-600">—</span>
          </div>
          <!-- Stage -->
          <div class="w-[120px] shrink-0">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
              :style="{ background: item.stageColor + '22', color: item.stageColor }"
            >{{ item.stageName }}</span>
          </div>
          <!-- Source -->
          <div class="w-[90px] shrink-0">
            <span
              v-if="item.source"
              class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
              :style="leadSourceStyle(item.source)"
            >{{ item.source }}</span>
            <span v-else class="text-xs text-gray-300 dark:text-gray-600">—</span>
          </div>
          <!-- Tags -->
          <div class="flex w-[120px] shrink-0 flex-wrap gap-1">
            <span v-if="item.isRepeat" class="inline-flex items-center rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400">Repeat</span>
            <span v-if="item.isViewed" class="inline-flex items-center rounded-md border border-success-200 bg-success-50 px-1.5 py-0.5 text-[10px] font-semibold text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">Đã xem</span>
            <span v-if="item.hasTask" class="inline-flex items-center rounded-md border border-warning-200 bg-warning-50 px-1.5 py-0.5 text-[10px] font-semibold text-warning-600 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-400">Có task</span>
            <span v-if="!item.isRepeat && !item.isViewed && !item.hasTask" class="text-xs text-gray-300 dark:text-gray-600">—</span>
          </div>
          <!-- Assignee -->
          <div class="flex min-w-0 flex-1 items-center gap-1.5">
            <div
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
              :style="{ background: item.avatarColor ?? '#6B7280' }"
              :title="item.assigneeName ?? ''"
            >{{ item.avatarInitials ?? '?' }}</div>
            <span v-if="item.assigneeName" class="truncate text-xs text-gray-500 dark:text-gray-400">{{ item.assigneeName }}</span>
            <span v-else class="text-xs text-gray-300 dark:text-gray-600">—</span>
          </div>
          <!-- Actions -->
          <div class="flex w-[60px] shrink-0 items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              class="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-500 dark:hover:bg-gray-700"
              @click.stop="openEditDialog(item, item.stageId)"
            ><Pencil class="h-3.5 w-3.5" /></button>
            <button
              class="rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-900/20"
              @click.stop="removeCard(item.id)"
            ><Trash2 class="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar view — Priority Action List -->
    <div v-if="props.viewMode === 'calendar'" class="custom-scrollbar flex-1 overflow-auto p-4">

      <!-- Stats + filter bar -->
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            v-if="leadCalendarActions.filter(a => !a.done && a.priority === 'urgent').length"
            class="flex items-center gap-1.5 rounded-xl bg-error-50 px-3 py-1.5 dark:bg-error-900/20"
          >
            <span class="h-2 w-2 rounded-full bg-error-500"></span>
            <span class="text-xs font-semibold text-error-600 dark:text-error-400">
              {{ leadCalendarActions.filter(a => !a.done && a.priority === 'urgent').length }} khẩn cấp
            </span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold text-gray-700 dark:text-gray-300">{{ leadCalendarActions.filter(a => !a.done).length }}</span>
            việc chưa xử lý
          </span>
        </div>
        <!-- Filter tabs -->
        <div class="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
          <button
            v-for="f in LEAD_CALENDAR_FILTERS"
            :key="f.id"
            type="button"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            :class="leadCalendarFilter === f.id
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="leadCalendarFilter = f.id"
          >{{ f.name }}</button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredLeadCalendarActions.length === 0"
        class="flex flex-col items-center justify-center gap-3 py-20 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 dark:bg-success-900/20">
          <CheckCircle2 class="h-7 w-7 text-success-500" />
        </div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">Tất cả đã xử lý!</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">Không còn việc nào cần xử lý trong bộ lọc này</p>
      </div>

      <!-- Action list -->
      <div v-else class="space-y-2">
        <div
          v-for="action in filteredLeadCalendarActions"
          :key="action.id"
          class="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-theme-xs transition-all dark:border-gray-700 dark:bg-gray-800"
          :class="['border-l-[3px]', LEAD_PRIORITY_BORDER[action.priority], action.done ? 'opacity-55' : '']"
        >
          <!-- Priority badge -->
          <span
            class="shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            :class="LEAD_PRIORITY_BADGE[action.priority]"
          >{{ LEAD_PRIORITY_LABEL[action.priority] }}</span>

          <!-- Action type badge -->
          <span
            class="shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold"
            :class="LEAD_ACTION_TYPE_BADGE[action.type] ?? 'bg-gray-100 text-gray-600'"
          >{{ action.type }}</span>

          <!-- Description + linked lead -->
          <div class="min-w-0 flex-1">
            <p
              class="truncate text-sm font-medium"
              :class="action.done
                ? 'text-gray-400 line-through dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-200'"
            >{{ action.description }}</p>
            <div class="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <RouterLink
                :to="`/crm-leads/${action.leadId}`"
                class="truncate font-medium text-brand-500 hover:underline dark:text-brand-400"
              >{{ action.leadTitle }}</RouterLink>
              <span v-if="action.company">· {{ action.company }}</span>
            </div>
          </div>

          <!-- Due date -->
          <div class="w-[110px] shrink-0 text-right">
            <p
              class="text-xs font-medium"
              :class="action.done
                ? 'text-gray-400 dark:text-gray-500'
                : action.isOverdue
                  ? 'text-error-500'
                  : isCloseSoon(action.dueDate) ? 'text-warning-500' : 'text-gray-600 dark:text-gray-400'"
            >
              <Calendar class="mr-0.5 inline-block h-3 w-3" />
              {{ formatCloseDate(action.dueDate) }}
            </p>
            <p
              class="mt-0.5 text-[10px]"
              :class="action.done
                ? 'text-gray-300 dark:text-gray-600'
                : action.isOverdue
                  ? 'text-error-400'
                  : isCloseSoon(action.dueDate) ? 'text-warning-400' : 'text-gray-400 dark:text-gray-500'"
            >{{ action.done ? 'Đã xong' : daysLabel(action.dueDate) }}</p>
          </div>

          <!-- Assignee -->
          <div class="flex w-[130px] shrink-0 items-center gap-1.5">
            <div
              v-if="action.assigneeName"
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-800"
              :style="{ background: action.assigneeColor || '#6B7280' }"
              :title="action.assigneeName"
            >{{ cardInitials(action.assigneeName) }}</div>
            <span v-if="action.assigneeName" class="truncate text-xs text-gray-500 dark:text-gray-400">
              {{ action.assigneeName }}
            </span>
          </div>

          <!-- Done button — checkmark chỉ hiện khi đã xử lý -->
          <button
            type="button"
            class="shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
            :class="action.done
              ? 'border-success-300 bg-success-50 text-success-600 dark:border-success-600 dark:bg-success-900/20 dark:text-success-400'
              : 'border-gray-200 bg-white text-gray-500 hover:border-success-300 hover:bg-success-50 hover:text-success-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-success-600 dark:hover:bg-success-900/20 dark:hover:text-success-400'"
            @click="markLeadActionDone(action.id)"
          >
            <span :class="[
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
              action.done
                ? 'border-success-500 bg-success-500'
                : 'border-gray-300 bg-white dark:border-gray-500 dark:bg-transparent'
            ]">
              <Check v-if="action.done" class="h-2.5 w-2.5 text-white" />
            </span>
            Đã xử lý
          </button>
        </div>
      </div>

    </div>

    <!-- ─── Lead Stage Settings Dialog ─────────────────────────── -->
    <Dialog :open="showLeadStageSettings" @update:open="val => { showLeadStageSettings = val; leadColorPickerIdx = null; showAddLeadStageForm = false; showLeadAddFieldForm = false }">
      <DialogContent class="sm:max-w-lg max-h-[85vh] overflow-y-auto" @click="leadColorPickerIdx = null">
        <DialogHeader>
          <DialogTitle class="text-base font-semibold text-gray-900 dark:text-white">Cài đặt Lead</DialogTitle>
          <DialogDescription class="sr-only">Quản lý giai đoạn và trường thông tin lead</DialogDescription>
        </DialogHeader>

        <!-- Tab switcher -->
        <div class="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors"
            :class="leadSettingsTab === 'stages'
              ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="leadSettingsTab = 'stages'"
          >Giai đoạn</button>
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors"
            :class="leadSettingsTab === 'fields'
              ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="leadSettingsTab = 'fields'"
          >Trường thông tin</button>
        </div>

        <!-- ─── Tab: Giai đoạn ─────────────────────────────────── -->
        <div v-show="leadSettingsTab === 'stages'">
          <!-- Stage list -->
          <div class="max-h-[220px] space-y-1.5 overflow-y-auto py-1 pr-1">
            <div
              v-for="(stage, idx) in leadStageDraft"
              :key="stage.id"
              :draggable="true"
              :class="[
                'flex items-center gap-2 rounded-lg border px-3 py-2 transition-all select-none',
                leadDragIdx === idx ? 'opacity-40' : '',
                leadDragOverIdx === idx && leadDragIdx !== idx
                  ? 'border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50',
              ]"
              @dragstart="onLeadDragStart(idx)"
              @dragover="onLeadDragOver($event, idx)"
              @drop.prevent="onLeadDrop(idx)"
              @dragend="onLeadDragEnd"
            >
              <GripVertical class="h-4 w-4 shrink-0 cursor-grab text-gray-300 dark:text-gray-600" />

              <div class="relative shrink-0">
                <button
                  type="button"
                  class="h-6 w-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-110 dark:border-gray-700 dark:ring-gray-600"
                  :style="{ background: stage.color }"
                  title="Chọn màu"
                  @click.stop="leadColorPickerIdx = leadColorPickerIdx === idx ? null : idx"
                />
                <transition name="fade">
                  <div
                    v-if="leadColorPickerIdx === idx"
                    class="absolute left-0 top-full z-20 mt-1.5 grid grid-cols-5 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-700 dark:bg-gray-900"
                    @click.stop
                  >
                    <button
                      v-for="entry in STAGE_COLOR_PALETTE"
                      :key="entry.color"
                      type="button"
                      class="h-5 w-5 rounded-full transition-transform hover:scale-125"
                      :style="{ background: entry.color, outline: stage.color === entry.color ? `2px solid ${entry.color}` : 'none', outlineOffset: '2px' }"
                      @click.stop="stage.color = entry.color; stage.headerBg = entry.gradient; leadColorPickerIdx = null"
                    />
                  </div>
                </transition>
              </div>

              <input
                v-model="stage.name"
                class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                placeholder="Tên giai đoạn"
                maxlength="40"
                @keyup.enter="stage.name.trim() !== (leadStageOrigNames[stage.id] ?? '') && saveLeadStageName(stage)"
              />

              <button
                v-if="stage.name.trim() && stage.name.trim() !== (leadStageOrigNames[stage.id] ?? '')"
                type="button"
                class="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-success-600 transition-colors hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-900/20"
                title="Lưu tên"
                @click.stop="saveLeadStageName(stage)"
              >✓ Lưu</button>

              <button
                type="button"
                class="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-error-50 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-error-900/20"
                :disabled="leadStageDraft.length <= 1"
                :title="leadStageDraft.length <= 1 ? 'Pipeline phải có ít nhất 1 giai đoạn' : 'Xóa giai đoạn'"
                @click="removeLeadStage(idx)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <!-- Bottom section: sub-form / add button / footer -->
          <div class="shrink-0 space-y-3 pt-1">
            <transition name="fade">
              <div
                v-if="showAddLeadStageForm"
                class="rounded-xl border border-brand-200 bg-brand-50/60 p-3 space-y-3 dark:border-brand-700/60 dark:bg-brand-900/20"
                @click.stop
              >
                <p class="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Giai đoạn mới</p>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tên giai đoạn</label>
                  <input
                    v-model="newLeadStageName"
                    class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                    placeholder="VD: Đang thương lượng"
                    maxlength="40"
                    @keyup.enter="confirmAddLeadStage"
                    @keyup.esc="showAddLeadStageForm = false; newLeadStageName = ''"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Vị trí</label>
                  <select
                    v-model="newLeadStagePosition"
                    class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="first">Đứng đầu tiên</option>
                    <option v-for="s in leadStageDraft" :key="s.id" :value="s.id">Sau: {{ s.name || '(chưa đặt tên)' }}</option>
                    <option value="last">Cuối danh sách</option>
                  </select>
                </div>
                <div class="flex justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    @click="showAddLeadStageForm = false; newLeadStageName = ''"
                  >Hủy</button>
                  <button
                    v-if="newLeadStageName.trim()"
                    type="button"
                    class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    @click="confirmAddLeadStage"
                  >Lưu</button>
                </div>
              </div>
            </transition>

            <button
              v-if="!showAddLeadStageForm"
              type="button"
              class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:text-brand-400"
              @click="showAddLeadStageForm = true; newLeadStagePosition = 'last'"
            >
              <Plus class="h-4 w-4" />
              Thêm giai đoạn mới
            </button>

            <DialogFooter class="gap-2">
              <Button variant="outline" @click="showLeadStageSettings = false; showAddLeadStageForm = false">Hủy</Button>
              <Button class="bg-brand-500 text-white hover:bg-brand-600" @click="saveLeadStages">Lưu thay đổi</Button>
            </DialogFooter>
          </div>
        </div>

        <!-- ─── Tab: Trường thông tin ──────────────────────────── -->
        <div v-show="leadSettingsTab === 'fields'" class="space-y-3">

          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              v-model="leadFieldSearchQuery"
              placeholder="Tìm trường..."
              class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Field groups -->
          <div class="max-h-[320px] space-y-2 overflow-y-auto pr-1">
            <div v-for="group in filteredLeadFieldGroups" :key="group.section.id">
              <!-- Section header -->
              <div class="mb-1 flex items-center justify-between">
                <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {{ group.section.name }}
                  <span class="ml-1 font-normal text-gray-400">({{ group.total }})</span>
                </span>
                <button
                  v-if="leadCustomFieldStore.customSections.some(s => s.id === group.section.id)"
                  type="button"
                  class="rounded p-0.5 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-500"
                  title="Xoá nhóm"
                  @click="leadCustomFieldStore.deleteSection(group.section.id)"
                >
                  <Trash2 class="h-3 w-3" />
                </button>
              </div>

              <!-- Static fields -->
              <div
                v-for="field in group.staticFields"
                :key="field.fieldId"
                class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <template v-if="leadFieldEditingId === field.fieldId">
                  <input
                    v-model="leadFieldEditingLabel"
                    class="h-7 flex-1 rounded-md border border-brand-300 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-brand-100 dark:border-brand-600 dark:bg-gray-800 dark:text-white"
                    @keyup.enter="saveLeadFieldEdit(field.fieldId, false)"
                    @keyup.escape="cancelLeadFieldEdit"
                    autofocus
                  />
                  <button type="button" class="rounded p-1 text-success-500 hover:bg-success-50" title="Lưu" @click="saveLeadFieldEdit(field.fieldId, false)">
                    <Check class="h-3.5 w-3.5" />
                  </button>
                  <button type="button" class="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Huỷ" @click="cancelLeadFieldEdit">
                    <X class="h-3.5 w-3.5" />
                  </button>
                </template>

                <template v-else-if="leadFieldDeleteConfirmId !== field.fieldId">
                  <span class="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {{ leadCustomFieldStore.getStaticLabel(field.fieldId, field.labelVI) }}
                  </span>
                  <span
                    v-if="leadCustomFieldStore.isStaticRequired(field.fieldId, !!field.required)"
                    class="shrink-0 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-500 dark:bg-brand-900/30"
                  >bắt buộc</span>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                    title="Sửa tên"
                    @click="startLeadEditField(field.fieldId, leadCustomFieldStore.getStaticLabel(field.fieldId, field.labelVI))"
                  ><Pencil class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 transition-colors"
                    :class="leadCustomFieldStore.isStaticRequired(field.fieldId, !!field.required)
                      ? 'text-error-500 hover:bg-error-50'
                      : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700'"
                    title="Bắt buộc"
                    @click="toggleLeadFieldRequired(field.fieldId, false, leadCustomFieldStore.isStaticRequired(field.fieldId, !!field.required))"
                  ><Asterisk class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-500"
                    title="Xoá trường"
                    @click="startLeadDeleteField(field.fieldId)"
                  ><Trash2 class="h-3.5 w-3.5" /></button>
                </template>

                <template v-else>
                  <span class="flex-1 text-xs text-error-600 dark:text-error-400">Xoá trường này?</span>
                  <button
                    type="button"
                    class="rounded px-2 py-0.5 text-xs font-medium bg-error-500 text-white hover:bg-error-600"
                    @click="confirmLeadDeleteField(field.fieldId, false)"
                  >Xoá</button>
                  <button
                    type="button"
                    class="rounded px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="cancelLeadDeleteField"
                  >Huỷ</button>
                </template>
              </div>

              <!-- Custom fields -->
              <div
                v-for="field in group.customFields"
                :key="field.id"
                class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <template v-if="leadFieldEditingId === field.id">
                  <input
                    v-model="leadFieldEditingLabel"
                    class="h-7 flex-1 rounded-md border border-brand-300 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-brand-100 dark:border-brand-600 dark:bg-gray-800 dark:text-white"
                    @keyup.enter="saveLeadFieldEdit(field.id, true)"
                    @keyup.escape="cancelLeadFieldEdit"
                    autofocus
                  />
                  <button type="button" class="rounded p-1 text-success-500 hover:bg-success-50" title="Lưu" @click="saveLeadFieldEdit(field.id, true)">
                    <Check class="h-3.5 w-3.5" />
                  </button>
                  <button type="button" class="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Huỷ" @click="cancelLeadFieldEdit">
                    <X class="h-3.5 w-3.5" />
                  </button>
                </template>

                <template v-else-if="leadFieldDeleteConfirmId !== field.id">
                  <span class="flex-1 text-sm text-gray-700 dark:text-gray-300">{{ field.label }}</span>
                  <span class="shrink-0 rounded-full bg-success-50 px-1.5 py-0.5 text-[10px] text-success-600 dark:bg-success-900/20">tuỳ chỉnh</span>
                  <span v-if="field.required" class="shrink-0 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-500 dark:bg-brand-900/30">bắt buộc</span>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                    title="Sửa tên"
                    @click="startLeadEditField(field.id, field.label)"
                  ><Pencil class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 transition-colors"
                    :class="field.required
                      ? 'text-error-500 hover:bg-error-50'
                      : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700'"
                    title="Bắt buộc"
                    @click="toggleLeadFieldRequired(field.id, true, !!field.required)"
                  ><Asterisk class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-500"
                    title="Xoá trường"
                    @click="startLeadDeleteField(field.id)"
                  ><Trash2 class="h-3.5 w-3.5" /></button>
                </template>

                <template v-else>
                  <span class="flex-1 text-xs text-error-600 dark:text-error-400">Xoá trường này?</span>
                  <button
                    type="button"
                    class="rounded px-2 py-0.5 text-xs font-medium bg-error-500 text-white hover:bg-error-600"
                    @click="confirmLeadDeleteField(field.id, true)"
                  >Xoá</button>
                  <button
                    type="button"
                    class="rounded px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    @click="cancelLeadDeleteField"
                  >Huỷ</button>
                </template>
              </div>
            </div>

            <p v-if="filteredLeadFieldGroups.length === 0" class="py-4 text-center text-sm text-gray-400">
              Không tìm thấy trường phù hợp
            </p>
          </div>

          <!-- Add field form -->
          <div
            v-if="showLeadAddFieldForm"
            class="space-y-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3 dark:border-brand-700/60 dark:bg-brand-900/20"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Trường mới</p>

            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tên trường <span class="text-error-500">*</span></label>
              <input
                v-model="newLeadFieldLabel"
                placeholder="VD: Ngân sách khách hàng"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                @keyup.enter="addLeadCustomField"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Loại dữ liệu</label>
                <select
                  v-model="newLeadFieldType"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  @change="newLeadFieldOptions = []; newLeadFieldOptionInput = ''"
                >
                  <option value="string">Văn bản</option>
                  <option value="double">Số</option>
                  <option value="date">Ngày</option>
                  <option value="single_select">Danh sách 1 lựa chọn</option>
                  <option value="multi_select">Danh sách nhiều lựa chọn</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Thuộc nhóm <span class="text-error-500">*</span></label>
                <select
                  v-model="newLeadFieldSectionId"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  @change="newLeadFieldIsNewSection = newLeadFieldSectionId === '__new__'"
                >
                  <option value="" disabled>Chọn nhóm...</option>
                  <option v-for="s in allLeadSectionsForFields" :key="s.id" :value="s.id">{{ s.name }}</option>
                  <option value="__new__">+ Tạo nhóm mới...</option>
                </select>
              </div>
            </div>

            <!-- Type hint panel -->
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800/60">
              <div class="mb-1 flex items-center gap-1.5">
                <component :is="LEAD_FIELD_TYPE_HINTS[newLeadFieldType].icon" class="h-3.5 w-3.5 text-brand-500" />
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ LEAD_FIELD_TYPE_HINTS[newLeadFieldType].label }}</span>
              </div>
              <p class="mb-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{{ LEAD_FIELD_TYPE_HINTS[newLeadFieldType].desc }}</p>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="ex in LEAD_FIELD_TYPE_HINTS[newLeadFieldType].examples"
                  :key="ex"
                  type="button"
                  class="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] text-gray-500 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-brand-400"
                  :title="`Dùng '${ex}' làm tên trường`"
                  @click="newLeadFieldLabel = !newLeadFieldLabel.trim() ? ex : newLeadFieldLabel"
                >{{ ex }}</button>
              </div>

              <!-- Options editor for list types -->
              <template v-if="newLeadFieldType === 'single_select' || newLeadFieldType === 'multi_select'">
                <div class="mt-2.5 border-t border-gray-200 pt-2.5 dark:border-gray-700">
                  <div class="mb-1.5 flex items-center justify-between">
                    <label class="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      Các lựa chọn
                      <span v-if="newLeadFieldOptions.length" class="ml-1 text-gray-400">({{ newLeadFieldOptions.length }})</span>
                    </label>
                  </div>
                  <div v-if="newLeadFieldOptions.length" class="mb-1.5 flex flex-wrap gap-1">
                    <span
                      v-for="(opt, i) in newLeadFieldOptions"
                      :key="i"
                      class="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                    >
                      {{ opt }}
                      <button type="button" class="text-brand-400 hover:text-brand-700 dark:hover:text-brand-300" @click="newLeadFieldOptions.splice(i, 1)">
                        <X class="h-2.5 w-2.5" />
                      </button>
                    </span>
                  </div>
                  <div class="flex gap-1.5">
                    <input
                      v-model="newLeadFieldOptionInput"
                      placeholder="Thêm lựa chọn và nhấn Enter..."
                      class="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      @keyup.enter="addLeadFieldOptionTag"
                      @keydown.comma.prevent="addLeadFieldOptionTag"
                    />
                    <button
                      type="button"
                      class="rounded-md bg-brand-500 px-2 py-1 text-xs text-white hover:bg-brand-600"
                      @click="addLeadFieldOptionTag"
                    ><Plus class="h-3 w-3" /></button>
                  </div>
                </div>
              </template>
            </div>

            <div v-if="newLeadFieldIsNewSection" class="space-y-1">
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tên nhóm mới <span class="text-error-500">*</span></label>
              <input
                v-model="newLeadFieldNewSectionName"
                placeholder="VD: Thông tin bổ sung"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                @click="showLeadAddFieldForm = false; newLeadFieldLabel = ''; newLeadFieldIsNewSection = false"
              >Huỷ</button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
                :disabled="!newLeadFieldLabel.trim() || (!newLeadFieldSectionId && !newLeadFieldIsNewSection) || (newLeadFieldIsNewSection && !newLeadFieldNewSectionName.trim())"
                @click="addLeadCustomField"
              >Thêm trường</button>
            </div>
          </div>

          <!-- Toggle add button -->
          <button
            v-if="!showLeadAddFieldForm"
            type="button"
            class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:text-brand-400"
            @click="showLeadAddFieldForm = true"
          >
            <Plus class="h-4 w-4" />
            Thêm trường thông tin mới
          </button>

          <DialogFooter>
            <Button variant="outline" @click="showLeadStageSettings = false">Đóng</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Create / Edit Lead Dialog -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent class="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader class="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingId ? 'Cập nhật Lead' : 'Tạo Lead mới' }}
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-500 dark:text-gray-400">
            Điền thông tin để thêm lead vào CRM
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-4">
          <div class="space-y-1.5">
            <Label for="l-title">Tên lead <span class="text-error-500">*</span></Label>
            <Input id="l-title" v-model="form.title" placeholder="Họ tên hoặc tên cơ hội" />
          </div>

          <!-- Customer type toggle -->
          <div class="space-y-1.5">
            <Label>Loại khách hàng</Label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all"
                :class="form.customerType === 'company'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600'"
                @click="form.customerType = 'company'"
              >
                <Building2 class="h-4 w-4 shrink-0" />
                Công ty
              </button>
              <button
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all"
                :class="form.customerType === 'household'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600'"
                @click="form.customerType = 'household'; form.contactTitle = ''"
              >
                <Store class="h-4 w-4 shrink-0" />
                Hộ kinh doanh
              </button>
              <button
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all"
                :class="form.customerType === 'individual'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600'"
                @click="form.customerType = 'individual'; form.companyName = ''; form.contactTitle = ''"
              >
                <User class="h-4 w-4 shrink-0" />
                Cá nhân
              </button>
            </div>
          </div>

          <!-- Company customer fields -->
          <template v-if="form.customerType === 'company'">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label for="l-company">Tên công ty</Label>
                <Input id="l-company" v-model="form.companyName" placeholder="VD: Tập đoàn Vinhomes" />
              </div>
              <div class="space-y-1.5">
                <Label for="l-contact">Người liên hệ</Label>
                <Input id="l-contact" v-model="form.contactName" placeholder="Họ và tên" />
              </div>
            </div>
            <div class="space-y-1.5">
              <Label for="l-contact-title">Chức vụ người liên hệ</Label>
              <Input id="l-contact-title" v-model="form.contactTitle" placeholder="VD: Giám đốc mua hàng, Trưởng phòng IT" />
            </div>
          </template>

          <!-- Household business fields -->
          <template v-else-if="form.customerType === 'household'">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label for="l-hkd-name">Tên hộ kinh doanh</Label>
                <Input id="l-hkd-name" v-model="form.companyName" placeholder="VD: Cửa hàng Minh Phát" />
              </div>
              <div class="space-y-1.5">
                <Label for="l-hkd-contact">Chủ hộ / Người liên hệ</Label>
                <Input id="l-hkd-contact" v-model="form.contactName" placeholder="Họ và tên" />
              </div>
            </div>
          </template>

          <!-- Individual customer fields -->
          <template v-else>
            <div class="space-y-1.5">
              <Label for="l-contact">Tên khách hàng</Label>
              <Input id="l-contact" v-model="form.contactName" placeholder="Họ và tên khách hàng" />
            </div>
          </template>

          <!-- Common: phone + email -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="l-phone">Số điện thoại</Label>
              <Input id="l-phone" v-model="form.phone" type="tel" placeholder="0901 234 567" />
            </div>
            <div class="space-y-1.5">
              <Label for="l-email">Email</Label>
              <Input id="l-email" v-model="form.email" type="email" placeholder="email@congty.com" />
            </div>
          </div>

          <!-- Assignee -->
          <div class="space-y-1.5">
            <Label for="l-assignee">Người phụ trách</Label>
            <Input id="l-assignee" v-model="form.assigneeName" placeholder="Tên nhân viên phụ trách" />
          </div>
          <!-- Team Lead -->
          <div class="space-y-1.5">
            <Label for="l-teamlead">Team Lead quản lý</Label>
            <Input id="l-teamlead" v-model="form.teamLeadName" placeholder="Tên team lead" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label>Giai đoạn <span class="text-error-500">*</span></Label>
              <Select v-model="form.stage">
                <SelectTrigger><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="col in columns" :key="col.id" :value="col.id">
                    {{ col.name }}
                  </SelectItem>
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
                  <SelectItem value="zalo">Zalo</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button variant="outline" @click="showDialog = false">Hủy</Button>
          <Button class="bg-primary-700 text-white hover:bg-primary-800" @click="submitForm">
            {{ editingId ? 'Lưu thay đổi' : 'Tạo Lead' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete confirmation dialog -->
    <Dialog :open="showDeleteConfirm" @update:open="showDeleteConfirm = $event">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-error-600 dark:text-error-400">
            <span class="material-symbols-outlined text-[20px]">delete_forever</span>
            Xóa Lead
          </DialogTitle>
          <DialogDescription class="text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa lead này? Hành động này <span class="font-semibold text-gray-800 dark:text-gray-200">không thể hoàn tác</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2 pt-2">
          <Button variant="outline" @click="showDeleteConfirm = false">Hủy</Button>
          <Button class="bg-error-500 text-white hover:bg-error-600" @click="confirmDeleteLead">
            Xác nhận xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  AlignLeft,
  AlertTriangle,
  Asterisk,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  GripVertical,
  Hash,
  ListChecks,
  Mail,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Store,
  Trash2,
  User,
  X,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
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
import { useLeadCustomFieldStore, type CustomFieldType } from '@/stores/useLeadCustomFieldStore'
import { LEAD_SECTIONS, LEAD_FIELDS } from '@/types/leadFields'

const props = withDefaults(defineProps<{
  viewMode?: 'kanban' | 'list' | 'calendar'
}>(), {
  viewMode: 'kanban',
})

const router = useRouter()

// ─── Quick filters ────────────────────────────────────────────

const LEAD_QUICK_FILTERS = [
  { id: 'all',       name: 'Tất cả' },
  { id: 'my',        name: 'Của tôi' },
  { id: 'planned',   name: 'Có kế hoạch' },
  { id: 'overdue',   name: '⚠ Quá hạn' },
  { id: 'hot',       name: '🔥 Hot' },
  { id: 'this_week', name: 'Tuần này' },
] as const

const activeLeadQuickFilter = ref('all')
const showLeadDuplicateBanner = ref(true)

// ─── List selection ────────────────────────────────────────────
const selectedLeadIds = ref<string[]>([])
const allLeadsSelected = computed(() =>
  allLeadCards.value.length > 0 && allLeadCards.value.every(l => selectedLeadIds.value.includes(l.id))
)
const someLeadsSelected = computed(() =>
  selectedLeadIds.value.length > 0 && !allLeadsSelected.value
)

// ─── Source badge style ────────────────────────────────────────

const LEAD_SOURCE_STYLE: Record<string, { background: string; color: string }> = {
  INBOUND:  { background: 'var(--source-inbound-bg)',  color: 'var(--source-inbound-text)'  },
  OUTBOUND: { background: 'var(--source-outbound-bg)', color: 'var(--source-outbound-text)' },
  REFERRAL: { background: 'var(--source-referral-bg)', color: 'var(--source-referral-text)' },
  WEBSITE:  { background: 'var(--source-website-bg)',  color: 'var(--source-website-text)'  },
  EVENT:    { background: 'var(--source-event-bg)',    color: 'var(--source-event-text)'    },
  ZALO:     { background: '#E0F2FE', color: '#0369A1' },
  FACEBOOK: { background: '#EFF6FF', color: '#1D4ED8' },
}

function leadSourceStyle(source: string | undefined): { background: string; color: string } {
  if (!source) return { background: '#F3F4F6', color: '#6B7280' }
  return LEAD_SOURCE_STYLE[source.toUpperCase()] ?? { background: '#F3F4F6', color: '#374151' }
}

const LEAD_COL_ACCENT: Record<string, string> = {
  lead:        '#8B5CF6',
  mql:         '#10B981',
  sql:         '#0D9488',
  opportunity: '#0EA5E9',
  customer:    '#3B82F6',
  evangelist:  '#6366F1',
}

// ─── Types ────────────────────────────────────────────────────

type LeadStage = 'lead' | 'mql' | 'sql' | 'opportunity' | 'customer' | 'evangelist'

interface LeadCard {
  id: string
  title: string
  isRepeat?: boolean
  assigneeName?: string
  assigneeColor?: string
  teamLeadName?: string
  companyName?: string
  contactName?: string
  contactTitle?: string
  date: string
  hasTask?: boolean
  isViewed?: boolean
  activityTime?: string
  avatarInitials?: string
  avatarColor?: string
  badgeCount: number
  phone?: string
  email?: string
  source?: string
  isOptimistic?: boolean
}

interface LeadColumn {
  id: string          // loosened from LeadStage to support dynamic stages
  name: string
  headerBg: string
  color: string       // main accent color
  totalValue: string
  cards: LeadCard[]
}

interface StageDraft {
  id: string
  name: string
  color: string
  headerBg: string
  isNew?: boolean
}

interface LeadForm {
  customerType: 'company' | 'household' | 'individual'
  title: string
  assigneeName: string
  teamLeadName: string
  companyName: string
  contactName: string
  contactTitle: string
  phone: string
  email: string
  source: string
  stage: LeadStage
}

// ─── Calendar Action types ─────────────────────────────────────

type LeadActionPriority = 'urgent' | 'high' | 'normal' | 'low'
type LeadActionType = 'Gọi điện' | 'Gửi email' | 'Demo' | 'Gặp mặt' | 'Báo giá' | 'Ghi chú'

interface LeadCalendarAction {
  id: string
  leadId: string
  leadTitle: string
  company?: string
  type: LeadActionType
  description: string
  priority: LeadActionPriority
  dueDate: string
  isOverdue?: boolean
  assigneeName?: string
  assigneeColor?: string
  done: boolean
}

type LeadCalendarFilterId = 'all' | 'urgent' | 'today' | 'week'

const LEAD_PRIORITY_LABEL: Record<LeadActionPriority, string> = {
  urgent: 'Khẩn cấp',
  high:   'Cao',
  normal: 'Bình thường',
  low:    'Thấp',
}

const LEAD_PRIORITY_BADGE: Record<LeadActionPriority, string> = {
  urgent: 'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400',
  high:   'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  normal: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
  low:    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
}

const LEAD_PRIORITY_BORDER: Record<LeadActionPriority, string> = {
  urgent: 'border-l-error-500',
  high:   'border-l-warning-400',
  normal: 'border-l-brand-400',
  low:    'border-l-gray-300 dark:border-l-gray-600',
}

const LEAD_PRIORITY_ORDER: Record<LeadActionPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 }

const LEAD_CALENDAR_FILTERS: { id: LeadCalendarFilterId; name: string }[] = [
  { id: 'all',    name: 'Tất cả' },
  { id: 'urgent', name: '🔴 Khẩn cấp' },
  { id: 'today',  name: 'Hôm nay' },
  { id: 'week',   name: 'Tuần này' },
]

const LEAD_ACTION_TYPE_BADGE: Record<string, string> = {
  'Gọi điện': 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Gửi email': 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  'Demo':      'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'Gặp mặt':  'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  'Báo giá':  'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  'Ghi chú':  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

const STAGE_COLOR_PALETTE = [
  { color: '#F59E0B', gradient: 'linear-gradient(135deg,#F59E0B,#D97706)' },
  { color: '#10B981', gradient: 'linear-gradient(135deg,#10B981,#059669)' },
  { color: '#0D9488', gradient: 'linear-gradient(135deg,#0D9488,#0F766E)' },
  { color: '#0EA5E9', gradient: 'linear-gradient(135deg,#0EA5E9,#0284C7)' },
  { color: '#3B82F6', gradient: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
  { color: '#6366F1', gradient: 'linear-gradient(135deg,#6366F1,#4F46E5)' },
  { color: '#8B5CF6', gradient: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
  { color: '#EC4899', gradient: 'linear-gradient(135deg,#EC4899,#DB2777)' },
  { color: '#EF4444', gradient: 'linear-gradient(135deg,#EF4444,#DC2626)' },
  { color: '#64748B', gradient: 'linear-gradient(135deg,#64748B,#475569)' },
]

// ─── Helpers ──────────────────────────────────────────────────

function initials(name: string): string {
  return name
    .split(' ')
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_COLORS = ['#465fff', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899']
function pickColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

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

function daysLabel(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - now.getTime()) / 86_400_000)
  if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`
  if (diff === 0) return 'Đến hạn hôm nay'
  if (diff === 1) return 'Đến hạn ngày mai'
  return `Còn ${diff} ngày`
}

// ─── Mock data ────────────────────────────────────────────────

const columns = ref<LeadColumn[]>([
  {
    id: 'lead',
    name: 'Lead',
    headerBg: 'linear-gradient(135deg,#F59E0B,#D97706)',
    color: '#F59E0B',
    totalValue: '438 764 000',
    cards: [
      {
        id: 'l1', title: 'Tram Máy Sapa', isRepeat: true,
        assigneeName: 'Nguyễn Anh Tùng', assigneeColor: '#465fff',
        date: '13 May', isViewed: true, activityTime: '2 Minutes',
        avatarInitials: 'AT', avatarColor: '#465fff', badgeCount: 0, source: 'Referral',
      },
      {
        id: 'l2', title: '[AFF] D-Mart Hotel',
        date: 'Hôm nay, 3:54 CH', activityTime: 'Hôm nay 3:54 CH',
        avatarInitials: 'DM', avatarColor: '#10B981', badgeCount: 0, source: 'Website',
      },
      {
        id: 'l3', title: 'Forever Green Resort',
        date: '15 Tháng 4', activityTime: 'Hôm nay 3:00 CH',
        avatarInitials: 'FG', avatarColor: '#8B5CF6', badgeCount: 0, source: 'Inbound',
      },
    ],
  },
  {
    id: 'mql',
    name: 'MQL',
    headerBg: 'linear-gradient(135deg,#10B981,#059669)',
    color: '#10B981',
    totalValue: '358 773 263',
    cards: [
      {
        id: 'm1', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        assigneeName: 'Chi Hồng', assigneeColor: '#10B981',
        companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT',
        date: '38 phút trước', activityTime: '37 Minutes',
        avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0, source: 'Website',
      },
      {
        id: 'm2', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        date: '38 phút trước', activityTime: '38 Minutes',
        avatarInitials: 'PO', avatarColor: '#F59E0B', badgeCount: 0, source: 'Website',
      },
      {
        id: 'm3', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API — Nam', isRepeat: true,
        date: '39 phút trước', activityTime: '39 Minutes',
        avatarInitials: 'NA', avatarColor: '#EF4444', badgeCount: 0, source: 'Website',
      },
      {
        id: 'm4', title: 'FORM ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        date: '41 phút trước', activityTime: '41 Minutes',
        avatarInitials: 'FK', avatarColor: '#6366F1', badgeCount: 0, source: 'Website',
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL',
    headerBg: 'linear-gradient(135deg,#0D9488,#0F766E)',
    color: '#0D9488',
    totalValue: '896 226 080',
    cards: [
      {
        id: 's1', title: 'Khách sạn Emma', isRepeat: true,
        assigneeName: 'Chi Hồng', assigneeColor: '#10B981',
        companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT',
        date: 'Hôm nay, 4:28 CH', activityTime: 'Hôm nay 4:28 CH',
        avatarInitials: 'KE', avatarColor: '#10B981', badgeCount: 0, source: 'Inbound',
      },
      {
        id: 's2', title: '[AFF] Khách sạn Thành Cao',
        date: 'Hôm nay, 4:12 CH', activityTime: 'Hôm nay 4:12 CH',
        avatarInitials: 'TC', avatarColor: '#06B6D4', badgeCount: 0, source: 'Referral',
      },
      {
        id: 's3', title: 'Marisol Hotel Đà Nẵng',
        date: '15 Tháng 4', activityTime: 'Hôm nay 4:05 CH',
        avatarInitials: 'MH', avatarColor: '#8B5CF6', badgeCount: 0, source: 'Event',
      },
      {
        id: 's4', title: 'Khách sạn 43p_Đà Lạt',
        date: '15 Tháng 4',
        avatarInitials: 'DL', avatarColor: '#F59E0B', badgeCount: 0, source: 'Facebook',
      },
    ],
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    headerBg: 'linear-gradient(135deg,#0EA5E9,#0284C7)',
    color: '#0EA5E9',
    totalValue: '0',
    cards: [
      {
        id: 'o1', title: 'Golden Hotel',
        date: '13 May', activityTime: '13 May',
        avatarInitials: 'GH', avatarColor: '#0EA5E9', badgeCount: 0, source: 'Outbound',
      },
      {
        id: 'o2', title: 'Lovera Signature',
        date: '12 May', activityTime: '12 May',
        avatarInitials: 'LS', avatarColor: '#EC4899', badgeCount: 0, source: 'Referral',
      },
      {
        id: 'o3', title: '[AFF] MonSoon Boutique Hotel Da Lat',
        date: '5 May', activityTime: '5 May',
        avatarInitials: 'MB', avatarColor: '#10B981', badgeCount: 0, source: 'Website',
      },
      {
        id: 'o4', title: '[AFF] Khách Sạn Cường Thanh 1 & 2',
        date: '23 March',
        avatarInitials: 'CT', avatarColor: '#6366F1', badgeCount: 0, source: 'Zalo',
      },
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    headerBg: 'linear-gradient(135deg,#3B82F6,#2563EB)',
    color: '#3B82F6',
    totalValue: '332 622 877',
    cards: [
      {
        id: 'c1', title: 'Resort Dakke Mang Den_56p_ezCloudhotel', isRepeat: true,
        assigneeName: 'Bảo Trần', assigneeColor: '#465fff',
        companyName: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ DU LỊCH KHÁNH DƯƠNG MĂNG ĐEN',
        date: '15 May', activityTime: '15 May',
        avatarInitials: 'BT', avatarColor: '#465fff', badgeCount: 0, source: 'Inbound',
      },
      {
        id: 'c2', title: 'FORM ĐĂNG KÝ DÙNG THỬ API Trần Thế Hùng', isRepeat: true,
        date: '13 May', activityTime: '13 May',
        avatarInitials: 'TH', avatarColor: '#8B5CF6', badgeCount: 0, source: 'Website',
      },
      {
        id: 'c3', title: 'Agarwood Hotel_16p_ezCloudhotel nâng cao', isRepeat: true,
        assigneeName: 'Chi Hương', assigneeColor: '#10B981',
        companyName: 'CHI NHÁNH CÔNG TY TNHH MỸ NGHỆ THẮNG TRÌNH - KHÁCH SẠN TRĂM HƯƠNG',
        date: '6 Apr', activityTime: '6 Apr',
        avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0, source: 'Referral',
      },
    ],
  },
  {
    id: 'evangelist',
    name: 'Evangelist',
    headerBg: 'linear-gradient(135deg,#6366F1,#4F46E5)',
    color: '#6366F1',
    totalValue: '0',
    cards: [],
  },
])

// ─── KPIs ─────────────────────────────────────────────────────

const leadKpis = computed(() => {
  const all = columns.value.flatMap((c) => c.cards)
  return [
    { label: 'Tổng Lead',  value: String(all.length) },
    { label: 'Hôm nay',    value: String(all.filter((c) => /phút|giờ|hôm nay/i.test(c.date)).length), valueClass: 'text-success-500' },
    { label: 'Có task',    value: String(all.filter((c) => c.hasTask).length) },
  ]
})

// ─── Filter ────────────────────────────────────────────────────

const LEAD_SOURCES = [
  { value: 'website', label: 'Website' },
  { value: 'inbound', label: 'Inbound' },
  { value: 'referral', label: 'Referral' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'event', label: 'Event' },
  { value: 'zalo', label: 'Zalo' },
  { value: 'facebook', label: 'Facebook' },
]

const LEAD_STAGES_LIST = [
  { value: 'lead' as LeadStage, label: 'Lead' },
  { value: 'mql' as LeadStage, label: 'MQL' },
  { value: 'sql' as LeadStage, label: 'SQL' },
  { value: 'opportunity' as LeadStage, label: 'Opportunity' },
  { value: 'customer' as LeadStage, label: 'Customer' },
  { value: 'evangelist' as LeadStage, label: 'Evangelist' },
]

const DATE_RANGE_OPTIONS = [
  { value: 'any', label: 'Bất kỳ' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
]

const LEAD_FILTER_PRESETS = [
  { id: 'all', name: 'Tất cả' },
  { id: 'viewed', name: 'Đã xem' },
  { id: 'has_task', name: 'Có công việc' },
  { id: 'repeat', name: 'Repeat' },
  { id: 'src_website', name: 'Từ Website' },
  { id: 'src_inbound', name: 'Từ Inbound' },
  { id: 'src_zalo', name: 'Từ Zalo' },
  { id: 'src_facebook', name: 'Từ Facebook' },
]

const showFilterPanel = ref(false)
const searchBarRef = ref<HTMLElement | null>(null)
const leadSearchInputRef = ref<HTMLInputElement | null>(null)
const leadFilterText = ref('')
const leadFilterSources = ref<string[]>([])
const leadFilterStages = ref<LeadStage[]>([])
const leadFilterDateRange = ref('any')
const leadFilterAssignee = ref('')
const leadFilterCompany = ref('')
const leadFilterPhone = ref('')
const leadFilterEmail = ref('')
const leadFilterName = ref('')
const leadFilterId = ref('')
const leadFilterViewed = ref(false)
const leadFilterHasTask = ref(false)
const leadFilterRepeat = ref(false)
const activeLeadPreset = ref<string | null>('all')

const hasLeadFilters = computed(() =>
  leadFilterText.value.trim() !== '' ||
  leadFilterSources.value.length > 0 ||
  leadFilterStages.value.length > 0 ||
  leadFilterDateRange.value !== 'any' ||
  leadFilterAssignee.value.trim() !== '' ||
  leadFilterCompany.value.trim() !== '' ||
  leadFilterPhone.value.trim() !== '' ||
  leadFilterEmail.value.trim() !== '' ||
  leadFilterName.value.trim() !== '' ||
  leadFilterId.value.trim() !== '' ||
  leadFilterViewed.value ||
  leadFilterHasTask.value ||
  leadFilterRepeat.value,
)

const totalLeadFilterCount = computed(() => {
  let n = 0
  if (leadFilterText.value.trim()) n++
  if (leadFilterSources.value.length) n++
  if (leadFilterStages.value.length) n++
  if (leadFilterDateRange.value !== 'any') n++
  if (leadFilterAssignee.value.trim()) n++
  if (leadFilterCompany.value.trim()) n++
  if (leadFilterPhone.value.trim()) n++
  if (leadFilterEmail.value.trim()) n++
  if (leadFilterName.value.trim()) n++
  if (leadFilterId.value.trim()) n++
  if (leadFilterViewed.value) n++
  if (leadFilterHasTask.value) n++
  if (leadFilterRepeat.value) n++
  return n
})

const activeLeadFilterChips = computed(() => {
  const chips: { key: string; label: string }[] = []
  if (leadFilterSources.value.length)
    chips.push({ key: 'sources', label: `Nguồn (${leadFilterSources.value.length})` })
  if (leadFilterStages.value.length)
    chips.push({ key: 'stages', label: `Giai đoạn (${leadFilterStages.value.length})` })
  if (leadFilterDateRange.value !== 'any')
    chips.push({ key: 'dateRange', label: DATE_RANGE_OPTIONS.find((o) => o.value === leadFilterDateRange.value)?.label ?? leadFilterDateRange.value })
  if (leadFilterName.value.trim())
    chips.push({ key: 'name', label: `Tên: ${leadFilterName.value.trim()}` })
  if (leadFilterId.value.trim())
    chips.push({ key: 'leadId', label: `ID: ${leadFilterId.value.trim()}` })
  if (leadFilterAssignee.value.trim())
    chips.push({ key: 'assignee', label: `Phụ trách: ${leadFilterAssignee.value.trim()}` })
  if (leadFilterCompany.value.trim())
    chips.push({ key: 'company', label: `Cty: ${leadFilterCompany.value.trim()}` })
  if (leadFilterPhone.value.trim())
    chips.push({ key: 'phone', label: `SĐT: ${leadFilterPhone.value.trim()}` })
  if (leadFilterEmail.value.trim())
    chips.push({ key: 'email', label: `Email: ${leadFilterEmail.value.trim()}` })
  if (leadFilterViewed.value) chips.push({ key: 'viewed', label: 'Đã xem' })
  if (leadFilterHasTask.value) chips.push({ key: 'hasTask', label: 'Có task' })
  if (leadFilterRepeat.value) chips.push({ key: 'repeat', label: 'Repeat' })
  return chips
})

function matchesLeadDateRange(dateStr: string, range: string): boolean {
  const d = dateStr.toLowerCase()
  if (range === 'today') return d.includes('phút') || d.includes('giờ') || d.includes('hôm nay')
  if (range === 'week') return d.includes('phút') || d.includes('giờ') || d.includes('hôm nay') || d.includes('hôm qua')
  if (range === 'month') {
    const monthNames = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
    const vietMonths = ['tháng 1','tháng 2','tháng 3','tháng 4','tháng 5','tháng 6','tháng 7','tháng 8','tháng 9','tháng 10','tháng 11','tháng 12']
    const cur = new Date()
    return d.includes('phút') || d.includes('giờ') || d.includes('hôm nay') ||
      d.includes(monthNames[cur.getMonth()]) || d.includes(vietMonths[cur.getMonth()])
  }
  return true
}

const filteredColumns = computed(() => {
  const qf = activeLeadQuickFilter.value
  const hasQF = qf !== 'all'

  let cols = columns.value
  if (leadFilterStages.value.length) {
    cols = cols.filter((col) => leadFilterStages.value.includes(col.id))
  }

  if (!hasLeadFilters.value && !hasQF) return cols

  const q = leadFilterText.value.trim().toLowerCase()
  const nameQ = leadFilterName.value.trim().toLowerCase()
  const idQ = leadFilterId.value.trim().toLowerCase()
  const phoneQ = leadFilterPhone.value.trim().toLowerCase()
  const emailQ = leadFilterEmail.value.trim().toLowerCase()

  return cols.map((col) => ({
    ...col,
    cards: col.cards.filter((card) => {
      // Quick filter
      if (hasQF) {
        if (qf === 'my'        && !card.assigneeName) return false
        if (qf === 'planned'   && !card.hasTask) return false
        if (qf === 'hot'       && !card.isRepeat) return false
        if (qf === 'overdue'   && /phút|giờ|hôm nay/i.test(card.date)) return false
        if (qf === 'this_week' && !/phút|giờ|hôm nay/i.test(card.date)) return false
      }
      // Text / field filters
      if (q) {
        const hit =
          card.title.toLowerCase().includes(q) ||
          (card.assigneeName?.toLowerCase().includes(q) ?? false) ||
          (card.companyName?.toLowerCase().includes(q) ?? false)
        if (!hit) return false
      }
      if (nameQ && !card.title.toLowerCase().includes(nameQ)) return false
      if (idQ && !card.id.toLowerCase().includes(idQ)) return false
      if (phoneQ && !(card.phone?.toLowerCase().includes(phoneQ) ?? false)) return false
      if (emailQ && !(card.email?.toLowerCase().includes(emailQ) ?? false)) return false
      if (leadFilterSources.value.length && !leadFilterSources.value.includes(card.source ?? '')) return false
      if (leadFilterAssignee.value.trim() && !(card.assigneeName?.toLowerCase().includes(leadFilterAssignee.value.trim().toLowerCase()) ?? false)) return false
      if (leadFilterCompany.value.trim() && !(card.companyName?.toLowerCase().includes(leadFilterCompany.value.trim().toLowerCase()) ?? false)) return false
      if (leadFilterDateRange.value !== 'any' && !matchesLeadDateRange(card.date, leadFilterDateRange.value)) return false
      if (leadFilterViewed.value && !card.isViewed) return false
      if (leadFilterHasTask.value && !card.hasTask) return false
      if (leadFilterRepeat.value && !card.isRepeat) return false
      return true
    }),
  }))
})

const allLeadCards = computed(() =>
  filteredColumns.value.flatMap((col) =>
    col.cards.map((card) => ({
      ...card,
      stageId: col.id as LeadStage,
      stageName: col.name,
      stageColor: col.color ?? '#D1D5DB',
    }))
  )
)

function removeLeadFilter(key: string): void {
  if (key === 'sources') leadFilterSources.value = []
  if (key === 'stages') leadFilterStages.value = []
  if (key === 'dateRange') leadFilterDateRange.value = 'any'
  if (key === 'assignee') leadFilterAssignee.value = ''
  if (key === 'company') leadFilterCompany.value = ''
  if (key === 'phone') leadFilterPhone.value = ''
  if (key === 'email') leadFilterEmail.value = ''
  if (key === 'name') leadFilterName.value = ''
  if (key === 'leadId') leadFilterId.value = ''
  if (key === 'viewed') leadFilterViewed.value = false
  if (key === 'hasTask') leadFilterHasTask.value = false
  if (key === 'repeat') leadFilterRepeat.value = false
  activeLeadPreset.value = null
}

function clearLeadFilters(): void {
  leadFilterText.value = ''
  leadFilterSources.value = []
  leadFilterStages.value = []
  leadFilterDateRange.value = 'any'
  leadFilterAssignee.value = ''
  leadFilterCompany.value = ''
  leadFilterPhone.value = ''
  leadFilterEmail.value = ''
  leadFilterName.value = ''
  leadFilterId.value = ''
  leadFilterViewed.value = false
  leadFilterHasTask.value = false
  leadFilterRepeat.value = false
  activeLeadPreset.value = 'all'
}

function applyLeadPreset(id: string): void {
  clearLeadFilters()
  activeLeadPreset.value = id
  if (id === 'viewed') leadFilterViewed.value = true
  else if (id === 'has_task') leadFilterHasTask.value = true
  else if (id === 'repeat') leadFilterRepeat.value = true
  else if (id === 'src_website') leadFilterSources.value = ['website']
  else if (id === 'src_inbound') leadFilterSources.value = ['inbound']
  else if (id === 'src_zalo') leadFilterSources.value = ['zalo']
  else if (id === 'src_facebook') leadFilterSources.value = ['facebook']
}

function openLeadFilterPanel(): void {
  showFilterPanel.value = true
  nextTick(() => leadSearchInputRef.value?.focus())
}

function handleLeadOutsideClick(e: MouseEvent): void {
  if (searchBarRef.value && !searchBarRef.value.contains(e.target as Node)) {
    showFilterPanel.value = false
  }
}

// ─── Column resize ────────────────────────────────────────────

const leadContainerRef = ref<HTMLElement | null>(null)
const leadColWidths = ref<Record<string, number>>({})

function initLeadColWidths(): void {
  if (!columns.value.length) return
  const equal = 100 / columns.value.length
  const w: Record<string, number> = {}
  columns.value.forEach((col) => { w[col.id] = equal })
  leadColWidths.value = w
}

const leadResizingHandle = ref<{ leftId: string; rightId: string; startX: number; startL: number; startR: number } | null>(null)

function startLeadResize(e: MouseEvent, leftId: string, rightId: string): void {
  leadResizingHandle.value = {
    leftId, rightId, startX: e.clientX,
    startL: leadColWidths.value[leftId] ?? 0,
    startR: leadColWidths.value[rightId] ?? 0,
  }
  document.addEventListener('mousemove', onLeadResize)
  document.addEventListener('mouseup', stopLeadResize)
}

function onLeadResize(e: MouseEvent): void {
  if (!leadResizingHandle.value || !leadContainerRef.value) return
  const { leftId, rightId, startX, startL, startR } = leadResizingHandle.value
  const containerW = leadContainerRef.value.getBoundingClientRect().width
  const deltaPct = ((e.clientX - startX) / containerW) * 100
  const minPct = 8
  const newL = Math.max(minPct, Math.min(startL + deltaPct, startL + startR - minPct))
  leadColWidths.value = { ...leadColWidths.value, [leftId]: newL, [rightId]: startL + startR - newL }
}

function stopLeadResize(): void {
  leadResizingHandle.value = null
  document.removeEventListener('mousemove', onLeadResize)
  document.removeEventListener('mouseup', stopLeadResize)
}

// ─── Lead Custom Field Store ─────────────────────────────────
const leadCustomFieldStore = useLeadCustomFieldStore()

const LEAD_FIELD_TYPE_HINTS: Record<CustomFieldType, { icon: unknown; label: string; desc: string; examples: string[] }> = {
  string: {
    icon: AlignLeft,
    label: 'Văn bản',
    desc: 'Lưu trữ văn bản tự do. Phù hợp cho ghi chú, mô tả, địa chỉ.',
    examples: ['Ghi chú nội bộ', 'Mô tả nhu cầu', 'Địa chỉ'],
  },
  double: {
    icon: Hash,
    label: 'Số',
    desc: 'Lưu số nguyên hoặc số thập phân. Phù hợp cho ngân sách, số lượng.',
    examples: ['Ngân sách khách hàng', 'Số nhân viên', 'Tỷ lệ hoa hồng (%)'],
  },
  date: {
    icon: CalendarDays,
    label: 'Ngày',
    desc: 'Lưu ngày tháng năm. Phù hợp cho các mốc thời gian quan trọng.',
    examples: ['Ngày hẹn demo', 'Hạn phản hồi', 'Ngày follow-up'],
  },
  single_select: {
    icon: CircleDot,
    label: 'Danh sách 1 lựa chọn',
    desc: 'Chọn đúng 1 giá trị từ danh sách định sẵn. Phù hợp cho phân loại rõ ràng.',
    examples: ['Mức độ ưu tiên', 'Loại hình dịch vụ', 'Kênh tiếp cận'],
  },
  multi_select: {
    icon: ListChecks,
    label: 'Danh sách nhiều lựa chọn',
    desc: 'Chọn nhiều giá trị cùng lúc. Phù hợp khi lead có thể thuộc nhiều nhóm.',
    examples: ['Sản phẩm quan tâm', 'Nhãn lead', 'Đối tượng mục tiêu'],
  },
}

const allLeadSectionsForFields = computed(() => [
  ...LEAD_SECTIONS,
  ...leadCustomFieldStore.customSections,
])

const filteredLeadFieldGroups = computed(() => {
  const q = leadFieldSearchQuery.value.trim().toLowerCase()
  return allLeadSectionsForFields.value
    .map(section => {
      const staticFields = LEAD_FIELDS.filter(f =>
        f.sectionId === section.id
        && !leadCustomFieldStore.isStaticHidden(f.fieldId)
        && (!q || f.labelVI.toLowerCase().includes(q))
      )
      const customFields = leadCustomFieldStore.fieldsInSection(section.id).filter(f =>
        !q || f.label.toLowerCase().includes(q)
      )
      return { section, staticFields, customFields, total: staticFields.length + customFields.length }
    })
    .filter(g => g.total > 0)
})

// Field editing state
const leadFieldSearchQuery = ref('')
const showLeadAddFieldForm = ref(false)
const leadFieldEditingId = ref<string | null>(null)
const leadFieldEditingLabel = ref('')
const leadFieldDeleteConfirmId = ref<string | null>(null)
const newLeadFieldLabel = ref('')
const newLeadFieldType = ref<CustomFieldType>('string')
const newLeadFieldSectionId = ref('')
const newLeadFieldIsNewSection = ref(false)
const newLeadFieldNewSectionName = ref('')
const newLeadFieldOptions = ref<string[]>([])
const newLeadFieldOptionInput = ref('')

function startLeadEditField(id: string, currentLabel: string): void {
  leadFieldEditingId.value = id
  leadFieldEditingLabel.value = currentLabel
}

function saveLeadFieldEdit(id: string, isCustom: boolean): void {
  const label = leadFieldEditingLabel.value.trim()
  if (!label) return
  if (isCustom) {
    leadCustomFieldStore.updateCustomField(id, { label })
  } else {
    leadCustomFieldStore.setStaticOverride(id, { label })
  }
  leadFieldEditingId.value = null
}

function cancelLeadFieldEdit(): void {
  leadFieldEditingId.value = null
}

function toggleLeadFieldRequired(id: string, isCustom: boolean, currentRequired: boolean): void {
  if (isCustom) {
    leadCustomFieldStore.updateCustomField(id, { required: !currentRequired })
  } else {
    leadCustomFieldStore.setStaticOverride(id, { required: !currentRequired })
  }
}

function startLeadDeleteField(id: string): void {
  leadFieldDeleteConfirmId.value = id
}

function confirmLeadDeleteField(id: string, isCustom: boolean): void {
  if (isCustom) {
    leadCustomFieldStore.deleteField(id)
  } else {
    leadCustomFieldStore.hideStaticField(id)
  }
  leadFieldDeleteConfirmId.value = null
}

function cancelLeadDeleteField(): void {
  leadFieldDeleteConfirmId.value = null
}

function addLeadFieldOptionTag(): void {
  const val = newLeadFieldOptionInput.value.trim().replace(/,+$/, '')
  if (val && !newLeadFieldOptions.value.includes(val)) {
    newLeadFieldOptions.value.push(val)
  }
  newLeadFieldOptionInput.value = ''
}

function addLeadCustomField(): void {
  const label = newLeadFieldLabel.value.trim()
  if (!label) return
  let sectionId = newLeadFieldSectionId.value
  if (newLeadFieldIsNewSection.value) {
    const sectionName = newLeadFieldNewSectionName.value.trim()
    if (!sectionName) return
    const newSection = leadCustomFieldStore.addSection(sectionName)
    sectionId = newSection.id
  }
  if (!sectionId) return
  const opts = (newLeadFieldType.value === 'single_select' || newLeadFieldType.value === 'multi_select')
    ? [...newLeadFieldOptions.value]
    : undefined
  leadCustomFieldStore.addField(sectionId, label, newLeadFieldType.value, opts)
  newLeadFieldLabel.value = ''
  newLeadFieldType.value = 'string'
  newLeadFieldSectionId.value = ''
  newLeadFieldIsNewSection.value = false
  newLeadFieldNewSectionName.value = ''
  newLeadFieldOptions.value = []
  newLeadFieldOptionInput.value = ''
  showLeadAddFieldForm.value = false
  toast.success('Đã thêm trường thông tin')
}

// ─── Lead Stage Settings ──────────────────────────────────────

const showLeadStageSettings = ref(false)
const leadSettingsTab = ref<'stages' | 'fields'>('stages')
const leadStageDraft = ref<StageDraft[]>([])
const leadColorPickerIdx = ref<number | null>(null)
const leadStageOrigNames = ref<Record<string, string>>({})

// Add-stage sub-form
const showAddLeadStageForm = ref(false)
const newLeadStageName = ref('')
const newLeadStagePosition = ref<string>('last')

// Drag-drop
const leadDragIdx = ref<number | null>(null)
const leadDragOverIdx = ref<number | null>(null)

function openStageSettings(): void {
  leadStageDraft.value = columns.value.map((col) => ({
    id: col.id,
    name: col.name,
    color: col.color ?? '#64748B',
    headerBg: col.headerBg,
  }))
  leadStageOrigNames.value = Object.fromEntries(columns.value.map((col) => [col.id, col.name]))
  leadColorPickerIdx.value = null
  showAddLeadStageForm.value = false
  newLeadStageName.value = ''
  newLeadStagePosition.value = 'last'
  leadSettingsTab.value = 'stages'
  showLeadAddFieldForm.value = false
  leadFieldSearchQuery.value = ''
  showLeadStageSettings.value = true
}

function confirmAddLeadStage(): void {
  const name = newLeadStageName.value.trim()
  if (!name) { toast.error('Tên giai đoạn không được để trống'); return }
  const entry = STAGE_COLOR_PALETTE[leadStageDraft.value.length % STAGE_COLOR_PALETTE.length]
  const newStage: StageDraft = { id: `new_${Date.now()}`, name, color: entry.color, headerBg: entry.gradient, isNew: true }
  if (newLeadStagePosition.value === 'first') {
    leadStageDraft.value.unshift(newStage)
  } else if (newLeadStagePosition.value === 'last') {
    leadStageDraft.value.push(newStage)
  } else {
    const afterIdx = leadStageDraft.value.findIndex((s) => s.id === newLeadStagePosition.value)
    leadStageDraft.value.splice(afterIdx >= 0 ? afterIdx + 1 : leadStageDraft.value.length, 0, newStage)
  }
  leadStageOrigNames.value[newStage.id] = name
  showAddLeadStageForm.value = false
  newLeadStageName.value = ''
  newLeadStagePosition.value = 'last'
}

function removeLeadStage(idx: number): void {
  const draft = leadStageDraft.value[idx]
  if (!draft.isNew) {
    const col = columns.value.find((c) => c.id === draft.id)
    if (col && col.cards.length > 0) {
      toast.error(`Không thể xóa — giai đoạn đang có ${col.cards.length} lead`)
      return
    }
  }
  leadStageDraft.value.splice(idx, 1)
  if (leadColorPickerIdx.value === idx) leadColorPickerIdx.value = null
}

function saveLeadStageName(stage: StageDraft): void {
  if (!stage.name.trim()) { toast.error('Tên không được để trống'); return }
  stage.name = stage.name.trim()
  leadStageOrigNames.value[stage.id] = stage.name
  toast.success('Đã lưu tên giai đoạn')
}

function onLeadDragStart(idx: number): void { leadDragIdx.value = idx }
function onLeadDragOver(e: DragEvent, idx: number): void { e.preventDefault(); leadDragOverIdx.value = idx }
function onLeadDrop(idx: number): void {
  const from = leadDragIdx.value
  if (from === null || from === idx) { leadDragIdx.value = null; leadDragOverIdx.value = null; return }
  const list = [...leadStageDraft.value]
  const [moved] = list.splice(from, 1)
  list.splice(idx, 0, moved)
  leadStageDraft.value = list
  leadDragIdx.value = null
  leadDragOverIdx.value = null
}
function onLeadDragEnd(): void { leadDragIdx.value = null; leadDragOverIdx.value = null }

function saveLeadStages(): void {
  if (leadStageDraft.value.length === 0) {
    toast.error('Pipeline phải có ít nhất 1 giai đoạn')
    return
  }
  if (leadStageDraft.value.some((s) => !s.name.trim())) {
    toast.error('Tên giai đoạn không được để trống')
    return
  }
  columns.value = leadStageDraft.value.map((draft) => {
    const existing = columns.value.find((c) => c.id === draft.id)
    const palette = STAGE_COLOR_PALETTE.find((p) => p.color === draft.color)
    const headerBg = palette?.gradient ?? `linear-gradient(135deg,${draft.color},${draft.color})`
    if (existing) {
      return { ...existing, name: draft.name.trim(), color: draft.color, headerBg }
    }
    const slug = draft.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + `_${Date.now()}`
    return {
      id: slug, name: draft.name.trim(),
      color: draft.color, headerBg,
      totalValue: '0', cards: [],
    } as LeadColumn
  })
  showLeadStageSettings.value = false
  toast.success('Đã lưu cài đặt giai đoạn')
}

// ─── Calendar view (Lead) ─────────────────────────────────────

const leadCalendarFilter = ref<LeadCalendarFilterId>('all')

const leadCalendarActions = ref<LeadCalendarAction[]>([
  {
    id: 'lca-1', leadId: 'l1', leadTitle: 'Tram Máy Sapa',
    company: 'Sapa Resort Group', type: 'Gọi điện',
    description: 'Follow-up sau lần liên hệ đầu tiên, xác nhận nhu cầu',
    priority: 'urgent', dueDate: '2026-05-19', isOverdue: true,
    assigneeName: 'Minh Tú', assigneeColor: '#3B82F6', done: false,
  },
  {
    id: 'lca-2', leadId: 'm1', leadTitle: 'POPUP ĐĂNG KÝ DÙNG THỬ API',
    company: undefined, type: 'Gửi email',
    description: 'Gửi email giới thiệu gói API phù hợp nhu cầu dùng thử',
    priority: 'urgent', dueDate: '2026-05-20', isOverdue: true,
    assigneeName: 'Lan Ngọc', assigneeColor: '#10B981', done: false,
  },
  {
    id: 'lca-3', leadId: 's1', leadTitle: 'Khách sạn Emma',
    company: 'Emma Hotel Group', type: 'Demo',
    description: 'Demo tính năng quản lý phòng và check-in online',
    priority: 'high', dueDate: '2026-05-24',
    assigneeName: 'Hùng Phát', assigneeColor: '#8B5CF6', done: false,
  },
  {
    id: 'lca-4', leadId: 'o1', leadTitle: 'Golden Hotel',
    company: 'Golden Hospitality', type: 'Gặp mặt',
    description: 'Gặp trực tiếp trình bày giải pháp và báo giá dự kiến',
    priority: 'high', dueDate: '2026-05-27',
    assigneeName: 'Đức Long', assigneeColor: '#F59E0B', done: false,
  },
  {
    id: 'lca-5', leadId: 'o2', leadTitle: 'Lovera Signature',
    company: 'Lovera Hotels', type: 'Báo giá',
    description: 'Gửi báo giá gói Premium cho hệ thống 50 phòng',
    priority: 'normal', dueDate: '2026-06-02',
    assigneeName: 'Minh Tú', assigneeColor: '#3B82F6', done: false,
  },
  {
    id: 'lca-6', leadId: 's3', leadTitle: 'Marisol Hotel Đà Nẵng',
    company: 'Marisol Resort', type: 'Gọi điện',
    description: 'Gọi kiểm tra tiến độ sau buổi demo tuần trước',
    priority: 'normal', dueDate: '2026-06-05',
    assigneeName: 'Lan Ngọc', assigneeColor: '#10B981', done: false,
  },
  {
    id: 'lca-7', leadId: 'l2', leadTitle: '[AFF] D-Mart Hotel',
    company: 'D-Mart Hotels', type: 'Ghi chú',
    description: 'Cập nhật ghi chú nhu cầu từ buổi khảo sát ban đầu',
    priority: 'low', dueDate: '2026-06-10',
    assigneeName: 'Hùng Phát', assigneeColor: '#8B5CF6', done: false,
  },
])

const filteredLeadCalendarActions = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + 7)

  return leadCalendarActions.value
    .filter((a) => {
      if (leadCalendarFilter.value === 'urgent') return !a.done && a.priority === 'urgent'
      if (leadCalendarFilter.value === 'today') {
        const d = new Date(a.dueDate); d.setHours(0, 0, 0, 0)
        return !a.done && d.getTime() === today.getTime()
      }
      if (leadCalendarFilter.value === 'week') {
        const d = new Date(a.dueDate); d.setHours(0, 0, 0, 0)
        return !a.done && d >= today && d <= endOfWeek
      }
      return true // 'all' — hiện tất cả (done + chưa done)
    })
    .sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1 // done xuống cuối
      const diff = LEAD_PRIORITY_ORDER[a.priority] - LEAD_PRIORITY_ORDER[b.priority]
      if (diff !== 0) return diff
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
})

function markLeadActionDone(id: string): void {
  const action = leadCalendarActions.value.find((a) => a.id === id)
  if (action) {
    action.done = !action.done
    if (action.done) toast.success('Đã đánh dấu hoàn thành')
  }
}

onMounted(() => {
  initLeadColWidths()
  document.addEventListener('click', handleLeadOutsideClick)
})
onUnmounted(() => {
  stopLeadResize()
  document.removeEventListener('click', handleLeadOutsideClick)
})

// ─── Dialog state ──────────────────────────────────────────────

const showDialog = ref(false)
const editingId = ref<string | null>(null)
const showDeleteConfirm = ref(false)
const deletingId = ref<string | null>(null)

const form = ref<LeadForm>({
  customerType: 'company',
  title: '',
  assigneeName: '',
  teamLeadName: '',
  companyName: '',
  contactName: '',
  contactTitle: '',
  phone: '',
  email: '',
  source: 'website',
  stage: 'lead',
})

// ─── Column helpers ───────────────────────────────────────────

function findColumn(stage: LeadStage): LeadColumn | undefined {
  return columns.value.find((c) => c.id === stage)
}

function removeCardById(id: string): { card: LeadCard; stage: LeadStage } | null {
  for (const col of columns.value) {
    const idx = col.cards.findIndex((c) => c.id === id)
    if (idx >= 0) {
      const [card] = col.cards.splice(idx, 1)
      return { card, stage: col.id }
    }
  }
  return null
}

function addCard(stage: LeadStage, card: LeadCard): void {
  findColumn(stage)?.cards.unshift(card)
}

// ─── Dialog ───────────────────────────────────────────────────

function openCreateDialog(stage?: LeadStage): void {
  editingId.value = null
  form.value = {
    customerType: 'company',
    title: '',
    assigneeName: '',
    teamLeadName: '',
    companyName: '',
    contactName: '',
    contactTitle: '',
    phone: '',
    email: '',
    source: 'website',
    stage: stage ?? 'lead',
  }
  showDialog.value = true
}

function openEditDialog(card: LeadCard, stage: LeadStage): void {
  editingId.value = card.id
  const ct = (card as LeadCard & { customerType?: LeadForm['customerType'] }).customerType
  form.value = {
    customerType: ct ?? (card.companyName ? 'company' : 'individual'),
    title: card.title,
    assigneeName: card.assigneeName ?? '',
    teamLeadName: card.teamLeadName ?? '',
    companyName: card.companyName ?? '',
    contactName: card.contactName ?? '',
    contactTitle: card.contactTitle ?? '',
    phone: card.phone ?? '',
    email: card.email ?? '',
    source: card.source ?? 'website',
    stage,
  }
  showDialog.value = true
}

function submitForm(): void {
  const title = form.value.title.trim()
  if (!title) {
    toast.error('Tên lead là bắt buộc')
    return
  }

  const now = new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' })
  const assignee = form.value.assigneeName.trim()
  const teamLead = form.value.teamLeadName.trim()

  const isOrg = form.value.customerType === 'company' || form.value.customerType === 'household'
  const companyName = isOrg ? form.value.companyName.trim() || undefined : undefined
  const contactName = form.value.contactName.trim() || undefined
  const contactTitle = form.value.customerType === 'company' ? form.value.contactTitle.trim() || undefined : undefined

  if (editingId.value) {
    for (const col of columns.value) {
      const card = col.cards.find((c) => c.id === editingId.value)
      if (card) {
        if (col.id !== form.value.stage) {
          removeCardById(editingId.value)
          addCard(form.value.stage, { ...card, title, assigneeName: assignee || undefined, teamLeadName: teamLead || undefined, companyName, contactName, contactTitle, source: form.value.source })
        } else {
          card.title = title
          card.assigneeName = assignee || undefined
          card.teamLeadName = teamLead || undefined
          card.companyName = companyName
          card.contactName = contactName
          card.contactTitle = contactTitle
          card.source = form.value.source
        }
        break
      }
    }
    toast.success('Đã cập nhật lead')
  } else {
    const newCard: LeadCard = {
      id: `lead-${Date.now()}`,
      title,
      assigneeName: assignee || undefined,
      assigneeColor: assignee ? pickColor(assignee) : undefined,
      teamLeadName: teamLead || undefined,
      companyName,
      contactName,
      contactTitle,
      phone: form.value.phone.trim() || undefined,
      email: form.value.email.trim() || undefined,
      source: form.value.source,
      date: now,
      activityTime: now,
      avatarInitials: assignee ? initials(assignee) : title.slice(0, 2).toUpperCase(),
      avatarColor: pickColor(title),
      badgeCount: 0,
    }
    addCard(form.value.stage, newCard)
    toast.success(`Đã thêm lead: ${title}`)
  }

  showDialog.value = false
}

function removeCard(id: string): void {
  deletingId.value = id
  showDeleteConfirm.value = true
}

function confirmDeleteLead(): void {
  if (!deletingId.value) return
  removeCardById(deletingId.value)
  toast.success('Đã xóa lead')
  showDeleteConfirm.value = false
  deletingId.value = null
}

function toggleAllLeads(checked: boolean): void {
  selectedLeadIds.value = checked ? allLeadCards.value.map(l => l.id) : []
}
function toggleLeadRow(id: string, checked: boolean): void {
  if (checked) selectedLeadIds.value = [...selectedLeadIds.value, id]
  else selectedLeadIds.value = selectedLeadIds.value.filter(x => x !== id)
}
function deleteSelectedLeads(): void {
  const ids = [...selectedLeadIds.value]
  selectedLeadIds.value = []
  ids.forEach(id => { removeCardById(id); toast.success('Đã xóa lead') })
}

// ─── Drag-drop ────────────────────────────────────────────────

const dragging = ref<{ id: string; fromStage: LeadStage } | null>(null)

function handleDragStart(id: string, fromStage: LeadStage): void {
  dragging.value = { id, fromStage }
}

function handleDrop(toStage: LeadStage): void {
  if (!dragging.value) return
  const { id, fromStage } = dragging.value
  dragging.value = null
  if (fromStage === toStage) return
  const removed = removeCardById(id)
  if (removed) addCard(toStage, removed.card)
}

defineExpose({ openCreateDialog, openStageSettings })
</script>

<style scoped>
.kpi-card {
  background: color-mix(in srgb, white 70%, var(--color-sidebar-bg) 30%);
  border: 1px solid var(--color-sidebar-active-border);
  backdrop-filter: blur(4px);
}
.dark .kpi-card {
  background: color-mix(in srgb, var(--color-primary-900) 80%, transparent 20%);
  border: 1px solid var(--color-sidebar-active-border);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.lead-kanban-container {
  display: flex;
  gap: 6px;
  width: 100%;
  height: 100%;
  padding-bottom: 4px;
}

.lead-kanban-column {
  position: relative;
  min-width: 0;
}

.lead-resize-handle {
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

.lead-resize-handle::after {
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

.lead-resize-handle:hover::after,
.lead-resize-handle.resize-active::after {
  background: rgba(99, 102, 241, 0.45);
}

@media (max-width: 768px) {
  .lead-kanban-container { overflow-x: auto; }
  .lead-kanban-column { width: 180px !important; }
}

.custom-scrollbar::-webkit-scrollbar { width: 5px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,.03); border-radius: 10px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
