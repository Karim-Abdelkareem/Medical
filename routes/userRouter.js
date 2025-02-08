import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(userController.createUser);
router.route("/").get(userController.getAllUsers);

export default router;
