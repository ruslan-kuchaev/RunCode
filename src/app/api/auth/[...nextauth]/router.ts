import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authoptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
};

const handler = NextAuth(authoptions);

export { handler as GET, handler as POST };
