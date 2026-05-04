<template>
  <AdminLayout>
    <div class="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] md:p-8">
      <div class="flex flex-col gap-2">
        <h1 class="text-title-xs font-semibold text-gray-900 dark:text-white">CRM & Cong viec</h1>
        <p class="text-theme-sm text-gray-500 dark:text-gray-400">
          Quan ly co hoi ban hang, khach hang va cong viec trong mot man hinh.
        </p>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/40">
          <p class="text-theme-xs font-medium text-gray-500">Leads moi</p>
          <p class="mt-2 text-title-xs font-semibold text-brand-500">24</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/40">
          <p class="text-theme-xs font-medium text-gray-500">Cong viec hom nay</p>
          <p class="mt-2 text-title-xs font-semibold text-warning-500">11</p>
        </div>
        <div class="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/40">
          <p class="text-theme-xs font-medium text-gray-500">Deal dang theo doi</p>
          <p class="mt-2 text-title-xs font-semibold text-success-500">8</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
