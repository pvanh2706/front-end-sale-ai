import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DEAL_FIELDS, DEAL_SECTIONS } from '@/types/dealFields'
import type { DealSectionDef, FieldPermission } from '@/types/dealFields'

const STORAGE_KEY = 'salio_deal_field_config'

export interface FieldConfig {
  visible: boolean
  permission: FieldPermission
}

function buildDefaultConfig(): Record<string, FieldConfig> {
  return Object.fromEntries(
    DEAL_FIELDS.map((f) => [f.fieldId, { visible: f.defaultVisible, permission: 'Công khai' as FieldPermission }]),
  )
}

function loadFromStorage(): Record<string, FieldConfig> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, FieldConfig>
      // Merge with defaults so newly added fields get their defaults
      const defaults = buildDefaultConfig()
      return { ...defaults, ...parsed }
    }
  } catch {
    // ignore
  }
  return buildDefaultConfig()
}

export const useDealFieldConfigStore = defineStore('dealFieldConfig', () => {
  const fieldConfig = ref<Record<string, FieldConfig>>(loadFromStorage())

  function isVisible(fieldId: string): boolean {
    return fieldConfig.value[fieldId]?.visible ?? false
  }

  const visibleSections = computed<DealSectionDef[]>(() =>
    DEAL_SECTIONS.filter((section) =>
      DEAL_FIELDS.some((f) => f.sectionId === section.id && isVisible(f.fieldId)),
    ),
  )

  const totalVisible = computed(() =>
    Object.values(fieldConfig.value).filter((c) => c.visible).length,
  )

  const totalFields = computed(() => DEAL_FIELDS.length)

  function setFieldVisible(fieldId: string, visible: boolean): void {
    if (fieldConfig.value[fieldId]) {
      fieldConfig.value[fieldId].visible = visible
    }
  }

  function setFieldPermission(fieldId: string, permission: FieldPermission): void {
    if (fieldConfig.value[fieldId]) {
      fieldConfig.value[fieldId].permission = permission
    }
  }

  function visibleCountInSection(sectionId: string): number {
    return DEAL_FIELDS.filter(
      (f) => f.sectionId === sectionId && isVisible(f.fieldId),
    ).length
  }

  function totalCountInSection(sectionId: string): number {
    return DEAL_FIELDS.filter((f) => f.sectionId === sectionId).length
  }

  function applyConfig(draft: Record<string, FieldConfig>): void {
    fieldConfig.value = { ...draft }
  }

  function saveConfig(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fieldConfig.value))
  }

  function resetToDefault(): void {
    fieldConfig.value = buildDefaultConfig()
    saveConfig()
  }

  function applyPreset(preset: 'default' | 'minimal' | 'full'): void {
    const config = buildDefaultConfig()
    if (preset === 'minimal') {
      // Only show locked/required fields
      DEAL_FIELDS.forEach((f) => {
        config[f.fieldId].visible = !!(f.isLocked || f.required)
      })
    } else if (preset === 'full') {
      DEAL_FIELDS.forEach((f) => {
        config[f.fieldId].visible = true
      })
    }
    fieldConfig.value = config
  }

  return {
    fieldConfig,
    isVisible,
    visibleSections,
    totalVisible,
    totalFields,
    setFieldVisible,
    setFieldPermission,
    visibleCountInSection,
    totalCountInSection,
    applyConfig,
    saveConfig,
    resetToDefault,
    applyPreset,
  }
})
