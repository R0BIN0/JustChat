import express from "express";
export const router = express.Router();

import { getAllUsers, getUserById, login, register } from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/users/all").get(authenticateToken, getAllUsers);
router.route("/user").post(authenticateToken, getUserById);
