import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'salio_lead_field_config'

export interface LeadSectionDef {
  id: string
  name: string
}

export interface LeadFieldDef {
  sectionId: string
  fieldId: string
  label: string
  defaultVisible: boolean
}

export const LEAD_SECTIONS: LeadSectionDef[] = [
  { id: 'contact', name: 'Thông tin liên hệ' },
  { id: 'leadinfo', name: 'Thông tin Lead' },
]

export const LEAD_FIELDS: LeadFieldDef[] = [
  { sectionId: 'contact',  fieldId: 'contact_name',     label: 'Tên',                 defaultVisible: true },
  { sectionId: 'contact',  fieldId: 'contact_company',  label: 'Công ty',             defaultVisible: true },
  { sectionId: 'contact',  fieldId: 'contact_phone',    label: 'Điện thoại',          defaultVisible: true },
  { sectionId: 'contact',  fieldId: 'contact_email',    label: 'Email',               defaultVisible: true },
  { sectionId: 'contact',  fieldId: 'contact_assignee', label: 'Người phụ trách',     defaultVisible: true },
  { sectionId: 'leadinfo', fieldId: 'lead_stage',       label: 'Giai đoạn',           defaultVisible: true },
  { sectionId: 'leadinfo', fieldId: 'lead_source',      label: 'Nguồn',               defaultVisible: true },
  { sectionId: 'leadinfo', fieldId: 'lead_type',        label: 'Loại',                defaultVisible: true },
  { sectionId: 'leadinfo', fieldId: 'lead_date',        label: 'Ngày tạo',            defaultVisible: true },
  { sectionId: 'leadinfo', fieldId: 'lead_activity',    label: 'Hoạt động gần nhất',  defaultVisible: true },
  { sectionId: 'leadinfo', fieldId: 'lead_viewed',      label: 'Đã xem',              defaultVisible: true },
]

function buildDefaultConfig(): Record<string, boolean> {
  return Object.fromEntries(LEAD_FIELDS.map((f) => [f.fieldId, f.defaultVisible]))
}

function loadFromStorage(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, boolean>
      return { ...buildDefaultConfig(), ...parsed }
    }
  } catch {
    // ignore
  }
  return buildDefaultConfig()
}

export const useLeadFieldConfigStore = defineStore('leadFieldConfig', () => {
  const fieldConfig = ref<Record<string, boolean>>(loadFromStorage())

  function isVisible(fieldId: string): boolean {
    return fieldConfig.value[fieldId] ?? false
  }

  function isSectionVisible(sectionId: string): boolean {
    return LEAD_FIELDS.some((f) => f.sectionId === sectionId && isVisible(f.fieldId))
  }

  function isSectionFullyVisible(sectionId: string): boolean {
    return LEAD_FIELDS.filter((f) => f.sectionId === sectionId).every((f) => isVisible(f.fieldId))
  }

  function setFieldVisible(fieldId: string, visible: boolean): void {
    fieldConfig.value[fieldId] = visible
  }

  function setSectionVisible(sectionId: string, visible: boolean): void {
    LEAD_FIELDS
      .filter((f) => f.sectionId === sectionId)
      .forEach((f) => { fieldConfig.value[f.fieldId] = visible })
  }

  function visibleCountInSection(sectionId: string): number {
    return LEAD_FIELDS.filter((f) => f.sectionId === sectionId && isVisible(f.fieldId)).length
  }

  function totalCountInSection(sectionId: string): number {
    return LEAD_FIELDS.filter((f) => f.sectionId === sectionId).length
  }

  const visibleFieldIds = computed(() =>
    Object.entries(fieldConfig.value)
      .filter(([, v]) => v)
      .map(([k]) => k),
  )

  function saveConfig(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fieldConfig.value))
  }

  function resetToDefault(): void {
    fieldConfig.value = buildDefaultConfig()
    saveConfig()
  }

  return {
    fieldConfig,
    isVisible,
    isSectionVisible,
    isSectionFullyVisible,
    setFieldVisible,
    setSectionVisible,
    visibleCountInSection,
    totalCountInSection,
    visibleFieldIds,
    saveConfig,
    resetToDefault,
  }
})
