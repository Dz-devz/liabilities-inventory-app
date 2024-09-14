import type { z } from "zod";
import { insertBudgetSchema } from "./db/schema/budget";
import { insertLiabilitiesSchema } from "./db/schema/liabilities";

export const liabilitiesSchema = insertLiabilitiesSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export const budgetSchema = insertBudgetSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export type CreateBudget = z.infer<typeof budgetSchema>;

export type CreateLiabilities = z.infer<typeof liabilitiesSchema>;
