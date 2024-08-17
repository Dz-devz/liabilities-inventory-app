import { insertLiabilitiesSchema } from "./db/schema/liabilities";

export const liabilitiesSchema = insertLiabilitiesSchema.omit({
  userId: true,
  createdAt: true,
});
