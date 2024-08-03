import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

type Liabilities = {
  id: number;
  title: string;
  amount: number;
};

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
  .get("/", (c) => {
    return c.json({ liabilities: dummyData });
  })
  .post("/", zValidator("json", createSchema), async (c) => {
    const data = await c.req.valid("json");
    dummyData.push({ ...data, id: dummyData.length });
    return c.json(data);
  })
  .get("/:id{[0-9]+}", (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const specificData = dummyData.find((data) => data.id === id);
    if (!specificData) {
      return c.notFound();
    }
    return c.json({ specificData });
  });
