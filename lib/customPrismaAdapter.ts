import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db";

export function CustomPrismaAdapter(clientKey: string) {
  const adapter = PrismaAdapter(prisma);

  return {
    ...adapter,
    async createSession(session) {
      if (!adapter.createSession) {
        throw new Error("createSession is undefined");
      }
      return adapter.createSession({
        ...session,
        clientKey,
      });
    },
  };
}
