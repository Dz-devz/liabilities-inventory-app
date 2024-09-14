import { zValidator } from "@hono/zod-validator";
import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { budget as budgetTable, insertBudgetSchema } from "../db/schema/budget";
import { getProfile } from "../kinde";
import { budgetSchema } from "../types";

export const budgetRoute = new Hono()
  .get("/", getProfile, async (c) => {
    const user = c.var.user;

    const budget = await db
      .select()
      .from(budgetTable)
      .orderBy(desc(budgetTable.createdAt));

    return c.json({ budget: budget });
  })
  .post("/", getProfile, zValidator("json", budgetSchema), async (c) => {
    const data = await c.req.valid("json");
    const user = c.var.user;

    const validatedBudget = insertBudgetSchema.parse({
      ...data,
      userId: user.id,
    });

    const result = await db
      .insert(budgetTable)
      .values(validatedBudget)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  });
