import express from "express";
export const router = express.Router();

import { getChat } from "../controllers/ChatController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

router.route("/chat").get(authenticateToken, getChat);
