import { v4 as uuidv4 } from "uuid"
import type { BookInstance } from "../types"
import { getBookById, updateBook } from "./book.service"

// In-memory borrow records store (replace with database in production)
export const bookInstances: BookInstance[] = []

export const getAllBorrowRecords = (): BookInstance[] => {
  return bookInstances
}

export const getUserBorrowRecords = (userId: string): BookInstance[] => {
  return bookInstances.filter((record) => record.borrowedBy === userId)
}

export const getBookCopyById = (id: string): BookInstance | undefined => {
  return bookInstances.find((book) => book.bookInstanceID === id)
}

export const updateBookInstance = (id: string, bookData: Partial<BookInstance>): BookInstance | null => {
  const index = bookInstances.findIndex((book) => book.bookInstanceID === id)
  if (index === -1) return null

  bookInstances[index] = { ...bookInstances[index], ...bookData }
  return bookInstances[index]
}

export const borrowBook = (userId: string, bookId: string): BookInstance | null => {
  const book = getBookCopyById(bookId)

  if (!book || book.isAvailable == false) {
    return null
  }

  const currentDate = new Date();
  const deadline = currentDate.setDate(currentDate.getDate() + 30)
  updateBookInstance(bookId, { isAvailable: false, borrowedBy: userId, borrowedAt: currentDate, deadline: new Date(deadline)})

  return book
}
