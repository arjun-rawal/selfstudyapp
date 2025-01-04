import { OAuth2Client } from "google-auth-library";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import clientPromise from "../../../../lib/mongodb";

/**
 * API to handle google oAuth
 * @param {req.body.credential} google oAuth credential needed to access the user's google detals
 * Creates a cookie for sessionID, and writes to database sessions collection
 */
export default async function handler(req, res) {
  const { credential } = req.body;

  if (!credential) {
    res.status(400).send("Missing credential");
  }

  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  );

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    //access the database
    const mongoClient = await clientPromise;
    const db = mongoClient.db("user_database");
    const users = db.collection("users");
    let user = await users.findOne({ username: email });

    //Since the user signing in with google only provides their google details and they don't manually create a password, I encrypt their email and use that as the password
    const encryptedEmail = CryptoJS.SHA256(email).toString();
    console.log(user);
    //if no account, send the email as username and encrypted email as the password to database
    if (!user) {
      await users.insertOne({ username: email, password: encryptedEmail });
    }

    //create a randomnly generated id to handle the auth session, send it to the database and store it as a cookie for an hour
    const sessionToken = uuidv4();
    await db.collection("sessions").insertOne({
      username: email,
      token: sessionToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1-hour expiration
    });

    //not http only because I wanted to access it in my frontend code
    res.setHeader(
      "Set-Cookie",
      `sessionToken=${sessionToken};  Path=/; Max-Age=3600;`
    );

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed");
  }
}
