<template>
  <AdminLayout>
    <div class="settings-page space-y-6">
      <header class="flex items-start gap-3">
        <RouterLink
          to="/chat"
          class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] shadow-theme-xs transition hover:bg-[var(--color-primary-50)] hover:text-[var(--color-primary-700)]"
          title="Quay lại"
        >
          <ChevronLeft class="h-4 w-4" />
        </RouterLink>
        <div>
          <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">Cài đặt</h1>
          <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
            Tùy chỉnh trải nghiệm Salio theo ý bạn.
          </p>
        </div>
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
            <RouterLink to="/settings/api-integration" class="settings-nav-item">
              <Plug class="h-4 w-4" />
              <span>Tích hợp &amp; API</span>
            </RouterLink>
            <RouterLink to="/settings/webhook-logs" class="settings-nav-item">
              <FileWarning class="h-4 w-4" />
              <span>Webhook Logs</span>
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
import { Bell, ChevronLeft, FileWarning, Globe, Palette, Plug, ShieldCheck, User } from 'lucide-vue-next'
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

:global(.dark) .settings-page {
  --color-text-primary: #ffffff;
  --color-text-secondary: #f4f7ff;
  --color-text-tertiary: #e5ecff;
}

:global(.dark) .settings-page .settings-nav-item {
  color: #f4f7ff;
}

:global(.dark) .settings-page .settings-nav-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

:global(.dark) .settings-page .settings-nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  border-left-color: rgba(255, 255, 255, 0.68);
}
</style>
