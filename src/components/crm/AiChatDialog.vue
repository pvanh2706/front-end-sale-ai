<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 shadow-theme-xl"
      :class="hasMessages ? 'max-w-lg h-[600px]' : 'max-w-lg'"
      :show-close-button="false"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
            <Sparkles class="h-4 w-4 text-brand-500" />
          </div>
          <span class="text-theme-sm font-semibold text-gray-900 dark:text-white">AI Assistant</span>
          <span class="text-theme-xs text-gray-400 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full">
            {{ entityType === 'lead' ? 'Lead' : 'Deal' }}: {{ entityName }}
          </span>
        </div>
        <button
          type="button"
          class="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          @click="$emit('update:open', false)"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <!-- Empty state: suggested questions -->
      <div v-if="!hasMessages" class="px-5 pb-5 flex flex-col gap-4">
        <p class="text-center text-lg font-semibold text-gray-900 dark:text-white">Vấn đề của bạn là gì?</p>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="q in suggestedQuestions"
            :key="q.title"
            type="button"
            class="text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3.5 hover:border-brand-300 hover:bg-brand-50 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 transition-all group"
            @click="sendMessage(q.title)"
          >
            <p class="text-theme-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 leading-snug">{{ q.title }}</p>
            <p class="text-theme-xs text-gray-400 mt-1 leading-snug">{{ q.desc }}</p>
          </button>
        </div>
      </div>

      <!-- Chat history (once conversation started) -->
      <div v-else ref="messagesEl" class="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3 min-h-0">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
        >
          <!-- AI message -->
          <div v-if="msg.role === 'assistant'" class="flex gap-2.5 max-w-[85%]">
            <div class="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles class="h-3.5 w-3.5 text-brand-500" />
            </div>
            <div class="rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 px-4 py-3">
              <p v-if="!msg.loading" class="text-theme-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
              <div v-else class="flex items-center gap-1.5 py-1">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0ms" />
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 150ms" />
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 300ms" />
              </div>
            </div>
          </div>

          <!-- User message -->
          <div v-else class="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-3">
            <p class="text-theme-sm text-white whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
          </div>
        </div>
      </div>

      <!-- Input bar -->
      <div class="shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <!-- Context tags -->
        <div class="flex flex-wrap gap-1.5 mb-2.5">
          <span
            v-for="tag in contextTags"
            :key="tag"
            class="flex items-center gap-1 text-theme-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
            {{ tag }}
          </span>
        </div>

        <!-- Input row -->
        <div class="flex items-end gap-2">
          <textarea
            ref="inputEl"
            v-model="inputText"
            placeholder="Hỏi bất cứ điều gì..."
            rows="1"
            class="flex-1 resize-none bg-transparent text-theme-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none leading-relaxed py-1 max-h-28 overflow-y-auto"
            @keydown.enter.exact.prevent="handleEnter"
            @input="autoResize"
          />
          <button
            type="button"
            :disabled="!inputText.trim() || isLoading"
            class="w-8 h-8 rounded-full bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
            @click="handleSend"
          >
            <ArrowUp class="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ArrowUp, Sparkles, X } from 'lucide-vue-next'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface Props {
  open: boolean
  entityType: 'lead' | 'deal'
  entityName: string
  entityData?: Record<string, unknown>
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const isLoading = ref(false)
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)

const hasMessages = computed(() => messages.value.length > 0)

const suggestedQuestions = computed(() => {
  if (props.entityType === 'lead') {
    return [
      { title: 'Tóm tắt thông tin lead này', desc: 'Xem tổng quan về lead và trạng thái hiện tại' },
      { title: 'Gợi ý hành động tiếp theo', desc: 'Nhận đề xuất để chuyển lead sang giai đoạn tiếp theo' },
      { title: 'Phân tích điểm mạnh / yếu', desc: 'Đánh giá khả năng chuyển đổi thành khách hàng' },
      { title: 'Soạn email giới thiệu', desc: 'Tạo email tiếp cận phù hợp với thông tin lead' },
    ]
  }
  return [
    { title: 'Tóm tắt deal hiện tại', desc: 'Xem tổng quan giá trị, giai đoạn và xác suất thành công' },
    { title: 'Thống kê và dự báo', desc: 'Phân tích xu hướng và dự đoán khả năng chốt deal' },
    { title: 'Gợi ý để chốt deal', desc: 'Nhận gợi ý hành động cụ thể để đảm bảo chốt deal' },
    { title: 'Soạn báo giá / đề xuất', desc: 'Tạo nội dung báo giá phù hợp với nhu cầu khách hàng' },
  ]
})

const contextTags = computed(() => {
  const tags: string[] = []
  if (props.entityType === 'lead') tags.push('CRM Lead')
  else tags.push('CRM Deal')
  if (props.entityName) tags.push(props.entityName)
  return tags
})

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 112) + 'px'
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

  messages.value.push({ id: Date.now() + '-u', role: 'user', content: text })
  await scrollToBottom()

  isLoading.value = true
  const loadingId = Date.now() + '-a'
  messages.value.push({ id: loadingId, role: 'assistant', content: '', loading: true })
  await scrollToBottom()

  await new Promise((r) => setTimeout(r, 1400))

  const idx = messages.value.findIndex((m) => m.id === loadingId)
  if (idx !== -1) {
    messages.value[idx] = {
      id: loadingId,
      role: 'assistant',
      content: generateResponse(text),
      loading: false,
    }
  }
  isLoading.value = false
  await scrollToBottom()
}

function generateResponse(question: string): string {
  const entity = props.entityType === 'lead' ? 'lead' : 'deal'
  const name = props.entityName

  if (question.toLowerCase().includes('tóm tắt') || question.toLowerCase().includes('tổng quan')) {
    if (entity === 'lead') {
      return `📋 **Tóm tắt Lead: ${name}**\n\nLead đang ở giai đoạn hiện tại với các thông tin cơ bản đã được ghi nhận. Cần theo dõi sát để nắm bắt cơ hội chuyển đổi.\n\n✅ Điểm tích cực: Lead có nguồn rõ ràng và đã có tương tác ban đầu.\n⚠️ Cần chú ý: Chưa có lịch hẹn cụ thể. Nên liên hệ trong 24–48h tới.`
    }
    return `📋 **Tóm tắt Deal: ${name}**\n\nDeal đang được theo dõi với xác suất thành công hiện tại. Cần đẩy mạnh các bước chốt trong giai đoạn tiếp theo.\n\n✅ Điểm mạnh: Khách hàng đã xem tài liệu nhiều lần.\n⚠️ Rủi ro: Cần gửi báo giá chính thức sớm để tránh mất cơ hội.`
  }

  if (question.toLowerCase().includes('gợi ý') || question.toLowerCase().includes('hành động') || question.toLowerCase().includes('chốt')) {
    return `🎯 **Gợi ý hành động cho ${name}:**\n\n1. 📞 Gọi điện xác nhận nhu cầu trong hôm nay\n2. 📧 Gửi email tóm tắt giải pháp + báo giá\n3. 📅 Đặt lịch demo sản phẩm (đề xuất trong 3–5 ngày tới)\n4. 📝 Ghi chú phản hồi của khách sau mỗi cuộc trao đổi\n\n💡 Xác suất thành công tăng 20% nếu thực hiện bước 2 trong vòng 24h.`
  }

  if (question.toLowerCase().includes('email') || question.toLowerCase().includes('báo giá') || question.toLowerCase().includes('đề xuất')) {
    return `✉️ **Mẫu email cho ${name}:**\n\nChủ đề: Giải pháp phù hợp cho ${name}\n\nKính gửi Anh/Chị,\n\nCảm ơn Anh/Chị đã quan tâm đến dịch vụ của chúng tôi. Tôi xin gửi kèm theo đây tóm tắt giải pháp được thiết kế riêng cho ${name}.\n\n[Nội dung giải pháp tùy chỉnh]\n\nMong được trao đổi thêm!\n\nTrân trọng,\n[Tên nhân viên]`
  }

  if (question.toLowerCase().includes('phân tích') || question.toLowerCase().includes('thống kê') || question.toLowerCase().includes('dự báo')) {
    return `📊 **Phân tích ${entity === 'lead' ? 'Lead' : 'Deal'}: ${name}**\n\n• Điểm tương tác: Cao ✅\n• Mức độ quan tâm: Trung bình – Cao\n• Thời gian trong giai đoạn hiện tại: Bình thường\n• Xác suất chuyển đổi dự kiến: 65–75%\n\n🔍 Nhận xét: Đây là ${entity === 'lead' ? 'lead' : 'deal'} có tiềm năng. Hành động nhanh sẽ tăng đáng kể khả năng thành công.`
  }

  return `Cảm ơn câu hỏi của bạn về ${entity === 'lead' ? 'lead' : 'deal'} "${name}". Tôi đang phân tích thông tin...\n\nDựa trên dữ liệu hiện có, tôi đề xuất bạn tập trung vào việc duy trì liên lạc thường xuyên và cung cấp thêm thông tin giá trị cho khách hàng. Hãy đặt câu hỏi cụ thể hơn để tôi có thể hỗ trợ chi tiết hơn!`
}

async function scrollToBottom() {
  await nextTick()
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

watch(() => props.open, (val) => {
  if (!val) {
    messages.value = []
    inputText.value = ''
    isLoading.value = false
  }
})
</script>
