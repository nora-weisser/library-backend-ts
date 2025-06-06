import type { Response } from "express"
import type { AuthRequest } from "../types"
import { getAllBorrowRecords, getUserBorrowRecords, borrowBook, returnBook } from "../services/borrow.service"

export const getBorrowRecords = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    // Admin can see all records, users can only see their own
    const records = req.user.role === "admin" ? await getAllBorrowRecords() : await getUserBorrowRecords(req.user.id)

    res.json(records)
  } catch (error) {
    console.error("Get borrow records error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const borrowBookHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { bookId } = req.body

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" })
    }

    const record = await borrowBook(req.user.id, bookId)

    if (!record) {
      return res.status(400).json({ message: "Book not available for borrowing" })
    }

    res.status(201).json(record)
  } catch (error) {
    console.error("Borrow book error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const returnBookHandler = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const { borrowId } = req.params

    if (!borrowId) {
      return res.status(400).json({ message: "Borrow record ID is required" })
    }

    const record = await returnBook(req.user.id, borrowId)

    if (!record) {
      return res.status(404).json({ message: "Borrow record not found or already returned" })
    }

    res.json(record)
  } catch (error) {
    console.error("Return book error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
