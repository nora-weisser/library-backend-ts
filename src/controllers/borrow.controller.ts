import type { Response } from "express"
import type { AuthRequest } from "../types"
import { getAllBorrowRecords, getUserBorrowRecords, borrowBook, returnBook } from "../services/borrow.service"
import { getBookById } from "../services/book.service"

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

  const { bookCopyId } = req.body

  if (!bookCopyId) {
    return res.status(400).json({ message: "Book Copy ID is required" })
  }

  const record = borrowBook(req.user.userID, bookCopyId)

  if (!record) {
    return res.status(400).json({
      status: "error",
      message: "Sorry, the book copy you requested is currently unavailable.",
    })
  }

  const book = getBookById(record.bookID)

  res.status(201).json({
    status: "success",
    message: `You have successfully borrowed the book${book ? ` '${book.title}'` : ""}.`,
    bookTitle: book?.title,
    borrowedBy: req.user.userID,
    bookCopyID: record.bookCopyID,
    deadline: record.deadline,
  })
}

export const returnBookHandler = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const { bookCopyId } = req.body

  if (!bookCopyId) {
    return res.status(400).json({ message: "Book Copy ID is required" })
  }

  const record = returnBook(req.user.userID, bookCopyId)

  if (!record) {
    return res.status(400).json({
      status: "error",
      message: "This book was not borrowed by you.",
    })
  }

  const book = getBookById(record.bookID)

  res.json({
    status: "success",
    message: `The book${book ? ` '${book.title}'` : ""} has been successfully returned.`,
  })
}
