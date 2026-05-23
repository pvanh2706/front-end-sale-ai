export interface DeployFieldDef {
  sectionId: string
  fieldId: string
  labelVI: string
  required?: boolean
  isLocked?: boolean
}

export interface DeploySectionDef {
  id: string
  name: string
}

export const DEPLOY_SECTIONS: DeploySectionDef[] = [
  { id: 'general',    name: 'Thông tin chung' },
  { id: 'hotel',      name: 'Khách sạn' },
  { id: 'product',    name: 'Sản phẩm & Demo' },
  { id: 'marketing',  name: 'Marketing & Lead' },
  { id: 'lead_sdr',   name: 'Lead/SDR Status' },
  { id: 'assessment', name: 'Đánh giá' },
  { id: 'meeting',    name: '1st Meeting' },
  { id: 'contract',   name: 'Hợp đồng & Bảo trì' },
  { id: 'payment',    name: 'Thanh toán' },
  { id: 'invoice',    name: 'Hoá đơn' },
  { id: 'voucher',    name: 'BD / Voucher' },
  { id: 'upsale',     name: 'Up-sale & Win-back' },
  { id: 'system',     name: 'Hệ thống' },
]

export const DEPLOY_FIELDS: DeployFieldDef[] = [
  // === Thông tin chung ===
  { sectionId: 'general', fieldId: 'general_deal_title',  labelVI: 'Tên Deal',              required: true, isLocked: true },
  { sectionId: 'general', fieldId: 'general_deal_type',   labelVI: 'Loại Deal' },
  { sectionId: 'general', fieldId: 'general_probability', labelVI: 'Tỉ lệ thắng' },
  { sectionId: 'general', fieldId: 'general_begin_date',  labelVI: 'Ngày bắt đầu' },
  { sectionId: 'general', fieldId: 'general_close_date',  labelVI: 'Ngày đóng dự kiến' },
  { sectionId: 'general', fieldId: 'general_assigned_to', labelVI: 'Người phụ trách' },
  { sectionId: 'general', fieldId: 'general_source',      labelVI: 'Nguồn' },

  // === Khách sạn ===
  { sectionId: 'hotel', fieldId: 'hotel_name',    labelVI: 'Tên cơ sở',          isLocked: true },
  { sectionId: 'hotel', fieldId: 'hotel_city',    labelVI: 'Tỉnh/Thành phố' },
  { sectionId: 'hotel', fieldId: 'hotel_address', labelVI: 'Địa chỉ' },
  { sectionId: 'hotel', fieldId: 'hotel_rooms',   labelVI: 'Số phòng' },
  { sectionId: 'hotel', fieldId: 'hotel_stars',   labelVI: 'Hạng sao' },
  { sectionId: 'hotel', fieldId: 'hotel_type',    labelVI: 'Loại hình cơ sở' },
  { sectionId: 'hotel', fieldId: 'hotel_pms',     labelVI: 'PMS hiện tại' },
  { sectionId: 'hotel', fieldId: 'hotel_manager', labelVI: 'Người quản lý' },

  // === Sản phẩm & Demo ===
  { sectionId: 'product', fieldId: 'product_expected',  labelVI: 'Sản phẩm dự kiến' },
  { sectionId: 'product', fieldId: 'product_demo_date', labelVI: 'Ngày demo' },
  { sectionId: 'product', fieldId: 'product_demo_done', labelVI: 'Đã demo' },

  // === Marketing & Lead ===
  { sectionId: 'marketing', fieldId: 'marketing_channel',   labelVI: 'Kênh marketing' },
  { sectionId: 'marketing', fieldId: 'marketing_lead_form', labelVI: 'Form đăng ký' },

  // === Lead/SDR Status ===
  { sectionId: 'lead_sdr', fieldId: 'lead_sdr_status',    labelVI: 'Trạng thái SDR' },
  { sectionId: 'lead_sdr', fieldId: 'lead_sdr_call_date', labelVI: 'Ngày gọi điện' },

  // === Đánh giá ===
  { sectionId: 'assessment', fieldId: 'assessment_health',     labelVI: 'Sức khỏe deal' },
  { sectionId: 'assessment', fieldId: 'assessment_interest',   labelVI: 'Mức độ quan tâm' },
  { sectionId: 'assessment', fieldId: 'assessment_competitor', labelVI: 'Đối thủ cạnh tranh' },
  { sectionId: 'assessment', fieldId: 'assessment_ai_summary', labelVI: 'AI tóm tắt Deal' },

  // === 1st Meeting ===
  { sectionId: 'meeting', fieldId: 'meeting_date',   labelVI: 'Ngày họp' },
  { sectionId: 'meeting', fieldId: 'meeting_type',   labelVI: 'Hình thức họp' },
  { sectionId: 'meeting', fieldId: 'meeting_result', labelVI: 'Kết quả' },

  // === Hợp đồng & Bảo trì ===
  { sectionId: 'contract', fieldId: 'contract_number',          labelVI: 'Số hợp đồng' },
  { sectionId: 'contract', fieldId: 'contract_date',            labelVI: 'Ngày ký hợp đồng' },
  { sectionId: 'contract', fieldId: 'contract_type',            labelVI: 'Loại hợp đồng' },
  { sectionId: 'contract', fieldId: 'contract_maintenance_end', labelVI: 'Hạn bảo trì' },

  // === Thanh toán ===
  { sectionId: 'payment', fieldId: 'payment_term',   labelVI: 'Điều khoản thanh toán' },
  { sectionId: 'payment', fieldId: 'payment_status', labelVI: 'Trạng thái thanh toán' },
  { sectionId: 'payment', fieldId: 'payment_date1',  labelVI: 'Ngày TT đợt 1' },

  // === Hoá đơn ===
  { sectionId: 'invoice', fieldId: 'invoice_number', labelVI: 'Số hoá đơn' },
  { sectionId: 'invoice', fieldId: 'invoice_date',   labelVI: 'Ngày xuất hoá đơn' },

  // === BD / Voucher ===
  { sectionId: 'voucher', fieldId: 'voucher_code',    labelVI: 'Mã Voucher' },
  { sectionId: 'voucher', fieldId: 'voucher_bd_note', labelVI: 'Ghi chú BD' },

  // === Up-sale & Win-back ===
  { sectionId: 'upsale', fieldId: 'upsale_status', labelVI: 'Trạng thái Up-sale' },

  // === Hệ thống ===
  { sectionId: 'system', fieldId: 'system_contact', labelVI: 'Người liên hệ' },
  { sectionId: 'system', fieldId: 'system_company', labelVI: 'Công ty' },
]
