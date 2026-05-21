<template>
  <AdminLayout>
    <div class="-m-4 md:-m-6 flex items-start gap-0 min-h-[calc(100vh-64px)]">

      <!-- ===== LEFT SIDEBAR (30%) ===== -->
      <aside class="hidden lg:flex w-[30%] min-w-[280px] max-w-[360px] flex-col gap-4 p-5 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">

        <!-- Back to Kanban -->
        <button
          type="button"
          class="flex items-center gap-2 self-start rounded-lg px-3 py-1.5 text-theme-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          @click="router.push('/crm-deals?tab=lead')"
        >
          <ArrowLeft class="h-4 w-4" />
          Quay lại Kanban
        </button>

        <!-- Lead Summary Card -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs p-5">
          <!-- Avatar + title -->
          <div class="flex items-start gap-3 mb-5">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
              :style="{ backgroundColor: lead.avatarColor }"
            >
              {{ lead.avatarInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white leading-tight" :title="lead.title">
                {{ lead.title }}
              </h2>
              <p class="text-theme-xs text-gray-400 mt-0.5">Lead ID: #{{ lead.id.slice(-6).toUpperCase() }}</p>
            </div>
          </div>

          <!-- Stage progress -->
          <div class="space-y-2 mb-5">
            <div class="flex justify-between text-theme-xs font-medium text-gray-400 uppercase tracking-wider">
              <span>{{ STAGE_LABEL[lead.stage] }}</span>
              <span>{{ stageProgress }}%</span>
            </div>
            <div class="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: `${stageProgress}%`, background: STAGE_STYLE[lead.stage].border }"
              />
            </div>
            <div class="flex gap-1">
              <div
                v-for="(s, idx) in STAGE_ORDER"
                :key="s"
                class="h-1 flex-1 rounded-full transition-all"
                :style="{
                  background: idx < currentStageIndex
                    ? STAGE_STYLE[lead.stage].border
                    : idx === currentStageIndex
                      ? STAGE_STYLE[lead.stage].border + '88'
                      : undefined,
                }"
                :class="idx > currentStageIndex ? 'bg-gray-200 dark:bg-gray-700' : ''"
              />
            </div>
          </div>

          <!-- Metric tiles -->
          <div class="grid grid-cols-3 gap-2 mb-5">
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <p class="text-theme-xs text-gray-400 mb-1">Nguồn</p>
              <p class="text-theme-xs font-bold text-gray-900 dark:text-white capitalize leading-tight">{{ lead.source ?? '—' }}</p>
            </div>
            <div
              class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center border-t-2"
              :style="{ borderTopColor: STAGE_STYLE[lead.stage].border }"
            >
              <p class="text-theme-xs text-gray-400 mb-1">Giai đoạn</p>
              <p class="text-theme-xs font-bold leading-tight" :style="{ color: STAGE_STYLE[lead.stage].text }">
                {{ STAGE_LABEL[lead.stage] }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <p class="text-theme-xs text-gray-400 mb-1">Ngày tạo</p>
              <p class="text-theme-xs font-bold text-gray-900 dark:text-white leading-tight">{{ lead.date }}</p>
            </div>
          </div>

          <!-- Key-value list -->
          <div class="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div v-if="lead.companyName" class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500 shrink-0">Công ty</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white text-right truncate">{{ lead.companyName }}</span>
            </div>
            <div v-if="lead.phone" class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500 shrink-0">Điện thoại</span>
              <a :href="`tel:${lead.phone}`" class="text-theme-sm font-medium text-brand-500 hover:underline">{{ lead.phone }}</a>
            </div>
            <div v-if="lead.email" class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500 shrink-0">Email</span>
              <a :href="`mailto:${lead.email}`" class="text-theme-sm font-medium text-brand-500 hover:underline truncate">{{ lead.email }}</a>
            </div>
            <div v-if="lead.assigneeName" class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500 shrink-0">Phụ trách</span>
              <div class="flex items-center gap-1.5">
                <div
                  class="w-5 h-5 rounded-full text-[9px] flex items-center justify-center text-white font-bold shrink-0"
                  :style="{ backgroundColor: lead.assigneeColor ?? '#6B7280' }"
                >
                  {{ lead.avatarInitials }}
                </div>
                <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ lead.assigneeName }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500 shrink-0">Team Lead quản lý</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ lead.teamLeadName ?? '—' }}</span>
            </div>
            <div class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500">Loại</span>
              <span
                class="rounded-full px-2 py-0.5 text-theme-xs font-semibold"
                :class="lead.isRepeat
                  ? 'bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'"
              >
                {{ lead.isRepeat ? 'Repeat' : 'New' }}
              </span>
            </div>
            <div v-if="lead.isViewed" class="flex justify-between items-center gap-2">
              <span class="text-theme-sm text-gray-500">Trạng thái</span>
              <span class="rounded-full border border-success-200 bg-success-50 px-2 py-0.5 text-theme-xs font-semibold uppercase text-success-600 dark:border-success-500/30 dark:bg-success-500/10 dark:text-success-400">
                Viewed
              </span>
            </div>
          </div>
        </div>

        <!-- AI Insight -->
        <div class="rounded-xl border border-brand-200 dark:border-brand-500/30 bg-gradient-to-br from-brand-50 to-success-50/50 dark:from-brand-500/10 dark:to-success-500/5 p-4 flex gap-3">
          <Sparkles class="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
          <div>
            <h4 class="text-theme-sm font-semibold text-brand-600 dark:text-brand-400 mb-1">Gợi ý từ AI</h4>
            <p class="text-theme-xs text-gray-600 dark:text-gray-400">{{ aiInsight }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
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

        <!-- Automation Rules Button -->
        <Button
          type="button"
          variant="outline"
          class="w-full gap-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
          @click="showAutomation = true"
        >
          <Zap class="h-4 w-4 text-warning-500" />
          Automation Rules
        </Button>

        <!-- AI Chat Button -->
        <Button
          type="button"
          class="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-600 text-white shadow-theme-xs gap-2"
          @click="showAiChat = true"
        >
          <Sparkles class="h-4 w-4" />
          Hỏi AI về lead này
        </Button>
      </aside>

      <!-- AI Chat Dialog -->
      <AiChatDialog
        :open="showAiChat"
        entity-type="lead"
        :entity-name="lead.title"
        @update:open="showAiChat = $event"
      />

      <AutomationRulesDialog
        :open="showAutomation"
        entity-type="lead"
        :entity-name="lead.title"
        @update:open="showAutomation = $event"
      />

      <!-- ===== RIGHT CONTENT (70%) ===== -->
      <div class="flex-1 min-w-0 flex flex-col">

        <!-- Top action bar -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
          <!-- Tabs (desktop) -->
          <div class="hidden lg:flex items-center gap-5">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="py-3 text-theme-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'text-brand-500 border-brand-500'
                : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300'"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- Right: action buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              class="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-600 text-white text-theme-xs gap-1.5 shadow-theme-xs"
              @click="showAiChat = true"
            >
              <Sparkles class="h-3.5 w-3.5" />
              Hỏi AI về lead này
            </Button>
            <Button type="button" variant="outline" class="border-gray-200 dark:border-gray-700 text-theme-xs" @click="handleEdit">
              <Pencil class="mr-1.5 h-3.5 w-3.5" />
              Sửa
            </Button>
            <Button type="button" variant="outline" class="border-error-200 text-error-500 hover:bg-error-50 dark:border-error-500/30 text-theme-xs" @click="handleDelete">
              <Trash2 class="mr-1.5 h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>

        <!-- Stage chevron bar -->
        <div class="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <div class="flex min-w-max">
            <div
              v-for="(s, idx) in STAGE_ORDER"
              :key="s"
              class="stage-chevron flex min-w-[110px] items-center justify-center px-4 py-2 text-[11px] font-medium cursor-pointer transition-all"
              :style="s === lead.stage
                ? { background: STAGE_STYLE[s].border, color: '#fff' }
                : idx < currentStageIndex
                  ? { background: STAGE_STYLE[lead.stage].bg, color: STAGE_STYLE[lead.stage].text }
                  : {}"
              :class="s !== lead.stage && idx >= currentStageIndex ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : ''"
              @click="handleStageChange(s)"
            >
              <Flag v-if="s === lead.stage" class="mr-1 h-3 w-3" />
              {{ STAGE_LABEL[s] }}
            </div>
          </div>
        </div>

        <!-- Tab content -->
        <div class="flex-1 p-5 space-y-4 pb-10 overflow-y-auto">

          <!-- Tổng quan -->
          <template v-if="activeTab === 'overview'">

            <!-- Auto-created deal banner (shown when stage is customer) -->
            <div
              v-if="lead.stage === 'customer'"
              class="flex items-center justify-between gap-3 rounded-xl border border-success-200 bg-success-50 px-4 py-3 dark:border-success-500/30 dark:bg-success-500/10"
            >
              <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-100 dark:bg-success-500/20">
                  <svg class="h-4 w-4 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p class="text-theme-sm font-semibold text-success-700 dark:text-success-400">Deal đã được tạo tự động</p>
                  <p class="text-theme-xs text-success-600/80 dark:text-success-400/70">Lead đã đạt giai đoạn Customer — hệ thống đã tự động tạo một Deal tương ứng.</p>
                </div>
              </div>
              <button
                type="button"
                class="flex shrink-0 items-center gap-1.5 rounded-lg bg-success-600 px-3 py-1.5 text-theme-xs font-medium text-white hover:bg-success-700 transition-colors"
                @click="router.push('/crm-deals')"
              >
                Xem Deal
                <ArrowRight class="h-3.5 w-3.5" />
              </button>
            </div>

            <!-- Contact info section -->
            <section v-if="leadFieldStore.isSectionVisible('contact')" class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs overflow-hidden">
              <div class="px-5 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" @click="toggle('contact')">
                <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User class="h-4 w-4 text-brand-500" />
                  Thông tin liên hệ
                  <span class="text-theme-xs text-gray-400 font-normal">({{ contactFields.filter(f => f.value !== '—').length }} trường)</span>
                </h3>
                <ChevronDown class="h-4 w-4 text-gray-400 transition-transform" :class="expanded.has('contact') ? '' : '-rotate-90'" />
              </div>
              <Transition name="accordion">
                <div v-show="expanded.has('contact')" class="p-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div v-for="field in contactFields" :key="field.label" class="space-y-1">
                      <label class="text-theme-xs text-gray-400 uppercase tracking-wider font-medium">{{ field.label }}</label>
                      <div
                        class="text-theme-sm border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 py-1 transition-all"
                        :class="field.value === '—' ? 'text-gray-300 dark:text-gray-600 italic' : 'text-gray-900 dark:text-white'"
                      >
                        <a v-if="field.href" :href="field.href" class="text-brand-500 hover:underline">{{ field.value }}</a>
                        <span v-else>{{ field.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </section>

            <!-- Lead info section -->
            <section v-if="leadFieldStore.isSectionVisible('leadinfo')" class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs overflow-hidden">
              <div class="px-5 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors" @click="toggle('leadinfo')">
                <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart2 class="h-4 w-4 text-brand-500" />
                  Thông tin Lead
                </h3>
                <ChevronDown class="h-4 w-4 text-gray-400 transition-transform" :class="expanded.has('leadinfo') ? '' : '-rotate-90'" />
              </div>
              <Transition name="accordion">
                <div v-show="expanded.has('leadinfo')" class="p-5">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div v-for="field in leadInfoFields" :key="field.label" class="space-y-1">
                      <label class="text-theme-xs text-gray-400 uppercase tracking-wider font-medium">{{ field.label }}</label>
                      <div class="py-1">
                        <span
                          v-if="field.badge"
                          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-theme-xs font-semibold"
                          :style="field.badgeStyle"
                        >{{ field.value }}</span>
                        <span
                          v-else
                          class="text-theme-sm border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all"
                          :class="field.value === '—' ? 'text-gray-300 dark:text-gray-600 italic' : 'text-gray-900 dark:text-white'"
                        >{{ field.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </section>

          </template>

          <!-- Hoạt động -->
          <template v-else-if="activeTab === 'activity'">
            <div class="space-y-4">
              <ActivityItemCard
                v-for="item in allActivities"
                :key="item.id"
                :item="item"
                @update="onActivityUpdate"
                @remove="onActivityRemove"
                @result="onActivityResult"
              />

              <!-- Add activity button -->
              <button
                type="button"
                class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-3 text-theme-sm text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors"
                @click="showActivityDialog = true"
              >
                <Plus class="h-4 w-4" />
                Thêm hoạt động
              </button>
            </div>
          </template>

          <!-- Lịch sử -->
          <template v-else-if="activeTab === 'history'">
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-theme-xs px-5 py-5">
              <!-- Header -->
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white">Lịch sử thay đổi</h3>
                <span class="text-theme-xs text-gray-400">{{ history.length }} thao tác</span>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="border-b border-gray-200 dark:border-gray-700">
                      <th class="text-left text-theme-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4 w-44">Người thực hiện</th>
                      <th class="text-left text-theme-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4 w-36">Thời gian</th>
                      <th class="text-left text-theme-xs font-semibold text-gray-500 dark:text-gray-400 pb-3 pr-4 w-36">Lịch sử thay đổi</th>
                      <th class="text-left text-theme-xs font-semibold text-gray-500 dark:text-gray-400 pb-3">Chi tiết thay đổi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="entry in history"
                      :key="entry.id"
                      class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <!-- Người thực hiện -->
                      <td class="py-3 pr-4 align-top">
                        <div class="flex items-center gap-2.5">
                          <div
                            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                            :class="entry.userColor"
                          >
                            {{ entry.userInitial }}
                          </div>
                          <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ entry.user }}</span>
                        </div>
                      </td>
                      <!-- Thời gian -->
                      <td class="py-3 pr-4 align-top">
                        <span class="text-theme-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{{ entry.time }}</span>
                      </td>
                      <!-- Lịch sử thay đổi -->
                      <td class="py-3 pr-4 align-top">
                        <span
                          class="text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                          :class="HISTORY_BADGE[entry.type].cls"
                        >
                          {{ HISTORY_BADGE[entry.type].label }}
                        </span>
                      </td>
                      <!-- Chi tiết thay đổi -->
                      <td class="py-3 align-top">
                        <p class="text-theme-sm text-gray-700 dark:text-gray-300">{{ entry.description }}</p>
                        <div v-if="entry.from || entry.to" class="mt-1.5 flex flex-wrap items-center gap-2">
                          <span v-if="entry.field" class="text-theme-xs text-gray-400 font-medium">{{ entry.field }}:</span>
                          <span
                            v-if="entry.from"
                            class="text-theme-xs bg-error-50 dark:bg-error-500/10 text-error-600 dark:text-error-400 px-2 py-0.5 rounded line-through"
                          >{{ entry.from }}</span>
                          <span v-if="entry.from && entry.to" class="text-gray-400">→</span>
                          <span
                            v-if="entry.to"
                            class="text-theme-xs bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-400 px-2 py-0.5 rounded font-medium"
                          >{{ entry.to }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <!-- Empty state -->
                <div v-if="history.length === 0" class="text-center py-12 text-gray-400">
                  <span class="material-symbols-outlined text-[40px] block mb-2 text-gray-300">history</span>
                  <p class="text-theme-sm">Chưa có lịch sử thay đổi nào</p>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- Edit Lead Dialog -->
    <Dialog :open="showEditLeadDialog" @update:open="showEditLeadDialog = $event">
      <DialogContent class="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Pencil class="h-4 w-4 text-brand-500" />
            Chỉnh sửa Lead
          </DialogTitle>
          <DialogDescription class="text-gray-500 dark:text-gray-400 text-theme-xs">
            Cập nhật thông tin lead. Các trường có dấu <span class="text-error-500">*</span> là bắt buộc.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <!-- Tên -->
          <div class="space-y-1.5">
            <Label class="text-theme-xs font-medium">Tên Lead <span class="text-error-500">*</span></Label>
            <Input v-model="editLeadForm.title" placeholder="Nhập tên lead" />
          </div>
          <!-- Công ty -->
          <div class="space-y-1.5">
            <Label class="text-theme-xs font-medium">Công ty</Label>
            <Input v-model="editLeadForm.companyName" placeholder="Tên công ty" />
          </div>
          <!-- Phone + Email -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label class="text-theme-xs font-medium">Điện thoại</Label>
              <Input v-model="editLeadForm.phone" type="tel" placeholder="0901 234 567" />
            </div>
            <div class="space-y-1.5">
              <Label class="text-theme-xs font-medium">Email</Label>
              <Input v-model="editLeadForm.email" type="email" placeholder="email@example.com" />
            </div>
          </div>
          <!-- Người phụ trách -->
          <div class="space-y-1.5">
            <Label class="text-theme-xs font-medium">Người phụ trách</Label>
            <Input v-model="editLeadForm.assigneeName" placeholder="Tên nhân viên" />
          </div>
          <!-- Nguồn + Giai đoạn -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label class="text-theme-xs font-medium">Nguồn</Label>
              <Select v-model="editLeadForm.source">
                <SelectTrigger><SelectValue placeholder="Chọn nguồn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="zalo">Zalo</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="space-y-1.5">
              <Label class="text-theme-xs font-medium">Giai đoạn</Label>
              <Select v-model="editLeadForm.stage">
                <SelectTrigger><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="mql">MQL</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="evangelist">Evangelist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-200 dark:border-gray-700 pt-4 gap-2">
          <Button variant="outline" @click="showEditLeadDialog = false">Hủy</Button>
          <Button class="bg-brand-500 text-white hover:bg-brand-600" @click="submitLeadEdit">
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete confirmation dialog -->
    <Dialog :open="showDeleteLeadConfirm" @update:open="showDeleteLeadConfirm = $event">
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2 text-error-600 dark:text-error-400">
            <Trash2 class="h-4 w-4" />
            Xóa Lead
          </DialogTitle>
          <DialogDescription class="text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa lead <span class="font-semibold text-gray-800 dark:text-gray-200">{{ lead.title }}</span>? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter class="gap-2 pt-2">
          <Button variant="outline" @click="showDeleteLeadConfirm = false">Hủy</Button>
          <Button class="bg-error-500 text-white hover:bg-error-600" @click="confirmDeleteLead">
            Xác nhận xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add Activity Dialog -->
    <AddActivityDialog
      v-model:open="showActivityDialog"
      :initial-type="activityDialogInitialType"
      :contact-name="lead.title"
      :contact-phone="lead.phone"
      :contact-email="lead.email"
      @submitted="handleActivitySubmitted"
    />

    <!-- Floating AI button -->
    <div class="fixed bottom-6 right-6 z-20">
      <button
        class="bg-brand-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 hover:bg-brand-600 transition-all"
        @click="handleQuickAction('Hỏi AI')"
      >
        <Sparkles class="h-6 w-6" />
      </button>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useLeadFieldConfigStore } from '@/stores/useLeadFieldConfigStore'
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  ChevronDown,
  Flag,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  Sparkles,
  SquareCheckBig,
  Trash2,
  User,
  Zap,
} from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AddActivityDialog from '@/components/crm/AddActivityDialog.vue'
import type { ActivitySubmitPayload } from '@/components/crm/AddActivityDialog.vue'
import ActivityItemCard from '@/components/crm/ActivityItemCard.vue'
import type { ActivityResultData, CardActivityItem } from '@/components/crm/ActivityItemCard.vue'
import { generateAiSuggestion } from '@/composables/useAiSuggestion'
import AiChatDialog from '@/components/crm/AiChatDialog.vue'
import AutomationRulesDialog from '@/components/crm/AutomationRulesDialog.vue'

// ─── Types ────────────────────────────────────────────────────

type LeadStage = 'lead' | 'mql' | 'sql' | 'opportunity' | 'customer' | 'evangelist'

interface LeadData {
  id: string
  title: string
  stage: LeadStage
  isRepeat?: boolean
  assigneeName?: string
  assigneeColor?: string
  teamLeadName?: string
  companyName?: string
  date: string
  isViewed?: boolean
  activityTime?: string
  avatarInitials: string
  avatarColor: string
  badgeCount: number
  phone?: string
  email?: string
  source?: string
}

// ─── Constants ────────────────────────────────────────────────

const STAGE_ORDER: LeadStage[] = ['lead', 'mql', 'sql', 'opportunity', 'customer', 'evangelist']

const STAGE_LABEL: Record<LeadStage, string> = {
  lead: 'Lead',
  mql: 'MQL',
  sql: 'SQL',
  opportunity: 'Opportunity',
  customer: 'Customer',
  evangelist: 'Evangelist',
}

const STAGE_STYLE: Record<LeadStage, { bg: string; text: string; border: string }> = {
  lead:        { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  mql:         { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  sql:         { bg: '#CCFBF1', text: '#134E4A', border: '#0D9488' },
  opportunity: { bg: '#E0F2FE', text: '#0C4A6E', border: '#0EA5E9' },
  customer:    { bg: '#DBEAFE', text: '#1E3A8A', border: '#3B82F6' },
  evangelist:  { bg: '#EDE9FE', text: '#3730A3', border: '#6366F1' },
}

// ─── Mock lead data (mirrors LeadKanbanBoard cards) ───────────

const ALL_LEADS = reactive<LeadData[]>([
  { id: 'l1', title: 'Tram Máy Sapa', stage: 'lead', isRepeat: true, assigneeName: 'Nguyễn Anh Tùng', assigneeColor: '#465fff', date: '13 May', isViewed: true, activityTime: '2 Minutes', avatarInitials: 'AT', avatarColor: '#465fff', badgeCount: 0, source: 'website' },
  { id: 'l2', title: '[AFF] D-Mart Hotel', stage: 'lead', date: 'Hôm nay, 3:54 CH', activityTime: 'Hôm nay 3:54 CH', avatarInitials: 'DM', avatarColor: '#10B981', badgeCount: 0, source: 'inbound' },
  { id: 'l3', title: 'Forever Green Resort', stage: 'lead', date: '15 Tháng 4', activityTime: 'Hôm nay 3:00 CH', avatarInitials: 'FG', avatarColor: '#8B5CF6', badgeCount: 0, source: 'referral' },
  { id: 'm1', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', stage: 'mql', isRepeat: true, assigneeName: 'Chi Hồng', assigneeColor: '#10B981', companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT', date: '38 phút trước', activityTime: '37 Minutes', avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0, source: 'website' },
  { id: 'm2', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API', stage: 'mql', isRepeat: true, date: '38 phút trước', activityTime: '38 Minutes', avatarInitials: 'PO', avatarColor: '#F59E0B', badgeCount: 0, source: 'outbound' },
  { id: 'm3', title: 'POPUP ĐĂNG KÝ DÙNG THỬ API — Nam', stage: 'mql', isRepeat: true, date: '39 phút trước', activityTime: '39 Minutes', avatarInitials: 'NA', avatarColor: '#EF4444', badgeCount: 0, source: 'outbound' },
  { id: 'm4', title: 'FORM ĐĂNG KÝ DÙNG THỬ API', stage: 'mql', isRepeat: true, date: '41 phút trước', activityTime: '41 Minutes', avatarInitials: 'FK', avatarColor: '#6366F1', badgeCount: 0, source: 'event' },
  { id: 's1', title: 'Khách sạn Emma', stage: 'sql', isRepeat: true, assigneeName: 'Chi Hồng', assigneeColor: '#10B981', companyName: 'CÔNG TY TNHH TM VÀ DV DL ĐẠI PHÁT', date: 'Hôm nay, 4:28 CH', activityTime: 'Hôm nay 4:28 CH', avatarInitials: 'KE', avatarColor: '#10B981', badgeCount: 0, source: 'inbound' },
  { id: 's2', title: '[AFF] Khách sạn Thành Cao', stage: 'sql', date: 'Hôm nay, 4:12 CH', activityTime: 'Hôm nay 4:12 CH', avatarInitials: 'TC', avatarColor: '#06B6D4', badgeCount: 0, source: 'referral' },
  { id: 's3', title: 'Marisol Hotel Đà Nẵng', stage: 'sql', date: '15 Tháng 4', activityTime: 'Hôm nay 4:05 CH', avatarInitials: 'MH', avatarColor: '#8B5CF6', badgeCount: 0, source: 'event' },
  { id: 's4', title: 'Khách sạn 43p_Đà Lạt', stage: 'sql', date: '15 Tháng 4', avatarInitials: 'DL', avatarColor: '#F59E0B', badgeCount: 0, source: 'outbound' },
  { id: 'o1', title: 'Golden Hotel', stage: 'opportunity', date: '13 May', activityTime: '13 May', avatarInitials: 'GH', avatarColor: '#0EA5E9', badgeCount: 0, source: 'inbound' },
  { id: 'o2', title: 'Lovera Signature', stage: 'opportunity', date: '12 May', activityTime: '12 May', avatarInitials: 'LS', avatarColor: '#EC4899', badgeCount: 0, source: 'referral' },
  { id: 'o3', title: '[AFF] MonSoon Boutique Hotel Da Lat', stage: 'opportunity', date: '5 May', activityTime: '5 May', avatarInitials: 'MB', avatarColor: '#10B981', badgeCount: 0, source: 'event' },
  { id: 'o4', title: '[AFF] Khách Sạn Cường Thanh 1 & 2', stage: 'opportunity', date: '23 March', avatarInitials: 'CT', avatarColor: '#6366F1', badgeCount: 0, source: 'website' },
  { id: 'c1', title: 'Resort Dakke Mang Den_56p_ezCloudhotel', stage: 'customer', isRepeat: true, assigneeName: 'Bảo Trần', assigneeColor: '#465fff', companyName: 'CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ DU LỊCH KHÁNH DƯƠNG MĂNG ĐEN', date: '15 May', activityTime: '15 May', avatarInitials: 'BT', avatarColor: '#465fff', badgeCount: 0, source: 'referral' },
  { id: 'c2', title: 'FORM ĐĂNG KÝ DÙNG THỬ API Trần Thế Hùng', stage: 'customer', isRepeat: true, date: '13 May', activityTime: '13 May', avatarInitials: 'TH', avatarColor: '#8B5CF6', badgeCount: 0, source: 'website' },
  { id: 'c3', title: 'Agarwood Hotel_16p_ezCloudhotel nâng cao', stage: 'customer', isRepeat: true, assigneeName: 'Chi Hương', assigneeColor: '#10B981', companyName: 'CHI NHÁNH CÔNG TY TNHH MỸ NGHỆ THẮNG TRÌNH - KHÁCH SẠN TRĂM HƯƠNG', date: '6 Apr', activityTime: '6 Apr', avatarInitials: 'CH', avatarColor: '#10B981', badgeCount: 0, source: 'inbound' },
])

// ─── Route / Router ───────────────────────────────────────────

const route = useRoute()
const router = useRouter()
const showAiChat = ref(false)
const showAutomation = ref(false)

const lead = computed<LeadData>(() => {
  const id = String(route.params.leadId)
  return ALL_LEADS.find((l) => l.id === id) ?? ALL_LEADS[0]
})

// ─── Stage logic ──────────────────────────────────────────────

const currentStageIndex = computed(() => STAGE_ORDER.indexOf(lead.value.stage))

const stageProgress = computed(() => {
  const idx = currentStageIndex.value
  return Math.round((idx / (STAGE_ORDER.length - 1)) * 100)
})

// ─── UI state ─────────────────────────────────────────────────

const activeTab = ref('overview')
const expanded = ref<Set<string>>(new Set(['contact', 'leadinfo']))
const showActivityDialog = ref(false)
const activityDialogInitialType = ref('')
const showEditLeadDialog = ref(false)
const showDeleteLeadConfirm = ref(false)
const editLeadForm = reactive({
  title: '',
  companyName: '',
  phone: '',
  email: '',
  assigneeName: '',
  source: '',
  stage: 'lead' as LeadStage,
})
const localActivities = ref<CardActivityItem[]>([])
const deletedIds = ref<Set<string>>(new Set())
const activityOverrides = ref<Record<string, Partial<CardActivityItem>>>({})

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'activity', label: 'Hoạt động' },
  { id: 'history', label: 'Lịch sử' },
]

function toggle(section: string): void {
  if (expanded.value.has(section)) expanded.value.delete(section)
  else expanded.value.add(section)
}

// ─── Field config store ────────────────────────────────────────

const leadFieldStore = useLeadFieldConfigStore()

// ─── Computed field lists ─────────────────────────────────────

const contactFields = computed(() => {
  const all = [
    { fieldId: 'contact_name',     label: 'Tên',              value: lead.value.title },
    { fieldId: 'contact_company',  label: 'Công ty',          value: lead.value.companyName ?? '—' },
    { fieldId: 'contact_phone',    label: 'Điện thoại',       value: lead.value.phone ?? '—',  href: lead.value.phone  ? `tel:${lead.value.phone}`      : undefined },
    { fieldId: 'contact_email',    label: 'Email',            value: lead.value.email ?? '—',  href: lead.value.email  ? `mailto:${lead.value.email}`   : undefined },
    { fieldId: 'contact_assignee', label: 'Người phụ trách',  value: lead.value.assigneeName ?? '—' },
  ]
  return all.filter((f) => leadFieldStore.isVisible(f.fieldId))
})

const leadInfoFields = computed(() => {
  const all = [
    {
      fieldId: 'lead_stage',
      label: 'Giai đoạn',
      value: STAGE_LABEL[lead.value.stage],
      badge: true,
      badgeStyle: { background: STAGE_STYLE[lead.value.stage].bg, color: STAGE_STYLE[lead.value.stage].text },
    },
    { fieldId: 'lead_source',   label: 'Nguồn',               value: lead.value.source ?? '—',                badge: false },
    { fieldId: 'lead_type',     label: 'Loại',                value: lead.value.isRepeat ? 'Repeat' : 'New',  badge: false },
    { fieldId: 'lead_date',     label: 'Ngày tạo',            value: lead.value.date,                         badge: false },
    { fieldId: 'lead_activity', label: 'Hoạt động gần nhất',  value: lead.value.activityTime ?? '—',          badge: false },
    { fieldId: 'lead_viewed',   label: 'Đã xem',              value: lead.value.isViewed ? 'Có' : 'Chưa',     badge: false },
  ]
  return all.filter((f) => leadFieldStore.isVisible(f.fieldId))
})

// ─── Timeline & History ───────────────────────────────────────

const timeline = computed<CardActivityItem[]>(() => {
  const l = lead.value
  const ctx = { name: l.title, company: l.companyName }
  const items: CardActivityItem[] = []
  if (l.isViewed) {
    items.push({
      id: 'v1',
      title: 'Đã xem lead',
      detail: 'Khách hàng đã mở link theo dõi',
      time: l.activityTime ?? l.date,
      badge: 'Viewed',
      badgeClass: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-300',
      type: 'other',
      note: 'Khách hàng đã mở link theo dõi',
      date: new Date().toISOString().slice(0, 16),
      aiSuggestion:
        `🔥 Lead đang "nóng" — hành động ngay!\n\n` +
        `${l.title} vừa xem tài liệu. Xác suất phản hồi cao nhất trong vòng 60 phút.\n\n` +
        `📞 Gọi ngay và mở bằng:\n"Xin chào ${l.title}, em thấy anh/chị vừa xem thông tin về [sản phẩm]. Anh/chị có câu hỏi gì cần em hỗ trợ không ạ?"`,
    })
  }
  if (l.assigneeName) {
    items.push({
      id: 'a1',
      title: `Giao cho ${l.assigneeName}`,
      detail: 'Lead được phân công cho nhân viên',
      time: l.date,
      badge: 'Assign',
      badgeClass: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300',
      type: 'other',
      note: 'Lead được phân công cho nhân viên',
      date: new Date().toISOString().slice(0, 16),
      aiSuggestion:
        `👋 Checklist bắt đầu cho ${l.assigneeName}:\n\n` +
        `• Gửi tin nhắn/email giới thiệu bản thân trong 2h\n` +
        `• Tìm hiểu thêm về ${l.companyName ?? l.title} trên mạng\n` +
        `• Lên lịch Cold Call trong 24–48h tiếp theo\n\n` +
        `💡 First impression rất quan trọng — cá nhân hóa ngay từ đầu.`,
    })
  }
  items.push({
    id: 'c1',
    title: 'Lead được tạo',
    detail: `Nguồn: ${l.source ?? 'Không rõ'}`,
    time: l.date,
    badge: 'Tạo mới',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    type: 'other',
    note: `Nguồn: ${l.source ?? 'Không rõ'}`,
    date: new Date().toISOString().slice(0, 16),
    aiSuggestion: generateAiSuggestion('call', 'Cold Call', '', ctx),
  })
  return items
})

// ── Lịch sử thay đổi ─────────────────────────────────────────

type HistoryType = 'created' | 'stage_change' | 'field_update' | 'activity' | 'note' | 'assigned' | 'deal_linked' | 'deleted'

interface HistoryEntry {
  id: string
  type: HistoryType
  description: string
  user: string
  userInitial: string
  userColor: string
  time: string
  field?: string
  from?: string
  to?: string
}

const HISTORY_BADGE: Record<HistoryType, { label: string; cls: string }> = {
  created:      { label: 'Tạo mới',       cls: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400' },
  stage_change: { label: 'Đổi giai đoạn', cls: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400' },
  field_update: { label: 'Cập nhật',      cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  activity:     { label: 'Hoạt động',     cls: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400' },
  note:         { label: 'Ghi chú',       cls: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400' },
  assigned:     { label: 'Phân công',     cls: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400' },
  deal_linked:  { label: 'Liên kết Deal', cls: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400' },
  deleted:      { label: 'Xóa',           cls: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400' },
}

const history = ref<HistoryEntry[]>([
  {
    id: 'h-1',
    type: 'stage_change',
    description: 'Chuyển giai đoạn lead',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '14:30, Hôm nay',
    from: 'Liên hệ',
    to: 'Cơ hội',
  },
  {
    id: 'h-2',
    type: 'activity',
    description: 'Ghi nhận cuộc gọi Follow-up thành công',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '09:15, Hôm nay',
  },
  {
    id: 'h-3',
    type: 'deal_linked',
    description: 'Tạo Deal từ lead này',
    user: 'Hệ thống',
    userInitial: 'HT',
    userColor: 'bg-purple-500',
    time: '14:31, Hôm nay',
    to: 'Sunrise Beach Resort — Gói Marketing AI 360',
  },
  {
    id: 'h-4',
    type: 'field_update',
    description: 'Cập nhật thông tin liên hệ',
    user: 'Trần Minh Quân',
    userInitial: 'Q',
    userColor: 'bg-success-500',
    time: '16:45, Hôm qua',
    field: 'Số điện thoại',
    from: '0901 234 567',
    to: '0912 345 678',
  },
  {
    id: 'h-5',
    type: 'field_update',
    description: 'Cập nhật nguồn lead',
    user: 'Trần Minh Quân',
    userInitial: 'Q',
    userColor: 'bg-success-500',
    time: '16:40, Hôm qua',
    field: 'Nguồn',
    from: 'Chưa xác định',
    to: 'Facebook Ads',
  },
  {
    id: 'h-6',
    type: 'assigned',
    description: 'Phân công lead cho nhân viên',
    user: 'Lê Hoa Phương',
    userInitial: 'P',
    userColor: 'bg-warning-500',
    time: '10:00, 14/11/2024',
    from: 'Chưa phân công',
    to: 'Nguyễn Văn An',
  },
  {
    id: 'h-7',
    type: 'note',
    description: 'Thêm ghi chú: Khách hàng quan tâm gói enterprise, cần báo giá tuỳ chỉnh',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '15:30, 13/11/2024',
  },
  {
    id: 'h-8',
    type: 'created',
    description: 'Lead được nhập vào hệ thống',
    user: 'Hệ thống',
    userInitial: 'HT',
    userColor: 'bg-gray-400',
    time: '09:00, 12/11/2024',
  },
])

// ─── Quick Actions ────────────────────────────────────────────

const aiInsight = computed(() => {
  const stage = lead.value.stage
  if (stage === 'lead') return 'Lead mới — hãy liên hệ trong vòng 24h để tăng tỷ lệ chuyển đổi lên 3x.'
  if (stage === 'mql') return 'Lead đã có dấu hiệu quan tâm. Gửi tài liệu phù hợp để chuyển sang SQL.'
  if (stage === 'sql') return 'Lead đã được xác nhận nhu cầu. Đề xuất cuộc gặp demo ngay tuần này.'
  if (stage === 'opportunity') return 'Cơ hội đang nóng. Chuẩn bị báo giá và kế hoạch triển khai chi tiết.'
  if (stage === 'customer') return 'Khách hàng đã ký hợp đồng. Tập trung onboarding để tăng upsell.'
  return 'Lead tiềm năng cao. Khai thác referral từ khách hàng này.'
})

const quickActions = [
  { label: 'Ghi chú', icon: MessageSquare },
  { label: 'Tác vụ', icon: SquareCheckBig },
  { label: 'Email', icon: Mail },
  { label: 'Gọi điện', icon: Phone },
]

const QUICK_ACTION_TYPE_MAP: Record<string, string> = {
  'Ghi chú': 'note',
  'Tác vụ': 'task',
  'Email': 'email',
  'Gọi điện': 'call',
}

function handleQuickAction(action: string): void {
  const type = QUICK_ACTION_TYPE_MAP[action]
  if (type) {
    activityDialogInitialType.value = type
    activeTab.value = 'activity'
    showActivityDialog.value = true
  } else {
    toast.info(`Đang mở: ${action}`)
  }
}

const ACTIVITY_BADGE_MAP: Record<string, string> = {
  call: 'Gọi điện',
  email: 'Email',
  message: 'Nhắn tin',
  social: 'Social',
  meeting: 'Gặp mặt',
  note: 'Ghi chú',
  task: 'Tác vụ',
  other: 'Khác',
}

const ACTIVITY_BADGE_CLASS_MAP: Record<string, string> = {
  call: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  email: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-300',
  message: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-300',
  social: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300',
  note: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
  task: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
  meeting: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
}

const allActivities = computed<CardActivityItem[]>(() => [
  ...localActivities.value.filter((a) => !deletedIds.value.has(a.id)),
  ...timeline.value
    .filter((item) => !deletedIds.value.has(item.id))
    .map((item) => ({ ...item, ...(activityOverrides.value[item.id] ?? {}) })),
])

watch(showActivityDialog, (open) => {
  if (!open) activityDialogInitialType.value = ''
})

function handleActivitySubmitted(payload: ActivitySubmitPayload): void {
  const ctx = { name: lead.value.title, company: lead.value.companyName }
  localActivities.value.unshift({
    id: `local-${Date.now()}`,
    title: payload.form.title || ACTIVITY_BADGE_MAP[payload.type] || 'Hoạt động',
    detail: [payload.subType ? `Loại: ${payload.subType}` : '', payload.form.note].filter(Boolean).join(' · '),
    note: payload.form.note,
    date: payload.form.date,
    duration: payload.form.duration,
    time: new Date(payload.form.date).toLocaleString('vi-VN'),
    badge: ACTIVITY_BADGE_MAP[payload.type] ?? 'Hoạt động',
    badgeClass: ACTIVITY_BADGE_CLASS_MAP[payload.type] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    aiSuggestion: generateAiSuggestion(payload.type, payload.subType, payload.form.note, ctx),
    type: payload.type,
    subType: payload.subType,
    isNew: true,
  })
}

function onActivityUpdate(id: string, changes: Partial<CardActivityItem>): void {
  const localIdx = localActivities.value.findIndex((a) => a.id === id)
  if (localIdx >= 0) {
    Object.assign(localActivities.value[localIdx], changes)
  } else {
    activityOverrides.value[id] = { ...(activityOverrides.value[id] ?? {}), ...changes }
  }
}

function onActivityRemove(id: string): void {
  const localIdx = localActivities.value.findIndex((a) => a.id === id)
  if (localIdx >= 0) {
    localActivities.value.splice(localIdx, 1)
  } else {
    deletedIds.value.add(id)
  }
  toast.success('Đã xóa hoạt động')
}

function onActivityResult(id: string, data: ActivityResultData): void {
  const resultText = data.note ? `${data.outcome} — ${data.note}` : data.outcome
  const followNote = data.followUpDate
    ? ` · Follow-up: ${new Date(data.followUpDate).toLocaleDateString('vi-VN')}`
    : ''
  onActivityUpdate(id, { result: resultText + followNote, isClosed: data.close })
  toast.success(data.close ? 'Đã đóng hoạt động' : 'Đã ghi nhận kết quả')
}

function handleEdit(): void {
  const l = lead.value
  editLeadForm.title = l.title
  editLeadForm.companyName = l.companyName ?? ''
  editLeadForm.phone = l.phone ?? ''
  editLeadForm.email = l.email ?? ''
  editLeadForm.assigneeName = l.assigneeName ?? ''
  editLeadForm.source = l.source ?? ''
  editLeadForm.stage = l.stage
  showEditLeadDialog.value = true
}

function submitLeadEdit(): void {
  const l = ALL_LEADS.find(x => x.id === lead.value.id)
  if (!l) return
  l.title = editLeadForm.title.trim() || l.title
  l.companyName = editLeadForm.companyName.trim() || undefined
  l.phone = editLeadForm.phone.trim() || undefined
  l.email = editLeadForm.email.trim() || undefined
  l.assigneeName = editLeadForm.assigneeName.trim() || undefined
  l.source = editLeadForm.source || undefined
  l.stage = editLeadForm.stage
  showEditLeadDialog.value = false
  toast.success('Đã lưu thông tin lead')
}

function handleDelete(): void {
  showDeleteLeadConfirm.value = true
}

function confirmDeleteLead(): void {
  showDeleteLeadConfirm.value = false
  toast.success('Đã xóa lead')
  void router.push('/crm-work')
}

function handleStageChange(stage: LeadStage): void {
  if (stage === lead.value.stage) return

  // Auto-create a deal when lead reaches Customer stage
  if (stage === 'customer') {
    toast.success(`Lead "${lead.value.title}" đã chuyển thành Customer — Deal mới đã được tạo tự động!`, {
      action: {
        label: 'Xem Deal',
        onClick: () => void router.push('/crm-deals'),
      },
      duration: 6000,
    })
  } else {
    toast.info(`Chuyển sang giai đoạn: ${STAGE_LABEL[stage]}`)
  }
}
</script>

<style scoped>
.stage-chevron {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
}
.stage-chevron:first-child {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
}
.stage-chevron:last-child {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%);
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 2000px;
}
</style>
