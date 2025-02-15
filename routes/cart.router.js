import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cart.controller.js";

import { protectedRoutes } from "../middleware/authorization.js";

const router = express.Router();

router.post("/", protectedRoutes, addToCart);
router.delete("/:itemId", protectedRoutes, removeFromCart);
router.get("/", protectedRoutes, getCart);

export default router;
