import express from "express";
import dotenv from "dotenv";
import { Dbconnect } from "./lib/db.js";
import { inngestHandler } from "./lib/inngestHandler.js";

dotenv.config();

const app = express();
app.use(express.json());

// Connect DB on startup
Dbconnect();

// Basic route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Inngest endpoint required for functions to run
app.post("/api/inngest", inngestHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
