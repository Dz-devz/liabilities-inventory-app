import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { liabilitiesRoute } from "./routes/liabilities";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/liabilities", liabilitiesRoute);

app.get("*", serveStatic({ root: "./client/dist" }));
app.get("*", serveStatic({ path: "./client/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
