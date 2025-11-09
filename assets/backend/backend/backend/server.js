import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { searchWeb } from "./search.js";
import { synthesizeAnswer } from "./ai.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({
  origin: allowedOrigin,
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "india-gpt-backend" }));

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Invalid prompt" });
    }

    // 1) Web search for fresh context
    const results = await searchWeb(prompt);

    // 2) AI synthesis with citations
    const reply = await synthesizeAnswer(prompt, results);

    return res.json({ reply });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`India GPT backend running on http://localhost:${port}`);
});
