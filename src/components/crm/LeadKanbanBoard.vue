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
    <div class="shrink-0 grid grid-cols-2 gap-3 px-4 pt-2 md:grid-cols-4">
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

    <!-- Board -->
    <div class="custom-scrollbar flex-1 overflow-x-auto overflow-y-hidden p-2">
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
              :style="{ borderLeftWidth: '4px', borderLeftColor: LEAD_COL_ACCENT[column.id] ?? '#D1D5DB' }"
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
                <p class="mb-1.5 text-xs text-gray-500 dark:text-gray-400">
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

    <!-- Create / Edit Lead Dialog -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent class="sm:max-w-lg">
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

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="l-assignee">Người phụ trách</Label>
              <Input id="l-assignee" v-model="form.assigneeName" placeholder="Tên nhân viên" />
            </div>
            <div class="space-y-1.5">
              <Label for="l-company">Công ty</Label>
              <Input id="l-company" v-model="form.companyName" placeholder="Tên công ty" />
            </div>
          </div>

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

  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  AlertTriangle,
  Mail,
  MessageCircle,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
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
  companyName?: string
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
  id: LeadStage
  name: string
  headerBg: string
  totalValue: string
  cards: LeadCard[]
}

interface LeadForm {
  title: string
  assigneeName: string
  companyName: string
  phone: string
  email: string
  source: string
  stage: LeadStage
}

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

// ─── Mock data ────────────────────────────────────────────────

const columns = ref<LeadColumn[]>([
  {
    id: 'lead',
    name: 'Lead',
    headerBg: 'linear-gradient(135deg,#F59E0B,#D97706)',
    totalValue: '438 764 000',
    cards: [
      {
        id: 'l1', title: 'Tram Máy Sapa', isRepeat: true,
        assigneeName: 'Nguyễn Anh Tùng', assigneeColor: '#465fff',
        date: '13 May', isViewed: true, activityTime: '2 Minutes',
        avatarInitials: 'AT', avatarColor: '#465fff', badgeCount: 0,
      },
      {
        id: 'l2', title: '[AFF] D-Mart Hotel',
        date: 'Hôm nay, 3:54 CH', activityTime: 'Hôm nay 3:54 CH',
        avatarInitials: 'DM', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 'l3', title: 'Forever Green Resort',
        date: '15 Tháng 4', activityTime: 'Hôm nay 3:00 CH',
        avatarInitials: 'FG', avatarColor: '#8B5CF6', badgeCount: 0,
      },
    ],
  },
  {
    id: 'mql',
    name: 'MQL',
    headerBg: 'linear-gradient(135deg,#10B981,#059669)',
    totalValue: '358 773 263',
    cards: [
      {
        id: 'm1', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        assigneeName: 'Chi Hồng', assigneeColor: '#10B981',
        companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT',
        date: '38 phút trước', activityTime: '37 Minutes',
        avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 'm2', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        date: '38 phút trước', activityTime: '38 Minutes',
        avatarInitials: 'PO', avatarColor: '#F59E0B', badgeCount: 0,
      },
      {
        id: 'm3', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API — Nam', isRepeat: true,
        date: '39 phút trước', activityTime: '39 Minutes',
        avatarInitials: 'NA', avatarColor: '#EF4444', badgeCount: 0,
      },
      {
        id: 'm4', title: 'FORM ĐĂNG KÝ DÙNG THỬ API', isRepeat: true,
        date: '41 phút trước', activityTime: '41 Minutes',
        avatarInitials: 'FK', avatarColor: '#6366F1', badgeCount: 0,
      },
    ],
  },
  {
    id: 'sql',
    name: 'SQL',
    headerBg: 'linear-gradient(135deg,#0D9488,#0F766E)',
    totalValue: '896 226 080',
    cards: [
      {
        id: 's1', title: 'Khách sạn Emma', isRepeat: true,
        assigneeName: 'Chi Hồng', assigneeColor: '#10B981',
        companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT',
        date: 'Hôm nay, 4:28 CH', activityTime: 'Hôm nay 4:28 CH',
        avatarInitials: 'KE', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 's2', title: '[AFF] Khách sạn Thành Cao',
        date: 'Hôm nay, 4:12 CH', activityTime: 'Hôm nay 4:12 CH',
        avatarInitials: 'TC', avatarColor: '#06B6D4', badgeCount: 0,
      },
      {
        id: 's3', title: 'Marisol Hotel Đà Nẵng',
        date: '15 Tháng 4', activityTime: 'Hôm nay 4:05 CH',
        avatarInitials: 'MH', avatarColor: '#8B5CF6', badgeCount: 0,
      },
      {
        id: 's4', title: 'Khách sạn 43p_Đà Lạt',
        date: '15 Tháng 4',
        avatarInitials: 'DL', avatarColor: '#F59E0B', badgeCount: 0,
      },
    ],
  },
  {
    id: 'opportunity',
    name: 'Opportunity',
    headerBg: 'linear-gradient(135deg,#0EA5E9,#0284C7)',
    totalValue: '0',
    cards: [
      {
        id: 'o1', title: 'Golden Hotel',
        date: '13 May', activityTime: '13 May',
        avatarInitials: 'GH', avatarColor: '#0EA5E9', badgeCount: 0,
      },
      {
        id: 'o2', title: 'Lovera Signature',
        date: '12 May', activityTime: '12 May',
        avatarInitials: 'LS', avatarColor: '#EC4899', badgeCount: 0,
      },
      {
        id: 'o3', title: '[AFF] MonSoon Boutique Hotel Da Lat',
        date: '5 May', activityTime: '5 May',
        avatarInitials: 'MB', avatarColor: '#10B981', badgeCount: 0,
      },
      {
        id: 'o4', title: '[AFF] Khách Sạn Cường Thanh 1 & 2',
        date: '23 March',
        avatarInitials: 'CT', avatarColor: '#6366F1', badgeCount: 0,
      },
    ],
  },
  {
    id: 'customer',
    name: 'Customer',
    headerBg: 'linear-gradient(135deg,#3B82F6,#2563EB)',
    totalValue: '332 622 877',
    cards: [
      {
        id: 'c1', title: 'Resort Dakke Mang Den_56p_ezCloudhotel', isRepeat: true,
        assigneeName: 'Bảo Trần', assigneeColor: '#465fff',
        companyName: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ DU LỊCH KHÁNH DƯƠNG MĂNG ĐEN',
        date: '15 May', activityTime: '15 May',
        avatarInitials: 'BT', avatarColor: '#465fff', badgeCount: 0,
      },
      {
        id: 'c2', title: 'FORM ĐĂNG KÝ DÙNG THỬ API Trần Thế Hùng', isRepeat: true,
        date: '13 May', activityTime: '13 May',
        avatarInitials: 'TH', avatarColor: '#8B5CF6', badgeCount: 0,
      },
      {
        id: 'c3', title: 'Agarwood Hotel_16p_ezCloudhotel nâng cao', isRepeat: true,
        assigneeName: 'Chi Hương', assigneeColor: '#10B981',
        companyName: 'CHI NHÁNH CÔNG TY TNHH MỸ NGHỆ THẮNG TRÌNH - KHÁCH SẠN TRĂM HƯƠNG',
        date: '6 Apr', activityTime: '6 Apr',
        avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0,
      },
    ],
  },
  {
    id: 'evangelist',
    name: 'Evangelist',
    headerBg: 'linear-gradient(135deg,#6366F1,#4F46E5)',
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
    { label: 'Đã xem',     value: String(all.filter((c) => c.isViewed).length), valueClass: 'text-primary-500' },
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

const form = ref<LeadForm>({
  title: '',
  assigneeName: '',
  companyName: '',
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
    title: '',
    assigneeName: '',
    companyName: '',
    phone: '',
    email: '',
    source: 'website',
    stage: stage ?? 'lead',
  }
  showDialog.value = true
}

function openEditDialog(card: LeadCard, stage: LeadStage): void {
  editingId.value = card.id
  form.value = {
    title: card.title,
    assigneeName: card.assigneeName ?? '',
    companyName: card.companyName ?? '',
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

  if (editingId.value) {
    for (const col of columns.value) {
      const card = col.cards.find((c) => c.id === editingId.value)
      if (card) {
        if (col.id !== form.value.stage) {
          removeCardById(editingId.value)
          addCard(form.value.stage, { ...card, title, assigneeName: assignee || undefined, companyName: form.value.companyName.trim() || undefined, source: form.value.source })
        } else {
          card.title = title
          card.assigneeName = assignee || undefined
          card.companyName = form.value.companyName.trim() || undefined
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
      companyName: form.value.companyName.trim() || undefined,
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
  removeCardById(id)
  toast.success('Đã xóa lead')
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

defineExpose({ openCreateDialog })
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
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
</style>
