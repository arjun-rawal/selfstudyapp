import { google } from "google-auth-library";

/**
 * handles the redirect in the google auth flow
 */
export default async function handler(req, res) {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&response_type=code&scope=openid%20email%20profile`;

  res.redirect(authUrl);
}
