# CLAUDE.md — Hướng dẫn AI làm việc với dự án này

## Tổng quan dự án

Vue 3 Admin Template (CodeOn POS) — dashboard quản lý cửa hàng/sản phẩm.
Stack: Vue 3 + TypeScript + Tailwind CSS v4 + shadcn-vue (Reka UI) + Vite.

---

## Stack đầy đủ

| Mục đích | Thư viện |
|---|---|
| Framework | Vue 3 + TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn-vue (copy-paste vào `src/components/ui/`) |
| Bảng dữ liệu | @tanstack/vue-table + @tanstack/vue-virtual |
| Form + Validation | vee-validate + @vee-validate/zod + zod |
| Biểu đồ | vue-echarts + echarts |
| State (client) | Pinia (`src/stores/`) |
| State (server) | @tanstack/vue-query + axios (`src/services/api.ts`) |
| Icons | lucide-vue-next + Custom SVG (`src/icons/`) |
| Notification | vue-sonner (+ Sonner component trong `src/components/ui/sonner/`) |
| Export | xlsx |
| Utilities | @vueuse/core |
| Calendar | @fullcalendar/vue3 |
| Date Picker | vue-flatpickr-component + flatpickr |

---

## Cấu trúc thư mục quan trọng

```
src/
├── components/
│   ├── layout/          ← Layout system (KHÔNG sửa trừ khi được yêu cầu)
│   │   ├── AdminLayout.vue     ← wrapper chính, dùng <slot> cho content
│   │   ├── AppSidebar.vue      ← sidebar với menu groups
│   │   ├── AppHeader.vue       ← header
│   │   └── FullScreenLayout.vue ← dùng cho trang Auth (không có sidebar)
│   ├── ui/              ← shadcn-vue components (copy-paste, không tự tạo mới)
│   └── common/          ← shared components dùng lại trong nhiều trang
├── views/               ← mỗi trang là 1 file, bọc trong AdminLayout
├── stores/              ← Pinia stores (1 file per feature, vd: useAuthStore.ts)
├── services/
│   └── api.ts           ← axios instance + helper get/post/put/del
├── composables/
│   └── useSidebar.ts    ← quản lý state sidebar (KHÔNG tái tạo)
├── types/
│   └── common.ts        ← ApiResponse<T> và các type dùng chung
├── lib/
│   └── utils.ts         ← shadcn-vue utility (cn function)
└── router/index.ts      ← thêm route mới ở đây
```

---

## Layout system

### Trang thông thường (có sidebar + header)
Mọi view đều bọc trong `AdminLayout`:

```vue
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <!-- content ở đây -->
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
</script>
```

### Trang Auth (không có sidebar)
Dùng `FullScreenLayout` thay AdminLayout.

---

## Component UI — shadcn-vue

Components nằm trong `src/components/ui/` (copy-paste từ shadcn-vue CLI):

```bash
# Thêm component mới:
npx shadcn-vue@latest add button
npx shadcn-vue@latest add input
npx shadcn-vue@latest add dialog
# ...
```

### Components đã cài sẵn (trong `src/components/ui/`)

| shadcn-vue component | Dùng khi |
|---|---|
| `Button` | Mọi nút bấm |
| `Input` | Text input |
| `Textarea` | Multi-line text input |
| `Label` | Label cho form field |
| `Select` | Dropdown chọn |
| `Checkbox` / `Switch` | Toggle |
| `Dialog` | Modal/popup |
| `Sheet` | Drawer trượt từ cạnh |
| `Form` + `FormField` | Form có VeeValidate |
| `Tabs` | Tabs |
| `Badge` | Tag/badge |
| `Card` | Card container |
| `Separator` | Đường phân cách |
| `Sonner` | Toast notification |

> **Không có `Table` trong shadcn-vue** — dùng `@tanstack/vue-table` cho bảng dữ liệu.

**Quy tắc:** Luôn dùng component từ `@/components/ui/` — không dùng HTML thuần cho form controls.

---

## Sidebar — Quy tắc đặc biệt

`AppSidebar.vue` có logic phức tạp, **không được tái tạo**:

- `useSidebar()` composable — quản lý `isExpanded`, `isMobileOpen`, `isHovered`, `openSubmenu`
- `menuGroups` — cấu trúc dữ liệu menu (mảng groups → items → subItems)
- `isActive(path)` — highlight menu item theo route hiện tại
- `toggleSubmenu()` / `isSubmenuOpen()` — mở/đóng submenu
- `startTransition` / `endTransition` — animation height cho submenu

**Khi chỉnh sửa Sidebar:** Chỉ thay `<template>`, giữ nguyên toàn bộ `<script setup>`.

### Cấu trúc menuGroups

```ts
const menuGroups = [
  {
    title: 'Tên nhóm',
    items: [
      {
        icon: SomeIcon,        // Vue component icon
        name: 'Tên menu',
        path: '/duong-dan',    // nếu là link trực tiếp
        subItems: [            // nếu có dropdown
          { name: 'Sub item', path: '/sub', pro: false, new: false }
        ]
      }
    ]
  }
]
```

---

## Thêm trang mới — quy trình chuẩn

### 1. Tạo view file
```
src/views/TenModule/TenTrang.vue
```

### 2. Cấu trúc view chuẩn

```vue
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />
    <!-- content -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const pageTitle = ref('Tên trang')
</script>
```

### 3. Thêm route vào `src/router/index.ts`

```ts
{
  path: '/ten-trang',
  name: 'TenTrang',
  component: () => import('../views/TenModule/TenTrang.vue'),
  meta: { title: 'Tên trang' },
}
```

### 4. Thêm menu vào `AppSidebar.vue`

Thêm item vào mảng `menuGroups` trong `<script setup>`:
```ts
{
  icon: SomeIcon,
  name: 'Tên menu',
  path: '/ten-trang',
}
```

---

## Quy tắc khi convert thiết kế từ Stitch

Khi nhận HTML/Tailwind code export từ Google Stitch:

### Với trang mới (view mới)
1. Bọc toàn bộ content trong `AdminLayout`
2. Giữ nguyên Tailwind classes từ Stitch
3. Thay data cứng (text, số, danh sách) bằng Vue reactive (`ref`, `reactive`)
4. Thay HTML input/button thuần bằng component từ `@/components/ui/`
5. Thêm `v-for` cho danh sách lặp, `v-if` cho điều kiện hiện/ẩn

### Với component có sẵn (AppSidebar, AppHeader...)
> **Chỉ thay `<template>`, giữ nguyên `<script setup>`**

Cụ thể:
- KHÔNG xóa bất kỳ `const`, `ref`, `computed`, `function` nào trong `<script setup>`
- KHÔNG xóa `import` trong `<script setup>`
- KHÔNG tái tạo logic đã có (useSidebar, menuGroups, isActive...)
- CHỈ thay đổi HTML structure và Tailwind classes trong `<template>`
- Giữ nguyên tất cả Vue bindings: `v-for`, `v-if`, `:class`, `@click`, `router-link`, `<component :is>`

### Ví dụ đúng khi AI được yêu cầu "cập nhật giao diện Sidebar theo thiết kế Stitch"

```
✅ Thay class Tailwind trên <aside>
✅ Thay cấu trúc HTML bên trong item menu
✅ Thêm icon mới, thay đổi màu sắc
❌ Xóa hoặc sửa useSidebar()
❌ Viết lại logic isActive, toggleSubmenu
❌ Xóa menuGroups
❌ Bỏ transition hooks
```

---

## Pattern trang có bảng + dialog

```vue
<script setup lang="ts">
import { useVueTable, getCoreRowModel, type ColumnDef } from '@tanstack/vue-table'
import { Dialog, DialogContent } from '@/components/ui/dialog'
// ...
const table = useVueTable({ data, columns, getCoreRowModel: getCoreRowModel() })
</script>
```

- Dùng `@tanstack/vue-table` cho bảng dữ liệu phức tạp (sort, filter, pagination)
- Dùng `Dialog` từ shadcn-vue cho modal thêm/sửa
- `reactive()` cho query params phân trang

---

## Pattern gọi API với TanStack Query

```vue
<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { get, post } from '@/services/api'

// Fetch danh sách
const { data, isLoading, isError } = useQuery({
  queryKey: ['products'],
  queryFn: () => get<Product[]>('/products'),
})

// Mutation (tạo/sửa/xóa)
const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: (body: CreateProductDto) => post<Product>('/products', body),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
})
</script>
```

- `useQuery` — fetch & cache dữ liệu từ server
- `useMutation` — gọi API write (POST/PUT/DELETE)
- Sau mutation thành công: `invalidateQueries` để refetch danh sách
- `get/post/put/del` từ `@/services/api.ts` — wrapper axios trả về `ApiResponse<T>`

---

## Notifications — vue-sonner

```vue
<script setup lang="ts">
import { toast } from 'vue-sonner'

// Dùng ở bất kỳ component nào
toast.success('Lưu thành công')
toast.error('Đã xảy ra lỗi')
toast('Thông báo thông thường')
</script>
```

- `Sonner` component đã được mount trong `App.vue` (hoặc layout root)
- **Không dùng** `Toast` từ shadcn-vue — dự án dùng `vue-sonner` thay thế
- Import `toast` từ `'vue-sonner'`, không cần inject hay composable

---

## Pattern form có validation

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = toTypedSchema(z.object({
  name: z.string().min(1, 'Bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
}))
const { handleSubmit } = useForm({ validationSchema: schema })

const onSubmit = handleSubmit((values) => {
  // gọi API
})
</script>

<template>
  <Form @submit="onSubmit">
    <FormField name="name" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Tên</FormLabel>
        <FormControl><Input v-bind="componentField" /></FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit">Lưu</Button>
  </Form>
</template>
```

- Luôn dùng VeeValidate + Zod — không dùng validation thủ công
- Dùng `FormField` + `FormMessage` từ shadcn-vue để wrap input có error message
- `componentField` binding tự động kết nối VeeValidate với Input component

---

## Color tokens — QUAN TRỌNG

Dự án định nghĩa color system riêng trong `src/assets/main.css`. **Luôn dùng các token này thay vì màu Tailwind mặc định** (blue-500, green-500...).

### Màu chính

| Token | Màu gốc | Dùng khi |
|---|---|---|
| `brand-500` | `#465fff` | Primary action, link, active state |
| `brand-600` | `#3641f5` | Hover trên brand-500 |
| `brand-50` | `#ecf3ff` | Background nhạt brand |
| `success-500` | `#12b76a` | Trạng thái thành công |
| `success-50` | `#ecfdf3` | Background nhạt success |
| `error-500` | `#f04438` | Lỗi, xóa |
| `error-50` | `#fef3f2` | Background nhạt error |
| `warning-500` | `#f79009` | Cảnh báo |
| `warning-50` | `#fffaeb` | Background nhạt warning |
| `gray-900` | `#101828` | Text chính |
| `gray-700` | `#344054` | Text phụ |
| `gray-500` | `#667085` | Text mờ / placeholder |
| `gray-300` | `#d0d5dd` | Border |
| `gray-200` | `#e4e7ec` | Border nhạt |
| `gray-100` | `#f2f4f7` | Background nhạt |
| `gray-50` | `#f9fafb` | Background trang |

### Ví dụ dùng đúng

```html
<!-- ✅ Dùng token dự án -->
<button class="bg-brand-500 hover:bg-brand-600 text-white">Lưu</button>
<span class="text-success-500 bg-success-50">Thành công</span>
<span class="text-error-500 bg-error-50">Lỗi</span>
<p class="text-gray-700 dark:text-gray-400">Nội dung</p>

<!-- ❌ Không dùng màu Tailwind generic -->
<button class="bg-blue-500 hover:bg-blue-600">Lưu</button>
<span class="text-green-500">Thành công</span>
```

### Custom text sizes

| Token | Size |
|---|---|
| `text-theme-xl` | 20px |
| `text-theme-sm` | 14px |
| `text-theme-xs` | 12px |
| `text-title-xs` | 24px |
| `text-title-sm` | 30px |
| `text-title-md` | 36px |

### Custom shadows

```html
shadow-theme-xs   <!-- nhẹ nhất -->
shadow-theme-sm
shadow-theme-md
shadow-theme-lg
shadow-theme-xl   <!-- mạnh nhất -->
shadow-focus-ring <!-- focus ring brand color -->
```

---

## Dark mode

Dự án hỗ trợ dark mode. Khi viết Tailwind classes luôn thêm variant `dark:`:
```html
<div class="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-400">
```

---

## TypeScript

- Luôn dùng `<script setup lang="ts">`
- Định nghĩa interface cho data type, đặt trong file `types/` cùng thư mục với view
- Không dùng `any`
