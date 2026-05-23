<template>
  <div class="space-y-3">
    <p class="text-xs text-gray-500 dark:text-gray-400">
      Hành động mẫu giúp nhân viên ghi nhận hoạt động nhanh hơn. Mỗi hành động có điểm KPI và thời gian tham khảo để theo dõi năng suất.
    </p>

    <!-- Column header labels -->
    <div class="grid grid-cols-[2.25rem_1fr_4.5rem_4.5rem_2.25rem] items-center gap-1.5 px-2">
      <span></span>
      <span class="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Tên hành động</span>
      <span class="text-center text-[10px] font-semibold uppercase tracking-wider text-brand-400">Điểm</span>
      <span class="text-center text-[10px] font-semibold uppercase tracking-wider text-gray-400">Phút</span>
      <span></span>
    </div>

    <!-- Action list -->
    <div class="max-h-[280px] space-y-1.5 overflow-y-auto py-1 pr-1">
      <div
        v-for="action in currentActions"
        :key="action.id"
        class="group grid grid-cols-[2.25rem_1fr_4.5rem_4.5rem_2.25rem] items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 dark:border-gray-700 dark:bg-gray-800/50"
      >
        <!-- Emoji input (user types/pastes emoji) -->
        <input
          :value="action.emoji"
          type="text"
          maxlength="2"
          class="w-8 rounded-md border border-transparent bg-transparent text-center text-lg leading-none outline-none transition-all hover:border-gray-200 focus:border-brand-300 focus:bg-white dark:focus:bg-gray-800"
          title="Nhập hoặc paste emoji"
          @blur="store.updateAction(module, action.id, { emoji: ($event.target as HTMLInputElement).value.trim() || action.emoji })"
        />

        <!-- Name input -->
        <input
          :value="action.name"
          type="text"
          maxlength="40"
          placeholder="Tên hành động"
          class="min-w-0 rounded-md border border-transparent bg-transparent px-1.5 py-0.5 text-sm text-gray-800 outline-none transition-all hover:border-gray-200 focus:border-brand-300 focus:bg-white focus:ring-1 focus:ring-brand-100 dark:text-gray-200 dark:focus:bg-gray-800"
          @blur="store.updateAction(module, action.id, { name: ($event.target as HTMLInputElement).value.trim() || action.name })"
          @keyup.enter="($event.target as HTMLInputElement).blur()"
        />

        <!-- Score -->
        <div class="flex items-center justify-center gap-0.5">
          <input
            :value="action.score"
            type="number"
            min="0"
            max="9999"
            class="w-10 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-center text-sm font-medium text-brand-600 outline-none transition-all hover:border-gray-200 focus:border-brand-300 focus:bg-white dark:text-brand-400 dark:focus:bg-gray-800"
            @blur="store.updateAction(module, action.id, { score: Math.max(0, Number(($event.target as HTMLInputElement).value) || 0) })"
          />
          <span class="text-[10px] text-brand-400">đ</span>
        </div>

        <!-- Duration -->
        <div class="flex items-center justify-center gap-0.5">
          <input
            :value="action.durationMin"
            type="number"
            min="1"
            max="9999"
            class="w-10 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-center text-sm text-gray-600 outline-none transition-all hover:border-gray-200 focus:border-brand-300 focus:bg-white dark:text-gray-400 dark:focus:bg-gray-800"
            @blur="store.updateAction(module, action.id, { durationMin: Math.max(1, Number(($event.target as HTMLInputElement).value) || 1) })"
          />
          <span class="text-[10px] text-gray-400">ph</span>
        </div>

        <!-- Delete -->
        <button
          type="button"
          class="rounded-md p-1 text-gray-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-error-50 hover:text-error-500 dark:hover:bg-error-900/20"
          title="Xóa hành động"
          @click="store.deleteAction(module, action.id)"
        >
          <Trash2 class="h-3.5 w-3.5" />
        </button>
      </div>

      <p v-if="currentActions.length === 0" class="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
        Chưa có hành động nào. Thêm bên dưới.
      </p>
    </div>

    <!-- Add action form -->
    <div
      v-if="showAddForm"
      class="space-y-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3 dark:border-brand-700/60 dark:bg-brand-900/20"
      @click.stop
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">Hành động mới</p>

      <div class="flex items-center gap-2">
        <!-- Emoji -->
        <input
          v-model="newEmoji"
          type="text"
          maxlength="2"
          class="w-11 rounded-lg border border-gray-200 bg-white px-1.5 py-1.5 text-center text-xl leading-none outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800"
          placeholder="📝"
          title="Nhập hoặc paste emoji"
        />
        <!-- Name -->
        <input
          v-model="newName"
          type="text"
          maxlength="40"
          class="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none transition-all focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Tên hành động..."
          @keyup.enter="confirmAdd"
          @keyup.esc="showAddForm = false; resetNew()"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">Điểm KPI</label>
          <div class="flex items-center gap-1.5">
            <input
              v-model.number="newScore"
              type="number"
              min="0"
              max="9999"
              class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="shrink-0 text-xs text-brand-400">điểm</span>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-xs font-medium text-gray-600 dark:text-gray-400">Thời gian thực hiện</label>
          <div class="flex items-center gap-1.5">
            <input
              v-model.number="newDurationMin"
              type="number"
              min="1"
              max="9999"
              class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span class="shrink-0 text-xs text-gray-400">phút</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          @click="showAddForm = false; resetNew()"
        >Hủy</button>
        <button
          v-if="newName.trim()"
          type="button"
          class="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600"
          @click="confirmAdd"
        >Thêm</button>
      </div>
    </div>

    <!-- Add toggle button -->
    <button
      v-if="!showAddForm"
      type="button"
      class="flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:text-brand-400"
      @click="showAddForm = true"
    >
      <Plus class="h-4 w-4" />
      Thêm hành động mới
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useActionSettingsStore } from '@/stores/useActionSettingsStore'
import type { ActionModule } from '@/stores/useActionSettingsStore'

const props = defineProps<{ module: ActionModule }>()

const store = useActionSettingsStore()
const currentActions = computed(() => store.getActions(props.module))

// ─── Add form state ───────────────────────────────────────────
const showAddForm    = ref(false)
const newEmoji       = ref('📝')
const newName        = ref('')
const newScore       = ref(5)
const newDurationMin = ref(15)

function resetNew(): void {
  newEmoji.value       = '📝'
  newName.value        = ''
  newScore.value       = 5
  newDurationMin.value = 15
}

function confirmAdd(): void {
  const name = newName.value.trim()
  if (!name) { toast.error('Tên hành động không được để trống'); return }
  store.addAction(props.module, {
    name,
    emoji:       newEmoji.value.trim() || '📝',
    score:       Math.max(0, newScore.value || 0),
    durationMin: Math.max(1, newDurationMin.value || 1),
  })
  toast.success('Đã thêm hành động')
  showAddForm.value = false
  resetNew()
}
</script>
