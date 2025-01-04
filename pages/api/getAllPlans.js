import clientPromise from "../../lib/mongodb";

/**
 * Retrieves all plans from the database (used for filling the floating cards)
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const collection = db.collection("examplePlans");

      const cards = await collection.find({}).toArray();

      const formattedCards = cards.map((card) => ({
        id: card._id,
        text: `${card.topic} in ${card.number} ${card.time}`,
      }));

      res.status(200).json({ success: true, data: formattedCards });
    } catch (error) {
      console.error("Error fetching cards:", error);
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
