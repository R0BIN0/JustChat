import express from "express";
export const router = express.Router();

import { getChat } from "../controllers/ChatController.js";

router.route("/chat").get(getChat);
