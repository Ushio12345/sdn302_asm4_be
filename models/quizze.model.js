const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },

  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

module.exports = mongoose.model("Quiz", QuizSchema);
