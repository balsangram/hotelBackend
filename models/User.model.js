// // User.model.js (ESM version)

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     Image: {
//       type: String,
//     },
//     name: {
//       type: String,
//       required: true, // ✅ Fix spelling: "require" ➝ "required"
//     },
//     email: {
//       type: String,
//       required: true,
//       lowercase: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: [true, "Password is required"], // ✅ Fix spelling
//     },
//     role: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// const User = mongoose.model("User", userSchema);
// export { User }; // ✅ Use ESM export

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    Image: {
      type: String,
      default: '', // Optional field with empty string default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true, // Remove whitespace
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      unique: true,
      trim: true, // Remove whitespace
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String, // Changed from Boolean to String
      enum: ['user', 'admin'], // Restrict to valid roles
      default: 'user', // Default to 'user'
      required: [true, 'Role is required'],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);