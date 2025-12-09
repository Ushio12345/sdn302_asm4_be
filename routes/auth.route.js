const express = require("express");
const AuthRoute = express.Router();
const authController = require("../controllers/auth.controller");

AuthRoute.post("/login", authController.login);
AuthRoute.post("/register", authController.register);

module.exports = AuthRoute;
