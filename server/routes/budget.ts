import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { budget as budgetTable } from "../db/schema/budget";
import { getProfile } from "../kinde";

export const budgetRoute = new Hono().get("/", getProfile, async (c) => {
  const user = c.var.user;

  const budget = await db
    .select()
    .from(budgetTable)
    .orderBy(desc(budgetTable.createdAt));

  return c.json({ budget: budget });
});
