import { userModel } from "../database/models/user.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const createUser = catchAsync(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError(400, "User already exists"));
  }
  let result = new userModel(req.body);
  await result.save();
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: result,
  });
});

export const getAllUsers = async (req, res) => {
  let users = await userModel.find();
  res.json({
    status: "success",
    message: "Users fetched successfully",
    data: users,
  });
};

export const getUserById = catchAsync(async (req, res) => {
  let user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }
  res.json({
    status: "success",
    message: "User fetched successfully",
    data: user,
  });
});

export const updateUser = catchAsync(async (req, res) => {
  let user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError(404, "User not found"));
  }
  res.json({
    status: "success",
    message: "User updated successfully",
    data: user,
  });
});

export const deleteUser = catchAsync(async (req, res) => {
  let user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError(404, "User not found"));
  }
  res.json({
    status: "success",
    message: "User deleted successfully",
    data: null,
  });
});
