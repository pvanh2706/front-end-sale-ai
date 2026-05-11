import type { DealCard, DealsKanbanPayload } from '@/types/deals'

// ─── Helper ─────────────────────────────────────────────────────────────────

function card(
  id: string,
  title: string,
  company: string,
  value: number,
  source: string,
  aiScore?: number,
): DealCard {
  return {
    id,
    title,
    company,
    value: `₫ ${value.toLocaleString('vi-VN')}`,
    source: source.toUpperCase(),
    aiScore: aiScore ?? null,
    hasActions: true,
    assignees: [1],
    updatedAt: new Date().toISOString(),
  }
}

function total(cards: DealCard[]): string {
  const sum = cards.reduce((acc, c) => {
    const raw = c.value.replace(/[^0-9]/g, '')
    return acc + (raw ? Number(raw) : 0)
  }, 0)
  if (sum <= 0) return '₫ 0'
  if (sum >= 1_000_000_000) return `₫ ${(sum / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`
  if (sum >= 1_000_000) return `₫ ${(sum / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  return `₫ ${sum.toLocaleString('vi-VN')}`
}

// ─── Columns data ────────────────────────────────────────────────────────────

const newCards: DealCard[] = [
  card('d-01', 'Triển khai ERP giai đoạn 1', 'Công ty TNHH Minh Phát', 450_000_000, 'inbound', 72),
  card('d-02', 'Nâng cấp hệ thống POS', 'Siêu thị Hoàng Gia', 85_000_000, 'website', 58),
  card('d-03', 'Tư vấn chuyển đổi số', 'Tập đoàn ABC Holdings', 200_000_000, 'referral'),
]

const preparingCards: DealCard[] = [
  card('d-04', 'Phần mềm quản lý nhân sự HRM', 'Công ty CP Thành Đông', 120_000_000, 'outbound', 65),
  card('d-05', 'Hệ thống camera giám sát thông minh', 'Khu công nghiệp Bắc Phú', 340_000_000, 'event', 80),
]

const contactedCards: DealCard[] = [
  card('d-06', 'Cloud Migration dịch vụ tài chính', 'Fintech Việt Nam JSC', 980_000_000, 'referral', 88),
  card('d-07', 'Tích hợp API thanh toán', 'E-commerce Nam Sao', 55_000_000, 'website', 61),
  card('d-08', 'Giải pháp kho thông minh WMS', 'Logistics Đông Dương', 670_000_000, 'outbound', 74),
]

const negotiatingCards: DealCard[] = [
  card('d-09', 'Nền tảng CRM doanh nghiệp', 'Tập đoàn Phú Thọ Group', 1_500_000_000, 'referral', 91),
  card('d-10', 'Bảo mật dữ liệu ISO 27001', 'Ngân hàng TechBank', 850_000_000, 'inbound', 85),
]

const quotedCards: DealCard[] = [
  card('d-11', 'Phát triển app mobile B2C', 'Thương hiệu FashionX', 420_000_000, 'website', 78),
  card('d-12', 'Hạ tầng mạng toà nhà văn phòng', 'Tòa nhà Sunrise Tower', 290_000_000, 'outbound', 83),
]

const wonCards: DealCard[] = [
  card('d-13', 'Triển khai phần mềm kế toán', 'Cty XNK Sao Vàng', 180_000_000, 'referral', 95),
  card('d-14', 'Hệ thống đặt lịch khách sạn online', 'Resort Biển Xanh', 310_000_000, 'event', 90),
  card('d-15', 'Data analytics dashboard', 'VinMart Plus', 520_000_000, 'inbound', 93),
]

const lostCards: DealCard[] = [
  card('d-16', 'Chuyển đổi hệ thống email', 'Cty XD Hòa Phát', 60_000_000, 'outbound'),
  card('d-17', 'Phần mềm quản lý giáo dục LMS', 'CĐ Công Nghệ Miền Nam', 145_000_000, 'website'),
]

// ─── KPI ─────────────────────────────────────────────────────────────────────

const openCards = [...newCards, ...preparingCards, ...contactedCards, ...negotiatingCards, ...quotedCards]
const resolvedCount = wonCards.length + lostCards.length
const winRate = resolvedCount > 0 ? Math.round((wonCards.length / resolvedCount) * 100) : 0

// ─── Export ───────────────────────────────────────────────────────────────────

export const mockDealsKanban: DealsKanbanPayload = {
  selectedPipeline: 'Bán hàng B2B',
  kpis: [
    { label: 'Tổng deal đang mở', value: String(openCards.length) },
    { label: 'Doanh thu dự kiến', value: total(openCards) },
    { label: 'Tỷ lệ chuyển đổi', value: `${winRate}%`, valueClass: 'text-primary-500' },
    { label: 'Deal sắp hết hạn', value: '3', valueClass: 'text-error-500' },
  ],
  columns: [
    { id: 'new', name: 'Mới', color: '#6B7280', total: total(newCards), cards: newCards },
    { id: 'preparing', name: 'Đang chuẩn bị', color: '#3B82F6', total: total(preparingCards), cards: preparingCards },
    { id: 'contacted', name: 'Đã liên hệ', color: '#06B6D4', total: total(contactedCards), cards: contactedCards },
    { id: 'negotiating', name: 'Đàm phán', color: '#F59E0B', total: total(negotiatingCards), cards: negotiatingCards },
    { id: 'quoted', name: 'Báo giá', color: '#8B5CF6', total: total(quotedCards), cards: quotedCards },
    { id: 'won', name: 'Thắng', color: '#10B981', total: total(wonCards), cards: wonCards },
    { id: 'lost', name: 'Thua', color: '#EF4444', total: total(lostCards), cards: lostCards },
  ],
}
