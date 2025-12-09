const express = require("express");
const QuestionRoute = express.Router();
const questionController = require("../controllers/question.controller");
const {
  verifyUser,
  verifyAdmin,
  verifyAuthor,
} = require("../middlewares/authenticate");
QuestionRoute.get(
  "/",
  verifyUser,
  verifyAdmin,
  questionController.getAllQuestion
);

QuestionRoute.post(
  "/",
  verifyUser,
  verifyAdmin,
  questionController.createQuestion
);

QuestionRoute.put(
  "/:questionId",
  verifyUser,
  verifyAuthor,
  questionController.updateQuestion
);
QuestionRoute.delete(
  "/:questionId",
  verifyUser,
  verifyAuthor,
  questionController.deleteQuestion
);
QuestionRoute.get(
  "/:questionId",

  questionController.getQuestionById
);

// router.delete("/:questionId", questionController.deleteQuestion);

module.exports = QuestionRoute;
