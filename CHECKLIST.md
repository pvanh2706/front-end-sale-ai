# CRM Deals E2E Checklist

## Files Added
- prisma/schema.prisma
- prisma/migrations/migration_lock.toml
- prisma/migrations/20260507180000_add_crm_deals/migration.sql
- backend/prisma.mjs
- backend/deals.mjs
- src/types/deals.ts
- src/services/deals.ts
- src/lib/socket.ts

## Files Updated
- backend/server.mjs
- src/services/api.ts
- src/views/Crm/CrmDealsKanbanView.vue
- src/views/Crm/CrmDealDetailView.vue
- package.json

## Implemented Features
- PostgreSQL persistence via Prisma for deals, activities, audit logs.
- Deals CRUD APIs with org scoping from JWT context.
- Dedicated stage update API for drag-drop.
- Soft delete support.
- Audit log write on create/update/delete.
- Socket.IO realtime events: deal.created, deal.updated, deal.deleted.
- Kanban create/edit/delete/drag-drop with optimistic UI.
- Realtime Kanban sync via Socket.IO client listeners.
- Deal detail page loads real data from backend by deal id.

## Required Setup
1. Set DATABASE_URL in environment to PostgreSQL 16.
2. Run: npm install
3. Run: npx prisma generate
4. Run: npx prisma migrate dev --name add_crm_deals
5. Run: npm run dev

## Verification
- Frontend type check: npm run type-check (PASS)
- Backend syntax check:
  - node --check backend/server.mjs (PASS)
  - node --check backend/deals.mjs (PASS)

## Notes
- Migration command currently requires DATABASE_URL to be configured.
- Existing legacy in-memory CRM helpers are still present in server for backward compatibility, but deals flow is now API/DB-based.
