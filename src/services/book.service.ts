import { v4 as uuidv4 } from "uuid"
import type { Book, BookInstance } from "../types"
import { bookInstances } from "./borrow.service"

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

export const addBookInstances = (bookID: string, totalQuantity: number): BookInstance[] => {
  const newInstances: BookInstance[] = []

  for (let i = 0; i < totalQuantity; i++) {
    const instance: BookInstance = {
      bookInstanceID: uuidv4(),
      bookID,
      isAvailable: true,
      borrowedBy: null,
      borrowedAt: null,
      deadline: null,
      remark: null
    }

    newInstances.push(instance)
    bookInstances.push(instance)
  }

  return newInstances
}

export const updateBook = (id: string, bookData: Partial<Book>): Book | null => {
  const index = books.findIndex((book) => book.bookID === id)
  if (index === -1) return null

  books[index] = { ...books[index], ...bookData }
  return books[index]
}

export const deleteBook = (id: string): boolean => {
  const index = books.findIndex((book) => book.bookID === id)
  if (index === -1) return false

  books.splice(index, 1)
  return true
}
