import app from "./app";

Bun.serve({
  fetch: app.fetch,
});

// Node Js for deployment purposes
// add @hono/node-server import
// serve({
//   fetch: app.fetch
// })
