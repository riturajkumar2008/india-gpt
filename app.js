const messagesEl = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const themeToggle = document.getElementById("themeToggle");

// ✅ Backend URL (easy to change later)
const BACKEND_URL = "https://india-gpt-2.onrender.com/api/chat";

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
}
themeToggle.addEventListener("click", toggleTheme);

// Add message to chat window
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

// ✅ Show typing indicator
function showTyping() {
  const wrap = document.createElement("div");
  wrap.className = "message typing";
  wrap.innerHTML = `<div class="avatar bot">A</div>
                    <div class="content">⌛ GPT is typing...</div>`;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return wrap;
}

// Send message to backend
async function sendMessage(prompt) {
  addMessage("user", prompt);
  sendBtn.disabled = true;

  // Typing indicator
  const typingEl = showTyping();

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    typingEl.querySelector(".content").textContent = data.reply;
  } catch (e) {
    typingEl.querySelector(".content").textContent = "⚠️ Connection failed. Switching offline mode...";
    setTimeout(() => {
      window.location.href = "offline.html";
    }, 1500);
  } finally {
    sendBtn.disabled = false;
  }
}

// Form submit handler
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;
  input.value = "";
  sendMessage(prompt);
});

// Welcome message (short & clean)
addMessage("bot", "नमस्ते! मैं India GPT हूँ 👋");
