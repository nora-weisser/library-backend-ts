import type { Request, Response } from "express"
import { getAllBooks, getBookById, addBook, updateBook, deleteBook, addBookCopies, deleteBookCopy, updateBookCopyRemark } from "../services/book.service"
import { findBookCopiesByBookId } from "../services/borrow.service";

export const getBooks = (_req: Request, res: Response) => {
  try {
    const books = getAllBooks(); 
    res.json(books);
  } catch (error) {
    res.status(500).send('Internal server error'); 
  }
};

export const getBook = (req: Request, res: Response) => {
  const book = getBookById(req.params.id)

  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }

  res.json(book)
}

export const createBook = (req: Request, res: Response) => {
  try {
    const { isbn, title, author, description, totalQuantity } = req.body

    if (!title || !author || !isbn) {
      return res.status(400).json({
        message: "title, author and isbn are required",
      })
    }

    if (
      typeof totalQuantity !== "number" ||
      totalQuantity <= 0 ||
      !Number.isInteger(totalQuantity)
    ) {
      return res.status(400).json({
        message: "totalQuantity must be a positive integer",
      })
    }

    const newBook = addBook({
      isbn,
      title,
      author,
      description: description ?? "",
    })

    const copies = addBookCopies(newBook.bookID, totalQuantity)

    return res.status(201).json({
      status: "success",
      message: `Book '${newBook.title}' added successfully.`,
      data: {
        book: newBook,
        totalCopies: copies.length,
        copies,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: "Failed to create book",
    })
  }
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

export const getBookInstances = (req: Request, res: Response) => {
  const { bookId } = req.params

  const book = getBookById(bookId)
  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }

  const instances = findBookCopiesByBookId(bookId)
  return res.status(200).json(instances)
}
