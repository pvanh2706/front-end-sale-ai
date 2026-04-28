### Full Stack hoàn chỉnh

---

#### Nền tảng
| Package | Vai trò |
|---|---|
| **Vue 3** + Composition API | Framework chính |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Vue Router** | Routing |

---

#### Styling & UI
| Package | Vai trò |
|---|---|
| **Tailwind CSS** | Styling toàn bộ giao diện |
| **shadcn-vue** | Modal, Drawer, DatePicker, Dropdown, Tooltip... |
| **@heroicons/vue** | Icon |
| **vue-sonner** | Toast notification |

---

#### Data & State
| Package | Vai trò |
|---|---|
| **Pinia** | Client state (UI state, user session) |
| **TanStack Query** + Axios | Server state, fetch/cache API |

---

#### Bảng dữ liệu
| Package | Vai trò |
|---|---|
| **TanStack Table** | Sort, filter, pagination, select, expand, resize, inline edit |
| **TanStack Virtual** | Render danh sách / bảng dữ liệu lớn |
| **xlsx** | Export Excel/CSV |

---

#### Biểu đồ & Form
| Package | Vai trò |
|---|---|
| **vue-echarts** + echarts | Biểu đồ: line, bar, pie, heatmap... |
| **VeeValidate** + **Zod** | Form validation |

---

#### Phân công trách nhiệm

```
Giao diện layout        → Tailwind + Stitch export
Component phức tạp      → shadcn-vue
Icon                    → heroicons
Notification            → vue-sonner

Bảng dữ liệu           → TanStack Table
Danh sách lớn          → TanStack Virtual
Export                  → xlsx
Biểu đồ                → vue-echarts

API / Cache             → TanStack Query + Axios
Client state            → Pinia
Form validation         → VeeValidate + Zod
Routing                 → Vue Router
```

---

#### Cài đặt 1 lần

```bash
npm install @tanstack/vue-table \
            @tanstack/vue-query \
            @tanstack/vue-virtual \
            echarts vue-echarts \
            @heroicons/vue \
            vue-sonner \
            vee-validate zod \
            xlsx
```

shadcn-vue cài riêng từng component theo nhu cầu:
```bash
npx shadcn-vue@latest add dialog drawer select date-picker tooltip
```

---

#### main.ts

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'
import App from './App.vue'
import './assets/index.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin)
  .mount('#app')
```

---

#### Đánh giá tổng thể

```
UI & Styling            ✅ Tailwind + shadcn-vue + Stitch
Bảng phức tạp          ✅ TanStack Table + Virtual
Biểu đồ                ✅ vue-echarts
API & Cache            ✅ TanStack Query
Form                   ✅ VeeValidate + Zod
Notification           ✅ vue-sonner
Performance            ✅ Vite + Virtual
Type Safety            ✅ TypeScript xuyên suốt
Bundle size            ✅ Tất cả đều nhẹ, headless
```

> Stack này đủ để xây **hầu hết sản phẩm từ trung bình đến phức tạp** — dashboard, admin panel, CRM, ERP... mà không cần thêm gì nữa.