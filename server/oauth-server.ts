import express from 'express';
import OAuthServer from 'express-oauth-server';
import oauthModel from './oauth-model'; // Importing the implemented OAuth model

const app = express();

const oauth = new OAuthServer({
  model: oauthModel, // Using the imported OAuth model
  grants: ['password'],
  debug: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/oauth/token', oauth.token());

export default oauth;
