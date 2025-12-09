const express = require("express");
const QuizzRoute = express.Router();
const quizzesController = require("../controllers/quiz.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

QuizzRoute.route("/")
  .get(quizzesController.getAllQuizzes)
  .post(verifyUser, verifyAdmin, quizzesController.createQuiz);

QuizzRoute.route("/:id")

  .get(quizzesController.getDetailQuiz)

  .put(verifyUser, verifyAdmin, quizzesController.editQuiz)
  // DELETE quiz
  .delete(verifyUser, verifyAdmin, quizzesController.deleteQuiz);

QuizzRoute.post(
  "/:id/question",
  verifyUser,
  verifyAdmin,
  quizzesController.addNewQuestion
);

QuizzRoute.post(
  "/:id/questions",
  verifyUser,
  verifyAdmin,

  quizzesController.addMultipleQuestions
);

module.exports = QuizzRoute;
