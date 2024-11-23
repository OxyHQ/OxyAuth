import oauthServer from "@/server/oauth-server";

export async function POST(request: Request) {
  const response = await oauthServer.token(request, new Response());

  return response;
}
