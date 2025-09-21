import type { Request, Response } from "express"
import { getAllBooks, getBookById, addBook, updateBook, deleteBook } from "../services/book.service"

export const getBooks = (_req: Request, res: Response) => {
  const books = getAllBooks()
  res.json(books)
}

export const getBook = (req: Request, res: Response) => {
  const book = getBookById(req.params.id)

  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }

  res.json(book)
}

export const createBook = (req: Request, res: Response) => {
  const { title, author, isbn, quantity } = req.body

  if (!title || !author || !isbn || !quantity) {
    return res.status(400).json({ message: "Missing required book information" })
  }

  const newBook = addBook({
    title,
    author,
    isbn,
    quantity: Number(quantity),
    availableQuantity: Number(quantity),
  })

  res.status(201).json(newBook)
}

export const updateBookDetails = (req: Request, res: Response) => {
  const updatedBook = updateBook(req.params.id, req.body)

  if (!updatedBook) {
    return res.status(404).json({ message: "Book not found" })
  }

  res.json(updatedBook)
}

export const removeBook = (req: Request, res: Response) => {
  const success = deleteBook(req.params.id)

  if (!success) {
    return res.status(404).json({ message: "Book not found" })
  }

  res.status(204).send()
}
