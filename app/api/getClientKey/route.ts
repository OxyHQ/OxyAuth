import { NextResponse } from "next/server";
import { generateClientKey } from "@/lib/clientKey";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callback");

  let clientKey = request.headers.get("clientKey");

  if (!clientKey) {
    clientKey = generateClientKey();
  }

  let redirectUrl;
  try {
    const referer = request.headers.get("referer");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    redirectUrl = new URL(referer || appUrl);
  } catch (error) {
    redirectUrl = new URL(process.env.NEXT_PUBLIC_APP_URL || "");
  }
  redirectUrl.searchParams.set("clientKey", clientKey);

  if (callbackUrl) {
    try {
      new URL(callbackUrl);
      redirectUrl.searchParams.set("callback", callbackUrl);
    } catch (error) {
      // Ignore invalid callbackUrl
    }
  }

  return NextResponse.redirect(redirectUrl.toString());
}
