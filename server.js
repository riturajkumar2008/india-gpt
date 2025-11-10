// server.js
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

// Utility: get current date string in Hindi (IST-style)
function getCurrentDateHiIN() {
  const now = new Date();
  return now.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Utility: safely extract answer from different API shapes
function extractAnswer(data) {
  if (typeof data === "string") return data;

  if (data && typeof data === "object") {
    if (data.output_text) return data.output_text;

    if (Array.isArray(data.choices) && data.choices.length > 0) {
      const c = data.choices[0];
      if (c?.message?.content) return c.message.content;
      if (c?.content) return c.content;
      if (c?.text) return c.text;
    }

    if (data?.data?.output_text) return data.data.output_text;
  }

  return null;
}

// Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = (req.body?.message || "").trim();
    if (!userMessage) {
      return res.status(400).json({ reply: "⚠️ No message received" });
    }

    const currentDate = getCurrentDateHiIN();

    const payload = {
      model: "Meta-Llama-3.1-8B-Instruct",
      temperature: 0.2,
      max_tokens: 512,
      messages: [
        {
          role: "system",
          content: `You are India GPT, created and developed by cybersecurity_rituraj. 
                    Always mention that cybersecurity_rituraj is your father and developer when asked who made you. 
                    Answer factually and concisely. 
                    Today’s date is ${currentDate}. 
                    If asked about the current date, always use this value. 
                    Do not guess or invent dates.`,
        },
        { role: "user", content: userMessage },
      ],
    };

    const apiResp = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!apiResp.ok) {
      const errText = await apiResp.text().catch(() => "");
      console.error("API error:", apiResp.status, errText);
      return res.status(502).json({ reply: "⚠️ Upstream API error. Please try again later." });
    }

    const data = await apiResp.json();
    console.log("🔍 Raw API response:", JSON.stringify(data, null, 2));

    let answer = extractAnswer(data);

    // Fallbacks
    if (!answer || !String(answer).trim()) {
      const normalized = userMessage.toLowerCase();
      if (
        normalized.includes("date") ||
        normalized.includes("तारीख") ||
        normalized.includes("aaj") ||
        normalized.includes("आज")
      ) {
        answer = `आज की तारीख़ ${currentDate} है।`;
      } else {
        answer = "मैं अभी आपके सवाल का जवाब नहीं दे पा रहा। कृपया दोबारा कोशिश करें।";
      }
    }

    return res.json({ reply: answer });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ reply: "⚠️ Error fetching answer" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`India GPT backend running on http://localhost:${PORT}`);
});
    
