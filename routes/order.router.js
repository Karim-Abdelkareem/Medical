import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders,
  getAdminOrders,
  payDebt,
} from "../controllers/orderController.js";
import { protectedRoutes, restrictedTo } from "../middleware/authorization.js";
const router = express.Router();

//  Create Order (User)
router.post("/:cartId", protectedRoutes, createOrder);

//  Get Order by ID
router.get("/:orderId", protectedRoutes, getOrderById);

//  Get User's Orders
router.get("/user/orders", protectedRoutes, getUserOrders);

//  Get All Orders (Admin)
router.get(
  "/admin/orders",
  protectedRoutes,
  restrictedTo("admin"),
  getAdminOrders
);

//  Update Order Status (Admin)
router.put(
  "/admin/update-status/:orderId",
  protectedRoutes,
  restrictedTo("admin"),
  updateOrderStatus
);

//  Delete Order (Admin)
router.delete(
  "/admin/delete/:orderId",
  protectedRoutes,
  restrictedTo("admin"),
  deleteOrder
);

//  Pay Off Debt (User)
router.post("/pay-debt", protectedRoutes, payDebt);

export default router;
