import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { getProfile } from "../kinde";

const liabilitiesSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(2).max(50),
  amount: z.number().int().positive(),
});

type Liabilities = z.infer<typeof liabilitiesSchema>;

const createSchema = z.object({
  title: z.string().min(2).max(50),
  amount: z.number().int().positive(),
});

const dummyData: Liabilities[] = [
  {
    id: 1,
    title: "Food",
    amount: 200,
  },
  {
    id: 2,
    title: "Commute",
    amount: 100,
  },
  {
    id: 3,
    title: "Internet",
    amount: 800,
  },
  {
    id: 4,
    title: "Medical",
    amount: 500,
  },
  {
    id: 5,
    title: "Etc",
    amount: 1000,
  },
];

export const liabilitiesRoute = new Hono()
  .get("/", getProfile, (c) => {
    return c.json({ liabilities: dummyData });
  })
  .post("/", getProfile, zValidator("json", createSchema), async (c) => {
    const data = await c.req.valid("json");
    dummyData.push({ ...data, id: dummyData.length });
    c.status(201);
    return c.json(data);
  })
  .get("/total-drained", getProfile, (c) => {
    const total = dummyData.reduce((acc, data) => acc + data.amount, 0);
    return c.json({ total });
  })
  .get("/:id{[0-9]+}", getProfile, (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const specificData = dummyData.find((data) => data.id === id);
    if (!specificData) {
      return c.notFound();
    }
    return c.json({ specificData });
  })
  .delete("/:id{[0-9]+}", getProfile, (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const indexData = dummyData.findIndex((data) => data.id === id);
    if (indexData === 0) {
      return c.notFound();
    }
    const deletedData = dummyData.splice(indexData, 1)[0];
    return c.json({ data: deletedData });
  });
