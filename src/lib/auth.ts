import NextAuth, { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import User from "@/models/user";
import connectDb from "@/lib/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";



// Extend the Session type to include 'role'
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "interviewer" | "candidate" | null;
    };
  }
  interface User {
    id?: string;
    role?: "interviewer" | "candidate";
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req?: any
      ) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          await connectDb();
          const user = await User.findOne({ email: credentials.email }) as {
            _id: { toString: () => string };
            email: string;
            name?: string;
            image?: string;
            role?: "candidate" | "interviewer";
            password?: string;
          } | null;
          console.log("User found:", user ? "Yes" : "No");
          
          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.password) {
            console.log("User has no password (OAuth user)");
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          console.log("Password valid:", isValidPassword);
          
          if (!isValidPassword) {
            console.log("Invalid password");
            return null;
          }

          // Return user object that matches NextAuth expectations
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role === "interviewer" ? "interviewer" : "candidate",
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Only handle OAuth providers
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connectDb();

          if (!profile?.email) return false;

          const existingUser = await User.findOne({ email: profile.email });

          if (!existingUser) {
            await User.create({
              name: profile?.name || (profile as any)?.login || "Anonymous",
              email: profile.email,
              image: (profile as any)?.avatar_url || (profile as any)?.picture || null,
              role: "candidate",
            });
          }
        } catch (error) {
          console.error("SignIn callback error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = (user as any).role || "candidate";
      }
      console.log(token.id);
      return token;
    },
  
  async session({ session, token }) {
    if (token?.email) {
      await connectDb();

      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        session.user = {
          id: dbUser._id.toString(), // ✅ Use Mongo _id
          email: dbUser.email,
          name: dbUser.name,
          image: dbUser.image,
          role: dbUser.role || "candidate",
        };
      }
    }

    return session;
  },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};