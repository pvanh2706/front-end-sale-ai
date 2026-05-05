import type {
  ChatDashboardStats,
  DashboardSuggestion,
  RecentChatItem,
  RecentDocumentItem,
} from '@/types/chatDashboard'

export const mockDashboardStats: ChatDashboardStats = {
  documentsCount: 248,
  newDocumentsThisWeek: 16,
  sessionsThisMonth: 132,
  sessionsPercentChange: 18,
  questionsAnswered: 1486,
  avgResponseTime: 2.4,
  storageUsed: 14.2,
  storageLimit: 50,
}

export const mockRecentChats: RecentChatItem[] = [
  {
    id: 'chat-1',
    title: 'Phân tích báo giá Q2 cho team sales',
    lastQuestion: 'Hãy tóm tắt 3 điểm chính để trình bày với khách hàng.',
    messageCount: 32,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat-2',
    title: 'So sánh hợp đồng A và B',
    lastQuestion: 'Mục điều khoản thanh toán khác nhau ở đâu?',
    messageCount: 18,
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat-3',
    title: 'Soạn email follow-up sau demo',
    lastQuestion: 'Viết giúp email ngắn gọn, thân thiện và rõ CTA.',
    messageCount: 11,
    updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat-4',
    title: 'Tổng hợp câu hỏi thường gặp về chính sách đổi trả',
    lastQuestion: 'Cho mình 5 câu hỏi phù hợp để sale trả lời nhanh.',
    messageCount: 9,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'chat-5',
    title: 'Checklist onboarding khách hàng mới',
    lastQuestion: 'Cần bổ sung bước nào để giảm thiểu sai sót?',
    messageCount: 14,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockRecentDocuments: RecentDocumentItem[] = [
  {
    id: 'doc-1',
    name: 'Bao_gia_Q2_2026.pdf',
    format: 'pdf',
    sizeBytes: 2_400_000,
    uploadedBy: 'u-1',
    uploadedByName: 'Nguyen Van A',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-2',
    name: 'Hop_dong_mau_A.docx',
    format: 'docx',
    sizeBytes: 1_700_000,
    uploadedBy: 'u-2',
    uploadedByName: 'Tran Minh B',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-3',
    name: 'Pricing_matrix_Q2.xlsx',
    format: 'xlsx',
    sizeBytes: 980_000,
    uploadedBy: 'u-3',
    uploadedByName: 'Le Hoang C',
    createdAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-4',
    name: 'Deck_gioi_thieu_PPT.pptx',
    format: 'pptx',
    sizeBytes: 3_600_000,
    uploadedBy: 'u-4',
    uploadedByName: 'Pham Thi D',
    createdAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'doc-5',
    name: 'Policy_hoan_tien.pdf',
    format: 'pdf',
    sizeBytes: 1_200_000,
    uploadedBy: 'u-5',
    uploadedByName: 'Ngo Van E',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const mockAiSuggestions: DashboardSuggestion[] = [
  {
    type: 'new_docs',
    title: '3 tài liệu mới chưa đọc',
    description: 'Từ team Marketing tuần này',
    actionUrl: '/chat-tai-lieu/library?filter=unread',
  },
  {
    type: 'deadline',
    title: 'Báo giá ABC sắp hết hạn',
    description: 'Hết hạn 15/05/2026 (còn 10 ngày)',
    actionUrl: '/chat-tai-lieu/chat?context=baogia_abc',
  },
  {
    type: 'trending',
    title: 'Tài liệu Pricing Q2 hot nhất',
    description: 'Được hỏi 24 lần trong tuần',
    actionUrl: '/chat-tai-lieu/library?doc=pricing_q2',
  },
  {
    type: 'reminder',
    title: 'Chưa chat về Deal Vingroup',
    description: '3 tuần qua - review lại?',
    actionUrl: '/chat-tai-lieu/chat?context=deal_vingroup',
  },
]

export const mockPopularQuestions: string[] = [
  'Chính sách hoàn tiền',
  'Quy trình ký hợp đồng điện tử',
  'Báo giá năm 2026',
  'Hỗ trợ kỹ thuật sau bán hàng',
  'Điều khoản bảo mật dữ liệu',
]
