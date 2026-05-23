import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'salio_deploy_custom_fields'

export interface CustomSection { id: string; name: string }
export type CustomFieldType = 'string' | 'double' | 'date' | 'single_select' | 'multi_select'
export interface CustomFieldDef {
  id: string
  sectionId: string
  label: string
  type: CustomFieldType
  required?: boolean
  options?: string[]
}

interface FieldOverride { label?: string; required?: boolean }
interface StoredData {
  sections: CustomSection[]
  fields: CustomFieldDef[]
  overrides: Record<string, FieldOverride>
  hiddenStatic: string[]
}

function load(): StoredData {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s) as StoredData
  } catch { /* ignore */ }
  return { sections: [], fields: [], overrides: {}, hiddenStatic: [] }
}

export const useDeployCustomFieldStore = defineStore('deployCustomField', () => {
  const data = load()
  const customSections = ref<CustomSection[]>(data.sections)
  const customFields = ref<CustomFieldDef[]>(data.fields)
  const fieldOverrides = ref<Record<string, FieldOverride>>(data.overrides ?? {})
  const hiddenStaticFields = ref<string[]>(data.hiddenStatic ?? [])

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sections: customSections.value,
      fields: customFields.value,
      overrides: fieldOverrides.value,
      hiddenStatic: hiddenStaticFields.value,
    }))
  }

  function isStaticHidden(fieldId: string): boolean {
    return hiddenStaticFields.value.includes(fieldId)
  }

  function hideStaticField(fieldId: string): void {
    if (!hiddenStaticFields.value.includes(fieldId)) {
      hiddenStaticFields.value.push(fieldId)
      save()
    }
  }

  // ── Static field overrides ──────────────────────────────────────
  function getStaticLabel(fieldId: string, originalLabel: string): string {
    return fieldOverrides.value[fieldId]?.label ?? originalLabel
  }

  function isStaticRequired(fieldId: string, originalRequired: boolean): boolean {
    return fieldOverrides.value[fieldId]?.required ?? originalRequired
  }

  function setStaticOverride(fieldId: string, opts: FieldOverride): void {
    fieldOverrides.value[fieldId] = { ...fieldOverrides.value[fieldId], ...opts }
    save()
  }

  // ── Custom field CRUD ───────────────────────────────────────────
  function addSection(name: string): CustomSection {
    const section: CustomSection = { id: 'deploy_custom_' + Date.now(), name }
    customSections.value.push(section)
    save()
    return section
  }

  function deleteSection(id: string): void {
    customSections.value = customSections.value.filter(s => s.id !== id)
    customFields.value = customFields.value.filter(f => f.sectionId !== id)
    save()
  }

  function addField(sectionId: string, label: string, type: CustomFieldType, options?: string[]): void {
    customFields.value.push({ id: 'dcf_' + Date.now(), sectionId, label, type, required: false, options })
    save()
  }

  function updateCustomField(id: string, opts: { label?: string; required?: boolean; options?: string[] }): void {
    const field = customFields.value.find(f => f.id === id)
    if (!field) return
    if (opts.label !== undefined) field.label = opts.label
    if (opts.required !== undefined) field.required = opts.required
    if (opts.options !== undefined) field.options = opts.options
    save()
  }

  function deleteField(id: string): void {
    customFields.value = customFields.value.filter(f => f.id !== id)
    save()
  }

  function fieldsInSection(sectionId: string): CustomFieldDef[] {
    return customFields.value.filter(f => f.sectionId === sectionId)
  }

  return {
    customSections, customFields, fieldOverrides, hiddenStaticFields,
    getStaticLabel, isStaticRequired, setStaticOverride,
    isStaticHidden, hideStaticField,
    addSection, deleteSection,
    addField, updateCustomField, deleteField, fieldsInSection,
  }
})
