import express from "express";
export const router = express.Router();

import { login, register } from "../controllers/User.controller.js";

router.route("/register").post(register);
router.route("/login").post(login);
