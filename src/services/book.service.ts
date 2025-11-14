import { v4 as uuidv4 } from "uuid"
import type { Book, BookCopy } from "../types"
import { bookCopies } from "./borrow.service"

// In-memory book store (replace with database in production)
const books: Book[] = [
  {
    bookID: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    description: "",
  },
  {
    bookID: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "",
    isbn: "9780061120084",
  },
]

export const getAllBooks = (): Book[] => {
  return books
}

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.bookID === id)
}

export const addBook = (bookData: Omit<Book, "bookID">): Book => {
  const newBook: Book = {
    bookID: uuidv4(),
    ...bookData,
  }

  books.push(newBook)
  return newBook
}

export const addBookCopies = (bookID: string, totalQuantity: number): BookCopy[] => {
  const newCopies: BookCopy[] = []

  for (let i = 0; i < totalQuantity; i++) {
    const copy: BookCopy = {
      bookCopyID: uuidv4(),
      bookID,
      isAvailable: true,
      borrowedBy: null,
      borrowedAt: null,
      deadline: null,
      remark: null,
    }

    newCopies.push(copy)
    bookCopies.push(copy)
  }

  return newCopies
}

export const updateBook = (id: string, bookData: Partial<Book>): Book | null => {
  const index = books.findIndex((book) => book.bookID === id)
  if (index === -1) return null

  books[index] = { ...books[index], ...bookData }
  return books[index]
}

export const deleteBook = (id: string): boolean => {
  const bookCopiesForBook = bookCopies.filter((copy) => copy.bookID === id)
  const hasBorrowedCopies = bookCopiesForBook.some((copy) => !copy.isAvailable)

  if (hasBorrowedCopies) {
    throw new Error("Cannot delete book. Some copies are currently borrowed.")
  }

  const index = books.findIndex((book) => book.bookID === id)
  if (index === -1) return false

  const copyIndices = bookCopies
    .map((copy, idx) => (copy.bookID === id ? idx : -1))
    .filter((idx) => idx !== -1)
    .sort((a, b) => b - a)

  copyIndices.forEach((idx) => bookCopies.splice(idx, 1))

  books.splice(index, 1)
  return true
}

export const deleteBookCopy = (copyID: string): boolean => {
  const index = bookCopies.findIndex((copy) => copy.bookCopyID === copyID)
  if (index === -1) return false

  const copy = bookCopies[index]

  if (!copy.isAvailable) {
    throw new Error("Cannot delete book copy. It is currently borrowed.")
  }

  bookCopies.splice(index, 1)
  return true
}

export const updateBookCopyRemark = (copyID: string, remark: string): BookCopy | null => {
  const copy = bookCopies.find((copy) => copy.bookCopyID === copyID)
  if (!copy) return null

  copy.remark = remark
  return copy
}
