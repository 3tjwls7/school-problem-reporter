import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors({
  origin: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "DELETE", "PATCH"]
}));

app.use(express.json());

app.use("/auth", authRoutes);

app.listen(process.env.AUTH_PORT || 4001, () =>
  console.log(`✅ Auth server running on port ${process.env.AUTH_PORT || 4001}`)
);
