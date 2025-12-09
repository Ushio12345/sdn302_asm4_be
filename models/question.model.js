const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 4,
        message: "A question must have at least 4 options.",
      },
    },
    keywords: {
      type: [String],
      default: [],
    },
    correctAnswerIndex: {
      type: Number,
      required: true,
      validate: {
        validator: function (index) {
          return index >= 0 && index < this.options.length;
        },
        message: "Correct answer index must be within options array.",
      },
    },
    quiz: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
