import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callback");

  let clientKey = localStorage.getItem("clientKey");

  if (!clientKey) {
    clientKey = uuidv4();
    localStorage.setItem("clientKey", clientKey);
  }

  const redirectUrl = new URL(request.headers.get("referer") || "/");
  redirectUrl.searchParams.set("clientKey", clientKey);

  if (callbackUrl) {
    redirectUrl.searchParams.set("callback", callbackUrl);
  }

  return NextResponse.redirect(redirectUrl.toString());
}
