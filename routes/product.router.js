import express from "express";
import * as productController from "../controllers/product.controller.js";
import { protectedRoutes, restrictedTo } from "../middleware/authorization.js";

const router = express.Router();
// @desc    Get all products
// @route   GET /api/v1/products

router.route("/").get(productController.getAllProducts);

// @desc    Get single product

router.route("/:id").get(productController.getProductById);

// @desc    Create a new product

router
  .route("/")
  .post(
    protectedRoutes,
    restrictedTo("admin"),
    productController.createProduct
  );

// @desc    Update a product
router
  .route("/:id")
  .put(protectedRoutes, restrictedTo("admin"), productController.updateProduct);

// @desc    Delete a product
router
  .route("/:id")
  .delete(
    protectedRoutes,
    restrictedTo("admin"),
    productController.deleteProduct
  );

export default router;
