import type { z } from "zod";
import { insertLiabilitiesSchema } from "./db/schema/liabilities";

export const liabilitiesSchema = insertLiabilitiesSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export type CreateLiabilities = z.infer<typeof liabilitiesSchema>;
