export type DealFieldType =
  | 'string'
  | 'integer'
  | 'double'
  | 'date'
  | 'datetime'
  | 'enumeration'
  | 'boolean'
  | 'user'
  | 'money'
  | 'file'
  | 'url'
  | 'crm_currency'
  | 'crm_category'
  | 'crm_status'
  | 'crm_company'
  | 'crm_contact'

export type FieldPermission = 'Công khai' | 'Quản trị viên' | 'Phòng kinh doanh'

export interface DealFieldDef {
  bitrixId: string
  sectionId: string
  fieldId: string
  labelVI: string
  type: DealFieldType
  required?: boolean
  isLocked?: boolean
  isAI?: boolean
  isCustom?: boolean
  defaultVisible: boolean
}

export interface DealSectionDef {
  id: string
  name: string
  icon: string
}

export const DEAL_SECTIONS: DealSectionDef[] = [
  { id: 'general', name: 'Thông tin chung', icon: 'info' },
  { id: 'hotel', name: 'Khách sạn', icon: 'apartment' },
  { id: 'product', name: 'Sản phẩm & Demo', icon: 'inventory_2' },
  { id: 'marketing', name: 'Marketing & Lead', icon: 'campaign' },
  { id: 'lead_sdr', name: 'Lead/SDR Status', icon: 'person_search' },
  { id: 'assessment', name: 'Đánh giá', icon: 'analytics' },
  { id: 'meeting', name: '1st Meeting', icon: 'meeting_room' },
  { id: 'contract', name: 'Hợp đồng & Bảo trì', icon: 'contract' },
  { id: 'payment', name: 'Thanh toán', icon: 'payments' },
  { id: 'invoice', name: 'Hoá đơn', icon: 'receipt' },
  { id: 'commission', name: 'Hoa hồng', icon: 'percent' },
  { id: 'voucher', name: 'BD / Voucher', icon: 'card_giftcard' },
  { id: 'upsale', name: 'Up-sale & Win-back', icon: 'trending_up' },
  { id: 'lost', name: 'Lost / Drop', icon: 'cancel' },
  { id: 'system', name: 'Hệ thống', icon: 'settings' },
]

export const DEAL_FIELDS: DealFieldDef[] = [
  // === Thông tin chung ===
  { bitrixId: 'TITLE', sectionId: 'general', fieldId: 'general_deal_title', labelVI: 'Tên Deal', type: 'string', required: true, isLocked: true, isCustom: false, defaultVisible: true },
  { bitrixId: 'CATEGORY_ID', sectionId: 'general', fieldId: 'general_pipeline', labelVI: 'Pipeline', type: 'crm_category', required: true, isCustom: false, defaultVisible: true },
  { bitrixId: 'STAGE_ID', sectionId: 'general', fieldId: 'general_stage', labelVI: 'Giai đoạn', type: 'crm_status', required: true, isLocked: true, isCustom: false, defaultVisible: true },
  { bitrixId: 'UF_CRM_1713881390', sectionId: 'general', fieldId: 'general_deal_type', labelVI: 'Loại Deal', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'PROBABILITY', sectionId: 'general', fieldId: 'general_probability', labelVI: 'Tỉ lệ thắng (%)', type: 'double', isCustom: false, defaultVisible: true },
  { bitrixId: 'OPPORTUNITY', sectionId: 'general', fieldId: 'general_amount', labelVI: 'Giá trị Deal', type: 'double', required: true, isCustom: false, defaultVisible: true },
  { bitrixId: 'CURRENCY_ID', sectionId: 'general', fieldId: 'general_currency', labelVI: 'Loại tiền tệ', type: 'crm_currency', isCustom: false, defaultVisible: true },
  { bitrixId: 'TAX_VALUE', sectionId: 'general', fieldId: 'general_tax_value', labelVI: 'Thuế', type: 'double', isCustom: false, defaultVisible: false },
  { bitrixId: 'BEGINDATE', sectionId: 'general', fieldId: 'general_begin_date', labelVI: 'Ngày bắt đầu', type: 'date', isCustom: false, defaultVisible: true },
  { bitrixId: 'CLOSEDATE', sectionId: 'general', fieldId: 'general_close_date', labelVI: 'Ngày đóng dự kiến', type: 'date', isCustom: false, defaultVisible: true },
  { bitrixId: 'ASSIGNED_BY_ID', sectionId: 'general', fieldId: 'general_assigned_to', labelVI: 'Người phụ trách', type: 'user', required: true, isCustom: false, defaultVisible: true },
  { bitrixId: 'CREATED_BY_ID', sectionId: 'general', fieldId: 'general_created_by', labelVI: 'Người tạo', type: 'user', isCustom: false, defaultVisible: false },
  { bitrixId: 'MODIFY_BY_ID', sectionId: 'general', fieldId: 'general_modified_by', labelVI: 'Người sửa cuối', type: 'user', isCustom: false, defaultVisible: false },
  { bitrixId: 'DATE_CREATE', sectionId: 'general', fieldId: 'general_created_at', labelVI: 'Ngày tạo', type: 'datetime', isCustom: false, defaultVisible: true },
  { bitrixId: 'DATE_MODIFY', sectionId: 'general', fieldId: 'general_updated_at', labelVI: 'Ngày sửa cuối', type: 'datetime', isCustom: false, defaultVisible: false },
  { bitrixId: 'SOURCE_ID', sectionId: 'general', fieldId: 'general_source', labelVI: 'Nguồn', type: 'crm_status', isCustom: false, defaultVisible: true },

  // === Khách sạn ===
  { bitrixId: 'UF_CRM_6773C3A11DBFE', sectionId: 'hotel', fieldId: 'hotel_city', labelVI: 'Tỉnh/Thành phố', type: 'enumeration', required: true, isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_5B3F32B1068C7', sectionId: 'hotel', fieldId: 'hotel_rooms', labelVI: 'Số phòng', type: 'double', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_HOTEL_NAME', sectionId: 'hotel', fieldId: 'hotel_name', labelVI: 'Tên cơ sở', type: 'string', isLocked: true, isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_HOTEL_ADDRESS', sectionId: 'hotel', fieldId: 'hotel_address', labelVI: 'Địa chỉ', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_HOTEL_STARS', sectionId: 'hotel', fieldId: 'hotel_stars', labelVI: 'Hạng sao', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_HOTEL_MANAGER', sectionId: 'hotel', fieldId: 'hotel_manager', labelVI: 'Người quản lý khách sạn', type: 'user', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_HOTEL_WEBSITE', sectionId: 'hotel', fieldId: 'hotel_website', labelVI: 'Website khách sạn', type: 'url', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_HOTEL_PMS', sectionId: 'hotel', fieldId: 'hotel_pms', labelVI: 'PMS hiện tại', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_HOTEL_TYPE', sectionId: 'hotel', fieldId: 'hotel_type', labelVI: 'Loại hình cơ sở', type: 'enumeration', isCustom: true, defaultVisible: true },

  // === Sản phẩm & Demo ===
  { bitrixId: 'UF_CRM_1531008031', sectionId: 'product', fieldId: 'product_expected', labelVI: 'Sản phẩm dự kiến', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_PRODUCT_DEMO_DATE', sectionId: 'product', fieldId: 'product_demo_date', labelVI: 'Ngày demo dự kiến', type: 'date', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_PRODUCT_DEMO_DONE', sectionId: 'product', fieldId: 'product_demo_done', labelVI: 'Đã demo chưa?', type: 'boolean', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_PRODUCT_PACKAGE', sectionId: 'product', fieldId: 'product_package', labelVI: 'Gói sản phẩm', type: 'enumeration', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_PRODUCT_NOTE', sectionId: 'product', fieldId: 'product_note', labelVI: 'Ghi chú sản phẩm', type: 'string', isCustom: true, defaultVisible: false },

  // === Marketing & Lead ===
  { bitrixId: 'UF_CRM_5B3F417D10B98', sectionId: 'marketing', fieldId: 'marketing_mkt_note', labelVI: 'MKT nhắn cho Sale Admin [Lead]', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_MARKETING_CHANNEL', sectionId: 'marketing', fieldId: 'marketing_channel', labelVI: 'Kênh marketing', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_UTM_SOURCE', sectionId: 'marketing', fieldId: 'marketing_utm_source', labelVI: 'UTM Source', type: 'string', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_UTM_MEDIUM', sectionId: 'marketing', fieldId: 'marketing_utm_medium', labelVI: 'UTM Medium', type: 'string', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_UTM_CAMPAIGN', sectionId: 'marketing', fieldId: 'marketing_utm_campaign', labelVI: 'UTM Campaign', type: 'string', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_LEAD_FORM', sectionId: 'marketing', fieldId: 'marketing_lead_form', labelVI: 'Form đăng ký', type: 'string', isCustom: true, defaultVisible: true },

  // === Lead/SDR Status ===
  { bitrixId: 'UF_CRM_SDR_STATUS', sectionId: 'lead_sdr', fieldId: 'lead_sdr_status', labelVI: 'Trạng thái SDR', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_SDR_ASSIGNED', sectionId: 'lead_sdr', fieldId: 'lead_sdr_assigned', labelVI: 'SDR phụ trách', type: 'user', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_SDR_NOTE', sectionId: 'lead_sdr', fieldId: 'lead_sdr_note', labelVI: 'Ghi chú SDR', type: 'string', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_SDR_CALL_DATE', sectionId: 'lead_sdr', fieldId: 'lead_sdr_call_date', labelVI: 'Ngày gọi điện', type: 'date', isCustom: true, defaultVisible: true },

  // === Đánh giá ===
  { bitrixId: 'UF_CRM_DEAL_HEALTH', sectionId: 'assessment', fieldId: 'assessment_health', labelVI: 'Sức khỏe deal', type: 'enumeration', isAI: true, isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_INTEREST_LEVEL', sectionId: 'assessment', fieldId: 'assessment_interest', labelVI: 'Mức độ quan tâm', type: 'double', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_COMPETITOR', sectionId: 'assessment', fieldId: 'assessment_competitor', labelVI: 'Đối thủ cạnh tranh', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_WIN_REASON', sectionId: 'assessment', fieldId: 'assessment_win_reason', labelVI: 'Lý do có thể thắng', type: 'string', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_AI_SUMMARY', sectionId: 'assessment', fieldId: 'assessment_ai_summary', labelVI: 'AI tóm tắt Deal', type: 'string', isAI: true, isCustom: true, defaultVisible: true },

  // === 1st Meeting ===
  { bitrixId: 'UF_CRM_MEETING_DATE', sectionId: 'meeting', fieldId: 'meeting_date', labelVI: 'Ngày họp', type: 'datetime', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_MEETING_TYPE', sectionId: 'meeting', fieldId: 'meeting_type', labelVI: 'Hình thức họp', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_MEETING_RESULT', sectionId: 'meeting', fieldId: 'meeting_result', labelVI: 'Kết quả buổi họp', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_MEETING_NOTE', sectionId: 'meeting', fieldId: 'meeting_note', labelVI: 'Ghi chú cuộc họp', type: 'string', isCustom: true, defaultVisible: false },

  // === Hợp đồng & Bảo trì ===
  { bitrixId: 'UF_CRM_CONTRACT_NUMBER', sectionId: 'contract', fieldId: 'contract_number', labelVI: 'Số hợp đồng', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_CONTRACT_DATE', sectionId: 'contract', fieldId: 'contract_date', labelVI: 'Ngày ký hợp đồng', type: 'date', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_CONTRACT_VALUE', sectionId: 'contract', fieldId: 'contract_value', labelVI: 'Giá trị hợp đồng', type: 'double', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_MAINTENANCE_END', sectionId: 'contract', fieldId: 'contract_maintenance_end', labelVI: 'Hạn bảo trì', type: 'date', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_CONTRACT_TYPE', sectionId: 'contract', fieldId: 'contract_type', labelVI: 'Loại hợp đồng', type: 'enumeration', isCustom: true, defaultVisible: true },

  // === Thanh toán ===
  { bitrixId: 'UF_CRM_PAYMENT_TERM', sectionId: 'payment', fieldId: 'payment_term', labelVI: 'Điều khoản thanh toán', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_PAYMENT_STATUS', sectionId: 'payment', fieldId: 'payment_status', labelVI: 'Trạng thái thanh toán', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_PAYMENT_DATE1', sectionId: 'payment', fieldId: 'payment_date1', labelVI: 'Ngày TT đợt 1', type: 'date', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_PAYMENT_AMOUNT1', sectionId: 'payment', fieldId: 'payment_amount1', labelVI: 'Số tiền đợt 1', type: 'double', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_PAYMENT_DATE2', sectionId: 'payment', fieldId: 'payment_date2', labelVI: 'Ngày TT đợt 2', type: 'date', isCustom: true, defaultVisible: false },

  // === Hoá đơn ===
  { bitrixId: 'UF_CRM_INVOICE_NUMBER', sectionId: 'invoice', fieldId: 'invoice_number', labelVI: 'Số hoá đơn', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_INVOICE_DATE', sectionId: 'invoice', fieldId: 'invoice_date', labelVI: 'Ngày xuất hoá đơn', type: 'date', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_INVOICE_VALUE', sectionId: 'invoice', fieldId: 'invoice_value', labelVI: 'Giá trị hoá đơn', type: 'double', isCustom: true, defaultVisible: true },

  // === Hoa hồng ===
  { bitrixId: 'UF_CRM_COMMISSION_RATE', sectionId: 'commission', fieldId: 'commission_rate', labelVI: 'Tỉ lệ hoa hồng (%)', type: 'double', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_COMMISSION_AMOUNT', sectionId: 'commission', fieldId: 'commission_amount', labelVI: 'Số tiền hoa hồng', type: 'double', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_COMMISSION_PAID', sectionId: 'commission', fieldId: 'commission_paid', labelVI: 'Đã thanh toán HH', type: 'boolean', isCustom: true, defaultVisible: false },

  // === BD / Voucher ===
  { bitrixId: 'UF_CRM_VOUCHER_CODE', sectionId: 'voucher', fieldId: 'voucher_code', labelVI: 'Mã Voucher', type: 'string', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_VOUCHER_VALUE', sectionId: 'voucher', fieldId: 'voucher_value', labelVI: 'Giá trị Voucher', type: 'double', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_BD_NOTE', sectionId: 'voucher', fieldId: 'voucher_bd_note', labelVI: 'Ghi chú BD', type: 'string', isCustom: true, defaultVisible: false },

  // === Up-sale & Win-back ===
  { bitrixId: 'UF_CRM_UPSALE_STATUS', sectionId: 'upsale', fieldId: 'upsale_status', labelVI: 'Trạng thái Up-sale', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_UPSALE_DATE', sectionId: 'upsale', fieldId: 'upsale_date', labelVI: 'Ngày Up-sale', type: 'date', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_WINBACK_STATUS', sectionId: 'upsale', fieldId: 'winback_status', labelVI: 'Trạng thái Win-back', type: 'enumeration', isCustom: true, defaultVisible: false },

  // === Lost / Drop ===
  { bitrixId: 'UF_CRM_LOST_REASON', sectionId: 'lost', fieldId: 'lost_reason', labelVI: 'Lý do thua', type: 'enumeration', isCustom: true, defaultVisible: true },
  { bitrixId: 'UF_CRM_LOST_NOTE', sectionId: 'lost', fieldId: 'lost_note', labelVI: 'Ghi chú thua', type: 'string', isCustom: true, defaultVisible: false },
  { bitrixId: 'UF_CRM_DROP_DATE', sectionId: 'lost', fieldId: 'lost_drop_date', labelVI: 'Ngày Drop', type: 'date', isCustom: true, defaultVisible: false },

  // === Hệ thống ===
  { bitrixId: 'ID', sectionId: 'system', fieldId: 'system_id', labelVI: 'ID Deal', type: 'integer', isCustom: false, defaultVisible: true },
  { bitrixId: 'CONTACT_ID', sectionId: 'system', fieldId: 'system_contact', labelVI: 'Liên hệ', type: 'crm_contact', isCustom: false, defaultVisible: true },
  { bitrixId: 'COMPANY_ID', sectionId: 'system', fieldId: 'system_company', labelVI: 'Công ty', type: 'crm_company', isCustom: false, defaultVisible: true },
  { bitrixId: 'LEAD_ID', sectionId: 'system', fieldId: 'system_lead', labelVI: 'Lead gốc', type: 'integer', isCustom: false, defaultVisible: false },
  { bitrixId: 'COMMENTS', sectionId: 'system', fieldId: 'system_comments', labelVI: 'Ghi chú hệ thống', type: 'string', isCustom: false, defaultVisible: false },
]
