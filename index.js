import express from "express";
import dotenv from "dotenv";
import dbconnection from "./database/DBconnection.js";
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/auth.router.js";
import cartRouter from "./routes/cartRouter.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/appError.js";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION");
  process.exit(1);
});

const app = express();
dotenv.config();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/cart', cartRouter);

app.all("*", (req, res, next) => {
  next(new AppError(404, `Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

dbconnection();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  process.exit(1);
});
