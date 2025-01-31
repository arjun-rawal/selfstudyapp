import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import { useState, useEffect } from "react";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Sends the plan prompt to OpenAI to retrieve the day-by-day subtopics and websites
 * @param {req.body.username} username of the user plan
 * @param {req.body.password} schedule to be put in user's plan
 * @param {req.body.topic} topic of the user's plan
 * @param {req.body.number} number attribute for the user's plan
 * @param {req.body.time} time attribute for the user's plan
 * writes to the database with collection plans with a plan object: username, topic, numDays, outputText(OpenAI's response), totalCost(of the API call)
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, password, topic, number, time } = req.body;

    if (!topic || !number || !time) {
      res
        .status(400)
        .json({ success: false, message: "All fields are required" });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db("user_database");
      const plansCollection = db.collection("plans");

      const user = await db.collection("users").findOne({ username: username });

      if (!user) {
        console.log("user not found");
        res.status(400).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      if (user.password != password) {
        res.status(400).json({
          success: false,
          message: "Access Denied",
        });
        return;
      }

      const planExists = await plansCollection.findOne({ username: username });
      if (planExists) {
        res.status(400).json({
          success: false,
          message: "Limit to 1 plan/user",
        });
      }

      // Converting the string prompt ex("5 days", "3 weeks") to numDays
      let numDays = 0;
      if (time === "Days") {
        numDays = number;
      } else if (time === "Weeks") {
        numDays = number * 7;
      } else {
        numDays = number * 30;
      }

      console.log("SENDING");
      const prompt = `
        You are tasked with creating a detailed, day-by-day study schedule based on two inputs:
        1. Topic: A subject such as 'AP Calculus.'
        2. Number of Days: The number of days to create the schedule for.

        Your response must be in JSON format for easy parsing. Use the following structure:

        [
            {
                "day": 1,
                "videoTopic": " video topic for Day 1",
                "assignmentLink": "link to an assignment for Day 1"
            },
            {
                "day": 2,
                "videoTopic": "video topic  for Day 2",
                "assignmentLink": "Link to an assignment for Day 2"
            },
        ]

        Ensure each day's video topic and assignment are specific to the subject, avoiding vague topics like "summary of topics." Ensure that all data fits the JSON structure exactly. Do not include any text outside the JSON object.

        Now, create a day-by-day study schedule for the following:
        Topic: ${topic}
        Number of days: ${numDays}

        DO NOT START YOUR OUTPUT WITH A HEADER I.E.('''json) ONLY RETURN EXACT JSON FORMAT
        DO NOT PROVIDE EXAMPLE LINKS FOR ASSIGNMENTS, FIND REAL ONES ONLINE
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4", // or "gpt-3.5-turbo" depending on your preference
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates study schedules.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" }, // Ensure the response is in JSON format
      });

      // Store the cost in the database for developer reference
      const promptTokens = completion.usage.prompt_tokens;
      const completionTokens = completion.usage.completion_tokens;

      const costInput = (promptTokens / 1000) * 0.03; // Assuming $0.03 per 1K tokens for input
      const costOutput = (completionTokens / 1000) * 0.06; // Assuming $0.06 per 1K tokens for output

      const totalCost = costInput + costOutput;
      let outputText = completion.choices[0].message.content;

      console.log("HERETEXT");
      console.log(outputText);
      console.log(completion);

      // Sometimes OpenAI will start the response with '''json and end it with ''' which makes it unparsable so we clean it here
      outputText = outputText.trim(); // Removes whitespace
      if (outputText.startsWith("```json") && outputText.endsWith("```")) {
        // Matches correct delimiters
        outputText = outputText
          .replace(/^```json\s*/, "") // Removes ```json at the start
          .replace(/```$/, ""); // Removes ``` at the end
      }

      const result = await plansCollection.insertOne({
        username,
        topic,
        numDays,
        outputText,
        totalCost,
      });

      res.status(201).json({
        success: true,
        message: "Topic registered successfully",
        userId: result.insertedId,
      });
    } catch (error) {
      console.error("Error connecting to MongoDB or inserting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" + error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}