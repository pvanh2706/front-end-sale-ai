<template>
  <AdminLayout>
    <div class="mt-6 space-y-6">
      <header class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 md:p-5">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-start gap-3">
            <div class="rounded-lg bg-brand-50 p-2 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300">
              <GitBranch class="h-5 w-5" />
            </div>
            <div>
              <h1 class="text-theme-xl font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h1>
              <p class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                {{ organizationName }}
                <span class="mx-2 text-gray-300 dark:text-gray-700">•</span>
                <Badge class="bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300">{{ userRole }}</Badge>
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" class="border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-200" @click="handleHistory">
              <History class="mr-1.5 h-4 w-4" />
              Lịch sử thay đổi
            </Button>
            <Button type="button" class="bg-brand-500 text-white hover:bg-brand-600" @click="handleSaveConfig">
              <Save class="mr-1.5 h-4 w-4" />
              Lưu cấu hình
            </Button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside class="space-y-3 xl:col-span-3">
          <div class="flex items-center justify-between px-1">
            <h2 class="text-theme-sm font-semibold text-gray-700 dark:text-gray-300">Pipelines tổ chức ({{ pipelines.length }})</h2>
            <Button type="button" variant="ghost" size="icon" class="text-brand-500 hover:text-brand-600" @click="handleCreatePipeline">
              <PlusCircle class="h-5 w-5" />
            </Button>
          </div>

          <div class="max-h-[520px] space-y-3 overflow-y-auto pr-1">
            <article
              v-for="pipeline in pipelines"
              :key="pipeline.id"
              class="cursor-pointer rounded-xl border p-4 transition-all"
              :class="pipeline.id === selectedPipelineId
                ? 'border-brand-500 bg-brand-50/60 shadow-theme-sm dark:bg-brand-500/10'
                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'"
              @click="selectedPipelineId = pipeline.id"
            >
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ pipeline.name }}</h3>
                <GripVertical class="h-4 w-4 text-gray-400" />
              </div>
              <p class="mt-2 text-theme-xs text-gray-500 dark:text-gray-400">{{ pipeline.deals }} deal · {{ pipeline.revenue }}</p>
              <Badge
                v-if="pipeline.isDefault"
                class="mt-2 bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300"
              >
                Mặc định
              </Badge>
            </article>
          </div>

          <Button
            type="button"
            variant="outline"
            class="w-full border-dashed border-brand-300 text-brand-500 hover:bg-brand-50 dark:border-brand-500/40 dark:hover:bg-brand-500/10"
            @click="handleCreatePipeline"
          >
            <Plus class="mr-1.5 h-4 w-4" />
            Tạo pipeline mới
          </Button>
        </aside>

        <main class="space-y-6 xl:col-span-9">
          <Tabs default-value="stages" class="w-full">
            <TabsList class="h-auto w-full justify-start overflow-x-auto rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
              <TabsTrigger value="stages" class="data-[state=active]:bg-brand-500 data-[state=active]:text-white">Giai đoạn</TabsTrigger>
              <TabsTrigger value="fields">Trường tùy chỉnh</TabsTrigger>
              <TabsTrigger value="automation">Tự động hóa</TabsTrigger>
              <TabsTrigger value="ai-rules">AI rules</TabsTrigger>
              <TabsTrigger value="permission">Phân quyền</TabsTrigger>
              <TabsTrigger value="webhook">Webhook</TabsTrigger>
            </TabsList>

            <TabsContent value="stages" class="mt-4 space-y-6">
              <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
                <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Thiết kế quy trình bán hàng</h2>
                <p class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">Kéo thả để sắp xếp thứ tự hoặc chỉnh sửa chi tiết từng giai đoạn</p>

                <div class="mt-5 overflow-x-auto pb-2">
                  <div class="flex min-w-[1040px] gap-4">
                    <Card
                      v-for="stage in stages"
                      :key="stage.id"
                      class="w-[220px] shrink-0 border"
                      :class="stage.id === selectedStageId
                        ? 'border-brand-400 shadow-theme-md ring-2 ring-brand-100 dark:ring-brand-500/20'
                        : 'border-gray-200 dark:border-gray-800'"
                    >
                      <CardHeader class="space-y-3 p-4">
                        <div class="h-1 w-full rounded-full" :class="stageToneClass(stage.tone)" />
                        <div class="flex items-center justify-between">
                          <GripVertical class="h-4 w-4 text-gray-400" />
                          <Badge :class="stageTypeBadgeClass(stage.type)">{{ stage.typeLabel }}</Badge>
                        </div>
                        <Input v-model="stage.name" class="border-0 px-0 text-theme-sm font-semibold text-gray-900 focus-visible:ring-0 dark:text-white" />
                      </CardHeader>
                      <CardContent class="space-y-3 p-4 pt-0">
                        <div>
                          <div class="mb-1 flex items-center justify-between text-theme-xs text-gray-500 dark:text-gray-400">
                            <span>Xác suất thắng</span>
                            <span class="font-semibold text-brand-500">{{ stage.winRate }}%</span>
                          </div>
                          <div class="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div class="h-full rounded-full bg-brand-500" :style="{ width: `${stage.winRate}%` }" />
                          </div>
                        </div>

                        <div class="border-t border-gray-200 pt-3 dark:border-gray-800">
                          <div class="flex items-center justify-between text-theme-xs text-gray-500 dark:text-gray-400">
                            <span>{{ stage.deals }} deals</span>
                            <Button type="button" variant="ghost" size="icon" class="h-7 w-7" @click="selectedStageId = stage.id">
                              <Settings class="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      type="button"
                      variant="outline"
                      class="h-auto w-[220px] shrink-0 border-2 border-dashed border-gray-300 bg-gray-50/60 py-6 text-gray-500 transition-colors hover:border-brand-400 hover:bg-brand-50/60 hover:text-brand-500 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-brand-500/10"
                      @click="handleAddStage"
                    >
                      <span class="flex items-center gap-2 text-theme-sm font-medium">
                        <PlusCircle class="h-5 w-5" />
                        Thêm giai đoạn
                      </span>
                    </Button>
                  </div>
                </div>
              </section>

              <section class="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                <Card class="border-gray-200 dark:border-gray-800">
                  <CardHeader class="flex flex-row items-center justify-between space-y-0">
                    <CardTitle class="text-theme-xl text-gray-900 dark:text-white">Quy tắc chuyển stage</CardTitle>
                    <Button type="button" variant="ghost" class="text-brand-500 hover:text-brand-600" @click="handleCreateTransitionRule">Thêm mới</Button>
                  </CardHeader>
                  <CardContent class="space-y-3">
                    <article v-for="rule in transitionRules" :key="rule.id" class="rounded-xl border border-gray-200 p-3 dark:border-gray-800">
                      <div class="flex items-start justify-between gap-3">
                        <div>
                          <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ rule.title }}</p>
                          <p class="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">{{ rule.description }}</p>
                        </div>
                        <Switch v-model:checked="rule.enabled" />
                      </div>
                    </article>
                  </CardContent>
                </Card>

                <Card class="overflow-hidden border-brand-200 bg-gradient-to-br from-brand-50 via-white to-warning-50 dark:border-brand-500/30 dark:from-brand-500/10 dark:via-gray-900 dark:to-warning-500/10">
                  <CardHeader>
                    <CardTitle class="flex items-center gap-2 text-theme-xl text-brand-500">
                      <Sparkles class="h-5 w-5" />
                      AI Smart Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-5">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-theme-sm text-gray-700 dark:text-gray-300">
                        <span>AI Threshold (Deal Scoring)</span>
                        <span class="font-semibold text-brand-500">{{ aiSettings.threshold }}%</span>
                      </div>
                      <Input v-model.number="aiSettings.threshold" type="range" min="0" max="100" />
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-theme-sm text-gray-700 dark:text-gray-300">
                        <span>Risk Score Cutoff</span>
                        <span class="font-semibold text-brand-500">{{ aiSettings.riskCutoff }}%</span>
                      </div>
                      <Input v-model.number="aiSettings.riskCutoff" type="range" min="0" max="100" />
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center justify-between text-theme-sm text-gray-700 dark:text-gray-300">
                        <span>AI Confidence Cutoff</span>
                        <span class="font-semibold text-brand-500">{{ aiConfidenceLabel }}</span>
                      </div>
                      <Input v-model.number="aiSettings.confidence" type="range" min="0" max="100" />
                    </div>

                    <Button type="button" class="w-full bg-brand-500 text-white hover:bg-brand-600" @click="handleConfigureAi">
                      <Bot class="mr-1.5 h-4 w-4" />
                      Cấu hình AI Agent
                    </Button>
                  </CardContent>
                </Card>
              </section>

              <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
                <div class="mb-4 flex items-center justify-between gap-2">
                  <h2 class="text-theme-xl font-semibold text-gray-900 dark:text-white">Tự động hóa hiện tại</h2>
                  <Button type="button" variant="outline" class="border-gray-300 dark:border-gray-700" @click="handleCreateAutomationRule">
                    <Plus class="mr-1.5 h-4 w-4" />
                    Tạo rule mới
                  </Button>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full min-w-[760px]">
                    <thead>
                      <tr class="border-b border-gray-200 text-left text-theme-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <th class="py-3 pr-4">Workflow Rule</th>
                        <th class="py-3 pr-4">Loại</th>
                        <th class="py-3 pr-4">Kích hoạt</th>
                        <th class="py-3 text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="rule in automationRules" :key="rule.id" class="border-b border-gray-100 align-top last:border-0 dark:border-gray-800/60">
                        <td class="py-4 pr-4">
                          <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ rule.title }}</p>
                          <p class="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">{{ rule.description }}</p>
                        </td>
                        <td class="py-4 pr-4">
                          <Badge :class="automationTypeBadgeClass(rule.type)">{{ rule.type }}</Badge>
                        </td>
                        <td class="py-4 pr-4 text-theme-sm text-gray-500 dark:text-gray-400">{{ rule.trigger }}</td>
                        <td class="py-4 text-right">
                          <div class="inline-flex">
                            <Switch v-model:checked="rule.enabled" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="fields" class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              Trường tùy chỉnh sẽ được triển khai ở bước tiếp theo.
            </TabsContent>
            <TabsContent value="automation" class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              Khu vực tự động hóa nâng cao đang được chuẩn hóa.
            </TabsContent>
            <TabsContent value="ai-rules" class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              Danh sách AI rules chi tiết sẽ hiển thị tại đây.
            </TabsContent>
            <TabsContent value="permission" class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              Cấu hình phân quyền pipeline sẽ được bổ sung.
            </TabsContent>
            <TabsContent value="webhook" class="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-6 text-theme-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              Quản lý webhook cho pipeline đang được phát triển.
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'vue-sonner'
import {
  Bot,
  GitBranch,
  GripVertical,
  History,
  Plus,
  PlusCircle,
  Save,
  Settings,
  Sparkles,
} from 'lucide-vue-next'

interface PipelineSummary {
  id: string
  name: string
  deals: number
  revenue: string
  isDefault: boolean
}

type StageType = 'normal' | 'won' | 'lost'
type StageTone = 'brand' | 'warning' | 'success' | 'error'

interface PipelineStageItem {
  id: string
  name: string
  winRate: number
  deals: number
  type: StageType
  typeLabel: string
  tone: StageTone
}

interface TransitionRuleItem {
  id: string
  title: string
  description: string
  enabled: boolean
}

type AutomationType = 'AI LOGIC' | 'WORKFLOW' | 'NOTIFICATION'

interface AutomationRuleItem {
  id: string
  title: string
  description: string
  type: AutomationType
  trigger: string
  enabled: boolean
}

const pageTitle = ref('Cấu hình Pipeline')
const organizationName = ref('Salio TechNova')
const userRole = ref('Quản trị viên')

const pipelines = ref<PipelineSummary[]>([
  { id: 'b2b-sales', name: 'Bán hàng B2B', deals: 124, revenue: '₫ 18.4 tỷ', isDefault: true },
  { id: 'renewal-upsell', name: 'Renewal & Upsell', deals: 38, revenue: '₫ 4.2 tỷ', isDefault: false },
  { id: 'smb-quick-sales', name: 'SMB Quick Sales', deals: 67, revenue: '₫ 1.1 tỷ', isDefault: false },
])

const selectedPipelineId = ref('b2b-sales')
const selectedStageId = ref('negotiating')

const stages = ref<PipelineStageItem[]>([
  { id: 'new', name: 'Mới', winRate: 5, deals: 18, type: 'normal', typeLabel: 'Bình thường', tone: 'brand' },
  { id: 'preparing', name: 'Đang chuẩn bị', winRate: 15, deals: 24, type: 'normal', typeLabel: 'Bình thường', tone: 'brand' },
  { id: 'contacted', name: 'Đã liên hệ', winRate: 30, deals: 19, type: 'normal', typeLabel: 'Bình thường', tone: 'brand' },
  { id: 'negotiating', name: 'Đàm phán', winRate: 50, deals: 15, type: 'normal', typeLabel: 'Bình thường', tone: 'warning' },
  { id: 'quoted', name: 'Báo giá', winRate: 70, deals: 11, type: 'normal', typeLabel: 'Bình thường', tone: 'warning' },
  { id: 'won', name: 'Thắng', winRate: 100, deals: 8, type: 'won', typeLabel: 'Thắng', tone: 'success' },
  { id: 'lost', name: 'Thua', winRate: 0, deals: 6, type: 'lost', typeLabel: 'Thua', tone: 'error' },
])

const transitionRules = ref<TransitionRuleItem[]>([
  {
    id: 'attach-file',
    title: 'Cần đính kèm file',
    description: "Yêu cầu hợp đồng nháp khi chuyển sang 'Đàm phán'",
    enabled: true,
  },
  {
    id: 'win-reason',
    title: 'Nhập lý do thắng',
    description: 'Buộc nhân viên chọn lý do chính khi đánh dấu Thắng',
    enabled: true,
  },
  {
    id: 'quote-warning',
    title: 'Cảnh báo tồn đọng',
    description: "Gửi thông báo nếu deal ở 'Báo giá' quá 5 ngày",
    enabled: true,
  },
])

const automationRules = ref<AutomationRuleItem[]>([
  {
    id: 'high-score-alert',
    title: 'IF deal score > 90 THEN thông báo Manager',
    description: 'Hệ thống tự động phát hiện deal lớn tiềm năng',
    type: 'AI LOGIC',
    trigger: 'Khi Deal cập nhật',
    enabled: true,
  },
  {
    id: 'handover-cs',
    title: 'Tự động giao cho CS khi deal thắng',
    description: 'Chuyển quyền sở hữu cho bộ phận vận hành',
    type: 'WORKFLOW',
    trigger: 'Khi Giai đoạn = Thắng',
    enabled: true,
  },
  {
    id: 'birthday-message',
    title: 'Gửi lời chúc mừng sinh nhật khách hàng',
    description: 'Email tự động dựa trên ngày sinh trong CRM',
    type: 'NOTIFICATION',
    trigger: 'Ngày sinh trùng khớp',
    enabled: false,
  },
])

const aiSettings = reactive({
  threshold: 85,
  riskCutoff: 40,
  confidence: 75,
})

const aiConfidenceLabel = computed(() => {
  if (aiSettings.confidence >= 80) return 'High'
  if (aiSettings.confidence >= 50) return 'Medium'
  return 'Low'
})

function stageToneClass(tone: StageTone): string {
  if (tone === 'success') return 'bg-success-500'
  if (tone === 'warning') return 'bg-warning-500'
  if (tone === 'error') return 'bg-error-500'
  return 'bg-brand-500'
}

function stageTypeBadgeClass(type: StageType): string {
  if (type === 'won') return 'bg-success-50 text-success-500 dark:bg-success-500/15 dark:text-success-300'
  if (type === 'lost') return 'bg-error-50 text-error-500 dark:bg-error-500/15 dark:text-error-300'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
}

function automationTypeBadgeClass(type: AutomationType): string {
  if (type === 'AI LOGIC') return 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300'
  if (type === 'WORKFLOW') return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  return 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300'
}

function handleHistory(): void {
  toast('Đang mở lịch sử thay đổi pipeline')
}

function handleSaveConfig(): void {
  toast.success('Đã lưu cấu hình pipeline')
}

function handleCreatePipeline(): void {
  toast('Tạo pipeline mới sẽ được kết nối API ở bước tiếp theo')
}

function handleAddStage(): void {
  toast('Thêm giai đoạn mới đang được chuẩn bị')
}

function handleCreateTransitionRule(): void {
  toast('Mở modal tạo quy tắc chuyển stage')
}

function handleCreateAutomationRule(): void {
  toast('Mở modal tạo automation rule')
}

function handleConfigureAi(): void {
  toast.success('Đã lưu AI Smart Rules')
}
</script>
