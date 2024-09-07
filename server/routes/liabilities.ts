import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, inArray, sum } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db";
import {
  insertLiabilitiesSchema,
  liabilities as liabilitiesTable,
} from "../db/schema/liabilities";
import { getProfile } from "../kinde";
import { liabilitiesSchema } from "../types";

export const liabilitiesRoute = new Hono()
  .get("/", getProfile, async (c) => {
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
      .where(eq(liabilitiesTable.userId, user.id));

    return c.json({ singleLiabilities: singleLiabilities });
  })
  .post("/", getProfile, zValidator("json", liabilitiesSchema), async (c) => {
    const data = await c.req.valid("json");
    const user = c.var.user;

    const validatedLiability = insertLiabilitiesSchema.parse({
      ...data,
      userId: user.id,
    });

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
      .where(eq(liabilitiesTable.userId, user.id))
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
