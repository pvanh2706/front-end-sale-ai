<template>
  <!-- Icon only (collapsed sidebar) -->
  <div v-if="iconOnly" class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="4" height="16" rx="2" fill="white" />
      <rect x="7" y="5" width="4" height="12" rx="2" fill="white" fill-opacity="0.85" />
      <rect x="13" y="3" width="4" height="14" rx="2" fill="white" fill-opacity="0.65" />
    </svg>
  </div>

  <!-- Full logo (expanded sidebar / header) -->
  <div v-else class="flex items-center gap-2.5">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1" y="1" width="4" height="16" rx="2" fill="white" />
        <rect x="7" y="5" width="4" height="12" rx="2" fill="white" fill-opacity="0.85" />
        <rect x="13" y="3" width="4" height="14" rx="2" fill="white" fill-opacity="0.65" />
      </svg>
    </div>
    <span
      class="text-xl font-bold tracking-tight"
      :class="dark ? 'text-white' : 'text-gray-900 dark:text-white'"
    >
      Salio
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconOnly?: boolean
  dark?: boolean
}>()
</script>
