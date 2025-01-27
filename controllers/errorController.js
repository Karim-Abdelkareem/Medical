import AppError from "../utils/appError.js";

// Handle MongoDB CastError (invalid ID)
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, message);
};

// Handle MongoDB duplicate key error
const handleDuplicateError = (err) => {
  const value = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${err.keyValue[value]}. Please use another value.`;
  return new AppError(400, message);
};

// Handle MongoDB validation errors
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(400, message);
};

// Send detailed error response in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send minimal error response in production
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR 💥:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// Global error handler middleware
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign({}, err); // Copy error properties

    // Handle specific MongoDB errors
    if (error.name === "CastError") error = handleCastError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === "ValidationError") error = handleValidationError(error);

    sendErrorProd(error, res);
  }
};
