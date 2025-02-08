import express from "express";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./controllers/error.controller.js";
import dotenv from "dotenv";
import dbconnection from "./database/DBconnection.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/auth.router.js";
import productRouter from "./routes/product.router.js";
import productListRouter from "./routes/productList.router.js";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  process.exit(1); // Exit process to avoid running in an inconsistent state
});

const app = express();
dotenv.config();
app.use(express.json());

// Routers for different routes
app.get("/", (req, res) => res.send("Wellcome! To Medical API"));
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/productList", productListRouter);

// Handle all unknown routes
app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

// Global error handler
app.use(globalErrorHandler);

// Connect to the database
dbconnection();

// Server startup
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");
  process.exit(1); // Exit process to avoid running in an inconsistent state
});
