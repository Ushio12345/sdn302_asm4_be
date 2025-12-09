const { asyncHandler } = require("../middlewares/asyncHandle");
const db = require("../models/index");

module.exports = {
  homePage: (req, res) => {
    res.render("index", { title: "Home Page", user: req.user || null });
  },

  loginPage: (req, res) => {
    res.render("login", { title: "Login", error: null, userName: "" });
  },

  registerPage: (req, res) => {
    res.render("register", { title: "Register", error: null, userName: "" });
  },

  listQuizzes: async (req, res) => {
    res.render("quiz/list", {
      title: "List Quizzes",
      quizzes,
      user: req.user || null,
    });
  },
  // PAGE CREATE QUIZ
  createQuizPage: (req, res) => {
    res.render("quiz/create", {
      title: "Create Quiz",
      error: null,
      user: req.user || null,
    });
  },

  // EDIT QUIZ
  editQuizPage: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const quiz = await db.Quiz.findById(id);
    if (!quiz) {
      return res
        .status(404)
        .render("error", { message: "Quiz không tồn tại." });
    }
    res.render("quiz/edit", {
      title: "Edit Quiz",
      quiz,
      error: null,
      user: req.user || null,
    });
  }),

  detailQuiz: async (req, res) => {
    try {
      const quiz = await db.Quiz.findById(req.params.id).populate("questions");
      if (!quiz) {
        return res.status(404).render("error", {
          message: "Quiz not found",
          user: req.user || null,
        });
      }
      res.render("quiz/detail", {
        title: quiz.title,
        quiz,
        user: req.user || null,
      });
    } catch (err) {
      res
        .status(500)
        .render("error", { message: err.message, user: req.user || null });
    }
  },

  //question
  listQuestionPage: async (req, res) => {
    res.render("question/list", {
      title: "LIST QUESTIONS",
      msg: "",
      questions,
    });
  },

  //
  editQuestionPage: asyncHandler(async (req, res) => {
    const qs = req.question; // lấy từ middleware verifyAuthor
    const correctOption = qs.options[qs.correctAnswerIndex] || null;

    res.render("question/edit", {
      title: "Edit Question",
      qs,
      correctOption,
      error: null,
    });
  }),

  // add one question
  addNewQuestion: asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    return res.render("question/add_one", {
      title: "Add Question",
      quiz: await db.Quiz.findById(quizId),
      error: "",
      user: req.user || null,
    });
  }),
};
