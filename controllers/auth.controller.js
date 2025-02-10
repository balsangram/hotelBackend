const { User } = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { validPassword, generatePassword } = require("../utils/crypto");
const saltRounds = 10;
const privateKey = "ghkdfdkkhdkddkdk";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    console.log(userExist,"ff")

    if (!userExist) {
      return res.status(400).json({ message: "Invalied Email" });
    }
    if (!validPassword(password, userExist.password)) {
      return res.status(400).json({ message: "password invalid" });
    }
    jwt.sign(
      {
        userId: userExist._id,
        role: userExist.role,
        name: userExist.name,
        email: userExist.email,
      },
      privateKey,
      function (err, token) {
        console.log(token);
        res
          .status(200)
          .json({
            name: userExist.name,
            email,
            role: userExist.role,
            token,
            message: "Login successfully",
          });
      }
    );
    // const token = jwt.sign({ userid :"j"}, 'shhhhh');
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const registration = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ message: "email already exist" });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const hash  = generatePassword(password)
    const user = new User({ name, email, password: hash });
    user.save();
    res
      .status(200)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

const deleteUser = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message.error);
  }
};

module.exports = { login, registration, updateUser, deleteUser };
