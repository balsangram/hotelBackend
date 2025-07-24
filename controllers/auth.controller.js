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
// const {User} = require("../models/User.model.js")import { User } from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Added for secure password hashing
import { config } from 'dotenv'; // Added for environment variables

config(); // Load environment variables

const saltRounds = 12; // Increased for better security (10-12 is good balance)
const privateKey = process.env.JWT_SECRET || 'fallback-secret-key'; // Use env variable
const TOKEN_EXPIRY = '1h'; // Made constant for reusability

// Input validation helper
const validateInput = (fields, res) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value || value.trim() === '') {
      res.status(400).json({ message: `${key} is required` });
      return false;
    }
  }
  return true;
};

// Login endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!validateInput({ email, password }, res)) return;

    // Check if user exists
    const userExist = await User.findOne({ email }).select('+password'); // Explicitly select password
    if (!userExist) {
      return res.status(401).json({ message: 'Invalid credentials' }); // More generic error
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, userExist.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' }); // More generic error
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
      { expiresIn: TOKEN_EXPIRY }
    );

    // Set secure cookie (optional, but recommended)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Send response
    res.status(200).json({
      message: 'Login successful',
      data: {
        userId: userExist._id,
        name: userExist.name,
        email: userExist.email,
        role: userExist.role,
        token, // Consider removing if using cookies
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Registration endpoint
export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!validateInput({ name, email, password }, res)) return;

    // Additional email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Explicitly set default role
    });
    await user.save();

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update user endpoint
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    // Prevent updating sensitive fields
    const allowedUpdates = ['name', 'email', 'password'];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));

    if (!isValidUpdate || updateKeys.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty updates' });
    }

    // Additional validation for email if provided
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      // Check if new email is already taken
      const emailExists = await User.findOne({ email: updates.email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    // Hash password if included
    if (updates.password) {
      if (updates.password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
        select: '-password', // Don't return password
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: {
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user endpoint
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if user exists
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to verify JWT (add this to protected routes)
export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, privateKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};