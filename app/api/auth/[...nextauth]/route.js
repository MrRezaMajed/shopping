import GoogleProvider  from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"
import NextAuth from "next-auth";


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session:{
    strategy: "jwt",
  },
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };