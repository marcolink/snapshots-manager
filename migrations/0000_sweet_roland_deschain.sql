CREATE TABLE IF NOT EXISTS "entry_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"space" text NOT NULL,
	"environment" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"raw_entry" jsonb NOT NULL,
	"patch" jsonb NOT NULL
);
