import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import OAuthServer from "@/server/oauth-server"; // P668e

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      sessions: Array<{
        id: string;
        userId: string;
        expires: Date;
      }>;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async session({ session }) {
      if (session.user) {
        const dbUser = await getUserById(session.user.id);

        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.name = dbUser.name;
          session.user.email = dbUser.email ?? "";
          session.user.image = dbUser.image;

          const sessions = await prisma.session.findMany({
            where: { userId: dbUser.id },
            select: { id: true, userId: true, expires: true },
          });

          session.user.sessions = sessions;
        }
      }

      return session;
    },
  },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
});

export const oauthServer = OAuthServer; // P0ad7
