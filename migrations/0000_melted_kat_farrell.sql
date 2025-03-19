CREATE TABLE IF NOT EXISTS "raw_entry_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"space" text NOT NULL,
	"environment" text NOT NULL,
	"entry" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"raw" jsonb NOT NULL,
	"stream" text NOT NULL,
	CONSTRAINT "raw_entry_table_space_environment_entry_stream_unique" UNIQUE("space","environment","entry","stream")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entry_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"by_user" text NOT NULL,
	"version" integer NOT NULL,
	"space" text NOT NULL,
	"environment" text NOT NULL,
	"entry" text NOT NULL,
	"operation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"patch" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "entry_table_space_environment_entry_index" ON "entry_table" USING btree ("space","environment","entry");