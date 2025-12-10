const express = require("express");
const AuthRoute = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyUser } = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: User already exists
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64f1a7b2c2b1f2d5a1e0b123"
 *                     userName:
 *                       type: string
 *                       example: "ushio"
 *                     isAdmin:
 *                       type: boolean
 *                       example: true
 */
AuthRoute.get("/me", verifyUser, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = AuthRoute;

AuthRoute.post("/login", authController.login);
AuthRoute.post("/register", authController.register);

module.exports = AuthRoute;
