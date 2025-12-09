const mongoose = require("mongoose");
const Roles = require("../constants");

const UserSchema = new mongoose.Schema({
  userName: { type: String, require: true, unique: true, default: "" },
  password: { type: String, require: true },
  // role: {
  //   type: String,
  //   require: true,
  //   enum: Object.values(Roles),
  //   default: Roles.USER,
  // },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
