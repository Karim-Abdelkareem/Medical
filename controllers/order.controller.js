import catchAsync from "../utils/catchAsync.js";
import orderModel from "../database/models/order.model.js";
import AppError from "../utils/AppError.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) return next(new AppError(404, "Cart not found"));
  const order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    address: req.body.address,
    paymentMethod: req.body.paymentMethod,
    status: "pending",
  });
  await order.save();
});

export const getOrderById = catchAsync(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId).populate("user");
  if (!order) return next(new AppError(404, "Order not found"));
  res.json({
    status: "success",
    data: order,
  });
});

export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) return next(new AppError(404, "Order not found"));
  order.status = req.body.status;
  await order.save();
  res.json({
    status: "success",
    message: "Order status updated successfully",
    data: order,
  });
});

export const deleteOrder = catchAsync(async (req, res, next) => {
  const order = await orderModel.findByIdAndDelete(req.params.orderId);
  if (!order) return next(new AppError(404, "Order not found"));
  res.json({
    status: "success",
    message: "Order deleted successfully",
  });
});

export const getUserOrders = catchAsync(async (req, res, next) => {
  const orders = await orderModel.find({ user: req.user._id }).populate("user");
  res.json({
    status: "success",
    data: orders,
  });
});

export const getAdminOrders = catchAsync(async (req, res, next) => {
  const orders = await orderModel.find().populate("user");
  res.json({
    status: "success",
    data: orders,
  });
});
