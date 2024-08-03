import { handle } from "@hono/node-server/vercel"; // Ensure this import is correct for Vercel's runtime
import app from "./app"; // Ensure this is correctly exporting the Hono app

// Create the handler for Vercel
const handler = handle(app);

// Export the handler for Vercel to use
export default handler;
