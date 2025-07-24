// User.model.js (ESM version)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Image: {
      type: String,
    },
    name: {
      type: String,
      required: true, // ✅ Fix spelling: "require" ➝ "required"
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"], // ✅ Fix spelling
    },
    role: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export { User }; // ✅ Use ESM export
