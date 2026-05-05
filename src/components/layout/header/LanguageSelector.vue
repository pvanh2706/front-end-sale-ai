<template>
  <div class="relative" ref="dropdownRef">
    <button
      type="button"
      class="flex h-10 w-10 items-center justify-center rounded-lg border bg-transparent transition-colors border-[var(--color-sidebar-active-border)] text-[var(--color-sidebar-text)] hover:bg-primary-100 dark:hover:bg-white/10 lg:h-11 lg:w-11"
      :aria-label="`Ngôn ngữ: ${currentLang.label}`"
      @click="toggleDropdown"
    >
      <span class="text-base leading-none">{{ currentLang.flag }}</span>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-44 rounded-2xl border p-1.5 shadow-theme-lg border-[var(--color-sidebar-active-border)] bg-[var(--color-sidebar-bg)]"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-theme-sm transition-colors"
        :class="lang.code === selectedLang
          ? 'bg-primary-200 font-semibold text-primary-900 dark:bg-white/12 dark:text-white'
          : 'text-[var(--color-sidebar-text)] hover:bg-primary-100 dark:hover:bg-white/10'"
        @click="selectLang(lang.code)"
      >
        <span class="text-base">{{ lang.flag }}</span>
        <span>{{ lang.label }}</span>
        <span
          v-if="lang.code === selectedLang"
          class="ml-auto h-1.5 w-1.5 rounded-full bg-primary-700 dark:bg-white"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Language {
  code: string
  label: string
  flag: string
}

const languages: Language[] = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

const selectedLang = ref(localStorage.getItem('salio_lang') ?? 'vi')
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const currentLang = computed(() => languages.find((l) => l.code === selectedLang.value) ?? languages[0])

function selectLang(code: string) {
  selectedLang.value = code
  localStorage.setItem('salio_lang', code)
  isOpen.value = false
  // Placeholder: would integrate i18n here if available
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
