ALTER TABLE "fact_items" DROP CONSTRAINT "fact_items_platform_id_platforms_id_fk";
--> statement-breakpoint
ALTER TABLE "platform_status_history" DROP CONSTRAINT "platform_status_history_platform_id_platforms_id_fk";
--> statement-breakpoint
ALTER TABLE "platform_vocabulary_links" DROP CONSTRAINT "platform_vocabulary_links_platform_id_platforms_id_fk";
--> statement-breakpoint
ALTER TABLE "warning_cases" DROP CONSTRAINT "warning_cases_platform_id_platforms_id_fk";
--> statement-breakpoint
ALTER TABLE "fact_items" ADD CONSTRAINT "fact_items_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_status_history" ADD CONSTRAINT "platform_status_history_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform_vocabulary_links" ADD CONSTRAINT "platform_vocabulary_links_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "warning_cases" ADD CONSTRAINT "warning_cases_platform_id_platforms_id_fk" FOREIGN KEY ("platform_id") REFERENCES "public"."platforms"("id") ON DELETE restrict ON UPDATE no action;