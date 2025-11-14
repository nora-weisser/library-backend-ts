import express from "express"
import { borrowBookHandler, getBorrowRecords, returnBookHandler } from "../controllers/borrow.controller"
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
 *               - bookCopyId
 *             properties:
 *               bookCopyId:
 *                 type: string
 *                 example: "uuid-of-book-copy"
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
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
 * /api/borrow/return:
 *   post:
 *     summary: Return a borrowed book
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
 *               - bookCopyId
 *             properties:
 *               bookCopyId:
 *                 type: string
 *                 description: Book copy ID
 *                 example: "book-copy-uuid"
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: The book 'Effective Java' has been successfully returned.
 *       400:
 *         description: Book was not borrowed by this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
router.post("/return", returnBookHandler)

export default router
