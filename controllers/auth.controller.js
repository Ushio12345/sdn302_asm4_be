const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");

module.exports = {
  // LOGIN
  login: async (req, res) => {
    const { userName, password } = req.body;

    try {
      const user = await db.User.findOne({ userName });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin, userName: user.userName },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
        httpOnly: true, // Không cho JS phía client đọc
        secure: false,
        sameSite: "lax",
        maxAge: 1 * 60 * 60 * 1000, // 1 giờ
      });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },

  // REGISTER
  register: async (req, res) => {
    const { userName, password } = req.body;

    try {
      const existing = await db.User.findOne({ userName });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const hashed = await bcryptjs.hash(password, 10);

      const newUser = new db.User({
        userName,
        password: hashed,
        isAdmin: false,
      });

      await newUser.save();

      return res.status(201).json({
        success: true,
        message: "Register successful",
        data: {
          _id: newUser._id,
          userName: newUser.userName,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
};
