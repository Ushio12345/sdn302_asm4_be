const mongoose = require("mongoose");
const User = require("./user.model");
const Question = require("./question.model");
const Quiz = require("./quizze.model");

const db = {};

db.User = User;
db.Question = Question;
db.Quiz = Quiz;

module.exports = {
  User,
  Question,
  Quiz,
};
