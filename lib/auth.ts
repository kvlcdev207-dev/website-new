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
    async jwt({ token }) {
      if (token.email) {
        const client = await clientPromise;
        const db = client.db("kvlc_database");
        const user = await db.collection("users").findOne({ email: token.email });
        if (user) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (user?.email) {
        const client = await clientPromise;
        const db = client.db("kvlc_database");
        const role = user.email === process.env.SUPER_ADMIN_EMAIL ? "superadmin" : "user";
        await db.collection("users").updateOne(
          { email: user.email },
          { 
            $set: { 
              name: user.name, 
              image: user.image, 
              role: role,
              lastLogin: new Date() 
            } 
          },
          { upsert: true }
        );
      }
    },
  },
}