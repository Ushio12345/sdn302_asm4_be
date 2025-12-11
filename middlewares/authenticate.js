const db = require("../models");
const jwt = require("jsonwebtoken");

//  xác thực user
exports.verifyUser = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "You are not logged in. Please log in to continue.",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "error",
        message: "Token không hợp lệ hoặc đã hết hạn.",
      });
    }

    req.user = {
      _id: decoded.userId,
      isAdmin: decoded.isAdmin,
      userName: decoded.userName,
    };
    next();
  });
};
//  kiểm tra Admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) {
    return next();
  }
  // console.log(req.user.isAdmin);

  return res.status(403).json({
    status: "error",
    message: "You are not authorized to perform this action.",
  });
};

exports.verifyAuthor = async (req, res, next) => {
  try {
    const question = await db.Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({
        status: "error",
        message: "Câu hỏi không tồn tại.",
      });
    }

    if (!question.author || question.author.toString() !== req.user._id) {
      return res.status(403).json({
        status: "error",
        message: "You are not the author of this question",
      });
    }

    req.question = question;
    next();
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
