/**
 * Seed script — tạo dữ liệu test cho Kanban Deals
 * Chạy: node backend/seed-deals.mjs
 */
import 'dotenv/config'
import { PrismaClient, DealStage } from '@prisma/client'

const prisma = new PrismaClient()

const ORG_ID = '00000000-0000-0000-0000-000000000001'
const PIPELINE_ID = '00000000-0000-0000-0000-000000000001'
const ASSIGNEE_ID = '00000000-0000-0000-0000-000000000010'

const SEED_DEALS = [
  // ── new ──────────────────────────────────────────────────────────────────
  {
    title: 'Triển khai ERP giai đoạn 1',
    companyName: 'Công ty TNHH Minh Phát',
    contactName: 'Nguyễn Văn Hùng',
    stage: DealStage.new,
    value: 450_000_000,
    probability: 20,
    source: 'inbound',
    aiScore: 72,
    description: 'Khách hàng quan tâm giải pháp ERP cho mảng sản xuất.',
  },
  {
    title: 'Nâng cấp hệ thống POS',
    companyName: 'Siêu thị Hoàng Gia',
    contactName: 'Trần Thị Lan',
    stage: DealStage.new,
    value: 85_000_000,
    probability: 15,
    source: 'website',
    aiScore: 58,
    description: 'Cần nâng cấp 12 terminal POS và phần mềm quản lý.',
  },
  {
    title: 'Tư vấn chuyển đổi số',
    companyName: 'Tập đoàn ABC Holdings',
    contactName: 'Lê Minh Đức',
    stage: DealStage.new,
    value: 200_000_000,
    probability: 25,
    source: 'referral',
    aiScore: null,
    description: 'Dự án tư vấn chiến lược và lộ trình chuyển đổi số 2 năm.',
  },

  // ── preparing ─────────────────────────────────────────────────────────────
  {
    title: 'Phần mềm quản lý nhân sự HRM',
    companyName: 'Công ty CP Thành Đông',
    contactName: 'Phạm Quang Vinh',
    stage: DealStage.preparing,
    value: 120_000_000,
    probability: 35,
    source: 'outbound',
    aiScore: 65,
    description: 'Cần giải pháp HRM tích hợp chấm công, bảng lương, xét tuyển.',
  },
  {
    title: 'Hệ thống camera giám sát thông minh',
    companyName: 'Khu công nghiệp Bắc Phú',
    contactName: 'Vũ Thị Hoa',
    stage: DealStage.preparing,
    value: 340_000_000,
    probability: 40,
    source: 'event',
    aiScore: 80,
    description: 'Lắp đặt 200 camera AI cho toàn bộ khu công nghiệp.',
  },

  // ── contacted ─────────────────────────────────────────────────────────────
  {
    title: 'Cloud Migration dịch vụ tài chính',
    companyName: 'Fintech Việt Nam JSC',
    contactName: 'Hoàng Anh Tuấn',
    stage: DealStage.contacted,
    value: 980_000_000,
    probability: 55,
    source: 'referral',
    aiScore: 88,
    description: 'Di chuyển toàn bộ hạ tầng on-premise lên AWS.',
  },
  {
    title: 'Tích hợp API thanh toán',
    companyName: 'E-commerce Nam Sao',
    contactName: 'Bùi Thanh Tú',
    stage: DealStage.contacted,
    value: 55_000_000,
    probability: 50,
    source: 'website',
    aiScore: 61,
    description: 'Tích hợp VNPay, Momo, ZaloPay vào nền tảng thương mại điện tử.',
  },
  {
    title: 'Giải pháp kho thông minh WMS',
    companyName: 'Logistics Đông Dương',
    contactName: 'Nguyễn Thị Mai',
    stage: DealStage.contacted,
    value: 670_000_000,
    probability: 45,
    source: 'outbound',
    aiScore: 74,
    description: 'WMS tích hợp robot phân loại, quản lý tồn kho real-time.',
  },

  // ── negotiating ───────────────────────────────────────────────────────────
  {
    title: 'Nền tảng CRM doanh nghiệp',
    companyName: 'Tập đoàn Phú Thọ Group',
    contactName: 'Đinh Văn Long',
    stage: DealStage.negotiating,
    value: 1_500_000_000,
    probability: 65,
    source: 'referral',
    aiScore: 91,
    description: 'Triển khai CRM cho 500 nhân viên kinh doanh toàn quốc.',
  },
  {
    title: 'Bảo mật dữ liệu ISO 27001',
    companyName: 'Ngân hàng TechBank',
    contactName: 'Trần Đức Thành',
    stage: DealStage.negotiating,
    value: 850_000_000,
    probability: 70,
    source: 'inbound',
    aiScore: 85,
    description: 'Tư vấn và triển khai hệ thống ISMS đạt chuẩn ISO 27001.',
  },

  // ── quoted ────────────────────────────────────────────────────────────────
  {
    title: 'Phát triển app mobile B2C',
    companyName: 'Thương hiệu FashionX',
    contactName: 'Lý Thị Ngọc',
    stage: DealStage.quoted,
    value: 420_000_000,
    probability: 75,
    source: 'website',
    aiScore: 78,
    description: 'App mua sắm iOS + Android, tích hợp loyalty program.',
  },
  {
    title: 'Hạ tầng mạng toà nhà văn phòng',
    companyName: 'Tòa nhà Sunrise Tower',
    contactName: 'Phạm Gia Bảo',
    stage: DealStage.quoted,
    value: 290_000_000,
    probability: 80,
    source: 'outbound',
    aiScore: 83,
    description: 'Cabling, WiFi 6, firewall cho 20 tầng văn phòng.',
  },

  // ── won ───────────────────────────────────────────────────────────────────
  {
    title: 'Triển khai phần mềm kế toán',
    companyName: 'Công ty Xuất Nhập Khẩu Sao Vàng',
    contactName: 'Ngô Minh Châu',
    stage: DealStage.won,
    value: 180_000_000,
    probability: 100,
    source: 'referral',
    aiScore: 95,
    description: 'FastAccounting tích hợp báo cáo thuế tự động.',
  },
  {
    title: 'Hệ thống đặt lịch khách sạn online',
    companyName: 'Resort Biển Xanh',
    contactName: 'Đặng Hữu Nghĩa',
    stage: DealStage.won,
    value: 310_000_000,
    probability: 100,
    source: 'event',
    aiScore: 90,
    description: 'PMS + booking engine + channel manager.',
  },
  {
    title: 'Data analytics dashboard',
    companyName: 'Tập đoàn Bán lẻ VinMart Plus',
    contactName: 'Trịnh Thị Hương',
    stage: DealStage.won,
    value: 520_000_000,
    probability: 100,
    source: 'inbound',
    aiScore: 93,
    description: 'Dashboard BI real-time cho 200 cửa hàng toàn quốc.',
  },

  // ── lost ──────────────────────────────────────────────────────────────────
  {
    title: 'Chuyển đổi hệ thống email doanh nghiệp',
    companyName: 'Công ty TNHH Xây Dựng Hòa Phát',
    contactName: 'Lê Văn Cường',
    stage: DealStage.lost,
    value: 60_000_000,
    probability: 0,
    source: 'outbound',
    aiScore: null,
    description: 'Khách hàng chọn giải pháp của đối thủ với giá thấp hơn.',
  },
  {
    title: 'Phần mềm quản lý giáo dục LMS',
    companyName: 'Trường CĐ Công Nghệ Miền Nam',
    contactName: 'Phan Thị Thu',
    stage: DealStage.lost,
    value: 145_000_000,
    probability: 0,
    source: 'website',
    aiScore: null,
    description: 'Dự án bị đình hoãn do cắt giảm ngân sách.',
  },
]

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu deals...\n')

  // Xóa deals cũ của org test (nếu có)
  const deleted = await prisma.deal.deleteMany({
    where: { orgId: ORG_ID },
  })
  if (deleted.count > 0) {
    console.log(`🗑  Đã xóa ${deleted.count} deals cũ\n`)
  }

  let created = 0
  for (const deal of SEED_DEALS) {
    await prisma.deal.create({
      data: {
        orgId: ORG_ID,
        pipelineId: PIPELINE_ID,
        assigneeId: ASSIGNEE_ID,
        createdBy: ASSIGNEE_ID,
        title: deal.title,
        companyName: deal.companyName,
        contactName: deal.contactName,
        stage: deal.stage,
        value: deal.value,
        probability: deal.probability,
        source: deal.source,
        aiScore: deal.aiScore ?? null,
        description: deal.description,
        currency: 'VND',
        tags: [],
      },
    })
    console.log(`  ✓ [${deal.stage.padEnd(11)}] ${deal.title}`)
    created++
  }

  console.log(`\n✅ Đã tạo ${created} deals thành công!`)
  console.log(`   Org ID  : ${ORG_ID}`)

  // In tóm tắt theo cột
  const summary = {}
  for (const d of SEED_DEALS) {
    summary[d.stage] = (summary[d.stage] ?? 0) + 1
  }
  console.log('\n📊 Phân bổ theo cột Kanban:')
  for (const [stage, count] of Object.entries(summary)) {
    console.log(`   ${stage.padEnd(12)}: ${count} deals`)
  }
}

main()
  .catch((err) => {
    console.error('❌ Seed thất bại:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
