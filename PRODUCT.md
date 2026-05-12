# Salio — Tài liệu sản phẩm

> **Salio** là trợ lý thông minh cho đội ngũ Sales — giúp chốt đơn nhanh hơn và thông minh hơn thông qua AI, CRM tích hợp, và hệ thống quản lý tài liệu thông minh.

---

## Mục lục

1. [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm)
2. [Kiến trúc kỹ thuật](#2-kiến-trúc-kỹ-thuật)
3. [Các module chức năng](#3-các-module-chức-năng)
   - 3.1 [Xác thực (Auth)](#31-xác-thực-auth)
   - 3.2 [CRM & Công việc](#32-crm--công-việc)
   - 3.3 [CRM Deals Kanban](#33-crm-deals-kanban)
   - 3.4 [Chi tiết Deal](#34-chi-tiết-deal)
   - 3.5 [Kiểm tra trùng lặp CRM](#35-kiểm-tra-trùng-lặp-crm)
   - 3.6 [Chat tài liệu AI](#36-chat-tài-liệu-ai)
   - 3.7 [Thư viện tài liệu](#37-thư-viện-tài-liệu)
   - 3.8 [Phân tích sử dụng Chat](#38-phân-tích-sử-dụng-chat)
   - 3.9 [Cài đặt](#39-cài-đặt)
4. [Backend API](#4-backend-api)
5. [Cơ sở dữ liệu](#5-cơ-sở-dữ-liệu)
6. [Realtime & WebSocket](#6-realtime--websocket)
7. [Chạy dự án](#7-chạy-dự-án)

---

## 1. Tổng quan sản phẩm

| Mục | Chi tiết |
|---|---|
| Tên sản phẩm | Salio |
| Đối tượng | Đội ngũ Sales, Sales Manager, Giám đốc kinh doanh |
| Mục tiêu | Tăng tốc chốt đơn, quản lý pipeline deals, tra cứu tài liệu bằng AI |
| Ngôn ngữ giao diện | Tiếng Việt |
| Môi trường | Web app (responsive, hỗ trợ mobile) |

### Tagline

> *"Trí tuệ nhân tạo · Tăng trưởng doanh thu · Tối ưu hóa Sales"*

---

## 2. Kiến trúc kỹ thuật

### Frontend

| Thư viện | Vai trò |
|---|---|
| Vue 3 + TypeScript | Framework chính |
| Tailwind CSS v4 | Styling |
| shadcn-vue (Reka UI) | UI component library |
| Vite | Build tool, dev server (port 5174) |
| Pinia | Client-side state management |
| TanStack Vue Query | Server-state, caching, mutations |
| TanStack Vue Table | Data tables |
| vee-validate + Zod | Form validation |
| vue-echarts + echarts | Biểu đồ |
| vue-sonner | Toast notifications |
| @vueuse/core | Composable utilities |
| lucide-vue-next | Icons |
| Socket.IO client | Realtime |
| xlsx | Export Excel |
| @fullcalendar/vue3 | Calendar |
| vue-flatpickr-component | Date picker |

### Backend

| Thư viện | Vai trò |
|---|---|
| Node.js (ESM) | Runtime |
| Express.js | HTTP server (port 4000) |
| Socket.IO | Realtime events |
| ws (WebSocket) | Library WebSocket |
| Prisma | ORM cho PostgreSQL |
| multer | File upload |
| cors | Cross-origin requests |

### Cơ sở dữ liệu

- **PostgreSQL** (production) — qua Prisma ORM
- **In-memory Map** (fallback) — hoạt động khi DB chưa kết nối

---

## 3. Các module chức năng

### 3.1 Xác thực (Auth)

**Route:** `/login`, `/register`  
**Layout:** `FullScreenLayout` (không có sidebar)

#### Tính năng
- Đăng nhập bằng email + mật khẩu
- Đăng ký tài khoản mới
- Giao diện split: bên trái branding Salio, bên phải form
- Bảo vệ route: redirect về `/login` nếu chưa xác thực
- Redirect về `/crm-work` sau khi đăng nhập

---

### 3.2 CRM & Công việc

**Route:** `/crm-work`  
**API:** `GET /api/v1/crm/dashboard`, `PUT /api/v1/crm/tasks/:taskId`

#### Tính năng
- **KPI Stats** (4 card): Doanh thu tháng, Deals đang xử lý, Tỷ lệ chốt đơn, Thời gian trung bình
- **Pipeline tổng quan**: Bar chart hiển thị số deal theo từng giai đoạn (liên kết sang Kanban)
- **Danh sách công việc hôm nay**: checkbox toggle hoàn thành, thêm công việc mới
- **AI Insights**: Gợi ý hành động từ Salio AI (deal sắp hết hạn, khách cần follow-up...)
- **Lịch công việc tuần**: mini calendar view

---

### 3.3 CRM Deals Kanban

**Route:** `/crm-deals`  
**API:** `GET /api/v1/crm/deals/kanban`, `POST /api/v1/crm/deals`, `GET/PATCH/DELETE /api/deals/:id`

#### Giai đoạn Pipeline (7 cột)

| Stage | Tên hiển thị |
|---|---|
| `new` | Mới |
| `preparing` | Đang chuẩn bị |
| `contacted` | Đã liên hệ |
| `negotiating` | Đàm phán |
| `quoted` | Đã báo giá |
| `won` | Đã chốt |
| `lost` | Thất bại |

#### Tính năng
- **Drag & drop** card giữa các cột (thay đổi stage realtime)
- **Thêm deal mới** — Dialog form với đầy đủ thông tin
- **Sửa / Xóa** deal từ card menu
- **Realtime sync** qua Socket.IO: `deal.created`, `deal.updated`, `deal.deleted`
- **AI Score** badge (0–100) trên mỗi card
- **Tìm kiếm, lọc** theo stage, assignee, pipeline
- **Tổng giá trị** mỗi cột tự động tính toán
- **Optimistic UI** khi drag-drop

#### Trường thông tin Deal

| Trường | Kiểu |
|---|---|
| Tên deal | Text |
| Công ty | Text |
| Liên hệ | Text |
| Giá trị | Tiền (VND) |
| Giai đoạn | Enum |
| Xác suất | % (0–100) |
| Nguồn | inbound / outbound / referral / website... |
| AI Score | Số tự động |
| Tags | Array |
| Ngày dự kiến đóng | Date |
| Người phụ trách | UUID |

---

### 3.4 Chi tiết Deal

**Route:** `/crm-deals/:dealId`  
**API:** `GET /api/deals/:id`, `PATCH /api/deals/:id`, `DELETE /api/deals/:id`

#### Tính năng
- **Stage bar**: Thanh tiến trình 7 bước, click để chuyển stage
- **Thông tin cơ bản**: Tên, mô tả, công ty, liên hệ, giá trị, xác suất, ngày đóng
- **Salio AI Insights**: Đề xuất hành động next-step từ AI
- **Timeline hoạt động**: Toàn bộ lịch sử deal (log tự động + thủ công)
- **Chỉnh sửa inline**: Sửa thông tin deal trực tiếp trên trang
- **Xóa deal**: Soft delete
- **Lịch sử thay đổi stage**: Ghi nhận mỗi lần chuyển giai đoạn

---

### 3.5 Kiểm tra trùng lặp CRM

**Route:** `/crm-duplicate-check`

#### Tính năng
- Phát hiện deals/contacts trùng lặp trong hệ thống
- So sánh theo tên công ty, email, số điện thoại
- Đề xuất merge hoặc giữ riêng

---

### 3.6 Chat tài liệu AI

**Route:** `/chat-tai-lieu/chat`  
**API:** `GET /api/chat/conversations`, `POST /api/chat/stream`, `POST /api/v1/chats/:chatId/context`

#### Tính năng
- **Danh sách cuộc trò chuyện** (sidebar trái)
  - Pin/unpin hội thoại
  - Xóa hội thoại
  - Tìm kiếm
- **Chat với AI** về nội dung tài liệu
  - Streaming response (từng ký tự)
  - Context-aware: AI trả lời dựa trên tài liệu đang chọn
  - Smart response: phân tích keywords (báo giá, email, phân tích, FAQ...)
- **Chọn ngữ cảnh tài liệu**: Gắn folder/file từ thư viện vào cuộc chat
- **Chia sẻ chat** (`ShareChatDialog`): Copy link, nhúng iframe, gửi email
- **Export chat** (`ExportChatDialog`): Xuất PDF / Word / TXT
- **Realtime**: WebSocket `ws://localhost:4000/ws/library?org_id=demo-org`

#### AI Response Intelligence

| Keyword | Loại phản hồi |
|---|---|
| "báo giá", "gia" | Phân tích báo giá chi tiết |
| "email", "gửi" | Soạn email chuyên nghiệp |
| "phân tích", "so sánh" | Phân tích so sánh |
| "faq", "câu hỏi" | Tạo 5 câu hỏi thường gặp |
| Khác | Greeting + gợi ý chọn tài liệu |

---

### 3.7 Thư viện tài liệu

**Route:** `/chat-tai-lieu/library`  
**API:** `GET /api/v1/library/tree`, `POST /api/v1/library/documents`, `POST /api/v1/library/folders`, `DELETE /api/v1/library/nodes/:id`

#### Cấu trúc thư mục

```
📁 Tài liệu công ty         (company)
📁 Tài liệu cá nhân         (personal)
📁 Tài liệu được chia sẻ   (shared)
```

#### Tính năng
- **Tree view** phân cấp folder/file
- **Upload file** (drag & drop hoặc click) — giới hạn theo plan
- **Tạo folder** mới
- **Xóa** file/folder
- **Realtime sync** WebSocket: cập nhật tree khi thành viên khác upload
- **Gắn tài liệu vào chat** làm ngữ cảnh AI

#### Giới hạn theo gói

| Plan | Max file size | Files/upload | Storage |
|---|---|---|---|
| Free / Trial | 25 MB | 5 | 1 GB |
| Standard | 50 MB | 10 | 50 GB |
| Pro | 100 MB | 20 | 500 GB |
| Enterprise | 500 MB | 50 | Không giới hạn |

---

### 3.8 Phân tích sử dụng Chat

**Route:** `/chat-tai-lieu/analytics`  
**API:** `GET /api/v1/chat/dashboard-stats`, `GET /api/v1/chat/ai-suggestions`, `GET /api/v1/chat/popular-questions`

#### Tính năng
- **Dashboard stats**: Tổng số chat, số tài liệu đã chat, số câu hỏi, trung bình phản hồi
- **AI Suggestions**: Tài liệu mới chưa đọc, deal sắp hết hạn, tài liệu trending
- **Câu hỏi phổ biến**: Top câu hỏi được hỏi nhiều nhất
- **Biểu đồ hoạt động**: Lịch sử sử dụng theo thời gian

---

### 3.9 Cài đặt

**Route:** `/settings/*`  
**Layout:** Settings layout với sidebar nav

#### 3.9.1 Giao diện (`/settings/appearance`)
- Chuyển đổi Dark/Light mode
- Chọn màu accent
- Cỡ chữ

#### 3.9.2 Hồ sơ cá nhân (`/settings/profile`)
- Cập nhật tên, email, bio
- Upload/xóa avatar
- **API:** `GET/PATCH /api/v1/profile`, `POST/DELETE /api/v1/profile/avatar`

#### 3.9.3 Thông báo (`/settings/notifications`)
- Bật/tắt từng loại thông báo (email, push, in-app)

#### 3.9.4 Ngôn ngữ & Khu vực (`/settings/language`)
- Chọn ngôn ngữ giao diện
- Múi giờ, định dạng ngày tháng, tiền tệ
- **API:** `GET/PATCH /api/v1/locale`

#### 3.9.5 Bảo mật (`/settings/security`)
- Đổi mật khẩu
- Danh sách phiên đăng nhập hoạt động
- Thu hồi phiên cụ thể hoặc tất cả phiên khác
- **API:** `GET/PATCH /api/v1/security`, `POST /api/v1/security/change-password`, `DELETE /api/v1/security/sessions/:id`

#### 3.9.6 Tích hợp & API (`/settings/api-integration`)

Sub-tabs:
- **API Keys**: Tạo/thu hồi API key, copy key
- **Webhook IN**: Cấu hình URL endpoint nhận sự kiện từ hệ thống ngoài
- **Webhook OUT**: Cấu hình gửi sự kiện Salio ra ngoài (tạo qua Sheet)
  - Field mapping tự động bằng AI (`AI Tự động khớp`)
  - Hỗ trợ nhiều sự kiện: `customer.created`, `deal.updated`...
  - Code example: cURL, Node.js, Python
- **OAuth Apps**: Đang phát triển
- **API Docs**: Tài liệu tích hợp inline

**API endpoint mẫu:**
```
POST https://api.salio.vn/v1/webhook
X-Salio-Token: YOUR_API_KEY
```

#### 3.9.7 Webhook Logs (`/settings/webhook-logs`)
- Danh sách log webhook đã nhận/gửi
- Trạng thái: success / failed / pending
- Xem chi tiết payload
- Retry thủ công
- Trang chi tiết lỗi (No Sidebar)

#### 3.9.8 Phân quyền tài liệu (`/settings/document-permissions`)
- Cấu hình quyền theo **Vai trò hệ thống** (Admin, Sales, Marketing, Kế toán...)
- Cấu hình quyền theo **Chức danh & Phòng ban**
- **Chia sẻ Email**: Chip input, thêm/xóa email trực tiếp
- **Tùy chọn nâng cao AI & Bảo mật**:
  - Watermark động (gắn email người xem lên file)
  - OTP Xác thực (yêu cầu OTP khi mở từ email)
- **Xử lý xung đột quyền**: Chiến lược "Quyền cao nhất" / "Thấp nhất"
- **Panel người có quyền**: Danh sách với nguồn quyền (vai trò / email / chức danh)
- **Timeline lịch sử cấp quyền**
- **API:** `GET/PUT /api/v1/doc-permissions/:docId`, `GET /api/v1/doc-permissions/:docId/holders`

---

## 4. Backend API

### Base URL
```
http://localhost:4000
```

### Xác thực
Header `Authorization: Bearer <token>` (JWT từ localStorage).

### Endpoint tổng hợp

#### Auth & Profile
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/profile` | Lấy thông tin profile |
| PATCH | `/api/v1/profile` | Cập nhật profile |
| POST | `/api/v1/profile/avatar` | Upload avatar |
| DELETE | `/api/v1/profile/avatar` | Xóa avatar |

#### CRM Deals
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/deals` | Danh sách deals (filter, search, paginate) |
| POST | `/api/deals` | Tạo deal mới |
| GET | `/api/deals/:id` | Chi tiết deal |
| PATCH | `/api/deals/:id` | Cập nhật deal |
| PATCH | `/api/deals/:id/stage` | Chuyển giai đoạn |
| DELETE | `/api/deals/:id` | Xóa deal (soft delete) |
| GET | `/api/v1/crm/deals/kanban` | Lấy dữ liệu Kanban nhóm theo stage |
| POST | `/api/v1/crm/deals` | Tạo deal (v1 endpoint) |
| GET | `/api/v1/crm/dashboard` | Dashboard stats CRM |
| PUT | `/api/v1/crm/tasks/:taskId` | Cập nhật task |

#### Chat & AI
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/chat/conversations` | Danh sách conversations |
| GET | `/api/chat/conversations/:id/messages` | Messages của conversation |
| POST | `/api/chat/conversations/:id/messages` | Gửi message |
| POST | `/api/chat/stream` | Chat stream AI |
| GET | `/api/v1/chats` | Danh sách chats |
| POST | `/api/v1/chats/:chatId/pin` | Pin chat |
| POST | `/api/v1/chats/:chatId/delete` | Xóa chat |
| POST | `/api/v1/chats/:chatId/context` | Gắn tài liệu vào chat |
| GET | `/api/v1/chats/:chatId/context` | Lấy context hiện tại |
| GET | `/api/v1/chat/dashboard-stats` | Thống kê dashboard chat |
| GET | `/api/v1/chat/ai-suggestions` | Gợi ý AI |
| GET | `/api/v1/chat/popular-questions` | Câu hỏi phổ biến |

#### Thư viện tài liệu
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/library/tree` | Cây thư mục |
| GET | `/api/v1/library/documents` | Danh sách tài liệu |
| POST | `/api/v1/library/documents` | Upload file |
| POST | `/api/v1/library/folders` | Tạo folder |
| DELETE | `/api/v1/library/nodes/:id` | Xóa node |
| GET | `/api/doc-library/limits` | Giới hạn plan |
| GET | `/api/doc-library/orgs/:orgId/storage` | Dung lượng đã dùng |
| POST | `/api/doc-library/upload` | Upload file (legacy) |
| DELETE | `/api/doc-library/orgs/:orgId/files/:fileId` | Xóa file |

#### Cài đặt
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/locale` | Ngôn ngữ & khu vực |
| PATCH | `/api/v1/locale` | Cập nhật locale |
| GET | `/api/v1/security` | Thông tin bảo mật |
| PATCH | `/api/v1/security` | Cập nhật cài đặt bảo mật |
| POST | `/api/v1/security/change-password` | Đổi mật khẩu |
| DELETE | `/api/v1/security/sessions/:id` | Thu hồi phiên |
| DELETE | `/api/v1/security/sessions` | Thu hồi tất cả phiên |

#### Phân quyền tài liệu
| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/v1/doc-permissions/:docId` | Lấy cấu hình phân quyền |
| PUT | `/api/v1/doc-permissions/:docId` | Lưu cấu hình phân quyền |
| GET | `/api/v1/doc-permissions/:docId/holders` | Danh sách người có quyền |

---

## 5. Cơ sở dữ liệu

**Provider:** PostgreSQL (Prisma ORM)

### Model: Deal
```
id, orgId, title, description, stage (enum), pipelineId,
value (Decimal), currency, probability, source,
contactId, companyId, contactName, companyName,
assigneeId, expectedCloseDate, aiScore, tags[],
lastActivityAt, createdAt, deletedAt, crmId, createdBy
```

### Model: DealActivity
```
id, orgId, dealId, type, title, metadata (JSON),
createdAt, createdBy
```

### Model: AuditLog
```
id, orgId, userId, entity, entityId, action,
metadata (JSON), createdAt
```

### Deal stages (enum)
`new` → `preparing` → `contacted` → `negotiating` → `quoted` → `won` / `lost`

---

## 6. Realtime & WebSocket

### Socket.IO (CRM Realtime)
```
ws://localhost:4000  (Socket.IO)
```

| Event | Hướng | Mô tả |
|---|---|---|
| `deal.created` | Server → Client | Deal mới được tạo |
| `deal.updated` | Server → Client | Deal được cập nhật |
| `deal.deleted` | Server → Client | Deal bị xóa |

### WebSocket thuần (Library)
```
ws://localhost:4000/ws/library?org_id=<orgId>
```

Dùng để đồng bộ realtime cây thư mục khi có thành viên upload/xóa file.

---

## 7. Chạy dự án

### Yêu cầu
- Node.js v18+
- PostgreSQL (tùy chọn — có fallback in-memory)

### Cài đặt & chạy

```bash
# Cài dependencies
npm install

# Chạy toàn bộ (frontend + backend song song)
npm run dev
```

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5174 |
| Backend (Node) | http://localhost:4000 |
| API Base | http://localhost:4000/api |

### Chạy riêng lẻ

```bash
npm run dev:web       # Chỉ frontend (Vite)
npm run dev:backend   # Chỉ backend (Node)
```

### Database (nếu dùng PostgreSQL)

```bash
# Tạo file .env
echo "DATABASE_URL=postgresql://user:password@localhost:5432/salio" > .env

# Generate Prisma client
npm run prisma:generate

# Chạy migrations
npm run prisma:migrate

# Seed dữ liệu mẫu deals
node backend/seed-deals.mjs
```

### Build production

```bash
npm run build
npm run preview
```

---

## Phụ lục: Cấu trúc thư mục

```
src/
├── views/
│   ├── Auth/          ← Đăng nhập, Đăng ký
│   ├── Crm/           ← Dashboard, Kanban, Deal detail, Duplicate check
│   ├── Chat/          ← Chat AI, Dashboard, Analytics, Dialogs
│   ├── DocLibrary/    ← Thư viện tài liệu
│   └── Settings/      ← 8 trang cài đặt
├── components/
│   ├── layout/        ← AdminLayout, AppSidebar, AppHeader
│   ├── ui/            ← shadcn-vue components
│   └── common/        ← Shared components
├── stores/            ← Pinia stores
├── services/          ← API service functions
├── composables/       ← Vue composables
├── types/             ← TypeScript interfaces
├── router/            ← Vue Router config
└── assets/            ← CSS, styles

backend/
├── server.mjs         ← Express app, tất cả API endpoints
├── deals.mjs          ← Business logic CRM Deals
├── prisma.mjs         ← Prisma client singleton
└── seed-deals.mjs     ← Seed dữ liệu mẫu

prisma/
├── schema.prisma      ← Database schema
└── migrations/        ← Migration files
```
