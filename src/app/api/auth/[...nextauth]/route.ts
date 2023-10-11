// import { connectMongoDB } from "@/lib/mongodb";
// import User from "@/models/user";
import { loginGoogle } from "@/utils/api/user";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  debug: true,
  secret: 'AIzaSyARmQSZBV8bKzPgTDv2fhZ5XTnJArJm-B8',
  callbacks: {
    // @ts-ignore
    async signIn({ user, account, profile }) {
      try {
        const { data } = await loginGoogle({ ...user, ...account, ...profile });
        user.apiToken = data;
        return user;
      } catch (error) {
        console.error("Error in signIn callback", error);
        return false;
      }
    },
    // @ts-ignore
    async jwt({ token, account, profile, user }) {
      if (user?.apiToken) token.apiToken = user.apiToken
      return token;
    },
    // @ts-ignore
    async session({ session, user, token }) {
      if (user) session.user = user;
      if (token) session.token = token.apiToken;
      return session;
    },
  },
};

// @ts-ignore
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };