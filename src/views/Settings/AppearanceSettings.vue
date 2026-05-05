<template>
  <div class="appearance-settings space-y-8">
    <section class="settings-section space-y-4">
      <header>
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Bảng màu</h2>
        <p class="text-sm text-[var(--color-text-secondary)]">
          Chọn tone màu chủ đạo cho toàn bộ giao diện. Thay đổi áp dụng tức thì.
        </p>
      </header>

      <div class="theme-grid">
        <button
          v-for="theme in themeStore.THEME_OPTIONS"
          :key="theme.id"
          type="button"
          @click="themeStore.setTheme(theme.id)"
          :class="['theme-card', { 'theme-card--active': themeStore.currentTheme === theme.id }]"
        >
          <div class="theme-preview">
            <div class="theme-preview__sidebar" :style="{ background: theme.sidebarColor }">
              <div class="theme-preview__sidebar-item" />
              <div
                class="theme-preview__sidebar-item theme-preview__sidebar-item--active"
                :style="{ borderColor: theme.accentColor }"
              />
              <div class="theme-preview__sidebar-item" />
            </div>
            <div class="theme-preview__content">
              <div class="theme-preview__button" :style="{ background: theme.primaryColor }" />
              <div class="theme-preview__line" />
              <div class="theme-preview__line" style="width: 60%" />
            </div>
          </div>

          <div class="theme-info">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-[var(--color-text-primary)]">{{ theme.name }}</h3>
              <CheckCircle
                v-if="themeStore.currentTheme === theme.id"
                class="h-4 w-4 text-primary-600"
              />
            </div>
            <p class="text-xs text-[var(--color-text-secondary)]">{{ theme.description }}</p>
            <div class="theme-swatches">
              <span class="swatch" :style="{ background: theme.sidebarColor }" />
              <span class="swatch" :style="{ background: theme.primaryColor }" />
              <span class="swatch" :style="{ background: theme.accentColor }" />
            </div>
          </div>
        </button>
      </div>
    </section>

    <section class="settings-section space-y-4">
      <header>
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Chế độ hiển thị</h2>
        <p class="text-sm text-[var(--color-text-secondary)]">
          Chọn giao diện sáng, tối, hoặc tự động theo hệ thống.
        </p>
      </header>

      <div class="mode-options">
        <label
          v-for="mode in colorModes"
          :key="mode.value"
          :class="['mode-card', { 'mode-card--active': themeStore.colorMode === mode.value }]"
        >
          <input
            type="radio"
            name="colorMode"
            :value="mode.value"
            :checked="themeStore.colorMode === mode.value"
            @change="themeStore.setColorMode(mode.value)"
            class="sr-only"
          />
          <component :is="mode.icon" class="h-6 w-6" />
          <span class="font-medium">{{ mode.label }}</span>
          <span class="text-xs text-[var(--color-text-secondary)]">{{ mode.description }}</span>
        </label>
      </div>
    </section>

    <section class="settings-section space-y-3">
      <header>
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">Cỡ chữ</h2>
      </header>

      <div class="font-size-slider">
        <span class="text-xs text-[var(--color-text-secondary)]">Nhỏ</span>
        <input v-model="fontSize" type="range" min="14" max="18" />
        <span class="text-lg text-[var(--color-text-primary)]">Lớn</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { CheckCircle, Monitor, Moon, Sun } from 'lucide-vue-next'
import { useThemeStore, type ColorMode } from '@/stores/theme'

const themeStore = useThemeStore()

const colorModes: {
  value: ColorMode
  label: string
  icon: typeof Sun
  description: string
}[] = [
  { value: 'light', label: 'Sáng', icon: Sun, description: 'Giao diện sáng' },
  { value: 'dark', label: 'Tối', icon: Moon, description: 'Giao diện tối' },
  { value: 'system', label: 'Tự động', icon: Monitor, description: 'Theo hệ thống' },
]

const fontSize = ref(16)

onMounted(() => {
  const saved = Number(localStorage.getItem('salio.font-size') || '16')
  fontSize.value = Number.isNaN(saved) ? 16 : saved
  document.documentElement.style.fontSize = `${fontSize.value}px`
})

watch(fontSize, (value) => {
  document.documentElement.style.fontSize = `${value}px`
  localStorage.setItem('salio.font-size', String(value))
})
</script>

<style scoped>
.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms ease;
  text-align: left;
}

.theme-card:hover {
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-card--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-50);
  box-shadow: 0 0 0 4px var(--color-primary-100);
}

.theme-preview {
  display: flex;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.theme-preview__sidebar {
  width: 30%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-preview__sidebar-item {
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.theme-preview__sidebar-item--active {
  background: rgba(255, 255, 255, 0.25);
  border-left: 2px solid;
}

.theme-preview__content {
  flex: 1;
  background: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.theme-preview__button {
  width: 50px;
  height: 18px;
  border-radius: 4px;
}

.theme-preview__line {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  width: 100%;
}

.theme-swatches {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 600px;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 200ms ease;
}

.mode-card--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.font-size-slider {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 360px;
}

.font-size-slider input[type='range'] {
  width: 100%;
}

@media (max-width: 639px) {
  .theme-grid {
    grid-template-columns: 1fr;
  }

  .mode-options {
    grid-template-columns: 1fr;
  }
}
</style>
