import express from "express";
import cors from "cors";
import { router as userRouter } from "./routes/User.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
const port = 8000;
import http from "http";
// import * as WebSocket from "ws";
import WebSocket, { WebSocketServer } from "ws";

const app = express();

export const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New Client Connected");
  ws.send("Welcome new Client");
  ws.on("message", (message) => {
    console.log(`received ${message}`);
    ws.send(`Got a message : ${message}`);
  });

  ws.on("close", () => {
    console.log(`Client Disconnected`);
  });
});

app.use(cors());
app.use(express.json());
app.use("/api/v1", userRouter);
app.use(errorHandler);

export default app;
