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
    name: 'Đại dương',
    description: 'Xanh dương - chuyên nghiệp, tin cậy',
    primaryColor: '#748DDC',
    accentColor: '#C3D3FF',
    sidebarColor: '#DBE5FF',
  },
  {
    id: 'indigo',
    name: 'Tím chàm',
    description: 'Tím - hiện đại, AI-first',
    primaryColor: '#9488C8',
    accentColor: '#D4C9FF',
    sidebarColor: '#E4DCFF',
  },
  {
    id: 'emerald',
    name: 'Ngọc lục bảo',
    description: 'Xanh lá - tăng trưởng, thịnh vượng',
    primaryColor: '#78B094',
    accentColor: '#BFE3D1',
    sidebarColor: '#D4EEE1',
  },
  {
    id: 'sunset',
    name: 'Hoàng hôn',
    description: 'Cam - năng lượng, ấm áp',
    primaryColor: '#CB9073',
    accentColor: '#FFD1B5',
    sidebarColor: '#FFE1CE',
  },
  {
    id: 'rose',
    name: 'Hoa đào',
    description: 'Hồng - thân thiện, mềm mại',
    primaryColor: '#BE8492',
    accentColor: '#F8C8D2',
    sidebarColor: '#FFDCE3',
  },
  {
    id: 'graphite',
    name: 'Thạch anh',
    description: 'Trung tính - tối giản, tập trung',
    primaryColor: '#8E9DB1',
    accentColor: '#D4DAE5',
    sidebarColor: '#E4E8EF',
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
