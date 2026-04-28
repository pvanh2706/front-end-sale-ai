---
description: "Convert HTML template files (from Google Stitch or any design export) into Vue 3 components following project conventions. Use when: converting template, stitch to vue, html to vue, tạo trang mới từ template, convert thiết kế."
name: "Convert Template to Vue"
argument-hint: "Path to template file (e.g. template/login-desktop.html) or describe what page to create"
agent: "agent"
---

# Convert HTML Template → Vue 3 Component

You are converting a design template into a production-ready Vue 3 component for the **CodeOn POS / Sales.AI** admin dashboard.

## Project Context

Read [CLAUDE.md](../../CLAUDE.md) for full stack details. Key facts:

- **Stack**: Vue 3 + TypeScript + Tailwind CSS v4 + shadcn-vue (Reka UI) + Vite
- **Color tokens**: Use project tokens (`brand-500`, `gray-700`, `success-500`, `error-500`...) — NOT Tailwind generics (`blue-500`, `green-500`)
- **UI Components**: Always use `@/components/ui/` — never raw HTML for form controls
- **Forms**: vee-validate + zod — no manual validation
- **State**: Pinia stores in `src/stores/`
- **Icons**: lucide-vue-next + custom SVG from `src/icons/`
- **Notifications**: `toast` from `vue-sonner` — not shadcn Toast
- **Dark mode**: Always add `dark:` variants alongside light classes

## Step-by-Step Process

### 1. Read the template file(s)
Use `read_file` to load the HTML template. If multiple breakpoint files exist (mobile/tablet/desktop), read all three.

### 2. Determine page type
- **Auth page** (login, register, forgot password) → use `FullScreenLayout` wrapper
- **Admin page** (dashboard, lists, forms) → use `AdminLayout` + `PageBreadcrumb`

### 3. Create the Vue file

**File path**: `src/views/<Module>/<PageName>.vue`

**Template for auth page:**
```vue
<template>
  <FullScreenLayout>
    <!-- converted content here -->
  </FullScreenLayout>
</template>

<script setup lang="ts">
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
</script>
```

**Template for admin page:**
```vue
<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />
    <!-- converted content here -->
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'

const pageTitle = ref('Page Title')
</script>
```

### 4. Conversion rules

| HTML original | Replace with |
|---|---|
| `<input type="text/email/password">` | `<Input>` from `@/components/ui/input` |
| `<button>` (primary action) | `<Button>` from `@/components/ui/button` |
| `<select>` / dropdown | `<Select>` from `@/components/ui/select` |
| `<textarea>` | `<Textarea>` from `@/components/ui/textarea` |
| `<input type="checkbox">` | `<Checkbox>` from `@/components/ui/checkbox` |
| `<input type="radio/toggle">` | `<Switch>` from `@/components/ui/switch` |
| Modal/popup HTML | `<Dialog>` from `@/components/ui/dialog` |
| Drawer/side panel | `<Sheet>` from `@/components/ui/sheet` |
| Status tags | `<Badge>` from `@/components/ui/badge` |
| Card containers | `<Card>` from `@/components/ui/card` |
| `<hr>` | `<Separator>` from `@/components/ui/separator` |
| Material Icons / SVG icons | lucide-vue-next equivalent |
| Hard-coded list items | `v-for` with `ref([...])` |
| Conditional show/hide | `v-if` / `v-show` |
| `bg-blue-500`, `text-green-500`... | project color tokens (`brand-500`, `success-500`...) |

### 5. Make data reactive
- Replace static text/numbers with `ref()` or `reactive()`
- Replace static lists with `ref<Type[]>([...])`
- Replace hardcoded status/toggle values with `ref(false/true)`

### 6. Responsive layout
- If template has mobile/tablet/desktop variants, combine them using Tailwind breakpoints: `sm:`, `md:`, `lg:`
- Mobile-first: default classes = mobile, then add responsive overrides

### 7. Register route
Add to `src/router/index.ts`:
```ts
{
  path: '/page-path',
  name: 'PageName',
  component: () => import('../views/Module/PageName.vue'),
  meta: { title: 'Page Title' },
}
```
For public pages (no auth required): add `meta: { public: true }`.

### 8. Add to Sidebar (if admin page)
Add item to `menuGroups` in `src/components/layout/AppSidebar.vue` `<script setup>` — **only modify the data, never the script logic**.

### 9. Validate
- Run `get_errors` on the new file
- Fix TypeScript errors
- Confirm no `any` types

## Color Token Reference

| Token | Use |
|---|---|
| `bg-brand-500 hover:bg-brand-600 text-white` | Primary button |
| `text-brand-500` | Link, active state |
| `bg-brand-50 text-brand-500` | Brand badge background |
| `text-success-500 bg-success-50` | Success state |
| `text-error-500 bg-error-50` | Error/delete state |
| `text-warning-500 bg-warning-50` | Warning state |
| `text-gray-900 dark:text-white` | Primary heading |
| `text-gray-700 dark:text-gray-400` | Body text |
| `text-gray-500` | Placeholder / muted |
| `border-gray-200 dark:border-gray-700` | Default border |
| `bg-gray-50 dark:bg-gray-900` | Page background |
| `bg-white dark:bg-gray-800` | Card/panel background |

## Output

1. The Vue component file (created via `create_file`)
2. Route entry added to `src/router/index.ts`
3. (If admin page) Sidebar menu item added
4. Brief summary of what was created
