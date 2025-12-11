const { asyncHandler } = require("../middlewares/asyncHandle");
const db = require("../models/index");

module.exports = {
  // GET ALL QUIZZES
  getAllQuizzes: asyncHandler(async (req, res) => {
    const quizzes = await db.Quiz.find().populate("questions").select("-__v");

    if (!quizzes || quizzes.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "Chưa có Quiz nào trong cơ sở dữ liệu.",
      });
    }

    res.status(200).json({
      success: true,
      data: quizzes,
    });
  }),

  // CREATE QUIZ
  createQuiz: asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Tiêu đề không được để trống",
      });
    }

    const existingQuiz = await db.Quiz.findOne({ title: title.trim() });

    if (existingQuiz) {
      return res.status(400).json({
        success: false,
        message: `Quiz với tiêu đề "${title.trim()}" đã tồn tại.`,
      });
    }

    const newQuiz = await db.Quiz.create({
      title: title.trim(),
      description: description || "",
    });

    res.status(201).json({
      success: true,
      data: newQuiz,
      message: "Tạo quiz thành công",
    });
  }),

  // EDIT QUIZ
  editQuiz: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();

    const updatedQuiz = await db.Quiz.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedQuiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz không tồn tại",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedQuiz,
      message: "Cập nhật thành công",
    });
  }),

  // GET DETAIL QUIZ
  getDetailQuiz: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const quiz = await db.Quiz.findById(id)
      .populate("questions")
      .select("-__v");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy Quiz",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  }),

  // ADD NEW QUESTION
  addNewQuestion: asyncHandler(async (req, res) => {
    const { quizId } = req.params;
    const { text, options, keywords, correctAnswerIndex } = req.body;

    if (!text || !options || correctAnswerIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "Thiếu nội dung, lựa chọn hoặc đáp án",
      });
    }

    // Xử lý options
    const optionsArray = Array.isArray(options)
      ? options.map((o) => o.trim())
      : options.split(",").map((o) => o.trim());

    if (optionsArray.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Cần ít nhất 4 lựa chọn",
      });
    }

    // Kiểm tra câu hỏi trùng text
    const existingQuestion = await db.Question.findOne({ text });

    let questionIdToUse;

    if (existingQuestion) {
      const existInQuiz = await db.Quiz.findOne({
        _id: quizId,
        questions: existingQuestion._id,
      });

      if (existInQuiz) {
        return res.status(400).json({
          success: false,
          message: "Câu hỏi này đã tồn tại trong Quiz",
        });
      }

      questionIdToUse = existingQuestion._id;
    } else {
      // Xử lý keywords đúng
      const keywordArray = keywords
        ? Array.isArray(keywords)
          ? keywords
          : keywords.split(",").map((k) => k.trim())
        : [];

      const newQuestion = await db.Question.create({
        text,
        options: optionsArray,
        keywords: keywordArray,
        correctAnswerIndex: Number(correctAnswerIndex),
        author: req.user?._id,
      });

      questionIdToUse = newQuestion._id;
    }

    await db.Quiz.findByIdAndUpdate(quizId, {
      $push: { questions: questionIdToUse },
    });

    res.status(201).json({
      success: true,
      message: "Thêm câu hỏi thành công",
      questionId: questionIdToUse,
    });
  }),

  // =============================
  // ADD MULTIPLE QUESTIONS
  // =============================
  addMultipleQuestions: asyncHandler(async (req, res) => {
    const { id: quizId } = req.params;
    const questionsArray = req.body;

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid questions array",
      });
    }

    const inputTexts = questionsArray.map((q) => q.text);

    const existingQuestions = await db.Question.find({
      text: { $in: inputTexts },
    });

    const existingQuestionMap = new Map(
      existingQuestions.map((q) => [q.text, q])
    );

    const quiz = await db.Quiz.findById(quizId);
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });

    const existingQuizQuestionIds = new Set(
      quiz.questions.map((id) => id.toString())
    );

    const questionIdsToPush = [];
    const newQuestionsToCreate = [];
    let skippedCount = 0;

    for (const q of questionsArray) {
      const { text, options, correctAnswerIndex } = q;

      if (
        !text ||
        !options ||
        correctAnswerIndex === undefined ||
        options.length < 4
      ) {
        skippedCount++;
        continue;
      }

      const existing = existingQuestionMap.get(text);

      if (existing) {
        if (!existingQuizQuestionIds.has(existing._id.toString())) {
          questionIdsToPush.push(existing._id);
        } else {
          skippedCount++;
        }
      } else {
        newQuestionsToCreate.push({
          ...q,
          author: req.user?._id,
        });
      }
    }

    const createdQuestions = await db.Question.insertMany(newQuestionsToCreate);
    questionIdsToPush.push(...createdQuestions.map((q) => q._id));

    if (questionIdsToPush.length > 0) {
      await db.Quiz.updateOne(
        { _id: quizId },
        { $push: { questions: { $each: questionIdsToPush } } }
      );
    }

    res.status(201).json({
      success: true,
      message: `Added ${questionIdsToPush.length}, skipped ${skippedCount}.`,
      added: questionIdsToPush.length,
      skipped: skippedCount,
    });
  }),

  // DELETE QUIZ

  deleteQuiz: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const quizToDelete = await db.Quiz.findById(id);

    if (!quizToDelete) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy quiz để xoá",
      });
    }

    // Xoá luôn all questions thuộc quiz
    await db.Question.deleteMany({ _id: { $in: quizToDelete.questions } });

    await db.Quiz.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Xoá Quiz + các Question liên quan thành công",
    });
  }),
};
