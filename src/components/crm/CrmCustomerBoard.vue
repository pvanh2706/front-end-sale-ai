<template>
  <div class="flex h-full flex-col overflow-hidden">

    <!-- ─── Toolbar ─────────────────────────────────────────────── -->
    <div class="shrink-0 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="relative flex-1 max-w-xs">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm khách hàng..."
            class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div class="ml-auto flex items-center gap-2">
          <!-- Stats chips -->
          <span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            {{ totalCustomers }} khách hàng
          </span>
          <button
            class="flex items-center gap-1.5 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
            @click="openAddDialog()"
          >
            <Plus class="h-4 w-4" />
            Thêm khách hàng
          </button>
        </div>
      </div>
    </div>

    <!-- ─── 3 Columns ───────────────────────────────────────────── -->
    <div class="custom-scrollbar flex min-h-0 flex-1 gap-4 overflow-x-auto p-4">

      <!-- Công ty -->
      <div class="flex w-[340px] shrink-0 flex-col gap-3">
        <div class="flex items-center gap-2.5 rounded-xl border border-violet-200 bg-violet-50/60 px-3 py-2.5 dark:border-violet-700/50 dark:bg-violet-900/20">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600">
            <Building2 class="h-4 w-4 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Công ty</p>
            <p class="text-xs text-violet-600 dark:text-violet-400">{{ filteredCompanies.length }} khách hàng</p>
          </div>
        </div>

        <div class="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto">
          <CustomerCard
            v-for="c in filteredCompanies"
            :key="c.id"
            :customer="c"
            @edit="openEditDialog(c)"
            @delete="deleteCustomer(c.id)"
          />
          <div v-if="filteredCompanies.length === 0" class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 dark:border-gray-700">
            <Building2 class="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p class="text-xs text-gray-400 dark:text-gray-500">Chưa có công ty nào</p>
          </div>
        </div>

        <button
          class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:border-violet-300 hover:text-violet-600 dark:border-gray-700 dark:hover:border-violet-600 dark:hover:text-violet-400"
          @click="openAddDialog('company')"
        >
          <Plus class="h-4 w-4" />
          Thêm công ty
        </button>
      </div>

      <!-- Hộ kinh doanh -->
      <div class="flex w-[340px] shrink-0 flex-col gap-3">
        <div class="flex items-center gap-2.5 rounded-xl border border-warning-200 bg-warning-50/60 px-3 py-2.5 dark:border-warning-700/50 dark:bg-warning-900/20">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning-500">
            <Store class="h-4 w-4 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Hộ kinh doanh</p>
            <p class="text-xs text-warning-500 dark:text-warning-400">{{ filteredHouseholds.length }} khách hàng</p>
          </div>
        </div>

        <div class="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto">
          <CustomerCard
            v-for="c in filteredHouseholds"
            :key="c.id"
            :customer="c"
            @edit="openEditDialog(c)"
            @delete="deleteCustomer(c.id)"
          />
          <div v-if="filteredHouseholds.length === 0" class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 dark:border-gray-700">
            <Store class="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p class="text-xs text-gray-400 dark:text-gray-500">Chưa có hộ kinh doanh nào</p>
          </div>
        </div>

        <button
          class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:border-warning-300 hover:text-warning-500 dark:border-gray-700 dark:hover:border-warning-600 dark:hover:text-warning-400"
          @click="openAddDialog('household')"
        >
          <Plus class="h-4 w-4" />
          Thêm hộ kinh doanh
        </button>
      </div>

      <!-- Cá nhân -->
      <div class="flex w-[340px] shrink-0 flex-col gap-3">
        <div class="flex items-center gap-2.5 rounded-xl border border-success-200 bg-success-50/60 px-3 py-2.5 dark:border-success-700/50 dark:bg-success-900/20">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success-500">
            <User class="h-4 w-4 text-white" />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">Cá nhân</p>
            <p class="text-xs text-success-500 dark:text-success-400">{{ filteredIndividuals.length }} khách hàng</p>
          </div>
        </div>

        <div class="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto">
          <CustomerCard
            v-for="c in filteredIndividuals"
            :key="c.id"
            :customer="c"
            @edit="openEditDialog(c)"
            @delete="deleteCustomer(c.id)"
          />
          <div v-if="filteredIndividuals.length === 0" class="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-8 dark:border-gray-700">
            <User class="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p class="text-xs text-gray-400 dark:text-gray-500">Chưa có khách hàng cá nhân nào</p>
          </div>
        </div>

        <button
          class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition hover:border-success-300 hover:text-success-500 dark:border-gray-700 dark:hover:border-success-600 dark:hover:text-success-400"
          @click="openAddDialog('individual')"
        >
          <Plus class="h-4 w-4" />
          Thêm cá nhân
        </button>
      </div>

    </div>

    <!-- ─── Add / Edit Dialog ────────────────────────────────────── -->
    <Dialog :open="showDialog" @update:open="showDialog = $event">
      <DialogContent class="sm:max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle class="text-base font-semibold text-gray-900 dark:text-white">
            {{ editingId ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới' }}
          </DialogTitle>
          <DialogDescription class="text-sm text-gray-500">Điền thông tin khách hàng</DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <!-- Customer type toggle -->
          <div class="space-y-1.5">
            <Label>Loại khách hàng</Label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all"
                :class="form.type === 'company'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'"
                @click="form.type = 'company'"
              >
                <Building2 class="h-4 w-4" />
                Công ty
              </button>
              <button
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all"
                :class="form.type === 'household'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'"
                @click="form.type = 'household'; form.contactTitle = ''"
              >
                <Store class="h-4 w-4" />
                Hộ kinh doanh
              </button>
              <button
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-3 text-xs font-medium transition-all"
                :class="form.type === 'individual'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'"
                @click="form.type = 'individual'; form.name = form.contactName; form.contactName = ''; form.contactTitle = ''"
              >
                <User class="h-4 w-4" />
                Cá nhân
              </button>
            </div>
          </div>

          <!-- Company fields -->
          <template v-if="form.type === 'company'">
            <div class="space-y-1.5">
              <Label for="cf-name">Tên công ty <span class="text-error-500">*</span></Label>
              <Input id="cf-name" v-model="form.name" placeholder="VD: Tập đoàn Vinhomes" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <Label for="cf-contact">Người liên hệ</Label>
                <Input id="cf-contact" v-model="form.contactName" placeholder="Họ và tên" />
              </div>
              <div class="space-y-1.5">
                <Label for="cf-title">Chức vụ</Label>
                <Input id="cf-title" v-model="form.contactTitle" placeholder="VD: Giám đốc" />
              </div>
            </div>
          </template>

          <!-- Household fields -->
          <template v-else-if="form.type === 'household'">
            <div class="space-y-1.5">
              <Label for="cf-name">Tên hộ kinh doanh <span class="text-error-500">*</span></Label>
              <Input id="cf-name" v-model="form.name" placeholder="VD: Cửa hàng Minh Phát" />
            </div>
            <div class="space-y-1.5">
              <Label for="cf-contact">Chủ hộ / Người liên hệ</Label>
              <Input id="cf-contact" v-model="form.contactName" placeholder="Họ và tên" />
            </div>
          </template>

          <!-- Individual fields -->
          <template v-else>
            <div class="space-y-1.5">
              <Label for="cf-name">Tên khách hàng <span class="text-error-500">*</span></Label>
              <Input id="cf-name" v-model="form.name" placeholder="Họ và tên khách hàng" />
            </div>
          </template>

          <!-- Common: phone + email -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <Label for="cf-phone">Số điện thoại</Label>
              <Input id="cf-phone" v-model="form.phone" type="tel" placeholder="0901 234 567" />
            </div>
            <div class="space-y-1.5">
              <Label for="cf-email">Email</Label>
              <Input id="cf-email" v-model="form.email" type="email" placeholder="email@example.com" />
            </div>
          </div>

          <!-- Source -->
          <div class="space-y-1.5">
            <Label>Nguồn</Label>
            <Select v-model="form.source">
              <SelectTrigger><SelectValue placeholder="Chọn nguồn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="inbound">Inbound</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="outbound">Outbound</SelectItem>
                <SelectItem value="zalo">Zalo</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter class="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button variant="outline" @click="showDialog = false">Hủy</Button>
          <Button class="bg-brand-500 text-white hover:bg-brand-600" @click="submitForm">
            {{ editingId ? 'Lưu thay đổi' : 'Thêm khách hàng' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Building2, Mail, Pencil, Phone, Plus, Search, Store, Trash2, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ─── Types ────────────────────────────────────────────────────

type CustomerType = 'company' | 'household' | 'individual'

interface CustomerItem {
  id: string
  type: CustomerType
  name: string
  contactName?: string
  contactTitle?: string
  phone?: string
  email?: string
  source?: string
  dealCount: number
  color: string
}

interface CustomerForm {
  type: CustomerType
  name: string
  contactName: string
  contactTitle: string
  phone: string
  email: string
  source: string
}

// ─── Color helpers ─────────────────────────────────────────────

const PALETTE = [
  '#465fff', '#12b76a', '#f79009', '#f04438',
  '#8B5CF6', '#0EA5E9', '#EC4899', '#14B8A6',
]
function pickColor(str: string): string {
  let h = 0
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0
  return PALETTE[Math.abs(h) % PALETTE.length]
}
function initials(name: string): string {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

// ─── Data ──────────────────────────────────────────────────────

const customers = ref<CustomerItem[]>([
  {
    id: 'cust-1', type: 'company',
    name: 'Tập đoàn Vinhomes', contactName: 'Nguyễn Văn Anh', contactTitle: 'Giám đốc mua hàng',
    phone: '0901 234 567', email: 'nva@vinhomes.vn', source: 'Referral', dealCount: 3,
    color: pickColor('Vinhomes'),
  },
  {
    id: 'cust-2', type: 'company',
    name: 'Công ty TNHH FPT Software', contactName: 'Trần Thị Bích', contactTitle: 'Trưởng phòng IT',
    phone: '0912 345 678', email: 'ttb@fpt.com.vn', source: 'Website', dealCount: 1,
    color: pickColor('FPT'),
  },
  {
    id: 'cust-3', type: 'company',
    name: 'Tập đoàn Masan', contactName: 'Lê Hoàng Nam', contactTitle: 'Giám đốc tài chính',
    phone: '0923 456 789', email: 'lhn@masan.com.vn', source: 'Outbound', dealCount: 2,
    color: pickColor('Masan'),
  },
  {
    id: 'cust-4', type: 'household',
    name: 'Cửa hàng Minh Phát', contactName: 'Lê Minh Phát',
    phone: '0934 567 890', email: 'minhphat@gmail.com', source: 'Inbound', dealCount: 2,
    color: pickColor('Minh Phat'),
  },
  {
    id: 'cust-5', type: 'household',
    name: 'Tạp hoá Thanh Hương', contactName: 'Nguyễn Thanh Hương',
    phone: '0945 678 901', email: 'thanh.huong@gmail.com', source: 'Zalo', dealCount: 1,
    color: pickColor('Thanh Huong'),
  },
  {
    id: 'cust-6', type: 'individual',
    name: 'Phạm Thị Cúc',
    phone: '0956 789 012', email: 'ptcuc@gmail.com', source: 'Facebook', dealCount: 1,
    color: pickColor('Pham Thi Cuc'),
  },
  {
    id: 'cust-7', type: 'individual',
    name: 'Đỗ Quang Minh',
    phone: '0967 890 123', email: 'dqminh@gmail.com', source: 'Zalo', dealCount: 0,
    color: pickColor('Do Quang Minh'),
  },
])

// ─── Search ────────────────────────────────────────────────────

const searchQuery = ref('')

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return customers.value
  return customers.value.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.contactName?.toLowerCase().includes(q) ||
    c.phone?.includes(q) ||
    c.email?.toLowerCase().includes(q),
  )
})

const filteredCompanies  = computed(() => filtered.value.filter(c => c.type === 'company'))
const filteredHouseholds = computed(() => filtered.value.filter(c => c.type === 'household'))
const filteredIndividuals = computed(() => filtered.value.filter(c => c.type === 'individual'))
const totalCustomers = computed(() => customers.value.length)

// ─── Dialog ────────────────────────────────────────────────────

const showDialog = ref(false)
const editingId = ref<string | null>(null)

const defaultForm = (): CustomerForm => ({
  type: 'company', name: '', contactName: '', contactTitle: '', phone: '', email: '', source: 'website',
})
const form = ref<CustomerForm>(defaultForm())

function openAddDialog(type?: CustomerType): void {
  editingId.value = null
  form.value = { ...defaultForm(), type: type ?? 'company' }
  showDialog.value = true
}

function openEditDialog(c: CustomerItem): void {
  editingId.value = c.id
  form.value = {
    type: c.type,
    name: c.name,
    contactName: c.contactName ?? '',
    contactTitle: c.contactTitle ?? '',
    phone: c.phone ?? '',
    email: c.email ?? '',
    source: c.source ?? 'website',
  }
  showDialog.value = true
}

function submitForm(): void {
  const name = form.value.name.trim()
  if (!name) { toast.error('Tên là bắt buộc'); return }

  if (editingId.value) {
    const idx = customers.value.findIndex(c => c.id === editingId.value)
    if (idx >= 0) {
      customers.value[idx] = {
        ...customers.value[idx],
        type: form.value.type,
        name,
        contactName: form.value.contactName.trim() || undefined,
        contactTitle: form.value.type === 'company' ? form.value.contactTitle.trim() || undefined : undefined,
        phone: form.value.phone.trim() || undefined,
        email: form.value.email.trim() || undefined,
        source: form.value.source,
      }
    }
    toast.success('Đã cập nhật khách hàng')
  } else {
    customers.value.unshift({
      id: `cust-${Date.now()}`,
      type: form.value.type,
      name,
      contactName: form.value.contactName.trim() || undefined,
      contactTitle: form.value.type === 'company' ? form.value.contactTitle.trim() || undefined : undefined,
      phone: form.value.phone.trim() || undefined,
      email: form.value.email.trim() || undefined,
      source: form.value.source,
      dealCount: 0,
      color: pickColor(name),
    })
    toast.success('Đã thêm khách hàng')
  }
  showDialog.value = false
}

function deleteCustomer(id: string): void {
  customers.value = customers.value.filter(c => c.id !== id)
  toast.success('Đã xóa khách hàng')
}
</script>

<!-- ─── CustomerCard sub-component ─────────────────────────────── -->
<script lang="ts">
import { defineComponent, h } from 'vue'
import { Building2 as B2, Mail as MailIcon, Pencil as PencilIcon, Phone as PhoneIcon, Store as StoreIcon, Trash2 as Trash2Icon, User as UserIcon } from 'lucide-vue-next'

export const CustomerCard = defineComponent({
  name: 'CustomerCard',
  props: {
    customer: { type: Object as () => import('./CrmCustomerBoard.vue').CustomerItem, required: true },
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    function initials(name: string) {
      return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    }
    const SOURCE_LABEL: Record<string, string> = {
      website: 'Web', inbound: 'In', referral: 'Ref', outbound: 'Out', zalo: 'Zalo', facebook: 'FB', event: 'Event',
    }
    return () => {
      const c = props.customer
      const typeIcon = c.type === 'company' ? h(B2, { class: 'h-3 w-3' })
        : c.type === 'household' ? h(StoreIcon, { class: 'h-3 w-3' })
        : h(UserIcon, { class: 'h-3 w-3' })

      return h('div', {
        class: 'group relative rounded-xl border border-gray-200 bg-white p-3 shadow-theme-xs transition hover:shadow-theme-sm dark:border-gray-700 dark:bg-gray-800',
      }, [
        // Actions (hover)
        h('div', { class: 'absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100' }, [
          h('button', {
            class: 'rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-gray-700',
            onClick: () => emit('edit'),
          }, h(PencilIcon, { class: 'h-3.5 w-3.5' })),
          h('button', {
            class: 'rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-900/20',
            onClick: () => emit('delete'),
          }, h(Trash2Icon, { class: 'h-3.5 w-3.5' })),
        ]),

        // Header: avatar + name
        h('div', { class: 'flex items-start gap-2.5 pr-12' }, [
          h('div', {
            class: 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
            style: { background: c.color },
          }, initials(c.name)),
          h('div', { class: 'min-w-0' }, [
            h('p', { class: 'truncate text-sm font-semibold text-gray-900 dark:text-white' }, c.name),
            c.contactName
              ? h('p', { class: 'truncate text-xs text-gray-500 dark:text-gray-400' },
                  c.contactTitle ? `${c.contactName} · ${c.contactTitle}` : c.contactName)
              : null,
          ]),
        ]),

        // Contact info
        h('div', { class: 'mt-2.5 space-y-1' }, [
          c.phone
            ? h('div', { class: 'flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400' }, [
                h(PhoneIcon, { class: 'h-3 w-3 shrink-0 text-gray-400' }), c.phone,
              ])
            : null,
          c.email
            ? h('div', { class: 'flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400' }, [
                h(MailIcon, { class: 'h-3 w-3 shrink-0 text-gray-400' }), h('span', { class: 'truncate' }, c.email),
              ])
            : null,
        ]),

        // Footer: type badge + source + deal count
        h('div', { class: 'mt-2.5 flex items-center gap-1.5 flex-wrap' }, [
          h('span', {
            class: 'inline-flex items-center gap-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 dark:bg-gray-700 dark:text-gray-400',
          }, [typeIcon, c.type === 'company' ? 'Công ty' : c.type === 'household' ? 'HKD' : 'Cá nhân']),
          c.source
            ? h('span', { class: 'rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-500 dark:bg-brand-900/30' },
                SOURCE_LABEL[c.source] ?? c.source)
            : null,
          c.dealCount > 0
            ? h('span', { class: 'ml-auto text-[10px] font-semibold text-gray-400' }, `${c.dealCount} deal`)
            : null,
        ]),
      ])
    }
  },
})
</script>
