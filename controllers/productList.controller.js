import productListModel from "../database/models/productList.model.js";
import productModel from "../database/models/product.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const addToProductList = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }

  if (!quantity || quantity < 1) {
    return next(new AppError(400, "Quantity must be at least 1"));
  }

  let productList = await productListModel.findOne({ userId });

  if (!productList) {
    productList = new productListModel({ userId, productList: [] });
  }

  const existingProduct = productList.productList.find(
    (item) => item.productId.toString() === productId
  );

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    productList.productList.push({ productId, quantity });
  }
  await productList.save();
  res.json({
    status: "success",
    message: "Product added to product list successfully",
    data: productList,
  });
});

export const removeFromProductList = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const productList = await productListModel.findOneAndUpdate(
    { userId },
    { $pull: { productList: { productId } } },
    { new: true }
  );
  if (!productList) {
    return next(new AppError(404, "Product not found in the product list"));
  }
  res.json({
    status: "success",
    message: "Product removed from product list successfully",
    data: productList,
  });
});

export const updateProductQuantity = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!quantity || quantity < 1) {
    return next(new AppError(400, "Quantity must be at least 1"));
  }

  const productList = await productListModel.findOne({ userId });
  if (!productList) {
    return next(new AppError(404, "Product list not found"));
  }

  const productIndex = productList.productList.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (productIndex === -1) {
    return next(new AppError(404, "Product not found in product list"));
  }

  productList.productList[productIndex].quantity = quantity;

  if (quantity === 0) {
    productList.productList.splice(productIndex, 1);
  }

  await productList.save();

  res.json({
    status: "success",
    message: "Product quantity updated successfully",
    data: productList,
  });
});

export const getProductList = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const productList = await productListModel.findOne({ userId }).populate({
    path: "productList.productId",
    select: "-quantity -__v",
  });

  if (!productList) {
    return next(new AppError(404, "Product list not found"));
  }

  res.json({
    status: "success",
    data: productList,
  });
});
