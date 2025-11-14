import type { Request, Response } from "express"
import { getAllBooks, getBookById, addBook, updateBook, deleteBook, addBookCopies, deleteBookCopy, updateBookCopyRemark } from "../services/book.service"

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
  const { isbn, title, author, description, totalQuantity } = req.body

  if (!title || !author || !isbn || !totalQuantity) {
    return res.status(400).json({ message: "Missing required book information" })
  }

  const newBook = addBook({
    isbn,
    title,
    author,
    description,
  })

  const copies = addBookCopies(newBook.bookID, totalQuantity)

  res.status(201).json({
    status: "success",
    message: `Book '${newBook.title}' added successfully.`,
  })
}

export const updateBookDetails = (req: Request, res: Response) => {
  const updatedBook = updateBook(req.params.id, req.body)

  if (!updatedBook) {
    return res.status(404).json({ message: "Book not found" })
  }

  res.json({
    status: "success",
    message: `Book updated successfully.`,
  })
}

export const removeBook = (req: Request, res: Response) => {
  try {
    const success = deleteBook(req.params.id)

    if (!success) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.status(204).send()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const removeBookCopy = (req: Request, res: Response) => {
  try {
    const success = deleteBookCopy(req.params.copyId)

    if (!success) {
      return res.status(404).json({ message: "Book copy not found" })
    }

    res.status(204).send()
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const updateCopyRemark = (req: Request, res: Response) => {
  const { remark } = req.body

  if (remark === undefined) {
    return res.status(400).json({ message: "Remark is required" })
  }

  const updatedCopy = updateBookCopyRemark(req.params.copyId, remark)

  if (!updatedCopy) {
    return res.status(404).json({ message: "Book copy not found" })
  }

  res.json({
    status: "success",
    message: "Book copy remark updated successfully",
    data: updatedCopy
  })
}
