import mongoose from "mongoose";

// To create an order, you would first need to add items to the user's cart, then create a new Order document with the user's ID, the cart items, the total price, and the payment method.
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItmes: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Instapay", "Later"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Cancelled", "Completed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

