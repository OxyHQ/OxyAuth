import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get("callback");

  let clientKey = request.headers.get("clientKey");

  if (!clientKey) {
    clientKey = uuidv4();
  }

  const redirectUrl = new URL(request.headers.get("referer") || "/");
  redirectUrl.searchParams.set("clientKey", clientKey);

  if (callbackUrl) {
    redirectUrl.searchParams.set("callback", callbackUrl);
  }

  return NextResponse.redirect(redirectUrl.toString());
}
