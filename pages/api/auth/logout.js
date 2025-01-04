import clientPromise from "../../../lib/mongodb";

/**
 * Handle user logging out- deletes sessiontoken locally and in database
 * @returns object with success and why there was or wasn't success
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const sessionsCollection = db.collection("sessions");

      //find existing session token and delete it
      const sessionToken = req.cookies.sessionToken;

      if (sessionToken) {
        const result = await sessionsCollection.deleteMany({});

        if (result.deletedCount === 0) {
          console.warn("Session token not found in the database.");
        }
      }

      // Delete the cookie
      res.setHeader("Set-Cookie", "sessionToken=; Path=/; Max-Age=0;");

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during logout:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
