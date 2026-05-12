
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-8 space-y-6">
    <!-- Back Navigation -->
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <button
        class="flex items-center gap-1.5 hover:text-gray-900 dark:hover:text-white transition-colors"
        @click="router.back()"
      >
        <ChevronLeft class="w-4 h-4" />
        Thư viện tài liệu
      </button>
      <span class="text-gray-300 dark:text-gray-600">/</span>
      <span class="text-gray-900 dark:text-white font-medium">{{ nodeName }}</span>
    </div>

    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-start gap-4">
        <div class="w-12 h-16 bg-red-50 dark:bg-red-900/20 flex items-center justify-center rounded-lg border border-red-100 dark:border-red-800 flex-shrink-0">
          <FileText class="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <div class="space-y-2">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ nodeName }}
          </h1>
          <div class="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{{ permissionsData?.docType }}</Badge>
            <Badge class="bg-error-50 text-error-500 border-error-100 dark:bg-error-500/10 dark:border-error-500/20 gap-1">
              <Lock class="w-3 h-3" /> Bảo mật cao
            </Badge>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" class="gap-2" @click="copyLink">
          <Copy class="w-4 h-4" /> Sao chép link
        </Button>
        <Button variant="outline" size="sm" class="gap-2">
          <Download class="w-4 h-4" /> Tải xuống
        </Button>
        <Button size="sm" class="gap-2 bg-brand-500 hover:bg-brand-600 text-white">
          <Eye class="w-4 h-4" /> Xem trước
        </Button>
      </div>
    </header>

    <!-- Conflict Banner -->
    <div v-if="hasConflict" class="p-4 rounded-xl border border-warning-500/30 bg-warning-50 dark:bg-warning-500/10 dark:border-warning-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-warning-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle class="w-5 h-5 text-warning-500" />
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">Phát hiện xung đột quyền hạn</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Một số người dùng nhận quyền từ nhiều nguồn. Vui lòng chọn chiến lược xử lý.</p>
        </div>
      </div>
      <div class="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-full shadow-theme-xs">
        <button
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
          :class="conflictStrategy === 'highest' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'"
          @click="conflictStrategy = 'highest'"
        >
          Quyền cao nhất
        </button>
        <button
          class="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
          :class="conflictStrategy === 'lowest' ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'"
          @click="conflictStrategy = 'lowest'"
        >
          Thấp nhất
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Left Column -->
      <div class="lg:col-span-8 space-y-5">
        <!-- Tabs Card -->
        <div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <!-- Tab Nav -->
          <div class="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors"
              :class="activeTab === tab.id
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'"
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab: System Roles -->
          <div v-if="activeTab === 'roles'" class="p-5 space-y-5">
            <h2 class="text-sm font-medium text-gray-900 dark:text-white">Cấu hình quyền theo nhóm vai trò</h2>
            <div class="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div
                v-for="role in localRoles"
                :key="role.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-colors"
                :class="role.isLocked ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/30'"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="role.isLocked ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                  >
                    <component :is="getRoleIcon(role.icon)" class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ role.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ role.description }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div v-for="perm in permTypes" :key="perm.key" class="flex flex-col items-center gap-1">
                    <span class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">{{ perm.label }}</span>
                    <button
                      class="w-10 h-6 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      :class="[
                        role[perm.key as keyof typeof role] ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-600',
                        role.isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                      ]"
                      :disabled="role.isLocked"
                      @click="!role.isLocked && toggleRolePerm(role.id, perm.key)"
                    >
                      <div
                        class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform"
                        :class="role[perm.key as keyof typeof role] ? 'translate-x-5' : 'translate-x-1'"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Advanced Options -->
            <div class="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white">Tùy chọn nâng cao AI &amp; Bảo mật</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-500 transition-all">
                  <div class="flex gap-3">
                    <Droplets class="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Watermark động</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Gắn email người xem lên file</p>
                    </div>
                  </div>
                  <Switch v-model:checked="advancedOptions.watermark" />
                </label>
                <label class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:border-brand-500 transition-all">
                  <div class="flex gap-3">
                    <Timer class="w-5 h-5 text-brand-500 flex-shrink-0" />
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">OTP Xác thực</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Yêu cầu OTP khi mở từ email</p>
                    </div>
                  </div>
                  <Switch v-model:checked="advancedOptions.otp" />
                </label>
              </div>
            </div>
          </div>

          <!-- Tab: Departments -->
          <div v-if="activeTab === 'departments'" class="p-5 space-y-5">
            <h2 class="text-sm font-medium text-gray-900 dark:text-white">Cấu hình quyền theo Chức danh &amp; Phòng ban</h2>
            <div class="divide-y divide-gray-100 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div
                v-for="dept in localDepartments"
                :key="dept.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center flex-shrink-0">
                    <Briefcase class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ dept.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ dept.title }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <div v-for="perm in permTypes" :key="perm.key" class="flex flex-col items-center gap-1">
                    <span class="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">{{ perm.label }}</span>
                    <button
                      class="w-10 h-6 rounded-full relative transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                      :class="dept[perm.key as keyof typeof dept] ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-600'"
                      @click="toggleDeptPerm(dept.id, perm.key)"
                    >
                      <div
                        class="w-4 h-4 bg-white rounded-full absolute top-1 transition-transform"
                        :class="dept[perm.key as keyof typeof dept] ? 'translate-x-5' : 'translate-x-1'"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Email Share -->
          <div v-if="activeTab === 'email'" class="p-5 space-y-5">
            <h2 class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus class="w-4 h-4" /> Chia sẻ qua Email
            </h2>
            <!-- Chip Input -->
            <div
              class="min-h-12 p-2 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500 transition-all bg-white dark:bg-gray-800 cursor-text"
              @click="emailInput?.focus()"
            >
              <span
                v-for="email in emailShares"
                :key="email"
                class="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {{ email }}
                <button
                  class="hover:text-error-500 transition-colors ml-0.5"
                  @click.stop="removeEmail(email)"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
              <input
                ref="emailInput"
                v-model="emailInputValue"
                class="border-none outline-none p-1 flex-grow text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Thêm email..."
                @keydown.enter.prevent="addEmail"
                @keydown.comma.prevent="addEmail"
                @keydown.backspace="handleBackspace"
              />
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500">Nhấn Enter hoặc dấu phẩy để thêm email</p>
          </div>
        </div>

        <!-- Quick Email Share (below tabs, always visible) -->
        <div v-if="activeTab !== 'email'" class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-3">
          <h2 class="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <UserPlus class="w-4 h-4" /> Chia sẻ nhanh qua Email
          </h2>
          <div class="flex flex-wrap gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg min-h-10 items-center">
            <span
              v-for="email in emailShares"
              :key="email"
              class="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {{ email }}
              <button class="hover:text-error-500 transition-colors" @click="removeEmail(email)"><X class="w-3 h-3" /></button>
            </span>
            <input
              v-model="quickEmailValue"
              class="border-none outline-none flex-grow text-sm bg-transparent text-gray-900 dark:text-white placeholder-gray-400 p-1 min-w-40"
              placeholder="Thêm email hoặc chọn từ gợi ý..."
              @keydown.enter.prevent="addQuickEmail"
              @keydown.comma.prevent="addQuickEmail"
            />
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-4 space-y-5">
        <!-- Holders Panel -->
        <section class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-medium text-gray-900 dark:text-white">
              Người có quyền hiện tại
              <span class="ml-1 text-gray-400 dark:text-gray-500">({{ holders.length }})</span>
            </h2>
            <button title="Thông tin" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Info class="w-4 h-4" />
            </button>
          </div>
          <div class="space-y-1">
            <div
              v-for="holder in holders.slice(0, showAllHolders ? holders.length : 3)"
              :key="holder.id"
              class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors"
            >
              <div class="flex items-center gap-2">
                <div class="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {{ holder.initials }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white leading-tight">{{ holder.name }}</p>
                  <p class="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 leading-tight mt-0.5">
                    <component :is="getSourceIcon(holder.source)" class="w-3 h-3" />
                    {{ holder.sourceLabel }}
                  </p>
                </div>
              </div>
              <Badge :class="getLevelClass(holder.level)" class="text-[10px] font-bold uppercase px-2 py-0.5">
                {{ getLevelLabel(holder.level) }}
              </Badge>
            </div>
          </div>
          <button
            class="w-full py-2 text-sm font-medium text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors"
            @click="showAllHolders = !showAllHolders"
          >
            {{ showAllHolders ? 'Thu gọn' : `Xem tất cả danh sách` }}
          </button>
        </section>

        <!-- History Panel -->
        <section class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-4">
          <h2 class="text-sm font-medium text-gray-900 dark:text-white">Lịch sử cấp quyền</h2>
          <div class="space-y-4 relative before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200 dark:before:bg-gray-700">
            <div
              v-for="entry in historyEntries"
              :key="entry.id"
              class="relative pl-6"
            >
              <div class="absolute left-0 top-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                <div class="w-2 h-2 rounded-full" :class="entry.isPrimary ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-500'" />
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                <span class="font-semibold">{{ entry.actor }}</span>
                {{ entry.action }}
                <span v-if="entry.target" class="text-brand-500 font-medium"> {{ entry.target }}</span>
              </p>
              <p class="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{{ entry.time }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Sticky Footer -->
    <div class="sticky bottom-0 left-0 right-0 -mx-8 -mb-8 px-8 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.2)] z-10">
      <div class="flex items-center justify-between gap-4">
        <div class="hidden sm:flex items-center gap-4">
          <div v-if="isDirty" class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-500" />
            <p class="text-sm text-gray-700 dark:text-gray-300">Đã thay đổi: <span class="font-semibold">chưa lưu</span></p>
          </div>
          <button class="text-brand-500 text-sm font-medium flex items-center gap-1 hover:underline">
            <BarChart2 class="w-4 h-4" /> Xem trước hiệu lực
          </button>
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <Button variant="ghost" class="text-gray-500" :disabled="isSaving" @click="resetChanges">
            Hủy bỏ
          </Button>
          <Button
            class="bg-brand-500 hover:bg-brand-600 text-white px-6 shadow-lg shadow-brand-500/20"
            :disabled="isSaving || !isDirty"
            @click="savePermissions"
          >
            <Loader2 v-if="isSaving" class="w-4 h-4 mr-2 animate-spin" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import {
  AlertTriangle, BarChart2, Briefcase, ChevronLeft, Copy, Download, Droplets,
  Eye, FileText, Info, Loader2, Lock, Mail, Shield, ShoppingCart,
  Timer, User, UserPlus, X, Megaphone, BookOpen,
} from 'lucide-vue-next'
import { get, put } from '@/services/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RolePermission {
  id: string
  name: string
  description: string
  icon: string
  canView: boolean
  canDownload: boolean
  canEdit: boolean
  isLocked: boolean
}

interface DeptPermission {
  id: string
  name: string
  title: string
  canView: boolean
  canDownload: boolean
  canEdit: boolean
  isLocked: boolean
}

interface PermissionHolder {
  id: string
  name: string
  initials: string
  source: 'role' | 'email' | 'title'
  sourceLabel: string
  level: 'full' | 'view' | 'download' | 'edit'
}

interface HistoryEntry {
  id: string
  actor: string
  action: string
  target: string
  time: string
  isPrimary: boolean
}

interface DocPermissionsData {
  docId: string
  docName: string
  docType: string
  securityLevel: string
  conflictStrategy: 'highest' | 'lowest'
  roles: RolePermission[]
  departments: DeptPermission[]
  advancedOptions: { watermark: boolean; otp: boolean }
  emailShares: string[]
  holders: PermissionHolder[]
  history: HistoryEntry[]
}

interface DocPermissionsResponse {
  success: boolean
  data: DocPermissionsData
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const route = useRoute()
const router = useRouter()
const nodeId = computed(() => String(route.params.nodeId ?? 'doc-acme-2026'))
const nodeName = computed(() => String(route.query.name ?? 'Tài liệu'))

const tabs = [
  { id: 'roles', label: 'Vai trò hệ thống', icon: Shield },
  { id: 'departments', label: 'Chức danh & Phòng ban', icon: Briefcase },
  { id: 'email', label: 'Chia sẻ Email', icon: Mail },
]

const permTypes = [
  { key: 'canView', label: 'Xem' },
  { key: 'canDownload', label: 'Tải' },
  { key: 'canEdit', label: 'Sửa' },
]

// ─── State ─────────────────────────────────────────────────────────────────────

const queryClient = useQueryClient()
const activeTab = ref<'roles' | 'departments' | 'email'>('roles')
const showAllHolders = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)
const emailInputValue = ref('')
const quickEmailValue = ref('')

// Local editable state
const conflictStrategy = ref<'highest' | 'lowest'>('highest')
const localRoles = ref<RolePermission[]>([])
const localDepartments = ref<DeptPermission[]>([])
const advancedOptions = ref({ watermark: true, otp: false })
const emailShares = ref<string[]>([])
const hasConflict = ref(true)

// ─── Server state ──────────────────────────────────────────────────────────────

const { data: queryResult, isLoading } = useQuery({
  queryKey: computed(() => ['doc-permissions', nodeId.value]),
  queryFn: () => get<DocPermissionsResponse>(`/v1/doc-permissions/${nodeId.value}`),
})

const permissionsData = computed<DocPermissionsData | undefined>(() => {
  const res = queryResult.value
  if (res?.isSuccess && res.data) {
    const inner = res.data as unknown as DocPermissionsResponse
    return inner?.data ?? (res.data as unknown as DocPermissionsData)
  }
  return undefined
})

const holders = computed<PermissionHolder[]>(() => permissionsData.value?.holders ?? [])
const historyEntries = computed<HistoryEntry[]>(() => permissionsData.value?.history ?? [])

// Sync server → local state on load
watch(permissionsData, (data) => {
  if (!data) return
  conflictStrategy.value = data.conflictStrategy
  localRoles.value = data.roles.map((r) => ({ ...r }))
  localDepartments.value = data.departments.map((d) => ({ ...d }))
  advancedOptions.value = { ...data.advancedOptions }
  emailShares.value = [...data.emailShares]
}, { immediate: true })

// ─── Dirty check ───────────────────────────────────────────────────────────────

const isDirty = computed(() => {
  if (!permissionsData.value) return false
  const orig = permissionsData.value
  if (conflictStrategy.value !== orig.conflictStrategy) return true
  if (JSON.stringify(advancedOptions.value) !== JSON.stringify(orig.advancedOptions)) return true
  if (JSON.stringify(emailShares.value) !== JSON.stringify(orig.emailShares)) return true
  if (JSON.stringify(localRoles.value) !== JSON.stringify(orig.roles)) return true
  if (JSON.stringify(localDepartments.value) !== JSON.stringify(orig.departments)) return true
  return false
})

// ─── Mutation ─────────────────────────────────────────────────────────────────

const { mutate: saveToServer, isPending: isSaving } = useMutation({
  mutationFn: (payload: Partial<DocPermissionsData>) =>
    put<DocPermissionsResponse>(`/v1/doc-permissions/${DOC_ID}`, payload),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['doc-permissions', DOC_ID] })
    toast.success('Đã lưu cài đặt phân quyền')
  },
  onError: () => {
    toast.error('Không thể lưu, vui lòng thử lại')
  },
})

// ─── Actions ───────────────────────────────────────────────────────────────────

function savePermissions() {
  saveToServer({
    conflictStrategy: conflictStrategy.value,
    roles: localRoles.value,
    departments: localDepartments.value,
    advancedOptions: advancedOptions.value,
    emailShares: emailShares.value,
  })
}

function resetChanges() {
  if (!permissionsData.value) return
  const data = permissionsData.value
  conflictStrategy.value = data.conflictStrategy
  localRoles.value = data.roles.map((r) => ({ ...r }))
  localDepartments.value = data.departments.map((d) => ({ ...d }))
  advancedOptions.value = { ...data.advancedOptions }
  emailShares.value = [...data.emailShares]
  toast('Đã hủy thay đổi')
}

function toggleRolePerm(roleId: string, perm: string) {
  const role = localRoles.value.find((r) => r.id === roleId)
  if (!role) return
  ;(role as Record<string, unknown>)[perm] = !(role as Record<string, unknown>)[perm]
}

function toggleDeptPerm(deptId: string, perm: string) {
  const dept = localDepartments.value.find((d) => d.id === deptId)
  if (!dept) return
  ;(dept as Record<string, unknown>)[perm] = !(dept as Record<string, unknown>)[perm]
}

function addEmail() {
  const val = emailInputValue.value.trim().replace(/,$/, '')
  if (val && !emailShares.value.includes(val)) {
    emailShares.value = [...emailShares.value, val]
  }
  emailInputValue.value = ''
}

function addQuickEmail() {
  const val = quickEmailValue.value.trim().replace(/,$/, '')
  if (val && !emailShares.value.includes(val)) {
    emailShares.value = [...emailShares.value, val]
  }
  quickEmailValue.value = ''
}

function removeEmail(email: string) {
  emailShares.value = emailShares.value.filter((e) => e !== email)
}

function handleBackspace() {
  if (!emailInputValue.value && emailShares.value.length > 0) {
    emailShares.value = emailShares.value.slice(0, -1)
  }
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  toast.success('Đã sao chép link')
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getRoleIcon(icon: string) {
  const map: Record<string, unknown> = {
    admin: Shield,
    sales: ShoppingCart,
    marketing: Megaphone,
    accounting: BookOpen,
  }
  return map[icon] ?? User
}

function getSourceIcon(source: string) {
  if (source === 'role') return Shield
  if (source === 'email') return Mail
  return Briefcase
}

function getLevelLabel(level: string) {
  const map: Record<string, string> = {
    full: 'Toàn quyền',
    view: 'Chỉ xem',
    download: 'Tải file',
    edit: 'Chỉnh sửa',
  }
  return map[level] ?? level
}

function getLevelClass(level: string) {
  const map: Record<string, string> = {
    full: 'bg-brand-50 text-brand-500 border-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20',
    view: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600',
    download: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600',
    edit: 'bg-success-50 text-success-500 border-success-100 dark:bg-success-500/10 dark:border-success-500/20',
  }
  return map[level] ?? ''
}

// Expose for potential parent use
defineExpose({ isLoading })
</script>
