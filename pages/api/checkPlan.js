import clientPromise from "../../lib/mongodb";

/**
 * Retrieve the plans for a user
 * @param {req.body.username} username for the user the plans are retrieved for
 * @param {req.body.password} password for the user the plans are retrieved for
 * @returns success and associated message for retrieving the plan
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    let { username, authToken } = req.body;

    if (!username && !authToken) {
      res.status(400).json({ success: false, message: "Username is required" });
      return;
    }
    const client = await clientPromise;
    const db = client.db("user_database");
    const sessions = db.collection("sessions");

    //Find the username based on authToken if no username provided
    if (!username) {
      try {
        console.log(await sessions.findOne({ token: authToken }));
        username = (await sessions.findOne({ token: authToken })).username;
        console.log("USERNAME FOUND", username);
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
        return;
      }
    }

    //find the plans associated with that user in the database
    try {
      const plansCollection = db.collection("plans");
      const result = await plansCollection.find({ username }).toArray();

      console.log("HERE", result);
      console.log("USERNAME: ", username);
      if (result.length<1) {
        res.status(200).json({
          success: true,
          username: username,
          message: "No plans found for the user",
          planExists: false,
        });
      } else {
        res.status(200).json({
          success: true,
          username: username,
          message: "Plan found for the user",
          planExists: true,
          result,
        });
      }
    } catch (error) {
      console.error("Error querying MongoDB:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({
      success: false,
      message: `Method ${req.method} is not allowed`,
    });
  }
}
