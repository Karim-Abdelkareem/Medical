import express from "express";
import * as authController from "../auth/auth.controller.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

export default router;

