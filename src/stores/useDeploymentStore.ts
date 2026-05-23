import { defineStore } from 'pinia'
import { ref } from 'vue'

// ─── Types ─────────────────────────────────────────────────────────────────

export type PhaseStatus = 'done' | 'active' | 'trial-active' | 'waiting'
export type DeployType = 'trial' | 'direct'
export type TrialStatus = 'in_trial' | 'converted' | 'not_converted'
export type SubTaskStatus = 'todo' | 'in_progress' | 'done'
export type SubTaskPriority = 'block' | 'high' | 'medium' | 'low'

export interface DeployPhase { label: string; status: PhaseStatus }
export interface ProductTrack { product: string; phases: DeployPhase[] }
export interface DeployAssignee { name: string; initials: string; color: string }

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  assignee: string
  deadline: string
}

export interface SubTask {
  id: string
  title: string
  product: string
  status: SubTaskStatus
  priority: SubTaskPriority
  estimatedHours: number
  dueDate: string
  assignee: string
  checklist: ChecklistItem[]
  note: string
}

export interface DeployActivity {
  id: string
  type: 'note' | 'call' | 'email' | 'meeting' | 'stage_change' | 'system'
  content: string
  author: string
  authorInitials: string
  authorColor: string
  createdAt: string
}

export type DealOverview = Record<string, string>

export interface WonDealProduct {
  id: string
  name: string
  description: string
  category: string
  quantity: number
  unit: string
}

export interface DeployCard {
  id: string
  columnId: string
  customerName: string
  contactName: string
  type: DeployType
  tracks: ProductTrack[]
  assignees: DeployAssignee[]
  progress: number
  trialDaysLeft?: number
  isConverting?: boolean
  trialStartDate?: string
  trialEndDate?: string
  trialStatus?: TrialStatus
  convertedDate?: string
  notes?: string
  activities?: DeployActivity[]
  createdAt?: string
  // Contact info
  email?: string
  phone?: string
  // Personnel & deadline
  salesPerson?: string
  salesLead?: string
  deployPerson?: string
  deployLead?: string
  deployDeadline?: string
  // Sub-tasks
  subTasks?: SubTask[]
  // Products from won deal (no price)
  wonProducts?: WonDealProduct[]
  // Deal overview fields (mirrors deal Tổng quan, no commission/amount)
  dealOverview?: DealOverview
}

export interface DeployColumn {
  id: string
  name: string
  color: string
  trialOnly: boolean
}

// ─── Constants ─────────────────────────────────────────────────────────────

export const DEPLOY_COLUMNS: DeployColumn[] = [
  { id: 'new',        name: 'Mới',               color: '#42526e', trialOnly: false },
  { id: 'in_trial',   name: 'Đang dùng thử',     color: '#f79009', trialOnly: true  },
  { id: 'converting', name: 'Chuyển đổi',         color: '#6554c0', trialOnly: true  },
  { id: 'deploying',  name: 'Đang triển khai',    color: '#3450cc', trialOnly: false },
  { id: 'acceptance', name: 'Nghiệm thu',          color: '#f59e0b', trialOnly: false },
  { id: 'done',       name: 'Hoàn thành',          color: '#059669', trialOnly: false },
]

export const PRODUCTS = ['ezCloud', 'ezCms', 'ezBe', 'ezFolio', 'ezHotel', 'ezSign']

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_CARDS: DeployCard[] = [
  {
    id: 'dp-1', columnId: 'new', createdAt: '2026-05-10',
    customerName: 'LALISA HOTEL', contactName: 'Nguyễn T.Thu Hương',
    email: 'contact@lalisahotel.com', phone: '024.3825.6789',
    type: 'trial', progress: 0,
    trialStatus: 'in_trial', trialStartDate: '', trialEndDate: '',
    salesPerson: 'Nguyễn T.Thu Hương', salesLead: 'Trần Minh Khoa',
    deployPerson: '', deployLead: '', deployDeadline: '',
    tracks: [{ product: 'ezBe', phases: [
      { label: 'Setup DT', status: 'waiting' },
      { label: 'Dùng thử', status: 'waiting' },
      { label: 'TK', status: 'waiting' },
      { label: 'ĐT', status: 'waiting' },
    ]}],
    assignees: [{ name: 'Thu Hương', initials: 'TH', color: '#3450cc' }],
    notes: 'Khách hàng chờ lên kế hoạch dùng thử ezBe.',
    wonProducts: [
      { id: 'wp-1-1', name: 'ezBe Channel Manager', description: 'Quản lý kênh phân phối OTA — kết nối Booking.com, Agoda, Expedia', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
    ],
    dealOverview: {
      general_deal_title: 'LALISA HOTEL — ezBe (Dùng thử)',
      general_deal_type: 'Dùng thử',
      general_probability: '40%',
      general_begin_date: '2026-05-10',
      general_close_date: '2026-08-31',
      general_assigned_to: 'Nguyễn T.Thu Hương',
      general_source: 'Facebook Ads',
      hotel_name: 'LALISA HOTEL',
      hotel_city: 'Hà Nội',
      hotel_address: '56 Lý Thường Kiệt, Hoàn Kiếm',
      hotel_rooms: '60 phòng',
      hotel_stars: '3 sao',
      hotel_type: 'City Hotel',
      hotel_pms: 'Thủ công (Excel)',
      hotel_manager: 'Bùi Hoàng Nam',
      product_expected: 'ezBe Channel Manager',
      product_demo_date: '2026-05-08',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Facebook Ads',
      marketing_lead_form: 'Form đăng ký dùng thử tháng 5',
      lead_sdr_status: 'Qualified',
      lead_sdr_call_date: '2026-05-06',
      assessment_health: 'Trung bình',
      assessment_interest: '6.5/10',
      assessment_competitor: 'BookingKing (OTA nội địa)',
      assessment_ai_summary: 'Khách hàng quan tâm kênh OTA nhưng chưa có ngân sách rõ ràng. Cần thêm 1-2 buổi demo để chứng minh ROI.',
      meeting_date: '2026-05-08',
      meeting_type: 'Online (Google Meet)',
      meeting_result: 'Quan tâm, cần demo thêm',
      upsale_status: 'Chưa tiếp cận',
      system_contact: 'Nguyễn T.Thu Hương',
      system_company: 'LALISA HOTEL',
    },
    subTasks: [
      {
        id: 'st-1-1', title: 'Cài đặt môi trường dùng thử ezBe',
        product: 'ezBe', status: 'todo', priority: 'block', estimatedHours: 32,
        dueDate: '2026-06-05', assignee: 'Nguyễn T.Thu Hương', note: 'Cần setup server staging riêng cho khách hàng.',
        checklist: [
          { id: 'ci-1-1', label: 'Khởi tạo server staging', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-28' },
          { id: 'ci-1-2', label: 'Cài đặt ezBe trên staging', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-01' },
          { id: 'ci-1-3', label: 'Cấu hình kết nối OTA test', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-03' },
          { id: 'ci-1-4', label: 'Kiểm tra end-to-end môi trường', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-05' },
        ],
      },
      {
        id: 'st-1-2', title: 'Kiểm tra kết nối kênh Booking.com & Agoda',
        product: 'ezBe', status: 'todo', priority: 'high', estimatedHours: 10,
        dueDate: '2026-06-10', assignee: 'Nguyễn T.Thu Hương', note: '',
        checklist: [
          { id: 'ci-1-5', label: 'Tạo tài khoản test OTA', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-07' },
          { id: 'ci-1-6', label: 'Kiểm tra đồng bộ phòng & giá', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-10' },
        ],
      },
      {
        id: 'st-1-3', title: 'Chuẩn bị tài liệu hướng dẫn dùng thử',
        product: 'ezBe', status: 'todo', priority: 'medium', estimatedHours: 4,
        dueDate: '2026-06-02', assignee: 'Nguyễn T.Thu Hương', note: '',
        checklist: [
          { id: 'ci-1-7', label: 'Soạn slide giới thiệu tính năng', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-02' },
        ],
      },
      {
        id: 'st-1-4', title: 'Gửi email kick-off dùng thử cho khách hàng',
        product: 'ezBe', status: 'todo', priority: 'low', estimatedHours: 1,
        dueDate: '2026-05-27', assignee: 'Nguyễn T.Thu Hương', note: '',
        checklist: [],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Thu Hương', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-05-10 09:00' },
    ],
  },
  {
    id: 'dp-2', columnId: 'new', createdAt: '2026-05-12',
    customerName: 'Solla Hotel', contactName: 'Nguyễn T.H.Ngọc',
    email: 'info@sollahotel.vn', phone: '028.3925.4456',
    type: 'direct', progress: 0,
    salesPerson: 'Nguyễn T.H.Ngọc', salesLead: 'Trần Minh Khoa',
    deployPerson: '', deployLead: '', deployDeadline: '2026-07-30',
    tracks: [
      { product: 'ezCloud', phases: [{ label: 'TK', status: 'waiting' }, { label: 'ĐT', status: 'waiting' }] },
      { product: 'ezCms',   phases: [{ label: 'TK', status: 'waiting' }, { label: 'ĐT', status: 'waiting' }] },
    ],
    assignees: [{ name: 'Hải Ngọc', initials: 'HN', color: '#e03131' }],
    notes: 'Ký hợp đồng ngày 12/05, kick-off tuần tới.',
    wonProducts: [
      { id: 'wp-2-1', name: 'ezCloud PMS', description: 'Hệ thống quản lý khách sạn toàn diện — Front Office, Housekeeping, Revenue', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-2-2', name: 'ezCms Website', description: 'Hệ thống quản trị nội dung và đặt phòng trực tiếp qua website', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-2-3', name: 'Gói triển khai & đào tạo', description: 'Cài đặt, cấu hình hệ thống và đào tạo nhân viên tại chỗ', category: 'Dịch vụ', quantity: 1, unit: 'gói' },
    ],
    dealOverview: {
      general_deal_title: 'Solla Hotel — ezCloud + ezCms',
      general_deal_type: 'Triển khai thẳng',
      general_probability: '100%',
      general_begin_date: '2026-04-20',
      general_close_date: '2026-05-12',
      general_assigned_to: 'Nguyễn T.H.Ngọc',
      general_source: 'Referral (khách cũ giới thiệu)',
      hotel_name: 'Solla Hotel',
      hotel_city: 'TP. Hồ Chí Minh',
      hotel_address: '234 Nguyễn Thị Minh Khai, Q.3',
      hotel_rooms: '120 phòng',
      hotel_stars: '4 sao',
      hotel_type: 'Business Hotel',
      hotel_pms: 'VNS',
      hotel_manager: 'Trần Hoàng Phúc',
      product_expected: 'ezCloud PMS, ezCms',
      product_demo_date: '2026-04-28',
      product_demo_done: 'Đã demo',
      assessment_health: 'Tốt',
      assessment_interest: '8/10',
      assessment_competitor: 'Opera Cloud',
      assessment_ai_summary: 'Khách hàng cũ giới thiệu, quyết định nhanh. Cần chú trọng đào tạo vì nhân viên IT hạn chế.',
      meeting_date: '2026-05-01',
      meeting_type: 'Onsite tại khách sạn',
      meeting_result: 'Chốt deal, ký hợp đồng',
      contract_number: 'HD-2026-052',
      contract_date: '2026-05-12',
      contract_type: 'Hợp đồng Dịch vụ Phần mềm',
      contract_maintenance_end: '2027-05-12',
      payment_term: '50% khi ký HĐ, 50% khi go-live',
      payment_status: 'Đợt 1 đã thanh toán',
      payment_date1: '2026-05-13',
      invoice_number: 'INV-2026-0521',
      invoice_date: '2026-05-13',
      upsale_status: 'Chưa tiếp cận',
      system_contact: 'Nguyễn T.H.Ngọc',
      system_company: 'Solla Hotel',
    },
    subTasks: [
      {
        id: 'st-2-1', title: 'Cài đặt ezCloud server production',
        product: 'ezCloud', status: 'todo', priority: 'block', estimatedHours: 40,
        dueDate: '2026-06-15', assignee: 'Nguyễn T.H.Ngọc', note: 'Cần migration data từ VNS sang ezCloud.',
        checklist: [
          { id: 'ci-2-1', label: 'Khởi tạo và cấu hình server production', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-05' },
          { id: 'ci-2-2', label: 'Migration data phòng, giá từ VNS', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-10' },
          { id: 'ci-2-3', label: 'Cấu hình module Front Office', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-12' },
          { id: 'ci-2-4', label: 'Kiểm tra toàn bộ luồng check-in/out', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-15' },
        ],
      },
      {
        id: 'st-2-2', title: 'Cài đặt & cấu hình ezCms website',
        product: 'ezCms', status: 'todo', priority: 'high', estimatedHours: 16,
        dueDate: '2026-06-20', assignee: 'Nguyễn T.H.Ngọc', note: '',
        checklist: [
          { id: 'ci-2-5', label: 'Cài đặt ezCms trên domain của khách hàng', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-16' },
          { id: 'ci-2-6', label: 'Kết nối ezCms với ezCloud PMS', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-18' },
          { id: 'ci-2-7', label: 'Nhập nội dung và hình ảnh khách sạn', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-20' },
        ],
      },
      {
        id: 'st-2-3', title: 'Lên kế hoạch kick-off meeting',
        product: 'ezCloud', status: 'todo', priority: 'medium', estimatedHours: 3,
        dueDate: '2026-05-26', assignee: 'Nguyễn T.H.Ngọc', note: '',
        checklist: [
          { id: 'ci-2-8', label: 'Gửi agenda kick-off cho Solla Hotel', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-26' },
        ],
      },
      {
        id: 'st-2-4', title: 'Gửi email xác nhận timeline triển khai',
        product: 'ezCloud', status: 'todo', priority: 'low', estimatedHours: 1,
        dueDate: '2026-05-23', assignee: 'Nguyễn T.H.Ngọc', note: '',
        checklist: [],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Hải Ngọc', authorInitials: 'HN', authorColor: '#e03131', createdAt: '2026-05-12 10:30' },
    ],
  },
  {
    id: 'dp-3', columnId: 'in_trial', createdAt: '2026-04-20',
    customerName: 'LALU HOTEL', contactName: 'Trần Thanh Huy',
    email: 'booking@laluhotel.com', phone: '0234.381.2345',
    type: 'trial', progress: 20, trialDaysLeft: 12,
    trialStatus: 'in_trial', trialStartDate: '2026-05-04', trialEndDate: '2026-06-03',
    salesPerson: 'Trần Thanh Huy', salesLead: 'Lê Văn Hùng',
    deployPerson: '', deployLead: '', deployDeadline: '',
    tracks: [{ product: 'ezCloud', phases: [
      { label: 'Setup', status: 'done' },
      { label: 'Dùng thử', status: 'trial-active' },
      { label: 'TK', status: 'waiting' },
      { label: 'ĐT', status: 'waiting' },
    ]}],
    assignees: [{ name: 'Thanh Huy', initials: 'HY', color: '#f79009' }],
    notes: 'Khách hàng đang dùng thử ezCloud 30 ngày. Cần follow-up tuần tới.',
    wonProducts: [
      { id: 'wp-3-1', name: 'ezCloud PMS', description: 'Hệ thống quản lý khách sạn toàn diện — Front Office, Housekeeping, Revenue', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
    ],
    dealOverview: {
      general_deal_title: 'LALU HOTEL — ezCloud (Dùng thử 30 ngày)',
      general_deal_type: 'Dùng thử',
      general_probability: '65%',
      general_begin_date: '2026-04-20',
      general_close_date: '2026-07-31',
      general_assigned_to: 'Trần Thanh Huy',
      general_source: 'Google Ads',
      hotel_name: 'LALU HOTEL',
      hotel_city: 'Đà Lạt',
      hotel_address: '1 Đường Nguyên Tử Lực, Phường 8, Đà Lạt',
      hotel_rooms: '95 phòng',
      hotel_stars: '4 sao',
      hotel_type: 'Boutique Hotel',
      hotel_pms: 'Ezpms (hết hỗ trợ)',
      hotel_manager: 'Lê Thị Mai Anh',
      product_expected: 'ezCloud PMS',
      product_demo_date: '2026-04-25',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Google Ads',
      marketing_lead_form: 'Form đăng ký dùng thử',
      lead_sdr_status: 'In Progress',
      lead_sdr_call_date: '2026-04-22',
      assessment_health: 'Tốt',
      assessment_interest: '7.5/10',
      assessment_competitor: 'CloudHotel Pro',
      assessment_ai_summary: 'Khách hàng đang dùng thử tích cực. Xác suất chuyển đổi cao nếu follow-up đúng thời điểm trước khi hết hạn.',
      meeting_date: '2026-04-25',
      meeting_type: 'Onsite tại khách sạn',
      meeting_result: 'Đồng ý dùng thử',
      upsale_status: 'Chưa tiếp cận',
      system_contact: 'Trần Thanh Huy',
      system_company: 'LALU HOTEL',
    },
    subTasks: [
      {
        id: 'st-3-1', title: 'Xử lý lỗi báo cáo cuối ngày ezCloud',
        product: 'ezCloud', status: 'todo', priority: 'block', estimatedHours: 24,
        dueDate: '2026-05-25', assignee: 'Trần Thanh Huy', note: 'Khách hàng phản ánh báo cáo Revenue không khớp. Cần kiểm tra cấu hình tax và discount.',
        checklist: [
          { id: 'ci-3-1', label: 'Reproduce lỗi báo cáo trên môi trường staging', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-22' },
          { id: 'ci-3-2', label: 'Kiểm tra cấu hình tax/discount', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-23' },
          { id: 'ci-3-3', label: 'Fix và deploy hotfix', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-25' },
        ],
      },
      {
        id: 'st-3-2', title: 'Follow-up khách hàng về trải nghiệm dùng thử',
        product: 'ezCloud', status: 'in_progress', priority: 'high', estimatedHours: 8,
        dueDate: '2026-05-27', assignee: 'Trần Thanh Huy', note: 'Lên lịch gặp mặt trước khi hết hạn dùng thử.',
        checklist: [
          { id: 'ci-3-4', label: 'Gọi điện hỏi thăm trải nghiệm tuần 1', done: true, assignee: 'Trần Thanh Huy', deadline: '2026-05-10' },
          { id: 'ci-3-5', label: 'Gửi survey phản hồi', done: true, assignee: 'Trần Thanh Huy', deadline: '2026-05-15' },
          { id: 'ci-3-6', label: 'Gặp mặt review trước hết hạn', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-27' },
        ],
      },
      {
        id: 'st-3-3', title: 'Đào tạo thêm module Housekeeping',
        product: 'ezCloud', status: 'todo', priority: 'medium', estimatedHours: 5,
        dueDate: '2026-05-30', assignee: 'Trần Thanh Huy', note: '',
        checklist: [
          { id: 'ci-3-7', label: 'Soạn tài liệu đào tạo Housekeeping', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-28' },
          { id: 'ci-3-8', label: 'Đào tạo trực tiếp tại khách sạn', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-30' },
        ],
      },
      {
        id: 'st-3-4', title: 'Ghi nhận feedback dùng thử vào hệ thống',
        product: 'ezCloud', status: 'todo', priority: 'low', estimatedHours: 2,
        dueDate: '2026-06-01', assignee: 'Trần Thanh Huy', note: '',
        checklist: [],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Thanh Huy', authorInitials: 'HY', authorColor: '#f79009', createdAt: '2026-04-20 08:00' },
      { id: 'a2', type: 'system', content: 'Chuyển giai đoạn: Mới → Đang dùng thử', author: 'Thanh Huy', authorInitials: 'HY', authorColor: '#f79009', createdAt: '2026-05-04 09:00' },
      { id: 'a3', type: 'note', content: 'Setup ezCloud hoàn tất. Đã hướng dẫn nhân viên lễ tân sử dụng cơ bản.', author: 'Thanh Huy', authorInitials: 'HY', authorColor: '#f79009', createdAt: '2026-05-04 15:30' },
    ],
  },
  {
    id: 'dp-4', columnId: 'in_trial', createdAt: '2026-04-15',
    customerName: 'An Viên Resort', contactName: 'Nguyễn T.Thu Hương',
    email: 'info@anvienresort.com', phone: '0258.381.4567',
    type: 'trial', progress: 15, trialDaysLeft: 3,
    trialStatus: 'in_trial', trialStartDate: '2026-04-27', trialEndDate: '2026-05-27',
    salesPerson: 'Nguyễn T.Thu Hương', salesLead: 'Trần Minh Khoa',
    deployPerson: '', deployLead: '', deployDeadline: '',
    tracks: [{ product: 'ezCms', phases: [
      { label: 'Setup', status: 'done' },
      { label: 'Dùng thử', status: 'trial-active' },
      { label: 'TK', status: 'waiting' },
      { label: 'ĐT', status: 'waiting' },
    ]}],
    assignees: [{ name: 'Thu Hương', initials: 'TH', color: '#3450cc' }],
    notes: 'Còn 3 ngày dùng thử. Cần quyết định có ký hợp đồng chính thức không.',
    wonProducts: [
      { id: 'wp-4-1', name: 'ezCms Website', description: 'Hệ thống quản trị nội dung và đặt phòng trực tiếp qua website', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
    ],
    dealOverview: {
      general_deal_title: 'An Viên Resort — ezCms (Dùng thử, sắp hết hạn)',
      general_deal_type: 'Dùng thử',
      general_probability: '55%',
      general_begin_date: '2026-04-15',
      general_close_date: '2026-06-30',
      general_assigned_to: 'Nguyễn T.Thu Hương',
      general_source: 'Cold Outreach',
      hotel_name: 'An Viên Resort',
      hotel_city: 'Nha Trang',
      hotel_address: '18 Trần Phú, Nha Trang, Khánh Hoà',
      hotel_rooms: '78 phòng',
      hotel_stars: '3 sao',
      hotel_type: 'Beach Resort',
      hotel_pms: 'Thủ công',
      hotel_manager: 'Nguyễn Quang Vinh',
      product_expected: 'ezCms Website',
      product_demo_date: '2026-04-20',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Cold Email',
      lead_sdr_status: 'In Progress',
      lead_sdr_call_date: '2026-04-18',
      assessment_health: 'Cần chú ý',
      assessment_interest: '6/10',
      assessment_competitor: 'Wix, WordPress tự làm',
      assessment_ai_summary: 'Dùng thử chỉ còn 3 ngày. Cần liên hệ ngay — khách hàng chưa quyết định. Nguy cơ mất deal nếu không follow-up hôm nay.',
      meeting_date: '2026-04-20',
      meeting_type: 'Online (Zoom)',
      meeting_result: 'Quan tâm, cần xem thêm',
      upsale_status: 'Chưa tiếp cận',
      system_contact: 'Nguyễn T.Thu Hương',
      system_company: 'An Viên Resort',
    },
    subTasks: [
      {
        id: 'st-4-1', title: 'Liên hệ khẩn — Quyết định gia hạn dùng thử ezCms',
        product: 'ezCms', status: 'todo', priority: 'block', estimatedHours: 2,
        dueDate: '2026-05-24', assignee: 'Nguyễn T.Thu Hương', note: 'Chỉ còn 3 ngày dùng thử. Cần liên hệ ngay để chốt quyết định.',
        checklist: [
          { id: 'ci-4-1', label: 'Gọi điện cho Giám đốc Nguyễn Quang Vinh', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-23' },
          { id: 'ci-4-2', label: 'Gửi báo cáo tổng kết kết quả dùng thử', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-24' },
        ],
      },
      {
        id: 'st-4-2', title: 'Chuẩn bị báo giá & đề xuất hợp đồng chính thức',
        product: 'ezCms', status: 'todo', priority: 'high', estimatedHours: 8,
        dueDate: '2026-05-25', assignee: 'Nguyễn T.Thu Hương', note: '',
        checklist: [
          { id: 'ci-4-3', label: 'Soạn báo giá gói ezCms Website 1 năm', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-24' },
          { id: 'ci-4-4', label: 'Bổ sung gói hỗ trợ kỹ thuật', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-25' },
        ],
      },
      {
        id: 'st-4-3', title: 'Demo thêm tính năng Booking Engine trực tiếp',
        product: 'ezCms', status: 'todo', priority: 'medium', estimatedHours: 3,
        dueDate: '2026-05-26', assignee: 'Nguyễn T.Thu Hương', note: '',
        checklist: [
          { id: 'ci-4-5', label: 'Chuẩn bị demo booking online end-to-end', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-26' },
        ],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Thu Hương', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-04-15 08:00' },
      { id: 'a2', type: 'email', content: 'Gửi email nhắc nhở gia hạn dùng thử đến Giám đốc An Viên Resort.', author: 'Thu Hương', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-05-20 10:00' },
    ],
  },
  {
    id: 'dp-5', columnId: 'converting', createdAt: '2026-04-01',
    customerName: 'Aliza Homestay', contactName: 'Nguyễn T.Thu Hương',
    email: 'hello@alizahomestay.vn', phone: '0566.123.456',
    type: 'trial', progress: 35, isConverting: true,
    trialStatus: 'converted', trialStartDate: '2026-04-10', trialEndDate: '2026-05-10', convertedDate: '2026-05-18',
    salesPerson: 'Nguyễn T.Thu Hương', salesLead: 'Trần Minh Khoa',
    deployPerson: 'Trần Thanh Huy', deployLead: 'Phạm Đức Thịnh', deployDeadline: '2026-08-15',
    tracks: [{ product: 'ezCloud', phases: [
      { label: 'Dùng thử', status: 'done' },
      { label: 'Chốt HĐ', status: 'active' },
      { label: 'TK', status: 'waiting' },
      { label: 'ĐT', status: 'waiting' },
    ]}],
    assignees: [{ name: 'Thu Hương', initials: 'TH', color: '#3450cc' }],
    notes: 'Khách hàng đồng ý ký hợp đồng. Đang chờ phê duyệt nội bộ từ phía khách hàng.',
    wonProducts: [
      { id: 'wp-5-1', name: 'ezCloud PMS', description: 'Hệ thống quản lý khách sạn toàn diện — Front Office, Housekeeping, Revenue', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-5-2', name: 'Gói triển khai & đào tạo', description: 'Cài đặt, cấu hình hệ thống và đào tạo nhân viên tại chỗ', category: 'Dịch vụ', quantity: 1, unit: 'gói' },
    ],
    dealOverview: {
      general_deal_title: 'Aliza Homestay — ezCloud (Chuyển đổi)',
      general_deal_type: 'Dùng thử → Triển khai',
      general_probability: '90%',
      general_begin_date: '2026-04-01',
      general_close_date: '2026-05-18',
      general_assigned_to: 'Nguyễn T.Thu Hương',
      general_source: 'Zalo Ads',
      hotel_name: 'Aliza Homestay',
      hotel_city: 'Hội An',
      hotel_address: '45 Nguyễn Thị Minh Khai, Hội An, Quảng Nam',
      hotel_rooms: '20 phòng',
      hotel_stars: 'Không xếp hạng',
      hotel_type: 'Boutique Homestay',
      hotel_pms: 'Thủ công',
      hotel_manager: 'Trần Thị Linh',
      product_expected: 'ezCloud PMS',
      product_demo_date: '2026-04-08',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Zalo Ads',
      marketing_lead_form: 'Form đăng ký tháng 4',
      lead_sdr_status: 'Converted',
      lead_sdr_call_date: '2026-04-05',
      assessment_health: 'Tốt',
      assessment_interest: '9/10',
      assessment_competitor: 'CloudBed',
      assessment_ai_summary: 'Khách hàng hài lòng sau dùng thử, quyết định nhanh. Ưu tiên triển khai gói cơ bản trước, upsell sau 3 tháng.',
      meeting_date: '2026-05-10',
      meeting_type: 'Onsite tại homestay',
      meeting_result: 'Đồng ý ký hợp đồng',
      contract_number: 'HD-2026-058',
      contract_date: '2026-05-18',
      contract_type: 'Hợp đồng Dịch vụ Phần mềm',
      contract_maintenance_end: '2027-05-18',
      payment_term: '100% khi ký hợp đồng',
      payment_status: 'Đã thanh toán',
      payment_date1: '2026-05-18',
      invoice_number: 'INV-2026-0558',
      invoice_date: '2026-05-18',
      upsale_status: 'Dự kiến ezBe sau 3 tháng',
      system_contact: 'Nguyễn T.Thu Hương',
      system_company: 'Aliza Homestay',
    },
    subTasks: [
      {
        id: 'st-5-1', title: 'Hoàn thiện & ký kết hợp đồng triển khai ezCloud',
        product: 'ezCloud', status: 'in_progress', priority: 'block', estimatedHours: 16,
        dueDate: '2026-05-28', assignee: 'Nguyễn T.Thu Hương', note: 'Đang chờ phê duyệt nội bộ từ phía Aliza Homestay.',
        checklist: [
          { id: 'ci-5-1', label: 'Gửi hợp đồng bản nháp cho khách hàng', done: true, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-19' },
          { id: 'ci-5-2', label: 'Họp review điều khoản hợp đồng', done: true, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-22' },
          { id: 'ci-5-3', label: 'Điều chỉnh phụ lục theo yêu cầu', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-26' },
          { id: 'ci-5-4', label: 'Ký kết hợp đồng chính thức', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-05-28' },
        ],
      },
      {
        id: 'st-5-2', title: 'Lên kế hoạch triển khai chi tiết (Project Plan)',
        product: 'ezCloud', status: 'todo', priority: 'high', estimatedHours: 12,
        dueDate: '2026-06-05', assignee: 'Trần Thanh Huy', note: '',
        checklist: [
          { id: 'ci-5-5', label: 'Phân tích yêu cầu kỹ thuật Aliza Homestay', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-30' },
          { id: 'ci-5-6', label: 'Lập lịch triển khai từng giai đoạn', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-02' },
          { id: 'ci-5-7', label: 'Xác nhận kế hoạch với khách hàng', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-05' },
        ],
      },
      {
        id: 'st-5-3', title: 'Kick-off meeting chính thức với Aliza Homestay',
        product: 'ezCloud', status: 'todo', priority: 'medium', estimatedHours: 3,
        dueDate: '2026-06-07', assignee: 'Nguyễn T.Thu Hương', note: '',
        checklist: [
          { id: 'ci-5-8', label: 'Chuẩn bị agenda kick-off', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-05' },
          { id: 'ci-5-9', label: 'Tổ chức họp kick-off tại homestay', done: false, assignee: 'Nguyễn T.Thu Hương', deadline: '2026-06-07' },
        ],
      },
      {
        id: 'st-5-4', title: 'Chuẩn bị tài liệu onboarding cho nhân viên',
        product: 'ezCloud', status: 'todo', priority: 'low', estimatedHours: 2,
        dueDate: '2026-06-10', assignee: 'Trần Thanh Huy', note: '',
        checklist: [],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Thu Hương', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-04-01 08:00' },
      { id: 'a2', type: 'meeting', content: 'Khách hàng hài lòng và muốn chuyển sang sử dụng chính thức.', author: 'Thu Hương', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-05-15 14:00' },
      { id: 'a3', type: 'system', content: 'Chuyển giai đoạn: Đang dùng thử → Chuyển đổi', author: 'Thu Hương', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-05-18 09:00' },
    ],
  },
  {
    id: 'dp-6', columnId: 'deploying', createdAt: '2026-03-15',
    customerName: 'Pencil Hotel', contactName: 'Trương Hải Thành',
    email: 'sale@pencilhotel.vn', phone: '024.3726.8899',
    type: 'trial', progress: 55,
    trialStatus: 'converted', trialStartDate: '2026-03-20', trialEndDate: '2026-04-20', convertedDate: '2026-04-25',
    salesPerson: 'Trương Hải Thành', salesLead: 'Lê Văn Hùng',
    deployPerson: 'Nguyễn T.H.Ngọc', deployLead: 'Phạm Đức Thịnh', deployDeadline: '2026-06-30',
    tracks: [
      { product: 'ezFolio', phases: [
        { label: 'Dùng thử', status: 'done' },
        { label: 'TK', status: 'done' },
        { label: 'ĐT', status: 'active' },
      ]},
      { product: 'ezBe', phases: [
        { label: 'Dùng thử', status: 'done' },
        { label: 'TK', status: 'active' },
        { label: 'ĐT', status: 'waiting' },
      ]},
    ],
    assignees: [
      { name: 'Hải Thành', initials: 'TH', color: '#3450cc' },
      { name: 'Hải Ngọc',  initials: 'HN', color: '#e03131' },
    ],
    notes: 'ezFolio đang đào tạo nhân viên, ezBe đang triển khai cấu hình.',
    wonProducts: [
      { id: 'wp-6-1', name: 'ezFolio POS', description: 'Hệ thống điểm bán hàng tích hợp — F&B, minibar, dịch vụ bổ sung', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-6-2', name: 'ezBe Channel Manager', description: 'Quản lý kênh phân phối OTA — kết nối Booking.com, Agoda, Expedia', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-6-3', name: 'Gói triển khai & đào tạo', description: 'Cài đặt, cấu hình hệ thống và đào tạo nhân viên tại chỗ (2 sản phẩm)', category: 'Dịch vụ', quantity: 1, unit: 'gói' },
      { id: 'wp-6-4', name: 'Hỗ trợ kỹ thuật 12 tháng', description: 'Hỗ trợ online & onsite, phản hồi trong 4h, bảo trì định kỳ', category: 'Dịch vụ', quantity: 12, unit: 'tháng' },
    ],
    dealOverview: {
      general_deal_title: 'Pencil Hotel — ezFolio + ezBe',
      general_deal_type: 'Dùng thử → Triển khai',
      general_probability: '100%',
      general_begin_date: '2026-03-15',
      general_close_date: '2026-04-25',
      general_assigned_to: 'Trương Hải Thành',
      general_source: 'Referral (partner giới thiệu)',
      hotel_name: 'Pencil Hotel',
      hotel_city: 'Đà Nẵng',
      hotel_address: '12 Trần Phú, Hải Châu, Đà Nẵng',
      hotel_rooms: '85 phòng',
      hotel_stars: '4 sao',
      hotel_type: 'City Hotel',
      hotel_pms: 'Opera V5',
      hotel_manager: 'Nguyễn Thanh Tùng',
      product_expected: 'ezFolio POS, ezBe Channel Manager',
      product_demo_date: '2026-03-22',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Partner Referral',
      lead_sdr_status: 'Converted',
      lead_sdr_call_date: '2026-03-18',
      assessment_health: 'Tốt',
      assessment_interest: '8.5/10',
      assessment_competitor: 'Apaleo, Cloudbeds',
      assessment_ai_summary: 'Đối tác giới thiệu — niềm tin cao, quyết định nhanh. Cần chú trọng tích hợp ezBe với Opera V5 đang dùng.',
      meeting_date: '2026-04-15',
      meeting_type: 'Onsite tại khách sạn',
      meeting_result: 'Chốt deal, ký hợp đồng',
      contract_number: 'HD-2026-043',
      contract_date: '2026-04-25',
      contract_type: 'Hợp đồng Dịch vụ Phần mềm',
      contract_maintenance_end: '2027-04-25',
      payment_term: '50% khi ký, 50% khi nghiệm thu',
      payment_status: 'Đợt 1 đã thanh toán',
      payment_date1: '2026-04-26',
      invoice_number: 'INV-2026-0432',
      invoice_date: '2026-04-26',
      upsale_status: 'Đang tiếp cận ezCloud',
      system_contact: 'Trương Hải Thành',
      system_company: 'Pencil Hotel',
    },
    subTasks: [
      {
        id: 'st-6-1', title: 'Cài đặt & cấu hình ezFolio production',
        product: 'ezFolio', status: 'done', priority: 'block', estimatedHours: 32, dueDate: '2026-05-15',
        assignee: 'Nguyễn T.H.Ngọc', note: '',
        checklist: [
          { id: 'ci-1', label: 'Cài đặt server production', done: true, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-10' },
          { id: 'ci-2', label: 'Import dữ liệu phòng, giá', done: true, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-12' },
          { id: 'ci-3', label: 'Cấu hình PMS connection', done: true, assignee: 'Trương Hải Thành', deadline: '2026-05-14' },
          { id: 'ci-4', label: 'Kiểm tra end-to-end', done: true, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-15' },
        ],
      },
      {
        id: 'st-6-2', title: 'Đào tạo nhân viên lễ tân ezFolio',
        product: 'ezFolio', status: 'in_progress', priority: 'high', estimatedHours: 20, dueDate: '2026-06-01',
        assignee: 'Trương Hải Thành', note: 'Ca tối chưa sắp xếp được lịch.',
        checklist: [
          { id: 'ci-5', label: 'Đào tạo quản trị viên', done: true, assignee: 'Trương Hải Thành', deadline: '2026-05-20' },
          { id: 'ci-6', label: 'Đào tạo ca lễ tân sáng', done: true, assignee: 'Trương Hải Thành', deadline: '2026-05-22' },
          { id: 'ci-7', label: 'Đào tạo ca lễ tân tối', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-28' },
          { id: 'ci-8', label: 'Đào tạo thu ngân', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-01' },
          { id: 'ci-9', label: 'Nghiệm thu & ký biên bản', done: false, assignee: 'Trương Hải Thành', deadline: '2026-06-01' },
        ],
      },
      {
        id: 'st-6-3', title: 'Triển khai & cấu hình ezBe',
        product: 'ezBe', status: 'in_progress', priority: 'high', estimatedHours: 14, dueDate: '2026-06-15',
        assignee: 'Nguyễn T.H.Ngọc', note: '',
        checklist: [
          { id: 'ci-10', label: 'Cài đặt ezBe trên server', done: true, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-18' },
          { id: 'ci-11', label: 'Kết nối với ezFolio', done: true, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-05-20' },
          { id: 'ci-12', label: 'Cấu hình kênh OTA (Booking, Agoda)', done: false, assignee: 'Nguyễn T.H.Ngọc', deadline: '2026-06-01' },
          { id: 'ci-13', label: 'Test booking từ các kênh', done: false, assignee: 'Trương Hải Thành', deadline: '2026-06-08' },
          { id: 'ci-14', label: 'Go-live ezBe', done: false, assignee: 'Trương Hải Thành', deadline: '2026-06-15' },
        ],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Trương Hải Thành', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-03-15 08:00' },
      { id: 'a2', type: 'system', content: 'Chuyển đổi thành công – ký hợp đồng chính thức', author: 'Trương Hải Thành', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-04-25 10:00' },
      { id: 'a3', type: 'note', content: 'Hoàn tất triển khai ezFolio. Bắt đầu đào tạo lễ tân và thu ngân.', author: 'Trương Hải Thành', authorInitials: 'TH', authorColor: '#3450cc', createdAt: '2026-05-10 16:00' },
    ],
  },
  {
    id: 'dp-7', columnId: 'deploying', createdAt: '2026-05-01',
    customerName: 'S Hotel', contactName: 'Ngô Bảo Khánh',
    email: 'reservation@shotel.com', phone: '028.3812.7766',
    type: 'direct', progress: 25,
    salesPerson: 'Ngô Bảo Khánh', salesLead: 'Trần Minh Khoa',
    deployPerson: 'Trần Thanh Huy', deployLead: 'Phạm Đức Thịnh', deployDeadline: '2026-07-15',
    tracks: [{ product: 'ezCloud', phases: [
      { label: 'TK', status: 'active' },
      { label: 'ĐT', status: 'waiting' },
    ]}],
    assignees: [{ name: 'Bảo Khánh', initials: 'NK', color: '#059669' }],
    notes: 'Đang cấu hình ezCloud production. Dự kiến xong trong 2 tuần.',
    wonProducts: [
      { id: 'wp-7-1', name: 'ezCloud PMS', description: 'Hệ thống quản lý khách sạn toàn diện — Front Office, Housekeeping, Revenue, F&B module', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-7-2', name: 'Gói triển khai & đào tạo', description: 'Cài đặt, cấu hình hệ thống và đào tạo nhân viên tại chỗ', category: 'Dịch vụ', quantity: 1, unit: 'gói' },
      { id: 'wp-7-3', name: 'Hỗ trợ kỹ thuật 12 tháng', description: 'Hỗ trợ online & onsite, phản hồi trong 4h', category: 'Dịch vụ', quantity: 12, unit: 'tháng' },
    ],
    dealOverview: {
      general_deal_title: 'S Hotel — ezCloud PMS (Triển khai thẳng)',
      general_deal_type: 'Triển khai thẳng',
      general_probability: '100%',
      general_begin_date: '2026-04-10',
      general_close_date: '2026-05-01',
      general_assigned_to: 'Ngô Bảo Khánh',
      general_source: 'Website (Inbound)',
      hotel_name: 'S Hotel',
      hotel_city: 'Hà Nội',
      hotel_address: '18 Lê Thái Tổ, Hoàn Kiếm, Hà Nội',
      hotel_rooms: '150 phòng',
      hotel_stars: '5 sao',
      hotel_type: 'City Hotel',
      hotel_pms: 'Opera Cloud (sắp hết hạn)',
      hotel_manager: 'Phạm Hoàng Minh',
      product_expected: 'ezCloud PMS',
      product_demo_date: '2026-04-18',
      product_demo_done: 'Đã demo 2 buổi',
      marketing_channel: 'Website Inbound',
      lead_sdr_status: 'Converted',
      lead_sdr_call_date: '2026-04-12',
      assessment_health: 'Tốt',
      assessment_interest: '9/10',
      assessment_competitor: 'Opera Cloud',
      assessment_ai_summary: 'Khách hàng lớn, yêu cầu cao về tính năng F&B và báo cáo doanh thu. Cần đảm bảo migration data từ Opera Cloud chính xác.',
      meeting_date: '2026-04-25',
      meeting_type: 'Onsite tại khách sạn',
      meeting_result: 'Chốt deal, ký hợp đồng',
      contract_number: 'HD-2026-049',
      contract_date: '2026-05-01',
      contract_type: 'Hợp đồng Dịch vụ Phần mềm',
      contract_maintenance_end: '2027-05-01',
      payment_term: '30% khi ký, 40% go-live, 30% nghiệm thu',
      payment_status: 'Đợt 1 đã thanh toán',
      payment_date1: '2026-05-02',
      invoice_number: 'INV-2026-0490',
      invoice_date: '2026-05-02',
      upsale_status: 'Đang tiếp cận ezBe + ezFolio',
      system_contact: 'Ngô Bảo Khánh',
      system_company: 'S Hotel',
    },
    subTasks: [
      {
        id: 'st-7-1', title: 'Cài đặt & cấu hình ezCloud (incl. module F&B)',
        product: 'ezCloud', status: 'in_progress', priority: 'block', estimatedHours: 40, dueDate: '2026-06-10',
        assignee: 'Trần Thanh Huy', note: 'Cần thêm module F&B theo yêu cầu. Migration từ Opera Cloud.',
        checklist: [
          { id: 'ci-20', label: 'Thu thập yêu cầu chi tiết từ IT Manager', done: true, assignee: 'Trần Thanh Huy', deadline: '2026-05-08' },
          { id: 'ci-21', label: 'Cài đặt server production', done: true, assignee: 'Trần Thanh Huy', deadline: '2026-05-15' },
          { id: 'ci-22', label: 'Import dữ liệu phòng và giá', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-25' },
          { id: 'ci-23', label: 'Cấu hình module F&B', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-01' },
          { id: 'ci-24', label: 'Kiểm tra tích hợp thanh toán', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-05' },
        ],
      },
      {
        id: 'st-7-2', title: 'Đào tạo nhân viên vận hành ezCloud',
        product: 'ezCloud', status: 'todo', priority: 'high', estimatedHours: 16, dueDate: '2026-06-25',
        assignee: 'Trần Thanh Huy', note: 'Khách sạn 150 phòng — cần đào tạo 3 ca, khoảng 15 nhân viên.',
        checklist: [
          { id: 'ci-25', label: 'Đào tạo quản trị viên hệ thống', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-15' },
          { id: 'ci-26', label: 'Đào tạo lễ tân ca sáng & chiều', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-20' },
          { id: 'ci-27', label: 'Đào tạo thu ngân & F&B', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-06-25' },
        ],
      },
      {
        id: 'st-7-3', title: 'Kiểm tra & xác nhận migration data từ Opera Cloud',
        product: 'ezCloud', status: 'todo', priority: 'medium', estimatedHours: 6, dueDate: '2026-05-30',
        assignee: 'Trần Thanh Huy', note: '',
        checklist: [
          { id: 'ci-28', label: 'Export toàn bộ data từ Opera Cloud', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-27' },
          { id: 'ci-29', label: 'Kiểm tra data integrity sau migration', done: false, assignee: 'Trần Thanh Huy', deadline: '2026-05-30' },
        ],
      },
      {
        id: 'st-7-4', title: 'Cập nhật tài liệu kỹ thuật dự án',
        product: 'ezCloud', status: 'todo', priority: 'low', estimatedHours: 2, dueDate: '2026-07-01',
        assignee: 'Trần Thanh Huy', note: '',
        checklist: [],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Bảo Khánh', authorInitials: 'NK', authorColor: '#059669', createdAt: '2026-05-01 09:00' },
      { id: 'a2', type: 'meeting', content: 'Kick-off meeting – xác nhận yêu cầu và lên lịch triển khai.', author: 'Bảo Khánh', authorInitials: 'NK', authorColor: '#059669', createdAt: '2026-05-05 10:00' },
    ],
  },
  {
    id: 'dp-8', columnId: 'acceptance', createdAt: '2026-03-01',
    customerName: 'Champs Elysees', contactName: 'Bùi Đức Trung Hiếu',
    email: 'booking@champshotel.vn', phone: '0292.381.5566',
    type: 'direct', progress: 85,
    salesPerson: 'Bùi Đức Trung Hiếu', salesLead: 'Lê Văn Hùng',
    deployPerson: 'Bùi Đức Trung Hiếu', deployLead: 'Phạm Đức Thịnh', deployDeadline: '2026-06-05',
    tracks: [
      { product: 'ezFolio', phases: [{ label: 'TK', status: 'done' }, { label: 'ĐT', status: 'done' }] },
      { product: 'ezCms',   phases: [{ label: 'TK', status: 'done' }, { label: 'ĐT', status: 'active' }] },
    ],
    assignees: [{ name: 'Trung Hiếu', initials: 'TH', color: '#6554c0' }],
    notes: 'ezFolio đã xong. ezCms đang đào tạo nhân viên marketing. Nghiệm thu dự kiến cuối tuần.',
    wonProducts: [
      { id: 'wp-8-1', name: 'ezFolio POS', description: 'Hệ thống điểm bán hàng tích hợp — F&B, minibar, dịch vụ bổ sung', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-8-2', name: 'ezCms Website', description: 'Hệ thống quản trị nội dung và đặt phòng trực tiếp qua website', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-8-3', name: 'Gói triển khai & đào tạo', description: 'Cài đặt, cấu hình 2 hệ thống và đào tạo nhân viên tại chỗ', category: 'Dịch vụ', quantity: 1, unit: 'gói' },
      { id: 'wp-8-4', name: 'Hỗ trợ kỹ thuật 12 tháng', description: 'Hỗ trợ online & onsite, phản hồi trong 4h, bảo trì định kỳ', category: 'Dịch vụ', quantity: 12, unit: 'tháng' },
    ],
    dealOverview: {
      general_deal_title: 'Champs Elysees — ezFolio + ezCms',
      general_deal_type: 'Triển khai thẳng',
      general_probability: '100%',
      general_begin_date: '2026-03-01',
      general_close_date: '2026-03-20',
      general_assigned_to: 'Bùi Đức Trung Hiếu',
      general_source: 'Cold Call',
      hotel_name: 'Champs Elysees Hotel',
      hotel_city: 'TP. Hồ Chí Minh',
      hotel_address: '88 Đồng Khởi, Quận 1, TP.HCM',
      hotel_rooms: '110 phòng',
      hotel_stars: '4 sao',
      hotel_type: 'Boutique Hotel',
      hotel_pms: 'HMS (hết hỗ trợ)',
      hotel_manager: 'Lê Phương Anh',
      product_expected: 'ezFolio POS, ezCms Website',
      product_demo_date: '2026-03-05',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Cold Call',
      lead_sdr_status: 'Converted',
      lead_sdr_call_date: '2026-03-02',
      assessment_health: 'Tốt',
      assessment_interest: '8/10',
      assessment_competitor: 'InfoGenesis POS',
      assessment_ai_summary: 'Khách hàng cần thay thế PMS cũ. Hai sản phẩm bổ trợ nhau tốt — ezFolio cho F&B, ezCms cho marketing online. Gần hoàn thành nghiệm thu.',
      meeting_date: '2026-03-10',
      meeting_type: 'Onsite tại khách sạn',
      meeting_result: 'Chốt deal, ký hợp đồng',
      contract_number: 'HD-2026-031',
      contract_date: '2026-03-20',
      contract_type: 'Hợp đồng Dịch vụ Phần mềm',
      contract_maintenance_end: '2027-03-20',
      payment_term: '50% khi ký, 50% khi nghiệm thu',
      payment_status: 'Đợt 1 đã thanh toán, đợt 2 chờ nghiệm thu',
      payment_date1: '2026-03-21',
      invoice_number: 'INV-2026-0315',
      invoice_date: '2026-03-21',
      upsale_status: 'Đang tiếp cận thêm ezCloud',
      system_contact: 'Bùi Đức Trung Hiếu',
      system_company: 'Champs Elysees Hotel',
    },
    subTasks: [
      {
        id: 'st-8-1', title: 'Nghiệm thu ezFolio',
        product: 'ezFolio', status: 'done', priority: 'block', estimatedHours: 24, dueDate: '2026-04-20',
        assignee: 'Bùi Đức Trung Hiếu', note: '',
        checklist: [
          { id: 'ci-30', label: 'Kiểm tra toàn bộ chức năng theo checklist', done: true, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-04-18' },
          { id: 'ci-31', label: 'Khách hàng xác nhận nghiệm thu', done: true, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-04-19' },
          { id: 'ci-32', label: 'Ký biên bản nghiệm thu', done: true, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-04-20' },
        ],
      },
      {
        id: 'st-8-2', title: 'Đào tạo nhân viên marketing ezCms',
        product: 'ezCms', status: 'in_progress', priority: 'high', estimatedHours: 10, dueDate: '2026-06-01',
        assignee: 'Bùi Đức Trung Hiếu', note: 'Team marketing 5 người, cần 2 buổi.',
        checklist: [
          { id: 'ci-33', label: 'Đào tạo quản trị viên CMS', done: true, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-05-15' },
          { id: 'ci-34', label: 'Đào tạo nhân viên marketing', done: true, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-05-22' },
          { id: 'ci-35', label: 'Đào tạo content writer', done: false, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-05-28' },
          { id: 'ci-36', label: 'Nghiệm thu & ký biên bản ezCms', done: false, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-06-01' },
        ],
      },
      {
        id: 'st-8-3', title: 'Nghiệm thu tổng thể & bàn giao dự án',
        product: 'ezCms', status: 'todo', priority: 'medium', estimatedHours: 4, dueDate: '2026-06-05',
        assignee: 'Bùi Đức Trung Hiếu', note: 'Bàn giao đồng thời ezFolio + ezCms.',
        checklist: [
          { id: 'ci-37', label: 'Chuẩn bị biên bản bàn giao tổng thể', done: false, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-06-03' },
          { id: 'ci-38', label: 'Ký biên bản bàn giao với khách hàng', done: false, assignee: 'Bùi Đức Trung Hiếu', deadline: '2026-06-05' },
        ],
      },
      {
        id: 'st-8-4', title: 'Gửi hóa đơn thanh toán đợt 2',
        product: 'ezFolio', status: 'todo', priority: 'low', estimatedHours: 1, dueDate: '2026-06-06',
        assignee: 'Bùi Đức Trung Hiếu', note: '50% còn lại sau nghiệm thu.',
        checklist: [],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Trung Hiếu', authorInitials: 'TH', authorColor: '#6554c0', createdAt: '2026-03-01 08:00' },
      { id: 'a2', type: 'note', content: 'Hoàn thành triển khai và đào tạo ezFolio. Khách hàng ký biên bản nghiệm thu.', author: 'Trung Hiếu', authorInitials: 'TH', authorColor: '#6554c0', createdAt: '2026-04-20 17:00' },
    ],
  },
  {
    id: 'dp-9', columnId: 'done', createdAt: '2026-02-01',
    customerName: 'Bella VT Hotel', contactName: 'Trần Thanh Huy',
    email: 'info@bellavthotel.com', phone: '0254.381.3344',
    type: 'direct', progress: 100,
    salesPerson: 'Trần Thanh Huy', salesLead: 'Lê Văn Hùng',
    deployPerson: 'Trần Thanh Huy', deployLead: 'Phạm Đức Thịnh', deployDeadline: '2026-03-15',
    tracks: [{ product: 'ezCms', phases: [
      { label: 'TK', status: 'done' },
      { label: 'ĐT', status: 'done' },
    ]}],
    assignees: [{ name: 'Thanh Huy', initials: 'HY', color: '#f79009' }],
    notes: 'Dự án hoàn thành. Khách hàng đã ký nghiệm thu và thanh toán đầy đủ.',
    wonProducts: [
      { id: 'wp-9-1', name: 'ezCms Website', description: 'Hệ thống quản trị nội dung và đặt phòng trực tiếp qua website', category: 'Phần mềm', quantity: 1, unit: 'license/năm' },
      { id: 'wp-9-2', name: 'Gói triển khai & đào tạo', description: 'Cài đặt, cấu hình hệ thống và đào tạo nhân viên tại chỗ', category: 'Dịch vụ', quantity: 1, unit: 'gói' },
    ],
    dealOverview: {
      general_deal_title: 'Bella VT Hotel — ezCms (Hoàn thành)',
      general_deal_type: 'Triển khai thẳng',
      general_probability: '100%',
      general_begin_date: '2026-02-01',
      general_close_date: '2026-02-15',
      general_assigned_to: 'Trần Thanh Huy',
      general_source: 'Referral (khách cũ)',
      hotel_name: 'Bella VT Hotel',
      hotel_city: 'Vũng Tàu',
      hotel_address: '22 Lê Lợi, Vũng Tàu, Bà Rịa - Vũng Tàu',
      hotel_rooms: '65 phòng',
      hotel_stars: '3 sao',
      hotel_type: 'Beach Hotel',
      hotel_pms: 'Thủ công (Excel)',
      hotel_manager: 'Hoàng Văn Đức',
      product_expected: 'ezCms Website',
      product_demo_date: '2026-02-05',
      product_demo_done: 'Đã demo',
      marketing_channel: 'Referral',
      lead_sdr_status: 'Converted',
      lead_sdr_call_date: '2026-02-03',
      assessment_health: 'Tốt',
      assessment_interest: '9.5/10',
      assessment_competitor: 'Không có',
      assessment_ai_summary: 'Dự án đã hoàn thành thành công. Khách hàng hài lòng và đã giới thiệu thêm 2 khách sạn khác. Tiềm năng upsell ezCloud trong Q3/2026.',
      meeting_date: '2026-02-10',
      meeting_type: 'Onsite tại khách sạn',
      meeting_result: 'Chốt deal, ký hợp đồng',
      contract_number: 'HD-2026-018',
      contract_date: '2026-02-15',
      contract_type: 'Hợp đồng Dịch vụ Phần mềm',
      contract_maintenance_end: '2027-02-15',
      payment_term: '100% khi ký hợp đồng',
      payment_status: 'Đã thanh toán đầy đủ',
      payment_date1: '2026-02-15',
      invoice_number: 'INV-2026-0182',
      invoice_date: '2026-02-15',
      upsale_status: 'Tiềm năng ezCloud — Q3/2026',
      system_contact: 'Trần Thanh Huy',
      system_company: 'Bella VT Hotel',
    },
    subTasks: [
      {
        id: 'st-9-1', title: 'Hỗ trợ kỹ thuật sau go-live (tháng đầu)',
        product: 'ezCms', status: 'done', priority: 'medium', estimatedHours: 6, dueDate: '2026-03-15',
        assignee: 'Trần Thanh Huy', note: 'Hỗ trợ các vấn đề phát sinh trong tháng đầu vận hành.',
        checklist: [
          { id: 'ci-9-1', label: 'Theo dõi và xử lý ticket hỗ trợ', done: true, assignee: 'Trần Thanh Huy', deadline: '2026-03-15' },
          { id: 'ci-9-2', label: 'Báo cáo tổng kết hỗ trợ tháng đầu', done: true, assignee: 'Trần Thanh Huy', deadline: '2026-03-15' },
        ],
      },
    ],
    activities: [
      { id: 'a1', type: 'system', content: 'Dự án được tạo', author: 'Thanh Huy', authorInitials: 'HY', authorColor: '#f79009', createdAt: '2026-02-01 08:00' },
      { id: 'a2', type: 'system', content: 'Chuyển giai đoạn: Nghiệm thu → Hoàn thành', author: 'Thanh Huy', authorInitials: 'HY', authorColor: '#f79009', createdAt: '2026-03-15 10:00' },
    ],
  },
]

// ─── Store ─────────────────────────────────────────────────────────────────

export const useDeploymentStore = defineStore('deployment', () => {
  const columns = ref<DeployColumn[]>(DEPLOY_COLUMNS.map((c) => ({ ...c })))

  const cards = ref<DeployCard[]>(
    MOCK_CARDS.map((c) => ({
      ...c,
      tracks: c.tracks.map((t) => ({ ...t, phases: [...t.phases] })),
      activities: c.activities ? [...c.activities] : [],
      subTasks: c.subTasks ? c.subTasks.map((st) => ({
        ...st,
        checklist: st.checklist.map((i) => ({ ...i })),
      })) : [],
      wonProducts: c.wonProducts ? [...c.wonProducts] : [],
      dealOverview: c.dealOverview ? { ...c.dealOverview } : {},
    })),
  )

  function getById(id: string): DeployCard | null {
    return cards.value.find((c) => c.id === id) ?? null
  }

  function updateCard(id: string, updates: Partial<DeployCard>): void {
    const idx = cards.value.findIndex((c) => c.id === id)
    if (idx !== -1) cards.value[idx] = { ...cards.value[idx], ...updates }
  }

  function updatePhase(cardId: string, product: string, phaseIndex: number, status: PhaseStatus): void {
    const card = cards.value.find((c) => c.id === cardId)
    if (!card) return
    const track = card.tracks.find((t) => t.product === product)
    if (!track) return
    track.phases[phaseIndex].status = status
    const total = card.tracks.reduce((s, t) => s + t.phases.length, 0)
    const done  = card.tracks.reduce((s, t) => s + t.phases.filter((p) => p.status === 'done').length, 0)
    card.progress = total > 0 ? Math.round((done / total) * 100) : 0
  }

  function addSubTask(cardId: string, subTask: SubTask): void {
    const card = cards.value.find((c) => c.id === cardId)
    if (!card) return
    if (!card.subTasks) card.subTasks = []
    card.subTasks.push(subTask)
  }

  function updateSubTask(cardId: string, subTaskId: string, updates: Partial<SubTask>): void {
    const card = cards.value.find((c) => c.id === cardId)
    if (!card?.subTasks) return
    const idx = card.subTasks.findIndex((s) => s.id === subTaskId)
    if (idx !== -1) card.subTasks[idx] = { ...card.subTasks[idx], ...updates }
  }

  function deleteSubTask(cardId: string, subTaskId: string): void {
    const card = cards.value.find((c) => c.id === cardId)
    if (!card?.subTasks) return
    card.subTasks = card.subTasks.filter((s) => s.id !== subTaskId)
  }

  function toggleChecklistItem(cardId: string, subTaskId: string, itemId: string): void {
    const card = cards.value.find((c) => c.id === cardId)
    const st = card?.subTasks?.find((s) => s.id === subTaskId)
    const item = st?.checklist.find((i) => i.id === itemId)
    if (item) item.done = !item.done
  }

  function addChecklistItem(cardId: string, subTaskId: string, item: ChecklistItem): void {
    const card = cards.value.find((c) => c.id === cardId)
    const st = card?.subTasks?.find((s) => s.id === subTaskId)
    if (st) st.checklist.push(item)
  }

  function addCard(card: DeployCard): void {
    cards.value.unshift(card)
  }

  function addActivity(cardId: string, activity: DeployActivity): void {
    const card = cards.value.find((c) => c.id === cardId)
    if (!card) return
    if (!card.activities) card.activities = []
    card.activities.unshift(activity)
  }

  function columnName(id: string): string {
    return columns.value.find((c) => c.id === id)?.name ?? id
  }

  function columnColor(id: string): string {
    return columns.value.find((c) => c.id === id)?.color ?? '#6b778c'
  }

  function updateColumns(newCols: DeployColumn[]): void {
    columns.value = newCols
  }

  return {
    cards, columns,
    getById, updateCard, updatePhase,
    addSubTask, updateSubTask, deleteSubTask,
    toggleChecklistItem, addChecklistItem,
    addCard, addActivity,
    columnName, columnColor, updateColumns,
  }
})
