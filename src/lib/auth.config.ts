import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no providers, no Prisma/bcrypt. Used directly by
// src/proxy.ts (Next.js middleware) so the Prisma native engine never
// gets bundled into the edge runtime. The full config in auth.ts adds
// the Credentials provider on top of this for server-only usage.
export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
