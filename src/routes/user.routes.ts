import express from "express"
import { getUser, getUsers, getUserDashboard } from "../controllers/auth.controller"
import { authenticateToken } from "../middleware/auth"

const router = express.Router()

/**
 * @swagger
 * /api/users/dashboard:
 *   get:
 *     summary: Get user dashboard with borrowed books and fines
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userInfo:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                 booksBorrowed:
 *                   type: number
 *                 borrowedBooks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalFines:
 *                   type: number
 *       401:
 *         description: Unauthorized
 */
router.get("/dashboard", authenticateToken, getUserDashboard)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", getUser)

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security: []
 *     responses:
 *       200:
 *         description: All User details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
router.get("/", getUsers)

export default router
