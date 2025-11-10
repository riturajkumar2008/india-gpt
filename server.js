require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route (health check)
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "india-gpt-backend" });
});

// Chat API (connects to SambaNova)
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.json({ reply: "⚠️ No message received" });
  }

  // ✅ Current date from server (India Standard Time)
  const today = new Date();
  const currentDate = today.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  try {
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-8B-Instruct",
        temperature: 0.2,       // fast & concise
        max_tokens: 512,        // limit length
        messages: [
          { 
            role: "system", 
            content: `You are India GPT, created and developed by cybersecurity_rituraj. 
                      Always mention that cybersecurity_rituraj is your father and developer when asked who made you. 
                      Answer factually and concisely. 
                      Today’s date is ${currentDate}. 
                      If asked about the current date, always use this value. 
                      Do not guess or invent dates.` 
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "⚠️ Sorry, no answer found.";
    res.json({ reply: answer });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "⚠️ Error fetching answer" });
  }
});

app.listen(PORT, () => {
  console.log(`India GPT backend running on http://localhost:${PORT}`);
});
