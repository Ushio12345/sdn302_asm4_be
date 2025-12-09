const express = require("express");
const mongoose = require("mongoose");
// Cần nhập (require) và cấu hình method-override
const methodOverride = require("method-override");
require("dotenv").config();
const httpError = require("http-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const checkUser = require("./middlewares/checkUser");

const connectDB = require("./config/db.config");
connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(expressLayouts);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("layout", "layouts/main");

app.use(checkUser);
//api route
app.use("/api/quizzes", require("./routes/quizz.route"));
app.use("/api/questions", require("./routes/question.route"));
app.use("/api/users", require("./routes/user.route"));
app.use("/api/auth", require("./routes/auth.route"));
// ui

// app.use("/", require("./routes/ui.route"));
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API server is running!",
    availableRoutes: [
      "/api/quizzes",
      "/api/questions",
      "/api/users",
      "/api/auth",
    ],
  });
});
// Xử lý lỗi 404
app.use((req, res, next) => {
  next(httpError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render trang lỗi
  res.status(err.status || 500);
  res.json({
    success: false,
    message: res.locals.message,
    error: res.locals.error,
  });
  // res.render("error", {
  //   title: `Lỗi ${err.status || 500}`,
  //   message: err.message,
  // });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  //   console.log(`API Base URL: ${process.env.BASE_URL}`);
});

module.exports = app;
