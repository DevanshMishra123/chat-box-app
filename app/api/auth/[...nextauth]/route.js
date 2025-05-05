import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) return null;

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) return null;

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/", 
  },
  session: {
    strategy: "jwt", 
  },
  secret: process.env.NEXTAUTH_SECRET, 
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
