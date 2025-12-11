const express = require("express");
const QuizzRoute = express.Router();
const quizzesController = require("../controllers/quiz.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/authenticate");

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management endpoints
 */

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: List of all quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quiz'
 */
QuizzRoute.get("/", quizzesController.getAllQuizzes);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid input
 */
QuizzRoute.post("/", verifyUser, verifyAdmin, quizzesController.createQuiz);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Get quiz detail by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */
QuizzRoute.get("/:id", quizzesController.getDetailQuiz);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       404:
 *         description: Quiz not found
 */
QuizzRoute.put("/:id", verifyUser, verifyAdmin, quizzesController.editQuiz);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 */
QuizzRoute.delete(
  "/:id",
  verifyUser,
  verifyAdmin,
  quizzesController.deleteQuiz
);

/**
 * @swagger
 * /api/quizzes/{id}/question:
 *   post:
 *     summary: Add a single question to a quiz
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: Question ID
 *     responses:
 *       200:
 *         description: Question added to quiz
 *       404:
 *         description: Quiz not found
 */
QuizzRoute.post(
  "/:quizId/question",
  verifyUser,
  verifyAdmin,
  quizzesController.addNewQuestion
);

/**
 * @swagger
 * /api/quizzes/{id}/questions:
 *   post:
 *     summary: Add multiple questions to a quiz
 *     tags: [Quizzes]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Questions added to quiz
 *       404:
 *         description: Quiz not found
 */
QuizzRoute.post(
  "/:id/questions",
  verifyUser,
  verifyAdmin,
  quizzesController.addMultipleQuestions
);

module.exports = QuizzRoute;

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         questions:
 *           type: array
 *           items:
 *             type: string
 */
