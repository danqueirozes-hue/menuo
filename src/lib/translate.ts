/**
 * Pluggable translation, tried in priority order with automatic fallback:
 * Azure Translator -> DeepL -> Google Translate. Only the providers with an
 * API key configured are tried at all. If the first configured provider
 * throws (rate-limited, down, whatever), the next one is tried immediately
 * for that same call — real redundancy, not just "pick one at startup".
 * With no provider configured at all, translation is a no-op: the original
 * text is kept and callers mark it as `translated: false` so the UI can be
 * honest about it instead of pretending every language was translated.
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

// Azure's language codes mostly match the plain ISO codes used everywhere
// else in this file, with a few exceptions.
const AZURE_LANG_OVERRIDES: Record<string, string> = { zh: "zh-Hans" };

async function translateWithAzure(
  text: string,
  targetLang: string,
  apiKey: string,
  region: string | undefined
): Promise<string> {
  const azureLang = AZURE_LANG_OVERRIDES[targetLang] ?? targetLang;
  const res = await fetchWithRetry(
    `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${azureLang}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        ...(region ? { "Ocp-Apim-Subscription-Region": region } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ Text: text }]),
    }
  );

  if (!res.ok) {
    throw new Error(`Azure Translator request failed: ${res.status}`);
  }

  const data = (await res.json()) as { translations: { text: string }[] }[];
  return data[0]?.translations[0]?.text ?? text;
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

type Provider = { name: string; run: (text: string, targetLang: string) => Promise<string> };

/** Built fresh per call so env vars can change without a redeploy edge case,
 * and so the order (Azure first, DeepL second, Google last) only includes
 * whichever providers actually have a key configured. */
function configuredProviders(): Provider[] {
  const providers: Provider[] = [];

  const azureKey = process.env.AZURE_TRANSLATOR_KEY;
  if (azureKey) {
    const region = process.env.AZURE_TRANSLATOR_REGION;
    providers.push({ name: "Azure", run: (text, lang) => translateWithAzure(text, lang, azureKey, region) });
  }

  const deeplKey = process.env.DEEPL_API_KEY;
  if (deeplKey) {
    providers.push({ name: "DeepL", run: (text, lang) => translateWithDeepL(text, lang, deeplKey) });
  }

  const googleKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (googleKey) {
    providers.push({ name: "Google", run: (text, lang) => translateWithGoogle(text, lang, googleKey) });
  }

  return providers;
}

export async function translateText(
  text: string,
  targetLang: string
): Promise<TranslateResult> {
  if (!text.trim()) return { text, translated: false };

  for (const provider of configuredProviders()) {
    try {
      return { text: await provider.run(text, targetLang), translated: true };
    } catch (err) {
      console.error(`[translate] ${provider.name} failed for "${targetLang}":`, err);
      // fall through to the next configured provider
    }
  }

  return { text, translated: false };
}

export function hasTranslationProvider(): boolean {
  return Boolean(
    process.env.AZURE_TRANSLATOR_KEY || process.env.DEEPL_API_KEY || process.env.GOOGLE_TRANSLATE_API_KEY
  );
}
