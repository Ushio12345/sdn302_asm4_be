const { asyncHandler } = require("../middlewares/asyncHandle");
const db = require("../models/index");

module.exports = {
  // GET ALL USERS
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await db.User.find().select("-password -__v");

    return res.status(200).json({
      success: true,
      message: "Fetched all users successfully",
      data: users || [],
    });
  }),

  // UPDATE USER
  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (isAdmin === undefined) {
      return res.status(400).json({
        success: false,
        message: "isAdmin is required (true or false)",
      });
    }

    if (typeof isAdmin !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAdmin must be a boolean",
      });
    }

    const user = await db.User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isAdmin = isAdmin;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User admin role updated successfully",
      data: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  }),
};
