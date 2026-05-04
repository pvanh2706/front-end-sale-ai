<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent
      class="flex max-h-[90vh] w-full max-w-[520px] flex-col gap-0 overflow-hidden rounded-t-2xl p-0 md:rounded-2xl"
      :show-close-button="false"
    >
      <!-- Handle bar (mobile only) -->
      <div class="flex justify-center py-3 md:hidden">
        <div class="h-1.5 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <!-- Header -->
      <DialogHeader
        class="flex flex-row items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800 md:border-b md:pt-6"
      >
        <div>
          <DialogTitle class="text-theme-xl font-bold text-gray-900 dark:text-white">
            Chia sẻ cuộc trò chuyện
          </DialogTitle>
          <DialogDescription class="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            Chia sẻ hồ sơ chat với người khác hoặc nhúng vào trang web
          </DialogDescription>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          class="mt-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          aria-label="Đóng"
          @click="$emit('update:open', false)"
        >
          <X class="h-4 w-4" />
        </Button>
      </DialogHeader>

      <!-- Scrollable body -->
      <div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-6 py-5">

        <!-- Section 1: Liên kết chia sẻ -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="flex items-center gap-2 text-theme-sm font-semibold text-gray-900 dark:text-white">
              <Link2 class="h-4 w-4" />
              Liên kết chia sẻ
            </h3>
            <!-- Toggle public -->
            <button
              type="button"
              class="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none"
              :class="isPublicLink ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"
              :aria-checked="isPublicLink"
              role="switch"
              @click="isPublicLink = !isPublicLink"
            >
              <span
                class="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
                :class="isPublicLink ? 'translate-x-4' : 'translate-x-0.5'"
              ></span>
            </button>
          </div>

          <p class="mb-3 text-theme-xs text-gray-500 dark:text-gray-400">
            <span v-if="isPublicLink">Bất kỳ ai có liên kết đều có thể xem hồ sơ chat này.</span>
            <span v-else>Liên kết chia sẻ hiện bị tắt. Bật lên để tạo liên kết công khai.</span>
          </p>

          <div
            class="flex items-center gap-2 rounded-xl border bg-gray-50 px-4 py-3 transition-opacity dark:bg-gray-800/50"
            :class="isPublicLink ? 'border-gray-200 dark:border-gray-700' : 'pointer-events-none border-gray-100 opacity-50 dark:border-gray-800'"
          >
            <span class="flex-1 truncate text-theme-sm text-gray-600 dark:text-gray-400 font-mono select-all">
              {{ shareLink }}
            </span>
            <Button
              variant="ghost"
              size="sm"
              class="shrink-0 gap-1.5 text-brand-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
              :disabled="!isPublicLink"
              @click="handleCopyLink"
            >
              <Check v-if="linkCopied" class="h-3.5 w-3.5" />
              <Copy v-else class="h-3.5 w-3.5" />
              {{ linkCopied ? 'Đã sao chép' : 'Sao chép' }}
            </Button>
          </div>
        </section>

        <!-- Section 2: Mời người dùng -->
        <section>
          <h3 class="mb-3 flex items-center gap-2 text-theme-sm font-semibold text-gray-900 dark:text-white">
            <UserPlus class="h-4 w-4" />
            Mời người dùng
          </h3>

          <div class="flex gap-2">
            <div class="relative flex-1">
              <Mail class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                v-model="inviteEmail"
                type="email"
                placeholder="Nhập địa chỉ email..."
                class="pl-9 text-theme-sm"
                @keydown.enter.prevent="handleAddInvite"
              />
            </div>
            <Button
              class="shrink-0 bg-brand-500 text-white hover:bg-brand-600"
              :disabled="!inviteEmail.trim()"
              @click="handleAddInvite"
            >
              Mời
            </Button>
          </div>

          <!-- Invited list -->
          <div v-if="invitedUsers.length" class="mt-3 space-y-2">
            <div
              v-for="user in invitedUsers"
              :key="user.email"
              class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/50"
            >
              <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-theme-xs font-semibold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                {{ getInitials(user.email) }}
              </div>
              <span class="flex-1 truncate text-theme-sm text-gray-700 dark:text-gray-300">{{ user.email }}</span>
              <div class="flex items-center gap-2">
                <select
                  v-model="user.role"
                  class="rounded-lg border border-gray-200 bg-white px-2 py-1 text-theme-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                >
                  <option value="view">Chỉ xem</option>
                  <option value="comment">Bình luận</option>
                  <option value="edit">Chỉnh sửa</option>
                </select>
                <button
                  type="button"
                  class="text-gray-400 hover:text-error-500 transition-colors"
                  aria-label="Xóa"
                  @click="removeInvite(user.email)"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section 3: Quyền truy cập mặc định -->
        <section>
          <h3 class="mb-3 flex items-center gap-2 text-theme-sm font-semibold text-gray-900 dark:text-white">
            <ShieldCheck class="h-4 w-4" />
            Quyền truy cập mặc định
          </h3>
          <div class="space-y-3">
            <label
              v-for="perm in permissionOptions"
              :key="perm.id"
              class="flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-all"
              :class="defaultPermission === perm.id
                ? 'border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10'
                : 'border-gray-100 bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700'"
              @click="defaultPermission = perm.id"
            >
              <div
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                :class="defaultPermission === perm.id
                  ? 'border-brand-500 dark:border-brand-400'
                  : 'border-gray-300 dark:border-gray-600'"
              >
                <div
                  v-if="defaultPermission === perm.id"
                  class="h-2 w-2 rounded-full bg-brand-500 dark:bg-brand-400"
                ></div>
              </div>
              <div>
                <p
                  class="text-theme-sm font-semibold"
                  :class="defaultPermission === perm.id
                    ? 'text-brand-500 dark:text-brand-400'
                    : 'text-gray-900 dark:text-white'"
                >
                  {{ perm.label }}
                </p>
                <p class="text-theme-xs text-gray-500 dark:text-gray-400">{{ perm.description }}</p>
              </div>
            </label>
          </div>
        </section>

        <!-- Section 4: Nhúng (Embed) -->
        <section>
          <button
            type="button"
            class="flex w-full items-center justify-between text-theme-sm font-semibold text-gray-900 dark:text-white"
            @click="showEmbed = !showEmbed"
          >
            <span class="flex items-center gap-2">
              <Code2 class="h-4 w-4" />
              Nhúng vào trang web
            </span>
            <ChevronDown
              class="h-4 w-4 text-gray-400 transition-transform"
              :class="showEmbed ? 'rotate-180' : ''"
            />
          </button>

          <div v-if="showEmbed" class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <p class="mb-3 text-theme-xs text-gray-500 dark:text-gray-400">
              Sao chép đoạn mã dưới đây và dán vào trang web của bạn.
            </p>
            <div class="relative">
              <pre class="overflow-x-auto rounded-lg bg-gray-900 p-3 text-theme-xs text-gray-300 dark:bg-gray-950"><code>{{ embedCode }}</code></pre>
              <button
                type="button"
                class="absolute right-2 top-2 rounded-md bg-gray-700 p-1.5 text-gray-300 transition-colors hover:bg-gray-600"
                aria-label="Sao chép mã nhúng"
                @click="handleCopyEmbed"
              >
                <Check v-if="embedCopied" class="h-3.5 w-3.5 text-success-400" />
                <Copy v-else class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>

      </div>

      <!-- Footer -->
      <DialogFooter
        class="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50 md:flex-row md:items-center md:justify-between"
      >
        <p class="text-theme-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Info class="h-3.5 w-3.5 shrink-0" />
          Người được chia sẻ sẽ nhận email thông báo
        </p>
        <div class="flex w-full gap-3 md:w-auto">
          <Button
            variant="ghost"
            class="flex-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:flex-none"
            @click="$emit('update:open', false)"
          >
            Hủy
          </Button>
          <Button
            class="flex-1 bg-brand-500 text-white hover:bg-brand-600 md:flex-none"
            :disabled="isSaving || (!isPublicLink && invitedUsers.length === 0)"
            @click="handleSave"
          >
            <LoaderCircle v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
            <Send v-else class="mr-2 h-4 w-4" />
            Xác nhận chia sẻ
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  Info,
  Link2,
  LoaderCircle,
  Mail,
  Send,
  ShieldCheck,
  UserPlus,
  X,
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{ open: boolean }>()
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

// --- Share link ---
const isPublicLink = ref(false)
const linkCopied = ref(false)
const shareLink = computed(() => 'https://salio.ai/share/chat/abc123xyz')

async function handleCopyLink() {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    linkCopied.value = true
    toast.success('Đã sao chép liên kết')
    setTimeout(() => { linkCopied.value = false }, 2000)
  } catch {
    toast.error('Không thể sao chép liên kết')
  }
}

// --- Invite users ---
interface InvitedUser {
  email: string
  role: 'view' | 'comment' | 'edit'
}

const inviteEmail = ref('')
const invitedUsers = ref<InvitedUser[]>([])

function getInitials(email: string): string {
  return email.slice(0, 2).toUpperCase()
}

function handleAddInvite() {
  const email = inviteEmail.value.trim()
  if (!email) return
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    toast.error('Địa chỉ email không hợp lệ')
    return
  }
  if (invitedUsers.value.some((u) => u.email === email)) {
    toast.error('Email này đã được thêm')
    return
  }
  invitedUsers.value.push({ email, role: 'view' })
  inviteEmail.value = ''
}

function removeInvite(email: string) {
  invitedUsers.value = invitedUsers.value.filter((u) => u.email !== email)
}

// --- Permissions ---
const permissionOptions = [
  {
    id: 'view' as const,
    label: 'Chỉ xem',
    description: 'Người dùng chỉ có thể đọc nội dung hồ sơ chat',
  },
  {
    id: 'comment' as const,
    label: 'Có thể bình luận',
    description: 'Người dùng có thể đọc và thêm bình luận',
  },
]
type PermissionId = (typeof permissionOptions)[number]['id']
const defaultPermission = ref<PermissionId>('view')

// --- Embed code ---
const showEmbed = ref(false)
const embedCopied = ref(false)
const embedCode = computed(
  () => `<iframe\n  src="${shareLink.value}/embed"\n  width="100%"\n  height="600"\n  frameborder="0"\n  allow="clipboard-write"\n></iframe>`,
)

async function handleCopyEmbed() {
  try {
    await navigator.clipboard.writeText(embedCode.value)
    embedCopied.value = true
    toast.success('Đã sao chép mã nhúng')
    setTimeout(() => { embedCopied.value = false }, 2000)
  } catch {
    toast.error('Không thể sao chép mã nhúng')
  }
}

// --- Save / confirm ---
const isSaving = ref(false)

async function handleSave() {
  isSaving.value = true
  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 900))
    const parts: string[] = []
    if (isPublicLink.value) parts.push('liên kết công khai')
    if (invitedUsers.value.length) parts.push(`${invitedUsers.value.length} người dùng`)
    toast.success(`Đã chia sẻ tới ${parts.join(' và ')}`)
    emit('update:open', false)
  } finally {
    isSaving.value = false
  }
}
</script>
