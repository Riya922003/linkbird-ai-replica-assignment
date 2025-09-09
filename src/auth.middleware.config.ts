import { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

// Simplified auth config for middleware (Edge Runtime compatible)
const authConfigForMiddleware: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

export default authConfigForMiddleware;
