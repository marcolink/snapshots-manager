CREATE TABLE IF NOT EXISTS "signature_content_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"space" text NOT NULL,
	"signature" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"data" jsonb NOT NULL,
	CONSTRAINT "signature_content_table_signature_unique" UNIQUE("signature")
);
--> statement-breakpoint
ALTER TABLE "entry_table" ADD COLUMN "signature" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entry_table" ADD CONSTRAINT "entry_table_signature_signature_content_table_signature_fk" FOREIGN KEY ("signature") REFERENCES "public"."signature_content_table"("signature") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
