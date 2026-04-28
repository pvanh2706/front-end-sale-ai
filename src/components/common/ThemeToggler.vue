<template>
  <button
    @click="toggleTheme"
    class="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <!-- Sun icon (shown in dark mode) -->
    <svg
      v-if="isDarkMode"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <!-- Moon icon (shown in light mode) -->
    <svg
      v-else
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.9999 12C21.9999 17.5228 17.5228 21.9999 12 21.9999V23.9999C18.6274 23.9999 23.9999 18.6274 23.9999 12H21.9999ZM12 21.9999C6.47715 21.9999 2 17.5228 2 12H0C0 18.6274 5.37258 23.9999 12 23.9999V21.9999ZM2 12C2 6.47715 6.47715 2 12 2V0C5.37258 0 0 5.37258 0 12H2ZM15.5 14.5C12.4624 14.5 9.99999 12.0376 9.99999 9H7.99999C7.99999 13.1421 11.3579 16.5 15.5 16.5V14.5ZM20.4253 11.469C19.4172 13.1373 17.5882 14.5 15.5 14.5V16.5C18.2559 16.5 20.6304 14.6955 21.7092 12.2446L20.4253 11.469ZM9.99999 9C9.99999 6.91177 11.3627 5.08275 13.031 4.07467L12.2553 2.79085C10.0937 4.07513 7.99999 6.67236 7.99999 9H9.99999ZM13.531 4.57467C13.531 4.57467 12.5452 2.29085 12.1432 2.29085L11.7553 2.29085C11.7553 2.29085 11.3553 2.87085 13.031 4.07467L13.531 4.57467ZM21.7092 12.2446C21.9999 11.5 21.9999 11.5 21.9999 12H23.9999C23.9999 11 23.4999 10 21.7092 12.2446Z"
        fill="currentColor"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/components/layout/ThemeProvider.vue'

const { isDarkMode, toggleTheme } = useTheme() as {
  isDarkMode: { value: boolean }
  toggleTheme: () => void
}
</script>
