import { userModel } from "../database/models/user.model.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (user) {
    return next(new Error("User already exists"));
  }
  user = new userModel({ name, email, password });
  await user.save();
  res.status(201).json({
    status: "success",
    data: { user },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError(401, "Invalid email or password"));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.json({
    status: "success",
    token,
  });
});
