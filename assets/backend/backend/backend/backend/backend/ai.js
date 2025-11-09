import fetch from "node-fetch";
import { formatWithCitations } from "./format.js";

export async function synthesizeAnswer(prompt, results) {
  const apiUrl = process.env.OPENAI_API_URL;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  // If no AI key, return a friendly placeholder using search snippets only
  if (!apiUrl || !apiKey) {
    return formatWithCitations(prompt, results, "यह demo उत्तर है। Backend AI key सेट करने पर मैं real, संदर्भित जवाब दूँगा।");
  }

  const system = `You are India GPT. Provide accurate, concise answers for users in India.
- Use the web search snippets provided to ground your answer.
- Include inline citations as [1], [2], etc. that map to the sources list.
- Keep tone polite and clear.`;

  const sourcesText = results.map((r, i) => `[${i + 1}] ${r.name} — ${r.url}`).join("\n");
  const snippetsText = results.map((r, i) => `[${i + 1}] ${r.snippet}`).join("\n");

  const messages = [
    { role: "system", content: system },
    { role: "user", content: `Question: ${prompt}\n\nSources:\n${sourcesText}\n\nSnippets:\n${snippetsText}\n\nUse sources above to answer with citations.` }
  ];

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("AI error:", res.status, text);
    return formatWithCitations(prompt, results, "AI service error. कृपया बाद में पुनः प्रयास करें।");
  }

  const data = await res.json();
  const answer = data.choices?.[0]?.message?.content?.trim() || "No answer.";
  return formatWithCitations(prompt, results, answer);
}
