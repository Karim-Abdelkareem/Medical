import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    minlength: [3, "Product name must be at least 3 characters long"],
    maxlength: [50, "Product name cannot exceed 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    minlength: [10, "Product description must be at least 10 characters long"],
    maxlength: [200, "Product description cannot exceed 200 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, "Product quantity is required"],
    min: 0,
  },
});

export default mongoose.model("Product", productSchema);
