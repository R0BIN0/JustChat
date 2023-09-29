import express from "express";
import cors from "cors";
import { router as userRouter } from "./routes/User.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
const port = 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);
app.use(errorHandler);

export default app;
