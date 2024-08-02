import { Hono } from "hono";

type Liabilities = {
  id: number;
  title: string;
  amount: number;
};

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
  .post("/", async (c) => {
    const data = await c.req.json();
    console.log(data);
    return c.json(data);
  });
