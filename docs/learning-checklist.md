# Checklist Kiến Thức Cần Học — Trước Khi Code Dự Án

> Đọc file này trước khi bắt đầu code. Đánh dấu ✅ vào mục đã nắm vững.

---

## Mức độ ưu tiên

- 🔴 **Bắt buộc** — Không biết sẽ không code được
- 🟡 **Quan trọng** — Biết để code đúng pattern dự án
- 🟢 **Nên biết** — Giúp code hiệu quả hơn

---

## 1. 🔴 Vue 3 Composition API

> Nền tảng của toàn bộ dự án. Mọi component đều dùng `<script setup>`.

### Cần nắm

- [ ] `<script setup lang="ts">` — syntax và khác gì Options API
- [ ] `ref()` và `reactive()` — khi nào dùng cái nào
- [ ] `computed()` — tính toán phụ thuộc reactive
- [ ] `watch()` và `watchEffect()` — theo dõi thay đổi
- [ ] `onMounted`, `onUnmounted` — lifecycle hooks
- [ ] `defineProps`, `defineEmits` — truyền data giữa component
- [ ] `provide` / `inject` — truyền data không qua props (dự án dùng nhiều)
- [ ] `v-for`, `v-if`, `v-model`, `:class`, `@click` — template directives

### Tài liệu
- https://vuejs.org/guide/essentials/reactivity-fundamentals
- https://vuejs.org/guide/typescript/composition-api

---

## 2. 🔴 TypeScript Cơ Bản

> Toàn bộ dự án dùng TypeScript. Không biết TS sẽ bị lỗi liên tục.

### Cần nắm

- [ ] `interface` và `type` — định nghĩa shape của object
- [ ] Generic `<T>` — ví dụ: `ApiResponse<T>`, `ref<string>()`
- [ ] Union type: `string | null`, discriminated union
- [ ] `as`, `satisfies` — type assertion
- [ ] `?.` (optional chaining) và `??` (nullish coalescing)
- [ ] Không dùng `any` — luôn khai báo type cụ thể
- [ ] `type` vs `interface` — khi nào dùng cái nào

### Tài liệu
- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- https://vuejs.org/guide/typescript/overview

---

## 3. 🔴 Tailwind CSS

> Toàn bộ styling dùng Tailwind. Không có CSS riêng cho từng component.

### Cần nắm

- [ ] Utility classes cơ bản: spacing (`p-4`, `m-2`), sizing (`w-full`, `h-10`)
- [ ] Flexbox và Grid qua Tailwind: `flex`, `grid`, `gap`, `items-center`
- [ ] Colors: hiểu dự án dùng **custom token** (`brand-500`, `gray-700`...) không dùng `blue-500`
- [ ] Dark mode: `dark:` variant — `dark:bg-gray-900`, `dark:text-white`
- [ ] Responsive: `md:`, `lg:` prefix
- [ ] Hover/Focus states: `hover:`, `focus:`
- [ ] `cn()` helper (tailwind-merge + clsx) — merge classes có điều kiện

### Tài liệu
- https://tailwindcss.com/docs/utility-first
- Xem `src/assets/main.css` để biết color tokens của dự án

---

## 4. 🔴 Vue Router 4

> Dùng để điều hướng giữa các trang.

### Cần nắm

- [ ] Cấu hình route: `path`, `name`, `component`, `meta`
- [ ] Lazy loading: `component: () => import(...)` — **bắt buộc** trong dự án
- [ ] `useRoute()` — đọc route hiện tại (`params`, `query`)
- [ ] `useRouter()` — điều hướng (`push`, `replace`)
- [ ] `<RouterLink>` — link điều hướng trong template
- [ ] `beforeEach` hook — dự án dùng để set `document.title`

### Tài liệu
- https://router.vuejs.org/guide/

---

## 5. 🟡 Pinia (State Management)

> Quản lý state toàn app (user session, auth token...).

### Cần nắm

- [ ] `defineStore()` với Composition API style (dự án dùng style này)
- [ ] `ref()`, `computed()`, `function` bên trong store
- [ ] `storeToRefs()` — destructure store mà không mất reactivity
- [ ] Khi nào dùng Pinia vs local state vs TanStack Query

### Tài liệu
- https://pinia.vuejs.org/core-concepts/

---

## 6. 🟡 TanStack Query (Server State)

> Fetch data từ API, tự động cache, refetch, loading state. Dùng thay cho `ref + axios` thủ công.

### Cần nắm

- [ ] `useQuery()` — fetch và cache dữ liệu: `queryKey`, `queryFn`, `data`, `isLoading`
- [ ] `useMutation()` — gọi API write (POST/PUT/DELETE): `mutationFn`, `onSuccess`, `onError`
- [ ] `useQueryClient()` + `invalidateQueries()` — làm mới cache sau mutation
- [ ] `queryKey` — array unique, dùng để invalidate đúng query
- [ ] Phân biệt `isLoading` vs `isFetching`

### Tài liệu
- https://tanstack.com/query/latest/docs/framework/vue/overview

---

## 7. 🟡 shadcn-vue Components

> UI components copy-paste vào `src/components/ui/`. Cần biết cách dùng đúng.

### Cần nắm

- [ ] **Button** — `variant`, `size`, `disabled`
- [ ] **Input / Textarea / Label** — form controls cơ bản
- [ ] **Select** — `SelectTrigger`, `SelectContent`, `SelectItem`, `v-model`
- [ ] **Dialog** — `DialogTrigger`, `DialogContent`, `DialogHeader`, `open` state
- [ ] **Sheet** — tương tự Dialog nhưng slide từ cạnh
- [ ] **Form + FormField** — wrapper cho VeeValidate (xem section 9)
- [ ] **Tabs** — `TabsList`, `TabsTrigger`, `TabsContent`
- [ ] **Badge / Card / Separator** — layout components

### Tài liệu
- https://www.shadcn-vue.com/docs/components/button

---

## 8. 🟡 VeeValidate + Zod

> Form validation. Mọi form trong dự án đều dùng pattern này.

### Cần nắm

- [ ] **Zod schema**: `z.object()`, `z.string()`, `z.number()`, `z.enum()`
- [ ] Common validators: `.min()`, `.max()`, `.email()`, `.optional()`, `.nullable()`
- [ ] `toTypedSchema()` — convert Zod schema sang VeeValidate schema
- [ ] `useForm({ validationSchema })` — khởi tạo form
- [ ] `handleSubmit(callback)` — xử lý submit, chỉ gọi callback khi valid
- [ ] `FormField` + `v-slot="{ componentField }"` — binding input với VeeValidate
- [ ] `FormMessage` — hiển thị error message

### Tài liệu
- https://vee-validate.logaretm.com/v4/guide/composition-api/getting-started/
- https://zod.dev/

---

## 9. 🟡 TanStack Table

> Bảng dữ liệu phức tạp (sort, filter, pagination). Dùng thay cho `<table>` HTML thuần.

### Cần nắm

- [ ] `ColumnDef<T>[]` — định nghĩa cột: `accessorKey`, `header`, `cell`
- [ ] `useVueTable()` — tạo table instance
- [ ] `getCoreRowModel()` — bắt buộc
- [ ] `getSortedRowModel()` — sorting
- [ ] `getPaginationRowModel()` — phân trang
- [ ] Render template trong `cell` với `h()` hoặc component
- [ ] `table.getHeaderGroups()`, `table.getRowModel().rows` — dùng trong template

### Tài liệu
- https://tanstack.com/table/latest/docs/framework/vue/vue-table

---

## 10. 🟡 Axios + Result Pattern

> HTTP client của dự án. Đã được wrap thành `get/post/put/del` helpers.

### Cần nắm

- [ ] Dùng `get/post/put/del` từ `@/services/api.ts` — không dùng axios trực tiếp
- [ ] `ApiResponse<T>` — discriminated union: `isSuccess: true/false`
- [ ] `isSuccess(result)` type guard — narrow type trước khi dùng `result.data`
- [ ] Interceptors đã có sẵn: tự gắn Bearer token, redirect về /login khi 401

---

## 11. 🟢 Lucide Icons

> Icon library cho nội dung trang.

### Cần nắm

- [ ] Import trực tiếp từ `lucide-vue-next`
- [ ] Dùng props `class` để set size và màu: `class="w-4 h-4 text-gray-500"`
- [ ] Tìm icon tại: https://lucide.dev/icons/

---

## 12. 🟢 @vueuse/core

> Collection composables tiện ích.

### Hay dùng nhất

- [ ] `useStorage()` — sync state với localStorage/sessionStorage
- [ ] `useDebounceFn()` — debounce function (search input)
- [ ] `useMediaQuery()` — detect screen size
- [ ] `useClipboard()` — copy to clipboard
- [ ] `onClickOutside()` — detect click bên ngoài element

### Tài liệu
- https://vueuse.org/functions.html

---

## 13. 🟢 vue-sonner (Toast)

> Notification library. Dùng thay Toast của shadcn-vue.

### Cần nắm

- [ ] `toast.success()`, `toast.error()`, `toast.warning()`, `toast()`
- [ ] Import `toast` từ `'vue-sonner'` — không cần inject, dùng được mọi nơi

---

## 14. 🟢 vue-echarts

> Biểu đồ. Dùng khi cần chart trong dashboard.

### Cần nắm

- [ ] Cấu trúc `option` object của ECharts (title, legend, series, xAxis, yAxis)
- [ ] `VChart` component và props `option`, `autoresize`
- [ ] Các loại chart: line, bar, pie

### Tài liệu
- https://echarts.apache.org/examples/
- https://vue-echarts.dev/

---

## Thứ tự học đề xuất

```
Tuần 1 — Nền tảng bắt buộc
  ├── Vue 3 Composition API (3-4 ngày)
  ├── TypeScript cơ bản (1-2 ngày)
  └── Tailwind CSS (1 ngày)

Tuần 2 — Routing & State
  ├── Vue Router 4 (1 ngày)
  ├── Pinia (1 ngày)
  └── TanStack Query (2 ngày)

Tuần 3 — UI & Form
  ├── shadcn-vue components (1-2 ngày — đọc docs + thử)
  ├── VeeValidate + Zod (1-2 ngày)
  └── TanStack Table (2 ngày)

Tuần 4 — Thực hành
  └── Build 1 trang CRUD hoàn chỉnh (bảng + form + dialog + API + toast)
```

---

## Tài nguyên nhanh

| Công nghệ | Link |
|---|---|
| Vue 3 | https://vuejs.org/guide/introduction |
| TypeScript | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html |
| Tailwind CSS | https://tailwindcss.com/docs |
| Vue Router | https://router.vuejs.org/guide/ |
| Pinia | https://pinia.vuejs.org/core-concepts/ |
| TanStack Query | https://tanstack.com/query/latest/docs/framework/vue/overview |
| TanStack Table | https://tanstack.com/table/latest/docs/framework/vue/vue-table |
| shadcn-vue | https://www.shadcn-vue.com/docs/components/button |
| VeeValidate | https://vee-validate.logaretm.com/v4/ |
| Zod | https://zod.dev/ |
| Lucide Icons | https://lucide.dev/icons/ |
| @vueuse/core | https://vueuse.org/functions.html |
| vue-echarts | https://vue-echarts.dev/ |

---

## Kiểm tra sẵn sàng

Trả lời được các câu hỏi này = sẵn sàng code:

1. Khác gì giữa `ref()` và `reactive()`? Khi nào dùng cái nào?
2. Tại sao phải dùng `storeToRefs()` khi destructure Pinia store?
3. Khi nào dùng TanStack Query thay vì `ref + axios` thủ công?
4. `useQuery` và `useMutation` khác nhau chỗ nào?
5. Tại sao phải check `isSuccess(result)` trước khi dùng `result.data`?
6. `ColumnDef` trong TanStack Table là gì? Cấu trúc cơ bản?
7. Tại sao không dùng `<button>` HTML thuần mà phải dùng `<Button>` từ shadcn-vue?
8. Sự khác nhau giữa route `name` và route `path`?
