import express from 'express';
import OAuthServer from 'express-oauth-server';

const app = express();

const oauth = new OAuthServer({
  model: require('./oauth-model'), // See https://github.com/oauthjs/node-oauth2-server for specification
  grants: ['password'],
  debug: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/oauth/token', oauth.token());

export default oauth;
