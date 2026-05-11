<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page header -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Webhook Logs</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi và gỡ lỗi các sự kiện kết nối thời gian thực.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input v-model="search" class="w-64 pl-9" placeholder="Tìm kiếm log..." />
          </div>
          <!-- Filter by status -->
          <Select v-model="statusFilter">
            <SelectTrigger class="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="error">Lỗi</SelectItem>
              <SelectItem value="success">Thành công</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" class="gap-1.5" @click="refreshLogs">
            <RefreshCw class="h-4 w-4" :class="isRefreshing ? 'animate-spin' : ''" />
            Làm mới
          </Button>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Tổng sự kiện</p>
          <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Thành công</p>
          <p class="mt-1 text-2xl font-bold text-success-500">{{ stats.success }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Lỗi</p>
          <p class="mt-1 text-2xl font-bold text-error-500">{{ stats.error }}</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">Tỷ lệ thành công</p>
          <p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ stats.successRate }}</p>
        </div>
      </div>

      <!-- Log table -->
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[700px] text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
              <tr>
                <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">ID Sự kiện</th>
                <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Thời gian</th>
                <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Loại sự kiện</th>
                <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</th>
                <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Điểm đến</th>
                <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
              <tr
                v-for="log in filteredLogs"
                :key="log.id"
                class="transition-colors"
                :class="log.isError
                  ? 'bg-error-50/30 hover:bg-error-50/60 dark:bg-error-500/5 dark:hover:bg-error-500/10'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900/30'"
              >
                <td class="px-5 py-4">
                  <span
                    class="font-mono text-xs font-bold"
                    :class="log.isError ? 'text-error-500' : 'text-gray-700 dark:text-gray-300'"
                  >
                    {{ log.id }}
                  </span>
                </td>
                <td class="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{{ log.time }}</td>
                <td class="px-5 py-4">
                  <code class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    {{ log.eventType }}
                  </code>
                </td>
                <td class="px-5 py-4">
                  <Badge
                    class="text-[10px] font-bold uppercase"
                    :class="log.isError
                      ? 'bg-error-50 text-error-500 dark:bg-error-500/10'
                      : 'bg-success-50 text-success-500 dark:bg-success-500/10'"
                  >
                    {{ log.statusCode }}
                  </Badge>
                </td>
                <td class="max-w-[220px] truncate px-5 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                  {{ log.destination }}
                </td>
                <td class="px-5 py-4 text-right">
                  <button
                    class="text-xs font-bold text-brand-500 hover:underline dark:text-brand-400"
                    @click="openDetail(log)"
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>

              <tr v-if="filteredLogs.length === 0">
                <td colspan="6" class="px-5 py-12 text-center text-sm text-gray-400">
                  Không tìm thấy log nào phù hợp.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination footer -->
        <div class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-900/30">
          <p class="text-xs text-gray-500">Hiển thị {{ filteredLogs.length }} trên {{ logs.length }} sự kiện</p>
          <div class="flex gap-1">
            <button class="rounded border border-gray-200 p-1 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
              <ChevronLeft class="h-4 w-4 text-gray-500" />
            </button>
            <button class="rounded border border-gray-200 p-1 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
              <ChevronRight class="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Error Detail Sheet ─────────────────────────────────────────────── -->
    <Sheet :open="!!selectedLog" @update:open="(v) => { if (!v) selectedLog = null }">
      <SheetContent
        side="right"
        class="flex h-full w-full max-w-[500px] flex-col gap-0 p-0 dark:bg-gray-800"
        @pointer-down-outside="selectedLog = null"
      >
        <template v-if="selectedLog">
          <!-- Sheet header -->
          <div class="flex items-start justify-between border-b border-gray-200 p-5 dark:border-gray-700">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-bold text-gray-900 dark:text-white">
                  Chi tiết lỗi {{ selectedLog.id }}
                </h2>
                <Badge
                  class="gap-1 text-[10px] font-bold"
                  :class="selectedLog.isError
                    ? 'bg-error-50 text-error-500 dark:bg-error-500/10'
                    : 'bg-success-50 text-success-500 dark:bg-success-500/10'"
                >
                  <AlertCircle v-if="selectedLog.isError" class="h-3 w-3" />
                  <CheckCircle v-else class="h-3 w-3" />
                  {{ selectedLog.statusCode }}
                </Badge>
              </div>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Cập nhật lúc: {{ selectedLog.time }}
              </p>
            </div>
          </div>

          <!-- Sheet tabs -->
          <div class="border-b border-gray-200 bg-gray-50/60 px-5 pt-3 dark:border-gray-700 dark:bg-gray-900/30">
            <div class="flex gap-5">
              <button
                v-for="tab in detailTabs"
                :key="tab.value"
                class="pb-3 text-xs font-semibold transition-colors"
                :class="detailTab === tab.value
                  ? 'border-b-2 border-brand-500 text-brand-500'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'"
                @click="detailTab = tab.value"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Sheet body -->
          <div class="flex-1 space-y-6 overflow-y-auto p-5">

            <!-- ── Tab: Thông tin chung ─────────────────────────────────── -->
            <template v-if="detailTab === 'info'">
              <!-- Summary card -->
              <section>
                <h4 class="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Tổng quan sự kiện</h4>
                <div class="space-y-3">
                  <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                    <dl class="space-y-2.5 text-sm">
                      <div class="flex justify-between">
                        <dt class="text-gray-500">Mã trạng thái</dt>
                        <dd
                          class="font-bold"
                          :class="selectedLog.isError ? 'text-error-500' : 'text-success-500'"
                        >
                          {{ selectedLog.statusCode }}
                        </dd>
                      </div>
                      <Separator />
                      <div class="flex justify-between">
                        <dt class="text-gray-500">URL nguồn</dt>
                        <dd class="max-w-[240px] truncate font-mono text-xs text-gray-900 dark:text-white">
                          {{ selectedLog.destination }}
                        </dd>
                      </div>
                      <Separator />
                      <div class="flex justify-between">
                        <dt class="text-gray-500">Phương thức</dt>
                        <dd>
                          <Badge class="bg-brand-50 text-brand-500 text-[10px] font-bold dark:bg-brand-500/10">POST</Badge>
                        </dd>
                      </div>
                      <Separator />
                      <div class="flex justify-between">
                        <dt class="text-gray-500">Loại sự kiện</dt>
                        <dd>
                          <code class="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            {{ selectedLog.eventType }}
                          </code>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Error message -->
                  <div
                    v-if="selectedLog.isError"
                    class="flex items-start gap-3 rounded-xl border border-error-500/20 bg-error-50 p-4 dark:bg-error-500/10"
                  >
                    <TriangleAlert class="mt-0.5 h-5 w-5 shrink-0 text-error-500" />
                    <div>
                      <p class="text-sm font-bold text-error-500">Thông báo lỗi hệ thống</p>
                      <p class="mt-1 font-mono text-xs italic text-error-500/80">
                        "{{ selectedLog.errorMessage }}"
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Request Payload preview (collapsed) -->
              <section>
                <div class="mb-3 flex items-center justify-between">
                  <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Request Payload (JSON)</h4>
                  <button
                    class="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline dark:text-brand-400"
                    @click="copyPayload"
                  >
                    <Copy class="h-3.5 w-3.5" />
                    Sao chép
                  </button>
                </div>
                <div class="overflow-hidden rounded-xl bg-gray-900 p-4 dark:bg-gray-950">
                  <pre class="overflow-x-auto font-mono text-[11px] leading-relaxed"><span class="text-gray-400">{</span>
  <span class="text-blue-300">"event_id"</span>: <span class="text-green-400">"{{ selectedLog.id }}"</span>,
  <span class="text-blue-300">"event_type"</span>: <span class="text-green-400">"{{ selectedLog.eventType }}"</span>,
  <span class="text-blue-300">"timestamp"</span>: <span class="text-green-400">"{{ selectedLog.isoTime }}"</span>,
  <span class="text-blue-300">"data"</span>: <span class="text-gray-400">{{ selectedLog.payloadPreview }}</span>
<span class="text-gray-400">}</span></pre>
                </div>
              </section>
            </template>

            <!-- ── Tab: Payload ────────────────────────────────────────── -->
            <template v-else-if="detailTab === 'payload'">
              <div class="mb-3 flex items-center justify-between">
                <h4 class="text-[11px] font-bold uppercase tracking-wider text-gray-400">Request Payload đầy đủ</h4>
                <button
                  class="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                  @click="copyPayload"
                >
                  <Copy class="h-3.5 w-3.5" />
                  Sao chép
                </button>
              </div>
              <div class="rounded-xl bg-gray-900 p-4 dark:bg-gray-950">
                <pre class="overflow-x-auto font-mono text-[11px] leading-relaxed text-gray-300">{{ selectedLog.fullPayload }}</pre>
              </div>
            </template>

            <!-- ── Tab: Response ───────────────────────────────────────── -->
            <template v-else-if="detailTab === 'response'">
              <h4 class="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">System Response</h4>
              <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
                <pre class="overflow-x-auto font-mono text-xs leading-relaxed"><span :class="selectedLog.isError ? 'text-error-500 font-bold' : 'text-success-500 font-bold'">HTTP/1.1 {{ selectedLog.statusCode }}</span>
<span class="text-gray-500">Content-Type: application/json</span>

<span class="text-gray-700 dark:text-gray-300">{{ selectedLog.responseBody }}</span></pre>
              </div>
            </template>

            <!-- ── Tab: Logs ───────────────────────────────────────────── -->
            <template v-else>
              <h4 class="mb-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Chi tiết log hệ thống</h4>
              <div class="space-y-2">
                <div
                  v-for="entry in selectedLog.logEntries"
                  :key="entry.time"
                  class="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/30"
                >
                  <span
                    class="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    :class="entry.level === 'error' ? 'bg-error-500' : entry.level === 'warn' ? 'bg-warning-500' : 'bg-gray-400'"
                  />
                  <div class="flex-1 text-xs">
                    <div class="flex items-center justify-between">
                      <span class="font-mono text-gray-400">{{ entry.time }}</span>
                      <Badge
                        class="text-[9px] font-bold uppercase"
                        :class="entry.level === 'error'
                          ? 'bg-error-50 text-error-500 dark:bg-error-500/10'
                          : entry.level === 'warn'
                            ? 'bg-warning-50 text-warning-500 dark:bg-warning-500/10'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700'"
                      >
                        {{ entry.level }}
                      </Badge>
                    </div>
                    <p class="mt-1 text-gray-700 dark:text-gray-300">{{ entry.message }}</p>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Sheet footer -->
          <div class="flex gap-3 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <Button
              class="flex-1 gap-1.5 bg-brand-500 text-white hover:bg-brand-600"
              :disabled="isRetrying"
              @click="retryEvent"
            >
              <Loader2 v-if="isRetrying" class="h-4 w-4 animate-spin" />
              <RefreshCw v-else class="h-4 w-4" />
              {{ isRetrying ? 'Đang thử lại...' : 'Thử lại ngay' }}
            </Button>
            <Button variant="outline" class="flex-1 gap-1.5" @click="contactDev">
              <Code2 class="h-4 w-4" />
              Giao tiếp với dev
            </Button>
          </div>
        </template>
      </SheetContent>
    </Sheet>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Loader2,
  RefreshCw,
  Search,
  TriangleAlert,
} from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { toast } from 'vue-sonner'

// ── Types ─────────────────────────────────────────────────────────────────────

interface LogEntry {
  time: string
  level: 'info' | 'warn' | 'error'
  message: string
}

interface WebhookLog {
  id: string
  time: string
  isoTime: string
  eventType: string
  statusCode: string
  destination: string
  isError: boolean
  errorMessage: string
  payloadPreview: string
  fullPayload: string
  responseBody: string
  logEntries: LogEntry[]
}

// ── State ─────────────────────────────────────────────────────────────────────

const search = ref('')
const statusFilter = ref('all')
const isRefreshing = ref(false)
const selectedLog = ref<WebhookLog | null>(null)
const detailTab = ref<'info' | 'payload' | 'response' | 'logs'>('info')
const isRetrying = ref(false)

const detailTabs = [
  { label: 'Thông tin chung', value: 'info' },
  { label: 'Payload', value: 'payload' },
  { label: 'Response', value: 'response' },
  { label: 'Logs', value: 'logs' },
] as const

// ── Mock data ─────────────────────────────────────────────────────────────────

const logs = ref<WebhookLog[]>([
  {
    id: '#ERR-9921',
    time: '2024-05-24 14:02:11',
    isoTime: '2024-05-24T14:02:11Z',
    eventType: 'lead.created',
    statusCode: '400 Bad Request',
    destination: 'https://crm-api.acme.com/v1/hook',
    isError: true,
    errorMessage: 'Missing required field: email',
    payloadPreview: `{
    "full_name": "Nguyen Van A",
    "phone": "+84 901 234 567",
    // Missing "email" field here
    "source": "Landing Page AI"
  }`,
    fullPayload: `{
  "event_id": "EVT-9921",
  "event_type": "lead.created",
  "timestamp": "2024-05-24T14:02:11Z",
  "data": {
    "full_name": "Nguyen Van A",
    "phone": "+84 901 234 567",
    "source": "Landing Page AI"
  }
}`,
    responseBody: `{
  "success": false,
  "error_code": "VALIDATION_FAILED",
  "message": "Missing required field: email"
}`,
    logEntries: [
      { time: '14:02:11.001', level: 'info', message: 'Webhook received from 103.9.x.x' },
      { time: '14:02:11.012', level: 'info', message: 'Parsing JSON payload — OK' },
      { time: '14:02:11.024', level: 'warn', message: 'Validation started for event "lead.created"' },
      { time: '14:02:11.025', level: 'error', message: 'Validation failed: required field "email" is missing' },
      { time: '14:02:11.026', level: 'error', message: 'Response dispatched: 400 Bad Request' },
    ],
  },
  {
    id: '#EVT-8842',
    time: '2024-05-24 13:55:04',
    isoTime: '2024-05-24T13:55:04Z',
    eventType: 'payment.success',
    statusCode: '200 OK',
    destination: 'https://webhook.site/b7c2...',
    isError: false,
    errorMessage: '',
    payloadPreview: `{
    "order_id": "ORD-5510",
    "amount": 2500000,
    "currency": "VND"
  }`,
    fullPayload: `{
  "event_id": "EVT-8842",
  "event_type": "payment.success",
  "timestamp": "2024-05-24T13:55:04Z",
  "data": {
    "order_id": "ORD-5510",
    "amount": 2500000,
    "currency": "VND",
    "payer": "Tran Thi B"
  }
}`,
    responseBody: `{
  "success": true,
  "received": true
}`,
    logEntries: [
      { time: '13:55:04.003', level: 'info', message: 'Webhook received from 42.115.x.x' },
      { time: '13:55:04.015', level: 'info', message: 'Parsing JSON payload — OK' },
      { time: '13:55:04.022', level: 'info', message: 'Validation passed for event "payment.success"' },
      { time: '13:55:04.045', level: 'info', message: 'Response dispatched: 200 OK' },
    ],
  },
  {
    id: '#EVT-8841',
    time: '2024-05-24 13:54:12',
    isoTime: '2024-05-24T13:54:12Z',
    eventType: 'lead.created',
    statusCode: '200 OK',
    destination: 'https://crm-api.acme.com/v1/hook',
    isError: false,
    errorMessage: '',
    payloadPreview: `{
    "full_name": "Le Van C",
    "email": "levanc@example.com",
    "phone": "+84 902 111 222"
  }`,
    fullPayload: `{
  "event_id": "EVT-8841",
  "event_type": "lead.created",
  "timestamp": "2024-05-24T13:54:12Z",
  "data": {
    "full_name": "Le Van C",
    "email": "levanc@example.com",
    "phone": "+84 902 111 222",
    "source": "Facebook Ads"
  }
}`,
    responseBody: `{
  "success": true,
  "lead_id": "LEAD-0042"
}`,
    logEntries: [
      { time: '13:54:12.001', level: 'info', message: 'Webhook received from 42.115.x.x' },
      { time: '13:54:12.013', level: 'info', message: 'Parsing JSON payload — OK' },
      { time: '13:54:12.020', level: 'info', message: 'Validation passed for event "lead.created"' },
      { time: '13:54:12.041', level: 'info', message: 'Lead created successfully: LEAD-0042' },
      { time: '13:54:12.043', level: 'info', message: 'Response dispatched: 200 OK' },
    ],
  },
  {
    id: '#ERR-9920',
    time: '2024-05-24 13:49:55',
    isoTime: '2024-05-24T13:49:55Z',
    eventType: 'contact.updated',
    statusCode: '500 Internal Server Error',
    destination: 'https://crm-api.acme.com/v1/contacts',
    isError: true,
    errorMessage: 'Database timeout — connection pool exhausted',
    payloadPreview: `{
    "contact_id": "CTX-0017",
    "phone": "+84 903 444 555"
  }`,
    fullPayload: `{
  "event_id": "EVT-9920",
  "event_type": "contact.updated",
  "timestamp": "2024-05-24T13:49:55Z",
  "data": {
    "contact_id": "CTX-0017",
    "phone": "+84 903 444 555",
    "updated_by": "admin"
  }
}`,
    responseBody: `{
  "success": false,
  "error_code": "SERVER_ERROR",
  "message": "Database timeout — connection pool exhausted"
}`,
    logEntries: [
      { time: '13:49:55.002', level: 'info', message: 'Webhook received from 103.9.x.x' },
      { time: '13:49:55.014', level: 'info', message: 'Parsing JSON payload — OK' },
      { time: '13:49:55.016', level: 'info', message: 'Validation passed' },
      { time: '13:49:55.890', level: 'warn', message: 'Database query timeout after 874ms' },
      { time: '13:49:55.891', level: 'error', message: 'Connection pool exhausted — retries failed' },
      { time: '13:49:55.892', level: 'error', message: 'Response dispatched: 500 Internal Server Error' },
    ],
  },
  {
    id: '#EVT-8839',
    time: '2024-05-24 13:48:33',
    isoTime: '2024-05-24T13:48:33Z',
    eventType: 'campaign.ended',
    statusCode: '200 OK',
    destination: 'https://analytics.salio.ai/events',
    isError: false,
    errorMessage: '',
    payloadPreview: `{
    "campaign_id": "CAMP-0088",
    "total_leads": 412
  }`,
    fullPayload: `{
  "event_id": "EVT-8839",
  "event_type": "campaign.ended",
  "timestamp": "2024-05-24T13:48:33Z",
  "data": {
    "campaign_id": "CAMP-0088",
    "total_leads": 412,
    "total_converted": 37
  }
}`,
    responseBody: `{
  "success": true,
  "tracked": true
}`,
    logEntries: [
      { time: '13:48:33.004', level: 'info', message: 'Webhook received' },
      { time: '13:48:33.018', level: 'info', message: 'Validation passed' },
      { time: '13:48:33.052', level: 'info', message: 'Analytics event tracked' },
      { time: '13:48:33.054', level: 'info', message: 'Response dispatched: 200 OK' },
    ],
  },
])

// ── Computed ──────────────────────────────────────────────────────────────────

const filteredLogs = computed(() => {
  const q = search.value.toLowerCase().trim()
  return logs.value.filter((log) => {
    const matchesSearch =
      !q ||
      log.id.toLowerCase().includes(q) ||
      log.eventType.toLowerCase().includes(q) ||
      log.destination.toLowerCase().includes(q) ||
      log.statusCode.toLowerCase().includes(q)
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'error' && log.isError) ||
      (statusFilter.value === 'success' && !log.isError)
    return matchesSearch && matchesStatus
  })
})

const stats = computed(() => {
  const total = logs.value.length
  const errorCount = logs.value.filter((l) => l.isError).length
  const successCount = total - errorCount
  return {
    total,
    success: successCount,
    error: errorCount,
    successRate: total === 0 ? '—' : `${Math.round((successCount / total) * 100)}%`,
  }
})

// ── Actions ───────────────────────────────────────────────────────────────────

function openDetail(log: WebhookLog): void {
  selectedLog.value = log
  detailTab.value = 'info'
}

async function refreshLogs(): Promise<void> {
  isRefreshing.value = true
  await new Promise((resolve) => setTimeout(resolve, 900))
  isRefreshing.value = false
  toast.success('Đã cập nhật danh sách log')
}

function copyPayload(): void {
  if (!selectedLog.value) return
  void navigator.clipboard.writeText(selectedLog.value.fullPayload)
  toast.success('Đã sao chép payload')
}

async function retryEvent(): Promise<void> {
  if (!selectedLog.value) return
  isRetrying.value = true
  await new Promise((resolve) => setTimeout(resolve, 1500))
  isRetrying.value = false
  toast.success(`Đã thử lại sự kiện ${selectedLog.value.id}`)
  selectedLog.value = null
}

function contactDev(): void {
  toast('Đang mở kênh liên hệ với dev...')
}
</script>
