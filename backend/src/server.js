import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { inngest, functions } from "./lib/inngest.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import { Dbconnect } from "./lib/db.js";

const app = express();
const __dirname = path.resolve();

// --------------------
// Middleware
// --------------------
app.use(express.json());

// ✅ Environment-aware CORS setup
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        process.env.CLIENT_URL,          // deployed frontend (from .env)
      ]
    : [
        "http://localhost:5173",         // local dev
        process.env.CLIENT_URL           // optional extra
      ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies / auth headers
  })
);

// Clerk middleware (auth)
app.use(clerkMiddleware());

// --------------------
// Routes
// --------------------
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// --------------------
// Static frontend (production)
// --------------------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // catch-all route for SPA
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// --------------------
// Start server
// --------------------
const startServer = async () => {
  try {
    await Dbconnect();
    app.listen(process.env.PORT, () =>
      console.log("✅ Server is running on port:", process.env.PORT)
    );
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
