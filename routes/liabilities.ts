import { Hono } from "hono";

export const liabilitiesRoute = new Hono()
  .get("/", (c) => {
    return c.json({ liabilities: [] });
  })
  .post("/", (c) => {
    return c.json({});
  });
