const messagesEl = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const themeToggle = document.getElementById("themeToggle");

// Change this to your backend URL after deploy (Render/Vercel/Railway)
const API_URL = "https://YOUR-BACKEND-URL.example.com/api/chat";

function toggleTheme() {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
}
themeToggle.addEventListener("click", toggleTheme);

function addMessage(role, text) {
  const wrap = document.createElement("div");
  wrap.className = "message";

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role}`;
  avatar.textContent = role === "user" ? "U" : "A";

  const content = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = role === "user" ? "You" : "India GPT";

  const body = document.createElement("div");
  body.className = "content";
  body.textContent = text;

  content.appendChild(meta);
  content.appendChild(body);

  wrap.appendChild(avatar);
  wrap.appendChild(content);

  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(prompt) {
  addMessage("user", prompt);
  sendBtn.disabled = true;
  const thinkingText = "सोच रहा हूँ… ताज़ा जानकारी ला रहा हूँ.";
  addMessage("bot", thinkingText);
  const lastMsg = messagesEl.lastElementChild;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    lastMsg.querySelector(".content").textContent = data.reply;
  } catch (e) {
    // If backend unreachable, redirect to offline page
    window.location.href = "offline.html";
  } finally {
    sendBtn.disabled = false;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;
  input.value = "";
  sendMessage(prompt);
});

// Welcome message
addMessage("bot", "नमस्ते! मैं India GPT हूँ — backend से जुड़ने पर मैं real answers देता हूँ।");
