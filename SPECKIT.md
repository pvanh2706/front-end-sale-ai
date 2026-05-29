# Tài liệu Spec-Driven Development — Sales.AI

Dự án Sales.AI áp dụng phương pháp **Spec-Driven Development (SDD)** — một quy trình phát triển phần mềm trong đó mọi tính năng đều bắt đầu từ một bản đặc tả kỹ thuật được xem xét và phê duyệt trước khi viết code. Khi làm việc với AI assistant như Claude Code, SDD đặc biệt quan trọng vì AI cần context rõ ràng để tạo ra code đúng yêu cầu ngay từ lần đầu, tránh lãng phí thời gian sửa đi sửa lại. Bộ công cụ SDD trong dự án bao gồm hai nhóm: **CLI commands (`specify`)** để quản lý môi trường và quy trình, và **Slash commands (`/speckit.*`)** để đi qua từng bước của vòng đời tính năng từ định nghĩa yêu cầu đến triển khai thực tế.

---

## CLI Commands (specify)

### specify init

#### Mô tả

`specify init` khởi tạo cấu trúc Spec-Driven Development cho một module mới hoặc toàn bộ dự án. Lệnh tạo bộ khung tài liệu đặc tả kỹ thuật giúp AI và team phát triển làm việc theo quy trình có cấu trúc: viết spec trước, code sau.

**Khi nào dùng:**
- Bắt đầu một module CRM, Sales, hay tính năng lớn mới
- Muốn thiết lập quy trình phát triển có tài liệu rõ ràng cho team
- Trước khi giao task phức tạp cho AI (xây dựng Kanban board, Dashboard AI Chat)
- Cần onboard thành viên mới vào module đang phát triển

#### Cú pháp

```bash
# Khởi tạo spec cho toàn bộ dự án
/specify init

# Khởi tạo spec cho một module cụ thể
/specify init --module <tên-module>

# Khởi tạo với template có sẵn
/specify init --template <tên-template>

# Ví dụ thực tế
/specify init --module crm
/specify init --module library
/specify init --module settings
```

#### Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `--module <name>` | Không | Tên module cần khởi tạo spec (vd: `crm`, `library`, `dashboard`). Nếu bỏ qua, khởi tạo spec cho toàn bộ dự án. |
| `--template <name>` | Không | Template spec muốn dùng (vd: `vue-crud`, `kanban`, `dashboard`). Mặc định dùng template chuẩn của dự án. |
| `--dir <path>` | Không | Thư mục đích để tạo file spec. Mặc định: `docs/specs/`. |
| `--force` | Không | Ghi đè spec đã tồn tại nếu có. |

#### Quy trình thực hiện

**Bước 1 — Phân tích dự án hiện tại**

Lệnh đọc `CLAUDE.md` để hiểu stack và cấu trúc dự án, scan thư mục `src/views/`, `src/components/`, `src/stores/` để lấy danh sách module đã có, đọc `src/router/index.ts` để map route → view, và kiểm tra `src/types/` để hiểu data model hiện tại.

**Bước 2 — Tạo thư mục spec**

```
docs/
└── specs/
    └── <module-name>/
        ├── overview.md       ← Tổng quan module, mục tiêu
        ├── data-model.md     ← Các interface/type cần thiết
        ├── ui-spec.md        ← Mô tả màn hình, component
        ├── api-spec.md       ← Endpoints, request/response
        └── tasks.md          ← Danh sách task triển khai
```

**Bước 3 — Sinh nội dung spec từ context**

Dựa trên tên module và template, AI điền sẵn nội dung phù hợp. Ví dụ với `--module crm`: tạo spec cho Lead, Deal, Contact, Pipeline. Spec tuân thủ stack Vue 3 + Pinia + TanStack Query từ `CLAUDE.md`.

**Bước 4 — Tạo file task checklist**

```markdown
## Tasks — CRM Module

- [ ] Tạo types/crm.ts (Lead, Deal, Contact interfaces)
- [ ] Tạo store useLeadStore.ts
- [ ] Tạo view LeadListView.vue với TanStack Table
- [ ] Tạo LeadKanbanBoard.vue với drag-and-drop
- [ ] Thêm routes vào router/index.ts
- [ ] Thêm menu vào AppSidebar.vue
```

**Bước 5 — Tạo CLAUDE.md cục bộ (nếu cần)**

Nếu module đủ phức tạp, tạo thêm `src/views/<Module>/CLAUDE.md` với hướng dẫn riêng.

#### Ví dụ thực tế

**Khởi tạo spec cho module CRM:**

```bash
/specify init --module crm
```

Kết quả tạo ra `docs/specs/crm/` với nội dung phản ánh trạng thái thực tế của các file đang có: `src/views/Crm/`, `src/components/crm/LeadKanbanBoard.vue`, `src/views/Crm/CrmDealsKanbanView.vue`.

**Khởi tạo spec cho module Doc Library:**

```bash
/specify init --module library
```

Tạo spec cho `DocLibraryView.vue` đang phát triển, bao gồm data model từ `src/types/library.ts` và store từ `src/stores/library.ts` đã có sẵn.

#### Lưu ý quan trọng

- Phải có file `CLAUDE.md` ở project root trước khi chạy
- Tên module dùng **kebab-case**: `crm`, `doc-library`, `user-settings`
- Khi spec được tạo cho module đã có code, lệnh sẽ **đọc code hiện tại** và tạo spec phản ánh trạng thái thực tế — không overwrite code đã có
- Sau khi `init` xong, spec là nguồn sự thật duy nhất: mọi thay đổi tính năng đều phải cập nhật spec trước khi code

---

### specify check

#### Mô tả

`specify check` kiểm tra toàn bộ các công cụ, runtime, CLI, và dependencies cần thiết để phát triển dự án Sales.AI đã được cài đặt đúng và hoạt động bình thường chưa.

**Khi nào dùng:**
- Lần đầu clone dự án về máy mới
- Sau khi cài lại hệ điều hành hoặc môi trường phát triển
- Khi gặp lỗi không rõ nguyên nhân và cần kiểm tra môi trường
- Khi onboard thành viên mới vào dự án

#### Cú pháp

```bash
specify check

# Hoặc trong Claude Code CLI
/specify check
```

#### Tham số

| Tham số | Mô tả | Mặc định |
|---|---|---|
| `--verbose` | Hiển thị chi tiết version của từng tool | Tắt |
| `--fix` | Tự động cài tool còn thiếu nếu có thể | Tắt |
| `--json` | Xuất kết quả dạng JSON | Tắt |

#### Quy trình thực hiện

**Bước 1 — Kiểm tra Runtime cốt lõi**

```bash
node --version    # Kỳ vọng: v22.x.x (tối thiểu v18+)
npm --version     # Kỳ vọng: 10.x.x
```

**Bước 2 — Kiểm tra `node_modules`**

Xác nhận `node_modules/` tồn tại và các package quan trọng đã cài: `vue`, `vue-router`, `pinia`, `vite`, `@vitejs/plugin-vue`, `tailwindcss`, `typescript`, `vue-tsc`, `@tanstack/vue-table`, `@tanstack/vue-query`, `vee-validate`, `@vee-validate/zod`, `zod`, `echarts`, `vue-echarts`, `lucide-vue-next`, `vue-sonner`, `prisma`, `@prisma/client`, `socket.io`, `express`.

**Bước 3 — Kiểm tra CLI tools**

- TypeScript compiler: `npx tsc --version`
- Vue TypeScript compiler: `npx vue-tsc --version`
- Vite: `npx vite --version`
- Prisma CLI: `npx prisma --version`
- ESLint: `npx eslint --version`
- Prettier: `npx prettier --version`

**Bước 4 — Kiểm tra file cấu hình**

- `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`
- `src/assets/main.css` (color tokens và custom CSS)
- `.env` / `.env.local` (biến môi trường)
- `prisma/schema.prisma` (schema database)

**Bước 5 — Kiểm tra port availability**

- Port `5174` — Vite dev server (`dev:web`)
- Port `4000` — Express backend (`dev:backend`)

**Bước 6 — Type-check nhanh**

```bash
npx vue-tsc --noEmit
```

#### Ví dụ thực tế

**Kết quả khi tất cả OK:**

```
✓ Node.js v22.3.0
✓ npm 10.8.1
✓ node_modules (486 packages)
✓ TypeScript 5.7.3
✓ vue-tsc 2.2.0
✓ Vite 6.0.11
✓ Prisma 6.17.1
✓ Port 5174 available
✓ Port 4000 available
✓ Type check passed
All checks passed! Run `npm run dev` to start.
```

**Khi thiếu node_modules:**

```
✓ Node.js v22.3.0
✓ npm 10.8.1
✗ node_modules NOT FOUND
  → Run: npm install
Stopped. Fix errors above before continuing.
```

**Khi port bị chiếm:**

```
✗ Port 5174 already in use (PID: 12345)
  → Kill process: Stop-Process -Id 12345 -Force
  → Or change port in package.json dev:web script
```

**Kiểm tra thủ công trên Windows PowerShell:**

```powershell
# Kiểm tra Node
node --version

# Kiểm tra node_modules
if (Test-Path "D:\Dự án CodeOn\Sales.AI\node_modules") {
    Write-Host "node_modules OK"
} else {
    Write-Host "MISSING — run: npm install"
}

# Kiểm tra TypeScript
npx vue-tsc --noEmit

# Kiểm tra port 5174
$proc = Get-NetTCPConnection -LocalPort 5174 -ErrorAction SilentlyContinue
if ($proc) { Write-Host "Port 5174 in use" } else { Write-Host "Port 5174 free" }
```

#### Lưu ý quan trọng

- Dự án chạy **2 server song song**: Vite (port 5174) + Express backend (port 4000) — cả hai phải được kiểm tra
- Scripts `dev` dùng `npm-run-all` (`run-p`) — cần package `npm-run-all2` trong devDependencies
- Prisma cần `npx prisma generate` sau khi cài dependencies lần đầu
- File `.env` có thể chứa biến kết nối database — **không commit lên git**

**Sau khi check thành công:**

```bash
npm run dev          # Chạy cả FE + BE
npm run dev:web      # Chỉ Vite tại http://localhost:5174
npm run dev:backend  # Chỉ Express backend
```

**Nếu cần cài lại toàn bộ:**

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npx prisma generate
```

---

### specify integration

#### Mô tả

`specify integration` khai báo và cấu hình các điểm tích hợp giữa frontend Vue 3 và AI agent backend trong dự án Sales.AI. Lệnh này giúp AI (Claude Code) hiểu rõ cách ứng dụng kết nối với các dịch vụ AI, từ đó sinh ra code, service layer, hoặc type definitions phù hợp với kiến trúc hiện có.

Dự án tích hợp AI agent thông qua hai cơ chế chính:
- **REST API (non-streaming):** Gửi/nhận tin nhắn thông thường qua `POST /chat/conversations/:id/messages`
- **Server-Sent Events / Streaming (NDJSON):** Nhận phản hồi từng phần qua `POST /chat/stream`, sử dụng Fetch API với `ReadableStream`

**Khi nào dùng:**
- Cần thêm endpoint AI mới vào service layer
- Cần cấu hình biến môi trường cho backend AI
- Cần định nghĩa type cho payload/response của AI agent
- Cần debug hoặc thay đổi cách xử lý stream response

#### Cú pháp

```bash
/specify integration
```

Hoặc mô tả bằng ngôn ngữ tự nhiên:

```
Cấu hình tích hợp với AI agent endpoint /v2/chat/stream
Thêm integration mới cho AI gợi ý sản phẩm tại /v1/ai/product-suggest
```

#### Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `endpoint` | Có | URL path của AI agent API (vd: `/v1/chat/stream`) |
| `method` | Có | HTTP method: `GET`, `POST` |
| `responseType` | Có | `json` (full response) hoặc `stream` (SSE/NDJSON) |
| `authRequired` | Không | Có cần Bearer token không (mặc định: `true`) |
| `payload` | Không | Cấu trúc request body (mô tả hoặc interface TypeScript) |

#### Quy trình thực hiện

**Bước 1 — Đọc cấu hình hiện có**

Đọc `src/services/api.ts` (axios instance và interceptors), `src/services/chat.ts` (service layer hiện tại), `src/types/chat.ts` (các type đã có), và `.env.example` (biến môi trường đang dùng).

**Bước 2 — Xác định loại tích hợp**

- Nếu `responseType = json`: dùng helper `get/post` từ `src/services/api.ts`
- Nếu `responseType = stream`: dùng Fetch API trực tiếp + `ReadableStream`

**Bước 3 — Tạo/cập nhật type definitions**

Tạo hoặc cập nhật interface trong `src/types/chat.ts` với `Payload` và `Response` type đầy đủ.

**Bước 4 — Cập nhật service file**

Thêm hàm mới vào `src/services/chat.ts`, đặt endpoint constant ở đầu file, export từ object `chatService` nếu cần.

**Bước 5 — Cập nhật biến môi trường (nếu cần)**

`VITE_API_BASE_URL` là biến chính, dùng bởi cả axios instance và stream URL.

#### Ví dụ thực tế

**Thêm endpoint AI gợi ý (non-streaming):**

```typescript
// src/services/chat.ts
const AI_SUGGESTIONS_ENDPOINT = '/v1/ai/suggestions'

export interface AiSuggestionPayload {
  dealId: string
  context?: string
}

export interface AiSuggestion {
  id: string
  text: string
  confidence: number
}

export function getAiSuggestions(
  payload: AiSuggestionPayload
): Promise<ApiResponse<AiSuggestion[]>> {
  return post<AiSuggestion[]>(AI_SUGGESTIONS_ENDPOINT, payload)
}
```

**Dùng trong component Vue:**

```vue
<script setup lang="ts">
import { getAiSuggestions } from '@/services/chat'
import { useQuery } from '@tanstack/vue-query'

const { data, isLoading } = useQuery({
  queryKey: ['ai-suggestions', dealId],
  queryFn: () => getAiSuggestions({ dealId: dealId.value }),
  enabled: computed(() => !!dealId.value),
})
</script>
```

**Thêm streaming AI response mới:**

```typescript
// src/services/chat.ts
const CHAT_V2_STREAM_ENDPOINT = '/v2/chat/stream'

export interface StreamV2Payload {
  sessionId: string
  message: string
  systemPrompt?: string
}

export async function streamChatV2(
  payload: StreamV2Payload,
  handlers: StreamHandlers,
  signal?: AbortSignal,
): Promise<void> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api'
  const token = localStorage.getItem('token')

  const response = await fetch(`${baseUrl}${CHAT_V2_STREAM_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, application/x-ndjson, application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    signal,
  })

  if (!response.ok || !response.body) {
    throw new Error(`Stream error: ${response.status}`)
  }
  // xử lý ReadableStream tương tự streamChatMessage hiện có
}
```

**Hủy stream khi component unmount:**

```vue
<script setup lang="ts">
const controller = ref<AbortController | null>(null)

async function startStream() {
  controller.value = new AbortController()
  await streamChatMessage(payload, handlers, controller.value.signal)
}

onUnmounted(() => {
  controller.value?.abort()
})
</script>
```

#### Lưu ý quan trọng

- **Axios instance** trong `src/services/api.ts` tự động gắn `Bearer token` từ `localStorage.getItem('token')`
- **Interceptor 401** tự động redirect về `/login` khi token hết hạn
- **Streaming** không dùng axios — phải dùng Fetch API và tự gắn token thủ công
- Luôn truyền `signal?: AbortSignal` vào hàm stream để hỗ trợ cancel request, tránh memory leak
- Dự án hỗ trợ chế độ mock qua biến `VITE_DEALS_USE_MOCK=true` — khi thêm integration mới có thể thêm biến tương tự để test trước khi backend sẵn sàng
- `VITE_API_BASE_URL` phải được set trong `.env` khi chạy local với backend riêng; nếu không set, mặc định là `/api` (proxy qua Vite)

---

### specify workflow

#### Mô tả

`specify workflow` (hay `/workflow`) cho phép định nghĩa và chạy các automation workflow — chuỗi tác vụ tự động hóa được thực hiện tuần tự hoặc song song bởi Claude Code. Thay vì ra lệnh từng bước một, bạn mô tả toàn bộ quy trình và Claude tự thực hiện từ đầu đến cuối.

**Khi nào dùng:**
- Cần thực hiện một chuỗi bước lặp đi lặp lại (tạo trang mới → thêm route → thêm menu → commit)
- Muốn tự động hóa tác vụ phức tạp nhiều file (refactor, migrate, bulk update)
- Cần chạy pipeline build + test + deploy trong một lệnh
- Muốn thiết lập quy trình chuẩn cho team (onboarding, scaffolding)

#### Cú pháp

```bash
/workflow <tên-workflow> [tham số...]

# Hoặc mô tả bằng ngôn ngữ tự nhiên
specify workflow: <mô tả quy trình bạn muốn thực hiện>
```

**Ví dụ:**

```bash
# Tạo trang mới hoàn chỉnh
/workflow new-page --name "BaoCaoDoanhThu" --module "Reports"

# Build và kiểm tra TypeScript
/workflow build-check

# Commit với message tự động
/workflow commit --message "feat: thêm trang báo cáo doanh thu"
```

#### Tham số

| Tham số | Kiểu | Mô tả |
|---|---|---|
| `--name` | string | Tên component/trang/module cần tạo |
| `--module` | string | Tên thư mục module chứa trang (trong `src/views/`) |
| `--path` | string | Đường dẫn route (vd: `/bao-cao/doanh-thu`) |
| `--message` | string | Commit message |
| `--dry-run` | flag | Chỉ hiển thị kế hoạch, không thực sự thực hiện |
| `--skip-menu` | flag | Bỏ qua bước thêm menu vào Sidebar |
| `--skip-commit` | flag | Bỏ qua bước git commit cuối cùng |

#### Quy trình thực hiện

**Bước 1 — Phân tích yêu cầu:** Đọc mô tả workflow, xác định file cần tạo/sửa, kiểm tra cấu trúc dự án hiện tại.

**Bước 2 — Lập kế hoạch:** Liệt kê danh sách tác vụ theo thứ tự, hiển thị plan nếu dùng `--dry-run`.

**Bước 3 — Thực hiện tuần tự:**

1. Tạo/sửa file view trong `src/views/`
2. Cập nhật router trong `src/router/index.ts`
3. Thêm menu item vào `AppSidebar.vue` (**chỉ sửa `<template>`, giữ nguyên `<script setup>`**)
4. Tạo Pinia store nếu cần (`src/stores/`)
5. Tạo type definitions nếu cần (`src/types/`)
6. Chạy `npx vue-tsc --noEmit` để kiểm tra lỗi TypeScript
7. Git commit nếu được yêu cầu

**Bước 4 — Báo cáo kết quả:** Liệt kê file đã tạo/sửa, thông báo lỗi nếu có.

#### Ví dụ thực tế

**Tạo trang CRM mới hoàn chỉnh:**

```
specify workflow: Tạo trang CRM Pipeline mới với:
- Route: /crm/pipeline
- View file: src/views/Crm/CrmPipelineView.vue
- Dùng AdminLayout + PageBreadcrumb
- Thêm menu "Pipeline" vào group CRM trong Sidebar
- Dùng color tokens brand-500, gray-700
```

**Thêm tính năng export Excel vào trang có sẵn:**

```
specify workflow: Thêm chức năng export Excel vào DocLibraryView.vue:
- Import xlsx từ package đã cài
- Thêm nút "Xuất Excel" trong header
- Hàm exportToExcel() export danh sách tài liệu
- Dùng Button component từ @/components/ui/button
```

**Build check trước khi commit:**

```
specify workflow: Kiểm tra và commit code:
1. Chạy npx vue-tsc --noEmit để check TypeScript
2. Nếu không lỗi → git add các file đã sửa
3. Git commit với message "feat(crm): thêm kanban board"
4. Báo cáo kết quả
```

#### Lưu ý quan trọng

- `AppSidebar.vue` — workflow chỉ được sửa `<template>`, **KHÔNG bao giờ xóa hoặc sửa `<script setup>`** (useSidebar, menuGroups, isActive...)
- Mọi file được tạo phải dùng color tokens (`brand-500`, `gray-700`...) thay vì màu Tailwind mặc định
- Luôn thêm `dark:` variant cho tất cả class màu sắc
- Khi workflow thất bại, các file đã tạo trước khi lỗi vẫn được giữ nguyên
- Mô tả workflow càng chi tiết, kết quả càng chính xác
- Dùng `--dry-run` để xem plan trước khi thực hiện thật

---

## Slash Commands (SpecKit)

### /speckit.specify

#### Mô tả

`/speckit.specify` chuyển đổi một yêu cầu tính năng mô tả bằng ngôn ngữ tự nhiên thành một tài liệu requirements có cấu trúc rõ ràng, bao gồm acceptance criteria, user stories, và ràng buộc kỹ thuật phù hợp với dự án.

Đây thường là **bước đầu tiên** trong quy trình SpecKit:

```
/speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
(Định nghĩa)        (Thiết kế)      (Task list)       (Triển khai)
```

**Khi nào dùng:**
- Bắt đầu tính năng mới chưa có đặc tả
- Yêu cầu từ stakeholder còn mơ hồ, cần cụ thể hóa trước khi code
- Muốn đảm bảo AI hiểu đúng scope trước khi sinh code

#### Cú pháp

```
/speckit.specify <mô tả tính năng>
```

**Ví dụ:**

```
/speckit.specify Thêm màn hình quản lý Lead trong CRM
/speckit.specify Trang thống kê doanh số theo tháng, hiển thị biểu đồ và bảng dữ liệu
/speckit.specify Module thư viện tài liệu cho phép upload, tìm kiếm và tải về file
```

#### Quy trình thực hiện

**Bước 1 — Phân tích yêu cầu đầu vào:** Xác định loại tính năng (CRUD, dashboard, form, kanban...), ai là người dùng, phạm vi bao gồm những gì.

**Bước 2 — Đọc context dự án:** Scan `src/views/`, `src/components/`, `src/stores/`, `src/types/` để tránh trùng lặp và hiểu patterns đang dùng.

**Bước 3 — Tạo tài liệu requirements:**

```markdown
# [Tên tính năng] — Requirements

## Tổng quan
...

## User Stories
- Là [vai trò], tôi muốn [hành động] để [mục đích]

## Acceptance Criteria
- [ ] Tiêu chí 1
- [ ] Tiêu chí 2

## Phạm vi kỹ thuật
- Components cần tạo mới
- Stores / Composables liên quan
- API endpoints (nếu có)
- Types / Interfaces cần định nghĩa

## Ngoài phạm vi (Out of scope)
## Phụ thuộc
```

**Bước 4 — Hỏi làm rõ (nếu cần):** Nếu thiếu thông tin quan trọng, Claude đặt 2–3 câu hỏi trước khi tạo spec.

#### Ví dụ thực tế

**Spec cho CRM Lead Management:**

```
/speckit.specify Màn hình quản lý Lead trong CRM với Kanban board, cho phép kéo thả giữa các giai đoạn và xem chi tiết lead
```

Output mẫu:

```markdown
# CRM Lead Management — Requirements

## User Stories
- Là Sales Rep, tôi muốn xem tất cả lead theo giai đoạn để biết trạng thái từng deal.
- Là Sales Rep, tôi muốn kéo thả lead sang giai đoạn khác để cập nhật tiến độ nhanh.
- Là Sales Manager, tôi muốn xem chi tiết một lead để kiểm tra thông tin liên hệ.

## Acceptance Criteria
- [ ] Hiển thị Kanban board với các cột: New → Contacted → Qualified → Proposal → Won/Lost
- [ ] Mỗi card lead hiển thị: tên, công ty, giá trị deal, ngày tạo
- [ ] Kéo thả card giữa các cột, cập nhật trạng thái ngay lập tức (optimistic update)
- [ ] Click vào card mở Sheet/Dialog xem chi tiết lead
- [ ] Có bộ lọc theo assigned user và giai đoạn
- [ ] Responsive trên màn hình desktop (≥1024px)

## Phạm vi kỹ thuật
- View: src/views/Crm/CrmLeadKanbanView.vue
- Component: src/components/crm/LeadKanbanBoard.vue, LeadCard.vue, LeadDetailSheet.vue
- Store: src/stores/crm.ts (Pinia)
- Types: src/types/crm.ts (Lead, LeadStage, KanbanColumn)
- Dùng shadcn-vue Sheet cho panel chi tiết

## Ngoài phạm vi
- Tạo mới / xóa lead (sẽ là tính năng riêng)
- Tích hợp API thật (dùng mock data trước)
```

#### Lưu ý quan trọng

- Spec sinh ra tự động phù hợp với stack: Vue 3 + TypeScript + Tailwind CSS v4 + shadcn-vue
- Màu sắc trong spec tham chiếu đến color tokens của dự án (`brand-500`, `gray-700`...) thay vì màu Tailwind generic
- Nếu tính năng liên quan đến CRM, Claude đọc các file hiện có trong `src/components/crm/` và `src/views/Crm/` trước khi tạo spec để tránh trùng lặp
- **Mẹo có spec chất lượng cao:** Đề cập vai trò người dùng, nêu rõ màn hình liên quan, nêu ràng buộc kỹ thuật nếu có

---

### /speckit.plan

#### Mô tả

`/speckit.plan` lên kế hoạch kỹ thuật chi tiết cho một tính năng, module, hoặc màn hình mới trước khi bắt tay vào code. Skill phân tích yêu cầu, xác định tất cả file cần tạo/sửa, liệt kê dependencies, data types, API endpoints, và tạo checklist thực hiện theo thứ tự ưu tiên.

**Khi nào dùng:**
- Trước khi bắt đầu tính năng phức tạp (Kanban, form validation, bảng dữ liệu...)
- Cần estimate công việc hoặc chia task cho team
- Muốn đảm bảo không bỏ sót file nào cần tạo/sửa
- Triển khai module mới (CRM, DocLibrary, Settings...)

#### Cú pháp

```
/speckit.plan <mô tả tính năng hoặc yêu cầu>
```

**Ví dụ:**

```
/speckit.plan Tạo màn hình quản lý Leads với bảng dữ liệu, filter và dialog thêm/sửa
/speckit.plan Module CRM Deals Kanban Board có drag-and-drop giữa các stage
/speckit.plan Trang cài đặt thành viên với form invite và bảng danh sách thành viên
/speckit.plan Tích hợp thư viện tài liệu: upload, tìm kiếm, phân loại theo thư mục
```

#### Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `<mô tả>` | Có | Mô tả ngắn gọn tính năng cần lên kế hoạch |
| `--scope [view\|component\|store\|full]` | Không | Giới hạn phạm vi kế hoạch (mặc định: `full`) |
| `--output [markdown\|checklist\|tasks]` | Không | Định dạng output (mặc định: `markdown`) |

#### Quy trình thực hiện

**Bước 1 — Phân tích yêu cầu:** Đọc mô tả, xác định loại tính năng, kiểm tra CLAUDE.md để hiểu quy ước dự án.

**Bước 2 — Khảo sát codebase hiện tại:** Scan `src/views/`, `src/components/`, `src/stores/`, `src/types/`, `src/router/index.ts`.

**Bước 3 — Lập danh sách file:**
- **Tạo mới:** Views, Components, Stores, Types, Composables
- **Chỉnh sửa:** Router, Sidebar (menuGroups), AppHeader nếu cần
- **Tham chiếu:** UI components từ `src/components/ui/`

**Bước 4 — Xác định data model và API:** Định nghĩa TypeScript interface, liệt kê API endpoints, xác định queryKey cho TanStack Query.

**Bước 5 — Tạo kế hoạch có cấu trúc:** Tổng quan, cây thư mục file, data types, checklist thực hiện, rủi ro kỹ thuật.

#### Ví dụ thực tế

**Kế hoạch module CRM Deals:**

```
/speckit.plan Module CRM Deals Kanban Board với drag-and-drop và detail view
```

Output mẫu:

```markdown
## Kế hoạch kỹ thuật: CRM Deals Kanban Board

### Files cần tạo mới:
- src/views/Crm/CrmDealsKanbanView.vue
- src/components/crm/DealKanbanCard.vue
- src/components/crm/DealDetailSheet.vue
- src/stores/deals.ts
- src/types/deal.ts

### Files cần chỉnh sửa:
- src/router/index.ts        ← Thêm route /crm/deals
- src/components/layout/AppSidebar.vue  ← Thêm menu item CRM > Deals

### Data Types:
interface Deal {
  id: string
  title: string
  value: number
  stage: 'new' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost'
  assignee: User
  createdAt: string
}

### API Endpoints:
- GET  /deals          → useQuery(['deals'])
- POST /deals          → useMutation
- PUT  /deals/:id      → useMutation
- DELETE /deals/:id    → useMutation

### UI Components cần dùng:
- Sheet (từ @/components/ui/sheet) → Detail drawer
- Badge → Stage label
- Button → Actions
- Dialog → Confirm delete

### Checklist thực hiện:
- [ ] 1. Tạo src/types/deal.ts
- [ ] 2. Tạo src/stores/deals.ts
- [ ] 3. Tạo CrmDealsKanbanView.vue
- [ ] 4. Tạo DealKanbanCard.vue
- [ ] 5. Implement drag-and-drop
- [ ] 6. Tạo DealDetailSheet.vue
- [ ] 7. Thêm route vào router/index.ts
- [ ] 8. Thêm menu vào AppSidebar.vue

### Lưu ý kỹ thuật:
- Drag-and-drop: Xem xét @vueuse/core hoặc native HTML5 DnD API
- Dark mode: Tất cả màu dùng token từ main.css (brand-500, gray-*)
- Không tự tạo mới script logic trong AppSidebar
```

#### Lưu ý quan trọng

- Skill **lên kế hoạch, không tự động tạo file** — dùng `/speckit.implement` để thực thi
- Nếu yêu cầu quá mơ hồ, skill sẽ hỏi thêm thông tin trước khi tạo plan
- Kế hoạch tự động tuân thủ: AdminLayout cho mọi view mới, shadcn-vue components, VeeValidate + Zod cho form, `@tanstack/vue-table` cho bảng
- Với module đã có code một phần (như `src/stores/library.ts` đã tồn tại), kế hoạch sẽ đề xuất **mở rộng** thay vì tạo mới

**Tích hợp với workflow:**
```
/speckit.plan → review plan → /speckit.implement → /verify → commit
```

---

### /speckit.tasks

#### Mô tả

`/speckit.tasks` phân tích một yêu cầu tính năng và tạo ra danh sách task chi tiết theo thứ tự thực hiện, với mỗi task gắn kèm file path cụ thể, component cần dùng, và tag phụ thuộc.

**Khi nào dùng:**
- Bắt đầu implement tính năng mới từ spec
- Muốn có roadmap rõ ràng trước khi code
- Cần chia việc cho nhiều người hoặc nhiều phiên làm việc
- Muốn tránh bỏ sót bước khi implement tính năng phức tạp

#### Cú pháp

```
/speckit.tasks [mô tả tính năng hoặc tên spec]
```

**Ví dụ:**

```
/speckit.tasks Màn hình quản lý Lead CRM với kanban board
/speckit.tasks Tính năng export báo cáo doanh thu theo tháng ra file Excel
/speckit.tasks Thêm module quản lý thư viện tài liệu (DocLibrary)
```

#### Tham số

| Tham số | Mô tả | Ví dụ |
|---|---|---|
| `[feature description]` | Mô tả tính năng bằng ngôn ngữ tự nhiên | `"Màn hình CRM Deals Kanban"` |
| `[spec file path]` | Đường dẫn đến file spec đã có | `"docs/specs/crm-lead.md"` |
| `--module` | Chỉ định module/thư mục đích | `--module CRM` |
| `--depth` | Mức độ chi tiết (shallow/normal/deep) | `--depth deep` |

#### Quy trình thực hiện

**Bước 1 — Phân tích yêu cầu:** Đọc mô tả, xác định loại tính năng, đối chiếu với `src/views/`, `src/components/`, `src/stores/`.

**Bước 2 — Scan codebase liên quan:** Tìm file hiện có liên quan, xác định components/stores có thể tái sử dụng, phát hiện patterns từ CLAUDE.md.

**Bước 3 — Tạo task list theo cấu trúc:**

```
[ ] Task 1: Tạo types/interfaces (src/types/...)
[ ] Task 2: Tạo Pinia store (src/stores/...)
[ ] Task 3: Tạo view chính (src/views/...)
[ ] Task 4: Tạo sub-components (src/components/...)
[ ] Task 5: Thêm route vào router/index.ts
[ ] Task 6: Thêm menu vào AppSidebar.vue
[ ] Task 7: Kết nối API (nếu có)
[ ] Task 8: Kiểm tra dark mode & responsive
```

**Bước 4 — Gắn context cụ thể:** File path cụ thể, tag phụ thuộc (task B cần hoàn thành task A trước), ước lượng độ phức tạp.

#### Ví dụ thực tế

**Task breakdown cho CRM Lead Kanban:**

```
/speckit.tasks Màn hình CRM Lead Kanban với drag-and-drop, lọc theo stage và xem chi tiết lead
```

```markdown
## Task Breakdown: CRM Lead Kanban Board

### Phase 1: Foundation
- [ ] **[Types]** Định nghĩa interface Lead, LeadStage, KanbanColumn trong src/types/crm.ts
- [ ] **[Store]** Tạo src/stores/useCrmLeadStore.ts với state leads[], actions fetchLeads, moveLeadToStage

### Phase 2: Components
- [ ] **[Component]** src/components/crm/LeadKanbanBoard.vue — board chứa các cột
- [ ] **[Component]** src/components/crm/LeadKanbanColumn.vue — một cột stage
- [ ] **[Component]** src/components/crm/LeadCard.vue — card lead draggable
- [ ] **[Component]** src/components/crm/LeadDetailSheet.vue — dùng Sheet từ shadcn-vue

### Phase 3: View & Routing
- [ ] **[View]** src/views/Crm/CrmLeadKanbanView.vue bọc trong AdminLayout
- [ ] **[Router]** Thêm route /crm/leads vào src/router/index.ts
- [ ] **[Sidebar]** Thêm menu item CRM > Leads vào AppSidebar.vue

### Phase 4: Integration
- [ ] **[API]** Kết nối useQuery fetch danh sách leads
- [ ] **[DnD]** Tích hợp drag-and-drop
- [ ] **[Filter]** Thêm filter bar lọc theo stage, assignee

### Phase 5: Polish
- [ ] Kiểm tra dark mode (dark: classes)
- [ ] Kiểm tra responsive mobile
- [ ] Toast notification khi move lead thành công (vue-sonner)
```

**Task breakdown cho DocLibrary (có file sẵn):**

```
/speckit.tasks Thư viện tài liệu: upload, xem, tìm kiếm, phân loại theo folder
```

Vì `src/stores/library.ts`, `src/types/library.ts`, `src/mocks/libraryMock.ts` đã tồn tại, lệnh đánh dấu các task đó là `[UPDATE]` thay vì `[CREATE]`.

#### Lưu ý quan trọng

- `/speckit.tasks` **chỉ lập kế hoạch**, không tự động tạo file — dùng `/speckit.implement` để thực thi
- Khi task list có bước "Thêm menu vào Sidebar", nhớ quy tắc: **chỉ sửa `<template>`, không sửa `<script setup>`** của `AppSidebar.vue`
- Lệnh tự động tuân theo quy tắc CLAUDE.md: AdminLayout, shadcn-vue components, VeeValidate + Zod, màu color tokens
- Nếu tính năng đã được implement một phần, lệnh nhận biết qua scan codebase và đánh dấu `[DONE]` hoặc `[UPDATE]`

---

### /speckit.implement

#### Mô tả

`/speckit.implement` thực thi một task đã được định nghĩa trước trong spec, chuyển đặc tả kỹ thuật thành code thực tế theo đúng kiến trúc và quy ước của dự án Sales.AI.

**Khi nào dùng:**
- Sau khi đã có spec/task được viết ra (thường qua `/speckit.plan` hoặc `/speckit.tasks`)
- Muốn AI tự động sinh code dựa trên mô tả task cụ thể
- Cần implement tính năng mới, component, trang, hoặc store
- Muốn đảm bảo code tuân thủ các quy tắc trong `CLAUDE.md`

#### Cú pháp

```
/speckit.implement [task-id hoặc mô tả task]
```

**Ví dụ:**

```
/speckit.implement "Tạo trang danh sách Lead với bảng, filter và dialog thêm mới"
/speckit.implement TASK-001
/speckit.implement --task "Thêm Pinia store cho module CRM Deals"
```

#### Tham số

| Tham số | Bắt buộc | Mô tả |
|---|---|---|
| `task-id` | Một trong hai | ID của task đã định nghĩa trong spec file |
| `mô tả task` | Một trong hai | Mô tả ngắn gọn task cần implement |
| `--task` | Không | Flag tường minh chỉ định nội dung task |
| `--file` | Không | Chỉ định file spec cụ thể cần đọc |
| `--dry-run` | Không | Chỉ xem kế hoạch, không tạo file |

#### Quy trình thực hiện

**Bước 1 — Đọc context dự án**

Đọc `CLAUDE.md`, `src/router/index.ts` nếu task liên quan đến trang mới, `AppSidebar.vue` nếu cần thêm menu.

**Bước 2 — Phân tích task**

Xác định loại task (trang mới / component / store / API service / type definition), các file cần tạo hoặc chỉnh sửa, và dependencies cần dùng.

**Bước 3 — Thực thi theo chuẩn dự án**

- Tạo view file trong `src/views/TenModule/`, bọc trong `AdminLayout` + `PageBreadcrumb`
- Dùng components từ `src/components/ui/`
- Dùng color token (`brand-500`, `gray-700`...) thay Tailwind generic
- Thêm `dark:` variants cho tất cả class màu nền/chữ
- Định nghĩa TypeScript interface, không dùng `any`
- Thêm route vào `src/router/index.ts`
- Thêm menu vào `AppSidebar.vue` (**chỉ sửa `<template>`, giữ nguyên `<script setup>`**)

**Bước 4 — Báo cáo kết quả**

Liệt kê tất cả file đã tạo/sửa, nêu điểm cần chú ý hoặc TODO chưa hoàn thiện.

#### Ví dụ thực tế

**Tạo trang CRM Lead List:**

```
/speckit.implement "Tạo trang CRM Lead List với bảng hiển thị leads, filter theo status, dialog thêm lead mới có form validation"
```

AI tạo:
- `src/views/Crm/CrmLeadListView.vue` — trang chính với AdminLayout
- `src/types/crm.ts` — interface `Lead`, `LeadStatus`, `CreateLeadDto`
- `src/stores/crm.ts` — Pinia store hoặc TanStack Query hooks
- Cập nhật `src/router/index.ts` — route `/crm/leads`
- Cập nhật `AppSidebar.vue` — menu item CRM > Leads

**Tạo Pinia store cho DocLibrary:**

```
/speckit.implement "Tạo Pinia store cho DocLibrary: quản lý danh sách tài liệu, filter, upload state"
```

AI tạo/sửa:
- `src/stores/library.ts` — store với state, getters, actions
- `src/types/library.ts` — các interface TypeScript

**Thêm dialog tạo thành viên:**

```
/speckit.implement "Thêm dialog tạo thành viên mới vào Settings/CreateMemberSettings.vue với form validation dùng Zod"
```

AI sửa `src/views/Settings/CreateMemberSettings.vue`, thêm `Dialog` + `Form`, `FormField`, `Zod schema`, `useForm` từ vee-validate.

**Implement Kanban Board:**

```
/speckit.implement "Tạo Kanban board cho CRM Deals với drag-and-drop giữa các cột trạng thái"
```

AI tạo `src/views/Crm/CrmDealsKanbanView.vue` và `src/components/crm/LeadKanbanBoard.vue`, dùng `brand-500` cho active state, `gray-300` cho border cột.

#### Lưu ý quan trọng

**Quy tắc bắt buộc:**

- Luôn dùng components từ `src/components/ui/` — không dùng HTML thuần cho form controls
- Màu: `brand-500`, `gray-700`, `success-500`... — **KHÔNG dùng** `blue-500`, `green-500`
- Luôn thêm `dark:` variant cho màu nền và màu chữ
- Mọi trang phải bọc trong `AdminLayout`
- Khi sửa `AppSidebar.vue`: **chỉ sửa `<template>`, KHÔNG sửa `<script setup>`**
- Notification: dùng `toast` từ `vue-sonner`, không dùng `Toast` từ shadcn-vue
- TypeScript: `<script setup lang="ts">`, định nghĩa interface riêng trong `src/types/`, không dùng `any`

**Khi implement không đúng kỳ vọng:** Cung cấp thêm context bằng cách tham chiếu file hiện có ("tham khảo cấu trúc của `CrmDealsKanbanView.vue`"), chỉ định rõ file nào tạo mới/chỉnh sửa, hoặc dùng `--dry-run` để xem kế hoạch trước.

---

## Quy trình làm việc đầy đủ

Phần này mô tả một ví dụ hoàn chỉnh, đưa tính năng **"AI Chat cho CRM Deals"** từ ý tưởng đến code chạy được, sử dụng tất cả 8 command theo đúng thứ tự.

### Giai đoạn 0 — Chuẩn bị môi trường

Trước khi bắt đầu sprint mới, chạy `specify check` để đảm bảo môi trường sẵn sàng:

```bash
specify check
# ✓ Node.js v22.3.0
# ✓ node_modules (486 packages)
# ✓ vue-tsc 2.2.0
# ✓ Port 5174 available
# ✓ Port 4000 available
# All checks passed!
```

Nếu đây là module mới, khởi tạo cấu trúc spec:

```bash
/specify init --module crm
# Tạo docs/specs/crm/overview.md, data-model.md, ui-spec.md, api-spec.md, tasks.md
```

### Giai đoạn 1 — Định nghĩa yêu cầu

Chuyển ý tưởng thành requirements có cấu trúc:

```
/speckit.specify Tích hợp AI Chat vào màn hình CRM Deals — sales rep có thể hỏi AI về deal, nhận gợi ý bước tiếp theo, và xem tóm tắt lịch sử tương tác
```

Claude tạo ra tài liệu requirements gồm User Stories, Acceptance Criteria, và phạm vi kỹ thuật. **Review và chỉnh sửa** tài liệu này trước khi đi tiếp — đây là bước quan trọng nhất của SDD.

### Giai đoạn 2 — Lên kế hoạch kỹ thuật

Sau khi requirements được duyệt:

```
/speckit.plan Tích hợp AI Chat vào CRM Deals: panel chat bên phải màn hình Kanban, streaming response, context-aware về deal hiện tại
```

Claude trả về kế hoạch kỹ thuật đầy đủ:

```markdown
### Files cần tạo mới:
- src/components/crm/DealAiChatPanel.vue   ← Panel chat
- src/services/dealAiChat.ts               ← Service layer (streaming)
- src/types/aiChat.ts                      ← Interfaces

### Files cần chỉnh sửa:
- src/views/Crm/CrmDealsKanbanView.vue     ← Thêm panel bên phải
- src/services/chat.ts                     ← Thêm deal-context streaming fn

### API Endpoints:
- POST /chat/deals/:dealId/stream          ← Streaming response

### Data Types:
interface DealChatMessage { role: 'user' | 'assistant'; content: string; ... }
interface DealChatPayload { dealId: string; message: string; history: DealChatMessage[] }
```

### Giai đoạn 3 — Cấu hình tích hợp AI

Vì tính năng này cần streaming, cấu hình integration endpoint:

```
/specify integration
# endpoint: /chat/deals/stream
# method: POST
# responseType: stream
# payload: { dealId, message, history }
```

Claude cập nhật `src/services/chat.ts` với hàm `streamDealChat()` tuân thủ pattern AbortController đã có trong dự án, tự động gắn Bearer token.

### Giai đoạn 4 — Tạo task breakdown

Chia kế hoạch thành các task cụ thể có thể thực hiện từng bước:

```
/speckit.tasks Tích hợp AI Chat vào CRM Deals panel --depth deep
```

Output:

```markdown
- [ ] [Types] src/types/aiChat.ts — DealChatMessage, DealChatPayload, StreamHandlers
- [ ] [Service] src/services/dealAiChat.ts — streamDealChat(), hỗ trợ AbortController
- [ ] [Component] src/components/crm/DealAiChatPanel.vue
      → Input message + Send button (dùng Input, Button từ @/components/ui/)
      → Message list với role-based styling (brand-50 cho AI, gray-50 cho user)
      → Streaming indicator (animated dots)
      → onUnmounted: controller.abort()
- [ ] [View] Sửa CrmDealsKanbanView.vue — thêm layout 2 cột (Kanban + Chat panel)
- [ ] [Polish] Dark mode, toast khi lỗi stream (vue-sonner)
```

### Giai đoạn 5 — Tự động hóa với workflow

Để thực hiện các task lặp đi lặp lại (tạo file, thêm route, thêm menu):

```
specify workflow: Tạo cấu trúc ban đầu cho AI Chat CRM:
1. Tạo src/types/aiChat.ts với interfaces đã định nghĩa
2. Tạo src/components/crm/DealAiChatPanel.vue với boilerplate chuẩn
3. Kiểm tra TypeScript không lỗi (vue-tsc --noEmit)
4. Báo cáo kết quả
```

### Giai đoạn 6 — Implement từng task

Thực thi các task phức tạp hơn:

```
/speckit.implement "Implement DealAiChatPanel.vue: hiển thị message list với streaming, AbortController cleanup, dùng brand-500 cho send button, dark mode"
```

Claude tạo code đầy đủ cho component, tuân thủ:
- `<script setup lang="ts">` với interface đã định nghĩa
- `Button`, `Input` từ `src/components/ui/`
- Color tokens: `bg-brand-500 hover:bg-brand-600 text-white` cho nút gửi
- `dark:bg-gray-800 dark:text-gray-200` cho message bubbles
- `onUnmounted(() => controller.value?.abort())` để tránh memory leak
- `toast.error('Lỗi kết nối AI')` từ `vue-sonner` khi stream fail

### Giai đoạn 7 — Lặp lại cho các task còn lại

Tiếp tục implement từng task trong checklist:

```
/speckit.implement "Sửa CrmDealsKanbanView.vue: thêm layout 2 cột, tích hợp DealAiChatPanel, toggle hiện/ẩn panel"
```

```
specify workflow: Commit code AI Chat feature:
1. npx vue-tsc --noEmit
2. Nếu pass → git add các file đã sửa
3. git commit -m "feat(crm): tích hợp AI Chat panel vào Deals Kanban"
```

### Tóm tắt thứ tự thực hiện

```
specify check          → Môi trường sẵn sàng
specify init           → Khởi tạo cấu trúc docs/specs/
                         ↓
/speckit.specify       → Requirements document
   [Review & approve]
                         ↓
/speckit.plan          → Kế hoạch kỹ thuật chi tiết
specify integration    → Cấu hình AI/API endpoints
                         ↓
/speckit.tasks         → Task breakdown có thể theo dõi
                         ↓
specify workflow       → Tự động hóa tác vụ lặp lại
/speckit.implement     → Implement từng task phức tạp
                         ↓
specify workflow       → Build check + commit
```

---

## Quick Reference

### Bảng tổng hợp tất cả commands

| Command | Nhóm | Mục đích | Khi nào dùng | Output |
|---|---|---|---|---|
| `specify check` | CLI | Kiểm tra môi trường phát triển | Trước khi bắt đầu làm việc, khi gặp lỗi lạ, onboard member mới | Báo cáo trạng thái tools/dependencies |
| `specify init` | CLI | Khởi tạo cấu trúc spec cho module/dự án | Bắt đầu module mới, thiết lập SDD workflow | Thư mục `docs/specs/<module>/` với 5 file markdown |
| `specify integration` | CLI | Cấu hình tích hợp AI agent endpoint | Thêm API endpoint mới, cấu hình streaming, debug service layer | Cập nhật `src/services/chat.ts`, `src/types/` |
| `specify workflow` | CLI | Chạy chuỗi tác vụ tự động hóa | Tạo trang mới hoàn chỉnh, bulk operations, build + commit pipeline | Files được tạo/sửa, kết quả build |
| `/speckit.specify` | SpecKit | Định nghĩa requirements từ mô tả tự nhiên | Bắt đầu tính năng mới, cụ thể hóa yêu cầu mơ hồ | Tài liệu requirements có User Stories, Acceptance Criteria |
| `/speckit.plan` | SpecKit | Lên kế hoạch kỹ thuật chi tiết | Trước khi implement tính năng phức tạp, estimate công việc | Kế hoạch file, data types, API endpoints, checklist |
| `/speckit.tasks` | SpecKit | Tạo task breakdown có thể theo dõi | Chia nhỏ tính năng thành task rõ ràng, phân công cho team/phiên làm việc | Checklist task theo phase, có tag phụ thuộc |
| `/speckit.implement` | SpecKit | Thực thi task thành code thực tế | Implement component/view/store/service theo spec đã duyệt | Code files tuân thủ CLAUDE.md |

### Quy tắc bất biến khi dùng bất kỳ command nào

| Quy tắc | Đúng | Sai |
|---|---|---|
| Màu sắc | `bg-brand-500`, `text-gray-700`, `border-gray-300` | `bg-blue-500`, `text-gray-700` (tailwind generic) |
| UI Components | `<Button>`, `<Input>`, `<Sheet>` từ `@/components/ui/` | `<button>`, `<input>` HTML thuần |
| Notification | `toast.success()` từ `vue-sonner` | `Toast` component từ shadcn-vue |
| Dark mode | Luôn có `dark:` variant | Chỉ có light mode class |
| TypeScript | `interface Lead { ... }`, không `any` | `const data: any` |
| Layout | Bọc trong `<AdminLayout>` | Content trực tiếp không có layout |
| AppSidebar | Chỉ sửa `<template>`, giữ `<script setup>` | Xóa/sửa `useSidebar()`, `menuGroups`, `isActive` |
| Form | `vee-validate` + `zod` + `FormField` | Validation thủ công bằng `if/else` |

### Thứ tự ưu tiên khi không chắc dùng command nào

1. Chưa biết môi trường ổn chưa → **`specify check`**
2. Bắt đầu module hoàn toàn mới → **`specify init`** → **`/speckit.specify`**
3. Đã có ý tưởng, cần cụ thể hóa → **`/speckit.specify`**
4. Đã có requirements, cần kế hoạch → **`/speckit.plan`**
5. Đã có kế hoạch, cần chia task → **`/speckit.tasks`**
6. Có task cụ thể, cần code → **`/speckit.implement`**
7. Cần làm nhiều bước lặp → **`specify workflow`**
8. Thêm AI endpoint mới → **`specify integration`**