<template>
  <AdminLayout>
    <div class="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03]">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white/90 mb-3">
        Hello, World! 👋
      </h1>
      <p class="text-gray-500 dark:text-gray-400 text-base">
        Đây là trang Hello World đầu tiên của dự án.
      </p>

      <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] p-5 text-center">
          <div class="text-2xl font-bold text-brand-500 mb-1">Vue 3</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Framework</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] p-5 text-center">
          <div class="text-2xl font-bold text-brand-500 mb-1">Tailwind</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">CSS</div>
        </div>
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] p-5 text-center">
          <div class="text-2xl font-bold text-brand-500 mb-1">TypeScript</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Language</div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
