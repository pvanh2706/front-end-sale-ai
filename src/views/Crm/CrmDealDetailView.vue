<template>
  <AdminLayout>
    <div class="space-y-4 bg-gray-50 p-4 dark:bg-gray-950 md:p-6">
      <div v-if="loading" class="rounded-xl border border-dashed border-gray-300 bg-white p-3 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Đang tải dữ liệu deal...
      </div>

      <header class="rounded-xl border border-gray-200 bg-white p-4 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="mb-2 flex flex-wrap items-center gap-2">
              <Badge class="bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300">{{ deal.code }}</Badge>
              <Badge class="bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300">{{ currentStageLabel }}</Badge>
            </div>
            <h1 class="text-theme-xl font-semibold text-gray-900 dark:text-white">{{ deal.title }}</h1>
            <p class="mt-1 text-theme-xs text-gray-500">Cập nhật lần cuối: {{ deal.updatedAt }} bởi {{ deal.updatedBy }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button type="button" class="bg-brand-500 text-white hover:bg-brand-600" @click="handleAskAi">
              <Sparkles class="mr-1.5 h-4 w-4" />
              Chat hỏi đáp về deal
            </Button>
            <Button type="button" variant="outline" class="border-gray-300 dark:border-gray-700" @click="handleSave">
              <Save class="mr-1.5 h-4 w-4" />
              Lưu
            </Button>
            <Button type="button" variant="outline" class="border-error-500 text-error-500 hover:bg-error-50" @click="handleDelete">
              <Trash2 class="mr-1.5 h-4 w-4" />
              Xóa
            </Button>
          </div>
        </div>
      </header>

      <nav class="overflow-x-auto pb-1">
        <div class="flex min-w-max gap-1">
          <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-chevron flex min-w-[120px] items-center justify-center px-4 py-2 text-theme-xs font-medium"
            :class="stage.current
              ? 'bg-brand-500 text-white'
              : stage.locked
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-200'"
          >
            <Flag v-if="stage.current" class="mr-1 h-3.5 w-3.5" />
            {{ stage.label }}
          </div>
        </div>
      </nav>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div class="space-y-4 xl:col-span-7">
          <Tabs default-value="about" class="w-full">
            <TabsList class="h-auto w-full justify-start rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
              <TabsTrigger value="about">Về deal</TabsTrigger>
              <TabsTrigger value="products">Sản phẩm</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value="about" class="mt-4">
              <Card class="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle class="text-gray-900 dark:text-white">Thông tin chính</CardTitle>
                </CardHeader>
                <CardContent class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p class="text-theme-xs text-gray-500">Giá trị Deal</p>
                    <p class="mt-1 text-title-xs font-semibold text-brand-500">{{ deal.value }}</p>
                  </div>
                  <div>
                    <p class="text-theme-xs text-gray-500">Xác suất thành công</p>
                    <div class="mt-2 flex items-center gap-2">
                      <div class="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                        <div class="h-full rounded-full bg-brand-500" :style="{ width: `${deal.probability}%` }" />
                      </div>
                      <span class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.probability }}%</span>
                    </div>
                  </div>
                  <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <p class="text-theme-xs text-gray-500">Người phụ trách</p>
                    <p class="mt-1 text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.owner }}</p>
                  </div>
                  <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <p class="text-theme-xs text-gray-500">Dự kiến kết thúc</p>
                    <p class="mt-1 text-theme-sm font-medium text-gray-900 dark:text-white">{{ deal.endDate }}</p>
                  </div>
                </CardContent>
              </Card>

              <Card class="mt-4 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle class="text-gray-900 dark:text-white">Khách hàng</CardTitle>
                </CardHeader>
                <CardContent class="flex items-center justify-between gap-3">
                  <div>
                    <p class="text-theme-sm font-semibold text-gray-900 dark:text-white">{{ deal.customer }}</p>
                    <p class="text-theme-xs text-gray-500">Lĩnh vực: {{ deal.industry }} • Quy mô: {{ deal.companySize }}</p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" @click="handleOpenCustomer">
                    <ExternalLink class="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card class="mt-4 border-brand-200 bg-gradient-to-br from-brand-50 to-success-50 dark:border-brand-500/30 dark:from-brand-500/10 dark:to-success-500/10">
                <CardHeader>
                  <CardTitle class="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Sparkles class="h-5 w-5 text-brand-500" />
                    Salio AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div class="rounded-lg border border-white/60 bg-white/80 p-3 dark:border-white/10 dark:bg-gray-900/70">
                    <p class="text-theme-xs text-gray-500">Lý do từ AI</p>
                    <p class="mt-1 text-theme-sm text-gray-700 dark:text-gray-300">{{ aiReason }}</p>
                  </div>
                  <div class="rounded-lg border border-white/60 bg-white/80 p-3 dark:border-white/10 dark:bg-gray-900/70">
                    <p class="text-theme-xs text-gray-500">Gợi ý hành động</p>
                    <ul class="mt-1 list-disc space-y-1 pl-5 text-theme-sm text-gray-700 dark:text-gray-300">
                      <li v-for="item in aiActions" :key="item">{{ item }}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" class="mt-4">
              <Card class="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle class="text-gray-900 dark:text-white">Sản phẩm trong deal</CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div v-for="product in products" :key="product.name" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</p>
                    <p class="text-theme-xs text-gray-500">{{ product.quantity }} x {{ product.price }}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" class="mt-4">
              <Card class="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle class="text-gray-900 dark:text-white">Lịch sử cập nhật</CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                  <div v-for="entry in history" :key="entry.id" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                    <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ entry.title }}</p>
                    <p class="text-theme-xs text-gray-500">{{ entry.time }}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div class="space-y-4 xl:col-span-5">
          <div class="grid grid-cols-4 gap-2">
            <Button v-for="action in quickActions" :key="action.label" type="button" variant="outline" class="h-auto flex-col py-3" @click="handleQuickAction(action.label)">
              <component :is="action.icon" class="mb-1 h-4 w-4" />
              <span class="text-theme-xs">{{ action.label }}</span>
            </Button>
          </div>

          <Card class="border-gray-200 dark:border-gray-800">
            <CardHeader class="flex flex-row items-center justify-between">
              <CardTitle class="text-gray-900 dark:text-white">Dòng thời gian</CardTitle>
              <Button type="button" variant="ghost" size="sm" @click="handleFilterTimeline">
                <Filter class="mr-1 h-4 w-4" />
                Lọc
              </Button>
            </CardHeader>
            <CardContent class="space-y-3">
              <div v-for="item in timeline" :key="item.id" class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div class="mb-1 flex items-center justify-between gap-2">
                  <p class="text-theme-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</p>
                  <Badge :class="item.badgeClass">{{ item.badge }}</Badge>
                </div>
                <p class="text-theme-xs text-gray-500">{{ item.detail }}</p>
                <p class="mt-1 text-theme-xs text-gray-400">{{ item.time }}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { ExternalLink, Filter, Flag, Mail, MessageSquare, Phone, Save, Sparkles, SquareCheckBig, Trash2 } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { deleteDeal, getDealById, updateDeal } from '@/services/deals'
import type { Deal, DealStage } from '@/types/deals'

interface StageItem {
  id: string
  label: string
  current?: boolean
  locked?: boolean
}

interface TimelineItem {
  id: string
  title: string
  detail: string
  time: string
  badge: string
  badgeClass: string
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const dealData = ref<Deal | null>(null)

const stageLabel: Record<DealStage, string> = {
  new: 'Mới',
  preparing: 'Đang chuẩn bị',
  contacted: 'Đã liên hệ',
  negotiating: 'Đàm phán',
  quoted: 'Báo giá',
  won: 'Thắng',
  lost: 'Thua',
}

const deal = computed(() => {
  const source = dealData.value
  if (!source) {
    return {
      code: `#${String(route.params.dealId ?? 'DEAL').toUpperCase()}`,
      title: 'Đang tải...',
      updatedAt: '--',
      updatedBy: '--',
      value: '₫ 0',
      probability: 0,
      owner: 'demo-user',
      endDate: '--',
      customer: '--',
      industry: '--',
      companySize: '--',
    }
  }

  return {
    code: `#${source.id.toUpperCase()}`,
    title: source.title,
    updatedAt: new Date(source.updatedAt).toLocaleString('vi-VN'),
    updatedBy: source.assigneeId,
    value: `₫ ${Number(source.value).toLocaleString('vi-VN')} ${source.currency}`,
    probability: source.probability,
    owner: source.assigneeId,
    endDate: source.expectedCloseDate ? new Date(source.expectedCloseDate).toLocaleDateString('vi-VN') : 'Chưa có',
    customer: source.companyName ?? source.contactName ?? 'Chưa xác định',
    industry: 'N/A',
    companySize: 'N/A',
  }
})

const stages = computed<StageItem[]>(() => {
  const currentStage = dealData.value?.stage ?? 'new'
  const order: DealStage[] = ['new', 'preparing', 'contacted', 'negotiating', 'quoted', 'won', 'lost']
  return order.map((stage) => ({
    id: stage,
    label: stageLabel[stage],
    current: stage === currentStage,
    locked: order.indexOf(stage) > order.indexOf(currentStage),
  }))
})

const aiReason = ref('Khách hàng đã xem báo giá 3 lần và có tương tác tích cực với bộ phận kỹ thuật. Độ tin cậy về ngân sách cao.')

const aiActions = ref<string[]>([
  'Gửi email nhắc lại về ưu đãi dành cho doanh nghiệp mới.',
  'Đặt lịch gọi điện chốt điều khoản vào sáng Thứ 5.',
])

const products = ref([
  { name: 'Gói CRM Enterprise', quantity: 1, price: '180.000.000 VND' },
  { name: 'Module Automation', quantity: 1, price: '70.000.000 VND' },
])

const history = ref([
  { id: 'h-1', title: 'Đã gửi Email báo giá', time: '10:30 AM' },
  { id: 'h-2', title: 'Chuyển giai đoạn sang Đàm phán', time: 'Hôm qua, 04:15 PM' },
])

const timeline = ref<TimelineItem[]>([
  {
    id: 't-1',
    title: 'Salio AI đề xuất',
    detail: 'Đã chuẩn bị sẵn bản nháp email follow-up cá nhân hóa cho giám đốc Cty ABC.',
    time: 'Vừa xong',
    badge: 'AI',
    badgeClass: 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-300',
  },
  {
    id: 't-2',
    title: 'Đã gửi Email báo giá',
    detail: 'Gửi tới: anh.nguyen@abc.com • Trạng thái: Đã mở (2 lần)',
    time: '10:30 AM',
    badge: 'Email',
    badgeClass: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
  },
  {
    id: 't-3',
    title: 'Nguyễn Văn A đã chuyển sang Đàm phán',
    detail: 'Giai đoạn đã được cập nhật thủ công từ Kanban.',
    time: 'Hôm qua, 04:15 PM',
    badge: 'Stage',
    badgeClass: 'bg-warning-50 text-warning-500 dark:bg-warning-500/15 dark:text-warning-300',
  },
])

const quickActions = ref([
  { label: 'Bình luận', icon: MessageSquare },
  { label: 'Tác vụ', icon: SquareCheckBig },
  { label: 'Email', icon: Mail },
  { label: 'Gọi điện', icon: Phone },
])

const currentStageLabel = computed(() => stages.value.find((stage) => stage.current)?.label ?? 'Chưa xác định')

async function fetchDeal(): Promise<void> {
  loading.value = true
  const dealId = String(route.params.dealId)
  const result = await getDealById(dealId)
  loading.value = false

  if (!result.isSuccess) {
    toast.error(result.error || 'Không thể tải chi tiết deal')
    return
  }

  dealData.value = result.data
}

function handleAskAi(): void {
  toast.success('Đang mở Chat hỏi đáp theo deal')
}

function handleSave(): void {
  if (!dealData.value) {
    return
  }

  void updateDeal(dealData.value.id, {
    title: dealData.value.title,
    probability: dealData.value.probability,
  }).then((result) => {
    if (!result.isSuccess) {
      toast.error(result.error)
      return
    }
    toast.success('Đã lưu thông tin deal')
    void fetchDeal()
  })
}

function handleOpenCustomer(): void {
  toast.info('Đang mở hồ sơ khách hàng')
}

function handleQuickAction(action: string): void {
  toast.info(`Đang mở: ${action}`)
}

function handleFilterTimeline(): void {
  toast.info('Đang mở bộ lọc timeline')
}

function handleDelete(): void {
  if (!dealData.value) {
    return
  }

  void deleteDeal(dealData.value.id).then((result) => {
    if (!result.isSuccess) {
      toast.error(result.error)
      return
    }

    toast.success('Đã xóa deal')
    void router.push('/crm-deals')
  })
}

onMounted(() => {
  void fetchDeal()
})
</script>

<style scoped>
.stage-chevron {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%);
}

.stage-chevron:first-child {
  clip-path: polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%);
}

.stage-chevron:last-child {
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 10% 50%);
}
</style>