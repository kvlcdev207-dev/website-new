import { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import clientPromise from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Keep the token's role in sync with the database so the JWT itself
    // never holds a stale role.
    async jwt({ token }) {
      if (token.email) {
        const client = await clientPromise;
        const db = client.db("kvlc_database");
        const dbUser = await db
          .collection("users")
          .findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },
    // Fetch the latest role from the database on every session check, so a
    // promotion takes effect immediately even if the cached token is old.
    async session({ session, token }) {
      if (session.user?.email) {
        const client = await clientPromise;
        const db = client.db("kvlc_database");
        const dbUser = await db
          .collection("users")
          .findOne({ email: session.user.email });
        if (dbUser) {
          session.user.role = dbUser.role;
        } else {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.email) {
        const client = await clientPromise;
        const db = client.db("kvlc_database");
        // An existing role (for example "admin" after a promotion) must
        // survive a re-login. Only brand-new users default to "user".
        const existing = await db.collection("users").findOne({ email: user.email });
        const role =
          user.email === process.env.SUPER_ADMIN_EMAIL
            ? "superadmin"
            : existing?.role ?? "user";
        await db.collection("users").updateOne(
          { email: user.email },
          {
            $set: {
              name: user.name,
              image: user.image,
              role: role,
              lastLogin: new Date(),
            },
          },
          { upsert: true }
        );
      }
    },
  },
}