-- CreateEnum
CREATE TYPE "DealStage" AS ENUM ('new', 'preparing', 'contacted', 'negotiating', 'quoted', 'won', 'lost');

-- CreateTable
CREATE TABLE "crm_deals" (
  "id" UUID NOT NULL,
  "org_id" UUID NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "stage" "DealStage" NOT NULL DEFAULT 'new',
  "pipeline_id" UUID NOT NULL,
  "value" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "currency" VARCHAR(3) NOT NULL DEFAULT 'VND',
  "probability" INTEGER NOT NULL DEFAULT 0,
  "source" VARCHAR(50),
  "contact_id" UUID,
  "company_id" UUID,
  "contact_name" VARCHAR(255),
  "company_name" VARCHAR(255),
  "assignee_id" UUID NOT NULL,
  "expected_close_date" DATE,
  "ai_score" INTEGER,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "last_activity_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "deleted_at" TIMESTAMPTZ,
  "crm_id" VARCHAR(255),
  CONSTRAINT "crm_deals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_activities" (
  "id" UUID NOT NULL,
  "deal_id" UUID NOT NULL,
  "org_id" UUID NOT NULL,
  "type" VARCHAR(50) NOT NULL,
  "title" VARCHAR(255) NOT NULL,
  "metadata" JSONB,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "deal_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL,
  "org_id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "entity" VARCHAR(50) NOT NULL,
  "entity_id" UUID NOT NULL,
  "action" VARCHAR(50) NOT NULL,
  "metadata" JSONB,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "crm_deals_org_id_stage_idx" ON "crm_deals"("org_id", "stage");
CREATE INDEX "crm_deals_org_id_assignee_id_idx" ON "crm_deals"("org_id", "assignee_id");
CREATE INDEX "crm_deals_org_id_pipeline_id_idx" ON "crm_deals"("org_id", "pipeline_id");
CREATE INDEX "crm_deals_org_id_last_activity_at_idx" ON "crm_deals"("org_id", "last_activity_at" DESC);
CREATE INDEX "deal_activities_org_id_deal_id_created_at_idx" ON "deal_activities"("org_id", "deal_id", "created_at" DESC);
CREATE INDEX "audit_logs_org_id_entity_entity_id_created_at_idx" ON "audit_logs"("org_id", "entity", "entity_id", "created_at" DESC);

-- Foreign Keys
ALTER TABLE "deal_activities"
  ADD CONSTRAINT "deal_activities_deal_id_fkey"
  FOREIGN KEY ("deal_id") REFERENCES "crm_deals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
