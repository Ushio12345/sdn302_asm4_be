const { asyncHandler } = require("../middlewares/asyncHandle");
const db = require("../models/index");

module.exports = {
  //  GET ALL QUESTIONS

  getAllQuestion: asyncHandler(async (req, res) => {
    const questions = await db.Question.find()
      .select("-__v")
      .populate({ path: "author", select: "userName _id" });

    return res.status(200).json({
      success: true,
      message: "Fetched all questions successfully.",
      data: questions,
    });
  }),

  // GET QUESTION BY ID

  getQuestionById: asyncHandler(async (req, res) => {
    const { questionId } = req.params;

    const question = await db.Question.findById(questionId)
      .select("-__v")
      .populate({ path: "author", select: "userName _id" });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched question successfully.",
      data: question,
    });
  }),

  //  UPDATE QUESTION

  updateQuestion: asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    let { text, options, keywords, correctAnswerIndex } = req.body;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }

    // convert options to array
    if (typeof options === "string") {
      options = options
        .split(",")
        .map((o) => o.trim())
        .filter((o) => o);
    }

    // convert keywords to array
    if (typeof keywords === "string") {
      keywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);
    }

    if (correctAnswerIndex !== undefined) {
      correctAnswerIndex = parseInt(correctAnswerIndex);
    }

    const updatePayload = {
      text,
      options,
      keywords,
      correctAnswerIndex,
    };

    const updated = await db.Question.findByIdAndUpdate(
      questionId,
      updatePayload,
      { new: true }
    ).select("-__v");

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      data: updated,
    });
  }),

  // CREATE SINGLE QUESTION

  createQuestion: asyncHandler(async (req, res) => {
    const questionData = req.body;

    const newQuestion = new db.Question(questionData);
    await newQuestion.save();

    return res.status(201).json({
      success: true,
      message: "Question created successfully.",
      data: newQuestion,
    });
  }),

  // DELETE QUESTION

  deleteQuestion: asyncHandler(async (req, res) => {
    const { questionId } = req.params;

    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "Question ID is required.",
      });
    }

    const deleted = await db.Question.findByIdAndDelete(questionId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Remove question from any quiz containing it
    await db.Quiz.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  }),
};
