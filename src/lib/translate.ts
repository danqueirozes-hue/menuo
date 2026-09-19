/**
 * Pluggable translation provider used when a restaurant publishes its menu.
 * With no API key configured, translation is a no-op: the original text is
 * kept and callers mark it as `translated: false` so the UI can be honest
 * about it instead of pretending every language was actually translated.
 */

type TranslateResult = { text: string; translated: boolean };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Publishing translates in small batches that get retried by the caller
 * (see src/lib/translation-progress.ts) — a pair that fails here just stays
 * untranslated and gets picked up again on the next batch a moment later.
 * So it's better to fail fast than to sit in a long backoff: one stubborn
 * call blocking here for 20+s can push a whole batch past Netlify's edge
 * timeout, which used to abort the client's connection mid-publish even
 * though the server-side work was still completing fine underneath it.
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 1
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, options);
    if (res.status !== 429 || attempt >= maxRetries) return res;

    const retryAfter = parseFloat(res.headers.get("retry-after") ?? "");
    const backoffMs = Number.isFinite(retryAfter)
      ? Math.min(retryAfter * 1000, 1500)
      : 500 + Math.random() * 500;

    await sleep(backoffMs);
  }
}

async function translateWithDeepL(
  text: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const endpoint = apiKey.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const res = await fetchWithRetry(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      target_lang: targetLang.toUpperCase(),
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepL request failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    translations: { text: string }[];
  };
  return data.translations[0]?.text ?? text;
}

async function translateWithGoogle(
  text: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const res = await fetchWithRetry(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, target: targetLang, format: "text" }),
    }
  );

  if (!res.ok) {
    throw new Error(`Google Translate request failed: ${res.status}`);
  }

  const data = (await res.json()) as {
    data: { translations: { translatedText: string }[] };
  };
  return data.data.translations[0]?.translatedText ?? text;
}

export async function translateText(
  text: string,
  targetLang: string
): Promise<TranslateResult> {
  if (!text.trim()) return { text, translated: false };

  const deeplKey = process.env.DEEPL_API_KEY;
  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY;

  try {
    if (deeplKey) {
      return { text: await translateWithDeepL(text, targetLang, deeplKey), translated: true };
    }
    if (googleKey) {
      return { text: await translateWithGoogle(text, targetLang, googleKey), translated: true };
    }
  } catch (err) {
    console.error(`[translate] failed for "${targetLang}":`, err);
  }

  return { text, translated: false };
}

export function hasTranslationProvider(): boolean {
  return Boolean(process.env.DEEPL_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY);
}
