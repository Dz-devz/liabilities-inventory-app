import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, inArray, lt, sum } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import { budget as budgetTable } from "../db/schema/budget";
import {
  insertLiabilitiesSchema,
  liabilities as liabilitiesTable,
} from "../db/schema/liabilities";
import { getProfile } from "../kinde";
import { liabilitiesSchema } from "../types";

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

const now = new Date();
const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(now);

export const liabilitiesRoute = new Hono()
  .get("/", getProfile, async (c) => {
    const user = c.var.user;

    const liabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(
        and(
          eq(liabilitiesTable.userId, user.id),
          gte(liabilitiesTable.createdAt, startOfMonth),
          lt(liabilitiesTable.createdAt, endOfMonth)
        )
      )
      .orderBy(desc(liabilitiesTable.createdAt))
      .limit(100);

    return c.json({ liabilities: liabilities });
  })
  .get("/getLiabilitiesHistoryDate", getProfile, async (c) => {
    const user = c.var.user;

    const liabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(eq(liabilitiesTable.userId, user.id))
      .orderBy(desc(liabilitiesTable.createdAt))
      .limit(100);

    return c.json({ liabilities: liabilities });
  })
  .get("/:id{[0-9]+}", getProfile, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));

    const singleLiabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(
        and(eq(liabilitiesTable.userId, user.id), eq(liabilitiesTable.id, id))
      );

    return c.json({ singleLiabilities: singleLiabilities });
  })
  .post("/", getProfile, zValidator("json", liabilitiesSchema), async (c) => {
    const data = await c.req.valid("json");
    const user = c.var.user;

    const budgets = await db
      .select({ limit: budgetTable.limit })
      .from(budgetTable)
      .where(
        and(
          eq(budgetTable.userId, user.id),
          gte(budgetTable.createdAt, startOfMonth),
          lt(budgetTable.createdAt, endOfMonth)
        )
      )
      .orderBy(desc(budgetTable.createdAt));

    const liabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(
        and(
          eq(liabilitiesTable.userId, user.id),
          gte(liabilitiesTable.createdAt, startOfMonth),
          lt(liabilitiesTable.createdAt, endOfMonth)
        )
      )
      .orderBy(desc(liabilitiesTable.createdAt))
      .limit(100);

    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + Number(liability.amount),
      0
    );
    const limit =
      budgets.length > 0 ? Number(budgets[0].limit) - totalLiabilities : 0;

    const validatedLiability = insertLiabilitiesSchema.parse({
      ...data,
      userId: user.id,
    });

    if (limit < Number(data.amount)) {
      return c.json(
        {
          message: "Cannot create more liabilities; budget exceeded.",
        },
        400
      );
    }

    const result = await db
      .insert(liabilitiesTable)
      .values(validatedLiability)
      .returning()
      .then((res) => res[0]);

    c.status(201);
    return c.json(result);
  })
  .get("/total-drained", getProfile, async (c) => {
    const user = c.var.user;
    const result = await db
      .select({ total: sum(liabilitiesTable.amount) })
      .from(liabilitiesTable)
      .where(
        and(
          eq(liabilitiesTable.userId, user.id),
          gte(liabilitiesTable.createdAt, startOfMonth),
          lt(liabilitiesTable.createdAt, endOfMonth)
        )
      )
      .limit(1)
      .then((res) => res[0]);
    return c.json(result);
  })
  .delete("/:id{[0-9]+}", getProfile, async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = c.var.user;

    const indexData = await db
      .delete(liabilitiesTable)
      .where(
        and(eq(liabilitiesTable.userId, user.id), eq(liabilitiesTable.id, id))
      )
      .returning()
      .then((res) => res[0]);

    if (!indexData) {
      return c.notFound();
    }
    return c.json({ indexData: indexData });
  })
  .delete("/", getProfile, async (c) => {
    const { ids } = await c.req.json();
    const user = c.var.user;
    if (!Array.isArray(ids) || ids.length === 0) {
      return c.json({ error: "No IDs provided" }, 400);
    }
    const deletedItems = await db
      .delete(liabilitiesTable)
      .where(
        and(
          eq(liabilitiesTable.userId, user.id),
          inArray(liabilitiesTable.id, ids)
        )
      )
      .returning();
    if (deletedItems.length === 0) {
      return c.json({ error: "No items found for deletion" }, 404);
    }

    return c.json({ deletedItems });
  });
