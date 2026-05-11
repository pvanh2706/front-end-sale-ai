<template>
  <div class="mb-4">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ pageTitle }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps<{ pageTitle: string }>()
</script>
