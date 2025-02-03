import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      minlength: [3, "Username should be at least 3 characters long"],
      maxlength: 50,
      match: [
        /^[a-zA-Z0-9]+$/,
        "Username can only contain alphanumeric characters",
      ],
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: [3, "Too short name"],
      maxlength: 50,
    },
    pharmacy: {
      type: String,
      required: [true, "Please provide a pharmacy"],
      minlength: [3, "Too short pharmacy name"],
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password should be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "hr"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const userModel = mongoose.model("User", userSchema);
