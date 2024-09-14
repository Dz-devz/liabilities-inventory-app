CREATE TABLE IF NOT EXISTS "budget" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"limit" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "budget" USING btree ("user_id");