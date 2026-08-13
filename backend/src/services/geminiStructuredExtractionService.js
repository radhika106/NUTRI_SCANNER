import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const extractStructuredData = async (ocrText) => {
  const prompt = `
  You are an expert Indian food-label parser and nutrition analyst.

  The text comes from OCR and may contain noise, broken lines, spelling mistakes, and incomplete formatting.

  Your task is to:
  1. Extract structured food-label information.
  2. Analyze the product from a health perspective.
  3. Return ONLY valid JSON.

  Return ONLY this JSON structure:

  {
    "product": {
      "name": null,
      "brand": null,
      "category": null
    },

    "score": 0,
    "rating": "",
    "explanation": "",

    "factors": [
      {
        "label": "",
        "value": "",
        "tone": "good"
      }
    ],

    "good": [],
    "watchOut": [],

    "ingredients": [
      {
        "name": "",
        "risk": "safe",
        "description": "",
        "assessment": ""
      }
    ],

    "nutrition": [
      {
        "label": "",
        "value": "",
        "warning": false
      }
    ],

    "recommendation": {
      "title": "",
      "detail": ""
    }
  }

  Rules:
  - Convert percentages into strings with units if present.
  - Keep INS / E-numbers exactly as written.
  - If a value is not found, use null.
  - healthScore must be an integer between 0 and 100.
  - rating should be one of:
    - "Healthy Choice"
    - "Moderate Choice"
    - "Occasional Choice"
    - "Poor Choice"
  - good should contain positive nutritional observations.
  - watchOut should contain ingredients or nutrition concerns (high sugar, high sodium, palm oil, artificial flavour, etc.).
  - recommendation.title should be a short action-oriented heading.
  - recommendation.detail should be 1-2 simple consumer-friendly sentences.
  - Return ONLY raw JSON without markdown, comments, or explanation.

  OCR TEXT:
  ${ocrText}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  console.log("RAW GEMINI RESPONSE:");
  console.log(response.text);

  const cleaned = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};

export default extractStructuredData;
