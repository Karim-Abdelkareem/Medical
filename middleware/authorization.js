import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { userModel } from "../database/models/user.model.js";
import { promisify } from "util";


export const protectedRoutes = catchAsync(async (req, res, next) => {
  let { authorization } = req.headers;

  if (!authorization) {
    return next(
      new AppError(401, "You are not authorized to access this route")
    );
  }

  const decoded = await promisify(jwt.verify)(
    authorization,
    process.env.JWT_SECRET
  );

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError(401, "Authentication failed"));
  }

  req.user = user;

  next();
});

export const restrictedTo = (...role) => {
  return catchAsync(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new AppError(403, "You do not have permission to access this route")
      );
    }
    next();
  });
};
