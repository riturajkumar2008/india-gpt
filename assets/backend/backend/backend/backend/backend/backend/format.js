export function formatWithCitations(prompt, results, answer) {
  // Ensure inline [1], [2] exist; append sources if missing
  const hasInline = /

\[\d+\]

/.test(answer);
  const sourcesList = results.map(r => `[${r.idx}] ${r.name} — ${r.url}`).join("\n");

  let final = answer;
  if (!hasInline && results.length) {
    // Append generic citations if not present
    const tags = results.slice(0, 2).map(r => `[${r.idx}]`).join("");
    final = `${answer} ${tags}`.trim();
  }

  if (results.length) {
    final += `\n\nSources:\n${sourcesList}`;
  }

  return final;
}
