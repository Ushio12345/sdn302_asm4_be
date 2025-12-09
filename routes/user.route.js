const express = require("express");
const UserRoute = express.Router();
const userController = require("../controllers/user.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

UserRoute.get("/", verifyUser, verifyAdmin, userController.getAllUsers);

module.exports = UserRoute;
