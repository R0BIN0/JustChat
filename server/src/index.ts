import express from "express";
const port = 8000;
const app = express();
import { config } from "dotenv";
import { connectedDB } from "./config/db.js";
import cors from "cors";
import { router as userRouter } from "./routes/User.route.js";

config();
connectedDB();
app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);
app.listen(port, () => console.log(`now listening on port ${port}`));
