import express from "express"
import { getBorrowRecords, borrowBookHandler, returnBookHandler } from "../controllers/borrow.controller"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

// All routes require authentication
router.use(authenticateToken)

/**
 * @swagger
 * /api/borrow:
 *   get:
 *     summary: Get borrowing records (all for admin, personal for users)
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowing records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BorrowRecord'
 *       401:
 *         description: Unauthorized
 */
router.get("/", getBorrowRecords)

/**
 * @swagger
 * /api/borrow/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRecord'
 *       400:
 *         description: Book not available for borrowing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post("/borrow", borrowBookHandler)

/**
 * @swagger
 * /api/borrow/return/{borrowId}:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Borrowing]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: borrowId
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow record ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BorrowRecord'
 *       404:
 *         description: Borrow record not found or already returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post("/return/:borrowId", returnBookHandler)

export default router
