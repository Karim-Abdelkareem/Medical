import express from "express";
import { addToCart, removeFromCart, updateCart, getCart, clearCart } from "../controllers/cartController.js";

const router = express.Router();

router.post('/', addToCart);
router.delete('/:userId/:productId', removeFromCart);
router.put('/', updateCart);
router.get('/:userId', getCart);
router.delete('/:userId', clearCart);

export default router;