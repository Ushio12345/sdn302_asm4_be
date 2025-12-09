const { asyncHandler } = require("../middlewares/asyncHandle");
const db = require("../models/index");

module.exports = {
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await db.User.find().select("-password -__v");

    return res.status(200).json({
      title: "User List",
      users: users || [],
      user: req.user || null,
    });
  }),
};
