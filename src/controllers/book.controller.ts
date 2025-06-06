import type { Request, Response } from "express"
import { getAllBooks, getBookById, addBook, updateBook, deleteBook } from "../services/book.service"

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await getAllBooks()
    res.json(books)
  } catch (error) {
    console.error("Get books error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await getBookById(req.params.id)

    if (!book) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.json(book)
  } catch (error) {
    console.error("Get book error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, quantity } = req.body

    if (!title || !author || !isbn || !quantity) {
      return res.status(400).json({ message: "Missing required book information" })
    }

    const newBook = await addBook({
      title,
      author,
      isbn,
      quantity: Number(quantity),
      availableQuantity: Number(quantity),
    })

    res.status(201).json(newBook)
  } catch (error) {
    console.error("Create book error:", error)
    if (error instanceof Error && error.message.includes("duplicate key")) {
      res.status(409).json({ message: "Book with this ISBN already exists" })
    } else {
      res.status(500).json({ message: "Internal server error" })
    }
  }
}

export const updateBookDetails = async (req: Request, res: Response) => {
  try {
    const updatedBook = await updateBook(req.params.id, req.body)

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.json(updatedBook)
  } catch (error) {
    console.error("Update book error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const removeBook = async (req: Request, res: Response) => {
  try {
    const success = await deleteBook(req.params.id)

    if (!success) {
      return res.status(404).json({ message: "Book not found" })
    }

    res.status(204).send()
  } catch (error) {
    console.error("Delete book error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
