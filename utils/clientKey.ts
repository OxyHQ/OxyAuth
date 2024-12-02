import { NextResponse } from "next/server";

export function handleClientKey(req, res: NextResponse) {
  // Check if the clientKey cookie exists
  if (!req.cookies.get("clientKey")) {
    // Generate a new clientKey
    const clientKey = crypto.randomUUID();

    // Set the clientKey cookie in the response headers
    res.cookies.set("clientKey", clientKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure flag is set in production
      path: "/",
    });
  }
}
