import handler from "./app";
Bun.serve({
  fetch: handler.fetch,
});

console.log("Server is Running");
