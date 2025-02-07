import express from "express";
import * as productListController from "../controllers/productList.controller.js";
import { protectedRoutes } from "../middleware/authorization.js";

const router = express.Router();

// @desc    Add To product List

router.route("/").post(protectedRoutes, productListController.addToProductList);

// @desc    Remove from product List
router
  .route("/")
  .delete(protectedRoutes, productListController.removeFromProductList);

// @desc    Get product List

router.route("/").get(protectedRoutes, productListController.getProductList);

// @desc    Update product List

router
  .route("/")
  .put(protectedRoutes, productListController.updateProductQuantity);

export default router;
