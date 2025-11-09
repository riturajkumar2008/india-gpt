const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ JSON body parser

// Chat API
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message; // ✅ frontend se "message" aayega
  if (!userMessage) {
    return res.json({ reply: "⚠️ No message received" });
  }
  res.json({ reply: `You said: ${userMessage}` });
});

// Root route (optional)
app.get("/", (req, res) => {
  res.send("India GPT backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

