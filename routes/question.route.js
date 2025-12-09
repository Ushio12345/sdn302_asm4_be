const express = require("express");
const QuestionRoute = express.Router();
const questionController = require("../controllers/question.controller");
const {
  verifyUser,
  verifyAdmin,
  verifyAuthor,
} = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management endpoints
 */

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *       401:
 *         description: Unauthorized
 */
QuestionRoute.get(
  "/",
  verifyUser,
  verifyAdmin,
  questionController.getAllQuestion
);

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Bad request
 */
QuestionRoute.post(
  "/",
  verifyUser,
  verifyAdmin,
  questionController.createQuestion
);

/**
 * @swagger
 * /api/questions/{questionId}:
 *   get:
 *     summary: Get a question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: Question details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       404:
 *         description: Question not found
 */
QuestionRoute.get("/:questionId", questionController.getQuestionById);

/**
 * @swagger
 * /api/questions/{questionId}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Question not found
 */
QuestionRoute.put(
  "/:questionId",
  verifyUser,
  verifyAuthor,
  questionController.updateQuestion
);

/**
 * @swagger
 * /api/questions/{questionId}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The question ID
 *     responses:
 *       200:
 *         description: Question deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Question not found
 */
QuestionRoute.delete(
  "/:questionId",
  verifyUser,
  verifyAuthor,
  questionController.deleteQuestion
);

module.exports = QuestionRoute;

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - text
 *         - options
 *         - correctAnswerIndex
 *         - author
 *       properties:
 *         text:
 *           type: string
 *           description: The question text
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of options (at least 4)
 *         keywords:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of keywords
 *         correctAnswerIndex:
 *           type: integer
 *           description: Index of the correct option
 *         quiz:
 *           type: array
 *           items:
 *             type: string
 *           description: Related quiz IDs
 *         author:
 *           type: string
 *           description: Author user ID
 */
