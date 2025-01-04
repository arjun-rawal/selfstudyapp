import clientPromise from "../../../lib/mongodb";

/**
 * Check if user is signed in
 * @param {cookies} cookies to check if sessionToken exists
 * @param {givenSessionToken} session token to handle
 * @returns object with username: authenticated user's username, password: associated password for the user
 */
export default async function authMiddleware({ cookies, givenSessionToken }) {
  const sessionToken = givenSessionToken || cookies?.sessionToken;

  if (!sessionToken) {
    console.log("No session token found");
    return null;
  }
  //check the user database for a session with the sessionToken
  try {
    const client = await clientPromise;
    const db = client.db("user_database");
    const session = await db
      .collection("sessions")
      .findOne({ token: sessionToken });

    if (!session || new Date() > new Date(session.expiresAt)) {
      console.log("Session expired/invalid");
      return null;
      s;
    }
    const username = session.username;
    const user = await db.collection("users").findOne({ username });

    return { username: session.username, password: user.password };
  } finally {
  }
}
