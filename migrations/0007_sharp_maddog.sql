ALTER TABLE "entry_table" DROP CONSTRAINT "entry_table_signature_signature_content_table_signature_fk";
--> statement-breakpoint
ALTER TABLE "entry_table" ALTER COLUMN "signature" SET NOT NULL;
DROP TABLE "signature_content_table";--> statement-breakpoint
