import { signOut } from "@/lib/auth";

// Deliberately outside /dashboard: the auth middleware matches
// "/dashboard/:path*" and refreshes the session cookie on every request
// that carries a valid one. Posting the sign-out here means that
// refresh never runs on this request, so the response carries a single
// clearing Set-Cookie instead of racing against a renewed one — which
// on Netlify was resolved in the renewed cookie's favor, leaving the
// user still signed in after clicking "Log out".
export async function POST() {
  await signOut({ redirectTo: "/" });
}
