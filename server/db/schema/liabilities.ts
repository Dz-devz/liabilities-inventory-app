import {
  date,
  index,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const liabilities = pgTable(
  "liabilities",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (liabilities) => {
    return {
      userIdIndex: index("name_idx").on(liabilities.userId),
    };
  }
);

// Schema for inserting a liabilities - can be used to validate API requests
export const insertLiabilitiesSchema = createInsertSchema(liabilities, {
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Amount must be positive and reasonable.",
  }),
});
// Schema for selecting a liabilities - can be used to validate API responses
export const selectLiabilitiesSchema = createSelectSchema(liabilities);
