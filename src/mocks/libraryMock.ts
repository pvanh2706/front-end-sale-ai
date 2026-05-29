/**
 * Mock data cho module Thư viện tài liệu
 * Phản ánh đầy đủ các use case DOC1–DOC4:
 *   DOC1 – 3 mục: Tài liệu công ty / Cá nhân / Được chia sẻ với tôi
 *   DOC2 – Admin CRUD thư mục & tài liệu trong TL Công ty
 *   DOC3 – Phân quyền theo team/thành viên (gắn vào mỗi node)
 *   DOC4 – Chia sẻ tài liệu cá nhân giữa user với nhau
 */

import type { LibraryNode } from '@/types/library'

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

// ─────────────────────────────────────────────
// Helper tạo node nhanh
// ─────────────────────────────────────────────
function folder(
  id: string,
  name: string,
  parentId: string | null,
  children: LibraryNode[],
  extra: Partial<LibraryNode> = {},
): LibraryNode {
  return {
    id,
    name,
    type: 'folder',
    parent_id: parentId,
    children,
    documents_count: countDocuments(children),
    status: 'approved',
    has_content: children.length > 0,
    updated_at: daysAgo(1),
    has_more_children: false,
    total_children: children.length,
    ...extra,
  }
}

function doc(
  id: string,
  name: string,
  parentId: string,
  extra: Partial<LibraryNode> = {},
): LibraryNode {
  return {
    id,
    name,
    type: 'document',
    parent_id: parentId,
    children: [],
    documents_count: 0,
    status: 'approved',
    has_content: true,
    updated_at: daysAgo(Math.floor(Math.random() * 14 + 1)),
    has_more_children: false,
    total_children: 0,
    ...extra,
  }
}

function countDocuments(nodes: LibraryNode[]): number {
  let count = 0
  for (const node of nodes) {
    if (node.type === 'document') count++
    else count += node.documents_count
  }
  return count
}

// ═══════════════════════════════════════════════
// TÀI LIỆU CÔNG TY  (DOC1 + DOC2 + DOC3)
// ═══════════════════════════════════════════════

// ─── Sample file URLs dùng cho demo ───────────────────────────────────────────
// PDF: các file mẫu công khai, hiển thị qua Google Docs Viewer
const PDF_SAMPLE_1 = 'https://www.africau.edu/images/default/sample.pdf'
const PDF_SAMPLE_2 = 'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf'
const PDF_SAMPLE_3 = 'https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pdf'
// Word / Excel / PPT: hiển thị qua Google Docs Viewer
const DOCX_SAMPLE  = 'https://calibre-ebook.com/downloads/demos/demo.docx'
const XLSX_SAMPLE  = 'https://file-examples.com/storage/fe9b04e8cf67708df9fc31a/2017/02/file_example_XLSX_10.xlsx'
const PPTX_SAMPLE  = 'https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pdf'
// Hình ảnh: Unsplash (free, reliable)
const IMG_DASHBOARD = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80'
const IMG_TEAM      = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80'

// ── Nhóm 1: Quy trình kinh doanh ──────────────
const quyTrinhBanHang = folder('f-qtbh', 'Quy trình bán hàng', 'f-qtbd', [
  doc('d-qtbh-1', 'Hướng dẫn chào hàng 2024.pdf', 'f-qtbh', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_1,
    updated_at: daysAgo(3),
    status: 'approved',
    description: 'Tài liệu hướng dẫn nhân viên kinh doanh cách tiếp cận và chào hàng hiệu quả. Bao gồm: kịch bản mở đầu, cách xác định nhu cầu khách hàng, xử lý phản đối và các bước chốt đơn hàng.',
  }),
  doc('d-qtbh-2', 'Kịch bản gọi điện cold-call.docx', 'f-qtbh', {
    file_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_url: DOCX_SAMPLE,
    updated_at: daysAgo(7),
    status: 'approved',
    description: 'Tập hợp các kịch bản gọi điện lạnh (cold-call) được tối ưu theo từng nhóm khách hàng mục tiêu. Đã được kiểm thử và đạt tỷ lệ chuyển đổi >15% trong Q4/2023.',
  }),
  doc('d-qtbh-3', 'Checklist chốt đơn.pdf', 'f-qtbh', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_2,
    updated_at: daysAgo(12),
    status: 'approved',
    description: 'Danh sách kiểm tra đầy đủ các bước cần thực hiện trước khi chốt một đơn hàng, giúp tránh bỏ sót thông tin hợp đồng và giảm thiểu rủi ro sau bán.',
  }),
])

const quyTrinhCSKH = folder('f-qtcskh', 'Quy trình CSKH', 'f-qtbd', [
  doc('d-cskh-1', 'SOP Chăm sóc khách hàng v2.pdf', 'f-qtcskh', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_2,
    status: 'approved',
    updated_at: daysAgo(5),
    description: 'Quy trình chuẩn (Standard Operating Procedure) cho bộ phận Chăm sóc Khách hàng. Phiên bản 2 cập nhật thêm quy trình xử lý khiếu nại và thang thời gian phản hồi theo từng mức độ ưu tiên.',
  }),
  doc('d-cskh-2', 'Mẫu email follow-up.docx', 'f-qtcskh', {
    file_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_url: DOCX_SAMPLE,
    status: 'approved',
    updated_at: daysAgo(10),
    description: 'Bộ mẫu email follow-up sau các giai đoạn: demo sản phẩm, gửi báo giá, sau khi ký hợp đồng, và nhắc gia hạn. Mỗi mẫu có thể tuỳ chỉnh theo tên khách hàng và tình huống cụ thể.',
  }),
])

const quyTrinhNhapHang = folder('f-qtnh', 'Quy trình nhập hàng', 'f-qtbd', [
  doc('d-qtnh-1', 'Quy định kiểm tra chất lượng.pdf', 'f-qtnh', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_1,
    status: 'approved',
    description: 'Quy định về kiểm tra chất lượng sản phẩm đầu vào, bao gồm tiêu chí nghiệm thu, quy trình lấy mẫu và biểu mẫu biên bản kiểm hàng.',
  }),
])

const quyTrinhKinhDoanh = folder('f-qtbd', 'Quy trình kinh doanh', 'company-root', [
  quyTrinhBanHang,
  quyTrinhCSKH,
  quyTrinhNhapHang,
])

// ── Nhóm 2: Tài liệu sản phẩm ──────────────
const taiLieuSanPham = folder('f-tlsp', 'Tài liệu sản phẩm', 'company-root', [
  doc('d-tlsp-1', 'Bảng giá Q1-2024.xlsx', 'f-tlsp', {
    file_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_url: XLSX_SAMPLE,
    status: 'approved',
    updated_at: daysAgo(2),
    description: 'Bảng giá chính thức áp dụng cho Quý 1/2024. Bao gồm giá lẻ, giá đại lý, chiết khấu theo sản lượng và điều kiện thanh toán. Đã được phê duyệt bởi Giám đốc Kinh doanh.',
  }),
  doc('d-tlsp-2', 'Catalogue sản phẩm 2024.pdf', 'f-tlsp', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_1,
    status: 'approved',
    updated_at: daysAgo(6),
    description: 'Catalogue đầy đủ danh mục sản phẩm năm 2024 kèm hình ảnh, thông số kỹ thuật và mã sản phẩm. Tài liệu dùng để gửi khách hàng hoặc trình bày trong các buổi họp giới thiệu.',
  }),
  doc('d-tlsp-3', 'Tính năng phần mềm CRM.pptx', 'f-tlsp', {
    file_mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    file_url: PPTX_SAMPLE,
    status: 'pending',
    updated_at: daysAgo(1),
    description: 'Slide trình bày tổng quan các tính năng của phần mềm CRM dành cho đội ngũ Sales. Đang chờ phê duyệt từ phòng Marketing trước khi sử dụng chính thức trong các buổi demo.',
  }),
  doc('d-tlsp-4', 'So sánh đối thủ cạnh tranh.pdf', 'f-tlsp', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_3,
    status: 'approved',
    updated_at: daysAgo(20),
    description: 'Phân tích so sánh chi tiết giữa sản phẩm công ty và 4 đối thủ cạnh tranh chính trên thị trường. Cập nhật Q4/2023, bao gồm bảng điểm tính năng, mức giá và điểm mạnh/yếu.',
  }),
  doc('d-tlsp-img', 'Ảnh trưng bày sản phẩm.jpg', 'f-tlsp', {
    file_mime: 'image/jpeg',
    file_url: IMG_DASHBOARD,
    status: 'approved',
    updated_at: daysAgo(4),
    description: 'Bộ ảnh trưng bày sản phẩm dùng cho website, catalogue và tài liệu marketing. Ảnh chụp chuyên nghiệp, độ phân giải cao, phù hợp in ấn.',
  }),
])

// ── Nhóm 3: Đào tạo nhân sự ──────────────
const daoTaoNhanSu = folder('f-dtns', 'Đào tạo nhân sự', 'company-root', [
  doc('d-dtns-1', 'Tài liệu onboarding nhân viên mới.pdf', 'f-dtns', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_2,
    status: 'approved',
    updated_at: daysAgo(30),
    description: 'Bộ tài liệu giới thiệu toàn diện dành cho nhân viên mới: văn hóa công ty, quy trình làm việc, các công cụ sử dụng nội bộ, và hướng dẫn 30-60-90 ngày đầu.',
  }),
  doc('d-dtns-2', 'Quy chế làm việc nội bộ.docx', 'f-dtns', {
    file_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_url: DOCX_SAMPLE,
    status: 'approved',
    updated_at: daysAgo(45),
    description: 'Quy chế về giờ làm việc, quy trình xin phép, trang phục văn phòng, sử dụng thiết bị công ty và các nội quy cần tuân thủ.',
  }),
  doc('d-dtns-3', 'Chính sách phúc lợi 2024.pdf', 'f-dtns', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_1,
    status: 'approved',
    updated_at: daysAgo(60),
    description: 'Chi tiết các chính sách phúc lợi năm 2024: bảo hiểm sức khoẻ, thưởng KPI, ngày nghỉ phép, hỗ trợ đào tạo và các quyền lợi bổ sung.',
  }),
  doc('d-dtns-img', 'Ảnh team building Q1-2024.jpg', 'f-dtns', {
    file_mime: 'image/jpeg',
    file_url: IMG_TEAM,
    status: 'approved',
    updated_at: daysAgo(90),
    description: 'Ảnh ghi lại hoạt động team building Q1/2024. Dùng cho nội san nội bộ và trang tuyển dụng.',
  }),
])

// ── Nhóm 4: Pháp lý & Hợp đồng ──────────────
const phapLy = folder('f-pl', 'Pháp lý & Hợp đồng', 'company-root', [
  doc('d-pl-1', 'Mẫu hợp đồng bán hàng v3.docx', 'f-pl', {
    file_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_url: DOCX_SAMPLE,
    status: 'approved',
    updated_at: daysAgo(8),
    description: 'Mẫu hợp đồng bán hàng phiên bản 3, cập nhật điều khoản bảo hành, bồi thường và điều kiện giao hàng theo quy định pháp luật mới nhất.',
  }),
  doc('d-pl-2', 'Mẫu NDA bảo mật thông tin.pdf', 'f-pl', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_2,
    status: 'approved',
    updated_at: daysAgo(14),
    description: 'Non-Disclosure Agreement chuẩn để ký kết với đối tác, khách hàng và nhà cung cấp. Bao gồm điều khoản bảo mật thông tin kinh doanh trong 3 năm.',
  }),
  doc('d-pl-3', 'Điều khoản dịch vụ (Terms of Service).pdf', 'f-pl', {
    file_mime: 'application/pdf',
    // Không có file_url → hiển thị trạng thái chưa đính kèm
    status: 'pending',
    updated_at: daysAgo(2),
    description: 'Điều khoản dịch vụ phiên bản mới đang được bộ phận pháp lý soát xét. Chưa được phê duyệt sử dụng.',
  }),
])

// ── Nhóm 5: Marketing ──────────────
const marketing = folder('f-mkt', 'Marketing', 'company-root', [
  doc('d-mkt-1', 'Chiến lược marketing Q2-2024.pptx', 'f-mkt', {
    file_mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    file_url: PPTX_SAMPLE,
    status: 'approved',
    updated_at: daysAgo(5),
    description: 'Slide chiến lược marketing toàn diện cho Quý 2/2024: phân tích thị trường, mục tiêu tăng trưởng, kênh phân phối và ngân sách chi tiết.',
  }),
  doc('d-mkt-2', 'Brand guideline 2024.pdf', 'f-mkt', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_1,
    status: 'approved',
    updated_at: daysAgo(90),
    description: 'Hướng dẫn bộ nhận diện thương hiệu: logo, màu sắc, typography, tone of voice và quy tắc sử dụng trên các kênh truyền thông.',
  }),
])

// ═══════════════════════════════════════════════
// TÀI LIỆU CÁ NHÂN  (DOC1 + DOC4)
// ═══════════════════════════════════════════════

const ghiChuCaNhan = folder('f-gcn', 'Ghi chú cá nhân', 'personal-root', [
  doc('d-gcn-1', 'Kế hoạch công việc Q2-2024.docx', 'f-gcn', {
    file_mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'draft',
    updated_at: daysAgo(1),
  }),
  doc('d-gcn-2', 'Danh sách khách hàng tiềm năng.xlsx', 'f-gcn', {
    file_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'draft',
    updated_at: daysAgo(3),
  }),
])

const baoCaoCaNhan = folder('f-bcn', 'Báo cáo cá nhân', 'personal-root', [
  doc('d-bcn-1', 'Báo cáo doanh số tháng 4.xlsx', 'f-bcn', {
    file_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_url: XLSX_SAMPLE,
    status: 'draft',
    updated_at: daysAgo(7),
    description: 'Tổng hợp doanh số cá nhân tháng 4: số đơn hàng, doanh thu, tỷ lệ chốt deal và so sánh với target.',
  }),
  doc('d-bcn-2', 'Review hiệu suất Q1.pdf', 'f-bcn', {
    file_mime: 'application/pdf',
    file_url: PDF_SAMPLE_2,
    status: 'approved',
    updated_at: daysAgo(30),
    description: 'Báo cáo đánh giá hiệu suất cá nhân Q1/2024, bao gồm KPI đạt được, điểm mạnh cần phát huy và kế hoạch cải thiện Q2.',
  }),
])

// ═══════════════════════════════════════════════
// TÀI LIỆU ĐƯỢC CHIA SẺ VỚI TÔI  (DOC4)
// ═══════════════════════════════════════════════

const chiaSeBoiTeam = folder('f-sbt', 'Sales Team — chia sẻ', 'shared-root', [
  doc('d-sbt-1', 'Kịch bản demo sản phẩm cho khách hàng lớn.pptx', 'f-sbt', {
    file_mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    status: 'approved',
    updated_at: daysAgo(4),
  }),
  doc('d-sbt-2', 'Danh sách lead tháng 5.xlsx', 'f-sbt', {
    file_mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'approved',
    updated_at: daysAgo(2),
  }),
])

// ═══════════════════════════════════════════════
// CÁC ROOT NODE (system)
// ═══════════════════════════════════════════════

export const MOCK_COMPANY_ROOT: LibraryNode = {
  id: 'company-root',
  name: 'Tài liệu công ty',
  type: 'folder',
  parent_id: null,
  children: [
    quyTrinhKinhDoanh,
    taiLieuSanPham,
    daoTaoNhanSu,
    phapLy,
    marketing,
  ],
  documents_count: 20,
  status: 'approved',
  has_content: true,
  updated_at: daysAgo(1),
  is_system: true,
  root_type: 'company',
  has_more_children: false,
  total_children: 5,
}

export const MOCK_PERSONAL_ROOT: LibraryNode = {
  id: 'personal-root',
  name: 'Tài liệu cá nhân',
  type: 'folder',
  parent_id: null,
  children: [ghiChuCaNhan, baoCaoCaNhan],
  documents_count: 4,
  status: 'approved',
  has_content: true,
  updated_at: daysAgo(1),
  is_system: true,
  root_type: 'personal',
  has_more_children: false,
  total_children: 2,
}

export const MOCK_SHARED_ROOT: LibraryNode = {
  id: 'shared-root',
  name: 'Tài liệu được chia sẻ với tôi',
  type: 'folder',
  parent_id: null,
  children: [
    chiaSeBoiTeam,
    doc('d-sh-1', 'Chiến lược phát triển thị trường 2024.pdf', 'shared-root', {
      file_mime: 'application/pdf',
      status: 'approved',
      updated_at: daysAgo(6),
    }),
    doc('d-sh-2', 'Kế hoạch triển khai dự án SmartCity.pptx', 'shared-root', {
      file_mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      status: 'approved',
      updated_at: daysAgo(9),
    }),
  ],
  documents_count: 4,
  status: 'approved',
  has_content: true,
  updated_at: daysAgo(2),
  is_system: true,
  root_type: 'shared',
  has_more_children: false,
  total_children: 3,
}

/** Toàn bộ cây mock — dùng làm fallback/seed trong store */
export const MOCK_LIBRARY_TREE: LibraryNode[] = [
  MOCK_COMPANY_ROOT,
  MOCK_PERSONAL_ROOT,
  MOCK_SHARED_ROOT,
]
