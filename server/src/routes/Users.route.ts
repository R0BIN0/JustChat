import express from "express";
export const router = express.Router();

import { getAllUsers } from "../controllers/UsersController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

router.route("/users/all").get(authenticateToken, getAllUsers);
