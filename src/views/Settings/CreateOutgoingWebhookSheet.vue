<template>
  <Sheet :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent
      side="right"
      class="flex h-full w-full max-w-2xl flex-col gap-0 p-0 dark:bg-gray-800"
      @pointer-down-outside.prevent
    >
      <!-- Header -->
      <div class="flex items-start justify-between border-b border-gray-200 px-8 py-5 dark:border-gray-700">
        <div>
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">Tạo webhook mới</h2>
          <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Cấu hình luồng gửi dữ liệu tự động ra ngoài</p>
        </div>
      </div>

      <!-- Stepper -->
      <div class="flex items-center justify-between bg-gray-50 px-8 py-4 dark:bg-gray-900/50">
        <template v-for="(step, idx) in steps" :key="step.id">
          <div class="flex items-center gap-2">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
              :class="stepStateClass(idx)"
            >
              <CheckIcon v-if="idx < currentStep" class="h-4 w-4" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span
              class="text-xs font-medium transition-colors"
              :class="idx === currentStep
                ? 'text-brand-500 font-bold'
                : idx < currentStep
                  ? 'text-gray-500 dark:text-gray-400'
                  : 'text-gray-400 dark:text-gray-500'"
            >
              {{ step.label }}
            </span>
          </div>
          <div
            v-if="idx < steps.length - 1"
            class="h-px w-8 transition-colors"
            :class="idx < currentStep ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-600'"
          />
        </template>
      </div>

      <!-- Step Content -->
      <div class="flex-1 overflow-y-auto p-8">

        <!-- ─── STEP 1: Chọn nguồn ─────────────────────────────────────────── -->
        <template v-if="currentStep === 0">
          <div class="mb-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Chọn nền tảng đích</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Dữ liệu từ Salio sẽ được gửi đến đâu?</p>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button
              v-for="dest in destinations"
              :key="dest.id"
              class="flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all hover:border-brand-500 hover:shadow-theme-xs"
              :class="form.destination === dest.id
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'"
              @click="form.destination = dest.id"
            >
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold"
                :style="{ backgroundColor: dest.bg, color: dest.color }"
              >
                {{ dest.abbrev }}
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">{{ dest.name }}</span>
            </button>

            <!-- Custom Webhook -->
            <button
              class="flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all hover:border-brand-500 hover:shadow-theme-xs"
              :class="form.destination === 'custom'
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                : 'border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/30'"
              @click="form.destination = 'custom'"
            >
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700">
                <Plus class="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Custom URL</span>
            </button>
          </div>
        </template>

        <!-- ─── STEP 2: Endpoint ───────────────────────────────────────────── -->
        <template v-else-if="currentStep === 1">
          <div class="mb-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Cấu hình Endpoint</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Nhập URL nhận dữ liệu và phương thức xác thực.</p>
          </div>

          <div class="space-y-5">
            <div class="space-y-1.5">
              <Label for="wh-name">Tên webhook <span class="text-error-500">*</span></Label>
              <Input id="wh-name" v-model="form.name" placeholder="VD: Gửi lead sang CRM ngoài" />
            </div>

            <div class="space-y-1.5">
              <Label for="wh-url">Target URL <span class="text-error-500">*</span></Label>
              <Input id="wh-url" v-model="form.url" type="url" placeholder="https://your-app.com/webhook" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <Label>HTTP Method</Label>
                <Select v-model="form.method">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-1.5">
                <Label>Xác thực</Label>
                <Select v-model="form.authType">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không có</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="basic">Basic Auth</SelectItem>
                    <SelectItem value="hmac">HMAC Signature</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div v-if="form.authType === 'bearer'" class="space-y-1.5">
              <Label for="wh-token">Bearer Token <span class="text-error-500">*</span></Label>
              <Input id="wh-token" v-model="form.authToken" type="password" placeholder="sk-..." />
            </div>

            <div v-else-if="form.authType === 'hmac'" class="space-y-1.5">
              <Label for="wh-secret">HMAC Secret</Label>
              <Input id="wh-secret" v-model="form.authSecret" type="password" placeholder="your-secret-key" />
              <p class="text-xs text-gray-500">Salio sẽ ký mỗi request với header <code class="font-mono">X-Salio-Signature</code>.</p>
            </div>

            <div class="space-y-1.5">
              <Label>Sự kiện kích hoạt</Label>
              <div class="grid grid-cols-2 gap-2">
                <label
                  v-for="ev in eventOptions"
                  :key="ev.value"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs transition-colors hover:border-brand-500 dark:border-gray-700"
                  :class="form.events.includes(ev.value) ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : ''"
                >
                  <Checkbox
                    :checked="form.events.includes(ev.value)"
                    @update:checked="toggleEvent(ev.value)"
                  />
                  <span class="font-medium text-gray-700 dark:text-gray-300">{{ ev.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </template>

        <!-- ─── STEP 3: Field Mapping ─────────────────────────────────────── -->
        <template v-else-if="currentStep === 2">
          <div class="mb-5 flex items-start justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Khớp nối trường dữ liệu</h3>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Chọn các trường CRM sẽ được gửi đi và ánh xạ sang tên trường đích.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              class="shrink-0 gap-1.5 border-brand-500 text-brand-500 hover:bg-brand-50"
              @click="autoMap"
            >
              <Sparkles class="h-3.5 w-3.5" />
              AI Tự động khớp
            </Button>
          </div>

          <!-- Mapping table header -->
          <div class="mb-3 grid grid-cols-2 gap-8 px-4">
            <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <ArrowUpFromLine class="h-3.5 w-3.5" />
              Trường Salio CRM (nguồn)
            </div>
            <div class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <ArrowDownToLine class="h-3.5 w-3.5" />
              Tên trường đích (payload)
            </div>
          </div>

          <!-- Mapping rows -->
          <div class="space-y-2">
            <div
              v-for="(row, idx) in form.fieldMappings"
              :key="row.id"
              class="group grid grid-cols-2 items-center gap-8"
            >
              <!-- Source field -->
              <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/30">
                <div class="flex items-center gap-2">
                  <div
                    class="h-2 w-2 rounded-full"
                    :class="row.enabled ? 'bg-brand-500' : 'bg-gray-300'"
                  />
                  <span class="font-mono text-xs font-medium text-gray-900 dark:text-white">{{ row.source }}</span>
                </div>
                <Badge
                  class="text-[10px] font-bold uppercase"
                  :class="typeClass(row.type)"
                >
                  {{ row.type }}
                </Badge>
              </div>

              <!-- Target field -->
              <div class="flex items-center gap-2">
                <div
                  class="relative flex-1 overflow-hidden rounded-xl border px-4 py-3 transition-all"
                  :class="row.enabled
                    ? 'border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/10'
                    : 'border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-900/20'"
                >
                  <input
                    v-if="row.enabled"
                    v-model="row.target"
                    class="w-full bg-transparent font-mono text-xs font-semibold text-brand-500 outline-none placeholder:text-gray-400 dark:text-brand-400"
                    placeholder="target_field_name"
                  />
                  <span v-else class="text-xs italic text-gray-400">Tắt — bỏ qua trường này</span>
                </div>
                <button
                  class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  :class="row.enabled ? 'hover:text-error-500' : 'hover:text-success-500'"
                  :title="row.enabled ? 'Tắt trường này' : 'Bật trường này'"
                  @click="toggleMappingRow(idx)"
                >
                  <EyeOff v-if="row.enabled" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Transformation rules -->
          <div class="mt-6 rounded-xl border border-warning-500/20 bg-warning-50 p-5 dark:border-warning-500/10 dark:bg-warning-500/5">
            <div class="mb-3 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Wand2 class="h-4 w-4 text-warning-500" />
                <h4 class="text-sm font-bold text-warning-500">Quy tắc biến đổi dữ liệu <span class="font-normal opacity-70">(Tùy chọn)</span></h4>
              </div>
              <button
                class="flex items-center gap-1 text-xs font-semibold text-warning-500 hover:underline"
                @click="addTransformRule"
              >
                <Plus class="h-3.5 w-3.5" />
                Thêm quy tắc
              </button>
            </div>
            <p class="mb-4 text-xs text-gray-600 dark:text-gray-400">
              Định dạng lại dữ liệu trước khi gửi đi (VD: Viết hoa chữ cái đầu, đổi định dạng ngày tháng).
            </p>

            <div
              v-if="form.transformRules.length === 0"
              class="rounded-lg border border-dashed border-warning-500/30 py-4 text-center text-xs text-gray-400"
            >
              Chưa có quy tắc nào. Nhấn "Thêm quy tắc" để bắt đầu.
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(rule, idx) in form.transformRules"
                :key="rule.id"
                class="flex items-center gap-3 rounded-lg bg-white px-3 py-2 dark:bg-gray-800"
              >
                <span class="w-4 shrink-0 text-xs font-bold text-gray-500">{{ idx + 1 }}.</span>
                <Select v-model="rule.field" class="w-36">
                  <SelectTrigger class="h-7 text-xs">
                    <SelectValue placeholder="Chọn trường" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="row in enabledMappings"
                      :key="row.source"
                      :value="row.source"
                    >
                      {{ row.source }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <ArrowRight class="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <Select v-model="rule.transform">
                  <SelectTrigger class="h-7 flex-1 text-xs">
                    <SelectValue placeholder="Chọn phép biến đổi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="capitalize">Capitalize (Viết hoa đầu)</SelectItem>
                    <SelectItem value="uppercase">Uppercase (Viết hoa toàn bộ)</SelectItem>
                    <SelectItem value="lowercase">Lowercase (Viết thường toàn bộ)</SelectItem>
                    <SelectItem value="trim">Trim (Xóa khoảng trắng)</SelectItem>
                    <SelectItem value="date_iso">Date → ISO 8601</SelectItem>
                    <SelectItem value="date_vn">Date → DD/MM/YYYY</SelectItem>
                    <SelectItem value="phone_vn">Phone → VN Format</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  class="shrink-0 text-gray-400 transition-colors hover:text-error-500"
                  @click="removeTransformRule(idx)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- ─── STEP 4: Test ───────────────────────────────────────────────── -->
        <template v-else>
          <div class="mb-6">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Kiểm tra Webhook</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gửi một request thử để xác nhận cấu hình hoạt động đúng.
            </p>
          </div>

          <!-- Summary card -->
          <div class="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/30">
            <h4 class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Tóm tắt cấu hình</h4>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">Tên</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ form.name || '—' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Đích</dt>
                <dd class="font-mono text-xs text-brand-500 dark:text-brand-400">{{ form.url || '—' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Method</dt>
                <dd>
                  <Badge class="bg-brand-50 text-brand-500 text-[10px] font-bold dark:bg-brand-500/10">
                    {{ form.method }}
                  </Badge>
                </dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Trường gửi đi</dt>
                <dd class="font-medium text-gray-900 dark:text-white">{{ enabledMappings.length }} trường</dd>
              </div>
            </dl>
          </div>

          <!-- Test payload preview -->
          <div class="mb-5 rounded-xl bg-gray-900 p-4 dark:bg-gray-950">
            <div class="mb-2 flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-400">Payload mẫu</span>
              <button class="text-gray-400 hover:text-white" @click="copyTestPayload">
                <Copy class="h-3.5 w-3.5" />
              </button>
            </div>
            <pre class="overflow-x-auto font-mono text-[11px] leading-relaxed text-gray-300">{{ testPayloadPreview }}</pre>
          </div>

          <!-- Test result -->
          <div v-if="testResult" class="mb-5">
            <div
              class="flex items-start gap-3 rounded-xl border p-4"
              :class="testResult.success
                ? 'border-success-500/30 bg-success-50 dark:bg-success-500/10'
                : 'border-error-500/30 bg-error-50 dark:bg-error-500/10'"
            >
              <CheckCircle v-if="testResult.success" class="mt-0.5 h-5 w-5 text-success-500" />
              <XCircle v-else class="mt-0.5 h-5 w-5 text-error-500" />
              <div>
                <p
                  class="text-sm font-semibold"
                  :class="testResult.success ? 'text-success-500' : 'text-error-500'"
                >
                  {{ testResult.success ? 'Webhook hoạt động tốt!' : 'Kết nối thất bại' }}
                </p>
                <p class="mt-0.5 text-xs text-gray-500">{{ testResult.message }}</p>
              </div>
            </div>
          </div>

          <Button
            class="w-full gap-1.5"
            :class="isTesting
              ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
              : 'bg-brand-500 text-white hover:bg-brand-600'"
            :disabled="isTesting"
            @click="runTest"
          >
            <Loader2 v-if="isTesting" class="h-4 w-4 animate-spin" />
            <Zap v-else class="h-4 w-4" />
            {{ isTesting ? 'Đang gửi...' : 'Gửi request thử' }}
          </Button>
        </template>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-gray-200 bg-white px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
        <Button
          v-if="currentStep > 0"
          variant="outline"
          class="gap-1.5"
          @click="currentStep--"
        >
          <ChevronLeft class="h-4 w-4" />
          Quay lại
        </Button>
        <div v-else />

        <div class="flex gap-3">
          <Button variant="ghost" class="text-gray-500" @click="$emit('update:open', false)">
            Hủy bỏ
          </Button>
          <Button
            v-if="currentStep < steps.length - 1"
            class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600"
            :disabled="!canProceed"
            @click="currentStep++"
          >
            Tiếp tục
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            v-else
            class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600"
            :disabled="!testResult?.success"
            @click="submit"
          >
            <CheckCircle class="h-4 w-4" />
            Tạo Webhook
          </Button>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  CheckCircle,
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
  XCircle,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { toast } from 'vue-sonner'

// ── Props & Emits ─────────────────────────────────────────────────────────────

const props = defineProps<{ open: boolean }>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'created', webhook: OutgoingWebhook): void
}>()

// ── Types ─────────────────────────────────────────────────────────────────────

interface FieldMapping {
  id: string
  source: string
  type: 'string' | 'email' | 'phone' | 'number' | 'timestamp' | 'boolean'
  target: string
  enabled: boolean
}

interface TransformRule {
  id: string
  field: string
  transform: string
}

interface OutgoingWebhook {
  id: string
  name: string
  url: string
  method: string
  active: boolean
  events: string[]
}

// ── Steps ─────────────────────────────────────────────────────────────────────

const steps = [
  { id: 'source', label: 'Chọn đích' },
  { id: 'endpoint', label: 'Endpoint' },
  { id: 'mapping', label: 'Field Mapping' },
  { id: 'test', label: 'Kiểm tra' },
]

const currentStep = ref(0)

// ── Destinations (step 1) ─────────────────────────────────────────────────────

const destinations = ref([
  { id: 'hubspot', name: 'HubSpot', abbrev: 'HUB', color: '#fff', bg: '#ff7a59' },
  { id: 'salesforce', name: 'Salesforce', abbrev: 'SF', color: '#fff', bg: '#00a1e0' },
  { id: 'zapier', name: 'Zapier', abbrev: 'ZAP', color: '#fff', bg: '#ff4a00' },
  { id: 'slack', name: 'Slack', abbrev: 'SLK', color: '#fff', bg: '#4a154b' },
  { id: 'google_sheet', name: 'Google Sheets', abbrev: 'GS', color: '#fff', bg: '#34a853' },
])

// ── Event options (step 2) ────────────────────────────────────────────────────

const eventOptions = [
  { value: 'lead.created', label: 'Lead mới tạo' },
  { value: 'lead.updated', label: 'Lead cập nhật' },
  { value: 'deal.stage_changed', label: 'Deal đổi giai đoạn' },
  { value: 'deal.won', label: 'Deal chốt thành công' },
  { value: 'deal.lost', label: 'Deal bị thua' },
  { value: 'contact.created', label: 'Liên hệ mới tạo' },
]

// ── Form state ────────────────────────────────────────────────────────────────

const form = ref({
  destination: '',
  name: '',
  url: '',
  method: 'POST',
  authType: 'none',
  authToken: '',
  authSecret: '',
  events: ['lead.created', 'deal.stage_changed'] as string[],
  fieldMappings: [
    { id: 'fm-1', source: 'Lead.FullName', type: 'string' as const, target: 'full_name', enabled: true },
    { id: 'fm-2', source: 'Lead.Email', type: 'email' as const, target: 'email', enabled: true },
    { id: 'fm-3', source: 'Lead.Phone', type: 'phone' as const, target: 'phone_number', enabled: true },
    { id: 'fm-4', source: 'Lead.Source', type: 'string' as const, target: 'source', enabled: true },
    { id: 'fm-5', source: 'Deal.Title', type: 'string' as const, target: 'deal_name', enabled: true },
    { id: 'fm-6', source: 'Deal.Stage', type: 'string' as const, target: 'pipeline_stage', enabled: false },
    { id: 'fm-7', source: 'Deal.Value', type: 'number' as const, target: 'deal_value', enabled: true },
    { id: 'fm-8', source: 'Deal.CreatedAt', type: 'timestamp' as const, target: 'created_at', enabled: false },
  ] as FieldMapping[],
  transformRules: [] as TransformRule[],
})

// ── Helpers ───────────────────────────────────────────────────────────────────

function toggleEvent(value: string): void {
  const idx = form.value.events.indexOf(value)
  if (idx === -1) {
    form.value.events.push(value)
  } else {
    form.value.events.splice(idx, 1)
  }
}

function toggleMappingRow(idx: number): void {
  form.value.fieldMappings[idx].enabled = !form.value.fieldMappings[idx].enabled
}

function addTransformRule(): void {
  form.value.transformRules.push({
    id: `tr-${Date.now()}`,
    field: '',
    transform: '',
  })
}

function removeTransformRule(idx: number): void {
  form.value.transformRules.splice(idx, 1)
}

function autoMap(): void {
  form.value.fieldMappings.forEach((row) => {
    if (!row.target) {
      row.target = row.source.replace('Lead.', '').replace('Deal.', 'deal_').toLowerCase()
    }
    row.enabled = true
  })
  toast.success('AI đã tự động khớp tất cả các trường!')
}

// ── Computed ──────────────────────────────────────────────────────────────────

const enabledMappings = computed(() => form.value.fieldMappings.filter((r) => r.enabled))

const canProceed = computed(() => {
  if (currentStep.value === 0) return !!form.value.destination
  if (currentStep.value === 1) return !!form.value.name.trim() && !!form.value.url.trim() && form.value.events.length > 0
  return true
})

const testPayloadPreview = computed(() => {
  const payload: Record<string, unknown> = {}
  enabledMappings.value.forEach((row) => {
    if (row.target) {
      const sampleValues: Record<string, unknown> = {
        string: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0901234567',
        number: 15000000,
        timestamp: new Date().toISOString(),
        boolean: true,
      }
      payload[row.target] = sampleValues[row.type] ?? 'sample_value'
    }
  })
  return JSON.stringify(payload, null, 2)
})

// ── Step state styling ─────────────────────────────────────────────────────────

function stepStateClass(idx: number): string {
  if (idx < currentStep.value) {
    return 'bg-brand-500 text-white'
  }
  if (idx === currentStep.value) {
    return 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
  }
  return 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
}

function typeClass(type: string): string {
  const map: Record<string, string> = {
    string: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    email: 'bg-brand-50 text-brand-500 dark:bg-brand-500/10',
    phone: 'bg-success-50 text-success-500 dark:bg-success-500/10',
    number: 'bg-warning-50 text-warning-500 dark:bg-warning-500/10',
    timestamp: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    boolean: 'bg-error-50 text-error-500 dark:bg-error-500/10',
  }
  return map[type] ?? 'bg-gray-100 text-gray-600'
}

// ── Test ──────────────────────────────────────────────────────────────────────

const isTesting = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

async function runTest(): Promise<void> {
  isTesting.value = true
  testResult.value = null
  await new Promise((resolve) => setTimeout(resolve, 1800))
  isTesting.value = false
  // Simulate success when URL is filled
  const ok = form.value.url.startsWith('http')
  testResult.value = ok
    ? { success: true, message: `HTTP 200 OK — Phản hồi trong 124ms. Endpoint đã nhận dữ liệu thành công.` }
    : { success: false, message: 'Không thể kết nối đến URL đích. Kiểm tra lại URL và thử lại.' }
}

function copyTestPayload(): void {
  void navigator.clipboard.writeText(testPayloadPreview.value)
  toast.success('Đã sao chép payload')
}

// ── Submit ────────────────────────────────────────────────────────────────────

function submit(): void {
  const webhook: OutgoingWebhook = {
    id: `owh-${Date.now()}`,
    name: form.value.name,
    url: form.value.url,
    method: form.value.method,
    active: true,
    events: form.value.events,
  }
  emit('created', webhook)
  emit('update:open', false)
  toast.success(`Đã tạo webhook "${webhook.name}"`)
}

// Reset on open
watch(
  () => props.open,
  (val) => {
    if (val) {
      currentStep.value = 0
      form.value.destination = ''
      form.value.name = ''
      form.value.url = ''
      form.value.method = 'POST'
      form.value.authType = 'none'
      form.value.authToken = ''
      form.value.authSecret = ''
      form.value.events = ['lead.created', 'deal.stage_changed']
      form.value.transformRules = []
      testResult.value = null
      form.value.fieldMappings.forEach((r) => {
        r.enabled = ['Lead.FullName', 'Lead.Email', 'Lead.Phone', 'Deal.Title', 'Deal.Value'].includes(r.source)
      })
    }
  },
)
</script>
