const jwt = require("jsonwebtoken");
const db = require("../models");

const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.locals.user = null; // Không login
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lấy user mới nhất từ DB
    const user = await db.User.findById(decoded.userId).select("-password");

    if (!user) {
      res.locals.user = null;
    } else {
      res.locals.user = user; // gắn object user thực tế
    }
  } catch (err) {
    console.error(err);
    res.locals.user = null;
  }

  next();
};

module.exports = checkUser;
