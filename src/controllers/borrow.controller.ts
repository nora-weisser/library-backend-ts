import type { Response } from "express"
import type { AuthRequest } from "../types"
import { getAllBorrowRecords, getUserBorrowRecords, borrowBook } from "../services/borrow.service"

export const getBorrowRecords = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" })
  }

  // Admin can see all records, users can only see their own
  const records = req.user.role === "admin" ? getAllBorrowRecords() : getUserBorrowRecords(req.user.userID)

  res.json(records)
}

export const borrowBookHandler = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { bookId } = req.body

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" })
  }

  const record = borrowBook(req.user.userID, bookId)

  if (!record) {
    return res.status(400).json({ message: "Book not available for borrowing" })
  }

  res.status(201).json({
    status: "success",
    message: `Book has been borrowed successfully.`
  })
}