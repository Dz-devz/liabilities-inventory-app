import { Hono } from "hono";
import { logger } from "hono/logger";
import { liabilitiesRoute } from "./routes/liabilities";

const app = new Hono();

app.use("*", logger());

app.get("/test", (c) => {
  return c.json({ message: "test" });
});

app.route("/api/liabilities", liabilitiesRoute);

export default app;
