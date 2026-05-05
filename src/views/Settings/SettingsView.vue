<template>
  <AdminLayout>
    <div class="space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Cài đặt</h1>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
          Tùy chỉnh trải nghiệm Salio theo ý bạn.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-theme-xs">
          <nav class="flex flex-col gap-1">
            <RouterLink to="/settings/appearance" class="settings-nav-item">
              <Palette class="h-4 w-4" />
              <span>Giao diện</span>
            </RouterLink>
            <RouterLink to="/settings/profile" class="settings-nav-item">
              <User class="h-4 w-4" />
              <span>Hồ sơ cá nhân</span>
            </RouterLink>
            <RouterLink to="/settings/notifications" class="settings-nav-item">
              <Bell class="h-4 w-4" />
              <span>Thông báo</span>
            </RouterLink>
            <RouterLink to="/settings/language" class="settings-nav-item">
              <Globe class="h-4 w-4" />
              <span>Ngôn ngữ & Khu vực</span>
            </RouterLink>
            <RouterLink to="/settings/security" class="settings-nav-item">
              <ShieldCheck class="h-4 w-4" />
              <span>Bảo mật</span>
            </RouterLink>
          </nav>
        </aside>

        <main class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
          <RouterView />
        </main>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { Bell, Globe, Palette, ShieldCheck, User } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>

<style scoped>
.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 2px solid transparent;
  border-radius: 0.5rem;
  padding: 12px 16px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 200ms ease;
}

.settings-nav-item:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.settings-nav-item.router-link-active {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  font-weight: 500;
  border-left-color: var(--color-primary-600);
}
</style>
