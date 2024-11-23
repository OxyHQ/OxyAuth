import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

export let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

// Ensure the Prisma client is used in the oauth-model functions
import { getAccessToken, getClient, saveToken, getUser, verifyScope } from '@/server/oauth-model';

export { getAccessToken, getClient, saveToken, getUser, verifyScope };
