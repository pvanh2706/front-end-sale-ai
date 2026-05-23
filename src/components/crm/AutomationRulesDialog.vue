<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="flex flex-col p-0 gap-0 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-theme-xl sm:max-w-[900px] overflow-hidden"
      :style="{ height: '90vh', maxHeight: '90vh' }"
      :show-close-button="false"
    >
      <DialogTitle class="sr-only">Automation Rules</DialogTitle>
      <DialogDescription class="sr-only">Quản lý automation rules cho {{ entityTypeLabel }}</DialogDescription>

      <!-- ── HEADER ── -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div class="flex items-center gap-2.5">
          <button
            v-if="view === 'builder'"
            type="button"
            class="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="backToList"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div class="w-8 h-8 rounded-lg bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center">
            <Zap class="w-4 h-4 text-warning-500" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
              {{ view === 'list' ? 'Automation Rules' : (editingId ? 'Chỉnh sửa rule' : 'Tạo rule mới') }}
            </p>
            <p class="text-xs text-gray-400">{{ entityTypeLabel }} · {{ entityName }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="view === 'list'"
            type="button"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            @click="openBuilder()"
          >
            <Plus class="w-4 h-4" />
            Tạo rule
          </button>
          <button
            v-if="view === 'builder'"
            type="button"
            :disabled="!canSave"
            :class="[
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              canSave
                ? 'bg-brand-500 hover:bg-brand-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            ]"
            @click="saveRule"
          >
            <Zap class="w-4 h-4" />
            {{ editingId ? 'Cập nhật' : 'Lưu rule' }}
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            @click="emit('update:open', false)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- ── BODY ── -->
      <div class="flex-1 overflow-hidden flex flex-col">

        <!-- ═══════════════════════════════════ LIST VIEW ═══════════════════════════════════ -->
        <div v-if="view === 'list'" class="flex-1 overflow-y-auto p-5 space-y-3">

          <div v-if="rules.length === 0" class="text-center py-14">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-warning-50 dark:bg-warning-500/10 flex items-center justify-center mb-4">
              <Zap class="w-7 h-7 text-warning-400" />
            </div>
            <p class="font-semibold text-gray-700 dark:text-gray-300 text-sm">Chưa có automation rule</p>
            <p class="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              Tự động hóa quy trình — nhận thông báo, tạo task, gửi email khi có sự kiện xảy ra
            </p>
            <button
              type="button"
              class="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
              @click="openBuilder()"
            >
              <Plus class="w-4 h-4" />
              Tạo rule đầu tiên
            </button>
          </div>

          <div
            v-for="rule in rules"
            :key="rule.id"
            class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-brand-200 dark:hover:border-brand-800 transition-colors bg-white dark:bg-gray-900 group"
          >
            <div class="flex items-start gap-3">
              <div class="mt-1.5 shrink-0">
                <div :class="['w-2.5 h-2.5 rounded-full', rule.active ? 'bg-success-500' : 'bg-gray-300 dark:bg-gray-600']" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 dark:text-white text-sm leading-snug">{{ rule.name }}</p>
                <p v-if="rule.description" class="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{{ rule.description }}</p>
                <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-warning-50 dark:bg-warning-500/10 text-warning-700 dark:text-warning-400">
                    <Zap class="w-2.5 h-2.5" />
                    {{ getTriggerLabel(rule.trigger) }}
                  </span>
                  <span class="text-gray-300 dark:text-gray-600 text-xs">→</span>
                  <span
                    v-for="action in rule.actions.slice(0, 3)"
                    :key="action.id"
                    class="text-[11px] font-medium px-2 py-0.5 rounded-md bg-success-50 dark:bg-success-500/10 text-success-700 dark:text-success-400"
                  >
                    {{ getActionLabel(action) }}
                  </span>
                  <span v-if="rule.actions.length > 3" class="text-[11px] text-gray-400">+{{ rule.actions.length - 3 }} nữa</span>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  :class="['relative w-9 h-5 rounded-full transition-colors shrink-0', rule.active ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-600']"
                  @click="rule.active = !rule.active"
                >
                  <span
                    class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                    :class="rule.active ? 'left-[18px]' : 'left-0.5'"
                  />
                </button>
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                  @click="openBuilder(rule)"
                >
                  <Pencil class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  class="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-error-50 dark:hover:bg-error-500/10 text-gray-400 hover:text-error-500 transition-all"
                  @click="deleteRule(rule.id)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <span class="text-[11px] text-gray-400">
                Đã chạy <span class="font-semibold text-gray-600 dark:text-gray-300">{{ rule.runCount }}</span> lần
              </span>
              <span v-if="rule.lastRun" class="text-[11px] text-gray-400">Lần cuối: {{ rule.lastRun }}</span>
              <span v-if="rule.conditions.length > 0" class="text-[11px] text-gray-400 ml-auto">
                {{ rule.conditions.length }} điều kiện IF
              </span>
            </div>
          </div>
        </div>

        <!-- ═══════════════════════════════════ BUILDER VIEW (2-column Jira style) ═══════════════════════════════════ -->
        <div v-else class="flex-1 flex overflow-hidden">

          <!-- ── LEFT: Flow Timeline ── -->
          <div class="w-64 shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto bg-gray-50 dark:bg-gray-800/40">
            <!-- Rule name chip -->
            <button
              type="button"
              class="flex items-center gap-2.5 px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
              :class="selectedStepId === null ? 'bg-white dark:bg-gray-900' : ''"
              @click="selectedStepId = null"
            >
              <div class="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <Settings class="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Chi tiết rule</p>
                <p class="text-xs text-gray-700 dark:text-gray-300 truncate font-medium leading-snug">
                  {{ builder.name || 'Chưa đặt tên' }}
                </p>
              </div>
              <div v-if="selectedStepId === null" class="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
            </button>

            <!-- Flow nodes -->
            <div class="flex-1 px-4 py-4 flex flex-col">

              <!-- WHEN node -->
              <div class="relative">
                <button
                  type="button"
                  class="w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all"
                  :class="selectedStepId === 'when'
                    ? 'border-warning-400 bg-warning-50 dark:bg-warning-500/10 shadow-theme-sm'
                    : 'border-warning-200 dark:border-warning-800 bg-white dark:bg-gray-900 hover:border-warning-300 dark:hover:border-warning-700'"
                  @click="selectedStepId = 'when'"
                >
                  <div class="w-8 h-8 rounded-full bg-warning-500 flex items-center justify-center shrink-0 shadow-theme-xs">
                    <Zap class="w-4 h-4 text-white" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[10px] font-bold text-warning-700 dark:text-warning-400 uppercase tracking-widest leading-none">WHEN</p>
                    <p class="text-xs text-gray-700 dark:text-gray-300 truncate mt-0.5 leading-snug">
                      {{ builder.trigger.type ? getTriggerLabel(builder.trigger) : 'Chọn sự kiện...' }}
                    </p>
                  </div>
                  <div v-if="selectedStepId === 'when'" class="w-1.5 h-1.5 rounded-full bg-warning-500 shrink-0" />
                </button>

                <!-- connector line down -->
                <div class="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 mx-auto" />

                <!-- insert button after WHEN -->
                <div class="relative flex items-center justify-center my-0.5">
                  <div class="w-full h-px bg-gray-200 dark:bg-gray-700" />
                  <div class="absolute">
                    <div class="relative group/ins">
                      <button
                        type="button"
                        class="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all shadow-theme-xs"
                        @click="insertMenuIdx = 0; showInsertMenu = !showInsertMenu"
                      >
                        <Plus class="w-3 h-3" />
                      </button>
                      <!-- insert dropdown -->
                      <div
                        v-if="showInsertMenu && insertMenuIdx === 0"
                        class="absolute left-1/2 -translate-x-1/2 top-7 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-theme-lg py-1.5 w-48"
                      >
                        <button type="button" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-left transition-colors" @click="insertStep('if', 0); showInsertMenu = false">
                          <div class="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0"><Filter class="w-2.5 h-2.5 text-white" /></div>
                          <div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">IF — Điều kiện</p><p class="text-[10px] text-gray-400">Lọc khi nào rule chạy</p></div>
                        </button>
                        <button type="button" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-success-50 dark:hover:bg-success-500/10 text-left transition-colors" @click="insertStep('then', 0); showInsertMenu = false">
                          <div class="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center shrink-0"><CheckCircle2 class="w-2.5 h-2.5 text-white" /></div>
                          <div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">THEN — Hành động</p><p class="text-[10px] text-gray-400">Thực hiện khi rule kích hoạt</p></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 mx-auto" />
              </div>

              <!-- IF nodes (conditions) -->
              <template v-for="(cond, idx) in builder.conditions" :key="cond.id">
                <div class="relative">
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all group/node"
                    :class="selectedStepId === cond.id
                      ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10 shadow-theme-sm'
                      : 'border-brand-200 dark:border-brand-800 bg-white dark:bg-gray-900 hover:border-brand-300 dark:hover:border-brand-700'"
                    @click="selectedStepId = cond.id"
                  >
                    <div class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-theme-xs">
                      <Filter class="w-4 h-4 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none">IF</p>
                      <p class="text-xs text-gray-700 dark:text-gray-300 truncate mt-0.5 leading-snug">
                        {{ conditionTitle(cond) }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover/node:opacity-100 hover:bg-error-50 dark:hover:bg-error-500/10 text-gray-400 hover:text-error-500 transition-all shrink-0"
                      @click.stop="removeCondition(cond.id)"
                    >
                      <X class="w-3 h-3" />
                    </button>
                  </button>

                  <div class="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 mx-auto" />
                  <div class="relative flex items-center justify-center my-0.5">
                    <div class="w-full h-px bg-gray-200 dark:bg-gray-700" />
                    <div class="absolute">
                      <div class="relative">
                        <button
                          type="button"
                          class="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-all shadow-theme-xs"
                          @click="insertMenuIdx = idx + 1; showInsertMenu = !showInsertMenu"
                        >
                          <Plus class="w-3 h-3" />
                        </button>
                        <div
                          v-if="showInsertMenu && insertMenuIdx === idx + 1"
                          class="absolute left-1/2 -translate-x-1/2 top-7 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-theme-lg py-1.5 w-48"
                        >
                          <button type="button" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-left transition-colors" @click="insertStep('if', idx + 1); showInsertMenu = false">
                            <div class="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0"><Filter class="w-2.5 h-2.5 text-white" /></div>
                            <div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">IF — Điều kiện</p></div>
                          </button>
                          <button type="button" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-success-50 dark:hover:bg-success-500/10 text-left transition-colors" @click="insertStep('then', idx + 1); showInsertMenu = false">
                            <div class="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center shrink-0"><CheckCircle2 class="w-2.5 h-2.5 text-white" /></div>
                            <div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">THEN — Hành động</p></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 mx-auto" />
                </div>
              </template>

              <!-- THEN nodes (actions) -->
              <template v-for="(action, idx) in builder.actions" :key="action.id">
                <div class="relative">
                  <button
                    type="button"
                    class="w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all group/node"
                    :class="selectedStepId === action.id
                      ? 'border-success-400 bg-success-50 dark:bg-success-500/10 shadow-theme-sm'
                      : 'border-success-200 dark:border-success-800 bg-white dark:bg-gray-900 hover:border-success-300 dark:hover:border-success-700'"
                    @click="selectedStepId = action.id"
                  >
                    <div class="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shrink-0 shadow-theme-xs">
                      <CheckCircle2 class="w-4 h-4 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-[10px] font-bold text-success-700 dark:text-success-400 uppercase tracking-widest leading-none">THEN</p>
                      <p class="text-xs text-gray-700 dark:text-gray-300 truncate mt-0.5 leading-snug">
                        {{ action.type ? getActionLabel(action) : 'Chọn hành động...' }}
                      </p>
                    </div>
                    <button
                      type="button"
                      class="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover/node:opacity-100 hover:bg-error-50 dark:hover:bg-error-500/10 text-gray-400 hover:text-error-500 transition-all shrink-0"
                      @click.stop="removeAction(action.id)"
                    >
                      <X class="w-3 h-3" />
                    </button>
                  </button>

                  <template v-if="idx < builder.actions.length - 1">
                    <div class="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 mx-auto" />
                    <div class="relative flex items-center justify-center my-0.5">
                      <div class="w-full h-px bg-gray-200 dark:bg-gray-700" />
                      <div class="absolute">
                        <button
                          type="button"
                          class="w-6 h-6 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:border-success-400 hover:text-success-500 hover:bg-success-50 dark:hover:bg-success-500/10 transition-all shadow-theme-xs"
                          @click="insertStep('then', builder.conditions.length + idx + 1)"
                        >
                          <Plus class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div class="w-0.5 h-3 bg-gray-200 dark:bg-gray-700 mx-auto" />
                  </template>
                </div>
              </template>

              <!-- Add component button -->
              <div class="mt-4">
                <div class="relative">
                  <button
                    type="button"
                    class="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:border-brand-300 dark:hover:border-brand-700 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-sm transition-all"
                    @click="showAddBottom = !showAddBottom"
                  >
                    <Plus class="w-4 h-4" />
                    Thêm bước
                  </button>
                  <div
                    v-if="showAddBottom"
                    class="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-theme-lg py-1.5"
                  >
                    <button type="button" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-left transition-colors" @click="addConditionStep(); showAddBottom = false">
                      <div class="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0"><Filter class="w-2.5 h-2.5 text-white" /></div>
                      <div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">IF — Thêm điều kiện</p></div>
                    </button>
                    <button type="button" class="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-success-50 dark:hover:bg-success-500/10 text-left transition-colors" @click="addActionStep(); showAddBottom = false">
                      <div class="w-5 h-5 rounded-full bg-success-500 flex items-center justify-center shrink-0"><CheckCircle2 class="w-2.5 h-2.5 text-white" /></div>
                      <div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">THEN — Thêm hành động</p></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── RIGHT: Config Panel ── -->
          <div class="flex-1 overflow-y-auto p-6" @click.self="closeMenus">

            <!-- Rule Details (no step selected) -->
            <div v-if="selectedStepId === null">
              <div class="mb-5">
                <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">Chi tiết rule</h3>
                <p class="text-xs text-gray-400 mt-0.5">Đặt tên và mô tả cho automation rule này</p>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Tên rule <span class="text-error-500 normal-case">*</span>
                  </label>
                  <input
                    v-model="builder.name"
                    type="text"
                    class="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition"
                    placeholder="VD: Thông báo kế toán khi có issue nạp tiền"
                  />
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mô tả</label>
                  <textarea
                    v-model="builder.description"
                    rows="3"
                    class="mt-1.5 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-500/20 transition resize-none"
                    placeholder="Mô tả ngắn gọn về mục đích của rule này..."
                  />
                </div>
                <div class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    :class="['relative w-10 h-5.5 rounded-full transition-colors shrink-0', builder.active ? 'bg-success-500' : 'bg-gray-200 dark:bg-gray-600']"
                    style="height:22px;width:40px;"
                    @click="builder.active = !builder.active"
                  >
                    <span
                      class="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all"
                      :class="builder.active ? 'left-[20px]' : 'left-0.5'"
                    />
                  </button>
                  <div>
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ builder.active ? 'Rule đang hoạt động' : 'Rule đang tắt' }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">Rule sẽ {{ builder.active ? '' : 'không' }} tự động chạy khi điều kiện khớp</p>
                  </div>
                </div>

                <!-- Tip -->
                <div class="flex items-start gap-2.5 p-3.5 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800">
                  <div class="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="text-white text-[10px] font-bold">i</span>
                  </div>
                  <p class="text-xs text-brand-700 dark:text-brand-400 leading-relaxed">
                    Chọn một bước trong luồng bên trái để cấu hình chi tiết. Bắt đầu với <strong>WHEN</strong> để chọn sự kiện kích hoạt.
                  </p>
                </div>
              </div>
            </div>

            <!-- WHEN config -->
            <div v-else-if="selectedStepId === 'when'">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-9 h-9 rounded-full bg-warning-500 flex items-center justify-center shrink-0 shadow-theme-sm">
                  <Zap class="w-4.5 h-4.5 text-white" style="width:18px;height:18px;" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">WHEN — Sự kiện kích hoạt</h3>
                  <p class="text-xs text-gray-400 mt-0.5">Rule sẽ chạy khi sự kiện này xảy ra</p>
                </div>
              </div>

              <!-- ── Trigger Picker (visual card grid) ── -->
              <div v-if="showTriggerPicker" class="space-y-3">
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chọn sự kiện kích hoạt</p>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="opt in TRIGGER_OPTIONS"
                    :key="opt.type"
                    type="button"
                    class="flex flex-col gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all hover:shadow-theme-sm"
                    :class="builder.trigger.type === opt.type
                      ? `${opt.border} ${opt.bg} shadow-theme-sm`
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'"
                    @click="selectTrigger(opt.type)"
                  >
                    <div class="flex items-center justify-between w-full">
                      <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', opt.color]">
                        <component :is="opt.icon" class="w-4.5 h-4.5 text-white" style="width:18px;height:18px;" />
                      </div>
                      <div
                        v-if="builder.trigger.type === opt.type"
                        class="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0"
                      >
                        <CheckCircle2 class="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-snug">{{ opt.label }}</p>
                      <p class="text-[10px] text-gray-400 leading-snug mt-0.5">{{ opt.desc }}</p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- ── Trigger selected → show detail config ── -->
              <div v-else class="space-y-4">
                <!-- Selected trigger chip -->
                <div class="flex items-center gap-3 p-3.5 rounded-xl border-2 border-warning-300 dark:border-warning-700 bg-warning-50 dark:bg-warning-500/10">
                  <div :class="['w-8 h-8 rounded-xl flex items-center justify-center shrink-0', TRIGGER_OPTIONS.find(o => o.type === builder.trigger.type)?.color ?? 'bg-gray-400']">
                    <component
                      :is="TRIGGER_OPTIONS.find(o => o.type === builder.trigger.type)?.icon ?? Zap"
                      class="w-4 h-4 text-white"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold text-gray-700 dark:text-gray-300 leading-none">
                      {{ TRIGGER_OPTIONS.find(o => o.type === builder.trigger.type)?.label ?? '' }}
                    </p>
                    <p class="text-[10px] text-gray-400 mt-0.5 leading-snug line-clamp-1">
                      {{ TRIGGER_OPTIONS.find(o => o.type === builder.trigger.type)?.desc ?? '' }}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="shrink-0 text-[10px] font-semibold text-brand-500 hover:text-brand-600 px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
                    @click="showTriggerPicker = true"
                  >
                    Thay đổi
                  </button>
                </div>

                <!-- field_changed detail -->
                <div v-if="builder.trigger.type === 'field_changed'" class="rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-800 p-4 space-y-3">
                  <p class="text-[10px] font-bold text-warning-700 dark:text-warning-400 uppercase tracking-widest">Chi tiết sự kiện</p>
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Field thay đổi</label>
                    <Select
                      :model-value="builder.trigger.field"
                      @update:model-value="val => { builder.trigger.field = String(val); builder.trigger.toValue = undefined }"
                    >
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Chọn field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="f in fieldOptions" :key="f.value" :value="f.value">{{ f.label }}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div v-if="builder.trigger.field">
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Thành giá trị</label>
                    <Select
                      v-if="fieldValueOptions.length > 0"
                      :model-value="builder.trigger.toValue"
                      @update:model-value="val => builder.trigger.toValue = String(val)"
                    >
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Chọn giá trị (tùy chọn)..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="v in fieldValueOptions" :key="v" :value="v">{{ v }}</SelectItem>
                      </SelectContent>
                    </Select>
                    <input
                      v-else
                      :value="builder.trigger.toValue || ''"
                      @input="e => builder.trigger.toValue = (e.target as HTMLInputElement).value"
                      class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                      placeholder="Nhập giá trị..."
                    />
                  </div>
                </div>

                <!-- no_activity detail -->
                <div v-else-if="builder.trigger.type === 'no_activity'" class="rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-800 p-4">
                  <p class="text-[10px] font-bold text-warning-700 dark:text-warning-400 uppercase tracking-widest mb-3">Khoảng thời gian</p>
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500 shrink-0">Không có hoạt động trong</span>
                    <input
                      :value="builder.trigger.duration || ''"
                      @input="e => builder.trigger.duration = Number((e.target as HTMLInputElement).value)"
                      type="number" min="1"
                      class="w-20 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-center text-gray-900 dark:text-white outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                      placeholder="3"
                    />
                    <Select
                      :model-value="builder.trigger.durationUnit || 'days'"
                      @update:model-value="val => builder.trigger.durationUnit = val as 'hours' | 'days' | 'weeks'"
                    >
                      <SelectTrigger class="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">giờ</SelectItem>
                        <SelectItem value="days">ngày</SelectItem>
                        <SelectItem value="weeks">tuần</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <!-- assigned_to_user detail -->
                <div v-else-if="builder.trigger.type === 'assigned_to_user'" class="rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-100 dark:border-warning-800 p-4">
                  <p class="text-[10px] font-bold text-warning-700 dark:text-warning-400 uppercase tracking-widest mb-3">Assign cho</p>
                  <Select
                    :model-value="builder.trigger.field"
                    @update:model-value="val => builder.trigger.field = String(val)"
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Bất kỳ ai / chọn user cụ thể..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_any">Bất kỳ ai</SelectItem>
                      <SelectItem v-for="u in SAMPLE_USERS" :key="u.id" :value="u.id">{{ u.name }} · {{ u.role }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <!-- IF config (condition) -->
            <div v-else-if="selectedCondition">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center shrink-0 shadow-theme-sm">
                  <Filter class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">IF — Điều kiện lọc</h3>
                  <p class="text-xs text-gray-400 mt-0.5">Chỉ chạy khi điều kiện này đúng</p>
                </div>
              </div>

              <div class="space-y-4 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-800 p-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Field</label>
                  <Select :model-value="selectedCondition.field" @update:model-value="val => selectedCondition!.field = String(val)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn field..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="f in fieldOptions" :key="f.value" :value="f.value">{{ f.label }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Điều kiện</label>
                  <Select :model-value="selectedCondition.operator" @update:model-value="val => selectedCondition!.operator = val as ConditionOperator">
                    <SelectTrigger class="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">bằng</SelectItem>
                      <SelectItem value="not_equals">khác</SelectItem>
                      <SelectItem value="contains">chứa</SelectItem>
                      <SelectItem value="not_contains">không chứa</SelectItem>
                      <SelectItem value="is_empty">trống</SelectItem>
                      <SelectItem value="is_not_empty">không trống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div v-if="!['is_empty', 'is_not_empty'].includes(selectedCondition.operator)">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Giá trị</label>
                  <input
                    :value="selectedCondition.value"
                    @input="e => selectedCondition!.value = (e.target as HTMLInputElement).value"
                    class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                    placeholder="Nhập giá trị..."
                  />
                </div>
              </div>

              <button
                type="button"
                class="mt-4 flex items-center gap-1.5 text-xs text-error-500 hover:text-error-600 transition-colors"
                @click="removeCondition(selectedCondition.id); selectedStepId = null"
              >
                <Trash2 class="w-3.5 h-3.5" />
                Xóa điều kiện này
              </button>
            </div>

            <!-- THEN config (action) -->
            <div v-else-if="selectedAction">
              <div class="flex items-center gap-3 mb-5">
                <div class="w-9 h-9 rounded-full bg-success-500 flex items-center justify-center shrink-0 shadow-theme-sm">
                  <CheckCircle2 class="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">THEN — Hành động</h3>
                  <p class="text-xs text-gray-400 mt-0.5">Thực hiện khi rule kích hoạt</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Loại hành động</label>
                  <Select
                    :model-value="selectedAction.type ?? undefined"
                    @update:model-value="val => updateActionType(selectedAction!, val as ActionType)"
                  >
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn hành động..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="notify_user">
                        <div class="flex items-center gap-2"><Bell class="w-4 h-4 text-gray-400" /><span>Thông báo cho user</span></div>
                      </SelectItem>
                      <SelectItem value="create_task">
                        <div class="flex items-center gap-2"><SquareCheckBig class="w-4 h-4 text-gray-400" /><span>Tạo task mới</span></div>
                      </SelectItem>
                      <SelectItem value="send_email">
                        <div class="flex items-center gap-2"><Mail class="w-4 h-4 text-gray-400" /><span>Gửi email</span></div>
                      </SelectItem>
                      <SelectItem value="change_assignee">
                        <div class="flex items-center gap-2"><UserCheck class="w-4 h-4 text-gray-400" /><span>Thay đổi người phụ trách</span></div>
                      </SelectItem>
                      <SelectItem value="change_stage">
                        <div class="flex items-center gap-2"><GitBranch class="w-4 h-4 text-gray-400" /><span>Thay đổi giai đoạn</span></div>
                      </SelectItem>
                      <SelectItem value="add_tag">
                        <div class="flex items-center gap-2"><Tag class="w-4 h-4 text-gray-400" /><span>Thêm tag/nhãn</span></div>
                      </SelectItem>
                      <SelectItem value="add_comment">
                        <div class="flex items-center gap-2"><MessageSquare class="w-4 h-4 text-gray-400" /><span>Thêm bình luận</span></div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- notify_user -->
                <div v-if="selectedAction.type === 'notify_user'" class="space-y-4 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Thông báo đến</p>
                    <div class="grid grid-cols-2 gap-2">
                      <button
                        v-for="user in SAMPLE_USERS"
                        :key="user.id"
                        type="button"
                        @click="toggleUserInAction(selectedAction!, user.id)"
                        :class="[
                          'flex items-center gap-2.5 p-2.5 rounded-xl border-2 text-left transition-colors',
                          selectedAction.userIds?.includes(user.id)
                            ? 'border-brand-400 bg-white dark:bg-gray-900 dark:border-brand-600'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-brand-200'
                        ]"
                      >
                        <div class="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-400 shrink-0">
                          {{ user.initials }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-medium text-gray-800 dark:text-gray-200 truncate leading-tight">{{ user.name }}</p>
                          <p class="text-[10px] text-gray-500 truncate">{{ user.role }}</p>
                        </div>
                        <CheckCircle2 v-if="selectedAction.userIds?.includes(user.id)" class="w-4 h-4 text-brand-500 shrink-0" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Nội dung thông báo (tùy chọn)</p>
                    <textarea
                      :value="selectedAction.message || ''"
                      @input="e => selectedAction!.message = (e.target as HTMLTextAreaElement).value"
                      rows="3"
                      class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition resize-none"
                      placeholder="VD: Vui lòng kiểm tra và tiến hành nạp tiền cho khách hàng..."
                    />
                  </div>
                </div>

                <!-- create_task -->
                <div v-else-if="selectedAction.type === 'create_task'" class="space-y-3 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tiêu đề task *</label>
                    <input
                      :value="selectedAction.taskTitle || ''"
                      @input="e => selectedAction!.taskTitle = (e.target as HTMLInputElement).value"
                      class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                      placeholder="VD: Follow-up khách hàng mới..."
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Người thực hiện</label>
                      <Select :model-value="selectedAction.taskAssigneeId" @update:model-value="val => selectedAction!.taskAssigneeId = String(val)">
                        <SelectTrigger class="text-sm">
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem v-for="u in SAMPLE_USERS" :key="u.id" :value="u.id">{{ u.name }}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Hạn (ngày)</label>
                      <input
                        :value="selectedAction.taskDueDays || ''"
                        @input="e => selectedAction!.taskDueDays = Number((e.target as HTMLInputElement).value)"
                        type="number" min="1"
                        class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>

                <!-- send_email -->
                <div v-else-if="selectedAction.type === 'send_email'" class="space-y-3 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Gửi đến (email)</label>
                    <input
                      :value="selectedAction.emailTo || ''"
                      @input="e => selectedAction!.emailTo = (e.target as HTMLInputElement).value"
                      type="email"
                      class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                      placeholder="example@company.com"
                    />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tiêu đề email</label>
                    <input
                      :value="selectedAction.emailSubject || ''"
                      @input="e => selectedAction!.emailSubject = (e.target as HTMLInputElement).value"
                      class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                      placeholder="VD: [CRM] Thông báo cần xử lý"
                    />
                  </div>
                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nội dung</label>
                    <textarea
                      :value="selectedAction.emailBody || ''"
                      @input="e => selectedAction!.emailBody = (e.target as HTMLTextAreaElement).value"
                      rows="4"
                      class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition resize-none"
                      placeholder="Nội dung email..."
                    />
                  </div>
                </div>

                <!-- change_assignee -->
                <div v-else-if="selectedAction.type === 'change_assignee'" class="rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Chuyển cho</label>
                  <Select :model-value="selectedAction.assigneeId" @update:model-value="val => selectedAction!.assigneeId = String(val)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn người phụ trách..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="u in SAMPLE_USERS" :key="u.id" :value="u.id">{{ u.name }} · {{ u.role }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- change_stage -->
                <div v-else-if="selectedAction.type === 'change_stage'" class="rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Chuyển sang giai đoạn</label>
                  <Select :model-value="selectedAction.stageId" @update:model-value="val => selectedAction!.stageId = String(val)">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Chọn giai đoạn..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="s in stageOptions" :key="s" :value="s">{{ s }}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- add_tag -->
                <div v-else-if="selectedAction.type === 'add_tag'" class="rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tag / Nhãn</label>
                  <input
                    :value="selectedAction.tag || ''"
                    @input="e => selectedAction!.tag = (e.target as HTMLInputElement).value"
                    class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition"
                    placeholder="VD: vip, urgent, follow-up..."
                  />
                </div>

                <!-- add_comment -->
                <div v-else-if="selectedAction.type === 'add_comment'" class="rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-800 p-4">
                  <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Nội dung bình luận</label>
                  <textarea
                    :value="selectedAction.comment || ''"
                    @input="e => selectedAction!.comment = (e.target as HTMLTextAreaElement).value"
                    rows="4"
                    class="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100 transition resize-none"
                    placeholder="VD: Rule đã tự động chạy — vui lòng kiểm tra và xử lý..."
                  />
                </div>
              </div>

              <button
                type="button"
                class="mt-4 flex items-center gap-1.5 text-xs text-error-500 hover:text-error-600 transition-colors"
                @click="removeAction(selectedAction.id); selectedStepId = null"
              >
                <Trash2 class="w-3.5 h-3.5" />
                Xóa hành động này
              </button>
            </div>

          </div>
          <!-- end right panel -->
        </div>
        <!-- end builder -->

      </div>
      <!-- end body -->

    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Activity, ArrowLeft, Bell, CheckCircle2, Clock, Filter, GitBranch,
  Mail, MessageSquare, Pencil, Plus, RefreshCw, Settings, SquareCheckBig, Tag,
  Trash2, UserCheck, X, XCircle, Zap,
} from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type {
  EntityType, TriggerType, TriggerConfig, ConditionOperator,
  Condition, ActionType, ActionConfig, AutomationRule,
} from '@/types/automationRule'

interface Props {
  open: boolean
  entityType: EntityType
  entityName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const SAMPLE_USERS = [
  { id: 'phuongdn', name: 'Đỗ Nguyên Phương', role: 'Kế toán',       initials: 'DP' },
  { id: 'admin',    name: 'Nguyễn Admin',      role: 'Quản trị viên', initials: 'AD' },
  { id: 'sales1',   name: 'Trần Văn Minh',     role: 'Sales',         initials: 'TM' },
  { id: 'cs1',      name: 'Lê Thị Lan',        role: 'CSKH',          initials: 'LL' },
] as const

// ── View state ──
const view = ref<'list' | 'builder'>('list')
const editingId = ref<string | null>(null)
const rules = ref<AutomationRule[]>([])

// ── Builder reactive state ──
const builder = reactive<{
  name: string
  description: string
  active: boolean
  trigger: TriggerConfig
  conditions: Condition[]
  actions: ActionConfig[]
}>({
  name: '',
  description: '',
  active: true,
  trigger: { type: null },
  conditions: [],
  actions: [],
})

// ── Builder UI state ──
const selectedStepId = ref<string | null>('when')
const showInsertMenu = ref(false)
const insertMenuIdx = ref<number | null>(null)
const showAddBottom = ref(false)
const showTriggerPicker = ref(true)

// ── Trigger definitions for visual picker ──
const TRIGGER_OPTIONS = computed(() => {
  const base = [
    {
      type: 'record_created' as TriggerType,
      label: 'Bản ghi được tạo mới',
      desc: 'Kích hoạt mỗi khi một bản ghi mới được thêm vào hệ thống',
      icon: Plus,
      color: 'bg-success-500',
      bg: 'bg-success-50 dark:bg-success-500/10',
      border: 'border-success-200 dark:border-success-800',
    },
    {
      type: 'field_changed' as TriggerType,
      label: 'Field thay đổi giá trị',
      desc: 'Kích hoạt khi giá trị của một trường dữ liệu bị thay đổi',
      icon: RefreshCw,
      color: 'bg-brand-500',
      bg: 'bg-brand-50 dark:bg-brand-500/10',
      border: 'border-brand-200 dark:border-brand-800',
    },
    {
      type: 'status_changed' as TriggerType,
      label: 'Trạng thái thay đổi',
      desc: 'Kích hoạt mỗi khi trạng thái của bản ghi được cập nhật',
      icon: Activity,
      color: 'bg-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-500/10',
      border: 'border-purple-200 dark:border-purple-800',
    },
    {
      type: 'assigned_to_user' as TriggerType,
      label: 'Được assign cho user',
      desc: 'Kích hoạt khi bản ghi được giao cho một người dùng cụ thể',
      icon: UserCheck,
      color: 'bg-warning-500',
      bg: 'bg-warning-50 dark:bg-warning-500/10',
      border: 'border-warning-200 dark:border-warning-800',
    },
    {
      type: 'activity_added' as TriggerType,
      label: 'Hoạt động được ghi nhận',
      desc: 'Kích hoạt khi ghi nhận cuộc gọi, email, hay ghi chú mới',
      icon: SquareCheckBig,
      color: 'bg-teal-500',
      bg: 'bg-teal-50 dark:bg-teal-500/10',
      border: 'border-teal-200 dark:border-teal-800',
    },
    {
      type: 'no_activity' as TriggerType,
      label: 'Không có hoạt động',
      desc: 'Kích hoạt khi không có hoạt động trong một khoảng thời gian nhất định',
      icon: Clock,
      color: 'bg-error-500',
      bg: 'bg-error-50 dark:bg-error-500/10',
      border: 'border-error-200 dark:border-error-800',
    },
  ]
  if (props.entityType === 'deal') {
    base.push(
      {
        type: 'deal_won' as TriggerType,
        label: 'Deal đã thắng',
        desc: 'Kích hoạt khi deal được đánh dấu là thắng / chốt thành công',
        icon: CheckCircle2,
        color: 'bg-success-500',
        bg: 'bg-success-50 dark:bg-success-500/10',
        border: 'border-success-200 dark:border-success-800',
      },
      {
        type: 'deal_lost' as TriggerType,
        label: 'Deal đã thua',
        desc: 'Kích hoạt khi deal bị đánh dấu thua hoặc bị hủy',
        icon: XCircle,
        color: 'bg-error-500',
        bg: 'bg-error-50 dark:bg-error-500/10',
        border: 'border-error-200 dark:border-error-800',
      },
    )
  }
  return base
})

// ── Computed ──
const entityTypeLabel = computed(() => {
  if (props.entityType === 'deal') return 'Deal'
  if (props.entityType === 'lead') return 'Lead'
  return 'Triển khai'
})

const selectedCondition = computed(() =>
  builder.conditions.find(c => c.id === selectedStepId.value) ?? null
)

const selectedAction = computed(() =>
  builder.actions.find(a => a.id === selectedStepId.value) ?? null
)

const fieldOptions = computed(() => {
  const base = [
    { value: 'assignee', label: 'Người phụ trách' },
    { value: 'priority', label: 'Độ ưu tiên' },
  ]
  if (props.entityType === 'deal') {
    return [
      { value: 'stage',     label: 'Giai đoạn' },
      { value: 'deal_type', label: 'Loại deal' },
      { value: 'amount',    label: 'Giá trị' },
      { value: 'source',    label: 'Nguồn' },
      ...base,
    ]
  }
  if (props.entityType === 'lead') {
    return [
      { value: 'status', label: 'Trạng thái' },
      { value: 'source', label: 'Nguồn' },
      { value: 'score',  label: 'Score' },
      ...base,
    ]
  }
  return [
    { value: 'issue_type', label: 'Loại issue' },
    { value: 'stage',      label: 'Giai đoạn' },
    ...base,
  ]
})

const fieldValueOptions = computed((): string[] => {
  const f = builder.trigger.field
  if (!f) return []
  if (f === 'stage') {
    if (props.entityType === 'deal')       return ['Tiếp cận', 'Báo giá', 'Đàm phán', 'Chốt hợp đồng', 'Đã ký']
    if (props.entityType === 'deployment') return ['Backlog', 'To Do', 'In Progress', 'Review', 'Done']
  }
  if (f === 'issue_type') {
    return [
      'HD-Thiết lập phí tư vấn quản lý kênh OTA',
      'HD-Hỗ trợ kỹ thuật',
      'HD-Đào tạo nhân viên',
      'BUG-Lỗi hệ thống',
      'TASK-Công việc thường ngày',
    ]
  }
  if (f === 'priority') return ['Thấp', 'Trung bình', 'Cao', 'Khẩn cấp']
  if (f === 'status')   return ['Mới', 'Đang xử lý', 'Qualified', 'Không tiềm năng']
  if (f === 'source')   return ['Website', 'Facebook', 'Zalo', 'Giới thiệu', 'Khác']
  return []
})

const stageOptions = computed((): string[] => {
  if (props.entityType === 'deal')       return ['Tiếp cận', 'Báo giá', 'Đàm phán', 'Chốt hợp đồng', 'Đã ký']
  if (props.entityType === 'deployment') return ['Backlog', 'To Do', 'In Progress', 'Review', 'Done']
  return ['Mới', 'Đang xử lý', 'Qualified', 'Không tiềm năng']
})

const canSave = computed(() =>
  builder.name.trim().length > 0 &&
  builder.trigger.type !== null &&
  builder.actions.length > 0 &&
  builder.actions.every(a => a.type !== null),
)

// ── Methods ──
function closeMenus() {
  showInsertMenu.value = false
  showAddBottom.value = false
}

function conditionTitle(cond: Condition): string {
  const fieldLabel = fieldOptions.value.find(f => f.value === cond.field)?.label ?? cond.field
  const opMap: Record<string, string> = {
    equals: '=', not_equals: '≠', contains: 'chứa', not_contains: 'không chứa',
    is_empty: 'trống', is_not_empty: 'không trống',
  }
  if (['is_empty', 'is_not_empty'].includes(cond.operator)) return `${fieldLabel} ${opMap[cond.operator]}`
  return `${fieldLabel} ${opMap[cond.operator] ?? cond.operator} "${cond.value || '...'}"`
}

function resetBuilder() {
  builder.name = ''
  builder.description = ''
  builder.active = true
  builder.trigger = { type: null }
  builder.conditions = []
  builder.actions = []
  editingId.value = null
  selectedStepId.value = 'when'
  showInsertMenu.value = false
  showAddBottom.value = false
  showTriggerPicker.value = true
}

function openBuilder(rule?: AutomationRule) {
  if (rule) {
    editingId.value = rule.id
    builder.name = rule.name
    builder.description = rule.description
    builder.active = rule.active
    builder.trigger = { ...rule.trigger }
    builder.conditions = rule.conditions.map(c => ({ ...c }))
    builder.actions = rule.actions.map(a => ({ ...a, userIds: a.userIds ? [...a.userIds] : [] }))
    selectedStepId.value = null
    showTriggerPicker.value = false
  } else {
    resetBuilder()
  }
  view.value = 'builder'
}

function selectTrigger(type: TriggerType) {
  builder.trigger.type = type
  builder.trigger.field = undefined
  builder.trigger.toValue = undefined
  builder.trigger.duration = undefined
  showTriggerPicker.value = false
}

function backToList() {
  resetBuilder()
  view.value = 'list'
}

function addConditionStep() {
  const id = `c-${Date.now()}`
  builder.conditions.push({
    id,
    field: fieldOptions.value[0]?.value ?? '',
    operator: 'equals',
    value: '',
  })
  selectedStepId.value = id
}

function addActionStep() {
  const id = `a-${Date.now()}`
  builder.actions.push({ id, type: null, userIds: [] })
  selectedStepId.value = id
}

function insertStep(type: 'if' | 'then', _afterIdx: number) {
  if (type === 'if') addConditionStep()
  else addActionStep()
}

function addCondition() { addConditionStep() }

function removeCondition(id: string) {
  const idx = builder.conditions.findIndex(c => c.id === id)
  if (idx !== -1) builder.conditions.splice(idx, 1)
}

function addAction() { addActionStep() }

function removeAction(id: string) {
  const idx = builder.actions.findIndex(a => a.id === id)
  if (idx !== -1) builder.actions.splice(idx, 1)
}

function updateActionType(action: ActionConfig, newType: ActionType) {
  const idx = builder.actions.findIndex(a => a.id === action.id)
  if (idx !== -1) {
    builder.actions[idx] = { id: action.id, type: newType, userIds: [] }
  }
}

function toggleUserInAction(action: ActionConfig, userId: string) {
  if (!action.userIds) action.userIds = []
  const idx = action.userIds.indexOf(userId)
  if (idx === -1) action.userIds.push(userId)
  else action.userIds.splice(idx, 1)
}

function saveRule() {
  if (!canSave.value) return
  const now = new Date().toLocaleDateString('vi-VN')
  if (editingId.value) {
    const idx = rules.value.findIndex(r => r.id === editingId.value)
    if (idx !== -1) {
      rules.value[idx] = {
        ...rules.value[idx],
        name: builder.name,
        description: builder.description,
        active: builder.active,
        trigger: { ...builder.trigger },
        conditions: builder.conditions.map(c => ({ ...c })),
        actions: builder.actions.map(a => ({ ...a, userIds: a.userIds ? [...a.userIds] : [] })),
      }
      toast.success('Đã cập nhật automation rule')
    }
  } else {
    rules.value.unshift({
      id: `rule-${Date.now()}`,
      name: builder.name,
      description: builder.description,
      entityType: props.entityType,
      trigger: { ...builder.trigger },
      conditions: builder.conditions.map(c => ({ ...c })),
      actions: builder.actions.map(a => ({ ...a, userIds: a.userIds ? [...a.userIds] : [] })),
      active: builder.active,
      createdAt: now,
      runCount: 0,
    })
    toast.success('Đã tạo automation rule')
  }
  backToList()
}

function deleteRule(id: string) {
  rules.value = rules.value.filter(r => r.id !== id)
  toast.success('Đã xóa rule')
}

function getTriggerLabel(trigger: TriggerConfig): string {
  switch (trigger.type) {
    case 'field_changed': {
      const label = fieldOptions.value.find(f => f.value === trigger.field)?.label ?? trigger.field ?? 'field'
      return trigger.toValue ? `${label} → "${trigger.toValue}"` : `${label} thay đổi`
    }
    case 'record_created':   return 'Tạo mới bản ghi'
    case 'status_changed':   return 'Trạng thái thay đổi'
    case 'assigned_to_user': return 'Được assign'
    case 'activity_added':   return 'Hoạt động mới'
    case 'no_activity': {
      const unit = trigger.durationUnit === 'hours' ? 'h' : trigger.durationUnit === 'weeks' ? ' tuần' : ' ngày'
      return `Không HĐ ${trigger.duration ?? ''}${unit}`
    }
    case 'deal_won':  return 'Deal thắng'
    case 'deal_lost': return 'Deal thua'
    default:          return 'Không xác định'
  }
}

function getActionLabel(action: ActionConfig): string {
  switch (action.type) {
    case 'notify_user': {
      const names = (action.userIds ?? []).map(id => SAMPLE_USERS.find(u => u.id === id)?.name ?? id)
      const display = names.slice(0, 2).join(', ')
      return `Thông báo: ${display || '...'}${names.length > 2 ? ` +${names.length - 2}` : ''}`
    }
    case 'create_task':     return `Task: ${action.taskTitle ?? '...'}`
    case 'send_email':      return `Email → ${action.emailTo ?? '...'}`
    case 'change_assignee': return `Chuyển: ${SAMPLE_USERS.find(u => u.id === action.assigneeId)?.name ?? '...'}`
    case 'change_stage':    return `Giai đoạn → ${action.stageId ?? '...'}`
    case 'add_tag':         return `Tag: ${action.tag ?? '...'}`
    case 'add_comment':     return 'Thêm bình luận'
    default:                return 'Hành động'
  }
}

watch(() => props.open, (v) => {
  if (!v) setTimeout(() => { view.value = 'list'; resetBuilder() }, 300)
})
</script>
