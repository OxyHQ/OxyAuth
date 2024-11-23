import OAuthServer from "@/server/oauth-server";

export async function POST(request: Request) {
  const oauth = OAuthServer;
  const response = await oauth.token(request, new Response());

  return response;
}
