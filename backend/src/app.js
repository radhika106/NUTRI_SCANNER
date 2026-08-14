import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import scanRoutes from "./routes/scanRoutes.js";

const app = express();

app.use(
  cors({
    origin: "https://nutri-scanner-seven.vercel.app",
  }),
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api", scanRoutes);

export default app;
