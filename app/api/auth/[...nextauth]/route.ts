import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    // cridentiale jkut
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
    //   calback kie lohh
  callbacks: {
    async session({ session, token }) {
      return session;
    },
  },
})

export { handler as GET, handler as POST }
