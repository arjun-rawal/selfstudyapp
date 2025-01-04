import clientPromise from "../../lib/mongodb";
import OpenAI from "openai";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
// Make sure to include these imports:
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const prompt = `"You are tasked with creating a detailed, day-by-day study schedule based on two inputs:
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
                            Topic: AP Calculus AB
                            Number of days: 30
                            DO NOT START YOUR OUTPUT WITH A HEADER I.E.('''json) ONLY RETURN EXACT JSON FORMAT
                            DO NOT PROVIDE EXAMPLE LINKS FOR ASSIGNMENTS, FIND REAL ONES ONLINE"`;
const result = await model.generateContent(prompt);
console.log(result.response.text());
export default async function handler(req, res) {
    res.status(201).json({
        success: true,
        message: result.response.text(),
      });
}