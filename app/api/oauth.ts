import { NextApiRequest, NextApiResponse } from "next";
import express from "express";
import nc from "next-connect";
import OAuth2Server from "oauth2-server";

const app = express();

// OAuth Model - You need to implement the model functions for OAuth to work properly.
const oauthModel = require("../../models/oauth");

app.oauth = new OAuth2Server({
  model: oauthModel,
  accessTokenLifetime: 60 * 60, // Token expiration time (1 hour)
  allowBearerTokensInQueryString: true,
});

const handler = nc<NextApiRequest, NextApiResponse>();

handler.use((req, res, next) => {
  // Allow CORS for all domains
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Authorization endpoint - for getting permission to act on behalf of the user
handler.post(
  "/authorize",
  async (req: NextApiRequest, res: NextApiResponse) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    try {
      const authorizationCode = await app.oauth.authorize(request, response);
      res.status(response.status).json(authorizationCode);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Authorization error", details: error.message });
    }
  },
);

// Token endpoint - for exchanging an authorization code for an access token
handler.post("/token", async (req: NextApiRequest, res: NextApiResponse) => {
  const request = new OAuth2Server.Request(req);
  const response = new OAuth2Server.Response(res);

  try {
    const token = await app.oauth.token(request, response);
    res.status(response.status).json(token);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Token exchange error", details: error.message });
  }
});

export default handler;

// Allow OPTIONS method for CORS preflight requests
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
