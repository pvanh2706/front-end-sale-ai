<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Tích hợp &amp; API</h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Quản lý các kết nối bên ngoài và cung cấp quyền truy cập hệ thống qua API.
      </p>
    </div>

    <!-- Primary tabs -->
    <div class="flex gap-6 border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in primaryTabs"
        :key="tab.value"
        class="pb-3 text-sm font-medium transition-colors"
        :class="activeTab === tab.value
          ? 'border-b-2 border-brand-500 text-brand-500'
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── KẾT NỐI ĐẾN TAB (Incoming Webhooks) ──────────────────────────────── -->
    <template v-if="activeTab === 'connect'">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
            <Link2 class="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Tổng Webhook active</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.activeWebhooks }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
            <Activity class="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Sự kiện 24h</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.events24h }}</p>
          </div>
        </div>
        <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
            <CheckCircle class="h-5 w-5 text-success-500" />
          </div>
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Tỷ lệ thành công</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ kpi.successRate }}</p>
          </div>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 gap-3">
          <div class="relative flex-1 md:max-w-sm">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input v-model="webhookSearch" class="pl-9" placeholder="Tìm kiếm webhook..." />
          </div>
          <Button variant="outline" class="shrink-0 gap-1.5">
            <Filter class="h-4 w-4" />
            Bộ lọc
          </Button>
        </div>
        <Button class="shrink-0 gap-1.5 bg-brand-500 text-white hover:bg-brand-600" @click="openCreateWebhookDialog">
          <Plus class="h-4 w-4" />
          Tạo webhook mới
        </Button>
      </div>

      <!-- Table + Quick Help -->
      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <!-- Webhook table -->
        <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
          <div class="overflow-x-auto">
            <table class="w-full min-w-[640px] text-left text-sm">
              <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                <tr>
                  <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Tên &amp; Nguồn</th>
                  <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Endpoint</th>
                  <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</th>
                  <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Tỷ lệ thành công</th>
                  <th class="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
                <tr
                  v-for="wh in filteredWebhooks"
                  :key="wh.id"
                  class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/30"
                >
                  <td class="px-5 py-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs font-bold shadow-theme-xs dark:border-gray-700 dark:bg-gray-800"
                        :style="{ color: wh.color }"
                      >
                        {{ wh.abbrev }}
                      </div>
                      <div>
                        <p class="font-semibold text-gray-900 dark:text-white">{{ wh.name }}</p>
                        <p class="text-xs text-gray-500">{{ wh.source }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-4">
                    <code class="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-brand-500 dark:bg-gray-700 dark:text-brand-400">{{ wh.endpoint }}</code>
                  </td>
                  <td class="px-5 py-4">
                    <span
                      class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold"
                      :class="wh.active
                        ? 'bg-success-50 text-success-500 dark:bg-success-500/10'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'"
                    >
                      <span class="h-1.5 w-1.5 rounded-full" :class="wh.active ? 'bg-success-500' : 'bg-gray-400'" />
                      {{ wh.active ? 'Active' : 'Paused' }}
                    </span>
                  </td>
                  <td class="px-5 py-4">
                    <div v-if="wh.successRate !== null" class="flex items-center gap-2">
                      <div class="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div class="h-full rounded-full bg-brand-500" :style="{ width: `${wh.successRate}%` }" />
                      </div>
                      <span class="text-xs font-bold text-gray-900 dark:text-white">{{ wh.successRate }}%</span>
                    </div>
                    <span v-else class="text-xs font-bold text-gray-400">N/A</span>
                  </td>
                  <td class="px-5 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-500 dark:hover:bg-gray-700"
                        @click="editWebhook(wh.id)"
                      >
                        <Pencil class="h-4 w-4" />
                      </button>
                      <button
                        class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-error-500 dark:hover:bg-gray-700"
                        @click="deleteWebhook(wh.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-900/30">
            <p class="text-xs text-gray-500">Hiển thị {{ filteredWebhooks.length }} trên {{ webhooks.length }} kết nối</p>
            <div class="flex gap-1">
              <button class="rounded border border-gray-200 p-1 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                <ChevronLeft class="h-4 w-4 text-gray-500" />
              </button>
              <button class="rounded border border-gray-200 p-1 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                <ChevronRight class="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <!-- Quick Help aside -->
        <aside class="sticky top-6 h-fit space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-4 flex items-center gap-2">
              <div class="rounded-lg bg-brand-50 p-1.5 dark:bg-brand-500/10">
                <Terminal class="h-4 w-4 text-brand-500" />
              </div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Hướng dẫn nhanh</h4>
            </div>
            <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">Sử dụng mã mẫu bên dưới để gửi dữ liệu đến Webhook của bạn.</p>
            <div class="mb-3 flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-900/50">
              <button
                v-for="lang in codeLangs"
                :key="lang.value"
                class="flex-1 rounded-md py-1 text-xs font-medium transition-all"
                :class="codeLang === lang.value
                  ? 'bg-white text-brand-500 shadow-theme-xs dark:bg-gray-700 dark:text-brand-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'"
                @click="codeLang = lang.value"
              >
                {{ lang.label }}
              </button>
            </div>
            <div class="group relative overflow-hidden rounded-lg bg-gray-900 p-4 dark:bg-gray-950">
              <pre class="overflow-x-auto font-mono text-[11px] leading-relaxed text-gray-300">{{ codeSnippets[codeLang] }}</pre>
              <button
                class="absolute right-3 top-3 rounded-md bg-white/10 p-1 text-white opacity-0 transition-opacity hover:bg-white/20 group-hover:opacity-100"
                @click="copySnippet"
              >
                <Copy class="h-3.5 w-3.5" />
              </button>
            </div>
            <div class="mt-4 rounded-lg border border-brand-500/20 bg-brand-50 p-3 dark:bg-brand-500/10">
              <div class="flex gap-2">
                <Info class="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                <p class="text-xs leading-relaxed text-brand-500 dark:text-brand-400">
                  Đảm bảo header <code class="font-mono">X-Salio-Token</code> luôn được gửi kèm để xác thực yêu cầu.
                </p>
              </div>
            </div>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-3 flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 transition-all hover:border-brand-500 dark:border-gray-700"
            >
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">Xem tài liệu đầy đủ</span>
              <ExternalLink class="h-3.5 w-3.5 text-gray-400" />
            </a>
          </div>
          <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 p-4 text-white">
            <div class="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
            <div class="relative z-10 flex items-center gap-2">
              <Sparkles class="h-4 w-4 text-white/80" />
              <p class="text-sm font-bold">Trợ lý Salio AI</p>
            </div>
            <p class="relative z-10 mt-1 text-xs text-white/80">Cần hỗ trợ viết script tích hợp phức tạp? AI của chúng tôi có thể giúp bạn ngay.</p>
            <Button size="sm" class="relative z-10 mt-3 bg-white text-brand-500 hover:bg-brand-50">Chat với AI</Button>
          </div>
        </aside>
      </div>
    </template>

    <!-- ── CUNG CẤP API TAB ──────────────────────────────────────────────────── -->
    <template v-else>

    <!-- Sub-tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="sub in subTabs"
        :key="sub.value"
        class="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
        :class="activeSubTab === sub.value
          ? 'bg-brand-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'"
        @click="activeSubTab = sub.value"
      >
        {{ sub.label }}
      </button>
    </div>

    <!-- ── API Keys sub-tab ──────────────────────────────────────────────────── -->
    <template v-if="activeSubTab === 'api-keys'">
      <!-- Security warning -->
      <div class="flex items-start gap-3 rounded-xl border border-warning-500/30 bg-warning-50 p-4 dark:border-warning-500/20 dark:bg-warning-500/10">
        <AlertTriangle class="mt-0.5 h-5 w-5 shrink-0 text-warning-500" />
        <p class="text-sm text-warning-500 dark:text-warning-400">
          <strong>Bảo mật là ưu tiên hàng đầu:</strong> Khóa API chỉ hiển thị 1 lần duy nhất khi tạo.
          Vui lòng sao chép và lưu trữ chúng ở nơi an toàn. Chúng tôi không thể hiển thị lại khóa này vì lý do bảo mật.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_280px]">
        <div class="space-y-6">
          <!-- API Keys table -->
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div class="flex flex-col gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
              <div>
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Danh sách API Keys</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Quản lý các khóa định danh để truy cập Salio API.</p>
              </div>
              <Button class="shrink-0 gap-1.5 bg-brand-500 text-white hover:bg-brand-600" size="sm" @click="openCreateKeyDialog">
                <Plus class="h-4 w-4" />
                Tạo API Key mới
              </Button>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full min-w-[700px] text-left text-sm">
                <thead class="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
                  <tr>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Tên key</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Key (Masked)</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Quyền</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Rate Limit</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Ngày tạo</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Lần dùng cuối</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Trạng thái</th>
                    <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-500">Hành động</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700/60">
                  <tr
                    v-for="key in apiKeys"
                    :key="key.id"
                    class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/30"
                  >
                    <td class="px-5 py-3 font-medium text-gray-900 dark:text-white">{{ key.name }}</td>
                    <td class="px-5 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{{ key.masked }}</td>
                    <td class="px-5 py-3">
                      <Badge
                        class="text-[10px] font-bold uppercase"
                        :class="key.permission === 'Admin'
                          ? 'bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
                      >
                        {{ key.permission }}
                      </Badge>
                    </td>
                    <td class="px-5 py-3 text-gray-500 dark:text-gray-400">{{ key.rateLimit }}</td>
                    <td class="px-5 py-3 text-gray-500 dark:text-gray-400">{{ key.createdAt }}</td>
                    <td class="px-5 py-3 text-gray-500 dark:text-gray-400">{{ key.lastUsed }}</td>
                    <td class="px-5 py-3">
                      <span
                        class="flex items-center gap-1.5 text-xs font-medium"
                        :class="key.active ? 'text-success-500' : 'text-gray-400'"
                      >
                        <span class="h-2 w-2 rounded-full" :class="key.active ? 'bg-success-500' : 'bg-gray-300'" />
                        {{ key.active ? 'Hoạt động' : 'Tạm dừng' }}
                      </span>
                    </td>
                    <td class="px-5 py-3">
                      <div class="flex items-center gap-3">
                        <button
                          class="text-gray-400 transition-colors hover:text-brand-500"
                          title="Rotate Key"
                          @click="rotateKey(key.id)"
                        >
                          <RefreshCw class="h-4 w-4" />
                        </button>
                        <button
                          class="text-gray-400 transition-colors hover:text-error-500"
                          title="Revoke Key"
                          @click="revokeKey(key.id)"
                        >
                          <Ban class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Developer portal cards -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <!-- Base URL -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div class="mb-3 flex items-center gap-2">
                <Link2 class="h-4 w-4 text-brand-500" />
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">API Base URL</h4>
              </div>
              <code class="mb-3 block rounded-lg border border-gray-200 bg-white px-3 py-2 font-mono text-xs text-brand-500 dark:border-gray-700 dark:bg-gray-800">
                https://api.salio.ai/v1
              </code>
              <button
                class="flex items-center gap-1 text-xs text-brand-500 hover:underline dark:text-brand-400"
                @click="copyBaseUrl"
              >
                <Copy class="h-3.5 w-3.5" />
                Sao chép URL
              </button>
            </div>

            <!-- Swagger / OpenAPI -->
            <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <div class="mb-3 flex items-center gap-2">
                <BookOpen class="h-4 w-4 text-brand-500" />
                <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Swagger / OpenAPI</h4>
              </div>
              <p class="mb-4 text-xs text-gray-500 dark:text-gray-400">
                Khám phá chi tiết các endpoints, tham số và dữ liệu trả về.
              </p>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-1 text-xs text-brand-500 hover:underline dark:text-brand-400"
              >
                <ExternalLink class="h-3.5 w-3.5" />
                Mở Documentation
              </a>
            </div>

            <!-- Code example -->
            <div class="relative overflow-hidden rounded-xl bg-gray-900 p-4 dark:bg-gray-950">
              <div class="mb-3 flex items-center gap-2">
                <Code2 class="h-4 w-4 text-brand-300" />
                <h4 class="text-sm font-semibold text-white">Ví dụ Node.js</h4>
              </div>
              <pre class="overflow-x-auto font-mono text-[11px] leading-relaxed text-gray-300">const salio = require('salio-sdk');
const client = salio.init('YOUR_API_KEY');

await client.leads.create({
  name: 'John Doe',
  email: 'john@example.com'
});</pre>
              <Code2 class="absolute -bottom-3 -right-3 h-20 w-20 text-white/5" />
            </div>
          </div>
        </div>

        <!-- Quick Help aside -->
        <aside class="space-y-4">
          <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div class="mb-4 flex items-center gap-2">
              <div class="rounded-lg bg-brand-50 p-1.5 dark:bg-brand-500/10">
                <Lightbulb class="h-4 w-4 text-brand-500" />
              </div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Trợ giúp nhanh</h4>
            </div>
            <ul class="space-y-4">
              <li
                v-for="help in quickHelp"
                :key="help.title"
                class="group flex cursor-pointer gap-3"
              >
                <component :is="help.icon" class="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-brand-500" />
                <div>
                  <p class="text-xs font-semibold text-gray-900 transition-colors group-hover:text-brand-500 dark:text-white dark:group-hover:text-brand-400">
                    {{ help.title }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ help.desc }}</p>
                </div>
              </li>
            </ul>
            <Button variant="outline" size="sm" class="mt-4 w-full text-xs">
              Xem tất cả tài liệu
            </Button>
          </div>

          <!-- Developer support CTA -->
          <div class="relative overflow-hidden rounded-xl bg-brand-500 p-4 text-white">
            <div class="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
            <h4 class="relative z-10 text-sm font-bold">Hỗ trợ Nhà phát triển</h4>
            <p class="relative z-10 mt-1 text-xs text-white/80">
              Tham gia cộng đồng và nhận trợ giúp từ đội ngũ kỹ thuật của chúng tôi.
            </p>
            <Button
              size="sm"
              class="relative z-10 mt-3 bg-white text-brand-500 hover:bg-brand-50"
              @click="joinSlack"
            >
              Tham gia Slack
            </Button>
          </div>
        </aside>
      </div>
    </template>

    <!-- ── Outgoing Webhooks sub-tab ────────────────────────────────────────── -->
    <template v-else-if="activeSubTab === 'webhooks'">
      <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/30">
        <Webhook class="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Outgoing Webhooks đang được phát triển</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Bạn sẽ sớm có thể đăng ký các sự kiện gửi ra ngoài hệ thống.</p>
      </div>
    </template>

    <!-- ── OAuth Apps sub-tab ───────────────────────────────────────────────── -->
    <template v-else-if="activeSubTab === 'oauth'">
      <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/30">
        <Lock class="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">OAuth Apps đang được phát triển</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Cho phép ứng dụng bên thứ ba kết nối với tài khoản Salio của bạn.</p>
      </div>
    </template>

    <!-- ── API Docs sub-tab ─────────────────────────────────────────────────── -->
    <template v-else-if="activeSubTab === 'docs'">
      <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/30">
        <FileText class="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Tài liệu API</p>
        <p class="mt-1 mb-4 text-xs text-gray-500 dark:text-gray-400">Tài liệu đầy đủ cho tất cả các endpoints và SDK.</p>
        <a href="#" target="_blank" rel="noopener noreferrer">
          <Button class="gap-1.5 bg-brand-500 text-white hover:bg-brand-600" size="sm">
            <ExternalLink class="h-4 w-4" />
            Mở Swagger / OpenAPI
          </Button>
        </a>
      </div>
    </template>

    </template>

    <!-- ── Create API Key Dialog ───────────────────────────────────────────── -->
    <Dialog :open="showCreateDialog" @update:open="showCreateDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Tạo API Key mới</DialogTitle>
          <DialogDescription class="text-gray-500 dark:text-gray-400">
            Điền thông tin để tạo khóa API. Khóa chỉ hiển thị một lần — hãy lưu lại ngay.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <Label for="key-name">Tên key <span class="text-error-500">*</span></Label>
            <Input id="key-name" v-model="newKeyForm.name" placeholder="VD: Production Server" />
          </div>
          <div class="space-y-1.5">
            <Label>Quyền truy cập</Label>
            <Select v-model="newKeyForm.permission">
              <SelectTrigger><SelectValue placeholder="Chọn quyền" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin — Toàn quyền</SelectItem>
                <SelectItem value="Read-only">Read-only — Chỉ đọc</SelectItem>
                <SelectItem value="Write-only">Write-only — Chỉ ghi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-1.5">
            <Label>Rate Limit</Label>
            <Select v-model="newKeyForm.rateLimit">
              <SelectTrigger><SelectValue placeholder="Chọn giới hạn" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="100 req/min">100 req/min</SelectItem>
                <SelectItem value="500 req/min">500 req/min</SelectItem>
                <SelectItem value="1000 req/min">1000 req/min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Newly created key display -->
          <div v-if="createdKey" class="rounded-lg border border-success-500/30 bg-success-50 p-3 dark:bg-success-500/10">
            <p class="mb-1 text-xs font-semibold text-success-500">Khóa của bạn (sao chép ngay!):</p>
            <div class="flex items-center gap-2">
              <code class="flex-1 overflow-x-auto font-mono text-xs text-gray-900 dark:text-white">{{ createdKey }}</code>
              <button class="text-brand-500 hover:text-brand-600" @click="copyKey(createdKey)">
                <Copy class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="closeCreateDialog">{{ createdKey ? 'Đóng' : 'Hủy' }}</Button>
          <Button
            v-if="!createdKey"
            class="bg-brand-500 text-white hover:bg-brand-600"
            :disabled="!newKeyForm.name.trim()"
            @click="submitCreateKey"
          >
            Tạo Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ── Create Webhook Dialog ────────────────────────────────────────────── -->
    <Dialog :open="showCreateWebhookDialog" @update:open="showCreateWebhookDialog = $event">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-gray-900 dark:text-white">Tạo Webhook mới</DialogTitle>
          <DialogDescription class="text-gray-500 dark:text-gray-400">
            Cấu hình endpoint nhận dữ liệu từ hệ thống bên ngoài.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-2">
          <div class="space-y-1.5">
            <Label for="wh-name">Tên webhook <span class="text-error-500">*</span></Label>
            <Input id="wh-name" v-model="newWebhookForm.name" placeholder="VD: HubSpot CRM Sync" />
          </div>
          <div class="space-y-1.5">
            <Label for="wh-source">Nguồn / Ứng dụng</Label>
            <Input id="wh-source" v-model="newWebhookForm.source" placeholder="VD: Contacts, Deals" />
          </div>
          <div class="space-y-1.5">
            <Label for="wh-endpoint">Endpoint path <span class="text-error-500">*</span></Label>
            <div class="flex items-center gap-2">
              <span class="shrink-0 text-xs text-gray-500">/api/v1/</span>
              <Input id="wh-endpoint" v-model="newWebhookForm.endpoint" placeholder="your-path" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCreateWebhookDialog = false">Hủy</Button>
          <Button
            class="bg-brand-500 text-white hover:bg-brand-600"
            :disabled="!newWebhookForm.name.trim() || !newWebhookForm.endpoint.trim()"
            @click="submitCreateWebhook"
          >
            Tạo Webhook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Activity,
  AlertTriangle,
  Ban,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Lightbulb,
  Link2,
  Lock,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Webhook,
  Zap,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CreateOutgoingWebhookSheet from '@/views/Settings/CreateOutgoingWebhookSheet.vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'vue-sonner'

// ── Types ─────────────────────────────────────────────────────────────────────

interface IncomingWebhook {
  id: string
  name: string
  source: string
  abbrev: string
  color: string
  endpoint: string
  active: boolean
  successRate: number | null
}

interface ApiKey {
  id: string
  name: string
  masked: string
  permission: string
  rateLimit: string
  createdAt: string
  lastUsed: string
  active: boolean
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const primaryTabs = [
  { label: 'Kết nối đến', value: 'connect' },
  { label: 'Cung cấp API', value: 'provide' },
]

const subTabs = [
  { label: 'API Keys', value: 'api-keys' },
  { label: 'Outgoing Webhooks', value: 'webhooks' },
  { label: 'OAuth Apps', value: 'oauth' },
  { label: 'Tài liệu API', value: 'docs' },
]

const activeTab = ref<'connect' | 'provide'>('connect')
const activeSubTab = ref('api-keys')

// ── Data ──────────────────────────────────────────────────────────────────────

const kpi = ref({ activeWebhooks: 12, events24h: '1,240', successRate: '99.8%' })

const webhooks = ref<IncomingWebhook[]>([
  {
    id: 'wh-1',
    name: 'HubSpot CRM Sync',
    source: 'Contacts, Deals',
    abbrev: 'HUB',
    color: '#ff7a59',
    endpoint: '/api/v1/hubspot/webhook',
    active: true,
    successRate: 100,
  },
  {
    id: 'wh-2',
    name: 'Salesforce Leads',
    source: 'Lead Conversion',
    abbrev: 'SF',
    color: '#00a1e0',
    endpoint: '/api/v1/sf/inbound',
    active: true,
    successRate: 98.5,
  },
  {
    id: 'wh-3',
    name: 'Custom E-commerce',
    source: 'Order Updates',
    abbrev: 'SHP',
    color: '#96bf48',
    endpoint: '/api/v1/shop/orders',
    active: false,
    successRate: null,
  },
  {
    id: 'wh-4',
    name: 'Zalo OA Chatbot',
    source: 'Incoming Messages',
    abbrev: 'ZLO',
    color: '#0068ff',
    endpoint: '/api/v1/zalo/webhook',
    active: true,
    successRate: 99.9,
  },
])

const webhookSearch = ref('')

const filteredWebhooks = computed(() => {
  const q = webhookSearch.value.toLowerCase().trim()
  if (!q) return webhooks.value
  return webhooks.value.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.source.toLowerCase().includes(q) ||
      w.endpoint.toLowerCase().includes(q),
  )
})

const codeLangs = [
  { label: 'cURL', value: 'curl' },
  { label: 'Node.js', value: 'node' },
  { label: 'Python', value: 'python' },
]

const codeLang = ref<'curl' | 'node' | 'python'>('curl')

const codeSnippets: Record<string, string> = {
  curl: `curl -X POST https://api.salio.vn/v1/webhook \\\n-H "Content-Type: application/json" \\\n-H "X-Salio-Token: YOUR_API_KEY" \\\n-d '{
  "event": "customer.created",
  "data": {
    "name": "Nguyen Van A",
    "email": "ana@example.com"
  }
}'`,
  node: `const axios = require('axios');

await axios.post('https://api.salio.vn/v1/webhook', {
  event: 'customer.created',
  data: { name: 'Nguyen Van A', email: 'ana@example.com' }
}, {
  headers: {
    'Content-Type': 'application/json',
    'X-Salio-Token': 'YOUR_API_KEY'
  }
});`,
  python: `import requests

requests.post(
  'https://api.salio.vn/v1/webhook',
  json={
    'event': 'customer.created',
    'data': {'name': 'Nguyen Van A', 'email': 'ana@example.com'}
  },
  headers={
    'Content-Type': 'application/json',
    'X-Salio-Token': 'YOUR_API_KEY'
  }
)`,
}

const apiKeys = ref<ApiKey[]>([
  {
    id: 'key-1',
    name: 'Production Server',
    masked: 'sk_live_•••••••••4a82',
    permission: 'Admin',
    rateLimit: '1000 req/min',
    createdAt: '12/10/2023',
    lastUsed: '2 giờ trước',
    active: true,
  },
  {
    id: 'key-2',
    name: 'Dev Environment',
    masked: 'sk_test_•••••••••9f12',
    permission: 'Read-only',
    rateLimit: '100 req/min',
    createdAt: '05/11/2023',
    lastUsed: 'Chưa dùng',
    active: false,
  },
])

const quickHelp = [
  { icon: HelpCircle, title: 'Xác thực API là gì?', desc: 'Cách sử dụng Bearer Token để xác thực yêu cầu.' },
  { icon: Zap, title: 'Giới hạn Rate Limit', desc: 'Tìm hiểu về các ngưỡng giới hạn theo gói dịch vụ.' },
  { icon: ShieldCheck, title: 'Bảo mật Webhooks', desc: 'Sử dụng chữ ký số để xác minh dữ liệu từ Salio.' },
]

// ── Outgoing Webhooks ──────────────────────────────────────────────────────────────

interface OutgoingWebhook {
  id: string
  name: string
  url: string
  method: string
  active: boolean
  events: string[]
}

const showOutgoingWebhookSheet = ref(false)
const outgoingWebhooks = ref<OutgoingWebhook[]>([])

function onOutgoingWebhookCreated(webhook: OutgoingWebhook): void {
  outgoingWebhooks.value.unshift(webhook)
}

function removeOutgoingWebhook(id: string): void {
  const idx = outgoingWebhooks.value.findIndex((w) => w.id === id)
  if (idx !== -1) outgoingWebhooks.value.splice(idx, 1)
}

// ── Webhook CRUD ──────────────────────────────────────────────────────────────

const showCreateWebhookDialog = ref(false)
const newWebhookForm = ref({ name: '', source: '', endpoint: '' })

function openCreateWebhookDialog(): void {
  newWebhookForm.value = { name: '', source: '', endpoint: '' }
  showCreateWebhookDialog.value = true
}

function submitCreateWebhook(): void {
  const { name, source, endpoint } = newWebhookForm.value
  if (!name.trim() || !endpoint.trim()) return
  const abbrev = name.slice(0, 3).toUpperCase()
  webhooks.value.unshift({
    id: `wh-${Date.now()}`,
    name: name.trim(),
    source: source.trim() || 'Custom',
    abbrev,
    color: '#465fff',
    endpoint: `/api/v1/${endpoint.trim().replace(/^\//, '')}`,
    active: true,
    successRate: null,
  })
  kpi.value.activeWebhooks += 1
  showCreateWebhookDialog.value = false
  toast.success(`Đã tạo webhook "${name}"`)
}

function editWebhook(id: string): void {
  const wh = webhooks.value.find((w) => w.id === id)
  if (!wh) return
  toast(`Chỉnh sửa webhook "${wh.name}"`)
}

function deleteWebhook(id: string): void {
  const idx = webhooks.value.findIndex((w) => w.id === id)
  if (idx === -1) return
  const name = webhooks.value[idx].name
  webhooks.value.splice(idx, 1)
  toast.success(`Đã xóa webhook "${name}"`)
}

function copySnippet(): void {
  void navigator.clipboard.writeText(codeSnippets[codeLang.value])
  toast.success('Đã sao chép code snippet')
}

// ── Create dialog ─────────────────────────────────────────────────────────────

const showCreateDialog = ref(false)
const createdKey = ref<string | null>(null)

const newKeyForm = ref({
  name: '',
  permission: 'Read-only',
  rateLimit: '100 req/min',
})

function openCreateKeyDialog(): void {
  newKeyForm.value = { name: '', permission: 'Read-only', rateLimit: '100 req/min' }
  createdKey.value = null
  showCreateDialog.value = true
}

function closeCreateDialog(): void {
  showCreateDialog.value = false
  createdKey.value = null
}

function generateKey(prefix: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const rand = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${prefix}_${rand}`
}

function submitCreateKey(): void {
  const name = newKeyForm.value.name.trim()
  if (!name) return

  const isLive = newKeyForm.value.permission === 'Admin'
  const rawKey = generateKey(isLive ? 'sk_live' : 'sk_test')
  const last4 = rawKey.slice(-4)

  apiKeys.value.unshift({
    id: `key-${Date.now()}`,
    name,
    masked: `${rawKey.slice(0, 8)}•••••••••${last4}`,
    permission: newKeyForm.value.permission,
    rateLimit: newKeyForm.value.rateLimit,
    createdAt: new Date().toLocaleDateString('vi-VN'),
    lastUsed: 'Chưa dùng',
    active: true,
  })

  createdKey.value = rawKey
}

// ── Actions ───────────────────────────────────────────────────────────────────

function rotateKey(keyId: string): void {
  const key = apiKeys.value.find((k) => k.id === keyId)
  if (!key) return
  toast.success(`Đã tạo lại key cho "${key.name}"`)
}

function revokeKey(keyId: string): void {
  const key = apiKeys.value.find((k) => k.id === keyId)
  if (!key) return
  key.active = false
  toast.success(`Đã thu hồi key "${key.name}"`)
}

function copyBaseUrl(): void {
  void navigator.clipboard.writeText('https://api.salio.ai/v1')
  toast.success('Đã sao chép Base URL')
}

function copyKey(key: string): void {
  void navigator.clipboard.writeText(key)
  toast.success('Đã sao chép API key')
}

function joinSlack(): void {
  toast('Đang mở Slack Developer Community...')
}
</script>
