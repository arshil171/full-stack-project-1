import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

import { Dbconnect } from "./lib/db.js";
// import { signuRoute } from "./routes/signupRoute.js";

import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLINT_URL, credentials: true }));

// Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

// routes
// app.use("/signup", signuRoute);

app.get("/books", (req, res) => {
  res.status(200).json({ message: "hello Arshil" });
});

// production build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// start server
const startServer = async () => {
  try {
    await Dbconnect();

    app.listen(process.env.PORT, () => {
      console.log("Server running at", process.env.PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
  