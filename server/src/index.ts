import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
const port = 8000;
const app = express();
import { config } from "dotenv";
import { connectedDB } from "./config/db.js";

config();
connectedDB();

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
