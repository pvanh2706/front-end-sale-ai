<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="handleCancel"
      >
        <div
          class="bg-white dark:bg-gray-900 w-full max-w-[1080px] h-[calc(100vh-80px)] max-h-[870px] shadow-2xl rounded-xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          @click.stop
        >
          <!-- Header -->
          <header class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-title-xs font-semibold text-brand-500">Tuỳ chỉnh trường hiển thị trên Deal</h2>
              <p class="text-theme-sm text-gray-500 mt-0.5">Chọn và sắp xếp các trường thông tin quan trọng để tối ưu hóa quy trình quản lý bán hàng.</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-theme-sm font-medium transition-colors"
                @click="handlePreview"
              >
                <span class="material-symbols-outlined text-[20px]">visibility</span>
                Xem trước
              </button>
              <button
                class="w-9 h-9 flex items-center justify-center hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-500/10 rounded-full transition-colors text-gray-400"
                @click="handleCancel"
              >
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </header>

          <!-- Body -->
          <div class="flex flex-1 overflow-hidden">
            <!-- Left: Section list -->
            <aside class="w-[260px] border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col shrink-0">
              <!-- Presets -->
              <div class="p-4">
                <div class="bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-theme-xs mb-4">
                  <span class="text-theme-xs text-gray-400 uppercase tracking-wider mb-2 block font-medium">Presets nhanh</span>
                  <div class="space-y-1">
                    <button
                      class="w-full text-left px-2 py-1.5 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded text-theme-sm flex items-center justify-between transition-colors"
                      :class="activePreset === 'default' ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'text-gray-700 dark:text-gray-300'"
                      @click="handleApplyPreset('default')"
                    >
                      Mặc định
                      <span v-if="activePreset === 'default'" class="material-symbols-outlined text-[16px] text-brand-500">check_circle</span>
                    </button>
                    <button
                      class="w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-theme-sm transition-colors"
                      :class="activePreset === 'minimal' ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'text-gray-700 dark:text-gray-300'"
                      @click="handleApplyPreset('minimal')"
                    >
                      Tối giản
                      <span v-if="activePreset === 'minimal'" class="material-symbols-outlined text-[16px] text-brand-500 float-right">check_circle</span>
                    </button>
                    <button
                      class="w-full text-left px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-theme-sm transition-colors"
                      :class="activePreset === 'full' ? 'text-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'text-gray-700 dark:text-gray-300'"
                      @click="handleApplyPreset('full')"
                    >
                      Đầy đủ
                      <span v-if="activePreset === 'full'" class="material-symbols-outlined text-[16px] text-brand-500 float-right">check_circle</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section list -->
              <div class="flex-1 overflow-y-auto px-4 pb-4">
                <span class="text-theme-xs text-gray-400 uppercase tracking-wider mb-2 block px-2 font-medium">
                  Danh mục ({{ sections.length }})
                </span>
                <div class="space-y-1">
                  <button
                    v-for="section in sections"
                    :key="section.id"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors"
                    :class="activeSection === section.id
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'"
                    @click="activeSection = section.id"
                  >
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-[20px]">{{ section.icon }}</span>
                      <span class="text-theme-sm font-medium">{{ section.name }}</span>
                    </div>
                    <span
                      class="text-[11px] font-bold"
                      :class="activeSection === section.id ? 'text-white/80' : 'text-gray-400'"
                    >
                      {{ sectionVisibleCount(section.id) }}/{{ sectionTotalCount(section.id) }}
                    </span>
                  </button>
                </div>
              </div>
            </aside>

            <!-- Right: Field editor -->
            <main class="flex-1 flex flex-col bg-white dark:bg-gray-900 min-w-0">
              <!-- Toolbar -->
              <div class="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center gap-4 shrink-0">
                <div class="relative flex-1">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Tìm kiếm tên trường hoặc Field ID..."
                    class="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-theme-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <div class="flex gap-1">
                    <button
                      v-for="tab in filterTabs"
                      :key="tab.value"
                      class="px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors"
                      :class="activeFilter === tab.value
                        ? 'bg-brand-500 text-white border-brand-500'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50'"
                      @click="activeFilter = tab.value"
                    >
                      {{ tab.label }}
                    </button>
                  </div>
                  <div class="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
                  <button
                    class="flex items-center gap-1 text-theme-sm text-brand-500 hover:underline font-medium"
                    @click="toggleAllInCurrentSection(true)"
                  >
                    <span class="material-symbols-outlined text-[18px]">done_all</span>
                    Bật tất cả
                  </button>
                  <button
                    class="flex items-center gap-1 text-theme-sm text-gray-500 hover:underline font-medium"
                    @click="toggleAllInCurrentSection(false)"
                  >
                    <span class="material-symbols-outlined text-[18px]">remove_done</span>
                    Tắt tất cả
                  </button>
                </div>
              </div>

              <!-- Table -->
              <div class="flex-1 overflow-auto">
                <table class="w-full border-collapse">
                  <thead class="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/80">
                    <tr>
                      <!-- Checkbox gộp trong ô Tên trường -->
                      <th class="py-3 pl-6 pr-4 text-left">
                        <label class="flex cursor-pointer items-center gap-3 select-none">
                          <input
                            type="checkbox"
                            :checked="allVisibleInSection"
                            :indeterminate="someVisibleInSection"
                            class="h-4 w-4 cursor-pointer rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                            @change="toggleAllInCurrentSection(!allVisibleInSection)"
                          />
                          <span class="text-theme-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Tên trường
                          </span>
                        </label>
                      </th>
                      <th class="py-3 pr-4 text-left text-theme-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Field ID</th>
                      <th class="py-3 pr-4 text-left text-theme-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Loại</th>
                      <th class="py-3 pr-4 text-left text-theme-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Quyền xem</th>
                      <th class="py-3 pr-6 w-8" />
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                    <tr
                      v-for="field in filteredFields"
                      :key="field.fieldId"
                      class="group transition-colors"
                      :class="[
                        draftConfig[field.fieldId]?.visible
                          ? 'bg-white hover:bg-brand-50/50 dark:bg-transparent dark:hover:bg-brand-500/5'
                          : 'bg-gray-50/60 opacity-50 hover:opacity-75 dark:bg-gray-800/20',
                        field.isAI ? 'border-l-2 border-l-brand-300 dark:border-l-brand-500/50' : '',
                      ]"
                    >
                      <!-- Ô Tên trường: checkbox + label gộp lại, click vào tên = toggle -->
                      <td class="py-2.5 pl-6 pr-4">
                        <label
                          class="flex items-center gap-3 select-none"
                          :class="field.isLocked ? 'cursor-default' : 'cursor-pointer'"
                        >
                          <input
                            type="checkbox"
                            :checked="draftConfig[field.fieldId]?.visible"
                            :disabled="field.isLocked"
                            class="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
                            :class="field.isLocked ? '' : 'cursor-pointer'"
                            @change="toggleField(field.fieldId)"
                          />
                          <div class="flex items-center gap-1.5 min-w-0">
                            <span
                              class="text-theme-sm font-medium leading-snug"
                              :class="field.isAI
                                ? 'text-brand-600 dark:text-brand-400'
                                : draftConfig[field.fieldId]?.visible
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-500 dark:text-gray-500'"
                            >{{ field.labelVI }}</span>
                            <span
                              v-if="field.isLocked"
                              class="material-symbols-outlined text-[13px] text-error-400 shrink-0"
                              title="Trường bắt buộc, không thể ẩn"
                            >lock</span>
                            <span
                              v-if="field.isAI"
                              class="shrink-0 rounded bg-brand-100 px-1 py-0.5 text-[9px] font-black uppercase text-brand-600 dark:bg-brand-500/20 dark:text-brand-400"
                            >AI</span>
                          </div>
                        </label>
                      </td>
                      <td class="py-2.5 pr-4">
                        <code class="rounded bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                          {{ field.bitrixId }}
                        </code>
                      </td>
                      <td class="py-2.5 pr-4">
                        <span
                          class="rounded-md border px-2 py-0.5 text-[11px] font-bold"
                          :class="typeClass(field.type)"
                        >{{ typeLabel(field.type) }}</span>
                      </td>
                      <td class="py-2.5 pr-4">
                        <select
                          :value="draftConfig[field.fieldId]?.permission ?? 'Công khai'"
                          :disabled="!draftConfig[field.fieldId]?.visible"
                          class="cursor-pointer border-none bg-transparent p-0 text-theme-sm text-gray-500 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400"
                          @change="setPermission(field.fieldId, ($event.target as HTMLSelectElement).value as FieldPermission)"
                        >
                          <option>Công khai</option>
                          <option>Phòng kinh doanh</option>
                          <option>Quản trị viên</option>
                        </select>
                      </td>
                      <td class="py-2.5 pr-6 text-right">
                        <span class="material-symbols-outlined cursor-move select-none text-[18px] text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-600">
                          drag_indicator
                        </span>
                      </td>
                    </tr>

                    <!-- Empty state -->
                    <tr v-if="filteredFields.length === 0">
                      <td colspan="5" class="py-16 text-center">
                        <span class="material-symbols-outlined mb-2 block text-[40px] text-gray-300">search_off</span>
                        <p class="text-theme-sm text-gray-400">Không tìm thấy trường nào phù hợp</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </main>
          </div>

          <!-- Footer -->
          <footer class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-gray-50 dark:bg-gray-800/50">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-theme-sm text-gray-700 dark:text-gray-300">
                  Đang hiển thị:
                  <span class="font-bold text-brand-500">{{ draftVisibleCount }}/{{ totalFields }}</span> trường
                </span>
                <div class="w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-brand-500 rounded-full transition-all"
                    :style="{ width: `${(draftVisibleCount / totalFields) * 100}%` }"
                  />
                </div>
              </div>
              <div class="flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-[14px] text-warning-500">info</span>
                <p class="text-[12px] text-warning-500 font-medium">Nên giữ dưới 100 trường để có hiệu năng tốt nhất.</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="px-4 py-2 text-theme-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                @click="handleCancel"
              >
                Hủy bỏ
              </button>
              <button
                class="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-theme-sm font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                @click="handleSave"
              >
                Lưu thay đổi
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useDealFieldConfigStore } from '@/stores/useDealFieldConfigStore'
import { DEAL_FIELDS, DEAL_SECTIONS } from '@/types/dealFields'
import type { DealFieldType, FieldPermission } from '@/types/dealFields'
import type { FieldConfig } from '@/stores/useDealFieldConfigStore'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const store = useDealFieldConfigStore()
const sections = DEAL_SECTIONS

const activeSection = ref('general')
const searchQuery = ref('')
const activeFilter = ref<'all' | 'basic' | 'custom'>('all')
const activePreset = ref<'default' | 'minimal' | 'full' | null>('default')
const draftConfig = ref<Record<string, FieldConfig>>({})

const filterTabs = [
  { label: 'Tất cả', value: 'all' as const },
  { label: 'Cơ bản', value: 'basic' as const },
  { label: 'Tuỳ chỉnh', value: 'custom' as const },
]

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      draftConfig.value = JSON.parse(JSON.stringify(store.fieldConfig)) as Record<string, FieldConfig>
      activeSection.value = 'general'
      searchQuery.value = ''
      activeFilter.value = 'all'
    }
  },
)

const sectionFields = computed(() =>
  DEAL_FIELDS.filter((f) => f.sectionId === activeSection.value),
)

const filteredFields = computed(() => {
  let list = sectionFields.value

  if (activeFilter.value === 'basic') list = list.filter((f) => !f.isCustom)
  else if (activeFilter.value === 'custom') list = list.filter((f) => f.isCustom)

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (f) =>
        f.labelVI.toLowerCase().includes(q) ||
        f.fieldId.toLowerCase().includes(q) ||
        f.bitrixId.toLowerCase().includes(q),
    )
  }

  return list
})

const totalFields = computed(() => DEAL_FIELDS.length)

const draftVisibleCount = computed(
  () => Object.values(draftConfig.value).filter((c) => c.visible).length,
)

const allVisibleInSection = computed(() =>
  sectionFields.value.every((f) => draftConfig.value[f.fieldId]?.visible),
)

const someVisibleInSection = computed(
  () =>
    !allVisibleInSection.value &&
    sectionFields.value.some((f) => draftConfig.value[f.fieldId]?.visible),
)

function sectionVisibleCount(sectionId: string): number {
  return DEAL_FIELDS.filter(
    (f) => f.sectionId === sectionId && draftConfig.value[f.fieldId]?.visible,
  ).length
}

function sectionTotalCount(sectionId: string): number {
  return DEAL_FIELDS.filter((f) => f.sectionId === sectionId).length
}

function toggleField(fieldId: string): void {
  if (!draftConfig.value[fieldId]) return
  draftConfig.value[fieldId].visible = !draftConfig.value[fieldId].visible
  activePreset.value = null
}

function setPermission(fieldId: string, permission: FieldPermission): void {
  if (!draftConfig.value[fieldId]) return
  draftConfig.value[fieldId].permission = permission
}

function toggleAllInCurrentSection(visible: boolean): void {
  sectionFields.value.forEach((f) => {
    if (draftConfig.value[f.fieldId] && !f.isLocked) {
      draftConfig.value[f.fieldId].visible = visible
    }
  })
  activePreset.value = null
}

function handleApplyPreset(preset: 'default' | 'minimal' | 'full'): void {
  const newConfig: Record<string, FieldConfig> = {}
  DEAL_FIELDS.forEach((f) => {
    let visible = f.defaultVisible
    if (preset === 'minimal') visible = !!(f.isLocked || f.required)
    else if (preset === 'full') visible = true
    newConfig[f.fieldId] = {
      visible,
      permission: draftConfig.value[f.fieldId]?.permission ?? 'Công khai',
    }
  })
  draftConfig.value = newConfig
  activePreset.value = preset
}

function handleSave(): void {
  store.applyConfig(draftConfig.value)
  store.saveConfig()
  toast.success('Đã lưu cài đặt trường hiển thị')
  emit('update:open', false)
}

function handleCancel(): void {
  emit('update:open', false)
}

function handlePreview(): void {
  toast.info('Tính năng xem trước đang phát triển')
}

function typeLabel(type: DealFieldType): string {
  const map: Record<DealFieldType, string> = {
    string: 'TEXT',
    integer: 'NUMBER',
    double: 'NUMBER',
    date: 'DATE',
    datetime: 'DATETIME',
    enumeration: 'SELECT',
    boolean: 'BOOL',
    user: 'USER',
    money: 'CURRENCY',
    file: 'FILE',
    url: 'LINK',
    crm_currency: 'CRM',
    crm_category: 'CRM',
    crm_status: 'CRM',
    crm_company: 'CRM',
    crm_contact: 'CRM',
  }
  return map[type] ?? type.toUpperCase()
}

function typeClass(type: DealFieldType): string {
  const map: Partial<Record<DealFieldType, string>> = {
    string: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
    integer: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30',
    double: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30',
    date: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30',
    datetime: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30',
    enumeration: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30',
    boolean: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30',
    user: 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/30',
    money: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
    file: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30',
    url: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  }
  return (
    map[type] ??
    'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
  )
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
  transform: scale(0.96) translateY(8px);
  opacity: 0;
}

input[type='checkbox']:indeterminate {
  background-color: #465fff;
  border-color: #465fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
}
</style>
