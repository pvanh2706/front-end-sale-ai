# SRS — Hệ thống Phân quyền Tài liệu (Document Permission System)

**Sản phẩm:** Salio  
**Phiên bản tài liệu:** 1.0  
**Ngày:** 16/05/2026  
**Module liên quan:** Chat tài liệu (`/chat-tai-lieu/*`), CRM Pipeline Config

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu này mô tả yêu cầu cho hệ thống phân quyền tài liệu của Salio — kiểm soát ai được phép xem, chỉnh sửa, chia sẻ, tải xuống và xóa tài liệu trong module **Chat tài liệu** và **Thư viện tài liệu**.

### 1.2 Phạm vi

Hệ thống phân quyền áp dụng cho:
- Tài liệu cá nhân và tài liệu công ty trong `DocLibraryView`
- Cuộc hội thoại AI Chat (`ChatView`) được tạo từ tài liệu
- Cấu hình pipeline trong `CrmPipelineConfigView` (tab Phân quyền — hiện là placeholder)
- Chia sẻ tài liệu qua `ShareChatDialog`

### 1.3 Định nghĩa

| Thuật ngữ | Định nghĩa |
|---|---|
| **Tài liệu** | File được upload vào hệ thống (PDF, DOCX, XLSX, PPT v.v.) |
| **Workspace** | Tổ chức/công ty trong Salio (ví dụ: "Salio TechNova") |
| **Vai trò (Role)** | Tập hợp quyền được gán cho người dùng |
| **Phân quyền (Permission)** | Hành động cụ thể được phép thực hiện trên tài liệu |
| **Owner** | Người tạo/upload tài liệu |
| **Collaborator** | Người được chia sẻ quyền trên tài liệu |

---

## 2. Tổng quan hệ thống

### 2.1 Bối cảnh hiện tại

Module Chat tài liệu hiện có:
- Upload tài liệu cá nhân và công ty (`DocLibraryView`)
- Chat AI với tài liệu (`ChatView`)
- Chia sẻ cuộc chat (`ShareChatDialog`)
- `useAuthStore` lưu token + thông tin user cơ bản

### 2.2 Vấn đề cần giải quyết

```
Hiện tại:
  User A upload tài liệu "Hợp đồng bảo mật Q2.pdf"
  → User B cùng workspace đọc được tài liệu này ❌

Mong muốn:
  User A upload → chỉ User A thấy (private)
  User A chia sẻ cho Team Sales → Team Sales xem được ✅
  Admin workspace phân quyền theo từng team và theo từng role
```

### 2.3 Mô hình phân quyền

Hệ thống dùng **RBAC kết hợp ACL**:

```
Workspace
  └── Role (Admin / Manager / Member / Viewer)
        └── Default permissions theo role
              └── Document ACL (override per-document)
                    └── User / Team → Permission set
```

---

## 3. Các vai trò (Actors)

### 3.1 Vai trò hệ thống (System Roles)

| Role | Tên hiển thị | Mô tả |
|---|---|---|
| `workspace_admin` | Quản trị viên | Toàn quyền mọi tài liệu trong workspace |
| `workspace_manager` | Quản lý | Quản lý tài liệu team, không xóa tài liệu người khác |
| `workspace_member` | Thành viên | Tạo tài liệu cá nhân, truy cập tài liệu được chia sẻ |
| `workspace_viewer` | Xem thôi | Chỉ xem tài liệu công khai và tài liệu được chia sẻ cho mình |

### 3.2 Vai trò trên tài liệu (Document Roles)

| Role | Tên hiển thị | Ghi chú |
|---|---|---|
| `doc_owner` | Chủ sở hữu | Tự động gán cho người upload |
| `doc_editor` | Chỉnh sửa | Xem + chỉnh sửa metadata + thêm phiên bản |
| `doc_commenter` | Bình luận | Xem + chat AI + thêm comment |
| `doc_viewer` | Chỉ xem | Xem + tải xuống (nếu được cho phép) |

---

## 4. Yêu cầu chức năng

### 4.1 FR-01: Quản lý vai trò Workspace

#### FR-01.1 — Gán vai trò

**Actor:** `workspace_admin`  
**Trigger:** Mời thành viên hoặc thay đổi vai trò trong Settings

```
Luồng chính:
1. Admin mở Settings → Thành viên
2. Chọn user → "Thay đổi vai trò"
3. Chọn role mới từ dropdown
4. Xác nhận → role được lưu, user nhận notification

Ràng buộc:
- Workspace phải có ít nhất 1 Admin tại mọi thời điểm
- Admin không thể tự hạ cấp mình nếu là Admin duy nhất
```

#### FR-01.2 — Xem danh sách thành viên + vai trò

**Actor:** `workspace_admin`, `workspace_manager`

```
Output: Bảng thành viên gồm: Avatar, Tên, Email, Role badge, Ngày tham gia, Trạng thái
Filter: Theo role, theo trạng thái active/inactive
```

---

### 4.2 FR-02: Phân quyền Tài liệu

#### FR-02.1 — Thiết lập visibility khi upload

**Actor:** Mọi user có quyền upload  
**Trigger:** Upload tài liệu trong `DocLibraryView`

```
Khi upload, user chọn 1 trong 3 mức:

[PRIVATE]   — Chỉ mình tôi thấy (default)
[TEAM]      — Chọn team(s) có quyền truy cập
[WORKSPACE] — Mọi thành viên workspace đều thấy

UI: Radio group + Team selector (hiện khi chọn TEAM)
```

#### FR-02.2 — Chỉnh sửa quyền truy cập sau khi upload

**Actor:** `doc_owner`, `workspace_admin`  
**Trigger:** Click "Quản lý quyền" trong menu context của file

```
Luồng chính:
1. Mở sheet/dialog "Quyền truy cập"
2. Hiển thị: Visibility hiện tại + danh sách người có quyền
3. Thêm người: Nhập email hoặc chọn team → gán role
4. Thay đổi role: Dropdown inline trên mỗi row
5. Thu hồi quyền: Button "Xóa" trên mỗi row
6. Lưu → gọi PATCH /documents/:id/permissions

Ràng buộc:
- Owner không thể thu hồi quyền của chính mình
- Admin workspace có thể override mọi setting
```

#### FR-02.3 — Thừa kế quyền từ Workspace Role

```
Ưu tiên: Document ACL > Workspace Role

Ví dụ:
- User có role workspace_viewer
- Document có ACL: user đó là doc_editor
→ User được EDIT tài liệu đó (ACL thắng)

- User có role workspace_admin
- Document không có ACL entry cho user đó
→ User vẫn có FULL ACCESS (Admin bypass)
```

---

### 4.3 FR-03: Ma trận quyền (Permission Matrix)

#### FR-03.1 — Quyền theo Workspace Role

| Hành động | `workspace_admin` | `workspace_manager` | `workspace_member` | `workspace_viewer` |
|---|:---:|:---:|:---:|:---:|
| Xem tài liệu WORKSPACE | ✅ | ✅ | ✅ | ✅ |
| Xem tài liệu TEAM (trong team) | ✅ | ✅ | ✅ | ✅ |
| Xem tài liệu PRIVATE của người khác | ✅ | ❌ | ❌ | ❌ |
| Upload tài liệu | ✅ | ✅ | ✅ | ❌ |
| Sửa metadata tài liệu (của mình) | ✅ | ✅ | ✅ | ❌ |
| Sửa metadata tài liệu (người khác) | ✅ | ✅ | ❌ | ❌ |
| Xóa tài liệu (của mình) | ✅ | ✅ | ✅ | ❌ |
| Xóa tài liệu (người khác) | ✅ | ❌ | ❌ | ❌ |
| Tải xuống | ✅ | ✅ | ✅* | ✅* |
| Chat AI với tài liệu | ✅ | ✅ | ✅ | ✅ |
| Chia sẻ tài liệu | ✅ | ✅ | ✅* | ❌ |
| Quản lý quyền tài liệu | ✅ | ✅* | ❌ | ❌ |

> `*` = chỉ khi Owner cho phép hoặc có ACL phù hợp

#### FR-03.2 — Quyền theo Document Role (khi có ACL)

| Hành động | `doc_owner` | `doc_editor` | `doc_commenter` | `doc_viewer` |
|---|:---:|:---:|:---:|:---:|
| Xem tài liệu | ✅ | ✅ | ✅ | ✅ |
| Tải xuống | ✅ | ✅ | ✅* | ✅* |
| Chat AI | ✅ | ✅ | ✅ | ✅ |
| Thêm comment | ✅ | ✅ | ✅ | ❌ |
| Sửa metadata | ✅ | ✅ | ❌ | ❌ |
| Upload phiên bản mới | ✅ | ✅ | ❌ | ❌ |
| Chia sẻ | ✅ | ✅* | ❌ | ❌ |
| Quản lý quyền | ✅ | ❌ | ❌ | ❌ |
| Xóa | ✅ | ❌ | ❌ | ❌ |

> `*` = phụ thuộc setting "Cho phép chia sẻ" và "Cho phép tải xuống" do Owner bật/tắt

---

### 4.4 FR-04: Chia sẻ Tài liệu (ShareChatDialog)

#### FR-04.1 — Chia sẻ bằng link

**Actor:** `doc_owner`, `doc_editor` (nếu được phép)

```
Tùy chọn link:
- [Không chia sẻ] — link vô hiệu
- [Xem] — ai có link đọc được, không tải
- [Xem + Tải] — ai có link đọc và tải
- [Xem + Tải + Chat AI] — toàn quyền qua link

Thêm tùy chọn:
- Hết hạn sau: 1 ngày / 7 ngày / 30 ngày / Không hết hạn
- Mật khẩu bảo vệ: [input mật khẩu]
- Giới hạn số lượt truy cập: [số]
```

#### FR-04.2 — Chia sẻ với người dùng cụ thể

```
Luồng:
1. Nhập email hoặc tên → autocomplete từ workspace members
2. Chọn role: Xem / Bình luận / Chỉnh sửa
3. Tuỳ chọn: Gửi email thông báo (toggle + textarea tin nhắn kèm)
4. Confirm → tạo ACL entry + gửi notification
```

#### FR-04.3 — Chia sẻ với Team

```
Luồng:
1. Chọn tab "Team" trong share dialog
2. Chọn team từ danh sách
3. Chọn role cho cả team
4. Confirm → mọi member của team nhận ACL
```

---

### 4.5 FR-05: Kiểm soát Tải xuống

**Actor:** `doc_owner`, `workspace_admin`

```
Cài đặt download trên từng tài liệu:
- [✅] Cho phép tải xuống file gốc
- [✅] Cho phép tải xuống bản đã chú thích
- [❌] Không cho phép tải (chỉ xem/chat online)

Cài đặt watermark:
- [✅] Thêm watermark khi tải (tên user + ngày tải)
```

---

### 4.6 FR-06: Audit Log (Nhật ký truy cập)

#### FR-06.1 — Ghi log tự động

```
Mỗi hành động sau được ghi log:
- Xem tài liệu (user_id, doc_id, timestamp, IP)
- Tải xuống (user_id, doc_id, timestamp, IP)
- Chia sẻ (user_id, doc_id, share_target, role, timestamp)
- Thay đổi quyền (user_id, doc_id, action, old_value, new_value, timestamp)
- Chat AI với tài liệu (user_id, doc_id, timestamp)
- Xóa tài liệu (user_id, doc_id, timestamp)
```

#### FR-06.2 — Xem Audit Log

**Actor:** `workspace_admin`, `doc_owner`

```
UI: Bảng log với filter:
- Theo tài liệu
- Theo user
- Theo loại hành động
- Theo khoảng thời gian

Export: CSV/Excel
```

---

### 4.7 FR-07: Phân quyền trong CRM Pipeline Config

Tab "Phân quyền" trong `CrmPipelineConfigView` (hiện là placeholder) cần:

#### FR-07.1 — Quyền theo Pipeline

```
Ai được xem/thao tác deals trong pipeline này:
- Mọi thành viên workspace
- Chỉ các team được chọn
- Chỉ các cá nhân được gán

Quyền chi tiết theo từng nhóm:
[✅] Xem deals    [✅] Tạo deal    [✅] Chỉnh sửa    [✅] Xóa    [✅] Chuyển stage
```

#### FR-07.2 — Quyền theo Stage

```
Mỗi stage có thể restrict riêng:
- "Ký hợp đồng" stage: chỉ Manager+ mới chuyển vào/ra
- "Closed Won": chỉ Admin xóa
```

---

### 4.8 FR-08: Notification khi chia sẻ

```
Trigger notification:
- Được chia sẻ tài liệu → In-app + Email
- Quyền bị thay đổi → In-app
- Quyền bị thu hồi → In-app + Email
- Link chia sẻ sắp hết hạn (24h trước) → Email
```

---

## 5. Yêu cầu phi chức năng

### 5.1 Bảo mật

| Yêu cầu | Mức độ |
|---|---|
| Mọi API endpoint phân quyền phải có JWT auth | Bắt buộc |
| Kiểm tra permission server-side, không chỉ client | Bắt buộc |
| Audit log không được sửa/xóa bởi user thường | Bắt buộc |
| Watermark download không thể tắt bởi Viewer | Bắt buộc |
| Link chia sẻ dùng token ngẫu nhiên, không đoán được | Bắt buộc |
| Rate limit API chia sẻ | Khuyến nghị |

### 5.2 Hiệu năng

- Kiểm tra quyền `< 50ms` (dùng cache Redis hoặc in-memory)
- Load danh sách ACL tài liệu `< 200ms`
- Không thêm query N+1 khi render bảng tài liệu

### 5.3 UX

- Khi user không có quyền xem một tài liệu → không hiển thị tài liệu (không show "403 Forbidden")
- Khi click vào link chia sẻ hết hạn → hiển thị trang thông báo rõ ràng, không 404
- Permission dialog phải hoạt động trên mobile (sheet, không phải dialog cố định)

---

## 6. Data Model

### 6.1 Bảng chính

```prisma
model Document {
  id                String             @id @default(cuid())
  workspaceId       String
  ownerId           String
  name              String
  mimeType          String
  sizeBytes         Int
  visibility        DocumentVisibility @default(PRIVATE)
  allowDownload     Boolean            @default(true)
  watermarkDownload Boolean            @default(false)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  acls              DocumentAcl[]
  shareLinks        DocumentShareLink[]
  auditLogs         DocumentAuditLog[]
}

enum DocumentVisibility {
  PRIVATE     // chỉ owner
  TEAM        // các team được chỉ định
  WORKSPACE   // mọi người trong workspace
}

model DocumentAcl {
  id          String         @id @default(cuid())
  documentId  String
  granteeType AclGranteeType // USER | TEAM
  granteeId   String
  role        DocumentRole
  grantedBy   String
  grantedAt   DateTime       @default(now())
  expiresAt   DateTime?

  document    Document       @relation(fields: [documentId], references: [id])
}

enum AclGranteeType { USER TEAM }

enum DocumentRole {
  OWNER
  EDITOR
  COMMENTER
  VIEWER
}

model DocumentShareLink {
  id           String              @id @default(cuid())
  documentId   String
  token        String              @unique
  permission   ShareLinkPermission
  passwordHash String?
  maxViews     Int?
  viewCount    Int                 @default(0)
  expiresAt    DateTime?
  createdBy    String
  createdAt    DateTime            @default(now())
}

enum ShareLinkPermission {
  VIEW
  VIEW_DOWNLOAD
  VIEW_DOWNLOAD_CHAT
}

model DocumentAuditLog {
  id         String      @id @default(cuid())
  documentId String
  userId     String
  action     AuditAction
  metadata   Json?
  ipAddress  String?
  createdAt  DateTime    @default(now())
}

enum AuditAction {
  VIEWED
  DOWNLOADED
  SHARED
  PERMISSION_CHANGED
  PERMISSION_REVOKED
  DELETED
  CHATTED
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole
  joinedAt    DateTime      @default(now())
}

enum WorkspaceRole {
  ADMIN
  MANAGER
  MEMBER
  VIEWER
}
```

---

## 7. API Endpoints

### 7.1 Permission Management

```
GET    /api/documents/:id/permissions
       → Lấy ACL list của tài liệu
       → Auth: doc_owner, workspace_admin

POST   /api/documents/:id/permissions
       Body: { granteeType, granteeId, role, expiresAt? }
       → Thêm ACL entry
       → Auth: doc_owner, workspace_admin

PATCH  /api/documents/:id/permissions/:aclId
       Body: { role }
       → Cập nhật role
       → Auth: doc_owner, workspace_admin

DELETE /api/documents/:id/permissions/:aclId
       → Thu hồi quyền
       → Auth: doc_owner, workspace_admin

PATCH  /api/documents/:id/settings
       Body: { visibility, allowDownload, watermarkDownload }
       → Cập nhật settings tài liệu
       → Auth: doc_owner, workspace_admin
```

### 7.2 Share Links

```
POST   /api/documents/:id/share-links
       Body: { permission, passwordHash?, maxViews?, expiresAt? }
       → Tạo link chia sẻ

GET    /api/documents/:id/share-links
       → Danh sách active links

DELETE /api/documents/:id/share-links/:linkId
       → Vô hiệu hóa link

GET    /api/share/:token
       → Truy cập tài liệu qua link (public endpoint, kiểm tra token)
```

### 7.3 Audit Log

```
GET    /api/documents/:id/audit-logs
       Query: ?action=&userId=&from=&to=&page=&limit=
       → Auth: doc_owner, workspace_admin

GET    /api/workspace/audit-logs
       → Toàn bộ log workspace
       → Auth: workspace_admin only
```

### 7.4 Permission Check (Internal)

```
POST   /api/permissions/check
       Body: { documentId, action }
       → { allowed: boolean, reason?: string }
       → Dùng nội bộ để guard UI elements
```

---

## 8. Frontend — Các component cần xây dựng

| Component | Vị trí | Mô tả |
|---|---|---|
| `DocumentPermissionSheet.vue` | `src/components/documents/` | Sheet quản lý ACL của 1 tài liệu |
| `ShareDocumentDialog.vue` | `src/components/documents/` | Dialog chia sẻ link + người dùng |
| `DocumentVisibilityBadge.vue` | `src/components/documents/` | Badge PRIVATE/TEAM/WORKSPACE |
| `AuditLogTable.vue` | `src/components/documents/` | Bảng nhật ký truy cập |
| `PermissionGate.vue` | `src/components/common/` | Wrapper component ẩn/hiện theo permission |
| `useDocumentPermission.ts` | `src/composables/` | Composable kiểm tra quyền client-side |
| `useDocumentPermissions` (store) | `src/stores/` | Pinia store cache ACL |

### 8.1 PermissionGate usage

```vue
<!-- Ẩn nút Xóa nếu không phải owner hoặc admin -->
<PermissionGate :document-id="doc.id" action="delete">
  <Button variant="destructive">Xóa</Button>
</PermissionGate>
```

---

## 9. Luồng người dùng chính (User Flows)

### 9.1 Upload tài liệu bảo mật

```
User (Member) muốn upload hợp đồng chỉ share với team Sales:

1. Vào Thư viện tài liệu → "Upload"
2. Chọn file → Preview metadata
3. Chọn Visibility: [TEAM]
4. Team selector hiện ra → chọn "Nhóm Sales"
5. Upload → tài liệu tạo với ACL: team_sales = VIEWER
6. Chỉ user trong team Sales thấy file này
```

### 9.2 Chia sẻ với đối tác ngoài

```
Manager muốn gửi báo giá cho khách hàng:

1. Tìm file trong Thư viện → "..." → "Chia sẻ"
2. ShareDialog mở → tab "Link chia sẻ"
3. Chọn quyền: [Xem + Tải]
4. Bật: Mật khẩu = "Salio2026"
5. Hết hạn: 7 ngày
6. Copy link → gửi cho khách kèm mật khẩu
7. Khách mở link → nhập mật khẩu → xem + tải file
8. Sau 7 ngày, link tự vô hiệu
```

### 9.3 Admin kiểm tra ai đã xem tài liệu

```
Admin muốn xem ai đã truy cập "Bảng lương Q1.xlsx":

1. Vào Thư viện → tìm file → "..." → "Nhật ký truy cập"
2. AuditLog sheet mở
3. Filter: Action = VIEWED + DOWNLOADED
4. Thấy danh sách: User X xem 3 lần, User Y tải 1 lần
5. Export CSV để báo cáo
```

---

## 10. Ưu tiên phát triển (Phases)

| Phase | Tính năng | Ưu tiên |
|---|---|---|
| **Phase 1** | Visibility (PRIVATE/TEAM/WORKSPACE) khi upload | P0 |
| **Phase 1** | Workspace Role gán qua Settings | P0 |
| **Phase 1** | Server-side permission check trên mọi API | P0 |
| **Phase 2** | DocumentAcl per-user/per-team override | P1 |
| **Phase 2** | Share link với expiry + password | P1 |
| **Phase 2** | PermissionGate component + useDocumentPermission | P1 |
| **Phase 3** | Audit log xem + export | P2 |
| **Phase 3** | Watermark download | P2 |
| **Phase 3** | CRM Pipeline permission (tab đang là placeholder) | P2 |
| **Phase 4** | Notification khi chia sẻ/thu hồi | P3 |
| **Phase 4** | Per-stage permission trong Pipeline | P3 |

