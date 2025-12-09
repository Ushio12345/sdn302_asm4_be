const jwt = require("jsonwebtoken");

const checkUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.user = null; // Không login
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.locals.user = null;
    } else {
      res.locals.user = {
        _id: decoded.userId,
        username: decoded.name,
        isAdmin: decoded.admin,
      };
    }
    next();
  });
};

module.exports = checkUser;
