import fetch from "node-fetch";

const MAX_RESULTS = 5;

export async function searchWeb(query) {
  const endpoint = process.env.BING_SEARCH_ENDPOINT;
  const key = process.env.BING_SEARCH_KEY;
  if (!endpoint || !key) {
    // Fallback: no search, return empty
    return [];
  }

  const url = new URL(endpoint);
  url.searchParams.set("q", query);
  url.searchParams.set("mkt", "en-IN");
  url.searchParams.set("count", String(MAX_RESULTS));

  const res = await fetch(url.toString(), {
    headers: { "Ocp-Apim-Subscription-Key": key }
  });

  if (!res.ok) {
    console.error("Search error:", res.status, await res.text());
    return [];
  }

  const data = await res.json();

  const webPages = data.webPages?.value || [];
  return webPages.slice(0, MAX_RESULTS).map((item, idx) => ({
    idx: idx + 1,
    name: item.name,
    snippet: item.snippet,
    url: item.url
  }));
}
