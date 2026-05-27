<template>
  <AdminLayout>
    <div class="flex h-[calc(100vh-11rem)] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

      <!-- ── Left sidebar ─────────────────────────────────────────────────── -->
      <aside class="hidden w-72 shrink-0 flex-col border-r border-gray-200 dark:border-gray-800 lg:flex">
        <!-- New chat button -->
        <div class="border-b border-gray-200 p-4 dark:border-gray-800">
          <Button class="w-full gap-2 bg-brand-500 hover:bg-brand-600 text-white" @click="startNewChat">
            <SquarePen class="h-4 w-4" />
            Cuộc trò chuyện mới
          </Button>
        </div>

        <!-- Scope selector -->
        <div class="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <div class="mb-2.5 flex items-center justify-between">
            <p class="text-theme-xs font-semibold text-gray-700 dark:text-gray-300">Phạm vi dữ liệu</p>
            <button
              type="button"
              class="text-theme-xs text-brand-500 hover:text-brand-600 hover:underline dark:text-brand-400"
              @click="toggleAllScopes"
            >
              {{ allSelected ? 'Bỏ tất cả' : 'Chọn tất cả' }}
            </button>
          </div>
          <div class="space-y-0.5">
            <button
              v-for="scope in scopeItems"
              :key="scope.key"
              type="button"
              class="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors"
              :class="scope.selected ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
              @click="toggleScope(scope.key)"
            >
              <!-- Icon box -->
              <div
                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors"
                :class="scope.selected ? 'bg-brand-100 dark:bg-brand-500/20' : 'bg-gray-100 dark:bg-gray-800'"
              >
                <component :is="scope.icon" class="h-3.5 w-3.5 transition-colors" :class="scope.selected ? 'text-brand-500' : 'text-gray-400'" />
              </div>
              <!-- Label -->
              <span
                class="flex-1 text-theme-xs font-medium transition-colors"
                :class="scope.selected ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'"
              >
                {{ scope.label }}
              </span>
              <!-- Checkbox -->
              <div
                class="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
                :class="scope.selected ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900'"
              >
                <svg v-if="scope.selected" class="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Conversation history -->
        <div class="min-h-0 flex-1 overflow-y-auto p-4">
          <p class="mb-3 text-theme-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">Lịch sử</p>

          <div v-if="conversationHistory.length" class="space-y-1">
            <button
              v-for="conv in conversationHistory"
              :key="conv.id"
              type="button"
              class="group flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors"
              :class="activeConvId === conv.id
                ? 'bg-brand-50 dark:bg-brand-500/10'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'"
              @click="loadConversation(conv.id)"
            >
              <MessageCircle class="mt-0.5 h-3.5 w-3.5 shrink-0" :class="activeConvId === conv.id ? 'text-brand-500' : 'text-gray-400'" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-theme-xs font-medium" :class="activeConvId === conv.id ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'">
                  {{ conv.title }}
                </p>
                <p class="text-theme-xs text-gray-400">{{ conv.time }}</p>
              </div>
            </button>
          </div>
          <p v-else class="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-theme-xs text-gray-400 dark:border-gray-700">
            Chưa có lịch sử
          </p>
        </div>
      </aside>

      <!-- ── Main chat area ────────────────────────────────────────────────── -->
      <main class="flex min-w-0 flex-1 flex-col bg-gray-50 dark:bg-gray-950">

        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3.5 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" class="text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" @click="$router.push('/crm-work')">
              <ArrowLeft class="h-4 w-4" />
            </Button>
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 shadow-theme-xs">
              <Sparkles class="h-4 w-4 text-white" />
            </div>
            <div>
              <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">CRM AI Assistant</p>
              <p class="text-theme-xs text-gray-400">Phân tích toàn bộ dữ liệu CRM của bạn</p>
            </div>
          </div>
          <span class="flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-theme-xs font-medium text-success-600 dark:bg-success-500/10 dark:text-success-400">
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-success-500" />
            Đang hoạt động
          </span>
        </div>

        <!-- Empty state — suggested prompts -->
        <div v-if="!hasMessages" class="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-8">
          <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-theme-md">
            <Sparkles class="h-7 w-7 text-white" />
          </div>
          <h2 class="mt-4 text-title-xs font-semibold text-gray-900 dark:text-white">Tôi có thể giúp gì cho bạn?</h2>
          <p class="mt-1.5 max-w-md text-center text-theme-sm text-gray-500 dark:text-gray-400">
            Hỏi bất kỳ điều gì về CRM — từ tổng hợp công việc hôm nay đến phân tích hàng nghìn hội thoại khách hàng.
          </p>

          <!-- Suggestion cards -->
          <div class="mt-7 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              v-for="s in suggestions"
              :key="s.title"
              type="button"
              class="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-300 hover:shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/40"
              @click="sendMessage(s.prompt)"
            >
              <div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" :class="s.iconBg">
                <component :is="s.icon" class="h-4 w-4" :class="s.iconColor" />
              </div>
              <div>
                <p class="text-theme-sm font-semibold text-gray-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">{{ s.title }}</p>
                <p class="mt-0.5 text-theme-xs leading-relaxed text-gray-400">{{ s.desc }}</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Chat messages -->
        <div v-else ref="messagesEl" class="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div class="mx-auto max-w-3xl space-y-5">
            <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start gap-3'">

              <!-- AI avatar -->
              <div v-if="msg.role === 'assistant'" class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 shadow-theme-xs mt-1">
                <Sparkles class="h-3.5 w-3.5 text-white" />
              </div>

              <!-- Bubble -->
              <div
                class="max-w-[80%] rounded-2xl px-4 py-3"
                :class="msg.role === 'user'
                  ? 'rounded-tr-sm bg-brand-500 text-white'
                  : 'rounded-tl-sm bg-white shadow-theme-xs dark:bg-gray-800'"
              >
                <!-- Loading dots -->
                <div v-if="msg.loading" class="flex items-center gap-1.5 py-1">
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style="animation-delay:0ms" />
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style="animation-delay:150ms" />
                  <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" style="animation-delay:300ms" />
                </div>

                <!-- Text -->
                <div v-else class="space-y-1.5">
                  <p
                    class="whitespace-pre-wrap text-theme-sm leading-relaxed"
                    :class="msg.role === 'user' ? 'text-white' : 'text-gray-800 dark:text-gray-200'"
                    v-html="formatMessage(msg.content)"
                  />
                  <!-- CTA chips (AI only) -->
                  <div v-if="msg.role === 'assistant' && msg.actions?.length" class="mt-3 flex flex-wrap gap-2">
                    <button
                      v-for="action in msg.actions"
                      :key="action"
                      type="button"
                      class="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1 text-theme-xs font-medium text-brand-600 transition-colors hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-400"
                      @click="sendMessage(action)"
                    >
                      {{ action }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input bar -->
        <div class="shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
          <!-- Selected scope tags -->
          <div class="mb-2.5 flex flex-wrap gap-1.5">
            <span
              v-for="scope in scopeItems.filter((s) => s.selected)"
              :key="scope.key"
              class="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-theme-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              <component :is="scope.icon" class="h-3 w-3 text-brand-400" />
              {{ scope.label }}
            </span>
          </div>
          <!-- Textarea + send -->
          <div class="flex items-end gap-2">
            <textarea
              ref="inputEl"
              v-model="inputText"
              placeholder="Hỏi bất cứ điều gì về CRM của bạn..."
              rows="1"
              class="flex-1 resize-none bg-transparent py-1 text-theme-sm leading-relaxed text-gray-900 placeholder-gray-400 outline-none dark:text-white"
              @keydown.enter.exact.prevent="handleEnter"
              @input="autoResize"
            />
            <button
              type="button"
              :disabled="!inputText.trim() || isLoading"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500 transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-40"
              @click="handleSend"
            >
              <ArrowUp class="h-4 w-4 text-white" />
            </button>
          </div>
          <p class="mt-2 text-center text-theme-xs text-gray-400">AI có thể mắc sai sót. Hãy kiểm tra thông tin quan trọng.</p>
        </div>

      </main>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  Handshake,
  MessageCircle,
  MessageSquare,
  SearchCode,
  Sparkles,
  SquarePen,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Button } from '@/components/ui/button'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
  actions?: string[]
}

interface Conversation {
  id: string
  title: string
  time: string
  messages: ChatMessage[]
}

// ─── State ───────────────────────────────────────────────────────────────────

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const isLoading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const activeConvId = ref<string | null>(null)

const hasMessages = computed(() => messages.value.length > 0)

// ─── Scope items (selectable data scope) ─────────────────────────────────────

interface ScopeItem {
  key: string
  label: string
  icon: unknown
  selected: boolean
}

const scopeItems = ref<ScopeItem[]>([
  { key: 'deals', label: 'Deal', icon: Handshake, selected: true },
  { key: 'leads', label: 'Lead', icon: Users, selected: true },
  { key: 'tasks', label: 'Task triển khai', icon: ClipboardList, selected: true },
  { key: 'conversations', label: 'Hội thoại', icon: MessageCircle, selected: true },
  { key: 'pipeline', label: 'Pipeline', icon: BarChart3, selected: true },
  { key: 'revenue', label: 'Doanh thu', icon: TrendingUp, selected: true },
])

const allSelected = computed(() => scopeItems.value.every((s) => s.selected))

function toggleScope(key: string): void {
  const item = scopeItems.value.find((s) => s.key === key)
  if (item) item.selected = !item.selected
}

function toggleAllScopes(): void {
  const next = !allSelected.value
  scopeItems.value.forEach((s) => { s.selected = next })
}

// ─── Conversation history (mock) ─────────────────────────────────────────────

const conversationHistory = ref<Conversation[]>([
  {
    id: 'c1',
    title: 'Hôm nay tôi cần làm gì?',
    time: 'Hôm nay, 08:32',
    messages: [],
  },
  {
    id: 'c2',
    title: 'Phân tích deal SmartCity',
    time: 'Hôm qua, 15:10',
    messages: [],
  },
  {
    id: 'c3',
    title: 'Pain points từ hội thoại Q1',
    time: '25/05/2025',
    messages: [],
  },
  {
    id: 'c4',
    title: 'Deal nào nguy cơ bị mất?',
    time: '23/05/2025',
    messages: [],
  },
])

// ─── Suggested prompts ────────────────────────────────────────────────────────

const suggestions = [
  {
    title: 'Hôm nay tôi cần làm gì?',
    desc: 'AI tổng hợp deal, meeting và việc ưu tiên ngay lập tức',
    prompt: 'Hôm nay tôi cần làm gì?',
    icon: CalendarCheck,
    iconBg: 'bg-brand-50 dark:bg-brand-500/15',
    iconColor: 'text-brand-500',
  },
  {
    title: 'Phân tích pain points khách hàng',
    desc: 'Quét hàng nghìn hội thoại, trích xuất vấn đề & feature request',
    prompt: 'Phân tích pain points và feature request từ hội thoại khách hàng',
    icon: SearchCode,
    iconBg: 'bg-warning-50 dark:bg-warning-500/15',
    iconColor: 'text-warning-500',
  },
  {
    title: 'Deal nào đang có nguy cơ bị mất?',
    desc: 'Phân tích pipeline, phát hiện deal stall và dấu hiệu rủi ro sớm',
    prompt: 'Deal nào đang có nguy cơ bị mất trong pipeline hiện tại?',
    icon: AlertTriangle,
    iconBg: 'bg-error-50 dark:bg-error-500/15',
    iconColor: 'text-error-500',
  },
  {
    title: 'Tổng hợp hiệu suất tuần này',
    desc: 'Doanh thu, tỷ lệ chuyển đổi, KPI so sánh với mục tiêu',
    prompt: 'Tổng hợp hiệu suất CRM tuần này cho tôi',
    icon: BarChart3,
    iconBg: 'bg-success-50 dark:bg-success-500/15',
    iconColor: 'text-success-500',
  },
  {
    title: 'Khách hàng nào nên liên hệ ngay?',
    desc: 'Lead scoring theo mức độ quan tâm và thời điểm tốt nhất',
    prompt: 'Khách hàng và lead nào nên tôi liên hệ ngay hôm nay?',
    icon: Users,
    iconBg: 'bg-brand-50 dark:bg-brand-500/15',
    iconColor: 'text-brand-500',
  },
  {
    title: 'Kịch bản xử lý phản đối giá',
    desc: 'Chiến lược đàm phán phù hợp với từng nhóm khách hàng',
    prompt: 'Gợi ý kịch bản xử lý phản đối giá cho deals hiện tại của tôi',
    icon: MessageSquare,
    iconBg: 'bg-warning-50 dark:bg-warning-500/15',
    iconColor: 'text-warning-500',
  },
]

// ─── Mock AI responses ────────────────────────────────────────────────────────

function generateResponse(question: string): { content: string; actions: string[] } {
  const q = question.toLowerCase()

  if (q.includes('hôm nay') && (q.includes('cần làm') || q.includes('làm gì'))) {
    return {
      content: `📅 **Tổng hợp lịch làm việc hôm nay — Thứ Ba, 27/05/2025**

🔴 **Ưu tiên cao** (cần xử lý trước 12:00)
• Deal **SmartCity** (1,2 tỷ): Gửi email xác nhận điều khoản thanh toán — Mr. Minh đang chờ phản hồi 2 ngày.
• Lead **TechCorp Hà Nội**: Demo call lúc 10:30. Chuẩn bị slide bộ tính năng tích hợp ERP mới.

🟡 **Cần xử lý trong ngày**
• Vận tải Hùng Cường: Gửi báo giá chính thức (đã quá hạn 1 ngày).
• Cập nhật stage cho 3 deals Proposal → Negotiation sau cuộc gọi hôm qua.
• Review & approve 2 hợp đồng đang chờ ký.

🟢 **Theo dõi thêm**
• 5 lead mới từ campaign Facebook — cần phân loại & assign.
• Meeting nội bộ pipeline review lúc 15:00.

📊 **Tóm tắt:** 11 công việc · 3 ưu tiên cao · 2 cuộc hẹn hôm nay`,
      actions: ['Chi tiết deal SmartCity', 'Danh sách lead mới', 'Xem lịch hôm nay'],
    }
  }

  if (q.includes('pain point') || q.includes('hội thoại') || q.includes('feature request') || q.includes('phân tích')) {
    return {
      content: `🔍 **Phân tích 1,247 hội thoại — Jan đến May 2025**

📌 **TOP 5 PAIN POINTS**

1. **Tích hợp hệ thống phức tạp** *(38% phàn nàn)*
   Khó kết nối với ERP / phần mềm kế toán hiện có.
   → Đề xuất: Cung cấp API connector + tài liệu onboarding chi tiết.

2. **Báo cáo thiếu tuỳ chỉnh** *(29%)*
   Cần export theo định dạng riêng, lọc theo nhiều tiêu chí.
   → Đề xuất: Report builder drag-and-drop.

3. **Thời gian onboarding dài** *(24%)*
   Trung bình 3–4 tuần; khách hàng mong đợi 1–2 tuần.
   → Đề xuất: Quick-start template + video walkthrough.

4. **Thiếu thông báo thời gian thực** *(19%)*
   Chậm nhận cập nhật trạng thái đơn hàng / deal.
   → Đề xuất: Push notification & Zalo OA integration.

5. **Giao diện di động kém** *(15%)*
   Khó thao tác trên điện thoại, thiếu offline mode.
   → Đề xuất: PWA hoặc native app với offline sync.

🎯 **FEATURE REQUESTS PHỔ BIẾN**
• Mobile app với offline mode — **67 requests**
• Tích hợp Zalo / Telegram OA — **54 requests**
• Tự động gửi báo giá theo template — **41 requests**
• AI gợi ý phản hồi email — **38 requests**`,
      actions: ['Xem chi tiết từng pain point', 'Xuất báo cáo PDF', 'Lọc theo nhóm khách hàng'],
    }
  }

  if (q.includes('nguy cơ') || q.includes('mất') || q.includes('risk') || q.includes('stall')) {
    return {
      content: `⚠️ **Cảnh báo rủi ro Pipeline — Phân tích AI**

🔴 **NGUY CƠ CAO** (cần hành động ngay)

Deal: **Dự án SmartCity — 1,2 tỷ VND**
• Stage: Negotiation *(đã ở 23 ngày, baseline trung bình 12 ngày)*
• Tín hiệu: Thời gian phản hồi tăng từ 2h → 48h trong 1 tuần qua.
• Đối thủ: Có dấu hiệu đối thủ đang chào giá thấp hơn ~10%.
• ✅ Hành động: Gặp trực tiếp + đề xuất ưu đãi có thời hạn.

Deal: **Hệ thống ERP Hoàng Long — 780tr VND**
• Stage: Proposal *(18 ngày, 2 email cuối chưa được mở)*
• Tín hiệu: Decision maker vừa thay đổi (cần re-engage).
• ✅ Hành động: Gọi điện trong 24h + gửi proposal phiên bản cập nhật.

🟡 **NGUY CƠ TRUNG BÌNH**
• 3 deals ở stage Qualification > 14 ngày không có activity mới.
• 1 deal sắp hết hạn quote (còn 3 ngày).

📊 Tổng rủi ro tiềm ẩn: **~2 tỷ VND** trong pipeline cần xử lý gấp.`,
      actions: ['Xem toàn bộ pipeline', 'Tạo reminder follow-up', 'Phân tích đối thủ'],
    }
  }

  if (q.includes('hiệu suất') || q.includes('tuần') || q.includes('tổng hợp') || q.includes('kpi')) {
    return {
      content: `📊 **Tổng hợp hiệu suất CRM — Tuần 21 (20–26/05/2025)**

💰 **DOANH THU**
• Thực tế: **2,34 tỷ VND** *(mục tiêu: 2,5 tỷ — đạt 93,6%)*
• So tuần trước: +**18,3%** ✅
• Deal chốt thành công: **4 deals**

📈 **PIPELINE**
• Leads mới: **23** *(+5 so tuần trước)*
• Tỷ lệ chuyển đổi Lead→Deal: **34,8%** *(trung bình ngành: 27%)*
• Deals thăng stage: **11** | Deals đóng thất bại: **2**

✅ **CÔNG VIỆC**
• Hoàn thành: 47/52 task *(90,4%)*
• Cuộc gọi thực hiện: 38 | Email gửi: 124
• Thời gian phản hồi TB: **1h 42 phút** *(giảm 23% so tuần trước)* 🎉

⚠️ **CẦN CẢI THIỆN**
• 3 sales rep dưới 70% target — cần coaching.
• Tỷ lệ no-show demo tăng lên 28% — xem xét lại quy trình xác nhận.`,
      actions: ['So sánh tháng trước', 'Xem chi tiết từng sales rep', 'Tải báo cáo'],
    }
  }

  if (q.includes('liên hệ') || q.includes('khách hàng nào') || q.includes('lead') || q.includes('tiềm năng')) {
    return {
      content: `🎯 **Lead Scoring — Ưu tiên liên hệ hôm nay**

🔥 **LIÊN HỆ NGAY** *(Score: 85–100)*

1. **Nguyễn Văn Minh** — TechCorp Hà Nội
   • Score: 97/100 | Đã xem demo page 4 lần trong 24h
   • Hành động: Gọi điện xác nhận nhu cầu + chốt lịch demo

2. **Trần Thị Lan** — Công ty CP Logistics ABC
   • Score: 91/100 | Click email 6/7 lần, hỏi về tích hợp API
   • Hành động: Gửi case study + báo giá sơ bộ

3. **Phạm Đức Hùng** — SME Manufacturing
   • Score: 88/100 | Đăng ký trial 5 ngày trước, chưa được liên hệ
   • Hành động: Onboarding call trong hôm nay *(golden window!)*

🟡 **THEO DÕI** *(Score: 60–84)*
• 8 leads khác có tín hiệu quan tâm vừa — lên lịch contact trong 2–3 ngày.

💡 Leads có score > 85 thường có xác suất chuyển đổi cao hơn **3,2x** so với trung bình.`,
      actions: ['Xem toàn bộ lead scoring', 'Tạo task follow-up', 'Phân tích nguồn lead'],
    }
  }

  if (q.includes('phản đối') || q.includes('giá') || q.includes('kịch bản') || q.includes('đàm phán')) {
    return {
      content: `💬 **Kịch bản xử lý phản đối giá — Dựa trên dữ liệu CRM thực tế**

**Phản đối phổ biến nhất:** *"Giá của bạn cao hơn đối thủ X"* *(gặp trong 42% deals)*

---

**Kịch bản A — Nhấn mạnh ROI** *(hiệu quả với SME)*
> "Tôi hiểu lo ngại của anh/chị. Tuy nhiên, khách hàng tương tự như [Tên công ty tham chiếu] đã tiết kiệm trung bình 8 giờ/tuần nhờ tự động hóa báo cáo — tương đương ~12 triệu/tháng. So với khoản đầu tư, ROI đạt 3x trong năm đầu tiên."

**Kịch bản B — So sánh TCO** *(hiệu quả với Enterprise)*
> "Chi phí ban đầu có thể cao hơn, nhưng nếu tính toàn bộ chi phí vận hành 3 năm — bao gồm training, maintenance và tích hợp — giải pháp của chúng tôi thấp hơn 23%."

**Kịch bản C — Offer trial có giới hạn** *(khi khách vẫn do dự)*
> "Tôi đề xuất dùng thử miễn phí 30 ngày với đầy đủ tính năng — không cần thẻ tín dụng. Sau đó anh/chị tự đánh giá giá trị thực sự."

---
📈 **Tỷ lệ thành công theo kịch bản** (dựa trên 156 deals):
• Kịch bản A: 67% | Kịch bản B: 58% | Kịch bản C: 74%`,
      actions: ['Tùy chỉnh theo deal cụ thể', 'Xem thêm kịch bản', 'Lưu vào playbook'],
    }
  }

  // Default
  return {
    content: `Tôi đã phân tích câu hỏi của bạn dựa trên dữ liệu CRM hiện có.

Dưới đây là tổng quan nhanh:
• Pipeline hiện tại: **12 deals đang hoạt động** với tổng giá trị ~8,4 tỷ VND.
• Leads cần chăm sóc: **23 leads** đang ở giai đoạn khác nhau.
• Công việc hôm nay: **11 tasks** cần xử lý.

Bạn có thể đặt câu hỏi cụ thể hơn để tôi hỗ trợ chi tiết. Ví dụ:
— Tổng hợp công việc hôm nay
— Phân tích deal cụ thể
— Gợi ý chiến lược follow-up`,
    actions: ['Hôm nay tôi cần làm gì?', 'Deal nào nguy cơ bị mất?'],
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMessage(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

function handleEnter() {
  if (inputText.value.trim() && !isLoading.value) handleSend()
}

async function handleSend() {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return
  await sendMessage(text)
}

async function sendMessage(text: string) {
  inputText.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'

  messages.value.push({ id: `${Date.now()}-u`, role: 'user', content: text })
  await scrollToBottom()

  isLoading.value = true
  const loadingId = `${Date.now()}-a`
  messages.value.push({ id: loadingId, role: 'assistant', content: '', loading: true })
  await scrollToBottom()

  // Simulate AI thinking
  const delay = 900 + Math.random() * 800
  await new Promise((r) => setTimeout(r, delay))

  const { content, actions } = generateResponse(text)
  const idx = messages.value.findIndex((m) => m.id === loadingId)
  if (idx !== -1) {
    messages.value[idx] = { id: loadingId, role: 'assistant', content, loading: false, actions }
  }
  isLoading.value = false

  // Save to conversation history
  if (!activeConvId.value) {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: text.length > 40 ? text.slice(0, 40) + '…' : text,
      time: 'Vừa xong',
      messages: [],
    }
    conversationHistory.value.unshift(newConv)
    activeConvId.value = newConv.id
  }

  await scrollToBottom()
}

function startNewChat() {
  messages.value = []
  inputText.value = ''
  isLoading.value = false
  activeConvId.value = null
}

function loadConversation(id: string) {
  activeConvId.value = id
  // In a real app, load messages from store/API
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}
</script>
