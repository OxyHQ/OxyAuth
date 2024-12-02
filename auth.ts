import { cookies } from "next/headers";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

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
  adapter: {
    ...PrismaAdapter(prisma),
    createSession: async (session) => {
      const clientKey =
        cookies().get("clientKey")?.value || crypto.randomUUID();
      return prisma.session.create({
        data: {
          ...session,
          clientKey,
        },
      });
    },
  },
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && session.user.id) {
        const dbUser = await getUserById(session.user.id);

        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.name = dbUser.name;
          session.user.email = dbUser.email ?? "";
          session.user.image = dbUser.image;

          const sessions = await prisma.session.findMany({
            where: { userId: dbUser.id },
            select: { id: true, userId: true, expires: true, clientKey: true },
          });

          session.user.sessions = sessions;
        }
      }

      return session;
    },
    async signIn({ user }) {
      // You don't need to update the session here anymore
      // as it's handled in createSession
      return true;
    },
  },
  ...authConfig,
});
