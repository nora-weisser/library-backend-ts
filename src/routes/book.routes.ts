import express from "express"
import { getBooks, getBook, createBook, updateBookDetails, removeBook, removeBookCopy, updateCopyRemark, getBookInstances } from "../controllers/book.controller"
import { authenticateToken, isAdmin } from "../middleware/auth"

const router = express.Router()

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security: []
 *     responses:
 *       200:
 *         description: List of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", getBooks)

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getBook)

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - description
 *               - isbn
 *               - totalQuantity
 *             properties:
 *               title:
 *                 type: string
 *                 example: "1984"
 *               author:
 *                 type: string
 *                 example: "George Orwell"
 *               description:
 *                 type: string
 *                 example: ""
 *               isbn:
 *                 type: string
 *                 example: "9780451524935"
 *               totalQuantity:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Missing required book information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/", authenticateToken, isAdmin, createBook)

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put("/:id", authenticateToken, isAdmin, updateBookDetails)

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       204:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id", authenticateToken, isAdmin, removeBook)

/**
 * @swagger
 * /api/books/copies/{copyId}:
 *   delete:
 *     summary: Delete a book copy (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: copyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book Copy ID
 *     responses:
 *       204:
 *         description: Book copy deleted successfully
 *       400:
 *         description: Cannot delete - copy is currently borrowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book copy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/copies/:copyId", authenticateToken, isAdmin, removeBookCopy)

/**
 * @swagger
 * /api/books/copies/{copyId}/remark:
 *   put:
 *     summary: Update a book copy remark (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: copyId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book Copy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - remark
 *             properties:
 *               remark:
 *                 type: string
 *                 example: "Book has water damage on page 15"
 *     responses:
 *       200:
 *         description: Book copy remark updated successfully
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
 *                   example: Book copy remark updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/BookCopy'
 *       400:
 *         description: Remark is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book copy not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put("/copies/:copyId/remark", authenticateToken, isAdmin, updateCopyRemark)

/**
 * @swagger
 * /api/books/{bookId}/instances:
 *   get:
 *     summary: Get all instances (copies) of a book by book ID
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: List of book instances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   bookInstanceID:
 *                     type: string
 *                     example: bi-1
 *                   bookID:
 *                     type: string
 *                     example: b-10
 *                   isAvailable:
 *                     type: boolean
 *                     example: true
 *                   borrowedBy:
 *                     type: string
 *                     nullable: true
 *                     example: u-3
 *                   deadline:
 *                     type: string
 *                     format: date
 *                     nullable: true
 *                     example: 2026-01-15
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:bookId/instances", getBookInstances);

export default router