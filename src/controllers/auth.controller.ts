import type { Request, Response } from "express"
import type { AuthRequest } from "../types"
import { findUserByUsername, createUser, generateToken, getUserByID, getAllUsers } from "../services/user.service"
import { getUserBorrowRecords } from "../services/borrow.service"
import { getBookById } from "../services/book.service"

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  const user = findUserByUsername(username)

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" })
  }

  const token = generateToken(user)
  res.json({ token })
}

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  if (findUserByUsername(username)) {
    return res.status(409).json({ message: "Username already exists" })
  }

  const newUser = await createUser(username, password, role)
  const token = generateToken(newUser)

  res.status(201).json({
    status: "success",
    message: "User registered successfully.",
  })
}

export const getUser = async (req: Request, res: Response) => {
  const user = getUserByID(req.params.id)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  res.json(user)
}

export const getUsers = (_req: Request, res: Response) => {
  const users = getAllUsers()
  res.json(users)
}

export const getUserDashboard = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized. Please provide a valid JWT token.",
    })
  }

  const user = getUserByID(req.user.userID)

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  // Get all borrowed books for this user
  const borrowedRecords = getUserBorrowRecords(req.user.userID)

  // Calculate borrowed books with details
  const borrowedBooks = borrowedRecords.map((record) => {
    const book = getBookById(record.bookID)
    const bookData: any = {
      bookTitle: book?.title || "Unknown",
      borrowedDate: record.borrowedAt,
      deadline: record.deadline,
    }

    // If book has been returned or is overdue, add additional info
    if (record.deadline && !record.isAvailable) {
      const now = new Date()
      const deadline = new Date(record.deadline)

      if (now > deadline) {
        const daysOverdue = Math.floor((now.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24))
        bookData.fines = daysOverdue * 0.5 // $0.50 per day overdue
      }
    }

    return bookData
  })

  // Calculate total fines
  const totalFines = borrowedBooks.reduce((sum, book) => sum + (book.fines || 0), 0)

  // Count currently borrowed books (not returned)
  const currentlyBorrowed = borrowedRecords.filter((r) => !r.isAvailable).length

  const { password, ...userWithoutPassword } = user

  res.json({
    userInfo: {
      userID: user.userID,
      username: user.username,
      role: user.role,
      createdAt: new Date().toISOString(), // In production, this should come from the database
    },
    booksBorrowed: currentlyBorrowed,
    borrowedBooks: borrowedBooks,
    totalFines: totalFines,
  })
}