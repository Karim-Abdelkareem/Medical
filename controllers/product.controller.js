import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import productModel from "../database/models/product.model.js";
import cloudinary from "../utils/cloudinary.js";

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

export const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, price, quantity } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Product image is required" });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const product = new productModel({
      name,
      description,
      price,
      quantity,
      image: result.secure_url,
    });

    await product.save();
    res.status(201).json({ status: "success", data: product });
  } catch (error) {
    return next(new AppError(500, error.message));
  }
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
