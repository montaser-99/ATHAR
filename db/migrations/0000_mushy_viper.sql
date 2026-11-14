CREATE TYPE "public"."fact_key" AS ENUM('identity_overview', 'egypt_availability', 'registration_requirements', 'registration_steps', 'tests_acceptance', 'payment_methods', 'withdrawal_conditions', 'work_types', 'experience_level', 'eligibility', 'official_links');--> statement-breakpoint
CREATE TYPE "public"."needs_review_reason" AS ENUM('overdue', 'disputed', 'contradicted');--> statement-breakpoint
CREATE TYPE "public"."platform_availability" AS ENUM('available', 'available_with_restrictions', 'unavailable', 'suspended_or_closed', 'not_yet_confirmed');--> statement-breakpoint
CREATE TYPE "public"."platform_lifecycle" AS ENUM('draft', 'published', 'unpublished', 'merged');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('platform_document', 'athar_test', 'third_party_report', 'user_reports_support');--> statement-breakpoint
CREATE TYPE "public"."platform_status_history_kind" AS ENUM('availability', 'warning', 'lifecycle');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('verified', 'needs_review', 'unconfirmed');--> statement-breakpoint
CREATE TYPE "public"."vocabulary_type" AS ENUM('category', 'work_type', 'opportunity_type', 'experience_level', 'payment_method');--> statement-breakpoint
CREATE TYPE "public"."warning_case_status" AS ENUM('triage', 'open', 'lifted', 'replaced_by_note', 'closed_as_suspended');--> statement-breakpoint
CREATE TYPE "public"."warning_intake_basis" AS ENUM('multiple_independent_reports', 'documented_report', 'official_notice');--> statement-breakpoint
CREATE TABLE "fact_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_id" uuid NOT NULL,
	"fact_key" "fact_key" NOT NULL,
	"value_text" varchar(4000),
	"is_visible" boolean DEFAULT false NOT NULL,
	"last_edited_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fact_items_platform_key_unique" UNIQUE("platform_id","fact_key"),
	CONSTRAINT "fact_items_egypt_availability_has_no_value" CHECK ("fact_items"."fact_key" <> 'egypt_availability' OR "fact_items"."value_text" IS NULL)
);
--> statement-breakpoint
CREATE TABLE "fact_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fact_item_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"url" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_id" uuid NOT NULL,
	"kind" "platform_status_history_kind" NOT NULL,
	"from_value" varchar(50) NOT NULL,
	"to_value" varchar(50) NOT NULL,
	"note" varchar(500),
	"source_summary" varchar(300),
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approval_request_id" uuid
);
--> statement-breakpoint
CREATE TABLE "platform_vocabulary_links" (
	"platform_id" uuid NOT NULL,
	"vocabulary_value_id" uuid NOT NULL,
	CONSTRAINT "platform_vocabulary_links_platform_id_vocabulary_value_id_pk" PRIMARY KEY("platform_id","vocabulary_value_id")
);
--> statement-breakpoint
CREATE TABLE "platforms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(150) NOT NULL,
	"lifecycle" "platform_lifecycle" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"availability_state" "platform_availability" DEFAULT 'not_yet_confirmed' NOT NULL,
	"restriction_note" varchar(500),
	"warning_active" boolean DEFAULT false NOT NULL,
	"merged_into_platform_id" uuid,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "platforms_slug_unique" UNIQUE("slug"),
	CONSTRAINT "platforms_restriction_note_required" CHECK ("platforms"."availability_state" <> 'available_with_restrictions' OR "platforms"."restriction_note" IS NOT NULL),
	CONSTRAINT "platforms_no_self_merge" CHECK ("platforms"."merged_into_platform_id" IS NULL OR "platforms"."merged_into_platform_id" <> "platforms"."id")
);
--> statement-breakpoint
CREATE TABLE "popularity_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_id" uuid NOT NULL,
	"distinct_users" integer NOT NULL,
	"window_days" integer NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "popularity_snapshots_non_negative" CHECK ("popularity_snapshots"."distinct_users" >= 0 AND "popularity_snapshots"."window_days" > 0)
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fact_item_id" uuid NOT NULL,
	"type" "source_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"url" text,
	"accessed_on" date NOT NULL,
	"test_scope" varchar(300),
	"added_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sources_athar_test_requires_scope" CHECK ("sources"."type" <> 'athar_test' OR "sources"."test_scope" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "verification_records" (
	"fact_item_id" uuid PRIMARY KEY NOT NULL,
	"status" "verification_status" DEFAULT 'unconfirmed' NOT NULL,
	"needs_review_reason" "needs_review_reason",
	"last_verified_on" date,
	"next_due_at" timestamp with time zone,
	"reviewer_account_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocabulary_values" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "vocabulary_type" NOT NULL,
	"slug" varchar(80) NOT NULL,
	"label_ar" varchar(100) NOT NULL,
	"label_latin" varchar(100),
	"display_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocabulary_values_type_slug_unique" UNIQUE("type","slug")
);
--> statement-breakpoint
CREATE TABLE "warning_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform_id" uuid NOT NULL,
	"intake_basis" "warning_intake_basis" NOT NULL,
	"status" "warning_case_status" NOT NULL,
	"opened_at" timestamp with time zone NOT NULL,
	"triage_due_at" timestamp with time zone,
	"next_review_due_at" timestamp with time zone,
	"resolve_by" timestamp with time zone,
	"public_note" varchar(500),
	"approval_request_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fact_items" ADD CONSTRAINT "fact_items_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fact_links" ADD CONSTRAINT "fact_links_fact_item_id_fact_items_id_fk" FOREIGN KEY ("fact_item_id") REFERENCES "public"."fact_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_status_history" ADD CONSTRAINT "platform_status_history_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_vocabulary_links" ADD CONSTRAINT "platform_vocabulary_links_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_vocabulary_links" ADD CONSTRAINT "platform_vocabulary_links_vocabulary_value_id_vocabulary_values_id_fk" FOREIGN KEY ("vocabulary_value_id") REFERENCES "public"."vocabulary_values"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_merged_into_fk" FOREIGN KEY ("merged_into_platform_id") REFERENCES "public"."platforms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_fact_item_id_verification_records_fact_item_id_fk" FOREIGN KEY ("fact_item_id") REFERENCES "public"."verification_records"("fact_item_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_records" ADD CONSTRAINT "verification_records_fact_item_id_fact_items_id_fk" FOREIGN KEY ("fact_item_id") REFERENCES "public"."fact_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warning_cases" ADD CONSTRAINT "warning_cases_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "fact_items_platform_idx" ON "fact_items" USING btree ("platform_id","fact_key");--> statement-breakpoint
CREATE INDEX "fact_links_item_position_idx" ON "fact_links" USING btree ("fact_item_id","position");--> statement-breakpoint
CREATE INDEX "platform_status_history_platform_date_idx" ON "platform_status_history" USING btree ("platform_id","occurred_at");--> statement-breakpoint
CREATE INDEX "platform_vocabulary_links_value_platform_idx" ON "platform_vocabulary_links" USING btree ("vocabulary_value_id","platform_id");--> statement-breakpoint
CREATE INDEX "platforms_lifecycle_published_idx" ON "platforms" USING btree ("lifecycle","published_at");--> statement-breakpoint
CREATE INDEX "platforms_availability_idx" ON "platforms" USING btree ("availability_state","lifecycle");--> statement-breakpoint
CREATE INDEX "popularity_snapshots_platform_computed_idx" ON "popularity_snapshots" USING btree ("platform_id","computed_at");--> statement-breakpoint
CREATE INDEX "sources_fact_item_idx" ON "sources" USING btree ("fact_item_id");--> statement-breakpoint
CREATE INDEX "vocabulary_values_active_type_order_idx" ON "vocabulary_values" USING btree ("type","is_active","display_order");--> statement-breakpoint
CREATE INDEX "warning_cases_platform_status_idx" ON "warning_cases" USING btree ("platform_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "warning_cases_one_open_per_platform_idx" ON "warning_cases" USING btree ("platform_id") WHERE "warning_cases"."status" IN ('triage', 'open');