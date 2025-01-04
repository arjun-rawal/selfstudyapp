import clientPromise from "../../../lib/mongodb";

/**
 * handles a new user
 * @param {req.body.username} the username for the account the user wants to create
 * @param {req.body.password} the password for the account the user wants to create
 * @returns success and associated message of the signup
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      res
        .status(400)
        .json({
          success: false,
          message: "Username and password are required",
        });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const usersCollection = db.collection("users");

      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        res
          .status(409)
          .json({ success: false, message: "Username already exists" });
        return;
      }

      // Insert the new user into the database
      const result = await usersCollection.insertOne({ username, password });

      res
        .status(201)
        .json({
          success: true,
          message: "User registered successfully",
          userId: result.insertedId,
        });
    } catch (error) {
      console.error("Error connecting to MongoDB or inserting user:", error);
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
