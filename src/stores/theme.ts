import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeId = 'ocean' | 'indigo' | 'emerald' | 'sunset' | 'rose' | 'graphite'
export type ColorMode = 'light' | 'dark' | 'system'

export interface ThemeOption {
  id: ThemeId
  name: string
  description: string
  primaryColor: string
  accentColor: string
  sidebarColor: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'ocean',
    name: 'Dai duong',
    description: 'Xanh duong - chuyen nghiep, tin cay',
    primaryColor: '#2563EB',
    accentColor: '#93C5FD',
    sidebarColor: '#1E3A8A',
  },
  {
    id: 'indigo',
    name: 'Tim cham',
    description: 'Tim - hien dai, AI-first',
    primaryColor: '#4F46E5',
    accentColor: '#A5B4FC',
    sidebarColor: '#312E81',
  },
  {
    id: 'emerald',
    name: 'Ngoc luc bao',
    description: 'Xanh la - tang truong, thinh vuong',
    primaryColor: '#059669',
    accentColor: '#6EE7B7',
    sidebarColor: '#064E3B',
  },
  {
    id: 'sunset',
    name: 'Hoang hon',
    description: 'Cam - nang luong, am ap',
    primaryColor: '#EA580C',
    accentColor: '#FDBA74',
    sidebarColor: '#7C2D12',
  },
  {
    id: 'rose',
    name: 'Hoa dao',
    description: 'Hong - than thien, mem mai',
    primaryColor: '#E11D48',
    accentColor: '#FDA4AF',
    sidebarColor: '#881337',
  },
  {
    id: 'graphite',
    name: 'Thach anh',
    description: 'Trung tinh - toi gian, tap trung',
    primaryColor: '#475569',
    accentColor: '#CBD5E1',
    sidebarColor: '#0F172A',
  },
]

const STORAGE_KEY_THEME = 'salio.theme'
const STORAGE_KEY_MODE = 'salio.color-mode'

function getSavedTheme(): ThemeId {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId | null
  if (savedTheme && THEME_OPTIONS.some((theme) => theme.id === savedTheme)) {
    return savedTheme
  }
  return 'ocean'
}

function getSavedMode(): ColorMode {
  const savedMode = localStorage.getItem(STORAGE_KEY_MODE) as ColorMode | null
  return savedMode === 'light' || savedMode === 'dark' || savedMode === 'system' ? savedMode : 'system'
}

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeId>(getSavedTheme())
  const colorMode = ref<ColorMode>(getSavedMode())

  const themeOption = computed(
    () => THEME_OPTIONS.find((theme) => theme.id === currentTheme.value) ?? THEME_OPTIONS[0],
  )

  const isDarkMode = computed(() => {
    return (
      colorMode.value === 'dark' ||
      (colorMode.value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  })

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  function applyColorMode() {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  function setTheme(id: ThemeId) {
    currentTheme.value = id
  }

  function setColorMode(mode: ColorMode) {
    colorMode.value = mode
  }

  function toggleColorMode() {
    colorMode.value = isDarkMode.value ? 'light' : 'dark'
  }

  watch(
    currentTheme,
    (value) => {
      localStorage.setItem(STORAGE_KEY_THEME, value)
      applyTheme()
    },
    { immediate: true },
  )

  watch(
    colorMode,
    (value) => {
      localStorage.setItem(STORAGE_KEY_MODE, value)
      applyColorMode()
    },
    { immediate: true },
  )

  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (colorMode.value === 'system') {
        applyColorMode()
      }
    })
  }

  return {
    currentTheme,
    colorMode,
    isDarkMode,
    themeOption,
    setTheme,
    setColorMode,
    toggleColorMode,
    applyTheme,
    applyColorMode,
    THEME_OPTIONS,
  }
})
