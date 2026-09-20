"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Input, Label } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/lib/languages";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  const [name, setName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [menuLanguage, setMenuLanguage] = useState("");
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
      setError(data.error?.formErrors?.[0] || data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push(plan ? `/dashboard/billing?plan=${plan}` : "/dashboard");
  }

  return (
    <AuthLayout
      title="Create your menu"
      subtitle="Set up your restaurant and start building your menu in minutes."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label>Your name</Label>
          <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <Label>Restaurant name</Label>
          <Input
            required
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="La Belle Table"
          />
        </div>
        <div>
          <Label>What language will you write your menu in?</Label>
          <select
            required
            value={menuLanguage}
            onChange={(e) => setMenuLanguage(e.target.value)}
            className="w-full rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-ink focus:border-amber focus:outline-none focus:ring-1 focus:ring-amber"
          >
            <option value="" disabled>
              Select a language
            </option>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.englishName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink-soft">
            This is the language you&apos;ll type dish names and ingredients
            in. It gets translated into the other 19 automatically — you can
            change it later in Restaurant settings.
          </p>
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@restaurant.com"
          />
        </div>
        <div>
          <Label>Password</Label>
          <PasswordInput
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating your menu…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="text-amber hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
