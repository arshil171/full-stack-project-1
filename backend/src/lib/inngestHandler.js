import { serve } from "inngest/express";
import { inngest, functions } from "./inngest.js";

export const inngestHandler = serve({
  client: inngest,
  functions,
});
