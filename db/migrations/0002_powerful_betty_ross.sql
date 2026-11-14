ALTER TABLE "platforms" DROP CONSTRAINT "platforms_restriction_note_required";--> statement-breakpoint
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_merged_reference_matches_lifecycle" CHECK (("platforms"."lifecycle" = 'merged') = ("platforms"."merged_into_platform_id" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "platforms" ADD CONSTRAINT "platforms_restriction_note_required" CHECK ("platforms"."availability_state" <> 'available_with_restrictions' OR (length(trim("platforms"."restriction_note")) > 0));
--> statement-breakpoint
CREATE FUNCTION public.athar_prevent_platform_delete() RETURNS trigger
LANGUAGE plpgsql
AS $platform_delete_guard$
BEGIN
  RAISE EXCEPTION 'Platform records cannot be deleted.' USING ERRCODE = 'restrict_violation';
END;
$platform_delete_guard$;
--> statement-breakpoint
CREATE TRIGGER platforms_prevent_delete
BEFORE DELETE ON public.platforms
FOR EACH ROW EXECUTE FUNCTION public.athar_prevent_platform_delete();
