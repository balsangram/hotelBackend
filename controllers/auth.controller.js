// const { User } = require("../models/User.model");
// const jwt = require("jsonwebtoken");
// const { validPassword, generatePassword } = require("../utils/crypto");
// const saltRounds = 10;
// const privateKey = "ghkdfdkkhdkddkdk";

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userExist = await User.findOne({ email });

//     console.log(userExist,"ff")

//     if (!userExist) {
//       return res.status(400).json({ message: "Invalied Email" });
//     }
//     if (!validPassword(password, userExist.password)) {
//       return res.status(400).json({ message: "password invalid" });
//     }
//     jwt.sign(
//       {
//         userId: userExist._id,
//         role: userExist.role,
//         name: userExist.name,
//         email: userExist.email,
//       },
//       privateKey,
//       function (err, token) {
//         console.log(token);
//         res
//           .status(200)
//           .json({
//             name: userExist.name,
//             email,
//             role: userExist.role,
//             token,
//             message: "Login successfully",
//           });
//       }
//     );
//     // const token = jwt.sign({ userid :"j"}, 'shhhhh');
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };

// const registration = async (req, res) => {
//   try {
//     console.log(req.body);
//     const { name, email, password } = req.body;

//     const userExist = await User.findOne({ email: email });
//     if (userExist) {
//       return res.status(400).json({ message: "email already exist" });
//     }

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const hash  = generatePassword(password)
//     const user = new User({ name, email, password: hash });
//     user.save();
//     res
//       .status(200)
//       .json({ message: "User registered successfully", data: user });
//   } catch (error) {
//     console.error(error);
//     res.status(400).send(error.message);
//   }
// };

// // Update user
// const updateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const updates = req.body;

//     const updatedUser = await User.findByIdAndUpdate(userId, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };

// // Delete user
// const deleteUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     const deletedUser = await User.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = {
//   updateUser,
//   deleteUser,
// };


// module.exports = { login, registration, updateUser, deleteUser };


// const { User } = require("../models/User.model.js");
// const jwt = require("jsonwebtoken");

// const { User } = require("../models/User.model.js");
// const {User} = require("../models/User.model.js")
import {User} from '../models/User.model.js';

import jwt from "jsonwebtoken";

const saltRounds = 10; // Used for password hashing (ensure this is consistent with crypto utils)
const privateKey =  "ghkdfdkkhdkddkdk"; // Use environment variable for security

// Login endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Validate password
    if (!validPassword(password, userExist.password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: userExist._id,
        role: userExist.role,
        name: userExist.name,
        email: userExist.email,
      },
      privateKey,
      { expiresIn: "1h" } // Added token expiration for security
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      data: {
         userId: userExist._id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Registration endpoint
export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await generatePassword(password, saltRounds);

    // Create and save new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user endpoint
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Prevent updating sensitive fields (e.g., _id, role) unless explicitly allowed
    const allowedUpdates = ["name", "email", "password"];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidUpdate) {
      return res.status(400).json({ message: "Invalid updates" });
    }

    // Hash password if included in updates
    if (updates.password) {
      updates.password = await generatePassword(updates.password, saltRounds);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user endpoint
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

