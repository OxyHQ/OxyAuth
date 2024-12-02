import { NextResponse } from "next/server";
import { auth as authMiddleware } from "auth";

import { handleClientKey } from "./utils/clientKey";

export default async function customMiddleware(req) {
  const res = NextResponse.next();

  // Call the existing "auth" middleware
  await authMiddleware(req);

  // Handle clientKey logic
  handleClientKey(req, res);

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
