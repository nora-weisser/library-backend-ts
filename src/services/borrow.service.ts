import { v4 as uuidv4 } from "uuid"
import type { BorrowRecord } from "../types"
import { getBookById, updateBook } from "./book.service"

// In-memory borrow records store (replace with database in production)
const borrowRecords: BorrowRecord[] = []

export const getAllBorrowRecords = (): BorrowRecord[] => {
  return borrowRecords
}

export const getUserBorrowRecords = (userId: string): BorrowRecord[] => {
  return borrowRecords.filter((record) => record.userId === userId)
}

export const borrowBook = (userId: string, bookId: string): BorrowRecord | null => {
  const book = getBookById(bookId)

  if (!book || book.availableQuantity <= 0) {
    return null
  }

  // Update book available quantity
  updateBook(bookId, { availableQuantity: book.availableQuantity - 1 })

  // Create borrow record
  const borrowRecord: BorrowRecord = {
    id: uuidv4(),
    userId,
    bookId,
    borrowDate: new Date(),
    returnDate: null,
    isReturned: false,
  }

  borrowRecords.push(borrowRecord)
  return borrowRecord
}

export const returnBook = (userId: string, borrowId: string): BorrowRecord | null => {
  const index = borrowRecords.findIndex(
    (record) => record.id === borrowId && record.userId === userId && !record.isReturned,
  )

  if (index === -1) return null

  // Update borrow record
  borrowRecords[index].returnDate = new Date()
  borrowRecords[index].isReturned = true

  // Update book available quantity
  const book = getBookById(borrowRecords[index].bookId)
  if (book) {
    updateBook(book.id, { availableQuantity: book.availableQuantity + 1 })
  }

  return borrowRecords[index]
}
