import dotenv from "dotenv";
//import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

//connectDB();
console.log("Gemini:", process.env.GEMINI_API_KEY?.slice(0, 10));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
