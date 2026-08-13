import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

console.log("KEY:", process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: "Say hello from Gemini",
  });

  console.log(response.text);
}

run();
