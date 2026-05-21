<template>
  <AdminLayout>
    <div class="-m-4 md:-m-6 flex items-start gap-0 min-h-[calc(100vh-64px)]">
      <!-- ===== LEFT SIDEBAR (30%) ===== -->
      <aside class="hidden lg:flex w-[30%] min-w-[280px] max-w-[380px] flex-col gap-4 p-5 sticky top-0 h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <!-- Back to Kanban -->
        <button
          type="button"
          class="flex items-center gap-2 self-start rounded-lg px-3 py-1.5 text-theme-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          @click="router.push('/crm-deals')"
        >
          <ArrowLeft class="h-4 w-4" />
          Quay lại Kanban
        </button>

        <!-- Deal Summary Card -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs p-5">
          <!-- Avatar + title -->
          <div class="flex items-start gap-3 mb-5">
            <div class="w-14 h-14 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 text-xl font-bold shrink-0 overflow-hidden">
              <span v-if="!dealData?.companyName">{{ deal.title.charAt(0) }}</span>
              <span v-else>{{ deal.title.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white leading-tight truncate" :title="deal.title">
                {{ deal.title }}
              </h2>
              <p class="text-theme-xs text-gray-400 mt-0.5">Deal ID: #{{ deal.code }}</p>
            </div>
          </div>

          <!-- Pipeline progress -->
          <div class="space-y-2 mb-5">
            <div class="flex justify-between text-theme-xs font-medium text-gray-400 uppercase tracking-wider">
              <span>{{ currentStageLabel }}</span>
              <span>{{ stageProgress }}%</span>
            </div>
            <div class="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-brand-500 rounded-full transition-all duration-500"
                :style="{ width: `${stageProgress}%` }"
              />
            </div>
            <div class="flex gap-1">
              <div
                v-for="(stage, idx) in stages.slice(0, -1)"
                :key="stage.id"
                class="h-1 flex-1 rounded-full transition-all"
                :class="idx < currentStageIndex ? 'bg-brand-500' : idx === currentStageIndex ? 'bg-brand-300' : 'bg-gray-200 dark:bg-gray-700'"
              />
            </div>
          </div>

          <!-- Metrics tiles -->
          <div class="grid grid-cols-3 gap-2 mb-5">
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <p class="text-theme-xs text-gray-400 mb-1">Giá trị</p>
              <p class="text-theme-sm font-bold text-brand-500 leading-tight">{{ deal.shortValue }}</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center border-l-2 border-brand-500">
              <p class="text-theme-xs text-gray-400 mb-1">Xác suất</p>
              <p class="text-theme-sm font-bold text-brand-600 dark:text-brand-400">{{ deal.probability }}%</p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
              <p class="text-theme-xs text-gray-400 mb-1">Đóng dự kiến</p>
              <p class="text-theme-xs font-bold text-gray-900 dark:text-white leading-tight">{{ deal.shortCloseDate }}</p>
            </div>
          </div>

          <!-- Key-value list -->
          <div class="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Pipeline</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.pipelineLabel }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Phụ trách</span>
              <div class="flex items-center gap-1.5">
                <div class="w-6 h-6 rounded-full bg-brand-500 text-[10px] flex items-center justify-center text-white font-bold">
                  {{ deal.assigneeInitial }}
                </div>
                <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.owner }}</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Team Lead quản lý</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.teamLeadName ?? '—' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Nguồn</span>
              <span class="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-theme-xs font-medium text-gray-700 dark:text-gray-300">
                {{ deal.source }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-theme-sm text-gray-500">Công ty</span>
              <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.customer }}</span>
            </div>
          </div>

          <!-- Contacts -->
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <p class="text-theme-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Người liên hệ</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-if="deal.contactName"
                class="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full pl-1 pr-3 py-1"
              >
                <div class="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-[10px] flex items-center justify-center font-bold">
                  {{ deal.contactName.charAt(0) }}
                </div>
                <span class="text-theme-xs text-gray-700 dark:text-gray-300">{{ deal.contactName }}</span>
              </div>
              <button class="w-8 h-8 rounded-full border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <span class="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>

        <!-- AI Insight Card -->
        <div class="rounded-xl border border-brand-200 dark:border-brand-500/30 bg-gradient-to-br from-brand-50 to-success-50/50 dark:from-brand-500/10 dark:to-success-500/5 p-4 flex gap-3">
          <span class="material-symbols-outlined text-brand-500 text-[24px] shrink-0" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
          <div>
            <h4 class="text-theme-sm font-semibold text-brand-600 dark:text-brand-400 mb-1">Gợi ý từ AI</h4>
            <p class="text-theme-xs text-gray-600 dark:text-gray-400">{{ aiReason }}</p>
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
      </aside>

      <!-- ===== RIGHT CONTENT (70%) ===== -->
      <div class="flex-1 min-w-0 flex flex-col">
        <!-- Top action bar -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-5 py-3 flex items-center justify-between gap-4 shrink-0">
          <!-- Mobile: deal title -->
          <div class="lg:hidden flex items-center gap-2 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-500 font-bold text-sm shrink-0">
              {{ deal.title.charAt(0) }}
            </div>
            <span class="text-theme-sm font-semibold text-gray-900 dark:text-white truncate">{{ deal.title }}</span>
          </div>

          <!-- Tabs (desktop) -->
          <nav class="hidden lg:flex items-center gap-5">
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
              <span v-if="tab.count" class="ml-1 text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded-full">{{ tab.count }}</span>
            </button>
          </nav>

          <!-- Action buttons -->
          <div class="flex items-center gap-2 shrink-0">
            <Button type="button" variant="outline" class="border-gray-200 dark:border-gray-700 text-theme-xs" @click="handleSave">
              <Save class="mr-1.5 h-3.5 w-3.5" />
              Lưu
            </Button>
            <Button type="button" variant="outline" class="border-error-200 text-error-500 hover:bg-error-50 dark:border-error-500/30 text-theme-xs" @click="handleDelete">
              <Trash2 class="mr-1.5 h-3.5 w-3.5" />
              Xóa
            </Button>
          </div>
        </div>

        <!-- Stage progress bar (desktop) -->
        <div class="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <div class="flex min-w-max">
            <div
              v-for="(stage, idx) in stages.slice(0, -1)"
              :key="stage.id"
              class="stage-chevron flex min-w-[110px] items-center justify-center px-4 py-2 text-[11px] font-medium cursor-pointer transition-all"
              :class="!stage.current && idx >= currentStageIndex ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' : ''"
              :style="stage.current
                ? { background: STAGE_COLOR[stage.id as DealStage], color: '#fff' }
                : idx < currentStageIndex
                  ? { background: STAGE_COLOR[stage.id as DealStage] + '28', color: STAGE_COLOR[stage.id as DealStage] }
                  : {}"
              @click="handleStageClick(stage)"
            >
              <Flag v-if="stage.current" class="mr-1 h-3 w-3" />
              {{ stage.label }}
            </div>
          </div>
        </div>

        <!-- Tab content -->
        <div class="flex-1 p-5 space-y-4 pb-10 overflow-y-auto">
          <!-- Tổng quan tab -->
          <template v-if="activeTab === 'overview'">
            <!-- Admin notice banner -->
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-3 flex items-center justify-between border-l-4 border-gray-300 dark:border-gray-600">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-gray-400 text-[20px]">visibility_off</span>
                <p class="text-theme-sm text-gray-500 dark:text-gray-400">
                  Đang hiển thị
                  <span class="font-bold text-gray-700 dark:text-gray-300">{{ fieldConfigStore.totalVisible }}/{{ fieldConfigStore.totalFields }}</span>
                  trường dữ liệu.
                </p>
              </div>
              <button
                class="text-theme-sm text-brand-500 font-medium hover:underline flex items-center gap-1 shrink-0"
                @click="showFieldConfigModal = true"
              >
                <span class="material-symbols-outlined text-[16px]">tune</span>
                Tuỳ chỉnh
              </button>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="rounded-xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse">
                <div class="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="j in 4" :key="j" class="space-y-2">
                    <div class="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
                    <div class="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Accordion sections -->
            <template v-else>
              <section
                v-for="section in fieldConfigStore.visibleSections"
                :key="section.id"
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-theme-xs overflow-hidden"
              >
                <!-- Section header -->
                <div
                  class="px-5 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  @click="toggleSection(section.id)"
                >
                  <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-brand-500 text-[20px]">{{ section.icon }}</span>
                    {{ section.name }}
                    <span class="text-theme-xs text-gray-400 font-normal">
                      ({{ fieldConfigStore.visibleCountInSection(section.id) }} trường)
                    </span>
                  </h3>
                  <span
                    class="material-symbols-outlined text-gray-400 transition-transform duration-200"
                    :class="expandedSections.has(section.id) ? 'rotate-0' : '-rotate-90'"
                  >expand_less</span>
                </div>

                <!-- Section fields -->
                <Transition name="accordion">
                  <div v-show="expandedSections.has(section.id)" class="p-5">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      <div
                        v-for="field in visibleFieldsInSection(section.id)"
                        :key="field.fieldId"
                        class="space-y-1 group"
                      >
                        <label class="text-theme-xs text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                          {{ field.labelVI }}
                          <span
                            v-if="field.isAI"
                            class="text-[9px] font-black px-1 py-0.5 bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 rounded uppercase"
                          >AI</span>
                        </label>
                        <div
                          class="text-theme-sm text-gray-900 dark:text-white border-b border-transparent hover:border-gray-200 dark:hover:border-gray-700 py-1 transition-all"
                          :class="getFieldValue(field.fieldId) === '—' ? 'text-gray-300 dark:text-gray-600 italic' : ''"
                        >
                          <!-- Special rendering for specific field types -->
                          <template v-if="field.fieldId === 'general_amount'">
                            <span class="text-theme-xl font-semibold text-brand-500">{{ deal.value }}</span>
                          </template>
                          <template v-else-if="field.fieldId === 'general_probability'">
                            <div class="flex items-center gap-2">
                              <div class="h-2 w-20 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div class="h-full bg-brand-500 rounded-full" :style="{ width: `${deal.probability}%` }" />
                              </div>
                              <span class="font-semibold text-brand-500">{{ deal.probability }}%</span>
                            </div>
                          </template>
                          <template v-else-if="field.fieldId === 'general_close_date'">
                            <span class="inline-flex items-center gap-1 bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400 px-2 py-0.5 rounded-full text-theme-xs font-medium">
                              <span class="material-symbols-outlined text-[14px]">event</span>
                              {{ deal.endDate }}
                            </span>
                          </template>
                          <template v-else-if="field.fieldId === 'general_stage'">
                            <Badge class="bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">{{ currentStageLabel }}</Badge>
                          </template>
                          <template v-else>
                            {{ getFieldValue(field.fieldId) }}
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </section>

              <!-- Empty state if no sections -->
              <div v-if="fieldConfigStore.visibleSections.length === 0" class="text-center py-16 text-gray-400">
                <span class="material-symbols-outlined text-[48px] mb-3 block">visibility_off</span>
                <p class="text-theme-sm">Tất cả trường đã bị ẩn.</p>
                <button class="mt-3 text-brand-500 text-theme-sm hover:underline" @click="showFieldConfigModal = true">
                  Tuỳ chỉnh hiển thị
                </button>
              </div>
            </template>
          </template>

          <!-- Danh sách sản phẩm tab -->
          <template v-else-if="activeTab === 'products'">
            <div class="space-y-4">

              <!-- Header -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white">Danh sách sản phẩm</h3>
                  <span class="bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {{ dealProducts.length }}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  class="border-brand-300 dark:border-brand-500/50 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-theme-xs"
                  @click="handleAddProduct"
                >
                  <Plus class="mr-1 h-3.5 w-3.5" />
                  Thêm sản phẩm
                </Button>
              </div>

              <!-- Summary tiles -->
              <div class="grid grid-cols-3 gap-3">
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center shadow-theme-xs">
                  <p class="text-theme-xs text-gray-400 mb-1">Số loại SP</p>
                  <p class="text-theme-xl font-bold text-gray-900 dark:text-white">{{ dealProducts.length }}</p>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center shadow-theme-xs">
                  <p class="text-theme-xs text-gray-400 mb-1">Tạm tính</p>
                  <p class="text-theme-sm font-bold text-brand-500 leading-snug">{{ formatVND(productSubtotal) }}</p>
                </div>
                <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center shadow-theme-xs">
                  <p class="text-theme-xs text-gray-400 mb-1">Tổng thanh toán</p>
                  <p class="text-theme-sm font-bold text-success-600 dark:text-success-400 leading-snug">{{ formatVND(productTotal) }}</p>
                </div>
              </div>

              <!-- Product table -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-theme-xs overflow-hidden">

                <!-- Table header (desktop) -->
                <div class="hidden md:grid grid-cols-[2fr_1fr_80px_1fr_72px] gap-4 px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-theme-xs font-semibold uppercase tracking-wide text-gray-400">
                  <span>Sản phẩm</span>
                  <span class="text-right">Đơn giá</span>
                  <span class="text-center">SL / CK</span>
                  <span class="text-right">Thành tiền</span>
                  <span></span>
                </div>

                <!-- Rows -->
                <div class="divide-y divide-gray-100 dark:divide-gray-800">
                  <div
                    v-for="(product, idx) in dealProducts"
                    :key="product.id"
                    class="group px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <!-- Desktop -->
                    <div class="hidden md:grid grid-cols-[2fr_1fr_80px_1fr_72px] gap-4 items-start">
                      <!-- Name + description -->
                      <div class="min-w-0 space-y-0.5">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="text-theme-xs text-gray-400 font-medium shrink-0 tabular-nums">{{ idx + 1 }}.</span>
                          <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ product.name }}</p>
                          <span class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded font-medium">{{ product.category }}</span>
                        </div>
                        <p class="text-theme-xs text-gray-400 pl-4 leading-relaxed">{{ product.description }}</p>
                      </div>

                      <!-- Unit price -->
                      <div class="text-right pt-0.5 space-y-0.5">
                        <p class="text-theme-sm text-gray-700 dark:text-gray-300 tabular-nums">{{ formatVND(product.unitPrice) }}</p>
                        <p class="text-theme-xs text-gray-400">/ {{ product.unit }}</p>
                      </div>

                      <!-- Qty + discount -->
                      <div class="text-center pt-0.5 space-y-1">
                        <p class="text-theme-sm font-medium text-gray-900 dark:text-white tabular-nums">× {{ product.quantity }}</p>
                        <span
                          v-if="product.discountPct > 0"
                          class="inline-block text-[10px] bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400 px-1.5 py-0.5 rounded font-semibold"
                        >
                          -{{ product.discountPct }}%
                        </span>
                      </div>

                      <!-- Line total -->
                      <div class="text-right pt-0.5 space-y-0.5">
                        <p class="text-theme-sm font-semibold text-gray-900 dark:text-white tabular-nums">{{ formatVND(lineTotal(product)) }}</p>
                        <p
                          v-if="product.discountPct > 0"
                          class="text-theme-xs text-gray-400 line-through tabular-nums"
                        >
                          {{ formatVND(product.quantity * product.unitPrice) }}
                        </p>
                      </div>

                      <!-- Actions -->
                      <div class="flex items-center justify-end gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          class="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-gray-700 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil class="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          class="rounded-lg p-1.5 text-gray-400 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10 transition-colors"
                          title="Xóa"
                          @click="removeProduct(product.id)"
                        >
                          <Trash2 class="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <!-- Mobile -->
                    <div class="md:hidden space-y-1.5">
                      <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0">
                          <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ idx + 1 }}. {{ product.name }}</p>
                          <p class="text-theme-xs text-gray-400 mt-0.5">{{ product.description }}</p>
                        </div>
                        <div class="flex shrink-0 gap-0.5">
                          <button type="button" class="rounded-lg p-1.5 text-gray-400 hover:text-brand-500 transition-colors">
                            <Pencil class="h-3.5 w-3.5" />
                          </button>
                          <button type="button" class="rounded-lg p-1.5 text-gray-400 hover:text-error-500 transition-colors" @click="removeProduct(product.id)">
                            <Trash2 class="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div class="flex flex-wrap items-center gap-2 text-theme-xs text-gray-500">
                        <span class="tabular-nums">{{ product.quantity }} × {{ formatVND(product.unitPrice) }} / {{ product.unit }}</span>
                        <span v-if="product.discountPct > 0" class="bg-warning-50 dark:bg-warning-500/10 text-warning-600 dark:text-warning-400 px-1.5 py-0.5 rounded font-semibold">-{{ product.discountPct }}%</span>
                        <span class="ml-auto font-semibold text-gray-900 dark:text-white tabular-nums">= {{ formatVND(lineTotal(product)) }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Empty state -->
                  <div v-if="dealProducts.length === 0" class="px-5 py-14 text-center">
                    <span class="material-symbols-outlined text-[48px] text-gray-300 dark:text-gray-600 block mb-2">inventory_2</span>
                    <p class="text-theme-sm text-gray-400">Chưa có sản phẩm nào trong deal này</p>
                    <button type="button" class="mt-3 text-brand-500 text-theme-sm hover:underline" @click="handleAddProduct">
                      + Thêm sản phẩm đầu tiên
                    </button>
                  </div>
                </div>

                <!-- Add row -->
                <div v-if="dealProducts.length > 0" class="border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    class="w-full flex items-center justify-center gap-1.5 py-3 text-theme-xs text-gray-400 hover:text-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-500/5 transition-colors"
                    @click="handleAddProduct"
                  >
                    <Plus class="h-3.5 w-3.5" />
                    Thêm dòng sản phẩm
                  </button>
                </div>
              </div>

              <!-- Totals -->
              <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-theme-xs p-5">
                <div class="space-y-3 max-w-sm ml-auto">
                  <div class="flex justify-between items-center text-theme-sm">
                    <span class="text-gray-500">Tạm tính</span>
                    <span class="font-medium text-gray-900 dark:text-white tabular-nums">{{ formatVND(productSubtotal) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-theme-sm">
                    <span class="text-gray-500">Chiết khấu</span>
                    <span class="font-medium text-warning-600 dark:text-warning-400 tabular-nums">- {{ formatVND(productDiscount) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-theme-sm">
                    <span class="text-gray-500">Sau chiết khấu</span>
                    <span class="font-medium text-gray-700 dark:text-gray-300 tabular-nums">{{ formatVND(productSubtotal - productDiscount) }}</span>
                  </div>
                  <div class="flex justify-between items-center text-theme-sm">
                    <span class="text-gray-500">VAT (10%)</span>
                    <span class="font-medium text-gray-700 dark:text-gray-300 tabular-nums">{{ formatVND(productVAT) }}</span>
                  </div>
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
                    <span class="text-theme-sm font-semibold text-gray-900 dark:text-white">Tổng thanh toán</span>
                    <span class="text-theme-xl font-bold text-brand-500 tabular-nums">{{ formatVND(productTotal) }}</span>
                  </div>
                </div>
              </div>

            </div>
          </template>

          <!-- Hoạt động tab -->
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
                <span class="material-symbols-outlined text-[18px]">add</span>
                Thêm hoạt động
              </button>
            </div>
          </template>

          <!-- Lịch sử tab -->
          <template v-else-if="activeTab === 'history'">
            <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-theme-xs px-5 py-5">
              <!-- Header -->
              <div class="flex items-center justify-between mb-5">
                <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white">Lịch sử thay đổi</h3>
                <span class="text-theme-xs text-gray-400">{{ history.length }} thao tác</span>
              </div>

              <!-- Timeline -->
              <div>
                <div
                  v-for="(entry, idx) in history"
                  :key="entry.id"
                  class="flex gap-4"
                >
                  <!-- Avatar + connector line -->
                  <div class="flex flex-col items-center shrink-0">
                    <div
                      class="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                      :class="entry.userColor"
                    >
                      {{ entry.userInitial }}
                    </div>
                    <div
                      v-if="idx < history.length - 1"
                      class="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1.5 min-h-[24px]"
                    />
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0 pb-5" :class="{ 'pb-0': idx === history.length - 1 }">
                    <!-- Top row: user · time · badge -->
                    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                      <span class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ entry.user }}</span>
                      <span class="text-gray-300 dark:text-gray-600">·</span>
                      <span class="text-theme-xs text-gray-400">{{ entry.time }}</span>
                      <span
                        class="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        :class="HISTORY_BADGE[entry.type].cls"
                      >
                        {{ HISTORY_BADGE[entry.type].label }}
                      </span>
                    </div>

                    <!-- Description -->
                    <p class="text-theme-sm text-gray-700 dark:text-gray-300">{{ entry.description }}</p>

                    <!-- Field change: from → to -->
                    <div v-if="entry.from || entry.to" class="mt-2 flex flex-wrap items-center gap-2">
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
                  </div>
                </div>

                <!-- Empty state -->
                <div v-if="history.length === 0" class="text-center py-12 text-gray-400">
                  <span class="material-symbols-outlined text-[40px] block mb-2 text-gray-300">history</span>
                  <p class="text-theme-sm">Chưa có lịch sử thay đổi nào</p>
                </div>
              </div>
            </div>
          </template>

          <!-- Phụ lục tab -->
          <template v-else-if="activeTab === 'attachments'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                v-for="product in products"
                :key="product.name"
                class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-theme-xs"
              >
                <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</p>
                <p class="text-theme-xs text-gray-500 mt-0.5">{{ product.quantity }} × {{ product.price }}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Field Config Modal -->
    <DealFieldConfigModal v-model:open="showFieldConfigModal" />

    <!-- Add Activity Dialog -->
    <AddActivityDialog
      v-model:open="showActivityDialog"
      :initial-type="activityDialogInitialType"
      :contact-name="deal.contactName ?? undefined"
      @submitted="handleActivitySubmitted"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ArrowLeft, Flag, Mail, MessageSquare, Pencil, Phone, Plus, Save, SquareCheckBig, Trash2 } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { deleteDeal, getDealById, updateDeal } from '@/services/deals'
import { useDealFieldConfigStore } from '@/stores/useDealFieldConfigStore'
import { DEAL_FIELDS } from '@/types/dealFields'
import DealFieldConfigModal from '@/components/crm/DealFieldConfigModal.vue'
import AddActivityDialog from '@/components/crm/AddActivityDialog.vue'
import type { ActivitySubmitPayload } from '@/components/crm/AddActivityDialog.vue'
import ActivityItemCard from '@/components/crm/ActivityItemCard.vue'
import type { ActivityResultData, CardActivityItem } from '@/components/crm/ActivityItemCard.vue'
import { generateAiSuggestion } from '@/composables/useAiSuggestion'
import type { Deal, DealStage } from '@/types/deals'

interface StageItem {
  id: string
  label: string
  current?: boolean
  locked?: boolean
}


const route = useRoute()
const router = useRouter()
const loading = ref(true)
const dealData = ref<Deal | null>(null)
const showFieldConfigModal = ref(false)
const showActivityDialog = ref(false)
const activityDialogInitialType = ref('')
const localActivities = ref<CardActivityItem[]>([])
const deletedIds = ref<Set<string>>(new Set())
const activityOverrides = ref<Record<string, Partial<CardActivityItem>>>({})
const activeTab = ref('overview')
const expandedSections = ref<Set<string>>(new Set(['general', 'hotel', 'product']))

const fieldConfigStore = useDealFieldConfigStore()

const tabs = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'products', label: 'Danh sách sản phẩm' },
  { id: 'activity', label: 'Hoạt động' },
  { id: 'history', label: 'Lịch sử thay đổi' },
  { id: 'attachments', label: 'Phụ lục', count: dealData.value?.attachedDocumentsCount ?? 0 },
]

const stageLabel: Record<DealStage, string> = {
  new: 'Lead mới',
  preparing: 'Chuẩn bị',
  contacted: 'Đã liên hệ',
  negotiating: 'Đàm phán',
  quoted: 'Báo giá',
  won: 'Thành công',
  lost: 'Thất bại',
}

const STAGE_COLOR: Record<DealStage, string> = {
  new: '#64748B',
  preparing: '#3B82F6',
  contacted: '#06B6D4',
  negotiating: '#F59E0B',
  quoted: '#8B5CF6',
  won: '#10B981',
  lost: '#EF4444',
}

const stageOrder: DealStage[] = ['new', 'preparing', 'contacted', 'negotiating', 'quoted', 'won', 'lost']

const deal = computed(() => {
  const source = dealData.value
  const title = source?.title ?? 'Đang tải...'
  const amount = Number(source?.value ?? 0)

  function shortAmount(n: number): string {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}T`
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return n.toString()
  }

  const assignee = source?.assigneeId ?? '--'
  const closeDate = source?.expectedCloseDate

  return {
    code: source?.id?.slice(-8).toUpperCase() ?? '--------',
    title,
    updatedAt: source ? new Date(source.updatedAt).toLocaleString('vi-VN') : '--',
    updatedBy: assignee,
    value: `${amount.toLocaleString('vi-VN')} ₫`,
    shortValue: shortAmount(amount),
    probability: source?.probability ?? 0,
    owner: assignee,
    assigneeInitial: assignee.charAt(0).toUpperCase(),
    teamLeadName: source?.teamLeadName ?? null,
    endDate: closeDate ? new Date(closeDate).toLocaleDateString('vi-VN') : 'Chưa có',
    shortCloseDate: closeDate ? new Date(closeDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) : '--',
    customer: source?.companyName ?? source?.contactName ?? 'Chưa xác định',
    contactName: source?.contactName ?? null,
    source: source?.source ?? 'Organic',
    pipelineLabel: source?.pipelineId ?? 'Mặc định',
  }
})

const stages = computed<StageItem[]>(() => {
  const currentStage = dealData.value?.stage ?? 'new'
  return stageOrder.map((stage) => ({
    id: stage,
    label: stageLabel[stage],
    current: stage === currentStage,
    locked: stageOrder.indexOf(stage) > stageOrder.indexOf(currentStage),
  }))
})

const currentStageIndex = computed(() => {
  const currentStage = dealData.value?.stage ?? 'new'
  return stageOrder.indexOf(currentStage)
})

const currentStageLabel = computed(
  () => stages.value.find((s) => s.current)?.label ?? 'Chưa xác định',
)

const stageProgress = computed(() => {
  const idx = currentStageIndex.value
  const maxIdx = stageOrder.length - 2 // exclude 'lost'
  if (idx < 0) return 0
  return Math.round((idx / maxIdx) * 100)
})

// Mock field values for custom fields (real API will provide these)
const mockFieldValues: Record<string, string> = {
  hotel_city: 'Đà Nẵng',
  hotel_rooms: '185 phòng',
  hotel_name: 'Sunrise Beach Resort & Spa',
  hotel_address: 'Trường Sa, Hòa Hải, Ngũ Hành Sơn, Đà Nẵng',
  hotel_stars: '5 sao',
  hotel_manager: 'Lê Thu Hà',
  hotel_pms: 'Opera',
  hotel_type: 'Resort biển',
  hotel_website: 'sunrisebeachresort.vn',
  product_expected: 'ezCloudHotel, BE, CMS',
  product_demo_date: '20/11/2024',
  product_demo_done: 'Chưa',
  marketing_mkt_note: 'Khách hàng quan tâm giải pháp tự động hoá',
  marketing_channel: 'Facebook Ads',
  marketing_lead_form: 'Form đăng ký demo tháng 11',
  lead_sdr_status: 'Qualified',
  lead_sdr_call_date: '10/11/2024',
  assessment_health: 'Tốt',
  assessment_interest: '8.5/10',
  assessment_competitor: 'Traveloka Ads',
  assessment_ai_summary: 'Deal có tiềm năng cao, khách hàng quan tâm tính năng AI Automation.',
  meeting_date: '15/11/2024 09:00',
  meeting_type: 'Onsite tại văn phòng khách',
  meeting_result: 'Quan tâm cao, cần báo giá',
  contract_type: 'Hợp đồng Dịch vụ Trọn gói',
  payment_term: '50% trước, 50% khi go-live',
  payment_status: 'Chờ xác nhận',
  payment_date1: 'Chưa xác định',
  upsale_status: 'Chưa tiếp cận',
  lost_reason: '—',
  system_id: dealData.value?.id ?? '--',
  system_contact: dealData.value?.contactName ?? '--',
  system_company: dealData.value?.companyName ?? '--',
}

function getFieldValue(fieldId: string): string {
  const d = dealData.value
  if (!d) return '—'

  const standardValues: Record<string, () => string> = {
    general_deal_title: () => d.title,
    general_amount: () => `${Number(d.value).toLocaleString('vi-VN')} ₫`,
    general_probability: () => `${d.probability}%`,
    general_close_date: () => (d.expectedCloseDate ? new Date(d.expectedCloseDate).toLocaleDateString('vi-VN') : '—'),
    general_begin_date: () => new Date(d.createdAt).toLocaleDateString('vi-VN'),
    general_assigned_to: () => d.assigneeId,
    general_created_by: () => d.createdBy,
    general_modified_by: () => d.assigneeId,
    general_created_at: () => new Date(d.createdAt).toLocaleString('vi-VN'),
    general_updated_at: () => new Date(d.updatedAt).toLocaleString('vi-VN'),
    general_source: () => d.source ?? 'Organic',
    general_stage: () => stageLabel[d.stage],
    general_pipeline: () => d.pipelineId ?? 'Mặc định',
    system_id: () => d.id,
    system_contact: () => d.contactName ?? '—',
    system_company: () => d.companyName ?? '—',
  }

  return standardValues[fieldId]?.() ?? mockFieldValues[fieldId] ?? '—'
}

function visibleFieldsInSection(sectionId: string) {
  return DEAL_FIELDS.filter(
    (f) => f.sectionId === sectionId && fieldConfigStore.isVisible(f.fieldId),
  )
}

function toggleSection(sectionId: string): void {
  if (expandedSections.value.has(sectionId)) {
    expandedSections.value.delete(sectionId)
  } else {
    expandedSections.value.add(sectionId)
  }
}

function handleStageClick(stage: StageItem): void {
  if (!dealData.value || stage.current) return
  toast.info(`Chuyển sang giai đoạn: ${stage.label}`)
}

const aiReason = ref('Xác suất thành công tăng 15% nếu gửi báo giá trong 24h tới. Khách hàng đã xem tài liệu 3 lần.')

const products = ref([
  { name: 'Gói Marketing AI 360', quantity: 1, price: '250.000.000 ₫' },
  { name: 'Setup & Đào tạo', quantity: 1, price: '200.000.000 ₫' },
])

// ── Danh sách sản phẩm ────────────────────────────────────────

interface DealProduct {
  id: string
  name: string
  description: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  discountPct: number
}

const dealProducts = ref<DealProduct[]>([
  {
    id: 'p-1',
    name: 'Gói Marketing AI 360',
    description: 'Nền tảng AI tự động hoá marketing toàn diện — email, social, ads targeting',
    category: 'Phần mềm SaaS',
    quantity: 1,
    unit: 'gói/năm',
    unitPrice: 250_000_000,
    discountPct: 10,
  },
  {
    id: 'p-2',
    name: 'Setup & Đào tạo',
    description: 'Triển khai hệ thống, cấu hình và đào tạo đội ngũ trong 2 ngày',
    category: 'Dịch vụ',
    quantity: 1,
    unit: 'gói',
    unitPrice: 200_000_000,
    discountPct: 5,
  },
  {
    id: 'p-3',
    name: 'Hỗ trợ kỹ thuật Premium',
    description: 'Hỗ trợ 24/7, SLA 4h phản hồi, dedicated account manager',
    category: 'Dịch vụ',
    quantity: 12,
    unit: 'tháng',
    unitPrice: 5_000_000,
    discountPct: 0,
  },
])

function lineTotal(p: DealProduct): number {
  return p.quantity * p.unitPrice * (1 - p.discountPct / 100)
}

function formatVND(n: number): string {
  return n.toLocaleString('vi-VN') + ' ₫'
}

const productSubtotal = computed(() =>
  dealProducts.value.reduce((sum, p) => sum + p.quantity * p.unitPrice, 0),
)
const productDiscount = computed(() =>
  dealProducts.value.reduce((sum, p) => sum + p.quantity * p.unitPrice * (p.discountPct / 100), 0),
)
const productVAT = computed(() => (productSubtotal.value - productDiscount.value) * 0.1)
const productTotal = computed(() => productSubtotal.value - productDiscount.value + productVAT.value)

function handleAddProduct(): void {
  toast.info('Tính năng thêm sản phẩm đang phát triển')
}

function removeProduct(id: string): void {
  const idx = dealProducts.value.findIndex((p) => p.id === id)
  if (idx !== -1) {
    const name = dealProducts.value[idx].name
    dealProducts.value.splice(idx, 1)
    toast.success(`Đã xóa "${name}"`)
  }
}

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
  deal_linked:  { label: 'Liên kết',      cls: 'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400' },
  deleted:      { label: 'Xóa',           cls: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400' },
}

const history = ref<HistoryEntry[]>([
  {
    id: 'h-1',
    type: 'activity',
    description: 'Gửi Email báo giá cho khách hàng',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '10:30, Hôm nay',
  },
  {
    id: 'h-2',
    type: 'stage_change',
    description: 'Chuyển giai đoạn deal',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '16:15, Hôm qua',
    from: 'Đã liên hệ',
    to: 'Đàm phán',
  },
  {
    id: 'h-3',
    type: 'field_update',
    description: 'Cập nhật xác suất thành công',
    user: 'Trần Minh Quân',
    userInitial: 'Q',
    userColor: 'bg-success-500',
    time: '09:45, 14/11/2024',
    field: 'Xác suất',
    from: '60%',
    to: '75%',
  },
  {
    id: 'h-4',
    type: 'field_update',
    description: 'Cập nhật ngày đóng dự kiến',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '14:00, 13/11/2024',
    field: 'Ngày đóng',
    from: '30/11/2024',
    to: '15/12/2024',
  },
  {
    id: 'h-5',
    type: 'assigned',
    description: 'Phân công deal cho nhân viên',
    user: 'Lê Hoa Phương',
    userInitial: 'P',
    userColor: 'bg-warning-500',
    time: '11:20, 12/11/2024',
    from: 'Chưa phân công',
    to: 'Nguyễn Văn An',
  },
  {
    id: 'h-6',
    type: 'activity',
    description: 'Thêm liên hệ Minh Trần vào deal',
    user: 'Nguyễn Văn An',
    userInitial: 'A',
    userColor: 'bg-brand-500',
    time: '10:05, 12/11/2024',
  },
  {
    id: 'h-7',
    type: 'field_update',
    description: 'Cập nhật giá trị deal',
    user: 'Trần Minh Quân',
    userInitial: 'Q',
    userColor: 'bg-success-500',
    time: '15:00, 11/11/2024',
    field: 'Giá trị',
    from: '400.000.000 ₫',
    to: '450.000.000 ₫',
  },
  {
    id: 'h-8',
    type: 'created',
    description: 'Deal được tạo từ Lead',
    user: 'Hệ thống',
    userInitial: 'HT',
    userColor: 'bg-gray-400',
    time: '09:00, 11/11/2024',
  },
])

const timeline = ref<CardActivityItem[]>([
  {
    id: 't-1',
    title: 'Salio AI đề xuất',
    detail: 'Đã chuẩn bị bản nháp email follow-up cá nhân hóa cho quản lý.',
    time: 'Vừa xong',
    badge: 'AI',
    badgeClass: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300',
    type: 'email',
    subType: 'Nurturing',
    note: 'Đã chuẩn bị bản nháp email follow-up cá nhân hóa cho quản lý.',
    date: new Date().toISOString(),
    aiSuggestion:
      '✉️ Nội dung email follow-up gợi ý:\n\n' +
      'Chủ đề: Theo dõi — Đề xuất giải pháp cho [Công ty]\n\n' +
      '"Kính gửi [Tên],\n\nCảm ơn anh/chị đã dành thời gian xem xét đề xuất của chúng em. ' +
      'Em muốn theo dõi xem anh/chị có câu hỏi hoặc cần thêm thông tin gì không.\n\n' +
      'Em có thể sắp xếp một buổi call ngắn 15 phút để trao đổi thêm không ạ?\n\nTrân trọng"\n\n' +
      '💡 Email follow-up trong 24h sau khi báo giá tăng tỷ lệ phản hồi lên 30%.',
  },
  {
    id: 't-2',
    title: 'Đã gửi Email báo giá',
    detail: 'Trạng thái: Đã mở (2 lần)',
    time: '10:30 AM',
    badge: 'Email',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    type: 'email',
    subType: 'Email báo giá',
    note: 'Trạng thái: Đã mở (2 lần)',
    date: new Date().toISOString(),
    aiSuggestion:
      '🔥 Khách hàng đã mở email 2 lần — đang quan tâm!\n\n' +
      '📞 Gợi ý: Gọi điện ngay trong ngày hôm nay:\n\n' +
      '"Xin chào [Tên], em là [Sale] từ [Công ty]. ' +
      'Em gọi để theo dõi về đề xuất báo giá gửi hôm nay. ' +
      'Anh/chị đã xem qua rồi — có phần nào cần em giải thích thêm không ạ?"\n\n' +
      '💡 Đừng để quá 24h — cơ hội đang ở đỉnh điểm.',
  },
  {
    id: 't-3',
    title: 'Chuyển sang Đàm phán',
    detail: 'Giai đoạn đã được cập nhật từ Kanban.',
    time: 'Hôm qua, 04:15 PM',
    badge: 'Stage',
    badgeClass: 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300',
    type: 'other',
    note: 'Giai đoạn đã được cập nhật từ Kanban.',
    date: new Date(Date.now() - 86400000).toISOString(),
    aiSuggestion:
      '🤝 Deal đang ở giai đoạn Đàm phán:\n\n' +
      '✅ Checklist đàm phán hiệu quả:\n' +
      '• Xác định BATNA (phương án thay thế tốt nhất) của cả hai bên\n' +
      '• Chuẩn bị 2–3 phương án giá / gói khác nhau\n' +
      '• Tập trung vào value, không chỉ giá\n' +
      '• Đặt deadline rõ ràng: "Ưu đãi này áp dụng đến [ngày]"\n\n' +
      '💡 Khách hàng ở stage Đàm phán thường chốt trong vòng 7–14 ngày nếu được follow-up đúng cách.',
  },
])

const allActivities = computed<CardActivityItem[]>(() => [
  ...localActivities.value.filter((a) => !deletedIds.value.has(a.id)),
  ...timeline.value
    .filter((item) => !deletedIds.value.has(item.id))
    .map((item) => ({ ...item, ...(activityOverrides.value[item.id] ?? {}) })),
])

const quickActions = ref([
  { label: 'Ghi chú', icon: MessageSquare },
  { label: 'Tác vụ', icon: SquareCheckBig },
  { label: 'Email', icon: Mail },
  { label: 'Gọi điện', icon: Phone },
])

async function fetchDeal(): Promise<void> {
  loading.value = true
  const dealId = String(route.params.dealId)
  const result = await getDealById(dealId)
  loading.value = false

  if (!result.isSuccess) {
    toast.error(result.error || 'Không thể tải chi tiết deal')
    return
  }

  dealData.value = result.data

  if (result.data.activities && result.data.activities.length > 0) {
    const ctx = { name: result.data.contactName ?? result.data.title, company: result.data.companyName ?? '' }
    timeline.value = result.data.activities.map((act) => ({
      id: act.id,
      title: act.title,
      detail: act.metadata ? JSON.stringify(act.metadata) : '',
      time: new Date(act.createdAt).toLocaleString('vi-VN'),
      badge: act.type === 'stage_change' ? 'Stage' : act.type === 'created' ? 'Tạo mới' : 'Hoạt động',
      badgeClass:
        act.type === 'stage_change'
          ? 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300'
          : act.type === 'created'
            ? 'bg-success-50 text-success-500 dark:bg-success-500/15 dark:text-success-300'
            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
      type: act.type ?? 'other',
      note: '',
      date: act.createdAt,
      aiSuggestion: generateAiSuggestion(act.type ?? 'other', '', '', ctx),
    }))
  }
}

function handleSave(): void {
  if (!dealData.value) return

  void updateDeal(dealData.value.id, {
    title: dealData.value.title,
    probability: dealData.value.probability,
  }).then((result) => {
    if (!result.isSuccess) {
      toast.error(result.error)
      return
    }
    toast.success('Đã lưu thông tin deal')
    void fetchDeal()
  })
}

function handleDelete(): void {
  if (!dealData.value) return

  void deleteDeal(dealData.value.id).then((result) => {
    if (!result.isSuccess) {
      toast.error(result.error)
      return
    }
    toast.success('Đã xóa deal')
    void router.push('/crm-deals')
  })
}

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
  meeting: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
  note: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
  task: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
}

function handleActivitySubmitted(payload: ActivitySubmitPayload): void {
  const ctx = { name: deal.value.contactName ?? deal.value.title, company: deal.value.customer }
  const newItem: CardActivityItem = {
    id: `local-${Date.now()}`,
    title: payload.form.title || ACTIVITY_BADGE_MAP[payload.type] || 'Hoạt động',
    detail: [payload.subType ? `Loại: ${payload.subType}` : '', payload.form.note].filter(Boolean).join(' · '),
    time: new Date(payload.form.date).toLocaleString('vi-VN'),
    badge: ACTIVITY_BADGE_MAP[payload.type] ?? 'Hoạt động',
    badgeClass: ACTIVITY_BADGE_CLASS_MAP[payload.type] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    type: payload.type,
    subType: payload.subType,
    note: payload.form.note,
    date: payload.form.date,
    duration: payload.form.duration,
    aiSuggestion: generateAiSuggestion(payload.type, payload.subType, payload.form.note, ctx),
    isNew: true,
  }
  localActivities.value.unshift(newItem)
}

function onActivityUpdate(id: string, changes: Partial<CardActivityItem>): void {
  const localIdx = localActivities.value.findIndex((a) => a.id === id)
  if (localIdx !== -1) {
    localActivities.value[localIdx] = { ...localActivities.value[localIdx], ...changes }
    return
  }
  activityOverrides.value[id] = { ...(activityOverrides.value[id] ?? {}), ...changes }
}

function onActivityRemove(id: string): void {
  const localIdx = localActivities.value.findIndex((a) => a.id === id)
  if (localIdx !== -1) {
    localActivities.value.splice(localIdx, 1)
    return
  }
  deletedIds.value.add(id)
}

function onActivityResult(id: string, data: ActivityResultData): void {
  onActivityUpdate(id, {
    result: [data.outcome, data.note].filter(Boolean).join(' · '),
    isClosed: data.close,
  })
}

watch(showActivityDialog, (open) => {
  if (!open) activityDialogInitialType.value = ''
})

onMounted(() => {
  void fetchDeal()
})
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

/* Google Material Symbols font */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  vertical-align: middle;
  display: inline-block;
  line-height: 1;
  text-transform: none;
  white-space: nowrap;
}
</style>
