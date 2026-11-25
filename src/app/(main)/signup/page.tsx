"use client";

import { Suspense, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Label } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/lib/languages";
import { SITE_LOCALE_COOKIE, SiteLocale, isSiteLocale, localeHref } from "@/lib/landing-content";
import { SIGNUP_CONTENT } from "@/lib/signup-content";
import { trackFunnel } from "@/lib/funnel";

/** ?lang= from the landing CTA, else the site-language cookie, else the
 * browser language. This page only renders on the client (useSearchParams
 * inside Suspense), so reading the cookie here can't cause a mismatch. */
function signupLocale(param: string | null): SiteLocale {
  if (param && isSiteLocale(param)) return param;
  const cookie = document.cookie.match(new RegExp(`(?:^|; )${SITE_LOCALE_COOKIE}=([a-z]{2})`))?.[1];
  if (cookie && isSiteLocale(cookie)) return cookie;
  const browser = navigator.language.slice(0, 2);
  return isSiteLocale(browser) ? browser : "en";
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const interval = searchParams.get("interval") === "annual" ? "annual" : "monthly";
  const [locale] = useState(() => signupLocale(searchParams.get("lang")));
  const t = SIGNUP_CONTENT[locale];
  const [languageNames] = useState(() => new Intl.DisplayNames([locale], { type: "language" }));
  const started = useRef(false);
  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackFunnel("signup_start");
  }

  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [menuLanguage, setMenuLanguage] = useState(() => (locale === "en" ? "" : locale));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, restaurantName, email, password, defaultLanguage: menuLanguage }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(res.status === 409 ? t.emailTaken : data.error?.formErrors?.[0] || t.genericError);
      setLoading(false);
      return;
    }

    trackFunnel("signup_complete");
    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    // Every new account picks a plan and adds a card (14-day free trial)
    // right after signup — see src/lib/billing-gate.ts.
    router.push(plan ? `/dashboard/billing?plan=${plan}&interval=${interval}&welcome=1` : "/dashboard/billing?welcome=1");
  }

  return (
    <AuthLayout title={t.title} subtitle={t.subtitle} homeHref={localeHref(locale)}>
      <form onSubmit={handleSubmit} onFocus={markStarted} className="space-y-5">
        <div>
          <Label>{t.name}</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} />
        </div>
        <div>
          <Label>{t.restaurant}</Label>
          <Input
            required
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder={t.restaurantPlaceholder}
          />
        </div>
        <div>
          <Label>{t.menuLanguage}</Label>
          <select
            required
            value={menuLanguage}
            onChange={(e) => setMenuLanguage(e.target.value)}
            className="w-full rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="" disabled>
              {t.selectLanguage}
            </option>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {locale === "en" ? l.englishName : capitalize(languageNames.of(l.code) ?? l.englishName)}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink-soft">{t.languageHint}</p>
        </div>
        <div>
          <Label>{t.email}</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
          />
        </div>
        <div>
          <Label>{t.password}</Label>
          <PasswordInput
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t.creating : t.submit}
        </Button>
        <p className="text-center text-xs text-ink-soft">
          {t.next}
        </p>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        {t.haveAccount}{" "}
        <Link href="/login" className="text-amber hover:underline">
          {t.login}
        </Link>
      </p>
    </AuthLayout>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
