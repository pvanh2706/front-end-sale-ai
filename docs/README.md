# Mục lục Tài liệu Dự án

Tổng hợp tất cả tài liệu trong thư mục `docs/`. Đọc file này để biết cần xem tài liệu nào.

---

## Tài liệu đang dùng ✅

### Bắt đầu với dự án

| File | Mô tả ngắn | Đọc khi nào |
|---|---|---|
| [onboarding.md](onboarding.md) | Hướng dẫn toàn diện cho dev mới: stack, cấu trúc thư mục, tất cả các pattern (API, state, form, table, routing, icons...) | **Đọc đầu tiên** khi vào dự án |
| [learning-checklist.md](learning-checklist.md) | Danh sách kiến thức cần học trước khi code, có link tài liệu và thứ tự học đề xuất theo tuần | Trước khi đọc onboarding.md |
| [../CLAUDE.md](../CLAUDE.md) | Hướng dẫn dành cho AI (GitHub Copilot) — tóm tắt rules, patterns, color tokens | Khi prompt AI để convert thiết kế hoặc tạo tính năng mới |

### Workflow phát triển

| File | Mô tả ngắn | Đọc khi nào |
|---|---|---|
| [stitch-to-vue-workflow.md](stitch-to-vue-workflow.md) | Quy trình từ thiết kế Google Stitch → Vue component: cách export code, prompt mẫu nhờ AI convert, quy tắc xử lý layout | Khi cần convert thiết kế Stitch thành code |

### Kiến thức nền tảng

| File | Mô tả ngắn | Đọc khi nào |
|---|---|---|
| [composables-vs-pinia.md](composables-vs-pinia.md) | So sánh khi nào dùng Composable vs Pinia store, với ví dụ cụ thể | Khi phân vân đặt state ở đâu |

---

## Tài liệu lỗi thời ⚠️

> Các file dưới đây liên quan đến **Element Plus** — thư viện đã được gỡ khỏi dự án.
> **Không áp dụng** cho codebase hiện tại. Giữ lại để tham khảo lịch sử.

| File | Lý do lỗi thời |
|---|---|
| [app-dialog-centering.md](app-dialog-centering.md) | Dialog centering của Element Plus — nay dùng `Dialog` từ shadcn-vue |
| [el-scrollbar-in-dialog.md](el-scrollbar-in-dialog.md) | `el-scrollbar` component của Element Plus — đã bị gỡ |
| [element-plus-dark-mode-setup.md](element-plus-dark-mode-setup.md) | Cấu hình dark mode cho Element Plus — không còn liên quan |
| [element-plus-dialog-props.md](element-plus-dialog-props.md) | Props của `el-dialog` — nay dùng `Dialog` shadcn-vue |
| [element-plus-select-fix.md](element-plus-select-fix.md) | Fix `el-select` — đã được thay bằng `Select` shadcn-vue |
| [fix-appselect-double-line-display.md](fix-appselect-double-line-display.md) | Fix AppSelect wrapper của Element Plus — component đã xóa |
| [modal-scroll-setup.md](modal-scroll-setup.md) | Setup scroll trong modal dùng `el-scrollbar` — đã lỗi thời |
| [improvement-issues.md](improvement-issues.md) | Danh sách vấn đề cũ — có thể chứa issue liên quan Element Plus |

---

## Tài liệu gốc dự án

| File | Mô tả |
|---|---|
| [../README.md](../README.md) | README gốc của TailAdmin Vue template (tiếng Anh) |
| [../full-stack.md](../full-stack.md) | Danh sách đầy đủ packages và phân công trách nhiệm từng thư viện |

---

## Tóm tắt nhanh — Đọc theo mục tiêu

| Mục tiêu | Đọc file |
|---|---|
| Mới vào dự án, chưa biết gì | `learning-checklist.md` → `onboarding.md` |
| Cần nhờ AI (Copilot) tạo code | `CLAUDE.md` |
| Cần convert thiết kế Stitch | `stitch-to-vue-workflow.md` |
| Không biết đặt state ở đâu | `composables-vs-pinia.md` |
| Muốn biết dự án dùng gì | `full-stack.md` |
