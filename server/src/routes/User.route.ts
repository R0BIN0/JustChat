import express from "express";
export const router = express.Router();

import { deleteUser, getUserById, login, register, updateUser } from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").post(authenticateToken, getUserById);
router.route("/user/update").put(authenticateToken, updateUser);
router.route("/user/delete").put(authenticateToken, deleteUser);
