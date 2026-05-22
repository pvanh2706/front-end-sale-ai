export interface LeadFieldDef {
  sectionId: string
  fieldId: string
  labelVI: string
  type: 'string' | 'enumeration' | 'user' | 'datetime' | 'date'
  required?: boolean
  isLocked?: boolean
}

export interface LeadSectionDef {
  id: string
  name: string
}

export const LEAD_SECTIONS: LeadSectionDef[] = [
  { id: 'general', name: 'Thông tin chung' },
  { id: 'contact', name: 'Thông tin liên hệ' },
]

export const LEAD_FIELDS: LeadFieldDef[] = [
  // === Thông tin chung ===
  { sectionId: 'general', fieldId: 'lead_title', labelVI: 'Tên lead', type: 'string', required: true, isLocked: true },
  { sectionId: 'general', fieldId: 'lead_assigned', labelVI: 'Người phụ trách', type: 'user' },
  { sectionId: 'general', fieldId: 'lead_team_lead', labelVI: 'Team Lead', type: 'user' },
  { sectionId: 'general', fieldId: 'lead_source', labelVI: 'Nguồn', type: 'enumeration' },
  { sectionId: 'general', fieldId: 'lead_stage', labelVI: 'Giai đoạn', type: 'enumeration', isLocked: true },
  { sectionId: 'general', fieldId: 'lead_created_at', labelVI: 'Ngày tạo', type: 'datetime' },

  // === Thông tin liên hệ ===
  { sectionId: 'contact', fieldId: 'lead_company', labelVI: 'Tên công ty / cơ sở', type: 'string' },
  { sectionId: 'contact', fieldId: 'lead_contact_name', labelVI: 'Tên người liên hệ', type: 'string' },
  { sectionId: 'contact', fieldId: 'lead_contact_title', labelVI: 'Chức danh', type: 'string' },
  { sectionId: 'contact', fieldId: 'lead_phone', labelVI: 'Số điện thoại', type: 'string' },
  { sectionId: 'contact', fieldId: 'lead_email', labelVI: 'Email', type: 'string' },
]
