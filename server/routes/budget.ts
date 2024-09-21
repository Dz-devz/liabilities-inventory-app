import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { budget as budgetTable, insertBudgetSchema } from "../db/schema/budget";
import { getProfile } from "../kinde";
import { budgetSchema } from "../types";

const getMonthName = (date: Date): string => {
  return date.toLocaleString("default", { month: "long" });
};

// Get the start and end of the current month
const getStartAndEndOfMonth = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );
  return { startOfMonth, endOfMonth };
};

export const budgetRoute = new Hono()
  .get("/", getProfile, async (c) => {
    const user = c.var.user;

    // Get current date and month name
    const now = new Date();
    const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(now);

    // Query budgets for the current month
    const budget = await db
      .select()
      .from(budgetTable)
      .where(
        and(
          gte(budgetTable.createdAt, startOfMonth),
          lt(budgetTable.createdAt, endOfMonth)
        )
      )
      .orderBy(desc(budgetTable.createdAt));

    return c.json({
      budget: budget,
    });
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
  })
  .put("/:id", getProfile, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const { limit } = await c.req.json();

    const updateBudget = await db
      .update(budgetTable)
      .set({
        limit: limit,
      })
      .where(and(eq(budgetTable.userId, user.id), eq(budgetTable.id, id)))
      .returning()
      .then((res) => res[0]);

    return c.json({ updateBudget: updateBudget });
  });
