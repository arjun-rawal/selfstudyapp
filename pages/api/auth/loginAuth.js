import clientPromise from "../../../lib/mongodb";
import { v4 as uuidv4 } from "uuid";
/**
 * API to handle logging in
 * @param {req.body.username} username of the user trying to log in
 * @param {req.body.password} password of the user trying to log in
 * @returns object with success: true/false that they were able to log in, message: reason for the true/false success
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required LOGINN",
        });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const usersCollection = db.collection("users");

      //find the user from the database then check the password
      const user = await usersCollection.findOne({ username });
      if (!user) {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
        return;
      }

      if (password !== user.password) {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
        return;
      }

      // Create and save the session through the random id
      const sessionToken = uuidv4();
      await db.collection("sessions").insertOne({
        username,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1-hour expiration
      });

      // not HTTP only so it can be accessed in frontend
      res.setHeader(
        "Set-Cookie",
        `sessionToken=${sessionToken}; Path=/; Max-Age=3600;`
      );

      res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
      console.error("Error connecting to MongoDB or querying user:", error);
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
