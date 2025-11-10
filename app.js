const messagesEl = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const themeToggle = document.getElementById("themeToggle");

// ✅ Backend URL
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

// Typing indicator
function showTyping() {
  const wrap = document.createElement("div");
  wrap.className = "message typing";
  wrap.innerHTML = `
    <div class="avatar bot">A</div>
    <div class="content">⌛ GPT is typing...</div>
  `;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return wrap;
}

// Inline error message + retry
function showErrorInline(details = "⚠️ Connection failed.") {
  const wrap = document.createElement("div");
  wrap.className = "message error";
  wrap.innerHTML = `
    <div class="avatar bot">A</div>
    <div class="content">
      ${details}
      <div style="margin-top:8px;">
        <button id="retryBtn" class="btn">Retry</button>
      </div>
    </div>`;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const retryBtn = wrap.querySelector("#retryBtn");
  retryBtn.addEventListener("click", () => {
    const lastUser = [...messagesEl.querySelectorAll(".message")]
      .reverse()
      .find(m => m.querySelector(".meta")?.textContent === "You")
      ?.querySelector(".content")?.textContent;

    if (lastUser) sendMessage(lastUser);
  });
}

// Send message to backend
async function sendMessage(prompt) {
  addMessage("user", prompt);
  sendBtn.disabled = true;

  const typingEl = showTyping();

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt }),
    });
    if (!res.ok) throw new Error(`Network error (${res.status})`);

    const data = await res.json();
    typingEl.querySelector(".content").textContent = data.reply || "⚠️ Empty response.";
  } catch (e) {
    typingEl.remove();
    showErrorInline(e.message || "⚠️ Connection failed.");
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

// Welcome message
addMessage("bot", "नमस्ते! मैं India GPT हूँ 👋");
    
