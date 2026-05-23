<template>
  <div class="flex h-full min-h-0 flex-col" @click="showDeliveryPipelineMenu = false">

    <!-- ─── Delivery Pipeline popup selector ─────────────────── -->
    <div class="shrink-0 flex items-center gap-2 px-4 pt-2 pb-1">
      <div class="relative">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-theme-xs transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          @click.stop="showDeliveryPipelineMenu = !showDeliveryPipelineMenu"
        >
          <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Delivery Pipeline</span>
          <span class="text-gray-300 dark:text-gray-600">›</span>
          <span>{{ deliveryPipelineTabs.find(t => t.id === deliveryPipelineTab)?.icon }}</span>
          <span class="font-semibold text-gray-900 dark:text-white">{{ deliveryPipelineTabs.find(t => t.id === deliveryPipelineTab)?.label }}</span>
          <ChevronDown
            class="h-3.5 w-3.5 text-gray-400 transition-transform duration-150"
            :class="showDeliveryPipelineMenu ? 'rotate-180' : ''"
          />
        </button>
        <!-- Popup dropdown -->
        <div
          v-if="showDeliveryPipelineMenu"
          class="absolute left-0 top-full z-30 mt-1 min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-theme-md dark:border-gray-700 dark:bg-gray-900"
          @click.stop
        >
          <button
            v-for="tab in deliveryPipelineTabs"
            :key="tab.id"
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="deliveryPipelineTab === tab.id
              ? 'font-semibold text-brand-600 dark:text-brand-400'
              : 'text-gray-700 dark:text-gray-300'"
            @click="deliveryPipelineTab = tab.id; showDeliveryPipelineMenu = false"
          >
            <span>{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
          <div class="my-1 border-t border-gray-100 dark:border-gray-700" />
          <button
            type="button"
            class="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            @click="openDeliverySettings()"
          >
            <Settings class="h-4 w-4" />
            Cài đặt pipeline
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Quick filter chips ─────────────────────────────────── -->
    <div class="shrink-0 flex items-center gap-1.5 overflow-x-auto px-4 pt-2 pb-0.5">
      <button
        v-for="f in QUICK_FILTERS"
        :key="f.id"
        type="button"
        class="shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-colors"
        :class="activeFilter === f.id
          ? 'bg-white text-gray-900 font-semibold ring-2 ring-gray-400 shadow-sm dark:bg-gray-700 dark:text-white dark:ring-gray-500'
          : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700'"
        @click="activeFilter = f.id"
      >{{ f.name }}</button>
    </div>

    <!-- ─── KPI row ─────────────────────────────────────────────── -->
    <div class="shrink-0 grid grid-cols-4 gap-3 px-4 pt-2">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="kpi-card rounded-xl border p-3 backdrop-blur-sm"
        :class="kpi.cardClass"
      >
        <p class="mb-1 text-xs font-medium" :class="kpi.labelClass ?? 'text-gray-500 dark:text-gray-400'">{{ kpi.label }}</p>
        <p class="text-xl font-semibold" :class="kpi.valueClass ?? 'text-gray-900 dark:text-white'">{{ kpi.value }}</p>
      </div>
    </div>

    <!-- ─── Search + Filter panel ───────────────────────────────── -->
    <div ref="deploySearchBarRef" class="relative shrink-0 px-2 pt-2">
      <!-- Search input row -->
      <div
        class="flex min-h-[36px] cursor-text items-center gap-1.5 rounded-xl border bg-white px-3 py-1.5 shadow-theme-xs transition-all dark:bg-gray-800"
        :class="showDeployFilterPanel ? 'border-brand-400 ring-1 ring-brand-200 dark:ring-brand-700' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
        @click="openDeployFilterPanel()"
      >
        <Search class="h-3.5 w-3.5 shrink-0 text-gray-400" />
        <!-- Active chips -->
        <div class="flex flex-1 flex-wrap items-center gap-1">
          <span
            v-for="chip in activeDeployFilterChips"
            :key="chip.key"
            class="flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
          >
            {{ chip.label }}
            <button
              type="button"
              class="hover:text-brand-800 dark:hover:text-brand-200"
              @click.stop="removeDeployFilter(chip.key)"
            ><X class="h-2.5 w-2.5" /></button>
          </span>
          <input
            ref="deploySearchInputRef"
            v-model="deployFilterText"
            placeholder="Tìm kiếm dự án triển khai..."
            class="min-w-[140px] flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
            @focus="openDeployFilterPanel()"
            @click.stop
          />
        </div>
        <!-- Filter icon + count -->
        <button
          type="button"
          class="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors"
          :class="hasDeployFilters
            ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700'"
          @click.stop="openDeployFilterPanel()"
        >
          <SlidersHorizontal class="h-3.5 w-3.5" />
          <span v-if="totalDeployFilterCount > 0" class="font-semibold">{{ totalDeployFilterCount }}</span>
        </button>
        <!-- Clear all -->
        <button
          v-if="hasDeployFilters"
          type="button"
          class="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
          @click.stop="clearDeployFilters()"
        ><X class="h-3.5 w-3.5" /></button>
      </div>

      <!-- Filter dropdown panel -->
      <div
        v-if="showDeployFilterPanel"
        class="absolute left-2 right-2 top-full z-[200] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xl dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex max-h-[480px]">

          <!-- Left: presets -->
          <div class="flex w-44 shrink-0 flex-col gap-0.5 border-r border-gray-100 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800/60">
            <p class="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Bộ lọc nhanh</p>
            <button
              v-for="p in DEPLOY_FILTER_PRESETS"
              :key="p.id"
              type="button"
              class="rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors"
              :class="activeDeployPreset === p.id
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-600 hover:bg-white hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200'"
              @click="applyDeployPreset(p.id)"
            >{{ p.name }}</button>
            <div class="mt-auto border-t border-gray-200 pt-2 dark:border-gray-700">
              <button
                type="button"
                class="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-error-500 transition-colors hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
                @click="clearDeployFilters()"
              >✕ Xóa bộ lọc</button>
            </div>
          </div>

          <!-- Right: filter fields grid -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="grid grid-cols-2 gap-x-4 gap-y-4">

              <!-- Giai đoạn (col-span-2) -->
              <div class="col-span-2">
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Giai đoạn</p>
                <div class="grid grid-cols-3 gap-x-2 gap-y-1">
                  <label
                    v-for="stg in DEPLOY_STAGES_LIST"
                    :key="stg.value"
                    class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <input type="checkbox" :value="stg.value" v-model="deployFilterStages" class="h-3.5 w-3.5 rounded border-gray-300 accent-brand-600" />
                    {{ stg.label }}
                  </label>
                </div>
              </div>

              <!-- Trạng thái / Loại -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Trạng thái</p>
                <div class="space-y-1">
                  <label class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                    <input type="checkbox" value="trial" v-model="deployFilterType" class="h-3.5 w-3.5 rounded border-gray-300 accent-brand-600" />
                    🧪 Dùng thử
                  </label>
                  <label class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700">
                    <input type="checkbox" value="direct" v-model="deployFilterType" class="h-3.5 w-3.5 rounded border-gray-300 accent-brand-600" />
                    🚀 Triển khai thẳng
                  </label>
                </div>
              </div>

              <!-- Ngày tạo -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Ngày tạo</p>
                <div class="space-y-1">
                  <label
                    v-for="opt in DEPLOY_DATE_RANGE_OPTIONS"
                    :key="opt.value"
                    class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <input type="radio" :value="opt.value" v-model="deployFilterDateRange" class="h-3.5 w-3.5 border-gray-300 accent-brand-600" />
                    {{ opt.label }}
                  </label>
                </div>
                <div class="mt-2 border-t border-gray-100 pt-2 dark:border-gray-700">
                  <p class="mb-1.5 text-xs text-gray-400 dark:text-gray-500">Hoặc chọn khoảng ngày:</p>
                  <div class="flex items-center gap-1.5">
                    <input type="date" v-model="deployFilterDateFrom" class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
                    <span class="shrink-0 text-xs text-gray-400">—</span>
                    <input type="date" v-model="deployFilterDateTo" class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </div>

              <!-- Khoảng ngày Deadline TK (col-span-2) -->
              <div class="col-span-2">
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Khoảng ngày Deadline TK</p>
                <div class="flex items-center gap-2">
                  <input type="date" v-model="deployFilterDeadlineFrom" class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
                  <span class="shrink-0 text-xs text-gray-400">đến</span>
                  <input type="date" v-model="deployFilterDeadlineTo" class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
                </div>
              </div>

              <!-- ID -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Mã dự án (ID)</p>
                <input v-model="deployFilterId" placeholder="Nhập ID dự án..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>

              <!-- Công ty -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Công ty / Khách hàng</p>
                <input v-model="deployFilterCompany" placeholder="Tìm theo tên công ty..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>

              <!-- SĐT -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Số điện thoại</p>
                <input v-model="deployFilterPhone" placeholder="Nhập số điện thoại..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>

              <!-- Email -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Email</p>
                <input v-model="deployFilterEmail" placeholder="Nhập địa chỉ email..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>

              <!-- Sales phụ trách -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Sales phụ trách</p>
                <input v-model="deployFilterSalesPerson" placeholder="Tìm theo tên sales..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>

              <!-- Phụ trách triển khai -->
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Phụ trách triển khai</p>
                <input v-model="deployFilterDeployPerson" placeholder="Tìm theo tên phụ trách..." class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none transition focus:border-brand-400 focus:ring-1 focus:ring-brand-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Legend (product only) ───────────────────────────────── -->
    <div v-if="activeDeliveryBaseType === 'product'" class="shrink-0 flex flex-wrap items-center gap-x-5 gap-y-1 px-4 pt-1.5 pb-0.5 text-[11px] text-gray-500 dark:text-gray-400">
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-1 w-5 rounded-full bg-warning-500"></span>
        🧪 Dùng thử
      </span>
      <span class="flex items-center gap-1.5">
        <span class="inline-block h-1 w-5 rounded-full bg-brand-500"></span>
        🚀 Triển khai thẳng
      </span>
      <span class="flex items-center gap-1 font-medium text-warning-600 dark:text-warning-400">
        <span class="tracking-widest opacity-60">- - -</span>
        Cột chỉ dành cho khách dùng thử
      </span>
    </div>

    <!-- ═══ KANBAN VIEW ═══════════════════════════════════════════ -->
    <div
      v-if="!props.viewMode || props.viewMode === 'kanban'"
      class="deploy-scrollbar flex-1 overflow-x-auto overflow-y-hidden p-2"
    >
      <div class="flex h-full gap-3" style="min-width: max-content">

        <div
          v-for="col in activeDeployColumns"
          :key="col.id"
          class="flex h-full w-[208px] shrink-0 flex-col overflow-hidden rounded-xl"
        >
          <!-- Column header -->
          <div
            class="flex items-center justify-between px-3 py-2.5"
            :style="{ background: col.color }"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-bold text-white">{{ col.name }}</span>
              <span class="rounded-full bg-white/25 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {{ getColCards(col.id).length }}
              </span>
            </div>
          </div>

          <!-- Trial-only label -->
          <div
            v-if="col.trialOnly"
            class="shrink-0 bg-white/90 px-2 py-0.5 text-center text-[9px] font-bold tracking-wide dark:bg-gray-900/90"
            :style="{ color: col.color }"
          >
            CHỈ DÀNH CHO KHÁCH DÙNG THỬ
          </div>

          <!-- Column body -->
          <div
            class="deploy-col-body deploy-scrollbar flex-1 overflow-y-auto p-2 rounded-b-xl transition-colors"
            :class="[
              col.trialOnly ? 'deploy-col-trial' : '',
              dragOverColId === col.id ? 'bg-brand-50 ring-2 ring-inset ring-brand-300 dark:bg-brand-900/20 dark:ring-brand-600' : '',
            ]"
            :style="col.trialOnly ? ({ '--trial-color': col.color } as Record<string, string>) : {}"
            @dragover="onDragOver($event, col.id)"
            @dragleave="onDragLeave($event, col.id)"
            @drop="onDrop($event, col.id)"
          >
            <!-- Cards -->
            <div
              v-for="card in getColCards(col.id)"
              :key="card.id"
              draggable="true"
              class="deploy-card mb-2 cursor-grab rounded-xl bg-white p-2.5 shadow-theme-xs transition-all hover:shadow-theme-md dark:bg-gray-800"
              :class="[
                card.type === 'trial' ? 'border-t-2 border-t-warning-400' : 'border-t-2 border-t-brand-500',
                draggingCardId === card.id ? 'opacity-40 scale-95' : '',
              ]"
              @dragstart="onDragStart($event, card.id)"
              @dragend="onDragEnd"
              @click="navigateToCard(card.id)"
            >
              <!-- Card header -->
              <div class="mb-1 flex items-start justify-between gap-1.5">
                <span class="line-clamp-2 text-[11px] font-bold leading-tight text-gray-900 dark:text-white">
                  {{ card.customerName }}
                </span>
                <span
                  class="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold"
                  :class="card.type === 'trial'
                    ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'"
                >
                  {{ card.type === 'trial' ? '🧪 Dùng thử' : '🚀 Trực tiếp' }}
                </span>
              </div>

              <p class="mb-2 text-[10px] text-gray-500 dark:text-gray-400">{{ card.contactName }}</p>

              <!-- Product tracks -->
              <div v-if="card.tracks && card.tracks.length > 0" class="space-y-1.5 border-t border-gray-100 pt-1.5 dark:border-gray-700">
                <div
                  v-for="track in card.tracks"
                  :key="track.product"
                  class="flex items-start gap-1"
                >
                  <span class="w-14 shrink-0 pt-0.5 text-[9px] font-semibold text-gray-600 dark:text-gray-400">
                    {{ track.product }}
                  </span>
                  <div class="flex flex-1 flex-wrap items-center gap-0.5">
                    <template v-for="(phase, pi) in track.phases" :key="pi">
                      <span v-if="pi > 0" class="text-[8px] text-gray-300 dark:text-gray-600">›</span>
                      <span
                        class="rounded px-1 py-0.5 text-[8px] font-bold leading-none"
                        :class="{
                          'bg-success-50 text-success-600 dark:bg-success-900/30 dark:text-success-400': phase.status === 'done',
                          'bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-400 dark:bg-brand-900/30 dark:text-brand-400': phase.status === 'active',
                          'bg-warning-50 text-warning-600 ring-1 ring-inset ring-warning-400 dark:bg-warning-900/30 dark:text-warning-400': phase.status === 'trial-active',
                          'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500': phase.status === 'waiting',
                        }"
                      >{{ phase.label }}</span>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Trial countdown -->
              <div
                v-if="card.trialDaysLeft !== undefined"
                class="mt-2 rounded-lg px-2 py-1 text-center text-[10px] font-bold"
                :class="card.trialDaysLeft <= 5
                  ? 'border border-error-200 bg-error-50 text-error-600 dark:border-error-800/40 dark:bg-error-900/20 dark:text-error-400'
                  : 'border border-warning-200 bg-warning-50 text-warning-600 dark:border-warning-800/40 dark:bg-warning-900/20 dark:text-warning-400'"
              >
                {{ card.trialDaysLeft <= 5 ? '⚠' : '⏳' }}
                {{ card.trialDaysLeft <= 0 ? 'Hết hạn dùng thử!' : `Còn ${card.trialDaysLeft} ngày dùng thử` }}
              </div>

              <!-- Converting banner -->
              <div
                v-if="card.isConverting"
                class="mt-2 rounded-lg border border-purple-300 bg-purple-50 px-2 py-1 text-center text-[10px] font-bold text-purple-700 dark:border-purple-700/50 dark:bg-purple-900/20 dark:text-purple-400"
              >
                ✍ Đang ký hợp đồng chính thức
              </div>

              <!-- Card footer -->
              <div class="mt-2 flex items-center justify-between">
                <div class="flex">
                  <div
                    v-for="(av, ai) in card.assignees"
                    :key="av.name"
                    class="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[7px] font-bold text-white ring-2 ring-white dark:ring-gray-800"
                    :class="{ '-ml-1.5': ai > 0 }"
                    :style="{ background: av.color }"
                    :title="av.name"
                  >{{ av.initials }}</div>
                </div>
                <span
                  class="text-[10px] font-bold tabular-nums"
                  :class="card.progress === 100
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-gray-500 dark:text-gray-400'"
                >
                  {{ card.progress }}%{{ card.progress === 100 ? ' ✓' : '' }}
                </span>
              </div>
            </div>

            <!-- Add card button -->
            <button
              type="button"
              class="flex w-full items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] text-gray-400 transition-colors hover:bg-white/60 hover:text-gray-600 dark:hover:bg-gray-700/60 dark:hover:text-gray-300"
              @click="openCreateDialog(col.id)"
            >
              <Plus class="h-3.5 w-3.5" />
              Thêm dự án
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══ LIST VIEW ════════════════════════════════════════════ -->
    <div
      v-else-if="props.viewMode === 'list'"
      class="deploy-scrollbar flex-1 overflow-auto px-4 py-3"
    >
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 dark:border-gray-700">
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Khách hàng</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Loại</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Sản phẩm</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Giai đoạn</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Phụ trách</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Tiến độ</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="card in allFilteredCards"
              :key="card.id"
              class="cursor-pointer border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50 dark:border-gray-700/50 dark:hover:bg-gray-700/30"
              @click="navigateToCard(card.id)"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span
                    class="inline-block h-2 w-0.5 rounded-full"
                    :style="{ background: card.type === 'trial' ? '#f79009' : '#465fff' }"
                  ></span>
                  <div>
                    <p class="text-[13px] font-semibold text-gray-900 dark:text-white">{{ card.customerName }}</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">{{ card.contactName }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                  :class="card.type === 'trial'
                    ? 'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400'
                    : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'"
                >
                  {{ card.type === 'trial' ? '🧪 Dùng thử' : '🚀 Trực tiếp' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="t in card.tracks"
                    :key="t.product"
                    class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                  >{{ t.product }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
                  :style="{ background: store.columnColor(card.columnId) }"
                >{{ store.columnName(card.columnId) }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex">
                  <div
                    v-for="(av, ai) in card.assignees"
                    :key="av.name"
                    class="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white ring-2 ring-white dark:ring-gray-800"
                    :class="{ '-ml-1.5': ai > 0 }"
                    :style="{ background: av.color }"
                    :title="av.name"
                  >{{ av.initials }}</div>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <div class="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="card.progress === 100 ? 'bg-success-500' : 'bg-brand-500'"
                      :style="{ width: `${card.progress}%` }"
                    />
                  </div>
                  <span
                    class="min-w-[2.5rem] text-right text-xs font-semibold tabular-nums"
                    :class="card.progress === 100
                      ? 'text-success-600 dark:text-success-400'
                      : 'text-gray-700 dark:text-gray-300'"
                  >{{ card.progress }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="allFilteredCards.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                Không có dự án nào phù hợp
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ═══ CALENDAR VIEW ══════════════════════════════════════ -->
    <div
      v-else-if="props.viewMode === 'calendar'"
      class="deploy-scrollbar flex-1 overflow-auto p-4"
    >
      <!-- Stats + filter bar -->
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div
            v-if="blockTaskCount > 0"
            class="flex items-center gap-1.5 rounded-xl bg-error-50 px-3 py-1.5 dark:bg-error-900/20"
          >
            <span class="h-2 w-2 rounded-full bg-error-500"></span>
            <span class="text-xs font-semibold text-error-600 dark:text-error-400">
              {{ blockTaskCount }} việc chặn (block)
            </span>
          </div>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            <span class="font-semibold text-gray-700 dark:text-gray-300">{{ pendingTaskCount }}</span>
            việc chưa hoàn thành
          </span>
        </div>
        <!-- Filter tabs -->
        <div class="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-800">
          <button
            v-for="f in DEPLOY_CALENDAR_FILTERS"
            :key="f.id"
            type="button"
            class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
            :class="calendarFilter === f.id
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="calendarFilter = f.id"
          >{{ f.name }}</button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="filteredCalendarTasks.length === 0"
        class="flex flex-col items-center justify-center gap-3 py-20 text-center"
      >
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 dark:bg-success-900/20">
          <CheckCircle2 class="h-7 w-7 text-success-500" />
        </div>
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">Không có việc nào!</p>
        <p class="text-xs text-gray-400 dark:text-gray-500">Không có công việc nào trong bộ lọc này</p>
      </div>

      <!-- Task list -->
      <div v-else class="space-y-2">
        <!-- Priority group headers -->
        <template v-for="group in calendarTaskGroups" :key="group.priority">
          <div
            v-if="group.tasks.length > 0"
            class="mb-1 mt-4 first:mt-0 flex items-center gap-2"
          >
            <span
              class="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
              :class="DEPLOY_PRIORITY_BADGE[group.priority]"
            >
              {{ DEPLOY_PRIORITY_ICON[group.priority] }}
              {{ DEPLOY_PRIORITY_LABEL[group.priority] }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              {{ group.tasks.length }} công việc
              · ≈ {{ group.tasks.reduce((s, t) => s + t.estimatedHours, 0) }}h
            </span>
            <div class="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
          </div>

          <div
            v-for="task in group.tasks"
            :key="task.id"
            class="group flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-theme-xs transition-all hover:shadow-theme-md dark:border-gray-700 dark:bg-gray-800"
            :class="[
              'border-l-[3px]',
              DEPLOY_PRIORITY_BORDER[task.priority],
              task.status === 'done' ? 'opacity-55' : '',
              selectedTaskKey?.taskId === task.id ? 'ring-2 ring-brand-300 dark:ring-brand-600' : '',
            ]"
            @click="openTaskDetail(task.cardId, task.id)"
          >
            <!-- Product badge -->
            <span class="shrink-0 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {{ task.product }}
            </span>

            <!-- Title + customer -->
            <div class="min-w-0 flex-1">
              <p
                class="truncate text-sm font-medium"
                :class="task.status === 'done'
                  ? 'text-gray-400 line-through dark:text-gray-500'
                  : 'text-gray-800 dark:text-gray-200'"
              >{{ task.title }}</p>
              <div class="mt-0.5 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                <button
                  type="button"
                  class="truncate font-medium text-brand-500 hover:underline dark:text-brand-400"
                  @click.stop="navigateToCard(task.cardId)"
                >{{ task.customerName }}</button>
                <span>·</span>
                <span
                  class="rounded px-1 py-0.5 text-[9px] font-semibold text-white"
                  :style="{ background: store.columnColor(task.columnId) }"
                >{{ store.columnName(task.columnId) }}</span>
              </div>
            </div>

            <!-- Estimated hours -->
            <div class="w-[64px] shrink-0 text-right">
              <p class="text-xs font-semibold text-gray-600 dark:text-gray-400">
                ≈ {{ task.estimatedHours }}h
              </p>
              <p class="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">ước tính</p>
            </div>

            <!-- Due date -->
            <div class="w-[96px] shrink-0 text-right">
              <p
                class="text-xs font-medium"
                :class="task.status === 'done'
                  ? 'text-gray-400 dark:text-gray-500'
                  : isOverdue(task.dueDate)
                    ? 'text-error-500'
                    : isCloseSoon(task.dueDate) ? 'text-warning-500' : 'text-gray-600 dark:text-gray-400'"
              >
                <CalendarDays class="mr-0.5 inline-block h-3 w-3" />
                {{ formatDueDate(task.dueDate) }}
              </p>
              <p
                class="mt-0.5 text-[10px]"
                :class="task.status === 'done'
                  ? 'text-gray-300 dark:text-gray-600'
                  : isOverdue(task.dueDate)
                    ? 'text-error-400'
                    : isCloseSoon(task.dueDate) ? 'text-warning-400' : 'text-gray-400 dark:text-gray-500'"
              >{{ task.status === 'done' ? 'Đã xong' : daysLabel(task.dueDate) }}</p>
            </div>

            <!-- Assignee -->
            <div class="flex w-[110px] shrink-0 items-center gap-1.5">
              <div
                v-if="task.assignee"
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white ring-2 ring-white dark:ring-gray-800"
                :style="{ background: task.assigneeColor }"
                :title="task.assignee"
              >{{ initials(task.assignee) }}</div>
              <span v-if="task.assignee" class="truncate text-xs text-gray-500 dark:text-gray-400">
                {{ task.assignee }}
              </span>
            </div>

            <!-- Status toggle -->
            <button
              type="button"
              class="shrink-0 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all"
              :class="task.status === 'done'
                ? 'border-success-300 bg-success-50 text-success-600 dark:border-success-600 dark:bg-success-900/20 dark:text-success-400'
                : 'border-gray-200 bg-white text-gray-500 hover:border-success-300 hover:bg-success-50 hover:text-success-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:border-success-600 dark:hover:bg-success-900/20 dark:hover:text-success-400'"
              @click.stop="toggleTaskDone(task.cardId, task.id, task.status)"
            >
              <span :class="[
                'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
                task.status === 'done'
                  ? 'border-success-500 bg-success-500'
                  : 'border-gray-300 bg-white dark:border-gray-500 dark:bg-transparent',
              ]">
                <Check v-if="task.status === 'done'" class="h-2.5 w-2.5 text-white" />
              </span>
              Đã xong
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- ═══ TASK DETAIL SHEET ══════════════════════════════════ -->
    <Sheet :open="!!selectedTaskKey" @update:open="(v) => { if (!v) selectedTaskKey = null }">
      <SheetContent side="right" class="flex w-[420px] flex-col gap-0 p-0 sm:max-w-[420px]">
        <template v-if="selectedSubTaskData">
          <!-- Header -->
          <SheetHeader class="shrink-0 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
            <div class="flex items-start gap-2.5">
              <span
                class="mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                :class="DEPLOY_PRIORITY_BADGE[selectedSubTaskData.subTask.priority]"
              >
                {{ DEPLOY_PRIORITY_ICON[selectedSubTaskData.subTask.priority] }}
                {{ DEPLOY_PRIORITY_LABEL[selectedSubTaskData.subTask.priority] }}
              </span>
              <SheetTitle class="text-sm font-semibold leading-snug text-gray-900 dark:text-white">
                {{ selectedSubTaskData.subTask.title }}
              </SheetTitle>
            </div>
          </SheetHeader>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4">

            <!-- Meta info -->
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Khách hàng</p>
                <button
                  type="button"
                  class="text-xs font-semibold text-brand-500 hover:underline dark:text-brand-400"
                  @click="navigateToCard(selectedSubTaskData.card.id); selectedTaskKey = null"
                >{{ selectedSubTaskData.card.customerName }}</button>
                <span
                  class="mt-1 block rounded px-1.5 py-0.5 text-[9px] font-semibold text-white w-fit"
                  :style="{ background: store.columnColor(selectedSubTaskData.card.columnId) }"
                >{{ store.columnName(selectedSubTaskData.card.columnId) }}</span>
              </div>
              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Sản phẩm</p>
                <span class="rounded bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {{ selectedSubTaskData.subTask.product }}
                </span>
              </div>
              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Deadline</p>
                <p
                  class="text-xs font-semibold"
                  :class="isOverdue(selectedSubTaskData.subTask.dueDate) ? 'text-error-500' : isCloseSoon(selectedSubTaskData.subTask.dueDate) ? 'text-warning-500' : 'text-gray-700 dark:text-gray-300'"
                >
                  <CalendarDays class="mr-0.5 inline-block h-3 w-3" />
                  {{ formatDueDate(selectedSubTaskData.subTask.dueDate) }}
                </p>
                <p class="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{{ daysLabel(selectedSubTaskData.subTask.dueDate) }}</p>
              </div>
              <div class="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-800/60">
                <p class="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Ước tính</p>
                <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">≈ {{ selectedSubTaskData.subTask.estimatedHours }}h</p>
                <p class="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">{{ selectedSubTaskData.subTask.assignee }}</p>
              </div>
            </div>

            <!-- Note -->
            <div v-if="selectedSubTaskData.subTask.note" class="rounded-xl border border-warning-200 bg-warning-50 px-3 py-2.5 dark:border-warning-800/40 dark:bg-warning-900/10">
              <p class="text-[10px] font-semibold uppercase tracking-wide text-warning-600 dark:text-warning-400 mb-1">Ghi chú</p>
              <p class="text-xs text-warning-700 dark:text-warning-300">{{ selectedSubTaskData.subTask.note }}</p>
            </div>

            <!-- Checklist -->
            <div>
              <!-- Header + progress -->
              <div class="mb-2 flex items-center justify-between">
                <p class="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Checklist
                  <span class="ml-1.5 text-gray-400 dark:text-gray-500 font-normal">
                    {{ selectedSubTaskData.subTask.checklist.filter(i => i.done).length }}/{{ selectedSubTaskData.subTask.checklist.length }}
                  </span>
                </p>
                <span
                  v-if="selectedSubTaskData.subTask.checklist.length > 0"
                  class="text-[11px] font-semibold"
                  :class="selectedSubTaskData.subTask.checklist.every(i => i.done) ? 'text-success-600 dark:text-success-400' : 'text-gray-500 dark:text-gray-400'"
                >
                  {{ Math.round(selectedSubTaskData.subTask.checklist.filter(i => i.done).length / selectedSubTaskData.subTask.checklist.length * 100) }}%
                </span>
              </div>

              <!-- Progress bar -->
              <div v-if="selectedSubTaskData.subTask.checklist.length > 0" class="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                <div
                  class="h-full rounded-full transition-all duration-300"
                  :class="selectedSubTaskData.subTask.checklist.every(i => i.done) ? 'bg-success-500' : 'bg-brand-500'"
                  :style="{ width: `${Math.round(selectedSubTaskData.subTask.checklist.filter(i => i.done).length / selectedSubTaskData.subTask.checklist.length * 100)}%` }"
                />
              </div>

              <!-- Empty checklist -->
              <p
                v-if="selectedSubTaskData.subTask.checklist.length === 0"
                class="rounded-xl border border-dashed border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500"
              >
                Chưa có checklist
              </p>

              <!-- Checklist items -->
              <div v-else class="space-y-1.5">
                <div
                  v-for="item in selectedSubTaskData.subTask.checklist"
                  :key="item.id"
                  class="flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                  @click="store.toggleChecklistItem(selectedSubTaskData!.card.id, selectedSubTaskData!.subTask.id, item.id)"
                >
                  <!-- Checkbox -->
                  <span
                    class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all"
                    :class="item.done
                      ? 'border-success-500 bg-success-500'
                      : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-transparent'"
                  >
                    <Check v-if="item.done" class="h-2.5 w-2.5 text-white" />
                  </span>

                  <!-- Label + meta -->
                  <div class="min-w-0 flex-1">
                    <p
                      class="text-sm leading-snug"
                      :class="item.done ? 'text-gray-400 line-through dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'"
                    >{{ item.label }}</p>
                    <div class="mt-0.5 flex items-center gap-2 text-[10px] text-gray-400 dark:text-gray-500">
                      <span v-if="item.assignee" class="flex items-center gap-0.5">
                        <span
                          class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-[7px] font-bold text-white"
                          :style="{ background: ASSIGNEE_COLORS[item.assignee] ?? '#6b7280' }"
                        >{{ initials(item.assignee) }}</span>
                        {{ item.assignee.split(' ').slice(-1)[0] }}
                      </span>
                      <span v-if="item.deadline" class="flex items-center gap-0.5">
                        <CalendarDays class="h-2.5 w-2.5" />
                        {{ formatDueDate(item.deadline) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="shrink-0 border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <button
              type="button"
              class="w-full flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-medium transition-all"
              :class="selectedSubTaskData.subTask.status === 'done'
                ? 'border-success-300 bg-success-50 text-success-600 dark:border-success-600 dark:bg-success-900/20 dark:text-success-400'
                : 'border-gray-200 bg-white text-gray-600 hover:border-success-300 hover:bg-success-50 hover:text-success-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'"
              @click="toggleTaskDone(selectedSubTaskData.card.id, selectedSubTaskData.subTask.id, selectedSubTaskData.subTask.status); selectedTaskKey = null"
            >
              <span
                class="flex h-4 w-4 items-center justify-center rounded-full border transition-all"
                :class="selectedSubTaskData.subTask.status === 'done' ? 'border-success-500 bg-success-500' : 'border-gray-300'"
              >
                <Check v-if="selectedSubTaskData.subTask.status === 'done'" class="h-2.5 w-2.5 text-white" />
              </span>
              Đánh dấu hoàn thành
            </button>
          </div>
        </template>
      </SheetContent>
    </Sheet>

    <!-- ═══ SETTINGS DIALOG ══════════════════════════════════════ -->
    <Dialog
      :open="showDeploySettings"
      @update:open="val => { showDeploySettings = val; deployColorPickerIdx = null; showAddDeployStageForm = false; deployShowAddFieldForm = false; if (!val) deploySettingsTab = 'stages' }"
    >
      <DialogContent class="sm:max-w-lg max-h-[85vh] overflow-y-auto" @click="deployColorPickerIdx = null">
        <DialogHeader>
          <DialogTitle class="text-base font-semibold text-gray-900 dark:text-white">Cài đặt Triển khai</DialogTitle>
          <DialogDescription class="sr-only">Quản lý giai đoạn và trường thông tin triển khai</DialogDescription>
        </DialogHeader>

        <!-- Tab switcher -->
        <div class="flex gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors"
            :class="deploySettingsTab === 'stages'
              ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="deploySettingsTab = 'stages'"
          >Giai đoạn</button>
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors"
            :class="deploySettingsTab === 'fields'
              ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="deploySettingsTab = 'fields'"
          >Trường thông tin</button>
          <button
            type="button"
            class="flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors"
            :class="deploySettingsTab === 'actions'
              ? 'bg-white text-gray-900 shadow-theme-xs dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
            @click="deploySettingsTab = 'actions'"
          >Hành động</button>
        </div>

        <!-- ─── Tab: Giai đoạn ────────────────────────────────── -->
        <div v-show="deploySettingsTab === 'stages'">

          <!-- Stage list -->
          <div class="max-h-[260px] space-y-1.5 overflow-y-auto py-1 pr-1">
            <div
              v-for="(stage, idx) in deployStageDraft"
              :key="stage.id"
              draggable="true"
              :class="[
                'flex items-center gap-2 rounded-lg border px-3 py-2 transition-all select-none',
                deployDragIdx === idx ? 'opacity-40' : '',
                deployDragOverIdx === idx && deployDragIdx !== idx
                  ? 'border-brand-400 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20'
                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50',
              ]"
              @dragstart="onDeployDragStart(idx)"
              @dragover="onDeployDragOver($event, idx)"
              @drop.prevent="onDeployDrop(idx)"
              @dragend="onDeployDragEnd"
            >
              <!-- Drag handle -->
              <GripVertical class="h-4 w-4 shrink-0 cursor-grab text-gray-300 dark:text-gray-600" />

              <!-- Color swatch + picker -->
              <div class="relative shrink-0">
                <button
                  type="button"
                  class="h-6 w-6 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200 transition-transform hover:scale-110 dark:border-gray-700 dark:ring-gray-600"
                  :style="{ background: stage.color }"
                  title="Chọn màu"
                  @click.stop="deployColorPickerIdx = deployColorPickerIdx === idx ? null : idx"
                />
                <transition name="fade">
                  <div
                    v-if="deployColorPickerIdx === idx"
                    class="absolute left-0 top-full z-20 mt-1.5 grid grid-cols-4 gap-1 rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-700 dark:bg-gray-900"
                    @click.stop
                  >
                    <button
                      v-for="c in STAGE_COLOR_PALETTE"
                      :key="c"
                      type="button"
                      class="h-5 w-5 rounded-full transition-transform hover:scale-125"
                      :style="{ background: c, outline: stage.color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }"
                      @click.stop="stage.color = c; deployColorPickerIdx = null"
                    />
                  </div>
                </transition>
              </div>

              <!-- Name input -->
              <input
                v-model="stage.name"
                class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                placeholder="Tên giai đoạn"
                maxlength="40"
                @keyup.enter="stage.name.trim() !== (deployStageOrigNames[stage.id] ?? '') && saveDeployStageName(stage)"
              />

              <!-- Trial-only toggle badge -->
              <button
                type="button"
                class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors"
                :class="stage.trialOnly
                  ? 'bg-warning-50 text-warning-600 ring-1 ring-warning-300 dark:bg-warning-900/20 dark:text-warning-400'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:hover:bg-gray-600'"
                :title="stage.trialOnly ? 'Chỉ dành cho dùng thử — bấm để bỏ' : 'Bấm để đánh dấu cột chỉ dành cho dùng thử'"
                @click.stop="stage.trialOnly = !stage.trialOnly"
              >{{ stage.trialOnly ? 'Dùng thử' : 'Tất cả' }}</button>

              <!-- Per-stage save -->
              <button
                v-if="stage.name.trim() && stage.name.trim() !== (deployStageOrigNames[stage.id] ?? '')"
                type="button"
                class="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-success-600 transition-colors hover:bg-success-50 dark:text-success-400 dark:hover:bg-success-900/20"
                @click.stop="saveDeployStageName(stage)"
              >✓ Lưu</button>

              <!-- Delete -->
              <button
                type="button"
                class="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-error-50 hover:text-error-500 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-error-900/20"
                :disabled="deployStageDraft.length <= 1"
                :title="deployStageDraft.length <= 1 ? 'Pipeline phải có ít nhất 1 giai đoạn' : 'Xóa giai đoạn'"
                @click="removeDeployStage(idx)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <!-- Add stage sub-form -->
          <div
            v-if="showAddDeployStageForm"
            class="rounded-xl border border-brand-200 bg-brand-50/60 p-3 space-y-3 dark:border-brand-700/60 dark:bg-brand-900/20"
            @click.stop
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Giai đoạn mới</p>
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tên giai đoạn</label>
              <input
                v-model="newDeployStageName"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                placeholder="VD: Đào tạo người dùng"
                maxlength="40"
                @keyup.enter="confirmAddDeployStage"
                @keyup.esc="showAddDeployStageForm = false; newDeployStageName = ''"
              />
            </div>
            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Vị trí</label>
              <select
                v-model="newDeployStagePosition"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="first">Đứng đầu tiên</option>
                <option v-for="s in deployStageDraft" :key="s.id" :value="s.id">Sau: {{ s.name || '(chưa đặt tên)' }}</option>
                <option value="last">Cuối danh sách</option>
              </select>
            </div>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                @click="showAddDeployStageForm = false; newDeployStageName = ''"
              >Hủy</button>
              <button
                v-if="newDeployStageName.trim()"
                type="button"
                class="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
                @click="confirmAddDeployStage"
              >Thêm</button>
            </div>
          </div>

          <!-- Add stage toggle button -->
          <button
            v-if="!showAddDeployStageForm"
            type="button"
            class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:text-brand-400"
            @click="showAddDeployStageForm = true; newDeployStagePosition = 'last'"
          >
            <Plus class="h-4 w-4" />
            Thêm giai đoạn mới
          </button>

          <DialogFooter class="gap-2">
            <Button variant="outline" @click="showDeploySettings = false; showAddDeployStageForm = false">Hủy</Button>
            <Button class="bg-brand-500 text-white hover:bg-brand-600" @click="saveDeployStages">Lưu thay đổi</Button>
          </DialogFooter>
        </div>

        <!-- ─── Tab: Trường thông tin ─────────────────────────── -->
        <div v-show="deploySettingsTab === 'fields'" class="space-y-3">

          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              v-model="deployFieldSearchQuery"
              placeholder="Tìm trường..."
              class="w-full rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-sm text-gray-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <!-- Field groups -->
          <div class="max-h-[320px] space-y-2 overflow-y-auto pr-1">
            <div v-for="group in deployFilteredFieldGroups" :key="group.section.id">

              <!-- Section header -->
              <div class="mb-1 flex items-center justify-between">
                <span class="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {{ group.section.name }}
                  <span class="ml-1 font-normal text-gray-400">({{ group.total }})</span>
                </span>
                <button
                  v-if="deployCustomFieldStore.customSections.some(s => s.id === group.section.id)"
                  type="button"
                  class="rounded p-0.5 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-500"
                  title="Xoá nhóm"
                  @click="deployCustomFieldStore.deleteSection(group.section.id)"
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
                <!-- Inline edit mode -->
                <template v-if="deployFieldEditingId === field.fieldId">
                  <input
                    v-model="deployFieldEditingLabel"
                    class="h-7 flex-1 rounded-md border border-brand-300 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-brand-100 dark:border-brand-600 dark:bg-gray-800 dark:text-white"
                    @keyup.enter="deploySaveFieldEdit(field.fieldId, false)"
                    @keyup.escape="deployCancelFieldEdit"
                    autofocus
                  />
                  <button type="button" class="rounded p-1 text-success-500 hover:bg-success-50" title="Lưu" @click="deploySaveFieldEdit(field.fieldId, false)">
                    <Check class="h-3.5 w-3.5" />
                  </button>
                  <button type="button" class="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Huỷ" @click="deployCancelFieldEdit">
                    <X class="h-3.5 w-3.5" />
                  </button>
                </template>

                <!-- Normal mode -->
                <template v-else-if="deployFieldDeleteConfirmId !== field.fieldId">
                  <span class="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {{ deployCustomFieldStore.getStaticLabel(field.fieldId, field.labelVI) }}
                  </span>
                  <span
                    v-if="deployCustomFieldStore.isStaticRequired(field.fieldId, !!field.required)"
                    class="shrink-0 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-500 dark:bg-brand-900/30"
                  >bắt buộc</span>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                    title="Sửa tên"
                    @click="deployStartEditField(field.fieldId, deployCustomFieldStore.getStaticLabel(field.fieldId, field.labelVI))"
                  ><Pencil class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 transition-colors"
                    :class="deployCustomFieldStore.isStaticRequired(field.fieldId, !!field.required)
                      ? 'text-error-500 hover:bg-error-50'
                      : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700'"
                    title="Bắt buộc"
                    @click="deployToggleFieldRequired(field.fieldId, false, deployCustomFieldStore.isStaticRequired(field.fieldId, !!field.required))"
                  ><Asterisk class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-500"
                    title="Xoá trường"
                    @click="deployStartDeleteField(field.fieldId)"
                  ><Trash2 class="h-3.5 w-3.5" /></button>
                </template>

                <!-- Delete confirmation -->
                <template v-else>
                  <span class="flex-1 text-xs text-error-600 dark:text-error-400">Xoá trường này?</span>
                  <button type="button" class="rounded px-2 py-0.5 text-xs font-medium bg-error-500 text-white hover:bg-error-600" @click="deployConfirmDeleteField(field.fieldId, false)">Xoá</button>
                  <button type="button" class="rounded px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" @click="deployCancelDeleteField">Huỷ</button>
                </template>
              </div>

              <!-- Custom fields -->
              <div
                v-for="field in group.customFields"
                :key="field.id"
                class="flex items-center gap-1.5 rounded-lg px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <!-- Inline edit mode -->
                <template v-if="deployFieldEditingId === field.id">
                  <input
                    v-model="deployFieldEditingLabel"
                    class="h-7 flex-1 rounded-md border border-brand-300 bg-white px-2 text-sm outline-none focus:ring-2 focus:ring-brand-100 dark:border-brand-600 dark:bg-gray-800 dark:text-white"
                    @keyup.enter="deploySaveFieldEdit(field.id, true)"
                    @keyup.escape="deployCancelFieldEdit"
                    autofocus
                  />
                  <button type="button" class="rounded p-1 text-success-500 hover:bg-success-50" title="Lưu" @click="deploySaveFieldEdit(field.id, true)">
                    <Check class="h-3.5 w-3.5" />
                  </button>
                  <button type="button" class="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" title="Huỷ" @click="deployCancelFieldEdit">
                    <X class="h-3.5 w-3.5" />
                  </button>
                </template>

                <!-- Normal mode -->
                <template v-else-if="deployFieldDeleteConfirmId !== field.id">
                  <span class="flex-1 text-sm text-gray-700 dark:text-gray-300">{{ field.label }}</span>
                  <span class="shrink-0 rounded-full bg-success-50 px-1.5 py-0.5 text-[10px] text-success-600 dark:bg-success-900/20">tuỳ chỉnh</span>
                  <span v-if="field.required" class="shrink-0 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-500 dark:bg-brand-900/30">bắt buộc</span>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                    title="Sửa tên"
                    @click="deployStartEditField(field.id, field.label)"
                  ><Pencil class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 transition-colors"
                    :class="field.required
                      ? 'text-error-500 hover:bg-error-50'
                      : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700'"
                    title="Bắt buộc"
                    @click="deployToggleFieldRequired(field.id, true, !!field.required)"
                  ><Asterisk class="h-3 w-3" /></button>
                  <button
                    type="button"
                    class="rounded p-1 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-500"
                    title="Xoá trường"
                    @click="deployStartDeleteField(field.id)"
                  ><Trash2 class="h-3.5 w-3.5" /></button>
                </template>

                <!-- Delete confirmation -->
                <template v-else>
                  <span class="flex-1 text-xs text-error-600 dark:text-error-400">Xoá trường này?</span>
                  <button type="button" class="rounded px-2 py-0.5 text-xs font-medium bg-error-500 text-white hover:bg-error-600" @click="deployConfirmDeleteField(field.id, true)">Xoá</button>
                  <button type="button" class="rounded px-2 py-0.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" @click="deployCancelDeleteField">Huỷ</button>
                </template>
              </div>
            </div>

            <p v-if="deployFilteredFieldGroups.length === 0" class="py-4 text-center text-sm text-gray-400">
              Không tìm thấy trường phù hợp
            </p>
          </div>

          <!-- Add field form -->
          <div
            v-if="deployShowAddFieldForm"
            class="space-y-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3 dark:border-brand-700/60 dark:bg-brand-900/20"
          >
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Trường mới</p>

            <div class="space-y-1">
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tên trường <span class="text-error-500">*</span></label>
              <input
                v-model="deployNewFieldLabel"
                placeholder="VD: Ghi chú nội bộ"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                @keyup.enter="deployAddCustomField"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Loại dữ liệu</label>
                <select
                  v-model="deployNewFieldType"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  @change="deployNewFieldOptions = []; deployNewFieldOptionInput = ''"
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
                  v-model="deployNewFieldSectionId"
                  class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  @change="deployNewFieldIsNewSection = deployNewFieldSectionId === '__new__'"
                >
                  <option value="" disabled>Chọn nhóm...</option>
                  <option v-for="s in deployAllSectionsForFields" :key="s.id" :value="s.id">{{ s.name }}</option>
                  <option value="__new__">+ Tạo nhóm mới...</option>
                </select>
              </div>
            </div>

            <!-- Type hint panel -->
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-800/60">
              <div class="mb-1 flex items-center gap-1.5">
                <component :is="DEPLOY_FIELD_TYPE_HINTS[deployNewFieldType].icon" class="h-3.5 w-3.5 text-brand-500" />
                <span class="text-xs font-semibold text-gray-700 dark:text-gray-200">{{ DEPLOY_FIELD_TYPE_HINTS[deployNewFieldType].label }}</span>
              </div>
              <p class="mb-2 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{{ DEPLOY_FIELD_TYPE_HINTS[deployNewFieldType].desc }}</p>
              <div class="flex flex-wrap gap-1">
                <button
                  v-for="ex in DEPLOY_FIELD_TYPE_HINTS[deployNewFieldType].examples"
                  :key="ex"
                  type="button"
                  class="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] text-gray-500 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-brand-400"
                  :title="`Dùng '${ex}' làm tên trường`"
                  @click="deployNewFieldLabel = !deployNewFieldLabel.trim() ? ex : deployNewFieldLabel"
                >{{ ex }}</button>
              </div>

              <!-- Options editor for list types -->
              <template v-if="deployNewFieldType === 'single_select' || deployNewFieldType === 'multi_select'">
                <div class="mt-2.5 border-t border-gray-200 pt-2.5 dark:border-gray-700">
                  <div class="mb-1.5 flex items-center justify-between">
                    <label class="text-[11px] font-medium text-gray-600 dark:text-gray-400">
                      Các lựa chọn
                      <span v-if="deployNewFieldOptions.length" class="ml-1 text-gray-400">({{ deployNewFieldOptions.length }})</span>
                    </label>
                  </div>
                  <div v-if="deployNewFieldOptions.length" class="mb-1.5 flex flex-wrap gap-1">
                    <span
                      v-for="(opt, i) in deployNewFieldOptions"
                      :key="i"
                      class="flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] text-brand-600 dark:bg-brand-900/30 dark:text-brand-400"
                    >
                      {{ opt }}
                      <button type="button" class="text-brand-400 hover:text-brand-700 dark:hover:text-brand-300" @click="deployNewFieldOptions.splice(i, 1)">
                        <X class="h-2.5 w-2.5" />
                      </button>
                    </span>
                  </div>
                  <div class="flex gap-1.5">
                    <input
                      v-model="deployNewFieldOptionInput"
                      placeholder="Thêm lựa chọn và nhấn Enter..."
                      class="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      @keyup.enter="deployAddFieldOptionTag"
                      @keydown.comma.prevent="deployAddFieldOptionTag"
                    />
                    <button
                      type="button"
                      class="rounded-md bg-brand-500 px-2 py-1 text-xs text-white hover:bg-brand-600"
                      @click="deployAddFieldOptionTag"
                    ><Plus class="h-3 w-3" /></button>
                  </div>
                </div>
              </template>
            </div>

            <div v-if="deployNewFieldIsNewSection" class="space-y-1">
              <label class="text-xs font-medium text-gray-700 dark:text-gray-300">Tên nhóm mới <span class="text-error-500">*</span></label>
              <input
                v-model="deployNewFieldNewSectionName"
                placeholder="VD: Thông tin bổ sung"
                class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                @click="deployShowAddFieldForm = false; deployNewFieldLabel = ''; deployNewFieldIsNewSection = false"
              >Huỷ</button>
              <button
                type="button"
                class="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
                :disabled="!deployNewFieldLabel.trim() || (!deployNewFieldSectionId && !deployNewFieldIsNewSection) || (deployNewFieldIsNewSection && !deployNewFieldNewSectionName.trim())"
                @click="deployAddCustomField"
              >Thêm trường</button>
            </div>
          </div>

          <!-- Toggle add button -->
          <button
            v-if="!deployShowAddFieldForm"
            type="button"
            class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:text-brand-400"
            @click="deployShowAddFieldForm = true"
          >
            <Plus class="h-4 w-4" />
            Thêm trường thông tin mới
          </button>

          <DialogFooter>
            <Button variant="outline" @click="showDeploySettings = false">Đóng</Button>
          </DialogFooter>
        </div>

        <!-- ─── Tab: Hành động ────────────────────────────────── -->
        <div v-show="deploySettingsTab === 'actions'">
          <ActionSettingsPanel module="deploy" />
          <DialogFooter class="mt-4">
            <Button variant="outline" @click="showDeploySettings = false">Đóng</Button>
          </DialogFooter>
        </div>

      </DialogContent>
    </Dialog>

    <!-- ═══ CREATE DIALOG ════════════════════════════════════════ -->
    <Dialog v-model:open="showDialog">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo {{ activeDeliveryBaseType === 'project' ? 'dự án' : activeDeliveryBaseType === 'service' ? 'yêu cầu dịch vụ' : 'dự án triển khai' }} mới</DialogTitle>
        </DialogHeader>

        <form class="mt-1 space-y-4" @submit.prevent="saveCard">

          <!-- Customer name -->
          <div class="space-y-1.5">
            <Label>Tên khách hàng <span class="text-error-500">*</span></Label>
            <Input v-model="form.customerName" placeholder="Tên khách hàng / khách sạn" />
          </div>

          <!-- Contact name -->
          <div class="space-y-1.5">
            <Label>Người liên hệ</Label>
            <Input v-model="form.contactName" placeholder="Tên người liên hệ" />
          </div>

          <!-- Deployment type (product pipeline only) -->
          <div v-if="activeDeliveryBaseType === 'product'" class="space-y-1.5">
            <Label>Loại triển khai</Label>
            <div class="flex gap-3">
              <label
                class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-colors"
                :class="form.type === 'trial'
                  ? 'border-warning-400 bg-warning-50 dark:border-warning-600 dark:bg-warning-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
              >
                <input v-model="form.type" type="radio" value="trial" class="hidden" />
                <span class="text-sm font-semibold" :class="form.type === 'trial' ? 'text-warning-700 dark:text-warning-400' : 'text-gray-500 dark:text-gray-400'">
                  🧪 Dùng thử trước
                </span>
              </label>
              <label
                class="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-colors"
                :class="form.type === 'direct'
                  ? 'border-brand-400 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'"
              >
                <input v-model="form.type" type="radio" value="direct" class="hidden" />
                <span class="text-sm font-semibold" :class="form.type === 'direct' ? 'text-brand-700 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'">
                  🚀 Triển khai thẳng
                </span>
              </label>
            </div>
          </div>

          <!-- Trial dates (conditional) -->
          <template v-if="activeDeliveryBaseType === 'product' && form.type === 'trial'">
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label>Ngày bắt đầu dùng thử</Label>
                <Input v-model="form.trialStartDate" type="date" />
              </div>
              <div class="space-y-1.5">
                <Label>Ngày kết thúc dùng thử</Label>
                <Input v-model="form.trialEndDate" type="date" />
              </div>
            </div>
          </template>

          <!-- Products (product pipeline only) -->
          <div v-if="activeDeliveryBaseType === 'product'" class="space-y-1.5">
            <Label>Sản phẩm triển khai</Label>
            <div class="grid grid-cols-3 gap-2">
              <label
                v-for="p in PRODUCTS"
                :key="p"
                class="flex cursor-pointer items-center justify-center rounded-lg border px-2.5 py-2 text-[12px] font-medium transition-colors"
                :class="form.products.includes(p)
                  ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/20 dark:text-brand-300'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'"
              >
                <input
                  type="checkbox"
                  class="hidden"
                  :checked="form.products.includes(p)"
                  @change="toggleProduct(p)"
                />
                {{ p }}
              </label>
            </div>
          </div>

          <!-- Stage / Column -->
          <div class="space-y-1.5">
            <Label>Giai đoạn hiện tại</Label>
            <Select v-model="form.columnId">
              <SelectTrigger>
                <SelectValue placeholder="Chọn giai đoạn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="col in availableColumns"
                  :key="col.id"
                  :value="col.id"
                >{{ col.name }}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Assignee -->
          <div class="space-y-1.5">
            <Label>Nhân viên phụ trách</Label>
            <Input v-model="form.assigneeName" placeholder="Tên nhân viên" />
          </div>

          <!-- Notes -->
          <div class="space-y-1.5">
            <Label>Ghi chú</Label>
            <Textarea v-model="form.notes" placeholder="Ghi chú thêm..." :rows="2" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" @click="showDialog = false">Hủy</Button>
            <Button type="submit" class="bg-brand-500 hover:bg-brand-600 text-white">
              Tạo dự án
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  </div>

    <!-- ─── Delivery Pipeline Settings Dialog ───────────────── -->
    <Dialog v-model:open="showDeliverySettingsDialog">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>Cài đặt Delivery Pipeline</DialogTitle>
          <DialogDescription>Sửa tên, nhân bản hoặc xoá pipeline.</DialogDescription>
        </DialogHeader>

        <div class="space-y-1.5">
          <div
            v-for="tab in deliveryPipelineTabs"
            :key="tab.id"
            class="rounded-lg border px-3 py-2 transition-colors"
            :class="deliveryDeleteId === tab.id && deliveryDeletePhase === 'confirm'
              ? 'flex flex-col gap-2 border-error-400 bg-error-50 dark:border-error-600 dark:bg-error-900/20'
              : deliveryDeleteId === tab.id && deliveryDeletePhase === 'countdown'
                ? 'flex items-center gap-2 border-error-300 bg-error-50/60 dark:border-error-700 dark:bg-error-900/10'
                : 'flex items-center gap-2 border-gray-200 dark:border-gray-700'"
          >
            <!-- Đang edit -->
            <template v-if="deliveryEditingId === tab.id">
              <Input
                v-model="deliveryEditingLabel"
                class="h-7 flex-1 text-sm"
                @keyup.enter="saveEditDelivery"
                @keyup.escape="cancelEditDelivery"
                autofocus
              />
              <button type="button" class="rounded p-1 text-success-500 hover:bg-success-50" title="Lưu" @click="saveEditDelivery">
                <Check class="h-4 w-4" />
              </button>
              <button type="button" class="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800" title="Huỷ" @click="cancelEditDelivery">
                <X class="h-4 w-4" />
              </button>
            </template>

            <!-- Xác nhận xoá -->
            <template v-else-if="deliveryDeleteId === tab.id && deliveryDeletePhase === 'confirm'">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <AlertTriangle class="h-4 w-4 shrink-0 text-error-500" />
                  <span class="text-sm font-semibold text-error-700 dark:text-error-400">Xoá pipeline "{{ tab.label }}"</span>
                </div>
                <button type="button" class="rounded px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 transition-colors" @click="cancelDeleteDelivery">Huỷ</button>
              </div>
              <div class="rounded-lg border border-error-300 bg-error-100 px-3 py-2.5 dark:border-error-700 dark:bg-error-900/40">
                <div class="flex items-start gap-2">
                  <AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-error-600 dark:text-error-400" />
                  <div class="space-y-1">
                    <p class="text-xs font-bold uppercase tracking-wide text-error-700 dark:text-error-300">⚠ Cảnh báo không thể hoàn tác</p>
                    <p class="text-xs text-error-700 dark:text-error-300">
                      Toàn bộ <strong>dự án, lịch sử hoạt động và dữ liệu liên quan</strong> trong pipeline này sẽ bị
                      <strong>xoá vĩnh viễn</strong>. Hành động này <strong>KHÔNG THỂ khôi phục</strong> sau khi thực hiện.
                    </p>
                  </div>
                </div>
              </div>
              <button type="button" class="flex w-full items-center justify-center gap-2 rounded-lg bg-error-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-error-700 active:bg-error-800" @click="confirmDeleteDelivery">
                <Trash2 class="h-4 w-4" />
                Tôi hiểu, tiến hành xoá pipeline này
              </button>
            </template>

            <!-- Đếm ngược xoá -->
            <template v-else-if="deliveryDeleteId === tab.id && deliveryDeletePhase === 'countdown'">
              <Loader2 class="h-4 w-4 shrink-0 animate-spin text-error-500" />
              <span class="flex-1 text-sm text-error-600 dark:text-error-400">
                Sẽ xoá sau <strong>{{ deliveryDeleteCountdown }}s</strong>...
              </span>
              <button type="button" class="rounded px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 transition-colors" @click="cancelDeleteDelivery">Huỷ</button>
            </template>

            <!-- Hiển thị thường -->
            <template v-else>
              <span class="text-lg leading-none">{{ tab.icon }}</span>
              <span
                class="h-2 w-2 shrink-0 rounded-full"
                :class="deliveryPipelineTab === tab.id ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'"
              />
              <span class="flex-1 text-sm text-gray-800 dark:text-gray-200">{{ tab.label }}</span>
              <button type="button" class="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800" title="Sửa" @click="startEditDelivery(tab)">
                <Pencil class="h-3.5 w-3.5" />
              </button>
              <button type="button" class="rounded p-1 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-500 dark:hover:bg-brand-900/20" title="Nhân bản" @click="duplicateDelivery(tab)">
                <Copy class="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                class="rounded p-1 text-gray-400 transition-colors hover:bg-error-50 hover:text-error-500 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Xoá"
                :disabled="deliveryPipelineTabs.length <= 1"
                @click="startDeleteDelivery(tab.id)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </template>
          </div>
        </div>

        <!-- Thêm pipeline mới -->
        <div class="mt-4 space-y-2.5 rounded-xl border border-dashed border-gray-200 p-3 dark:border-gray-700">
          <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Thêm pipeline mới</p>

          <!-- Chọn loại pipeline -->
          <div class="flex gap-1.5">
            <button
              v-for="opt in ([{ id: 'product', label: 'Product', icon: '📦' }, { id: 'project', label: 'Project', icon: '🏗️' }, { id: 'service', label: 'Service', icon: '🔧' }] as const)"
              :key="opt.id"
              type="button"
              class="flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors"
              :class="newDeliveryPipelineBase === opt.id
                ? 'border-brand-400 bg-brand-50 text-brand-600 dark:border-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600'"
              @click="newDeliveryPipelineBase = opt.id"
            >
              <span>{{ opt.icon }}</span>{{ opt.label }}
            </button>
          </div>

          <!-- Input tên + nút Thêm -->
          <div class="flex gap-2">
            <Input
              v-model="newDeliveryPipelineName"
              placeholder="Tên pipeline mới..."
              class="flex-1 text-sm"
              @keyup.enter="addNewDeliveryPipeline"
            />
            <Button
              type="button"
              size="sm"
              :disabled="!newDeliveryPipelineName.trim()"
              @click="addNewDeliveryPipeline"
            >
              <Plus class="mr-1.5 h-4 w-4" />
              Thêm
            </Button>
          </div>
        </div>

        <DialogFooter class="mt-4">
          <Button variant="outline" @click="showDeliverySettingsDialog = false">Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, Plus, CalendarDays, Check, CheckCircle2, SlidersHorizontal, GripVertical, Pencil, Trash2, Asterisk, AlignLeft, Hash, ListChecks, CircleDot, ChevronDown, AlertTriangle, Loader2, Copy, Settings } from 'lucide-vue-next'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toast } from 'vue-sonner'
import {
  useDeploymentStore,
  DEPLOY_COLUMNS,
  PRODUCTS,
  type DeployType,
  type DeployCard,
  type DeployColumn,
  type DeployAssignee,
  type DeployPhase,
  type SubTaskPriority,
  type SubTaskStatus,
} from '@/stores/useDeploymentStore'
import { useDeployCustomFieldStore } from '@/stores/useDeployCustomFieldStore'

// ─── Delivery Pipeline tabs ───────────────────────────────────

type DeliveryPipelineTab = string

interface DeliveryPipelineTabDef {
  id: string
  label: string
  icon: string
  baseType: 'product' | 'project' | 'service'
}

const deliveryPipelineTabs = ref<DeliveryPipelineTabDef[]>([
  { id: 'product', label: 'Product', icon: '📦', baseType: 'product' },
  { id: 'project', label: 'Project', icon: '🏗️', baseType: 'project' },
  { id: 'service', label: 'Service', icon: '🔧', baseType: 'service' },
])

interface SimplePipelineCol { id: string; name: string; color: string; trialOnly: boolean }

const PROJECT_COLUMNS: SimplePipelineCol[] = [
  { id: 'proj_kickoff',  name: '🚀 Khởi động',           color: '#6554c0', trialOnly: false },
  { id: 'proj_analysis', name: '📐 Phân tích & Thiết kế', color: '#3450cc', trialOnly: false },
  { id: 'proj_dev',      name: '⚙️ Phát triển',           color: '#0284c7', trialOnly: false },
  { id: 'proj_testing',  name: '🧪 Kiểm thử UAT',         color: '#f79009', trialOnly: false },
  { id: 'proj_golive',   name: '🌐 Go-live',               color: '#f59e0b', trialOnly: false },
  { id: 'proj_closed',   name: '✅ Bàn giao',              color: '#059669', trialOnly: false },
]

const SERVICE_COLUMNS: SimplePipelineCol[] = [
  { id: 'svc_intake',   name: '📥 Tiếp nhận',       color: '#42526e', trialOnly: false },
  { id: 'svc_assess',   name: '🔍 Đánh giá',         color: '#3450cc', trialOnly: false },
  { id: 'svc_process',  name: '⚙️ Đang xử lý',       color: '#6554c0', trialOnly: false },
  { id: 'svc_waiting',  name: '⏳ Chờ xác nhận',     color: '#f79009', trialOnly: false },
  { id: 'svc_done',     name: '✅ Hoàn thành',        color: '#059669', trialOnly: false },
  { id: 'svc_maintain', name: '🔄 Bảo trì',           color: '#0ea5e9', trialOnly: false },
]
import type { CustomFieldType } from '@/stores/useDeployCustomFieldStore'
import { DEPLOY_SECTIONS, DEPLOY_FIELDS } from '@/types/deployFields'
import ActionSettingsPanel from '@/components/crm/ActionSettingsPanel.vue'

// ─── Props ────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  viewMode?: 'kanban' | 'list' | 'calendar'
}>(), {
  viewMode: 'kanban',
})

// ─── Store & Router ───────────────────────────────────────────

const router = useRouter()
const store  = useDeploymentStore()
const deployCustomFieldStore = useDeployCustomFieldStore()

// ─── Constants ────────────────────────────────────────────────

const QUICK_FILTERS = [
  { id: 'all',       name: 'Tất cả' },
  { id: 'mine',      name: 'Của tôi' },
  { id: 'trial',     name: '🧪 Đang dùng thử' },
  { id: 'deploying', name: '🔧 Đang triển khai' },
  { id: 'overdue',   name: '⚠ Sắp hết hạn' },
] as const

type DeployCalendarFilterId = 'all' | 'block' | 'high' | 'medium' | 'low' | 'pending'

const DEPLOY_CALENDAR_FILTERS: { id: DeployCalendarFilterId; name: string }[] = [
  { id: 'all',     name: 'Tất cả' },
  { id: 'pending', name: '⏳ Chưa xong' },
  { id: 'block',   name: '🔴 Block' },
  { id: 'high',    name: '🟠 Cao' },
  { id: 'medium',  name: '🟡 Trung bình' },
  { id: 'low',     name: '⚪ Thấp' },
]

const DEPLOY_PRIORITY_LABEL: Record<SubTaskPriority, string> = {
  block:  'Block',
  high:   'Cao',
  medium: 'Trung bình',
  low:    'Thấp',
}

const DEPLOY_PRIORITY_ICON: Record<SubTaskPriority, string> = {
  block:  '🔴',
  high:   '🟠',
  medium: '🟡',
  low:    '⚪',
}

const DEPLOY_PRIORITY_BADGE: Record<SubTaskPriority, string> = {
  block:  'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400',
  high:   'bg-warning-50 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400',
  medium: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400',
  low:    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
}

const DEPLOY_PRIORITY_BORDER: Record<SubTaskPriority, string> = {
  block:  'border-l-error-500',
  high:   'border-l-warning-400',
  medium: 'border-l-brand-400',
  low:    'border-l-gray-300 dark:border-l-gray-600',
}

const DEPLOY_PRIORITY_ORDER: Record<SubTaskPriority, number> = {
  block: 0, high: 1, medium: 2, low: 3,
}

const DEPLOY_FILTER_PRESETS = [
  { id: 'all',       name: 'Tất cả dự án' },
  { id: 'trial',     name: '🧪 Dùng thử' },
  { id: 'direct',    name: '🚀 Triển khai thẳng' },
  { id: 'deploying', name: 'Đang triển khai' },
  { id: 'done',      name: 'Hoàn thành' },
  { id: 'overdue',   name: '⚠ Sắp hết deadline' },
]

const DEPLOY_DATE_RANGE_OPTIONS = [
  { value: 'any',   label: 'Bất kỳ' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'week',  label: '7 ngày qua' },
  { value: 'month', label: 'Tháng này' },
]

const DEPLOY_STAGES_LIST = computed(() => store.columns.map((c) => ({ value: c.id, label: c.name })))

const ASSIGNEE_COLORS: Record<string, string> = {
  'Nguyễn T.Thu Hương': '#3450cc',
  'Nguyễn T.H.Ngọc':    '#e03131',
  'Trần Thanh Huy':      '#f79009',
  'Trương Hải Thành':    '#3450cc',
  'Ngô Bảo Khánh':       '#059669',
  'Bùi Đức Trung Hiếu':  '#6554c0',
}

// ─── State ────────────────────────────────────────────────────

const activeFilter   = ref<string>('all')
const searchText     = ref('')
const showDialog     = ref(false)

// ─── Filter panel ─────────────────────────────────────────────
const showDeployFilterPanel = ref(false)
const deploySearchBarRef    = ref<HTMLElement | null>(null)
const deploySearchInputRef  = ref<HTMLInputElement | null>(null)
const deployFilterText      = ref('')
const deployFilterStages    = ref<string[]>([])
const deployFilterType      = ref<string[]>([]) // 'trial' | 'direct'
const deployFilterDateRange = ref('any')
const deployFilterDateFrom  = ref('')
const deployFilterDateTo    = ref('')
const deployFilterDeadlineFrom = ref('')
const deployFilterDeadlineTo   = ref('')
const deployFilterId           = ref('')
const deployFilterEmail        = ref('')
const deployFilterCompany      = ref('')
const deployFilterPhone        = ref('')
const deployFilterSalesPerson  = ref('')
const deployFilterDeployPerson = ref('')
const activeDeployPreset       = ref<string | null>('all')

// ─── Stage settings ───────────────────────────────────────────
const STAGE_COLOR_PALETTE = [
  '#42526e','#f79009','#6554c0','#3450cc','#f59e0b','#059669',
  '#e03131','#0ea5e9','#8b5cf6','#ec4899','#14b8a6','#f97316',
]

interface StageDraft { id: string; name: string; color: string; trialOnly: boolean; isNew?: boolean }

const showDeploySettings   = ref(false)
const deploySettingsTab    = ref<'stages' | 'fields' | 'actions'>('stages')
const deployStageDraft     = ref<StageDraft[]>([])
const deployColorPickerIdx = ref<number | null>(null)
const deployStageOrigNames = ref<Record<string, string>>({})
const deployDragIdx        = ref<number | null>(null)
const deployDragOverIdx    = ref<number | null>(null)
const showAddDeployStageForm = ref(false)
const newDeployStageName     = ref('')
const newDeployStagePosition = ref<string>('last')

// ─── Field settings state ─────────────────────────────────────
const deployFieldSearchQuery     = ref('')
const deployShowAddFieldForm     = ref(false)
const deployFieldEditingId       = ref<string | null>(null)
const deployFieldEditingLabel    = ref('')
const deployFieldDeleteConfirmId = ref<string | null>(null)
const deployNewFieldLabel        = ref('')
const deployNewFieldType         = ref<CustomFieldType>('string')
const deployNewFieldSectionId    = ref('')
const deployNewFieldIsNewSection = ref(false)
const deployNewFieldNewSectionName = ref('')
const deployNewFieldOptions      = ref<string[]>([])
const deployNewFieldOptionInput  = ref('')

const DEPLOY_FIELD_TYPE_HINTS: Record<CustomFieldType, { icon: unknown; label: string; desc: string; examples: string[] }> = {
  string: {
    icon: AlignLeft,
    label: 'Văn bản',
    desc: 'Lưu trữ văn bản tự do. Phù hợp cho ghi chú, mô tả, địa chỉ, URL.',
    examples: ['Ghi chú nội bộ', 'Yêu cầu đặc biệt', 'Địa chỉ cài đặt'],
  },
  double: {
    icon: Hash,
    label: 'Số',
    desc: 'Lưu số nguyên hoặc số thập phân. Phù hợp cho giá trị, số lượng, tỷ lệ.',
    examples: ['Ngân sách triển khai', 'Số thiết bị', 'Tỷ lệ hoàn thành (%)'],
  },
  date: {
    icon: CalendarDays,
    label: 'Ngày',
    desc: 'Lưu ngày tháng năm. Phù hợp cho các mốc thời gian quan trọng.',
    examples: ['Ngày go-live', 'Hạn bảo hành', 'Ngày nghiệm thu'],
  },
  single_select: {
    icon: CircleDot,
    label: 'Danh sách 1 lựa chọn',
    desc: 'Chọn đúng 1 giá trị từ danh sách. Phù hợp cho thuộc tính phân loại.',
    examples: ['Mức độ ưu tiên', 'Loại triển khai', 'Khu vực'],
  },
  multi_select: {
    icon: ListChecks,
    label: 'Danh sách nhiều lựa chọn',
    desc: 'Chọn nhiều giá trị cùng lúc. Phù hợp khi có thể thuộc nhiều nhóm.',
    examples: ['Module triển khai', 'Sản phẩm đi kèm', 'Nhãn dự án'],
  },
}

const deployAllSectionsForFields = computed(() => [
  ...DEPLOY_SECTIONS,
  ...deployCustomFieldStore.customSections,
])

const deployFilteredFieldGroups = computed(() => {
  const q = deployFieldSearchQuery.value.trim().toLowerCase()
  return deployAllSectionsForFields.value
    .map(section => {
      const staticFields = DEPLOY_FIELDS.filter(f =>
        f.sectionId === section.id
        && !deployCustomFieldStore.isStaticHidden(f.fieldId)
        && (!q || f.labelVI.toLowerCase().includes(q))
      )
      const customFields = deployCustomFieldStore.fieldsInSection(section.id).filter(f =>
        !q || f.label.toLowerCase().includes(q)
      )
      return { section, staticFields, customFields, total: staticFields.length + customFields.length }
    })
    .filter(g => g.total > 0)
})
const deliveryPipelineTab = ref<DeliveryPipelineTab>('product')
const showDeliveryPipelineMenu = ref(false)
const showDeliverySettingsDialog = ref(false)
const deliveryEditingId = ref<string | null>(null)
const deliveryEditingLabel = ref('')
const deliveryDeleteId = ref<string | null>(null)
const deliveryDeletePhase = ref<'confirm' | 'countdown' | null>(null)
const deliveryDeleteCountdown = ref(3)
let deliveryDeleteTimer: ReturnType<typeof setInterval> | null = null
const newDeliveryPipelineName = ref('')
const newDeliveryPipelineBase = ref<'product' | 'project' | 'service'>('product')

const projectCards = ref<DeployCard[]>([
  {
    id: 'proj-1', columnId: 'proj_kickoff', createdAt: '2026-05-10',
    customerName: 'Vinpearl Resort & Spa', contactName: 'Trần Thanh Tú',
    email: 'contact@vinpearl.com', phone: '0236.3847.000',
    type: 'direct', progress: 5, tracks: [],
    assignees: [{ name: 'Minh Khoa', initials: 'MK', color: '#3450cc' }],
    notes: 'Dự án tích hợp PMS với hệ thống quản lý khách sạn.',
  },
  {
    id: 'proj-2', columnId: 'proj_analysis', createdAt: '2026-05-05',
    customerName: 'Mường Thanh Luxury', contactName: 'Lê Thị Hoa',
    email: 'ithoa@muongthanh.com', phone: '024.3731.8888',
    type: 'direct', progress: 20, tracks: [],
    assignees: [{ name: 'Thu Hương', initials: 'TH', color: '#6554c0' }],
    notes: 'Phân tích nghiệp vụ quản lý chuỗi khách sạn.',
  },
  {
    id: 'proj-3', columnId: 'proj_dev', createdAt: '2026-04-20',
    customerName: 'InterContinental Hanoi', contactName: 'Phạm Đức Anh',
    email: 'da@ihg.com', phone: '024.3935.9000',
    type: 'direct', progress: 45, tracks: [],
    assignees: [{ name: 'Đức Long', initials: 'ĐL', color: '#f59e0b' }],
    notes: 'Phát triển module booking online và tích hợp OTA.',
  },
  {
    id: 'proj-4', columnId: 'proj_testing', createdAt: '2026-04-01',
    customerName: 'Đà Nẵng Beach Hotel', contactName: 'Nguyễn Văn Hưng',
    email: 'hung@danangbeach.vn', phone: '0236.3827.111',
    type: 'direct', progress: 70, tracks: [],
    assignees: [{ name: 'Lan Ngọc', initials: 'LN', color: '#059669' }],
    notes: 'UAT với nhóm lễ tân và bộ phận kế toán.',
  },
  {
    id: 'proj-5', columnId: 'proj_closed', createdAt: '2026-03-01',
    customerName: 'Hội An Ancient House', contactName: 'Bùi Hoài Thu',
    email: 'thu@ancienthouse.vn', phone: '0235.3861.555',
    type: 'direct', progress: 100, tracks: [],
    assignees: [{ name: 'Minh Tú', initials: 'MT', color: '#ec4899' }],
    notes: 'Đã bàn giao và đào tạo nhân sự xong.',
  },
])

const serviceCards = ref<DeployCard[]>([
  {
    id: 'svc-1', columnId: 'svc_intake', createdAt: '2026-05-20',
    customerName: 'Paradise Resort Phú Quốc', contactName: 'Phan Thị Mai',
    email: 'mai@paradise-resort.vn', phone: '0297.3994.111',
    type: 'direct', progress: 0, tracks: [],
    assignees: [{ name: 'Minh Tú', initials: 'MT', color: '#0ea5e9' }],
    notes: 'Yêu cầu hỗ trợ cài đặt lại module báo cáo doanh thu.',
  },
  {
    id: 'svc-2', columnId: 'svc_assess', createdAt: '2026-05-18',
    customerName: 'Novotel Nha Trang', contactName: 'Trịnh Đức Hoàng',
    email: 'hoang@novotel.vn', phone: '0258.3521.777',
    type: 'direct', progress: 15, tracks: [],
    assignees: [{ name: 'Hùng Phát', initials: 'HP', color: '#8b5cf6' }],
    notes: 'Khảo sát lỗi đồng bộ dữ liệu giữa PMS và Channel Manager.',
  },
  {
    id: 'svc-3', columnId: 'svc_process', createdAt: '2026-05-15',
    customerName: 'Saigon Riverside Hotel', contactName: 'Hoàng Trọng Nhân',
    email: 'nhan@saigonriverside.com', phone: '028.3823.4000',
    type: 'direct', progress: 50, tracks: [],
    assignees: [{ name: 'Thu Hương', initials: 'TH', color: '#3450cc' }],
    notes: 'Đang xử lý lỗi cấu hình rate plan cho OTA.',
  },
  {
    id: 'svc-4', columnId: 'svc_waiting', createdAt: '2026-05-10',
    customerName: 'Liberty Central Saigon', contactName: 'Ngô Thị Yến',
    email: 'yen@libertycentral.vn', phone: '028.3829.9999',
    type: 'direct', progress: 80, tracks: [],
    assignees: [{ name: 'Đức Long', initials: 'ĐL', color: '#f59e0b' }],
    notes: 'Chờ khách hàng xác nhận sau khi cập nhật cấu hình.',
  },
  {
    id: 'svc-5', columnId: 'svc_maintain', createdAt: '2026-04-01',
    customerName: 'GoldStar Palace Hotel', contactName: 'Lê Quốc Bảo',
    email: 'bao@goldstar.vn', phone: '028.3914.2222',
    type: 'direct', progress: 100, tracks: [],
    assignees: [{ name: 'Lan Ngọc', initials: 'LN', color: '#059669' }],
    notes: 'Hợp đồng bảo trì hàng năm - tháng tiếp theo: 01/07/2026.',
  },
])

const draggingCardId = ref<string | null>(null)
const dragOverColId  = ref<string | null>(null)
const calendarFilter    = ref<DeployCalendarFilterId>('all')
const selectedTaskKey   = ref<{ cardId: string; taskId: string } | null>(null)

const form = reactive({
  customerName:   '',
  contactName:    '',
  type:           'direct' as DeployType,
  products:       [] as string[],
  columnId:       'new',
  assigneeName:   '',
  trialStartDate: '',
  trialEndDate:   '',
  notes:          '',
})

// ─── Computed ─────────────────────────────────────────────────

const KPI_CARD_DEFAULT  = 'border-gray-200 bg-white/70 dark:border-gray-700 dark:bg-gray-800/70'
const KPI_CARD_WARNING  = 'border-warning-200 bg-warning-50 dark:border-warning-800/40 dark:bg-warning-900/20'
const KPI_CARD_BRAND    = 'border-brand-200 bg-brand-50 dark:border-brand-800/40 dark:bg-brand-900/20'
const KPI_CARD_SUCCESS  = 'border-success-200 bg-success-50 dark:border-success-800/40 dark:bg-success-900/20'

const kpis = computed(() => {
  if (activeDeliveryBaseType.value === 'project') {
    const cards = projectCards.value
    return [
      { label: 'Tổng dự án',      value: String(cards.length),                                               cardClass: KPI_CARD_DEFAULT },
      { label: 'Đang phát triển', value: String(cards.filter(c => c.columnId === 'proj_dev').length),       cardClass: KPI_CARD_BRAND,   labelClass: 'text-brand-600 dark:text-brand-400',     valueClass: 'text-brand-700 dark:text-brand-300' },
      { label: 'Đang kiểm thử',   value: String(cards.filter(c => c.columnId === 'proj_testing').length),   cardClass: KPI_CARD_WARNING, labelClass: 'text-warning-600 dark:text-warning-400', valueClass: 'text-warning-700 dark:text-warning-300' },
      { label: 'Đã bàn giao',     value: String(cards.filter(c => c.columnId === 'proj_closed').length),    cardClass: KPI_CARD_SUCCESS, labelClass: 'text-success-600 dark:text-success-400', valueClass: 'text-success-700 dark:text-success-300' },
    ]
  }
  if (activeDeliveryBaseType.value === 'service') {
    const cards = serviceCards.value
    return [
      { label: 'Tổng yêu cầu',  value: String(cards.length),                                               cardClass: KPI_CARD_DEFAULT },
      { label: 'Đang xử lý',    value: String(cards.filter(c => c.columnId === 'svc_process').length),     cardClass: KPI_CARD_BRAND,   labelClass: 'text-brand-600 dark:text-brand-400',     valueClass: 'text-brand-700 dark:text-brand-300' },
      { label: 'Chờ xác nhận',  value: String(cards.filter(c => c.columnId === 'svc_waiting').length),     cardClass: KPI_CARD_WARNING, labelClass: 'text-warning-600 dark:text-warning-400', valueClass: 'text-warning-700 dark:text-warning-300' },
      { label: 'Hoàn thành',    value: String(cards.filter(c => c.columnId === 'svc_done').length),        cardClass: KPI_CARD_SUCCESS, labelClass: 'text-success-600 dark:text-success-400', valueClass: 'text-success-700 dark:text-success-300' },
    ]
  }
  // product (default)
  const cards     = store.cards
  const total     = cards.length
  const inTrial   = cards.filter((c) => c.columnId === 'in_trial').length
  const deploying = cards.filter((c) => c.columnId === 'deploying').length
  const done      = cards.filter((c) => c.columnId === 'done').length
  return [
    { label: 'Tổng dự án',      value: String(total),    cardClass: KPI_CARD_DEFAULT },
    { label: 'Đang dùng thử',   value: String(inTrial),  cardClass: KPI_CARD_WARNING, labelClass: 'text-warning-600 dark:text-warning-400', valueClass: 'text-warning-700 dark:text-warning-300' },
    { label: 'Đang triển khai', value: String(deploying),cardClass: KPI_CARD_BRAND,   labelClass: 'text-brand-600 dark:text-brand-400',     valueClass: 'text-brand-700 dark:text-brand-300' },
    { label: 'Hoàn thành',      value: String(done),     cardClass: KPI_CARD_SUCCESS, labelClass: 'text-success-600 dark:text-success-400', valueClass: 'text-success-700 dark:text-success-300' },
  ]
})

const activeDeliveryBaseType = computed(
  () => deliveryPipelineTabs.value.find(t => t.id === deliveryPipelineTab.value)?.baseType ?? 'product'
)

const activeDeployColumns = computed(() => {
  if (activeDeliveryBaseType.value === 'project') return PROJECT_COLUMNS
  if (activeDeliveryBaseType.value === 'service') return SERVICE_COLUMNS
  return store.columns as SimplePipelineCol[]
})

function getColCards(colId: string): DeployCard[] {
  if (activeDeliveryBaseType.value === 'project')
    return projectCards.value.filter(c => c.columnId === colId)
  if (activeDeliveryBaseType.value === 'service')
    return serviceCards.value.filter(c => c.columnId === colId)
  return filteredCards(colId)
}

const hasDeployFilters = computed(() =>
  deployFilterText.value.trim() !== '' ||
  deployFilterStages.value.length > 0 ||
  deployFilterType.value.length > 0 ||
  deployFilterDateRange.value !== 'any' ||
  deployFilterDateFrom.value.trim() !== '' ||
  deployFilterDateTo.value.trim() !== '' ||
  deployFilterDeadlineFrom.value.trim() !== '' ||
  deployFilterDeadlineTo.value.trim() !== '' ||
  deployFilterId.value.trim() !== '' ||
  deployFilterEmail.value.trim() !== '' ||
  deployFilterCompany.value.trim() !== '' ||
  deployFilterPhone.value.trim() !== '' ||
  deployFilterSalesPerson.value.trim() !== '' ||
  deployFilterDeployPerson.value.trim() !== '',
)

const totalDeployFilterCount = computed(() => {
  let n = 0
  if (deployFilterText.value.trim()) n++
  if (deployFilterStages.value.length) n++
  if (deployFilterType.value.length) n++
  if (deployFilterDateRange.value !== 'any') n++
  if (deployFilterDateFrom.value || deployFilterDateTo.value) n++
  if (deployFilterDeadlineFrom.value || deployFilterDeadlineTo.value) n++
  if (deployFilterId.value.trim()) n++
  if (deployFilterEmail.value.trim()) n++
  if (deployFilterCompany.value.trim()) n++
  if (deployFilterPhone.value.trim()) n++
  if (deployFilterSalesPerson.value.trim()) n++
  if (deployFilterDeployPerson.value.trim()) n++
  return n
})

const activeDeployFilterChips = computed(() => {
  const chips: { key: string; label: string }[] = []
  if (deployFilterStages.value.length)
    chips.push({ key: 'stages', label: `Giai đoạn (${deployFilterStages.value.length})` })
  if (deployFilterType.value.length)
    chips.push({ key: 'type', label: deployFilterType.value.map((t) => t === 'trial' ? 'Dùng thử' : 'Trực tiếp').join(', ') })
  if (deployFilterDateRange.value !== 'any')
    chips.push({ key: 'dateRange', label: DEPLOY_DATE_RANGE_OPTIONS.find((o) => o.value === deployFilterDateRange.value)?.label ?? deployFilterDateRange.value })
  if (deployFilterDateFrom.value || deployFilterDateTo.value)
    chips.push({ key: 'dateCustom', label: `Tạo: ${deployFilterDateFrom.value || '...'} → ${deployFilterDateTo.value || '...'}` })
  if (deployFilterDeadlineFrom.value || deployFilterDeadlineTo.value)
    chips.push({ key: 'deadline', label: `Deadline: ${deployFilterDeadlineFrom.value || '...'} → ${deployFilterDeadlineTo.value || '...'}` })
  if (deployFilterId.value.trim())
    chips.push({ key: 'id', label: `ID: ${deployFilterId.value.trim()}` })
  if (deployFilterEmail.value.trim())
    chips.push({ key: 'email', label: `Email: ${deployFilterEmail.value.trim()}` })
  if (deployFilterCompany.value.trim())
    chips.push({ key: 'company', label: `Cty: ${deployFilterCompany.value.trim()}` })
  if (deployFilterPhone.value.trim())
    chips.push({ key: 'phone', label: `SĐT: ${deployFilterPhone.value.trim()}` })
  if (deployFilterSalesPerson.value.trim())
    chips.push({ key: 'sales', label: `Sales: ${deployFilterSalesPerson.value.trim()}` })
  if (deployFilterDeployPerson.value.trim())
    chips.push({ key: 'deploy', label: `TK: ${deployFilterDeployPerson.value.trim()}` })
  return chips
})

const allFilteredCards = computed(() => {
  // Quick filter chips (top row)
  let result = store.cards
  if (activeFilter.value === 'trial')     result = result.filter((c) => c.columnId === 'in_trial')
  if (activeFilter.value === 'deploying') result = result.filter((c) => c.columnId === 'deploying')
  if (activeFilter.value === 'overdue')   result = result.filter((c) => c.trialDaysLeft !== undefined && c.trialDaysLeft <= 5)

  // Text search (legacy)
  if (searchText.value.trim()) {
    const q = searchText.value.toLowerCase()
    result = result.filter(
      (c) => c.customerName.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q),
    )
  }

  // Advanced filters
  if (!hasDeployFilters.value) return result

  const textQ   = deployFilterText.value.trim().toLowerCase()
  const idQ     = deployFilterId.value.trim().toLowerCase()
  const emailQ  = deployFilterEmail.value.trim().toLowerCase()
  const compQ   = deployFilterCompany.value.trim().toLowerCase()
  const phoneQ  = deployFilterPhone.value.trim().toLowerCase()
  const salesQ  = deployFilterSalesPerson.value.trim().toLowerCase()
  const deployQ = deployFilterDeployPerson.value.trim().toLowerCase()

  return result.filter((c) => {
    // Text search
    if (textQ) {
      const hit = c.customerName.toLowerCase().includes(textQ) ||
        c.contactName.toLowerCase().includes(textQ) ||
        (c.email?.toLowerCase().includes(textQ) ?? false) ||
        (c.phone?.toLowerCase().includes(textQ) ?? false)
      if (!hit) return false
    }
    // Stage
    if (deployFilterStages.value.length && !deployFilterStages.value.includes(c.columnId)) return false
    // Type
    if (deployFilterType.value.length && !deployFilterType.value.includes(c.type)) return false
    // Date range (createdAt preset)
    if (deployFilterDateRange.value !== 'any' && !matchesDeployDateRange(c.createdAt, deployFilterDateRange.value)) return false
    // Custom creation date range
    if ((deployFilterDateFrom.value || deployFilterDateTo.value) && !matchesDeployCustomRange(c.createdAt, deployFilterDateFrom.value, deployFilterDateTo.value)) return false
    // Deployment deadline range
    if ((deployFilterDeadlineFrom.value || deployFilterDeadlineTo.value) && !matchesDeployCustomRange(c.deployDeadline, deployFilterDeadlineFrom.value, deployFilterDeadlineTo.value)) return false
    // Field filters
    if (idQ && !c.id.toLowerCase().includes(idQ)) return false
    if (emailQ && !(c.email?.toLowerCase().includes(emailQ) ?? false)) return false
    if (compQ && !c.customerName.toLowerCase().includes(compQ)) return false
    if (phoneQ && !(c.phone?.toLowerCase().includes(phoneQ) ?? false)) return false
    if (salesQ && !(c.salesPerson?.toLowerCase().includes(salesQ) ?? false)) return false
    if (deployQ && !(c.deployPerson?.toLowerCase().includes(deployQ) ?? false)) return false
    return true
  })
})

const availableColumns = computed(() => {
  if (activeDeliveryBaseType.value === 'project') return PROJECT_COLUMNS
  if (activeDeliveryBaseType.value === 'service') return SERVICE_COLUMNS
  return form.type === 'direct'
    ? store.columns.filter((c) => !c.trialOnly)
    : store.columns
})

interface CalendarTask {
  id: string
  cardId: string
  customerName: string
  columnId: string
  title: string
  product: string
  status: SubTaskStatus
  priority: SubTaskPriority
  estimatedHours: number
  dueDate: string
  assignee: string
  assigneeColor: string
}

const allCalendarTasks = computed<CalendarTask[]>(() => {
  const tasks: CalendarTask[] = []
  for (const card of allFilteredCards.value) {
    for (const st of card.subTasks ?? []) {
      tasks.push({
        id:             st.id,
        cardId:         card.id,
        customerName:   card.customerName,
        columnId:       card.columnId,
        title:          st.title,
        product:        st.product,
        status:         st.status,
        priority:       st.priority,
        estimatedHours: st.estimatedHours,
        dueDate:        st.dueDate,
        assignee:       st.assignee,
        assigneeColor:  ASSIGNEE_COLORS[st.assignee] ?? '#6b7280',
      })
    }
  }
  return tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const pd = DEPLOY_PRIORITY_ORDER[a.priority] - DEPLOY_PRIORITY_ORDER[b.priority]
      if (pd !== 0) return pd
      return a.dueDate.localeCompare(b.dueDate)
    })
})

const filteredCalendarTasks = computed<CalendarTask[]>(() => {
  const f = calendarFilter.value
  if (f === 'all')     return allCalendarTasks.value
  if (f === 'pending') return allCalendarTasks.value.filter((t) => t.status !== 'done')
  return allCalendarTasks.value.filter((t) => t.priority === f)
})

const calendarTaskGroups = computed(() =>
  (['block', 'high', 'medium', 'low'] as SubTaskPriority[]).map((p) => ({
    priority: p,
    tasks: filteredCalendarTasks.value.filter((t) => t.priority === p),
  })),
)

const pendingTaskCount = computed(() =>
  allCalendarTasks.value.filter((t) => t.status !== 'done').length,
)

const blockTaskCount = computed(() =>
  allCalendarTasks.value.filter((t) => t.priority === 'block' && t.status !== 'done').length,
)

// ─── Filter helpers ───────────────────────────────────────────

function matchesDeployDateRange(dateStr: string | undefined, range: string): boolean {
  if (!dateStr) return range === 'any'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return true
  const now = new Date()
  if (range === 'today') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  if (range === 'week') { const w = new Date(now); w.setDate(now.getDate() - 7); return d >= w }
  if (range === 'month') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  return true
}

function matchesDeployCustomRange(dateStr: string | undefined, from: string, to: string): boolean {
  if (!dateStr) return true
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return true
  if (from) { const f = new Date(from); if (!isNaN(f.getTime()) && d < f) return false }
  if (to)   { const t = new Date(to); t.setHours(23, 59, 59, 999); if (!isNaN(t.getTime()) && d > t) return false }
  return true
}

function removeDeployFilter(key: string): void {
  if (key === 'stages')    deployFilterStages.value = []
  if (key === 'type')      deployFilterType.value = []
  if (key === 'dateRange') deployFilterDateRange.value = 'any'
  if (key === 'dateCustom')  { deployFilterDateFrom.value = ''; deployFilterDateTo.value = '' }
  if (key === 'deadline')    { deployFilterDeadlineFrom.value = ''; deployFilterDeadlineTo.value = '' }
  if (key === 'id')      deployFilterId.value = ''
  if (key === 'email')   deployFilterEmail.value = ''
  if (key === 'company') deployFilterCompany.value = ''
  if (key === 'phone')   deployFilterPhone.value = ''
  if (key === 'sales')   deployFilterSalesPerson.value = ''
  if (key === 'deploy')  deployFilterDeployPerson.value = ''
  activeDeployPreset.value = null
}

function clearDeployFilters(): void {
  deployFilterText.value = ''
  deployFilterStages.value = []
  deployFilterType.value = []
  deployFilterDateRange.value = 'any'
  deployFilterDateFrom.value = ''
  deployFilterDateTo.value = ''
  deployFilterDeadlineFrom.value = ''
  deployFilterDeadlineTo.value = ''
  deployFilterId.value = ''
  deployFilterEmail.value = ''
  deployFilterCompany.value = ''
  deployFilterPhone.value = ''
  deployFilterSalesPerson.value = ''
  deployFilterDeployPerson.value = ''
  activeDeployPreset.value = 'all'
}

function applyDeployPreset(id: string): void {
  clearDeployFilters()
  activeDeployPreset.value = id
  if (id === 'trial')     deployFilterType.value = ['trial']
  else if (id === 'direct')    deployFilterType.value = ['direct']
  else if (id === 'deploying') deployFilterStages.value = ['deploying']
  else if (id === 'done')      deployFilterStages.value = ['done']
  else if (id === 'overdue')   { deployFilterDeadlineTo.value = new Date().toISOString().split('T')[0] }
}

function openDeployFilterPanel(): void {
  showDeployFilterPanel.value = true
  nextTick(() => deploySearchInputRef.value?.focus())
}

function handleDeployOutsideClick(e: MouseEvent): void {
  if (deploySearchBarRef.value && !deploySearchBarRef.value.contains(e.target as Node)) {
    showDeployFilterPanel.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleDeployOutsideClick))
onUnmounted(() => document.removeEventListener('mousedown', handleDeployOutsideClick))

// ─── Helpers ──────────────────────────────────────────────────

function filteredCards(columnId: string): DeployCard[] {
  return allFilteredCards.value.filter((c) => c.columnId === columnId)
}

function isOverdue(dateStr: string): boolean {
  return dateStr ? new Date(dateStr) < new Date(new Date().toDateString()) : false
}

function isCloseSoon(dateStr: string): boolean {
  if (!dateStr) return false
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86400000
  return diff >= 0 && diff <= 3
}

function formatDueDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

function daysLabel(dateStr: string): string {
  if (!dateStr) return ''
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `Quá hạn ${Math.abs(diff)} ngày`
  if (diff === 0) return 'Hôm nay'
  if (diff === 1) return 'Ngày mai'
  return `Còn ${diff} ngày`
}

function initials(name: string): string {
  return name.trim().split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const selectedSubTaskData = computed(() => {
  if (!selectedTaskKey.value) return null
  const { cardId, taskId } = selectedTaskKey.value
  const card = store.cards.find((c) => c.id === cardId)
  if (!card) return null
  const subTask = card.subTasks?.find((s) => s.id === taskId)
  if (!subTask) return null
  return { card, subTask }
})

function openTaskDetail(cardId: string, taskId: string): void {
  selectedTaskKey.value = { cardId, taskId }
}

function toggleTaskDone(cardId: string, subTaskId: string, currentStatus: SubTaskStatus): void {
  const next: SubTaskStatus = currentStatus === 'done' ? 'in_progress' : 'done'
  store.updateSubTask(cardId, subTaskId, { status: next })
}

function toggleProduct(p: string): void {
  const idx = form.products.indexOf(p)
  if (idx === -1) form.products.push(p)
  else form.products.splice(idx, 1)
}

function resetForm(columnId = ''): void {
  form.customerName   = ''
  form.contactName    = ''
  form.type           = 'direct'
  form.products       = []
  form.columnId       = columnId || activeDeployColumns.value[0]?.id || 'new'
  form.assigneeName   = ''
  form.trialStartDate = ''
  form.trialEndDate   = ''
  form.notes          = ''
}

// ─── Navigation ───────────────────────────────────────────────

function navigateToCard(id: string): void {
  router.push({ name: 'CrmDeploymentDetail', params: { deploymentId: id } })
}

// ─── Dialog handlers ──────────────────────────────────────────

function openCreateDialog(defaultColumnId = 'new'): void {
  resetForm(defaultColumnId)
  showDialog.value = true
}

function saveCard(): void {
  if (!form.customerName.trim()) {
    toast.error('Vui lòng nhập tên khách hàng')
    return
  }

  const palette = ['#465fff', '#3450cc', '#f79009', '#e03131', '#059669', '#6554c0']
  const initials = form.assigneeName.trim()
    ? form.assigneeName.trim().split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '??'
  const assignees: DeployAssignee[] = form.assigneeName.trim()
    ? [{ name: form.assigneeName.trim(), initials, color: palette[Math.floor(Math.random() * palette.length)] }]
    : []

  const buildPhases = (): DeployPhase[] => {
    if (form.type === 'trial') {
      return [
        { label: 'Setup DT', status: 'waiting' },
        { label: 'Dùng thử', status: 'waiting' },
        { label: 'TK',       status: 'waiting' },
        { label: 'ĐT',       status: 'waiting' },
      ]
    }
    return [
      { label: 'TK', status: 'waiting' },
      { label: 'ĐT', status: 'waiting' },
    ]
  }

  const newCard: DeployCard = {
    id:             `dp-${Date.now()}`,
    columnId:       form.columnId,
    customerName:   form.customerName.trim(),
    contactName:    form.contactName.trim(),
    type:           form.type,
    tracks:         form.products.length
      ? form.products.map((p) => ({ product: p, phases: buildPhases() }))
      : [{ product: 'ezCloud', phases: buildPhases() }],
    assignees,
    progress:       0,
    trialStartDate: form.trialStartDate || undefined,
    trialEndDate:   form.trialEndDate   || undefined,
    notes:          form.notes          || undefined,
    activities:     [],
  }

  if (activeDeliveryBaseType.value === 'project') projectCards.value.unshift(newCard)
  else if (activeDeliveryBaseType.value === 'service') serviceCards.value.unshift(newCard)
  else store.addCard(newCard)
  toast.success('Đã tạo dự án triển khai')
  showDialog.value = false
}

// ─── Drag & Drop ──────────────────────────────────────────────

function onDragStart(e: DragEvent, cardId: string): void {
  draggingCardId.value = cardId
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragEnd(): void {
  draggingCardId.value = null
  dragOverColId.value  = null
}

function onDragOver(e: DragEvent, colId: string): void {
  const card = store.cards.find((c) => c.id === draggingCardId.value)
  if (!card) return
  const col = store.columns.find((c) => c.id === colId)
  if (col?.trialOnly && card.type === 'direct') return
  e.preventDefault()
  dragOverColId.value = colId
}

function onDragLeave(e: DragEvent, colId: string): void {
  if (!(e.currentTarget as HTMLElement)?.contains(e.relatedTarget as Node)) {
    if (dragOverColId.value === colId) dragOverColId.value = null
  }
}

function onDrop(e: DragEvent, colId: string): void {
  e.preventDefault()
  const cardId = draggingCardId.value
  if (!cardId) return
  const card = store.cards.find((c) => c.id === cardId)
  if (!card || card.columnId === colId) {
    draggingCardId.value = null
    dragOverColId.value  = null
    return
  }
  const col = store.columns.find((c) => c.id === colId)
  if (col?.trialOnly && card.type === 'direct') {
    toast.error('Cột này chỉ dành cho khách dùng thử')
    draggingCardId.value = null
    dragOverColId.value  = null
    return
  }
  store.updateCard(cardId, { columnId: colId })
  toast.success(`Đã chuyển "${card.customerName}" sang "${store.columnName(colId)}"`)
  draggingCardId.value = null
  dragOverColId.value  = null
}

// ─── Expose ──────────────────────────────────────────────────

// ─── Settings ─────────────────────────────────────────────────

function openSettings(): void {
  deployStageDraft.value = store.columns.map((c) => ({ ...c }))
  deployStageOrigNames.value = Object.fromEntries(store.columns.map((c) => [c.id, c.name]))
  deployColorPickerIdx.value = null
  showAddDeployStageForm.value = false
  newDeployStageName.value = ''
  newDeployStagePosition.value = 'last'
  deploySettingsTab.value = 'stages'
  deployShowAddFieldForm.value = false
  deployFieldSearchQuery.value = ''
  deployFieldEditingId.value = null
  deployFieldDeleteConfirmId.value = null
  deployNewFieldLabel.value = ''
  deployNewFieldType.value = 'string'
  deployNewFieldSectionId.value = ''
  deployNewFieldIsNewSection.value = false
  deployNewFieldNewSectionName.value = ''
  deployNewFieldOptions.value = []
  deployNewFieldOptionInput.value = ''
  showDeploySettings.value = true
}

function onDeployDragStart(idx: number): void { deployDragIdx.value = idx }
function onDeployDragOver(e: DragEvent, idx: number): void { e.preventDefault(); deployDragOverIdx.value = idx }
function onDeployDrop(idx: number): void {
  const from = deployDragIdx.value
  if (from === null || from === idx) { deployDragIdx.value = null; deployDragOverIdx.value = null; return }
  const list = [...deployStageDraft.value]
  const [moved] = list.splice(from, 1)
  list.splice(idx, 0, moved)
  deployStageDraft.value = list
  deployDragIdx.value = null
  deployDragOverIdx.value = null
}
function onDeployDragEnd(): void { deployDragIdx.value = null; deployDragOverIdx.value = null }

function removeDeployStage(idx: number): void {
  const draft = deployStageDraft.value[idx]
  if (!draft.isNew) {
    const count = store.cards.filter((c) => c.columnId === draft.id).length
    if (count > 0) { toast.error(`Không thể xóa — giai đoạn đang có ${count} dự án`); return }
  }
  deployStageDraft.value.splice(idx, 1)
  if (deployColorPickerIdx.value === idx) deployColorPickerIdx.value = null
}

function saveDeployStageName(stage: StageDraft): void {
  if (!stage.name.trim()) { toast.error('Tên không được để trống'); return }
  stage.name = stage.name.trim()
  deployStageOrigNames.value[stage.id] = stage.name
  toast.success('Đã lưu tên giai đoạn')
}

function confirmAddDeployStage(): void {
  const name = newDeployStageName.value.trim()
  if (!name) { toast.error('Tên giai đoạn không được để trống'); return }
  const color = STAGE_COLOR_PALETTE[deployStageDraft.value.length % STAGE_COLOR_PALETTE.length]
  const newStage: StageDraft = { id: `deploy_new_${Date.now()}`, name, color, trialOnly: false, isNew: true }
  if (newDeployStagePosition.value === 'first') {
    deployStageDraft.value.unshift(newStage)
  } else if (newDeployStagePosition.value === 'last') {
    deployStageDraft.value.push(newStage)
  } else {
    const afterIdx = deployStageDraft.value.findIndex((s) => s.id === newDeployStagePosition.value)
    deployStageDraft.value.splice(afterIdx >= 0 ? afterIdx + 1 : deployStageDraft.value.length, 0, newStage)
  }
  deployStageOrigNames.value[newStage.id] = name
  showAddDeployStageForm.value = false
  newDeployStageName.value = ''
  newDeployStagePosition.value = 'last'
}

function saveDeployStages(): void {
  if (deployStageDraft.value.length === 0) { toast.error('Pipeline phải có ít nhất 1 giai đoạn'); return }
  if (deployStageDraft.value.some((s) => !s.name.trim())) { toast.error('Tên giai đoạn không được để trống'); return }
  const newCols: DeployColumn[] = deployStageDraft.value.map((d) => ({
    id: d.id,
    name: d.name.trim(),
    color: d.color,
    trialOnly: d.trialOnly,
  }))
  store.updateColumns(newCols)
  showDeploySettings.value = false
  showAddDeployStageForm.value = false
  toast.success('Đã lưu thay đổi giai đoạn')
}

// ─── Deploy field management ──────────────────────────────────

function deployStartEditField(id: string, currentLabel: string): void {
  deployFieldEditingId.value = id
  deployFieldEditingLabel.value = currentLabel
}

function deploySaveFieldEdit(id: string, isCustom: boolean): void {
  const label = deployFieldEditingLabel.value.trim()
  if (!label) return
  if (isCustom) {
    deployCustomFieldStore.updateCustomField(id, { label })
  } else {
    deployCustomFieldStore.setStaticOverride(id, { label })
  }
  deployFieldEditingId.value = null
}

function deployCancelFieldEdit(): void {
  deployFieldEditingId.value = null
}

function deployToggleFieldRequired(id: string, isCustom: boolean, currentRequired: boolean): void {
  if (isCustom) {
    deployCustomFieldStore.updateCustomField(id, { required: !currentRequired })
  } else {
    deployCustomFieldStore.setStaticOverride(id, { required: !currentRequired })
  }
}

function deployStartDeleteField(id: string): void {
  deployFieldDeleteConfirmId.value = id
}

function deployConfirmDeleteField(id: string, isCustom: boolean): void {
  if (isCustom) {
    deployCustomFieldStore.deleteField(id)
  } else {
    deployCustomFieldStore.hideStaticField(id)
  }
  deployFieldDeleteConfirmId.value = null
}

function deployCancelDeleteField(): void {
  deployFieldDeleteConfirmId.value = null
}

function deployAddFieldOptionTag(): void {
  const val = deployNewFieldOptionInput.value.trim().replace(/,+$/, '')
  if (val && !deployNewFieldOptions.value.includes(val)) {
    deployNewFieldOptions.value.push(val)
  }
  deployNewFieldOptionInput.value = ''
}

function deployAddCustomField(): void {
  const label = deployNewFieldLabel.value.trim()
  if (!label) return
  let sectionId = deployNewFieldSectionId.value
  if (deployNewFieldIsNewSection.value) {
    const sectionName = deployNewFieldNewSectionName.value.trim()
    if (!sectionName) return
    const newSection = deployCustomFieldStore.addSection(sectionName)
    sectionId = newSection.id
  }
  if (!sectionId) return
  const opts = (deployNewFieldType.value === 'single_select' || deployNewFieldType.value === 'multi_select')
    ? [...deployNewFieldOptions.value]
    : undefined
  deployCustomFieldStore.addField(sectionId, label, deployNewFieldType.value, opts)
  deployNewFieldLabel.value = ''
  deployNewFieldType.value = 'string'
  deployNewFieldSectionId.value = ''
  deployNewFieldIsNewSection.value = false
  deployNewFieldNewSectionName.value = ''
  deployNewFieldOptions.value = []
  deployNewFieldOptionInput.value = ''
  deployShowAddFieldForm.value = false
  toast.success('Đã thêm trường thông tin')
}

// ─── Delivery Pipeline settings ──────────────────────────────

function openDeliverySettings(): void {
  showDeliveryPipelineMenu.value = false
  deliveryEditingId.value = null
  showDeliverySettingsDialog.value = true
}

function startEditDelivery(tab: DeliveryPipelineTabDef): void {
  deliveryEditingId.value = tab.id
  deliveryEditingLabel.value = tab.label
}

function saveEditDelivery(): void {
  const t = deliveryPipelineTabs.value.find(t => t.id === deliveryEditingId.value)
  if (t && deliveryEditingLabel.value.trim()) {
    t.label = deliveryEditingLabel.value.trim()
    toast.success('Đã cập nhật pipeline')
  }
  deliveryEditingId.value = null
}

function cancelEditDelivery(): void {
  deliveryEditingId.value = null
}

function duplicateDelivery(tab: DeliveryPipelineTabDef): void {
  const newId = tab.id + '-copy-' + Date.now()
  deliveryPipelineTabs.value.push({ id: newId, label: tab.label + ' (copy)', icon: tab.icon, baseType: tab.baseType })
  toast.success(`Đã nhân bản "${tab.label}"`)
}

function startDeleteDelivery(id: string): void {
  if (deliveryPipelineTabs.value.length <= 1) {
    toast.error('Phải có ít nhất 1 pipeline')
    return
  }
  deliveryDeleteId.value = id
  deliveryDeletePhase.value = 'confirm'
}

function confirmDeleteDelivery(): void {
  deliveryDeletePhase.value = 'countdown'
  deliveryDeleteCountdown.value = 3
  deliveryDeleteTimer = setInterval(() => {
    deliveryDeleteCountdown.value--
    if (deliveryDeleteCountdown.value <= 0) {
      clearInterval(deliveryDeleteTimer!)
      deliveryDeleteTimer = null
      executeDeliveryDelete()
    }
  }, 1000)
}

function cancelDeleteDelivery(): void {
  if (deliveryDeleteTimer) { clearInterval(deliveryDeleteTimer); deliveryDeleteTimer = null }
  deliveryDeleteId.value = null
  deliveryDeletePhase.value = null
  deliveryDeleteCountdown.value = 3
}

function executeDeliveryDelete(): void {
  const id = deliveryDeleteId.value!
  deliveryPipelineTabs.value = deliveryPipelineTabs.value.filter(t => t.id !== id)
  if (deliveryPipelineTab.value === id) {
    deliveryPipelineTab.value = deliveryPipelineTabs.value[0].id
  }
  deliveryDeleteId.value = null
  deliveryDeletePhase.value = null
  deliveryDeleteCountdown.value = 3
  toast.success('Đã xoá pipeline')
}

function addNewDeliveryPipeline(): void {
  const name = newDeliveryPipelineName.value.trim()
  if (!name) return
  const base = newDeliveryPipelineBase.value
  const icons: Record<string, string> = { product: '📦', project: '🏗️', service: '🔧' }
  const newId = base + '-' + Date.now()
  deliveryPipelineTabs.value.push({ id: newId, label: name, icon: icons[base], baseType: base })
  newDeliveryPipelineName.value = ''
  toast.success(`Đã thêm pipeline "${name}"`)
}

defineExpose({ openCreateDialog, openSettings })
</script>

<style scoped>
.kpi-card {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04);
  transition: box-shadow 0.15s ease;
}
.kpi-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07);
}
</style>
