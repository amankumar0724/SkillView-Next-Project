import { NextAuthOptions } from "next-auth";
import User from "@/models/user";
import connectDb from "@/lib/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Extend NextAuth session types
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

  interface JWT {
    id?: string;
    role?: "interviewer" | "candidate";
  }
}

type OAuthProfile = {
  email?: string;
  name?: string;
  picture?: string;
  avatar_url?: string;
  login?: string;
};

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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          await connectDb();
          const user = await User.findOne({ email: credentials.email });

          if (!user || !user.password) {
            console.log("User not found or missing password");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("Invalid password");
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role ?? "candidate",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await connectDb();

          const userProfile = profile as OAuthProfile;
          if (!userProfile?.email) return false;

          const existing = await User.findOne({ email: userProfile.email });
          if (!existing) {
            await User.create({
              name: userProfile.name || userProfile.login || "Anonymous",
              email: userProfile.email,
              image: userProfile.avatar_url || userProfile.picture || null,
              role: "candidate",
            });
          }
        } catch (error) {
          console.error("OAuth signIn error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role ?? "candidate";
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.email) {
        await connectDb();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          session.user = {
            id: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
            image: dbUser.image,
            role: dbUser.role ?? "candidate",
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
