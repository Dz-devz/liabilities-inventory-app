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
  return {
    startOfMonth: startOfMonth.toISOString().split("T")[0],
    endOfMonth: endOfMonth.toISOString().split("T")[0],
  };
};

const getStartAndEndOfMonthTimeStamp = (date: Date) => {
  // Start of the month at the beginning of the day
  const startOfMonthTimeStamp = new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
  // End of the month at the end of the last day of the month
  const endOfMonthTimeStamp = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  );

  return {
    startOfMonthTimeStamp,
    endOfMonthTimeStamp,
  };
};

// Call the function to get the date range
const { startOfMonthTimeStamp, endOfMonthTimeStamp } =
  getStartAndEndOfMonthTimeStamp(new Date());

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
          gte(liabilitiesTable.date, startOfMonth),
          lt(liabilitiesTable.date, endOfMonth)
        )
      )
      .orderBy(desc(liabilitiesTable.createdAt))
      .limit(100);

    return c.json({ liabilities: liabilities });
  })
  .get("/liabilities-history-date", getProfile, async (c) => {
    const user = c.var.user;

    const liabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(eq(liabilitiesTable.userId, user.id))
      .orderBy(desc(liabilitiesTable.createdAt))
      .limit(100);

    const budget = await db
      .select()
      .from(budgetTable)
      .where(eq(budgetTable.userId, user.id))
      .orderBy(desc(budgetTable.createdAt));

    console.log(liabilities);

    return c.json({ liabilities: liabilities, budget: budget });
  })
  .get("/available-months", getProfile, async (c) => {
    const user = c.var.user;

    const liabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(eq(liabilitiesTable.userId, user.id))
      .orderBy(desc(liabilitiesTable.date));

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-indexed (January = 0)
    const currentYear = currentDate.getFullYear();

    // Extract unique year-month combinations
    const availableMonths = Array.from(
      new Set(
        liabilities
          .map((liability) => {
            const date = new Date(liability.date);
            return `${date.getMonth() + 1} ${date.getFullYear()}`; // Month is 0-indexed
          })
          .filter((monthYear) => {
            const [month, year] = monthYear.split(" ").map(Number);
            return !(month - 1 === currentMonth && year === currentYear); // Exclude current month
          })
      )
    );

    return c.json({ availableMonths });
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
          gte(budgetTable.createdAt, startOfMonthTimeStamp),
          lt(budgetTable.createdAt, endOfMonthTimeStamp)
        )
      )
      .orderBy(desc(budgetTable.createdAt));

    const liabilities = await db
      .select()
      .from(liabilitiesTable)
      .where(
        and(
          eq(liabilitiesTable.userId, user.id),
          gte(liabilitiesTable.date, startOfMonth),
          lt(liabilitiesTable.date, endOfMonth)
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
          gte(liabilitiesTable.date, startOfMonth),
          lt(liabilitiesTable.date, endOfMonth)
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
