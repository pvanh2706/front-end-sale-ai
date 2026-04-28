# Hướng dẫn Dev Mới — Vue Admin Template

> Tài liệu này giúp bạn hiểu cấu trúc dự án, các pattern được dùng, và biết đặt code đúng chỗ ngay từ ngày đầu.

---

## Mục lục

1. [Tổng quan dự án](#1-tổng-quan-dự-án)
2. [Cài đặt & Chạy dự án](#2-cài-đặt--chạy-dự-án)
3. [Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
4. [Luồng khởi động ứng dụng](#4-luồng-khởi-động-ứng-dụng)
5. [Hệ thống Layout](#5-hệ-thống-layout)
6. [Routing — Thêm trang mới](#6-routing--thêm-trang-mới)
7. [Gọi API — Pattern chuẩn](#7-gọi-api--pattern-chuẩn)
8. [State Management](#8-state-management)
9. [Components — Phân loại & Cách dùng](#9-components--phân-loại--cách-dùng)
10. [Theme & Dark Mode](#10-theme--dark-mode)
11. [Sidebar & Navigation](#11-sidebar--navigation)
12. [TypeScript Types — Đặt ở đâu?](#12-typescript-types--đặt-ở-đâu)
13. [Icons — Dùng thế nào?](#13-icons--dùng-thế-nào)
14. [Form & Validation](#14-form--validation)
15. [Bảng dữ liệu — TanStack Table](#15-bảng-dữ-liệu--tanstack-table)
16. [Notifications — vue-sonner](#16-notifications--vue-sonner)
17. [Color tokens — Dùng màu đúng cách](#17-color-tokens--dùng-màu-đúng-cách)
18. [Quy tắc đặt tên](#18-quy-tắc-đặt-tên)
19. [Checklist khi tạo tính năng mới](#19-checklist-khi-tạo-tính-năng-mới)
20. [Các lỗi phổ biến cần tránh](#20-các-lỗi-phổ-biến-cần-tránh)

---

## 1. Tổng quan dự án

Đây là **Admin Dashboard** xây dựng trên Vue 3, dùng làm nền tảng cho ứng dụng POS — CodeOn POS.

### Stack chính

| Mục đích | Thư viện | Version |
|---|---|---|
| Framework | Vue 3 + Composition API (`<script setup>`) | 3.5 |
| Routing | Vue Router | 4.5 |
| State (client) | Pinia | 3.0 |
| State (server) | TanStack Query + Axios | 5.x |
| UI / Styling | Tailwind CSS | v4 |
| UI Components | shadcn-vue (Reka UI) | — |
| Icons | lucide-vue-next + Custom SVG (`src/icons/`) | — |
| Bảng dữ liệu | TanStack Table + TanStack Virtual | — |
| Biểu đồ | vue-echarts + echarts | — |
| Form validation | VeeValidate + Zod | — |
| Notification | vue-sonner | 2.0 |
| Export | xlsx | — |
| Utilities | @vueuse/core | — |
| Calendar | @fullcalendar/vue3 | 6.x |
| Date Picker | vue-flatpickr-component + flatpickr | — |
| Build | Vite 6 + TypeScript 5.7 | — |

---

## 2. Cài đặt & Chạy dự án

```bash
# Cài dependencies
npm install

# Chạy dev server (http://localhost:5173)
npm run dev

# Build production
npm run build

# Kiểm tra TypeScript errors
npm run type-check

# Lint & format
npm run lint
npm run format
```

### Biến môi trường

Tạo file `.env.local` ở thư mục gốc (không commit):

```env
VITE_API_BASE_URL=https://your-api-url.com
```

Nếu không có biến này, `api.ts` fallback về `/api`.

---

## 3. Cấu trúc thư mục

```
src/
├── assets/
│   └── main.css                  # Entry CSS: import Tailwind + định nghĩa color tokens
│
├── components/
│   ├── common/
│   │   └── ThemeToggler.vue      # Nút toggle dark/light mode
│   ├── layout/                   # Layout system — KHÔNG sửa trừ khi được yêu cầu
│   │   ├── AdminLayout.vue       # Wrapper chính cho trang có sidebar
│   │   ├── AppSidebar.vue        # Sidebar với menu groups
│   │   ├── AppHeader.vue         # Header (search, notification, user menu)
│   │   ├── Backdrop.vue          # Overlay khi mobile sidebar mở
│   │   ├── FullScreenLayout.vue  # Dùng cho trang Auth (không có sidebar)
│   │   ├── SidebarProvider.vue   # Provider inject sidebar context xuống toàn app
│   │   ├── SidebarWidget.vue     # Widget hiện ở cuối sidebar
│   │   ├── ThemeProvider.vue     # Provider inject theme context
│   │   └── header/
│   │       ├── HeaderLogo.vue
│   │       ├── NotificationMenu.vue
│   │       ├── SearchBar.vue
│   │       └── UserMenu.vue
│   └── ui/                       # shadcn-vue components (copy-paste qua CLI)
│       ├── badge/
│       ├── button/
│       ├── card/
│       ├── checkbox/
│       ├── dialog/
│       ├── form/
│       ├── input/
│       ├── label/
│       ├── select/
│       ├── separator/
│       ├── sheet/
│       ├── sonner/
│       ├── switch/
│       ├── tabs/
│       └── textarea/
│
├── composables/
│   └── useSidebar.ts             # useSidebarProvider() + useSidebar() hooks
│
├── icons/                        # Custom SVG icon components
│   └── index.ts                  # Re-export tất cả icons
│
├── lib/
│   └── utils.ts                  # cn() — tailwind-merge + clsx helper
│
├── router/
│   └── index.ts                  # Route definitions + beforeEach (set document.title)
│
├── services/
│   └── api.ts                    # axios instance + get/post/put/del helpers
│
├── stores/                       # Pinia stores (1 file per feature)
│
├── types/
│   └── common.ts                 # ApiResponse<T> + isSuccess() type guard
│
├── utils/                        # Utility functions
├── views/                        # Page components (1 file = 1 route)
├── App.vue                       # Root: ThemeProvider > SidebarProvider > RouterView
└── main.ts                       # Khởi động app
```

---

## 4. Luồng khởi động ứng dụng

### `main.ts`

```typescript
import './assets/main.css'            // Tailwind CSS + color tokens
import 'flatpickr/dist/flatpickr.css' // Date picker styles

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import App from './App.vue'

createApp(App)
  .use(createPinia())     // 1. Pinia trước
  .use(router)            // 2. Router
  .use(VueQueryPlugin)    // 3. TanStack Query
  .mount('#app')
```

### `App.vue` — Provider pattern

```
ThemeProvider           ← inject isDarkMode, toggleTheme xuống toàn app
  └── SidebarProvider   ← inject isExpanded, toggleSidebar... xuống toàn app
        └── RouterView  ← render trang hiện tại theo route
```

---

## 5. Hệ thống Layout

### Trang thông thường (có sidebar + header)

```vue
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />
    <!-- Nội dung trang ở đây -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const pageTitle = ref('Tên trang')
</script>
```

### Trang Auth (không có sidebar)

```vue
<template>
  <FullScreenLayout>
    <!-- Form đăng nhập, đăng ký... -->
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
</script>
```

---

## 6. Routing — Thêm trang mới

### Bước 1: Tạo view file

```
src/views/TenModule/TenTrang.vue
```

### Bước 2: Đăng ký route trong `src/router/index.ts`

```typescript
{
  path: '/ten-trang',
  name: 'TenTrang',
  component: () => import('../views/TenModule/TenTrang.vue'),  // luôn lazy load
  meta: { title: 'Tên hiển thị trên tab' },
},
```

### Bước 3: Thêm menu vào Sidebar

Mở `src/components/layout/AppSidebar.vue`, thêm item vào `menuGroups`:

```typescript
{
  icon: YourIcon,
  name: 'Tên menu',
  path: '/ten-trang',
}
```

---

## 7. Gọi API — Pattern chuẩn

Dự án dùng **Result Pattern** — mọi API call trả về `ApiResponse<T>`, không throw exception lên tầng UI.

### `ApiResponse<T>`

```typescript
// src/types/common.ts
type ApiResponse<T> =
  | { isSuccess: true; data: T }
  | { isSuccess: false; error: string }
```

### Helpers trong `src/services/api.ts`

```typescript
import { get, post, put, del } from '@/services/api'

const result = await get<Product[]>('/products')
const result = await get<Product[]>('/products', { page: 1, limit: 20 })
const result = await post<Product>('/products', { name: 'Tên SP', price: 100000 })
const result = await put<Product>(`/products/${id}`, { name: 'Tên mới' })
const result = await del<void>(`/products/${id}`)
```

### Xử lý kết quả với `isSuccess`

```typescript
import { isSuccess } from '@/types/common'
import { toast } from 'vue-sonner'

const result = await get<Product[]>('/products')
if (isSuccess(result)) {
  products.value = result.data
} else {
  toast.error(result.error)
}
```

### Kết hợp TanStack Query (khuyến nghị)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { get, post } from '@/services/api'
import { toast } from 'vue-sonner'

const { data, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: () => get<Product[]>('/products'),
})

const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: (body: CreateProductDto) => post<Product>('/products', body),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
    toast.success('Tạo thành công')
  },
  onError: (err) => toast.error(String(err)),
})
```

---

## 8. State Management

| Loại state | Giải pháp |
|---|---|
| UI state chỉ trong 1 component | `ref()` / `reactive()` local |
| Cache dữ liệu từ API | TanStack Query (`useQuery`) |
| State toàn app (auth, user session) | Pinia store |
| Sidebar / theme state | Đã có sẵn qua Provider pattern |

### Tạo Pinia Store

```typescript
// src/stores/useAuthStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function logout() {
    token.value = null
    localStorage.removeItem('token')
  }

  return { token, isLoggedIn, setToken, logout }
})
```

```typescript
// Dùng trong component
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/useAuthStore'

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)  // reactive destructure
```

---

## 9. Components — Phân loại & Cách dùng

### shadcn-vue Components (`src/components/ui/`)

Thêm component qua CLI — không tạo file thủ công:

```bash
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add tooltip
```

**Components đã có sẵn:**

| Component | Import từ | Dùng khi |
|---|---|---|
| `Button` | `@/components/ui/button` | Mọi nút bấm |
| `Input` | `@/components/ui/input` | Text input |
| `Textarea` | `@/components/ui/textarea` | Multi-line input |
| `Label` | `@/components/ui/label` | Label cho form field |
| `Select` | `@/components/ui/select` | Dropdown chọn |
| `Checkbox` | `@/components/ui/checkbox` | Checkbox |
| `Switch` | `@/components/ui/switch` | Toggle switch |
| `Dialog` | `@/components/ui/dialog` | Modal/popup |
| `Sheet` | `@/components/ui/sheet` | Drawer từ cạnh màn hình |
| `Form` + sub | `@/components/ui/form` | Form wrapper + VeeValidate |
| `Tabs` | `@/components/ui/tabs` | Tab navigation |
| `Badge` | `@/components/ui/badge` | Tag/badge |
| `Card` | `@/components/ui/card` | Card container |
| `Separator` | `@/components/ui/separator` | Đường phân cách |
| `Sonner` | `@/components/ui/sonner` | Mount toast (đã có trong App.vue) |

> **Không có `Table` component** — dùng `@tanstack/vue-table` cho bảng dữ liệu.

**Quy tắc:** Luôn dùng component từ `@/components/ui/` — không dùng `<button>`, `<input>`, `<select>` HTML thuần.

---

## 10. Theme & Dark Mode

Khi viết Tailwind classes, luôn thêm variant `dark:`:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
<p class="text-gray-700 dark:text-gray-400">Nội dung</p>
<div class="border border-gray-200 dark:border-gray-800">
```

---

## 11. Sidebar & Navigation

`AppSidebar.vue` có logic phức tạp — **không được tái tạo**. Khi chỉnh sửa Sidebar: **chỉ thay `<template>`, giữ nguyên toàn bộ `<script setup>`**.

### Cấu trúc `menuGroups`

```typescript
const menuGroups = [
  {
    title: 'MENU',
    items: [
      {
        icon: HomeIcon,       // Component từ @/icons
        name: 'Dashboard',
        path: '/',
      },
      {
        icon: SettingsIcon,
        name: 'Cài đặt',
        subItems: [           // Có submenu
          { name: 'Cửa hàng', path: '/config-store', pro: false, new: false },
        ],
      },
    ],
  },
]
```

### `useSidebar()` — Các giá trị có sẵn

```typescript
import { useSidebar } from '@/composables/useSidebar'

const {
  isExpanded,
  isMobileOpen,
  isHovered,
  openSubmenu,
  toggleSidebar,
  toggleMobileSidebar,
} = useSidebar()
```

---

## 12. TypeScript Types — Đặt ở đâu?

```
Type dùng toàn app         → src/types/common.ts
Type của 1 feature         → src/types/{feature}.ts
Type chỉ trong 1 component → khai báo trực tiếp trong file đó
```

Không dùng `any`. Luôn định nghĩa interface cho mọi data từ API.

---

## 13. Icons — Dùng thế nào?

### Custom SVG Icons (`src/icons/`) — Sidebar menu

```typescript
import { HomeIcon, BoxIcon, SettingsIcon } from '@/icons'
```

```vue
<HomeIcon class="w-5 h-5" />
```

### Lucide Icons (`lucide-vue-next`) — Nội dung trang

```typescript
import { Search, Plus, Trash2, Edit2 } from 'lucide-vue-next'
```

```vue
<Search class="w-4 h-4 text-gray-500" />
```

**Quy tắc:** Sidebar menu → `@/icons`. Buttons, badges, nội dung trang → Lucide.

---

## 14. Form & Validation

Luôn dùng VeeValidate + Zod — không validation thủ công.

```vue
<template>
  <Form @submit="onSubmit">
    <FormField name="name" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Tên sản phẩm</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Nhập tên..." />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit">Lưu</Button>
  </Form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = toTypedSchema(z.object({
  name: z.string().min(1, 'Bắt buộc nhập tên'),
  price: z.number({ invalid_type_error: 'Phải là số' }).positive('Giá phải > 0'),
}))

const { handleSubmit } = useForm({ validationSchema: schema })
const onSubmit = handleSubmit((values) => {
  // values đã được validate và typed
})
</script>
```

---

## 15. Bảng dữ liệu — TanStack Table

```vue
<script setup lang="ts">
import { ref, h } from 'vue'
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'

interface Product { id: string; name: string; price: number }

const data = ref<Product[]>([])
const sorting = ref<SortingState>([])

const columns: ColumnDef<Product>[] = [
  { accessorKey: 'name', header: 'Tên sản phẩm' },
  { accessorKey: 'price', header: 'Giá' },
  {
    id: 'actions',
    cell: ({ row }) => h(Button, { onClick: () => edit(row.original) }, () => 'Sửa'),
  },
]

const table = useVueTable({
  get data() { return data.value },
  columns,
  state: { get sorting() { return sorting.value } },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

function edit(product: Product) { /* ... */ }
</script>
```

---

## 16. Notifications — vue-sonner

```typescript
import { toast } from 'vue-sonner'

toast.success('Lưu thành công')
toast.error('Đã xảy ra lỗi')
toast.warning('Cảnh báo')
toast('Thông báo thường')
```

> **Không dùng** `Toast` từ shadcn-vue — dự án dùng `vue-sonner` thay thế.

---

## 17. Color tokens — Dùng màu đúng cách

Luôn dùng token của dự án, không dùng màu Tailwind generic (blue-500, green-500...).

| Token | Màu | Dùng khi |
|---|---|---|
| `brand-500` | `#465fff` | Primary action, link, active |
| `brand-600` | `#3641f5` | Hover trên brand-500 |
| `brand-50` | `#ecf3ff` | Background nhạt brand |
| `success-500` | `#12b76a` | Thành công |
| `success-50` | `#ecfdf3` | Background nhạt success |
| `error-500` | `#f04438` | Lỗi, xóa |
| `error-50` | `#fef3f2` | Background nhạt error |
| `warning-500` | `#f79009` | Cảnh báo |
| `warning-50` | `#fffaeb` | Background nhạt warning |
| `gray-900` | `#101828` | Text chính |
| `gray-700` | `#344054` | Text phụ |
| `gray-500` | `#667085` | Placeholder, text mờ |
| `gray-300` | `#d0d5dd` | Border |
| `gray-200` | `#e4e7ec` | Border nhạt |
| `gray-100` | `#f2f4f7` | Background nhạt |
| `gray-50` | `#f9fafb` | Background trang |

```html
<!-- ✅ Đúng -->
<button class="bg-brand-500 hover:bg-brand-600 text-white">Lưu</button>
<span class="text-success-500 bg-success-50">Thành công</span>

<!-- ❌ Sai -->
<button class="bg-blue-500 hover:bg-blue-600">Lưu</button>
<span class="text-green-500">Thành công</span>
```

---

## 18. Quy tắc đặt tên

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Vue component | PascalCase | `UserProfile.vue` |
| View (page) | PascalCase | `ProductList.vue` |
| Composable | camelCase, prefix `use` | `useSidebar.ts` |
| Pinia store | camelCase, prefix `use`, suffix `Store` | `useAuthStore.ts` |
| Type file | camelCase | `common.ts`, `product.ts` |
| Route name | PascalCase | `'ProductList'` |
| Route path | kebab-case | `'/product-list'` |

---

## 19. Checklist khi tạo tính năng mới

```
[ ] Tạo view file: src/views/Module/Page.vue
[ ] Thêm route vào src/router/index.ts (lazy import, meta.title)
[ ] Thêm menu item vào AppSidebar.vue (nếu cần)
[ ] Bọc view trong <AdminLayout> + <PageBreadcrumb>
[ ] Định nghĩa TypeScript interface cho data (không dùng any)
[ ] Dùng @/components/ui/ cho mọi form controls
[ ] Thêm dark: variant cho mọi Tailwind color class
[ ] Dùng color tokens của dự án (brand-500, gray-700...)
[ ] Dùng toast từ vue-sonner cho thông báo
```

---

## 20. Các lỗi phổ biến cần tránh

### Dùng HTML thuần thay shadcn-vue
```html
<!-- ❌ --> <button class="bg-blue-500">Lưu</button>
<!-- ✅ --> <Button>Lưu</Button>
```

### Dùng màu Tailwind generic
```html
<!-- ❌ --> <span class="text-green-500">OK</span>
<!-- ✅ --> <span class="text-success-500 bg-success-50">OK</span>
```

### Thiếu dark: variant
```html
<!-- ❌ --> <div class="bg-white text-gray-900">
<!-- ✅ --> <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

### Static import trong router
```typescript
// ❌
import ProductList from '../views/Product/ProductList.vue'
{ path: '/products', component: ProductList }

// ✅
{ path: '/products', component: () => import('../views/Product/ProductList.vue') }
```

### Tái tạo logic sidebar
```
// ❌ Viết lại useSidebar, xóa menuGroups
// ✅ Chỉ thêm item vào menuGroups, không đụng script setup
```

### Validation thủ công
```typescript
// ❌ if (!form.name) errors.name = 'Bắt buộc'
// ✅ z.string().min(1, 'Bắt buộc') — dùng Zod schema
```
