const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Example API route
app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message;
  // Yahan aap apna GPT logic ya API call add karoge
  res.json({ reply: `You said: ${userMessage}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
