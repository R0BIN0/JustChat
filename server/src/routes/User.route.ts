import express from "express";
export const router = express.Router();

import { login, register } from "../controllers/UserController.js";

router.route("/register").post(register);
router.route("/login").post(login);
