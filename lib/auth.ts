import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { accounts, sessions, users, verificationTokens } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

export const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

/**
 * MVP shortcut: a "demo" sign-in that only asks for a name. No password, no email.
 * On by default until Google is configured; force it with DEMO_LOGIN=true, off with DEMO_LOGIN=false.
 */
export const demoLoginEnabled = process.env.DEMO_LOGIN ? process.env.DEMO_LOGIN === "true" : !googleConfigured;

const demoProvider = Credentials({
  id: "demo",
  name: "Demo",
  credentials: { name: { label: "Your name", type: "text" } },
  async authorize(credentials) {
    const name = String(credentials?.name ?? "").trim().slice(0, 40);
    if (name.length < 2) return null;
    const email = `demo-${slugify(name)}@demo.nestvote.local`;
    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing) return { id: existing.id, name: existing.name, email: existing.email };
    const [created] = await db.insert(users).values({ name, email }).returning();
    return { id: created.id, name: created.name, email: created.email };
  },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    ...(googleConfigured ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })] : []),
    ...(demoLoginEnabled ? [demoProvider] : []),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
});
