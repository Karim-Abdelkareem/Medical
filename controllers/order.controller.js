import catchAsync from "../utils/catchAsync.js";
import orderModel from "../database/models/order.model.js";
import AppError from "../utils/AppError.js";
import cartModel from "../database/models/cart.model.js";

export const createOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const cartId = req.params.cartId;
  const cart = await cartModel.findById(cartId);
  if (!cart) return next(new AppError(404, "Cart not found"));
  const { totalPrice, paymentMethod } = req.body;
  const order = new orderModel({
    userId,
    cartId,
    totalPrice,
    paymentMethod,
    paymentDetails: {
      paymentStatus: paymentMethod === "debt" ? "debt" : "pending",
    },
  });
  await order.save();
  if (paymentMethod === "debt") {
    await User.findByIdAndUpdate(userId, { $inc: { debt: totalPrice } });
  }
  await cartModel.findByIdAndDelete(req.params.cartId);
  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: order,
  });
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
  order.orderStatus = req.body.orderStatus;
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
  const orders = await orderModel
    .find({ user: req.user._id })
    .populate("user")
    .populate("cart");
  res.json({
    status: "success",
    data: orders,
  });
});

export const getAdminOrders = catchAsync(async (req, res, next) => {
  const orders = await orderModel
    .find()
    .populate("user", "name username")
    .populate("cart");
  res.json({
    status: "success",
    data: orders,
  });
});

export const payDebt = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { amount, paymentMethod, transactionId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.debt < amount) {
    return res.status(400).json({ error: "Amount exceeds debt balance" });
  }

  user.debt -= amount;
  await user.save();

  await Order.updateMany(
    { user: userId, "paymentDetails.paymentStatus": "debt" },
    {
      $set: {
        "paymentDetails.paymentStatus": "paid",
        "paymentDetails.transactionId": transactionId,
      },
    }
  );
  res.json({
    status: "success",
    message: "Debt paid successfully",
    data: user,
  });
});
