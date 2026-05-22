<template>
  <AdminLayout>
    <div class="-m-4 md:-m-6 flex items-start gap-0 min-h-[calc(100vh-64px)]">

      <!-- ═══════════════════════════════════════════════════════════
           LEFT SIDEBAR (30%)
      ══════════════════════════════════════════════════════════════ -->
      <aside class="hidden lg:flex w-[30%] min-w-[280px] max-w-[380px] flex-col gap-4 p-5 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

        <!-- Back button -->
        <button
          type="button"
          class="flex items-center gap-2 self-start rounded-lg px-3 py-1.5 text-theme-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          @click="goBack"
        >
          <ArrowLeft class="h-4 w-4" />
          Quay lại Kanban
        </button>

        <!-- Summary card -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs p-5">

          <!-- Avatar + name + type -->
          <div class="flex items-start gap-3 mb-4">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white"
              :style="{ background: card?.type === 'trial' ? '#f79009' : '#3450cc' }"
            >
              {{ card?.customerName.charAt(0) ?? '?' }}
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white leading-tight">
                {{ card?.customerName }}
              </h2>
              <span
                class="mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                :class="card?.type === 'trial'
                  ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                  : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'"
              >
                {{ card?.type === 'trial' ? '🧪 Dùng thử' : '🚀 Triển khai thẳng' }}
              </span>
              <div class="mt-1.5">
                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                  :style="{ background: store.columnColor(card?.columnId ?? '') }"
                >{{ store.columnName(card?.columnId ?? '') }}</span>
              </div>
            </div>
          </div>

          <!-- Progress -->
          <div class="mb-4 space-y-2">
            <div class="flex justify-between text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              <span>Tiến độ tổng</span>
              <span>{{ card?.progress ?? 0 }}%</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="card?.progress === 100 ? 'bg-success-500' : 'bg-brand-500'"
                :style="{ width: `${card?.progress ?? 0}%` }"
              />
            </div>
          </div>

          <!-- Metrics tiles -->
          <div class="mb-4 grid grid-cols-3 gap-2">
            <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
              <p class="mb-1 text-[11px] text-gray-400">Tiến độ</p>
              <p class="text-theme-sm font-bold" :class="card?.progress === 100 ? 'text-success-500' : 'text-brand-500'">
                {{ card?.progress ?? 0 }}%
              </p>
            </div>
            <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
              <p class="mb-1 text-[11px] text-gray-400">Sản phẩm</p>
              <p class="text-theme-sm font-bold text-gray-900 dark:text-white">{{ card?.tracks.length ?? 0 }}</p>
            </div>
            <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 text-center">
              <p class="mb-1 text-[11px] text-gray-400">CV xong</p>
              <p class="text-theme-sm font-bold text-gray-900 dark:text-white">
                {{ doneSubTasks }}/{{ totalSubTasks }}
              </p>
            </div>
          </div>

          <!-- Trial countdown -->
          <div
            v-if="card?.trialDaysLeft !== undefined"
            class="mb-3 rounded-lg px-3 py-2 text-center text-[11px] font-bold"
            :class="card.trialDaysLeft <= 5
              ? 'border border-error-200 bg-error-50 text-error-600 dark:bg-error-900/20 dark:text-error-400'
              : 'border border-warning-200 bg-warning-50 text-warning-600 dark:bg-warning-900/20 dark:text-warning-400'"
          >
            {{ card.trialDaysLeft <= 5 ? '⚠' : '⏳' }}
            {{ card.trialDaysLeft <= 0 ? 'Hết hạn dùng thử!' : `Còn ${card.trialDaysLeft} ngày dùng thử` }}
          </div>

          <!-- Converting banner -->
          <div
            v-if="card?.isConverting"
            class="mb-3 rounded-lg border border-purple-300 bg-purple-50 px-3 py-2 text-center text-[11px] font-bold text-purple-700 dark:border-purple-700/40 dark:bg-purple-900/20 dark:text-purple-400"
          >
            ✍ Đang ký hợp đồng chính thức
          </div>

          <!-- Personnel key-value list -->
          <div class="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0 text-theme-sm text-gray-500">Sales phụ trách</span>
              <span class="truncate text-right text-theme-sm font-medium text-gray-900 dark:text-white">{{ card?.salesPerson || '—' }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0 text-theme-sm text-gray-500">Team Lead Sales</span>
              <span class="truncate text-right text-theme-sm font-medium text-gray-900 dark:text-white">{{ card?.salesLead || '—' }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0 text-theme-sm text-gray-500">PT Triển khai</span>
              <span class="truncate text-right text-theme-sm font-medium text-gray-900 dark:text-white">{{ card?.deployPerson || '—' }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0 text-theme-sm text-gray-500">Team Lead TK</span>
              <span class="truncate text-right text-theme-sm font-medium text-gray-900 dark:text-white">{{ card?.deployLead || '—' }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="shrink-0 text-theme-sm text-gray-500">Deadline TK</span>
              <span
                class="text-right text-theme-sm font-semibold"
                :class="isDeadlineSoon(card?.deployDeadline)
                  ? 'text-error-500'
                  : card?.deployDeadline ? 'text-gray-900 dark:text-white' : 'text-gray-400'"
              >{{ card?.deployDeadline || '—' }}</span>
            </div>
            <div v-if="card?.notes" class="pt-1">
              <p class="mb-1 text-[11px] text-gray-400">Ghi chú</p>
              <p class="text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed">{{ card.notes }}</p>
            </div>
          </div>

          <!-- Products -->
          <div class="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <p class="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-400">Sản phẩm</p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="t in card?.tracks ?? []"
                :key="t.product"
                class="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >{{ t.product }}</span>
            </div>
          </div>
        </div>

        <!-- AI Insight card -->
        <div class="rounded-xl border border-brand-200 dark:border-brand-500/30 bg-gradient-to-br from-brand-50 to-success-50/50 dark:from-brand-500/10 dark:to-success-500/5 p-4 flex gap-3">
          <Sparkles class="h-6 w-6 shrink-0 text-brand-500" />
          <div>
            <h4 class="mb-1 text-theme-sm font-semibold text-brand-600 dark:text-brand-400">Gợi ý từ AI</h4>
            <p class="text-[12px] text-gray-600 dark:text-gray-400">{{ aiInsight }}</p>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="grid grid-cols-4 gap-2">
          <Button
            v-for="action in quickActions"
            :key="action.label"
            type="button"
            variant="outline"
            class="h-auto flex-col py-2.5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
            @click="handleQuickAction(action.label)"
          >
            <component :is="action.icon" class="mb-1 h-4 w-4" />
            <span class="text-[11px] leading-tight">{{ action.label }}</span>
          </Button>
        </div>

        <!-- AI chat button -->
        <Button
          type="button"
          class="w-full gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-theme-xs hover:from-brand-600 hover:to-brand-600"
          @click="showAiChat = true"
        >
          <Sparkles class="h-4 w-4" />
          Hỏi AI về dự án này
        </Button>
      </aside>

      <!-- ═══════════════════════════════════════════════════════════
           RIGHT CONTENT (70%)
      ══════════════════════════════════════════════════════════════ -->
      <div class="flex-1 min-w-0 flex flex-col">

        <!-- Top bar with tabs + actions -->
        <div class="sticky top-0 z-10 shrink-0 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between gap-4 px-5 py-0">

            <!-- Mobile title -->
            <div class="flex items-center gap-2 min-w-0 lg:hidden py-3">
              <div
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                :style="{ background: card?.type === 'trial' ? '#f79009' : '#3450cc' }"
              >{{ card?.customerName.charAt(0) }}</div>
              <span class="truncate text-theme-sm font-semibold text-gray-900 dark:text-white">{{ card?.customerName }}</span>
            </div>

            <!-- Desktop: tab nav -->
            <nav class="hidden lg:flex items-center gap-1">
              <button
                v-for="tab in TABS"
                :key="tab.id"
                type="button"
                class="relative px-4 py-4 text-theme-sm font-medium transition-colors border-b-2"
                :class="activeTab === tab.id
                  ? 'text-brand-500 border-brand-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
                <span
                  v-if="tab.id === 'tasks' && totalSubTasks > 0"
                  class="ml-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 dark:text-gray-400"
                >{{ totalSubTasks }}</span>
                <span
                  v-if="tab.id === 'history' && (card?.activities?.length ?? 0) > 0"
                  class="ml-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 dark:text-gray-400"
                >{{ card?.activities?.length }}</span>
              </button>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-2 shrink-0 py-2.5">
              <Button type="button" variant="outline" class="border-gray-200 dark:border-gray-700 text-theme-xs" @click="openEdit">
                <Pencil class="mr-1.5 h-3.5 w-3.5" />Sửa
              </Button>
              <Button
                type="button"
                variant="outline"
                class="border-error-200 text-error-500 hover:bg-error-50 dark:border-error-500/30 text-theme-xs"
                @click="showDeleteConfirm = true"
              >
                <Trash2 class="mr-1.5 h-3.5 w-3.5" />Xóa
              </Button>
            </div>
          </div>
        </div>

        <!-- Stage chevrons -->
        <div class="hidden lg:flex shrink-0 overflow-x-auto border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div
            v-for="(col, idx) in DEPLOY_COLUMNS"
            :key="col.id"
            class="stage-chevron flex min-w-[110px] cursor-pointer items-center justify-center px-4 py-2 text-[11px] font-medium transition-all"
            :style="col.id === card?.columnId
              ? { background: col.color, color: '#fff' }
              : idx < currentColIndex
                ? { background: col.color + '22', color: col.color }
                : { background: '#f4f5f7', color: '#97a0af' }"
            @click="moveToColumn(col.id)"
          >
            <CheckCircle2 v-if="idx < currentColIndex" class="mr-1 h-3 w-3" />
            <Flag v-else-if="col.id === card?.columnId" class="mr-1 h-3 w-3" />
            {{ col.name }}
          </div>
        </div>

        <!-- ── TAB CONTENT ── -->
        <div class="flex-1 overflow-y-auto p-5 pb-10">

          <!-- ══════════════════════════════════════
               TAB: TỔNG QUAN
          ════════════════════════════════════════ -->
          <template v-if="activeTab === 'overview'">
            <div class="space-y-4">

              <!-- ── Deal overview accordion sections ── -->
              <template v-if="visibleOverviewSections.length">
                <div
                  v-for="section in visibleOverviewSections"
                  :key="section.id"
                  class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-theme-xs"
                >
                  <!-- Section header (toggle) -->
                  <button
                    type="button"
                    class="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    @click="toggleOverviewSection(section.id)"
                  >
                    <span class="text-[12px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {{ section.label }}
                    </span>
                    <ChevronRight
                      class="h-4 w-4 text-gray-400 transition-transform duration-200"
                      :class="expandedOverviewSections.has(section.id) ? 'rotate-90' : ''"
                    />
                  </button>

                  <!-- Section fields -->
                  <div
                    v-if="expandedOverviewSections.has(section.id)"
                    class="divide-y divide-gray-100 dark:divide-gray-700/60 border-t border-gray-100 dark:border-gray-700/60"
                  >
                    <template v-for="field in section.fields" :key="field.key">
                      <div
                        v-if="card?.dealOverview?.[field.key]"
                        class="flex items-start gap-3 px-4 py-2.5"
                      >
                        <span class="w-40 shrink-0 text-[12px] text-gray-500 dark:text-gray-400 pt-0.5">{{ field.label }}</span>
                        <span class="flex-1 text-[13px] font-medium text-gray-900 dark:text-white leading-relaxed break-words">
                          {{ card.dealOverview[field.key] }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>

              <!-- No deal overview -->
              <div
                v-else-if="!card?.dealOverview || !Object.values(card.dealOverview).some(v => v)"
                class="rounded-xl border border-dashed border-gray-200 px-5 py-8 text-center dark:border-gray-700"
              >
                <p class="text-[13px] text-gray-400">Chưa có thông tin tổng quan từ deal</p>
              </div>

            </div>
          </template>

          <!-- ══════════════════════════════════════
               TAB: CÁC CÔNG VIỆC TRIỂN KHAI
          ════════════════════════════════════════ -->
          <template v-else-if="activeTab === 'tasks'">
            <div class="space-y-4">

              <!-- Add sub-task button -->
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-300 p-3 text-[13px] text-gray-400 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-gray-600 dark:hover:border-brand-500"
                @click="openAddSubTask"
              >
                <Plus class="h-4 w-4" />
                Thêm công việc triển khai
              </button>

              <!-- No sub-tasks empty state -->
              <div
                v-if="!card?.subTasks?.length"
                class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-12 text-center dark:border-gray-700"
              >
                <ListChecks class="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p class="text-theme-sm font-medium text-gray-500">Chưa có công việc nào</p>
                <p class="mt-1 text-[12px] text-gray-400">Thêm công việc triển khai để theo dõi tiến độ</p>
              </div>

              <!-- Sub-tasks grouped by product -->
              <div
                v-for="group in subTasksByProduct"
                :key="group.product"
                class="space-y-2"
              >
                <!-- Product header -->
                <div class="flex items-center gap-2">
                  <span class="rounded-lg bg-gray-900 dark:bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-white dark:text-gray-900">
                    {{ group.product }}
                  </span>
                  <span class="text-[12px] text-gray-400">
                    {{ group.tasks.filter(t => t.status === 'done').length }}/{{ group.tasks.length }} hoàn thành
                  </span>
                </div>

                <!-- Sub-task rows -->
                <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-theme-xs">
                  <div
                    v-for="st in group.tasks"
                    :key="st.id"
                    class="group flex items-center gap-3 border-b border-gray-100 px-4 py-3.5 last:border-0 dark:border-gray-700/60 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    @click="openSubTask(st)"
                  >
                    <!-- Status icon -->
                    <div
                      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      :class="{
                        'bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400': st.status === 'done',
                        'bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400': st.status === 'in_progress',
                        'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500': st.status === 'todo',
                      }"
                    >
                      <CheckCircle2 v-if="st.status === 'done'" class="h-4 w-4" />
                      <CircleDot v-else-if="st.status === 'in_progress'" class="h-4 w-4" />
                      <Circle v-else class="h-4 w-4" />
                    </div>

                    <!-- Title -->
                    <span
                      class="flex-1 text-[13px] font-medium"
                      :class="st.status === 'done'
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-900 dark:text-white'"
                    >
                      {{ st.title }}
                    </span>

                    <!-- Checklist progress -->
                    <span
                      v-if="st.checklist?.length"
                      class="hidden sm:flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                      :class="st.checklist.every(i => i.done)
                        ? 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                    >
                      <SquareCheckBig class="h-3 w-3" />
                      {{ st.checklist.filter(i => i.done).length }}/{{ st.checklist.length }}
                    </span>

                    <!-- Assignee -->
                    <span
                      v-if="st.assignee"
                      class="hidden sm:flex items-center gap-1 text-[11px] text-gray-400"
                    >
                      <User class="h-3 w-3" />
                      {{ st.assignee }}
                    </span>

                    <!-- Due date -->
                    <span
                      v-if="st.dueDate"
                      class="hidden sm:flex items-center gap-1 text-[11px]"
                      :class="isDueSoon(st.dueDate) ? 'text-error-500 font-medium' : 'text-gray-400'"
                    >
                      <CalendarDays class="h-3 w-3" />
                      {{ st.dueDate }}
                    </span>

                    <!-- Status badge -->
                    <span
                      class="hidden sm:inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      :class="{
                        'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400': st.status === 'done',
                        'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400': st.status === 'in_progress',
                        'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500': st.status === 'todo',
                      }"
                    >{{ subTaskStatusText(st.status) }}</span>

                    <!-- Delete button -->
                    <button
                      type="button"
                      class="ml-1 shrink-0 opacity-0 group-hover:opacity-100 rounded p-1 text-gray-300 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all"
                      @click.stop="promptDeleteSubTask(st.id)"
                    >
                      <Trash2 class="h-3.5 w-3.5" />
                    </button>

                    <ChevronRight class="h-4 w-4 shrink-0 text-gray-300 group-hover:text-gray-400 dark:text-gray-600 transition-colors" />
                  </div>
                </div>
              </div>

            </div>
          </template>

          <!-- ══════════════════════════════════════
               TAB: DANH SÁCH SẢN PHẨM (Won deal products)
          ════════════════════════════════════════ -->
          <template v-else-if="activeTab === 'products'">
            <div class="space-y-3">

              <!-- Summary bar -->
              <div v-if="card?.wonProducts?.length" class="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3">
                <div class="flex items-center gap-2 text-[13px] text-gray-700 dark:text-gray-300">
                  <Box class="h-4 w-4 text-brand-500" />
                  <span class="font-semibold">{{ card.wonProducts.length }}</span>
                  <span class="text-gray-500">sản phẩm / dịch vụ từ deal won</span>
                </div>
                <span class="rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold text-success-600 dark:bg-success-900/30 dark:text-success-400">
                  Deal đã ký
                </span>
              </div>

              <!-- Product list -->
              <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-theme-xs">
                <div
                  v-for="(product, idx) in card?.wonProducts ?? []"
                  :key="product.id"
                  class="flex items-start gap-4 border-b border-gray-100 px-5 py-4 last:border-0 dark:border-gray-700/60"
                >
                  <!-- Index + avatar -->
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold"
                    :class="product.category === 'Dịch vụ'
                      ? 'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                      : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'"
                  >
                    {{ idx + 1 }}
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-0.5">
                      <p class="text-[13px] font-semibold text-gray-900 dark:text-white">{{ product.name }}</p>
                      <span
                        class="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        :class="product.category === 'Dịch vụ'
                          ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                          : 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400'"
                      >{{ product.category }}</span>
                    </div>
                    <p class="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed">{{ product.description }}</p>
                  </div>

                  <!-- Qty + unit (no price) -->
                  <div class="shrink-0 text-right">
                    <p class="text-[13px] font-semibold text-gray-900 dark:text-white tabular-nums">× {{ product.quantity }}</p>
                    <p class="text-[11px] text-gray-400">{{ product.unit }}</p>
                  </div>
                </div>

                <!-- Empty state inside card -->
                <div v-if="!card?.wonProducts?.length" class="px-5 py-12 text-center">
                  <Box class="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                  <p class="text-theme-sm text-gray-500">Chưa có sản phẩm từ deal won</p>
                  <p class="mt-1 text-[12px] text-gray-400">Sản phẩm sẽ được lấy từ deal đã ký kết</p>
                </div>
              </div>

            </div>
          </template>

          <!-- ══════════════════════════════════════
               TAB: LỊCH SỬ THAY ĐỔI (Activities)
          ════════════════════════════════════════ -->
          <template v-else-if="activeTab === 'history'">
            <div class="space-y-3">

              <!-- Add activity -->
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-300 p-3 text-[13px] text-gray-400 transition-colors hover:border-brand-400 hover:text-brand-500 dark:border-gray-600 dark:hover:border-brand-500"
                @click="showAddActivity = true"
              >
                <Plus class="h-4 w-4" />
                Thêm ghi chú / hoạt động
              </button>

              <!-- Activity items -->
              <div
                v-for="act in card?.activities ?? []"
                :key="act.id"
                class="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
                  :style="{ background: act.authorColor }"
                >
                  <component :is="activityIcon(act.type)" class="h-3.5 w-3.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2">
                      <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300">{{ act.author }}</span>
                      <span
                        class="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                        :class="{
                          'bg-brand-50 text-brand-600': act.type === 'note',
                          'bg-success-50 text-success-600': act.type === 'call',
                          'bg-warning-50 text-warning-600': act.type === 'email',
                          'bg-purple-50 text-purple-600': act.type === 'meeting',
                          'bg-gray-100 text-gray-500': act.type === 'system' || act.type === 'stage_change',
                        }"
                      >{{ activityTypeLabel(act.type) }}</span>
                    </div>
                    <span class="shrink-0 text-[10px] text-gray-400">{{ act.createdAt }}</span>
                  </div>
                  <p class="text-theme-sm text-gray-700 dark:text-gray-300">{{ act.content }}</p>
                </div>
              </div>

              <div v-if="!card?.activities?.length" class="rounded-xl border border-dashed border-gray-200 p-6 text-center text-[13px] text-gray-400 dark:border-gray-700">
                Chưa có hoạt động nào.
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         SUB-TASK DIALOG (view / edit công việc con + checklist)
    ══════════════════════════════════════════════════════════════ -->
    <Dialog v-model:open="showSubTaskDialog">
      <DialogContent class="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="rounded-md bg-gray-900 dark:bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-white dark:text-gray-900">
              {{ subTaskForm.product }}
            </span>
            <DialogTitle class="text-[15px]">{{ subTaskForm.title }}</DialogTitle>
          </div>
          <p class="text-[12px] text-gray-400 mt-0.5">{{ card?.customerName }}</p>
        </DialogHeader>

        <div class="mt-3 space-y-4">

          <!-- Title editable -->
          <div class="space-y-1.5">
            <Label>Tên công việc</Label>
            <Input v-model="subTaskForm.title" placeholder="Tên công việc con..." />
          </div>

          <!-- Status + Due date -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select v-model="subTaskForm.status">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">⏸ Chờ thực hiện</SelectItem>
                  <SelectItem value="in_progress">▶ Đang làm</SelectItem>
                  <SelectItem value="done">✓ Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label>Deadline công việc</Label>
              <Input v-model="subTaskForm.dueDate" type="date" />
            </div>
          </div>

          <!-- Assignee -->
          <div class="space-y-1.5">
            <Label>Người thực hiện</Label>
            <Input v-model="subTaskForm.assignee" placeholder="Tên nhân viên phụ trách..." />
          </div>

          <!-- Note -->
          <div class="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea v-model="subTaskForm.note" :rows="2" placeholder="Ghi chú cho công việc này..." />
          </div>

          <!-- Checklist section -->
          <div>
            <div class="mb-2 flex items-center justify-between">
              <Label class="flex items-center gap-1.5">
                <SquareCheckBig class="h-3.5 w-3.5 text-gray-400" />
                Checklist
              </Label>
              <span class="text-[12px] text-gray-400 tabular-nums">
                {{ subTaskForm.checklist.filter(i => i.done).length }}/{{ subTaskForm.checklist.length }}
              </span>
            </div>

            <!-- Progress bar -->
            <div class="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="checklistPercent === 100 ? 'bg-success-500' : 'bg-brand-500'"
                :style="{ width: `${checklistPercent}%` }"
              />
            </div>

            <!-- Checklist items -->
            <div class="space-y-1 mb-3">
              <div
                v-for="item in subTaskForm.checklist"
                :key="item.id"
                class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/40 group"
              >
                <!-- Checkbox -->
                <input
                  type="checkbox"
                  :checked="item.done"
                  class="h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-brand-500"
                  @change="item.done = !item.done"
                />
                <!-- Label -->
                <span
                  class="flex-1 text-[13px] leading-relaxed transition-colors"
                  :class="item.done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'"
                >{{ item.label }}</span>
                <!-- Assignee -->
                <span v-if="item.assignee" class="hidden sm:flex items-center gap-1 text-[11px] text-gray-400">
                  <User class="h-3 w-3" />{{ item.assignee }}
                </span>
                <!-- Deadline -->
                <span
                  v-if="item.deadline"
                  class="hidden sm:flex items-center gap-1 text-[11px]"
                  :class="isDueSoon(item.deadline) && !item.done ? 'text-error-500 font-medium' : 'text-gray-400'"
                >
                  <CalendarDays class="h-3 w-3" />{{ item.deadline }}
                </span>
                <!-- Remove -->
                <button
                  type="button"
                  class="ml-1 shrink-0 opacity-30 group-hover:opacity-100 rounded p-0.5 text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all"
                  @click="removeChecklistItem(item.id)"
                >
                  <X class="h-3.5 w-3.5" />
                </button>
              </div>

              <div v-if="!subTaskForm.checklist.length" class="py-2 text-center text-[12px] text-gray-400">
                Chưa có mục checklist nào
              </div>
            </div>

            <!-- Add checklist item form -->
            <div class="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <p class="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Thêm mục checklist</p>
              <Input
                v-model="newChecklistLabel"
                placeholder="Nội dung công việc..."
                class="text-[13px]"
                @keydown.enter.prevent="addChecklistItem"
              />
              <div class="grid grid-cols-2 gap-2">
                <Input v-model="newChecklistAssignee" placeholder="Người thực hiện" class="text-[12px]" />
                <Input v-model="newChecklistDeadline" type="date" class="text-[12px]" />
              </div>
              <Button
                type="button"
                variant="outline"
                class="w-full text-[12px] gap-1.5"
                :disabled="!newChecklistLabel.trim()"
                @click="addChecklistItem"
              >
                <Plus class="h-3.5 w-3.5" />
                Thêm mục
              </Button>
            </div>
          </div>

        </div>

        <DialogFooter class="mt-5">
          <Button type="button" variant="outline" @click="showSubTaskDialog = false">Hủy</Button>
          <Button type="button" class="bg-brand-500 hover:bg-brand-600 text-white" @click="saveSubTask">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════════════════
         ADD SUB-TASK DIALOG
    ══════════════════════════════════════════════════════════════ -->
    <Dialog v-model:open="showAddSubTaskDialog">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm công việc con</DialogTitle>
        </DialogHeader>
        <div class="mt-2 space-y-4">
          <div class="space-y-1.5">
            <Label>Tên công việc <span class="text-error-500">*</span></Label>
            <Input v-model="addSubTaskForm.title" placeholder="Mô tả công việc cần làm..." />
          </div>
          <div class="space-y-1.5">
            <Label>Sản phẩm <span class="text-error-500">*</span></Label>
            <Select v-model="addSubTaskForm.product">
              <SelectTrigger><SelectValue placeholder="Chọn sản phẩm" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="t in card?.tracks ?? []" :key="t.product" :value="t.product">
                  {{ t.product }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label>Người thực hiện</Label>
              <Input v-model="addSubTaskForm.assignee" placeholder="Tên nhân viên" />
            </div>
            <div class="space-y-1.5">
              <Label>Deadline</Label>
              <Input v-model="addSubTaskForm.dueDate" type="date" />
            </div>
          </div>
        </div>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="showAddSubTaskDialog = false">Hủy</Button>
          <Button type="button" class="bg-brand-500 hover:bg-brand-600 text-white" @click="submitAddSubTask">
            Tạo công việc
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════════════════
         PHASE STATUS DIALOG
    ══════════════════════════════════════════════════════════════ -->
    <Dialog v-model:open="showPhaseDialog">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái công đoạn</DialogTitle>
        </DialogHeader>
        <div class="mt-2 space-y-3">
          <div class="space-y-1.5">
            <Label>Công đoạn</Label>
            <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ phaseDialogData?.label }}</p>
          </div>
          <div class="space-y-1.5">
            <Label>Trạng thái</Label>
            <Select v-model="phaseDialogStatus">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="waiting">⏸ Chờ thực hiện</SelectItem>
                <SelectItem value="active">▶ Đang làm</SelectItem>
                <SelectItem value="trial-active">🧪 Đang thử</SelectItem>
                <SelectItem value="done">✓ Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="showPhaseDialog = false">Hủy</Button>
          <Button type="button" class="bg-brand-500 hover:bg-brand-600 text-white" @click="savePhaseStatus">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════════════════
         ADD ACTIVITY DIALOG
    ══════════════════════════════════════════════════════════════ -->
    <Dialog v-model:open="showAddActivity">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm hoạt động</DialogTitle>
        </DialogHeader>
        <div class="mt-2 space-y-4">
          <div class="space-y-1.5">
            <Label>Loại hoạt động</Label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="t in ACTIVITY_TYPES"
                :key="t.id"
                type="button"
                class="rounded-full border px-3 py-1 text-[12px] font-medium transition-colors"
                :class="activityForm.type === t.id
                  ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'"
                @click="activityForm.type = t.id"
              >{{ t.label }}</button>
            </div>
          </div>
          <div class="space-y-1.5">
            <Label>Nội dung</Label>
            <Textarea v-model="activityForm.content" placeholder="Mô tả hoạt động..." :rows="3" />
          </div>
          <div class="space-y-1.5">
            <Label>Người thực hiện</Label>
            <Input v-model="activityForm.author" placeholder="Tên nhân viên" />
          </div>
        </div>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="showAddActivity = false">Hủy</Button>
          <Button type="button" class="bg-brand-500 hover:bg-brand-600 text-white" @click="submitActivity">Lưu hoạt động</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ═══════════════════════════════════════════════════════════
         EDIT CARD DIALOG
    ══════════════════════════════════════════════════════════════ -->
    <Dialog v-model:open="showEditDialog">
      <DialogContent class="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa thông tin dự án</DialogTitle>
        </DialogHeader>
        <form class="mt-2 space-y-4" @submit.prevent="submitEdit">
          <div class="space-y-1.5">
            <Label>Tên khách hàng <span class="text-error-500">*</span></Label>
            <Input v-model="editForm.customerName" placeholder="Tên khách hàng / khách sạn" />
          </div>
          <div class="space-y-1.5">
            <Label>Người liên hệ</Label>
            <Input v-model="editForm.contactName" placeholder="Tên người liên hệ" />
          </div>
          <div class="space-y-1.5">
            <Label>Giai đoạn</Label>
            <Select v-model="editForm.columnId">
              <SelectTrigger><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
              <SelectContent>
                <SelectItem v-for="col in DEPLOY_COLUMNS" :key="col.id" :value="col.id">{{ col.name }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Personnel fields -->
          <div class="space-y-1 pt-1">
            <p class="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-3">Nhân sự phụ trách</p>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label>Sales phụ trách</Label>
                <Input v-model="editForm.salesPerson" placeholder="Tên Sales" />
              </div>
              <div class="space-y-1.5">
                <Label>Team Lead Sales</Label>
                <Input v-model="editForm.salesLead" placeholder="Tên Team Lead" />
              </div>
              <div class="space-y-1.5">
                <Label>PT Triển khai</Label>
                <Input v-model="editForm.deployPerson" placeholder="Tên nhân viên TK" />
              </div>
              <div class="space-y-1.5">
                <Label>Team Lead TK</Label>
                <Input v-model="editForm.deployLead" placeholder="Tên Team Lead TK" />
              </div>
            </div>
            <div class="space-y-1.5 pt-1">
              <Label>Deadline triển khai</Label>
              <Input v-model="editForm.deployDeadline" type="date" />
            </div>
          </div>

          <template v-if="card?.type === 'trial'">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label>Ngày bắt đầu DT</Label>
                <Input v-model="editForm.trialStartDate" type="date" />
              </div>
              <div class="space-y-1.5">
                <Label>Ngày kết thúc DT</Label>
                <Input v-model="editForm.trialEndDate" type="date" />
              </div>
            </div>
          </template>
          <div class="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea v-model="editForm.notes" placeholder="Ghi chú..." :rows="3" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" @click="showEditDialog = false">Hủy</Button>
            <Button type="submit" class="bg-brand-500 hover:bg-brand-600 text-white">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <!-- Delete sub-task confirm -->
    <Dialog v-model:open="showDeleteSubTaskConfirm">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa công việc</DialogTitle>
        </DialogHeader>
        <p class="text-theme-sm text-gray-600 dark:text-gray-400">
          Bạn có chắc muốn xóa công việc này? Hành động này không thể hoàn tác.
        </p>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="showDeleteSubTaskConfirm = false">Hủy</Button>
          <Button type="button" class="bg-error-500 hover:bg-error-600 text-white" @click="confirmDeleteSubTask">Xóa công việc</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete confirm -->
    <Dialog v-model:open="showDeleteConfirm">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa dự án</DialogTitle>
        </DialogHeader>
        <p class="text-theme-sm text-gray-600 dark:text-gray-400">
          Bạn có chắc muốn xóa dự án <strong>{{ card?.customerName }}</strong>? Hành động này không thể hoàn tác.
        </p>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="showDeleteConfirm = false">Hủy</Button>
          <Button type="button" class="bg-error-500 hover:bg-error-600 text-white" @click="confirmDelete">Xóa dự án</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- AI chat -->
    <Dialog v-model:open="showAiChat">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Sparkles class="h-4 w-4 text-brand-500" />
            Hỏi AI về dự án
          </DialogTitle>
        </DialogHeader>
        <div class="mt-2 rounded-xl bg-gradient-to-br from-brand-50 to-success-50/50 p-4 text-theme-sm text-gray-700 dark:from-brand-500/10 dark:to-success-500/5 dark:text-gray-300">
          <p class="font-semibold mb-2 text-brand-600 dark:text-brand-400">Phân tích dự án {{ card?.customerName }}</p>
          <p>{{ aiInsight }}</p>
        </div>
        <DialogFooter class="mt-4">
          <Button type="button" variant="outline" @click="showAiChat = false">Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Box, CalendarDays, CheckCircle2, ChevronRight,
  Circle, CircleDot, Flag, ListChecks, Mail, MessageSquare,
  Pencil, Phone, Plus, Sparkles, SquareCheckBig, Trash2, User, X,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  DEPLOY_COLUMNS, useDeploymentStore,
  type ChecklistItem, type DeployActivity, type PhaseStatus, type ProductTrack, type SubTask, type SubTaskStatus,
} from '@/stores/useDeploymentStore'

// ─── Router & Store ───────────────────────────────────────────

const route  = useRoute()
const router = useRouter()
const store  = useDeploymentStore()

// ─── Data ─────────────────────────────────────────────────────

const deploymentId = computed(() => String(route.params.deploymentId))
const card = computed(() => store.getById(deploymentId.value))

onMounted(() => {
  if (!card.value) {
    toast.error('Không tìm thấy dự án triển khai')
    void router.push({ path: '/crm-deals', query: { tab: 'deployment' } })
  }
})

// ─── Constants ────────────────────────────────────────────────

const TABS = [
  { id: 'overview',  label: 'Tổng quan' },
  { id: 'tasks',     label: 'Các công việc triển khai' },
  { id: 'products',  label: 'Danh sách sản phẩm' },
  { id: 'history',   label: 'Lịch sử thay đổi' },
] as const

const ACTIVITY_TYPES = [
  { id: 'note',    label: '📝 Ghi chú' },
  { id: 'call',    label: '📞 Gọi điện' },
  { id: 'email',   label: '📧 Email' },
  { id: 'meeting', label: '🤝 Gặp mặt' },
]

const OVERVIEW_SECTIONS = [
  {
    id: 'general', label: 'Thông tin chung',
    fields: [
      { key: 'general_deal_title',  label: 'Tên Deal' },
      { key: 'general_deal_type',   label: 'Loại Deal' },
      { key: 'general_probability', label: 'Tỉ lệ thắng' },
      { key: 'general_begin_date',  label: 'Ngày bắt đầu' },
      { key: 'general_close_date',  label: 'Ngày đóng dự kiến' },
      { key: 'general_assigned_to', label: 'Người phụ trách' },
      { key: 'general_source',      label: 'Nguồn' },
    ],
  },
  {
    id: 'hotel', label: 'Khách sạn',
    fields: [
      { key: 'hotel_name',    label: 'Tên cơ sở' },
      { key: 'hotel_city',    label: 'Tỉnh/Thành phố' },
      { key: 'hotel_address', label: 'Địa chỉ' },
      { key: 'hotel_rooms',   label: 'Số phòng' },
      { key: 'hotel_stars',   label: 'Hạng sao' },
      { key: 'hotel_type',    label: 'Loại hình cơ sở' },
      { key: 'hotel_pms',     label: 'PMS hiện tại' },
      { key: 'hotel_manager', label: 'Người quản lý' },
    ],
  },
  {
    id: 'product', label: 'Sản phẩm & Demo',
    fields: [
      { key: 'product_expected',  label: 'Sản phẩm dự kiến' },
      { key: 'product_demo_date', label: 'Ngày demo' },
      { key: 'product_demo_done', label: 'Đã demo' },
    ],
  },
  {
    id: 'marketing', label: 'Marketing & Lead',
    fields: [
      { key: 'marketing_channel',   label: 'Kênh marketing' },
      { key: 'marketing_lead_form', label: 'Form đăng ký' },
    ],
  },
  {
    id: 'lead_sdr', label: 'Lead/SDR Status',
    fields: [
      { key: 'lead_sdr_status',    label: 'Trạng thái SDR' },
      { key: 'lead_sdr_call_date', label: 'Ngày gọi điện' },
    ],
  },
  {
    id: 'assessment', label: 'Đánh giá',
    fields: [
      { key: 'assessment_health',      label: 'Sức khỏe deal' },
      { key: 'assessment_interest',    label: 'Mức độ quan tâm' },
      { key: 'assessment_competitor',  label: 'Đối thủ cạnh tranh' },
      { key: 'assessment_ai_summary',  label: 'AI tóm tắt Deal' },
    ],
  },
  {
    id: 'meeting', label: '1st Meeting',
    fields: [
      { key: 'meeting_date',   label: 'Ngày họp' },
      { key: 'meeting_type',   label: 'Hình thức họp' },
      { key: 'meeting_result', label: 'Kết quả' },
    ],
  },
  {
    id: 'contract', label: 'Hợp đồng & Bảo trì',
    fields: [
      { key: 'contract_number',          label: 'Số hợp đồng' },
      { key: 'contract_date',            label: 'Ngày ký hợp đồng' },
      { key: 'contract_type',            label: 'Loại hợp đồng' },
      { key: 'contract_maintenance_end', label: 'Hạn bảo trì' },
    ],
  },
  {
    id: 'payment', label: 'Thanh toán',
    fields: [
      { key: 'payment_term',   label: 'Điều khoản thanh toán' },
      { key: 'payment_status', label: 'Trạng thái thanh toán' },
      { key: 'payment_date1',  label: 'Ngày TT đợt 1' },
    ],
  },
  {
    id: 'invoice', label: 'Hoá đơn',
    fields: [
      { key: 'invoice_number', label: 'Số hoá đơn' },
      { key: 'invoice_date',   label: 'Ngày xuất hoá đơn' },
    ],
  },
  {
    id: 'voucher', label: 'BD / Voucher',
    fields: [
      { key: 'voucher_code',    label: 'Mã Voucher' },
      { key: 'voucher_bd_note', label: 'Ghi chú BD' },
    ],
  },
  {
    id: 'upsale', label: 'Up-sale & Win-back',
    fields: [
      { key: 'upsale_status', label: 'Trạng thái upsale' },
    ],
  },
  {
    id: 'system', label: 'Hệ thống',
    fields: [
      { key: 'system_contact', label: 'Người liên hệ' },
      { key: 'system_company', label: 'Công ty' },
    ],
  },
] as const

const quickActions = [
  { label: 'Ghi chú', icon: MessageSquare },
  { label: 'Tác vụ',  icon: SquareCheckBig },
  { label: 'Email',   icon: Mail },
  { label: 'Gọi',     icon: Phone },
]

// ─── State ────────────────────────────────────────────────────

const activeTab = ref<'overview' | 'tasks' | 'products' | 'history'>('overview')

// Overview accordion — general, hotel, contract expanded by default
const expandedOverviewSections = ref(new Set<string>(['general', 'hotel', 'contract', 'assessment']))

const showSubTaskDialog          = ref(false)
const showAddSubTaskDialog       = ref(false)
const showPhaseDialog            = ref(false)
const showAddActivity            = ref(false)
const showEditDialog             = ref(false)
const showDeleteConfirm          = ref(false)
const showDeleteSubTaskConfirm   = ref(false)
const deletingSubTaskId          = ref<string | null>(null)
const showAiChat                 = ref(false)

// Selected sub-task for editing
const editingSubTaskId = ref<string | null>(null)

// Sub-task form (used for both view and edit)
const subTaskForm = reactive({
  title:     '',
  product:   '',
  status:    'todo' as SubTaskStatus,
  dueDate:   '',
  assignee:  '',
  note:      '',
  checklist: [] as ChecklistItem[],
})

// New checklist item form
const newChecklistLabel    = ref('')
const newChecklistAssignee = ref('')
const newChecklistDeadline = ref('')

// Add sub-task form
const addSubTaskForm = reactive({ title: '', product: '', assignee: '', dueDate: '' })

// Phase dialog
const phaseDialogData = ref<{ product: string; index: number; label: string } | null>(null)
const phaseDialogStatus = ref<PhaseStatus>('waiting')

// Activity form
const activityForm = reactive({ type: 'note', content: '', author: '' })

// Edit card form
const editForm = reactive({
  customerName: '', contactName: '', columnId: '',
  salesPerson: '', salesLead: '', deployPerson: '', deployLead: '', deployDeadline: '',
  trialStartDate: '', trialEndDate: '', notes: '',
})

// ─── Computed ─────────────────────────────────────────────────

const currentColIndex = computed(() =>
  DEPLOY_COLUMNS.findIndex((c) => c.id === card.value?.columnId),
)

const totalSubTasks = computed(() => card.value?.subTasks?.length ?? 0)
const doneSubTasks  = computed(() =>
  card.value?.subTasks?.filter((s) => s.status === 'done').length ?? 0,
)

const subTasksByProduct = computed(() => {
  const tasks = card.value?.subTasks ?? []
  const productOrder = card.value?.tracks.map((t) => t.product) ?? []
  const groups: { product: string; tasks: SubTask[] }[] = []
  for (const product of productOrder) {
    const productTasks = tasks.filter((t) => t.product === product)
    if (productTasks.length) groups.push({ product, tasks: productTasks })
  }
  // Sub-tasks with products not in tracks
  const orphaned = tasks.filter((t) => !productOrder.includes(t.product))
  if (orphaned.length) groups.push({ product: 'Khác', tasks: orphaned })
  return groups
})

const visibleOverviewSections = computed(() =>
  OVERVIEW_SECTIONS.filter((section) =>
    section.fields.some((f) => !!card.value?.dealOverview?.[f.key]),
  ),
)

const checklistPercent = computed(() => {
  if (!subTaskForm.checklist.length) return 0
  return Math.round(subTaskForm.checklist.filter((i) => i.done).length / subTaskForm.checklist.length * 100)
})

const aiInsight = computed(() => {
  if (!card.value) return ''
  if (card.value.progress === 100) return 'Dự án đã hoàn thành. Nên liên hệ khách hàng sau 30 ngày để đánh giá hiệu quả và up-sell thêm sản phẩm.'
  if (card.value.trialDaysLeft !== undefined && card.value.trialDaysLeft <= 5) return `Dùng thử còn ${card.value.trialDaysLeft} ngày! Ưu tiên liên hệ ngay để thúc đẩy ký hợp đồng chính thức.`
  if (card.value.isConverting) return 'Khách hàng đang ký hợp đồng. Đảm bảo hỗ trợ pháp lý và kế toán xử lý nhanh để không mất deal.'
  return `Tiến độ ${card.value.progress}%. Nên review lại lịch triển khai và đảm bảo đủ nhân lực cho giai đoạn tiếp theo.`
})

// ─── Helpers ──────────────────────────────────────────────────

function toggleOverviewSection(id: string): void {
  if (expandedOverviewSections.value.has(id)) {
    expandedOverviewSections.value.delete(id)
  } else {
    expandedOverviewSections.value.add(id)
  }
}

function productProgress(track: ProductTrack): number {
  if (!track.phases.length) return 0
  return Math.round(track.phases.filter((p) => p.status === 'done').length / track.phases.length * 100)
}

function isDueSoon(dueDate?: string): boolean {
  if (!dueDate) return false
  const diff = new Date(dueDate).getTime() - Date.now()
  return diff < 3 * 24 * 60 * 60 * 1000
}

function isDeadlineSoon(dueDate?: string): boolean {
  if (!dueDate) return false
  const diff = new Date(dueDate).getTime() - Date.now()
  return diff < 7 * 24 * 60 * 60 * 1000
}

function phaseStatusText(status: PhaseStatus): string {
  const map: Record<PhaseStatus, string> = {
    done: 'Xong', active: 'Đang làm', 'trial-active': 'Đang thử', waiting: 'Chờ',
  }
  return map[status]
}

function subTaskStatusText(status: SubTaskStatus): string {
  const map: Record<SubTaskStatus, string> = {
    done: 'Xong', in_progress: 'Đang làm', todo: 'Chờ',
  }
  return map[status]
}

function activityIcon(type: string) {
  const map: Record<string, unknown> = {
    note: MessageSquare, call: Phone, email: Mail, meeting: SquareCheckBig,
    system: Flag, stage_change: Flag,
  }
  return map[type] ?? MessageSquare
}

function activityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    note: 'Ghi chú', call: 'Gọi điện', email: 'Email', meeting: 'Gặp mặt',
    system: 'Hệ thống', stage_change: 'Chuyển giai đoạn',
  }
  return map[type] ?? type
}

// ─── Sub-task actions ──────────────────────────────────────────

function openSubTask(st: SubTask): void {
  editingSubTaskId.value = st.id
  subTaskForm.title     = st.title
  subTaskForm.product   = st.product
  subTaskForm.status    = st.status
  subTaskForm.dueDate   = st.dueDate
  subTaskForm.assignee  = st.assignee
  subTaskForm.note      = st.note
  subTaskForm.checklist = st.checklist.map((i) => ({ ...i }))
  newChecklistLabel.value    = ''
  newChecklistAssignee.value = ''
  newChecklistDeadline.value = ''
  showSubTaskDialog.value = true
}

function addChecklistItem(): void {
  if (!newChecklistLabel.value.trim()) return
  subTaskForm.checklist.push({
    id:       `cl-${Date.now()}`,
    label:    newChecklistLabel.value.trim(),
    done:     false,
    assignee: newChecklistAssignee.value.trim(),
    deadline: newChecklistDeadline.value,
  })
  newChecklistLabel.value    = ''
  newChecklistAssignee.value = ''
  newChecklistDeadline.value = ''
}

function removeChecklistItem(itemId: string): void {
  subTaskForm.checklist = subTaskForm.checklist.filter((i) => i.id !== itemId)
}

function saveSubTask(): void {
  if (!editingSubTaskId.value) return
  store.updateSubTask(deploymentId.value, editingSubTaskId.value, {
    title:     subTaskForm.title.trim(),
    status:    subTaskForm.status,
    dueDate:   subTaskForm.dueDate,
    assignee:  subTaskForm.assignee.trim(),
    note:      subTaskForm.note.trim(),
    checklist: subTaskForm.checklist,
  })
  showSubTaskDialog.value = false
  toast.success('Đã cập nhật công việc')
}

function openAddSubTask(): void {
  addSubTaskForm.title    = ''
  addSubTaskForm.product  = card.value?.tracks[0]?.product ?? ''
  addSubTaskForm.assignee = ''
  addSubTaskForm.dueDate  = ''
  showAddSubTaskDialog.value = true
}

function submitAddSubTask(): void {
  if (!addSubTaskForm.title.trim()) { toast.error('Vui lòng nhập tên công việc'); return }
  if (!addSubTaskForm.product) { toast.error('Vui lòng chọn sản phẩm'); return }
  const newSt: SubTask = {
    id:        `st-${Date.now()}`,
    title:     addSubTaskForm.title.trim(),
    product:   addSubTaskForm.product,
    status:    'todo',
    dueDate:   addSubTaskForm.dueDate,
    assignee:  addSubTaskForm.assignee.trim(),
    note:      '',
    checklist: [],
  }
  store.addSubTask(deploymentId.value, newSt)
  showAddSubTaskDialog.value = false
  toast.success('Đã thêm công việc con')
}

// ─── Phase actions ─────────────────────────────────────────────

function openPhaseDialog(product: string, index: number): void {
  const track = card.value?.tracks.find((t) => t.product === product)
  const phase = track?.phases[index]
  if (!phase) return
  phaseDialogData.value   = { product, index, label: phase.label }
  phaseDialogStatus.value = phase.status
  showPhaseDialog.value   = true
}

function savePhaseStatus(): void {
  if (!phaseDialogData.value) return
  store.updatePhase(deploymentId.value, phaseDialogData.value.product, phaseDialogData.value.index, phaseDialogStatus.value)
  showPhaseDialog.value = false
  toast.success('Đã cập nhật trạng thái công đoạn')
}

// ─── Navigation & column actions ─────────────────────────────

function goBack(): void {
  void router.push({ path: '/crm-deals', query: { tab: 'deployment' } })
}

function moveToColumn(colId: string): void {
  if (!card.value || colId === card.value.columnId) return
  const oldName = store.columnName(card.value.columnId)
  const newName = store.columnName(colId)
  store.updateCard(deploymentId.value, { columnId: colId })
  store.addActivity(deploymentId.value, {
    id:             `act-${Date.now()}`,
    type:           'stage_change',
    content:        `Chuyển giai đoạn: ${oldName} → ${newName}`,
    author:         card.value.assignees[0]?.name ?? 'Hệ thống',
    authorInitials: card.value.assignees[0]?.initials ?? 'HT',
    authorColor:    card.value.assignees[0]?.color ?? '#6b778c',
    createdAt:      new Date().toLocaleString('vi-VN'),
  })
  toast.success(`Đã chuyển sang "${newName}"`)
}

function handleQuickAction(label: string): void {
  if (label === 'Ghi chú') { activityForm.type = 'note'; showAddActivity.value = true; activeTab.value = 'history' }
  else if (label === 'Gọi')   { activityForm.type = 'call';  showAddActivity.value = true; activeTab.value = 'history' }
  else if (label === 'Email')  { activityForm.type = 'email'; showAddActivity.value = true; activeTab.value = 'history' }
  else                         { openAddSubTask(); activeTab.value = 'tasks' }
}

// ─── Activity actions ──────────────────────────────────────────

function submitActivity(): void {
  if (!activityForm.content.trim()) {
    toast.error('Vui lòng nhập nội dung hoạt động')
    return
  }
  const av = card.value?.assignees[0]
  const newAct: DeployActivity = {
    id:             `act-${Date.now()}`,
    type:           activityForm.type as DeployActivity['type'],
    content:        activityForm.content.trim(),
    author:         activityForm.author.trim() || av?.name || 'Nhân viên',
    authorInitials: activityForm.author.trim()
      ? activityForm.author.trim().split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
      : av?.initials ?? 'NV',
    authorColor: av?.color ?? '#3450cc',
    createdAt:   new Date().toLocaleString('vi-VN'),
  }
  store.addActivity(deploymentId.value, newAct)
  activityForm.content = ''
  activityForm.author  = ''
  showAddActivity.value = false
  toast.success('Đã thêm hoạt động')
}

// ─── Edit card ────────────────────────────────────────────────

function openEdit(): void {
  if (!card.value) return
  editForm.customerName   = card.value.customerName
  editForm.contactName    = card.value.contactName
  editForm.columnId       = card.value.columnId
  editForm.salesPerson    = card.value.salesPerson    ?? ''
  editForm.salesLead      = card.value.salesLead      ?? ''
  editForm.deployPerson   = card.value.deployPerson   ?? ''
  editForm.deployLead     = card.value.deployLead     ?? ''
  editForm.deployDeadline = card.value.deployDeadline ?? ''
  editForm.trialStartDate = card.value.trialStartDate ?? ''
  editForm.trialEndDate   = card.value.trialEndDate   ?? ''
  editForm.notes          = card.value.notes          ?? ''
  showEditDialog.value = true
}

function submitEdit(): void {
  if (!editForm.customerName.trim()) { toast.error('Vui lòng nhập tên khách hàng'); return }
  const oldCol = card.value?.columnId
  store.updateCard(deploymentId.value, {
    customerName:   editForm.customerName.trim(),
    contactName:    editForm.contactName.trim(),
    columnId:       editForm.columnId,
    salesPerson:    editForm.salesPerson    || undefined,
    salesLead:      editForm.salesLead      || undefined,
    deployPerson:   editForm.deployPerson   || undefined,
    deployLead:     editForm.deployLead     || undefined,
    deployDeadline: editForm.deployDeadline || undefined,
    trialStartDate: editForm.trialStartDate || undefined,
    trialEndDate:   editForm.trialEndDate   || undefined,
    notes:          editForm.notes          || undefined,
  })
  if (oldCol && oldCol !== editForm.columnId) {
    store.addActivity(deploymentId.value, {
      id:             `act-${Date.now()}`,
      type:           'stage_change',
      content:        `Chuyển giai đoạn: ${store.columnName(oldCol)} → ${store.columnName(editForm.columnId)}`,
      author:         card.value?.assignees[0]?.name ?? 'Hệ thống',
      authorInitials: card.value?.assignees[0]?.initials ?? 'HT',
      authorColor:    card.value?.assignees[0]?.color ?? '#6b778c',
      createdAt:      new Date().toLocaleString('vi-VN'),
    })
  }
  showEditDialog.value = false
  toast.success('Đã lưu thay đổi')
}

// ─── Delete sub-task ──────────────────────────────────────────

function promptDeleteSubTask(id: string): void {
  deletingSubTaskId.value = id
  showDeleteSubTaskConfirm.value = true
}

function confirmDeleteSubTask(): void {
  if (!deletingSubTaskId.value) return
  store.deleteSubTask(deploymentId.value, deletingSubTaskId.value)
  showDeleteSubTaskConfirm.value = false
  deletingSubTaskId.value = null
  toast.success('Đã xóa công việc')
}

// ─── Delete ───────────────────────────────────────────────────

function confirmDelete(): void {
  const idx = store.cards.findIndex((c) => c.id === deploymentId.value)
  if (idx !== -1) store.cards.splice(idx, 1)
  showDeleteConfirm.value = false
  toast.success('Đã xóa dự án')
  void router.push({ path: '/crm-deals', query: { tab: 'deployment' } })
}
</script>

<style scoped>
.stage-chevron {
  position: relative;
}
.stage-chevron + .stage-chevron::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 25%;
  height: 50%;
  width: 1px;
  background: rgba(255,255,255,0.3);
}
</style>
