// const express = require("express");
// const UIRoute = express.Router();
// const uiController = require("../controllers/ui.controller");
// const QuizController = require("../controllers/quiz.controller");
// const QuestionController = require("../controllers/question.controller");
// const UserController = require("../controllers/user.controller");
// const {
//   verifyUser,
//   verifyAdmin,
//   verifyAuthor,
// } = require("../middlewares/authenticate");

// UIRoute.get("/", uiController.homePage);

// UIRoute.get("/login", uiController.loginPage);

// UIRoute.get("/register", uiController.registerPage);
// UIRoute.get("/logout", (req, res) => {
//   res.clearCookie("token"); // xóa cookie
//   res.redirect("/"); // quay về trang chủ
// });

// // Hiển thị danh sách quiz
// // UIRoute.get("/quizzes", verifyUser, QuizController.getAllQuizzes);

// // Tạo quiz
// UIRoute.get(
//   "/quizzes/create",
//   verifyUser,
//   verifyAdmin,
//   uiController.createQuizPage
// );
// UIRoute.post(
//   "/quizzes/create",
//   verifyUser,
//   verifyAdmin,
//   QuizController.createQuiz
// );

// // Edit quiz
// UIRoute.get(
//   "/quizzes/:id/edit",
//   verifyUser,
//   verifyAdmin,
//   uiController.editQuizPage
// );
// UIRoute.put(
//   "/quizzes/:id/edit",
//   verifyUser,
//   verifyAdmin,
//   QuizController.editQuiz
// );

// // Delete quiz
// UIRoute.delete(
//   "/quizzes/:id",
//   verifyUser,
//   verifyAdmin,
//   QuizController.deleteQuiz
// );

// // Chi tiết quiz
// UIRoute.get("/quizzes/:id", verifyUser, QuizController.getDetailQuiz);

// // question
// UIRoute.get("/questions", verifyUser, QuestionController.getAllQuestion);
// UIRoute.get(
//   "/questions/:questionId",
//   verifyUser,
//   QuestionController.getQuestionById
// );

// UIRoute.get(
//   "/questions/:questionId/edit",
//   verifyUser,
//   verifyAuthor,
//   uiController.editQuestionPage
// );
// UIRoute.put(
//   "/questions/:questionId/edit",
//   verifyUser,
//   verifyAuthor,
//   QuestionController.updateQuestion
// );
// UIRoute.get(
//   "/quizzes/:quizId/question",
//   verifyUser,
//   verifyAdmin,
//   uiController.addNewQuestion
// );

// UIRoute.post(
//   "/quizzes/:quizId/question",
//   verifyUser,
//   verifyAdmin,
//   QuizController.addNewQuestion
// );

// UIRoute.delete("/questions/:questionId", QuestionController.deleteQuestion);
// UIRoute.get("/users", verifyUser, verifyAdmin, UserController.getAllUsers);

// module.exports = UIRoute;
