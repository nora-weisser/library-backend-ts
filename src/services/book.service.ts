import { v4 as uuidv4 } from "uuid"
import type { Book } from "../types"

// In-memory book store (replace with database in production)
const books: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    quantity: 5,
    availableQuantity: 5,
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    quantity: 3,
    availableQuantity: 3,
  },
]

export const getAllBooks = (): Book[] => {
  return books
}

export const getBookById = (id: string): Book | undefined => {
  return books.find((book) => book.id === id)
}

export const addBook = (bookData: Omit<Book, "id">): Book => {
  const newBook: Book = {
    id: uuidv4(),
    ...bookData,
  }

  books.push(newBook)
  return newBook
}

export const updateBook = (id: string, bookData: Partial<Book>): Book | null => {
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return null

  books[index] = { ...books[index], ...bookData }
  return books[index]
}

export const deleteBook = (id: string): boolean => {
  const index = books.findIndex((book) => book.id === id)
  if (index === -1) return false

  books.splice(index, 1)
  return true
}
