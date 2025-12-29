import type { BookCopy } from "../types"
import { bookCopies } from "../data/store"

export const getAllBorrowRecords = (): BookCopy[] => {
  return bookCopies
}

export const getUserBorrowRecords = (userId: string): BookCopy[] => {
  return bookCopies.filter((record) => record.borrowedBy === userId)
}

export const getBookCopyById = (id: string): BookCopy | undefined => {
  return bookCopies.find((copy) => copy.bookCopyID === id)
}

export const updateBookCopy = (id: string, bookData: Partial<BookCopy>): BookCopy | null => {
  const index = bookCopies.findIndex((copy) => copy.bookCopyID === id)
  if (index === -1) return null

  bookCopies[index] = { ...bookCopies[index], ...bookData }
  return bookCopies[index]
}

export const borrowBook = (userId: string, bookCopyId: string): BookCopy | null => {
  const bookCopy = getBookCopyById(bookCopyId)

  if (!bookCopy || bookCopy.isAvailable == false) {
    return null
  }

  const borrowedAt = new Date()
  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 30)

  updateBookCopy(bookCopyId, {
    isAvailable: false,
    borrowedBy: userId,
    borrowedAt: borrowedAt,
    deadline: deadline,
  })

  return bookCopy
}

export const returnBook = (userId: string, bookCopyId: string): BookCopy | null => {
  const bookCopy = getBookCopyById(bookCopyId)

  if (!bookCopy || bookCopy.borrowedBy !== userId) {
    return null
  }

  updateBookCopy(bookCopyId, {
    isAvailable: true,
    borrowedBy: null,
    borrowedAt: null,
    deadline: null,
  })

  return bookCopy
}

export const findBookCopiesByBookId = (bookId: string): BookCopy[] => {
  return bookCopies.filter(copy => copy.bookID === bookId)
}