import express from "express";
import cors from "cors";
import { router as userRouter } from "./routes/User.route.js";
import { router as chatRouter } from "./routes/Chat.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import http from "http";
import "./hub/websocket.js";
const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);
app.use("/api/v1", chatRouter);
app.use(errorHandler);

export default app;
