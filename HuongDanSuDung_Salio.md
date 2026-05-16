# Hướng dẫn sử dụng Salio

**Phiên bản:** 1.0  
**Ngày cập nhật:** 16/05/2026  
**Đối tượng:** Người dùng cuối (Sales, Manager, Admin)

---

## Mục lục

1. [Tổng quan về Salio](#1-tổng-quan-về-salio)
2. [Đăng nhập và bắt đầu](#2-đăng-nhập-và-bắt-đầu)
3. [Giao diện chính](#3-giao-diện-chính)
4. [Module Chat tài liệu](#4-module-chat-tài-liệu)
   - 4.1 [Dashboard Chat](#41-dashboard-chat)
   - 4.2 [Chat AI với tài liệu](#42-chat-ai-với-tài-liệu)
   - 4.3 [Thư viện tài liệu](#43-thư-viện-tài-liệu)
   - 4.4 [Phân tích sử dụng](#44-phân-tích-sử-dụng)
5. [Module CRM & Công việc](#5-module-crm--công-việc)
   - 5.1 [Dashboard CRM](#51-dashboard-crm)
   - 5.2 [Bảng Kanban deals](#52-bảng-kanban-deals)
   - 5.3 [Chi tiết deal](#53-chi-tiết-deal)
   - 5.4 [Kiểm tra dữ liệu trùng](#54-kiểm-tra-dữ-liệu-trùng)
   - 5.5 [Cấu hình Pipeline](#55-cấu-hình-pipeline)
6. [Cài đặt tài khoản](#6-cài-đặt-tài-khoản)
7. [Câu hỏi thường gặp](#7-câu-hỏi-thường-gặp)

---

## 1. Tổng quan về Salio

**Salio** là nền tảng quản lý bán hàng thông minh tích hợp AI, giúp đội ngũ Sales:

- **Chat với tài liệu** — Đặt câu hỏi trực tiếp về hợp đồng, báo giá, tài liệu nội bộ và nhận câu trả lời tức thì từ AI
- **Quản lý pipeline CRM** — Theo dõi deals qua các giai đoạn bán hàng trên bảng Kanban trực quan
- **Tự động hóa quy trình** — Cấu hình rule AI để tự động phân tích, gợi ý và chuyển giai đoạn deal

### Các module chính

| Module | Đường dẫn | Mô tả |
|---|---|---|
| Chat tài liệu | `/chat-tai-lieu` | AI Chat + Thư viện tài liệu |
| CRM & Công việc | `/crm-work` | Dashboard, Kanban, Tasks |
| Cài đặt | `/settings` | Hồ sơ, bảo mật, tích hợp |

---

## 2. Đăng nhập và bắt đầu

### 2.1 Đăng nhập

1. Truy cập đường dẫn Salio do admin cung cấp
2. Nhập **Email** và **Mật khẩu** tài khoản của bạn
3. (Tuỳ chọn) Tích **"Ghi nhớ đăng nhập"** để không phải đăng nhập lại lần sau
4. Nhấn **Đăng nhập**

> **Quên mật khẩu?** Nhấn link "Quên mật khẩu?" bên cạnh ô nhập mật khẩu để đặt lại.

**Đăng nhập bằng tài khoản tổ chức:**  
Nhấn nút **Google** hoặc **Microsoft** để đăng nhập bằng tài khoản công ty (nếu được admin bật tính năng này).

### 2.2 Lần đầu sử dụng

Sau khi đăng nhập lần đầu, bạn sẽ được chuyển thẳng vào Dashboard CRM. Hãy:

1. Vào **Cài đặt → Hồ sơ** để cập nhật tên, ảnh đại diện, chức danh
2. Khám phá **Chat tài liệu** để bắt đầu upload tài liệu làm việc
3. Xem **CRM Dashboard** để nắm tổng quan pipeline của team

---

## 3. Giao diện chính

### 3.1 Thanh điều hướng (Sidebar)

Sidebar bên trái là điểm truy cập chính vào tất cả tính năng:

```
┌─────────────────────┐
│  ☰  Salio           │  ← Logo + toggle thu gọn
├─────────────────────┤
│  Chat tài liệu      │  ← Nhóm menu
│    Dashboard        │
│    Chat AI          │
│    Thư viện         │
│    Phân tích        │
├─────────────────────┤
│  CRM & Công việc    │
│    Dashboard        │
│    Kanban Deals     │
│    Kiểm tra trùng   │
│    Config Pipeline  │
├─────────────────────┤
│  Cài đặt            │
└─────────────────────┘
```

- **Thu gọn sidebar:** Nhấn biểu tượng `☰` ở góc trên để thu gọn sidebar, tạo thêm không gian làm việc
- **Di chuột vào sidebar đã thu gọn** sẽ tự động mở rộng tạm thời

### 3.2 Thanh tiêu đề (Header)

Ở góc trên bên phải luôn có:
- **Thông báo** — Biểu tượng chuông, hiển thị thông báo mới
- **Chuyển theme** — Nút bật/tắt chế độ tối (Dark mode)
- **Avatar tài khoản** — Nhấn vào để xem thông tin và đăng xuất

---

## 4. Module Chat tài liệu

Module này cho phép bạn **đặt câu hỏi bằng ngôn ngữ tự nhiên** về bất kỳ tài liệu nào đã được upload vào hệ thống và nhận câu trả lời chi tiết từ AI.

### 4.1 Dashboard Chat

**Truy cập:** Sidebar → Chat tài liệu → Dashboard

Trang tổng quan hiển thị:

| Thẻ thống kê | Ý nghĩa |
|---|---|
| Tài liệu trong thư viện | Tổng số file đã upload, tăng trưởng so với tuần trước |
| Phiên chat tháng này | Số lượt chat, so sánh với tháng trước |
| Câu hỏi đã trả lời | Tổng số câu hỏi + thời gian phản hồi trung bình |
| Dung lượng đã dùng | MB/GB đã sử dụng + thanh tiến trình |

**Bắt đầu chat nhanh:**

- Nhập câu hỏi vào **ô tìm kiếm trung tâm** và nhấn Enter
- Hoặc nhấn một trong các **gợi ý câu hỏi nhanh** (ví dụ: "Tóm tắt báo giá Q2", "So sánh hợp đồng A và B")
- Nhấn **"Bắt đầu chat mới"** để mở cửa sổ chat trống

**Câu hỏi phổ biến:** Phần cuối trang liệt kê các câu hỏi thường dùng của team — nhấn để chat ngay.

---

### 4.2 Chat AI với tài liệu

**Truy cập:** Sidebar → Chat tài liệu → Chat AI, hoặc nhấn "Bắt đầu chat mới" từ Dashboard

#### Giao diện chat

```
┌──────────────────┬────────────────────────────────┐
│  Thư viện        │  Tên tài liệu đang chat        │
│  tài liệu        │  ─────────────────────────────  │
│  ────────────    │                                  │
│  > Hợp đồng      │   [Tin nhắn AI]                 │
│  > Báo giá       │                                  │
│  > Nội quy       │       [Tin nhắn của bạn]        │
│                  │                                  │
│  Lịch sử chat   │  ─────────────────────────────  │
│  ────────────    │  📎  Nhập câu hỏi...      [Gửi] │
│  Chat hôm qua    └────────────────────────────────┘
│  Chat tuần trước
└──────────────────
```

#### Chọn tài liệu để chat

1. **Sidebar trái → Thư viện tài liệu:** Nhấn vào file hoặc thư mục muốn hỏi
2. Tên tài liệu đang được chọn hiển thị dưới ô nhập tin nhắn dưới dạng **badge ngữ cảnh**
3. Nhấn **"Thay đổi ngữ cảnh"** để chọn tài liệu/thư mục khác

#### Gửi câu hỏi

1. Nhập câu hỏi vào ô `Nhập câu hỏi tại đây...`
2. Nhấn **Enter** hoặc nút **Gửi** (biểu tượng mũi tên)
3. AI sẽ phân tích tài liệu và trả lời — thường trong vài giây
4. Câu trả lời có thể đi kèm **nguồn trích dẫn** (tên file, số trang) — nhấn vào để xem vị trí chính xác

> **Gửi bằng Ctrl+Enter:** Vào Cài đặt chat (biểu tượng bánh răng) để chuyển phím gửi từ Enter sang Ctrl+Enter, tránh gửi nhầm khi nhập nhiều dòng.

#### Đính kèm file trong chat

Nhấn biểu tượng **📎 (kẹp giấy)** bên trái ô nhập để đính kèm thêm file vào câu hỏi hiện tại.

#### Xem lại lịch sử chat

- **Sidebar trái → Lịch sử chat:** Hiển thị danh sách các cuộc hội thoại trước
- Di chuột vào cuộc chat → Xuất hiện nút **Ghim** (giữ lại ở đầu danh sách) và **Xóa**
- Nhấn vào cuộc chat để tải lại toàn bộ lịch sử hội thoại

#### Chia sẻ cuộc chat

1. Nhấn biểu tượng **Chia sẻ** (Share) ở góc trên bên phải
2. Chọn quyền truy cập: Chỉ xem / Xem + Tải / Xem + Tải + Chat
3. Thiết lập thêm: mật khẩu, thời hạn link
4. Nhấn **Sao chép link** và gửi cho đồng nghiệp hoặc khách hàng

#### Xuất cuộc chat

1. Nhấn biểu tượng **Tải xuống** (Export) ở góc trên bên phải
2. Chọn định dạng: PDF / Word / Text
3. File sẽ được tải về máy tính của bạn

---

### 4.3 Thư viện tài liệu

**Truy cập:** Sidebar → Chat tài liệu → Thư viện

Nơi quản lý toàn bộ tài liệu của cá nhân và tổ chức.

#### Cấu trúc thư viện

```
Thư viện tài liệu
├── Tài liệu công ty       ← Dùng chung cho cả workspace
│   ├── Hợp đồng
│   ├── Báo giá
│   └── Quy trình
├── Tài liệu cá nhân       ← Chỉ bạn thấy
│   └── Ghi chú cá nhân
└── Tài liệu được chia sẻ  ← Người khác chia sẻ với bạn
```

#### Upload tài liệu mới

1. Nhấn nút **"Thêm tài liệu"** (biểu tượng `+` hoặc button ở khu vực trung tâm)
2. **Kéo thả file** vào vùng upload, hoặc nhấn để chọn file từ máy tính
3. Nhập mô tả cho tài liệu (tuỳ chọn)
4. Nhấn **Upload** — file sẽ được xử lý và sẵn sàng để chat trong vài phút

> **Định dạng hỗ trợ:** PDF, DOCX, XLSX, TXT, và nhiều định dạng khác  
> **Giới hạn kích thước:** Liên hệ admin để biết giới hạn của workspace bạn

#### Tạo thư mục mới

1. Nhấn nút **"Thêm thư mục"** ở sidebar trái (biểu tượng thư mục `+`)
2. Nhập tên thư mục
3. Chọn vị trí: Tài liệu công ty / Tài liệu cá nhân / Tài liệu chia sẻ
4. Nhấn **Tạo**

#### Chỉnh sửa thông tin tài liệu

1. Mở tài liệu → Nhấn nút **Chỉnh sửa** (biểu tượng bút) trên thanh công cụ
2. Cập nhật: Tiêu đề, Trạng thái (Đã duyệt / Chờ duyệt / Bản nháp)
3. Nhấn **Lưu**

#### Chia sẻ tài liệu

1. Mở tài liệu → Nhấn nút **Chia sẻ** trên thanh công cụ
2. **Chia sẻ với người dùng:** Nhập email → Chọn quyền (Xem / Bình luận / Chỉnh sửa) → Gửi
3. **Chia sẻ bằng link:** Nhấn "Sao chép link" để lấy link chia sẻ nhanh
4. Nhấn **Xác nhận**

#### Thêm bình luận vào tài liệu

Ở cuối trang tài liệu có ô **bình luận**:
1. Nhập nội dung bình luận
2. Dùng thanh công cụ định dạng để in đậm, in nghiêng, thêm link...
3. Nhấn **Gửi bình luận**

---

### 4.4 Phân tích sử dụng

**Truy cập:** Sidebar → Chat tài liệu → Phân tích

Trang này giúp **Manager và Admin** theo dõi mức độ sử dụng AI Chat trong team:

- Số phiên chat theo ngày/tuần/tháng (biểu đồ)
- Tài liệu được hỏi nhiều nhất
- Người dùng hoạt động nhất
- Thời gian phản hồi trung bình của AI
- Tỷ lệ câu hỏi được trả lời thành công

---

## 5. Module CRM & Công việc

Module quản lý toàn bộ quy trình bán hàng: từ lead mới đến deal đã chốt.

### 5.1 Dashboard CRM

**Truy cập:** Sidebar → CRM & Công việc → Dashboard

#### Các chỉ số KPI

4 thẻ KPI ở đầu trang cung cấp cái nhìn nhanh về hiệu suất:

| KPI | Ý nghĩa |
|---|---|
| Leads mới | Số khách hàng tiềm năng mới trong kỳ |
| Deals đang theo dõi | Tổng số deal đang trong pipeline |
| Công việc hôm nay | Số task cần hoàn thành trong ngày |
| Tỷ lệ chuyển đổi | % deals được chốt thành công |

Mỗi KPI hiển thị **mũi tên xu hướng** (xanh = tăng tốt, đỏ = giảm cần chú ý) và % thay đổi so với kỳ trước.

#### Pipeline tổng quan

Bên dưới KPI là thanh tiến trình pipeline — hiển thị số lượng deals đang ở từng giai đoạn (Mới → Đang chuẩn bị → Đã liên hệ → Đàm phán → Báo giá → Thắng/Thua).

#### Công việc hôm nay

Danh sách task trong ngày:
- **Tích vào checkbox** để đánh dấu hoàn thành
- Mỗi task hiển thị: tiêu đề, deal liên quan, mức độ ưu tiên, thời hạn
- Nhấn **"Xem tất cả"** để mở danh sách đầy đủ

#### Deals ưu tiên

Grid hiển thị các deals cần chú ý:
- Tên deal + công ty
- Giai đoạn hiện tại (badge màu)
- Giá trị deal (VNĐ)
- Nhấn **"Liên hệ"** để ghi nhận hành động liên hệ với khách

#### Gợi ý AI

AI tự động phân tích pipeline và đưa ra **gợi ý hành động** cụ thể, ví dụ:
- "Deal [X] chưa có hoạt động trong 7 ngày — cần follow up"
- "3 deals có xác suất thắng cao — nên ưu tiên báo giá"

#### Nút hành động nhanh (Quick Actions)

Ở cuối trang có 4 nút:
- **Hỏi AI** — Mở chat AI để hỏi về pipeline
- **Mở lịch hẹn** — Xem/tạo lịch hẹn
- **Báo cáo nhanh** — Tạo báo cáo tổng kết nhanh
- **Config Pipeline** — Chuyển sang trang cấu hình

---

### 5.2 Bảng Kanban Deals

**Truy cập:** Sidebar → CRM & Công việc → Kanban Deals

Bảng Kanban là nơi quản lý deals theo trực quan — mỗi cột là một giai đoạn bán hàng.

#### Tổng quan bảng Kanban

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│  Mới     │ │Đang chuẩn│ │Đã liên hệ│ │ Đàm phán │ │  Báo giá │
│  5 deals │ │  bị  3   │ │    7     │ │    4     │ │    2     │
│ 120M VNĐ │ │  85M VNĐ │ │ 340M VNĐ │ │ 210M VNĐ │ │ 95M VNĐ  │
│──────────│ │──────────│ │──────────│ │──────────│ │──────────│
│ [Card 1] │ │ [Card 4] │ │ [Card 7] │ │[Card 10] │ │[Card 12] │
│ [Card 2] │ │ [Card 5] │ │ [Card 8] │ │[Card 11] │ │[Card 13] │
│ [Card 3] │ │ [Card 6] │ │ [Card 9] │ │          │ │          │
│    +     │ │    +     │ │    +     │ │    +     │ │    +     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

#### Tạo deal mới

**Cách 1 — Nút "Tạo Deal":**
1. Nhấn nút **"+ Tạo Deal"** ở góc trên bên phải
2. Điền thông tin trong form:

| Trường | Bắt buộc | Mô tả |
|---|:---:|---|
| Tên deal | ✅ | Tên giao dịch |
| Công ty | | Tên công ty khách hàng |
| Người liên hệ | | Tên người phụ trách phía khách |
| Giá trị | | Giá trị deal (VNĐ) |
| Xác suất (%) | | Khả năng chốt deal |
| Giai đoạn | ✅ | Giai đoạn hiện tại |
| Nguồn | | Website / Inbound / Referral / Outbound / Event |
| Mô tả | | Ghi chú thêm |

3. Nhấn **Lưu** — deal mới xuất hiện ngay trên board

**Cách 2 — Nút `+` trong cột:**  
Nhấn nút `+` ở cuối bất kỳ cột nào để tạo deal trực tiếp vào giai đoạn đó.

#### Chuyển giai đoạn deal (Drag & Drop)

1. **Giữ chuột** vào card deal
2. **Kéo** sang cột giai đoạn mới
3. **Thả** — deal tự động cập nhật giai đoạn

> Thay đổi được lưu ngay lập tức. Nếu có lỗi mạng, deal sẽ tự quay về vị trí cũ.

#### Thông tin trên card deal

Mỗi card hiển thị:
- **Badge nguồn** (Website / Inbound / Referral...)
- **Tên deal** (có thể click để xem chi tiết)
- **Tên công ty**
- **Giá trị** (in đậm)
- **Điểm AI** ⭐ (nếu AI đã phân tích deal này)

Khi **di chuột vào card** sẽ xuất hiện:
- ✏️ Nút **Chỉnh sửa** — Mở form edit deal
- 🗑️ Nút **Xóa** — Xóa deal (cần xác nhận)

#### Tìm kiếm và lọc

Thanh công cụ trên cùng bên trái:
- **Chọn Pipeline** — Nếu có nhiều pipeline, chọn pipeline muốn xem
- **🔍 Tìm kiếm** — Lọc deal theo tên
- **⚙️ Bộ lọc** — Lọc theo giai đoạn, nguồn, giá trị, người phụ trách

---

### 5.3 Chi tiết Deal

**Truy cập:** Nhấn vào tên deal trên Kanban board

#### Thông tin tổng quan

Phần đầu trang hiển thị:
- **Mã deal** (badge định danh)
- **Giai đoạn** (badge màu theo stage)
- **Tên deal** (tiêu đề lớn)
- **Cập nhật lần cuối** (thời gian + người cập nhật)

**Thanh tiến trình giai đoạn:** Dãy mũi tên hình thang nối tiếp nhau — giai đoạn hiện tại được tô màu nổi bật. Nhấn vào giai đoạn khác để chuyển deal (nếu có quyền).

#### Tabs nội dung

**Tab 1: Thông tin chung (About)**

- **Giá trị deal** — Số tiền hợp đồng
- **Xác suất thắng** — Thanh tiến trình % + chỉ số
- **Người phụ trách** — Thành viên team đang theo deal
- **Ngày dự kiến chốt** — Deadline
- **Thông tin khách hàng** — Tên công ty, liên hệ, link website

**Phân tích AI (góc dưới trái tab này):**
> AI tự động phân tích deal và hiển thị:
> - Nhận định về cơ hội deal
> - Danh sách **hành động được đề xuất** (ví dụ: "Gửi proposal trong 3 ngày", "Xếp lịch demo với CTO")

**Tab 2: Sản phẩm**

Danh sách sản phẩm/dịch vụ trong deal:
- Tên sản phẩm, số lượng, đơn giá, thành tiền
- Tổng giá trị deal tự động tính

**Tab 3: Lịch sử**

Timeline các thay đổi của deal theo thời gian.

#### Panel bên phải — Hành động nhanh

4 nút hành động:
- 💬 **Bình luận** — Thêm ghi chú nội bộ
- ✅ **Tạo task** — Tạo việc cần làm liên quan đến deal
- 📧 **Email** — Ghi nhận gửi email cho khách
- 📞 **Gọi điện** — Ghi nhận cuộc gọi

**Timeline hoạt động:** Bên dưới 4 nút là dòng thời gian toàn bộ hoạt động:
- AI phân tích (badge tím)
- Email (badge xanh)
- Chuyển giai đoạn (badge cam)
- Tạo mới (badge xám)

Nhấn **Lọc** để chỉ hiển thị loại hoạt động cụ thể.

#### Các nút trên header

| Nút | Chức năng |
|---|---|
| 💬 Chat | Mở chat AI về deal này |
| 💾 Lưu | Lưu các thay đổi |
| 🗑️ Xóa | Xóa deal (cần xác nhận) |

---

### 5.4 Kiểm tra dữ liệu trùng

**Truy cập:** Sidebar → CRM & Công việc → Kiểm tra trùng

Tính năng này giúp phát hiện và xử lý các bản ghi deal/khách hàng bị nhập trùng lặp trong hệ thống, đảm bảo dữ liệu CRM luôn sạch và chính xác.

---

### 5.5 Cấu hình Pipeline

**Truy cập:** Sidebar → CRM & Công việc → Config Pipeline  
*(Yêu cầu quyền: Manager hoặc Admin)*

#### Quản lý danh sách Pipeline

**Sidebar trái** hiển thị tất cả pipeline đang có:
- Tên pipeline + số deals + doanh thu
- Badge **"Mặc định"** cho pipeline chính
- Nhấn pipeline để xem/chỉnh sửa
- Nhấn **"+ Tạo pipeline mới"** ở cuối sidebar

#### Tab Giai đoạn (Stages)

Cấu hình các bước trong quy trình bán hàng:

**Chỉnh sửa giai đoạn:**
1. Nhấn vào card giai đoạn muốn chỉnh sửa
2. Thay đổi: Tên giai đoạn, màu sắc, tỷ lệ thắng mặc định
3. Nhấn **Lưu**

**Thêm giai đoạn mới:**
Nhấn **"+ Thêm giai đoạn"** ở cuối dãy stage cards.

**Quy tắc chuyển giai đoạn (Transition Rules):**
Bật/tắt các điều kiện phải thỏa mãn trước khi deal được chuyển sang giai đoạn tiếp theo. Ví dụ: "Phải có đề xuất được duyệt trước khi vào giai đoạn Đàm phán".

**AI Smart Rules:**
- **Ngưỡng cảnh báo:** AI sẽ cảnh báo khi deal có xác suất thắng thấp hơn ngưỡng này
- **Ngưỡng rủi ro:** Deals dưới mức này được đánh dấu nguy hiểm
- **Độ tin cậy AI:** Mức độ phân tích AI ảnh hưởng đến gợi ý

Kéo các thanh trượt để điều chỉnh ngưỡng phù hợp với team bạn.

**Quy tắc tự động hoá (Automation):**

Bảng hiển thị các quy tắc đang kích hoạt:

| Cột | Ý nghĩa |
|---|---|
| Tên quy tắc | Mô tả hành động tự động |
| Loại | AI LOGIC / WORKFLOW / NOTIFICATION |
| Điều kiện kích hoạt | Khi nào quy tắc chạy |
| Bật/Tắt | Toggle để kích hoạt/vô hiệu hoá |

#### Tab Phân quyền

*(Tính năng đang phát triển — xem SRS Phân quyền để biết thêm)*

Cấu hình ai được xem, tạo, chỉnh sửa và xóa deals trong pipeline.

---

## 6. Cài đặt tài khoản

**Truy cập:** Sidebar → Cài đặt

### 6.1 Hồ sơ cá nhân

**Cập nhật ảnh đại diện:**
1. Nhấn vào ảnh đại diện (hoặc vòng tròn chữ cái nếu chưa có ảnh)
2. Nhấn **"Upload ảnh mới"**
3. Chọn file ảnh (JPG/PNG/GIF, tối đa 5 MB)
4. Ảnh sẽ được cập nhật ngay

**Cập nhật thông tin:**

| Trường | Ghi chú |
|---|---|
| Họ và tên | Bắt buộc |
| Email | Chỉ đọc — liên hệ Admin để thay đổi |
| Số điện thoại | Tuỳ chọn |
| Chức danh | Ví dụ: Sales Executive, BDM |
| Phòng ban | Ví dụ: Sales, Marketing |
| Múi giờ | Chọn múi giờ phù hợp vị trí của bạn |
| Giới thiệu | Tối đa 300 ký tự |

Nhấn **"Lưu thay đổi"** sau khi cập nhật. Nhấn **"Đặt lại"** để hoàn tác về trạng thái ban đầu.

### 6.2 Bảo mật

- **Đổi mật khẩu:** Nhập mật khẩu hiện tại → Nhập mật khẩu mới → Xác nhận
- **Xác thực 2 bước (2FA):** Tăng cường bảo mật tài khoản bằng ứng dụng authenticator

### 6.3 Thông báo

Tuỳ chỉnh loại thông báo nhận được:
- Thông báo trong ứng dụng (In-app)
- Email thông báo
- Tần suất tóm tắt (Hàng ngày / Hàng tuần / Tắt)

### 6.4 Giao diện

- **Chế độ tối (Dark mode):** Bật/tắt giao diện tối
- **Ngôn ngữ:** Chọn ngôn ngữ hiển thị

### 6.5 Tích hợp API

*(Yêu cầu quyền: Admin)*

Quản lý API keys để kết nối Salio với các công cụ khác (CRM bên ngoài, Zapier, v.v.)

### 6.6 Nhật ký Webhook

*(Yêu cầu quyền: Admin)*

Xem lịch sử sự kiện đã được gửi qua webhook, kiểm tra lỗi tích hợp.

---

## 7. Câu hỏi thường gặp

**Q: AI không trả lời đúng nội dung tài liệu, phải làm gì?**  
A: Kiểm tra lại tài liệu đang được chọn làm ngữ cảnh (badge phía dưới ô nhập). Thử diễn đạt lại câu hỏi cụ thể hơn. Nếu tài liệu mới upload, hãy chờ vài phút để hệ thống xử lý xong.

**Q: Deal bị mất sau khi kéo thả trên Kanban?**  
A: Deal không bị mất — hãy refresh trang. Nếu deal quay về giai đoạn cũ, có thể xảy ra lỗi lưu; hãy thử kéo lại hoặc dùng form chỉnh sửa để thay đổi giai đoạn.

**Q: Tôi không thấy tài liệu mà đồng nghiệp vừa upload?**  
A: Tài liệu có thể được đặt ở chế độ Private. Yêu cầu đồng nghiệp chia sẻ tài liệu đó với bạn hoặc chuyển sang chế độ TEAM/WORKSPACE.

**Q: Link chia sẻ tài liệu không mở được?**  
A: Link có thể đã hết hạn hoặc bị vô hiệu hoá. Liên hệ người gửi link để lấy link mới.

**Q: Tôi muốn thêm thành viên mới vào workspace?**  
A: Tính năng này chỉ dành cho Admin. Vào **Cài đặt → Thành viên** để mời người dùng mới.

**Q: AI Smart Rules ảnh hưởng thế nào đến deals của tôi?**  
A: AI phân tích dữ liệu deal (giá trị, lịch sử hoạt động, giai đoạn, thời gian...) để tính điểm xác suất và đưa ra gợi ý. Bạn không cần làm gì — AI tự chạy nền. Các ngưỡng cảnh báo có thể được điều chỉnh bởi Manager/Admin trong Config Pipeline.

**Q: Salio có ứng dụng mobile không?**  
A: Hiện tại Salio là ứng dụng web có giao diện responsive, hoạt động tốt trên trình duyệt di động. Ứng dụng native đang trong lộ trình phát triển.

---

*Cần hỗ trợ thêm? Liên hệ team kỹ thuật hoặc Admin workspace của bạn.*
