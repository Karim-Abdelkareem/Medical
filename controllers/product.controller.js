import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import productModel from "../database/models/product.model.js";

export const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await productModel.find();
  res.json({
    status: "success",
    data: products,
  });
});

export const getProductById = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await productModel.findById(id);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }
  res.json({
    status: "success",
    data: product,
  });
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await productModel.create(req.body);
  res.status(201).json({
    status: "success",
    data: product,
  });
});

export const updateProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await productModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }
  res.json({
    status: "success",
    data: product,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const product = await productModel.findByIdAndDelete(id);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
