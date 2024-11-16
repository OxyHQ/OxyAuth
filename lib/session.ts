import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }

  // Retrieve clientKey from request headers
  const clientKey = session.clientKey || uuidv4();

  return {
    ...session.user,
    clientKey,
  };
});
