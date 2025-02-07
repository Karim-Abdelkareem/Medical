import mongoose from "mongoose";

const productListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    productList: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ProductList", productListSchema);
