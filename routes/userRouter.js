import express from "express";
import * as userController from "../controllers/user.controller.js";
import { protectedRoutes, restrictedTo } from "../middleware/authorization.js";

const router = express.Router();

router
  .route("/")
  .post(protectedRoutes, restrictedTo("admin"), userController.createUser);

export default router;
