import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }

  // Retrieve clientKey from localStorage
  let clientKey = localStorage.getItem("clientKey");
  if (!clientKey) {
    clientKey = uuidv4();
    localStorage.setItem("clientKey", clientKey);
  }

  return {
    ...session.user,
    clientKey,
  };
});
