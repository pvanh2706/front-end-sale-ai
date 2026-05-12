<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Nhóm quyền</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Quản lý nhóm theo Team và theo Role. Mỗi nhóm có danh sách thành viên riêng.
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
        :class="activeTab === tab.id
          ? 'border-brand-500 text-brand-500'
          : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'"
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
        <span class="ml-0.5 rounded-full bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:text-gray-300">
          {{ tab.id === 'teams' ? (groups?.teams?.length ?? 0) : (groups?.roles?.length ?? 0) }}
        </span>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
    </div>

    <template v-else>
      <!-- Teams tab -->
      <div v-if="activeTab === 'teams'" class="space-y-4">
        <!-- Create group -->
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ groups?.teams?.length ?? 0 }} nhóm team</p>
          <Button
            size="sm"
            class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600"
            @click="openCreateDialog('team')"
          >
            <Plus class="h-4 w-4" />
            Tạo nhóm mới
          </Button>
        </div>

        <div v-for="group in groups?.teams ?? []" :key="group.id" class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <!-- Group Header -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
            <div class="flex items-center gap-3">
              <div
                class="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                :style="{ backgroundColor: group.color }"
              >
                {{ group.name.slice(0, 2).toUpperCase() }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ group.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ group.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="secondary" class="text-xs">{{ group.members.length }} thành viên</Badge>
              <button
                type="button"
                class="rounded p-1 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                title="Xóa nhóm"
                @click="deleteGroup('team', group.id)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Members list -->
          <div class="divide-y divide-gray-100 dark:divide-gray-700/60 bg-white dark:bg-gray-800/20">
            <div
              v-for="member in group.members"
              :key="member.id"
              class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {{ member.avatar }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Badge
                  class="text-[10px] capitalize"
                  :class="member.role === 'admin' ? 'bg-brand-50 text-brand-500 border-brand-100 dark:bg-brand-500/10 dark:border-brand-500/20' : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600'"
                >
                  {{ member.role === 'admin' ? 'Trưởng nhóm' : 'Thành viên' }}
                </Badge>
                <button
                  type="button"
                  class="rounded p-1 text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                  title="Xóa thành viên"
                  @click="removeMember('team', group.id, member.id)"
                >
                  <UserMinus class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <!-- Add member row -->
            <div class="flex items-center gap-2 px-5 py-3 bg-gray-50/50 dark:bg-gray-800/10">
              <UserPlus class="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Input
                v-model="addMemberEmail[group.id]"
                type="email"
                :placeholder="`Thêm thành viên vào ${group.name}...`"
                class="h-8 flex-1 text-sm border-dashed"
                @keydown.enter="addMember('team', group.id)"
              />
              <Button
                size="sm"
                variant="outline"
                class="h-8 gap-1 text-xs"
                :disabled="!addMemberEmail[group.id]?.trim()"
                @click="addMember('team', group.id)"
              >
                <Plus class="h-3 w-3" />
                Thêm
              </Button>
            </div>
          </div>
        </div>

        <div v-if="!groups?.teams?.length" class="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
          <Users class="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Chưa có nhóm team nào</p>
          <Button size="sm" class="mt-4 gap-1.5 bg-brand-500 text-white hover:bg-brand-600" @click="openCreateDialog('team')">
            <Plus class="h-4 w-4" /> Tạo nhóm đầu tiên
          </Button>
        </div>
      </div>

      <!-- Roles tab -->
      <div v-if="activeTab === 'roles'" class="space-y-4">
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ groups?.roles?.length ?? 0 }} nhóm role</p>
          <Button
            size="sm"
            class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600"
            @click="openCreateDialog('role')"
          >
            <Plus class="h-4 w-4" />
            Tạo role mới
          </Button>
        </div>

        <div v-for="group in groups?.roles ?? []" :key="group.id" class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          <!-- Group Header -->
          <div class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
            <div class="flex items-center gap-3">
              <div
                class="h-8 w-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                :style="{ backgroundColor: group.color }"
              >
                <Shield class="h-4 w-4" />
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ group.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ group.description }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <!-- Permission badges -->
              <div class="hidden sm:flex items-center gap-1 flex-wrap">
                <span
                  v-for="perm in group.permissions"
                  :key="perm"
                  class="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-300"
                >
                  {{ permLabel[perm] ?? perm }}
                </span>
              </div>
              <Badge variant="secondary" class="text-xs">{{ group.members.length }} thành viên</Badge>
              <button
                type="button"
                class="rounded p-1 text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                title="Xóa role"
                @click="deleteGroup('role', group.id)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Members list -->
          <div class="divide-y divide-gray-100 dark:divide-gray-700/60 bg-white dark:bg-gray-800/20">
            <div
              v-for="member in group.members"
              :key="member.id"
              class="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-500 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {{ member.avatar }}
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ member.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.email }}</p>
                </div>
              </div>
              <button
                type="button"
                class="rounded p-1 text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors"
                title="Xóa thành viên"
                @click="removeMember('role', group.id, member.id)"
              >
                <UserMinus class="h-3.5 w-3.5" />
              </button>
            </div>

            <!-- Add member row -->
            <div class="flex items-center gap-2 px-5 py-3 bg-gray-50/50 dark:bg-gray-800/10">
              <UserPlus class="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Input
                v-model="addMemberEmail[group.id]"
                type="email"
                :placeholder="`Thêm thành viên vào role ${group.name}...`"
                class="h-8 flex-1 text-sm border-dashed"
                @keydown.enter="addMember('role', group.id)"
              />
              <Button
                size="sm"
                variant="outline"
                class="h-8 gap-1 text-xs"
                :disabled="!addMemberEmail[group.id]?.trim()"
                @click="addMember('role', group.id)"
              >
                <Plus class="h-3 w-3" />
                Thêm
              </Button>
            </div>
          </div>
        </div>

        <div v-if="!groups?.roles?.length" class="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-12 text-center">
          <Shield class="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Chưa có role nào</p>
          <Button size="sm" class="mt-4 gap-1.5 bg-brand-500 text-white hover:bg-brand-600" @click="openCreateDialog('role')">
            <Plus class="h-4 w-4" /> Tạo role đầu tiên
          </Button>
        </div>
      </div>
    </template>

    <!-- Create Group Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {{ createType === 'team' ? 'Tạo nhóm Team mới' : 'Tạo Role mới' }}
          </DialogTitle>
          <DialogDescription>
            {{ createType === 'team' ? 'Nhóm để tổ chức thành viên theo team làm việc' : 'Role để phân quyền truy cập tài liệu' }}
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Tên {{ createType === 'team' ? 'nhóm' : 'role' }} <span class="text-error-500">*</span></Label>
            <Input
              v-model="createForm.name"
              :placeholder="createType === 'team' ? 'VD: Sales Team' : 'VD: Editor'"
              class="h-9"
              @keydown.enter="submitCreate"
            />
          </div>
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Mô tả</Label>
            <Input
              v-model="createForm.description"
              placeholder="Mô tả ngắn về nhóm này..."
              class="h-9"
            />
          </div>
          <div class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Màu nhóm</Label>
            <div class="flex items-center gap-2">
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="color in colorOptions"
                  :key="color"
                  type="button"
                  class="h-6 w-6 rounded-full border-2 transition-all"
                  :style="{ backgroundColor: color }"
                  :class="createForm.color === color ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'"
                  @click="createForm.color = color"
                />
              </div>
            </div>
          </div>
          <div v-if="createType === 'role'" class="space-y-1.5">
            <Label class="text-xs font-medium text-gray-600 dark:text-gray-400">Quyền hạn</Label>
            <div class="flex flex-wrap gap-2">
              <label
                v-for="(label, key) in permLabel"
                :key="key"
                class="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  :checked="createForm.permissions.includes(key)"
                  @change="toggleCreatePerm(key)"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">{{ label }}</span>
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateDialog = false">Hủy</Button>
          <Button
            class="bg-brand-500 text-white hover:bg-brand-600"
            :disabled="!createForm.name.trim() || isCreating"
            @click="submitCreate"
          >
            <Loader2 v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
            Tạo {{ createType === 'team' ? 'nhóm' : 'role' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { toast } from 'vue-sonner'
import { Loader2, Plus, Shield, Trash2, UserMinus, UserPlus, Users } from 'lucide-vue-next'
import { get, post, del } from '@/services/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// ─── Types ───────────────────────────────────────────────────────────────────

interface GroupMember {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

interface TeamGroup {
  id: string
  name: string
  description: string
  color: string
  members: GroupMember[]
}

interface RoleGroup {
  id: string
  name: string
  description: string
  color: string
  permissions: string[]
  members: GroupMember[]
}

interface PermissionGroupsData {
  teams: TeamGroup[]
  roles: RoleGroup[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const tabs = [
  { id: 'teams', label: 'Nhóm theo Team', icon: Users },
  { id: 'roles', label: 'Nhóm theo Role', icon: Shield },
]

const permLabel: Record<string, string> = {
  view: 'Xem',
  edit: 'Chỉnh sửa',
  download: 'Tải xuống',
  share: 'Chia sẻ',
  delete: 'Xóa',
  manage: 'Quản trị',
}

const colorOptions = ['#465fff', '#12b76a', '#f04438', '#f79009', '#667085', '#9333ea', '#0ea5e9', '#ec4899']

// ─── State ────────────────────────────────────────────────────────────────────

const queryClient = useQueryClient()
const activeTab = ref<'teams' | 'roles'>('teams')
const addMemberEmail = reactive<Record<string, string>>({})
const showCreateDialog = ref(false)
const createType = ref<'team' | 'role'>('team')
const isCreating = ref(false)
const createForm = reactive({
  name: '',
  description: '',
  color: '#465fff',
  permissions: ['view'] as string[],
})

// ─── Query ─────────────────────────────────────────────────────────────────────

const { data: queryResult, isLoading } = useQuery({
  queryKey: ['permission-groups'],
  queryFn: () => get<{ success: boolean; data: PermissionGroupsData }>('/v1/permission-groups'),
})

const groups = computed<PermissionGroupsData | null>(() => {
  const apiRes = queryResult.value
  if (!apiRes?.isSuccess || !apiRes.data) return null
  const backendRes = apiRes.data as unknown as { success: boolean; data: PermissionGroupsData }
  return backendRes?.data ?? null
})

// ─── Mutations ────────────────────────────────────────────────────────────────

const createTeamMutation = useMutation({
  mutationFn: (body: { name: string; description: string; color: string }) =>
    post('/v1/permission-groups/teams', body),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
    toast.success('Đã tạo nhóm team mới')
    showCreateDialog.value = false
  },
  onError: () => toast.error('Không thể tạo nhóm'),
})

const createRoleMutation = useMutation({
  mutationFn: (body: { name: string; description: string; color: string; permissions: string[] }) =>
    post('/v1/permission-groups/roles', body),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
    toast.success('Đã tạo role mới')
    showCreateDialog.value = false
  },
  onError: () => toast.error('Không thể tạo role'),
})

const deleteGroupMutation = useMutation({
  mutationFn: ({ type, id }: { type: 'team' | 'role'; id: string }) =>
    del(`/v1/permission-groups/${type === 'team' ? 'teams' : 'roles'}/${id}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
    toast.success('Đã xóa nhóm')
  },
  onError: () => toast.error('Không thể xóa nhóm'),
})

const addMemberMutation = useMutation({
  mutationFn: ({ type, groupId, email }: { type: 'team' | 'role'; groupId: string; email: string }) =>
    post(`/v1/permission-groups/${type === 'team' ? 'teams' : 'roles'}/${groupId}/members`, { email }),
  onSuccess: (_data, vars) => {
    queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
    addMemberEmail[vars.groupId] = ''
    toast.success('Đã thêm thành viên')
  },
  onError: () => toast.error('Không thể thêm thành viên'),
})

const removeMemberMutation = useMutation({
  mutationFn: ({ type, groupId, memberId }: { type: 'team' | 'role'; groupId: string; memberId: string }) =>
    del(`/v1/permission-groups/${type === 'team' ? 'teams' : 'roles'}/${groupId}/members/${memberId}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['permission-groups'] })
    toast.success('Đã xóa thành viên khỏi nhóm')
  },
  onError: () => toast.error('Không thể xóa thành viên'),
})

// ─── Handlers ────────────────────────────────────────────────────────────────

function openCreateDialog(type: 'team' | 'role'): void {
  createType.value = type
  createForm.name = ''
  createForm.description = ''
  createForm.color = '#465fff'
  createForm.permissions = ['view']
  showCreateDialog.value = true
}

function toggleCreatePerm(key: string): void {
  const idx = createForm.permissions.indexOf(key)
  if (idx === -1) createForm.permissions.push(key)
  else createForm.permissions.splice(idx, 1)
}

async function submitCreate(): Promise<void> {
  if (!createForm.name.trim()) return
  isCreating.value = true
  try {
    if (createType.value === 'team') {
      await createTeamMutation.mutateAsync({ name: createForm.name, description: createForm.description, color: createForm.color })
    } else {
      await createRoleMutation.mutateAsync({ name: createForm.name, description: createForm.description, color: createForm.color, permissions: [...createForm.permissions] })
    }
  } finally {
    isCreating.value = false
  }
}

function deleteGroup(type: 'team' | 'role', id: string): void {
  if (confirm('Bạn có chắc muốn xóa nhóm này?')) {
    deleteGroupMutation.mutate({ type, id })
  }
}

function addMember(type: 'team' | 'role', groupId: string): void {
  const email = addMemberEmail[groupId]?.trim()
  if (!email) return
  addMemberMutation.mutate({ type, groupId, email })
}

function removeMember(type: 'team' | 'role', groupId: string, memberId: string): void {
  removeMemberMutation.mutate({ type, groupId, memberId })
}
</script>
