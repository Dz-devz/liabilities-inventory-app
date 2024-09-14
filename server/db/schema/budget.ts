import {
  index,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const budget = pgTable(
  "budget",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    limit: numeric("limit", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (budget) => {
    return {
      userIdIndex: index("user_id_idx").on(budget.userId),
    };
  }
);

// Schema for inserting a budget - can be used to validate API requests
export const insertBudgetSchema = createInsertSchema(budget, {
  limit: z.string().min(2, { message: "Title must be at least 2 characters" }),
});

// Schema for selecting a budget - can be used to validate API responses
export const selectBudget = createSelectSchema(budget);
