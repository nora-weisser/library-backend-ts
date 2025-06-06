import { v4 as uuidv4 } from "uuid"
import pool from "../config/database"
import type { Book } from "../types"

export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY title")
    return result.rows
  } catch (error) {
    console.error("Error getting all books:", error)
    throw error
  }
}

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error getting book by ID:", error)
    throw error
  }
}

export const addBook = async (bookData: Omit<Book, "id">): Promise<Book> => {
  try {
    const id = uuidv4()
    const { title, author, isbn, quantity } = bookData
    const availableQuantity = quantity

    const result = await pool.query(
      "INSERT INTO books (id, title, author, isbn, quantity, available_quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [id, title, author, isbn, quantity, availableQuantity],
    )

    return result.rows[0]
  } catch (error) {
    console.error("Error adding book:", error)
    throw error
  }
}

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book | null> => {
  try {
    const fields: string[] = []
    const values: any[] = []
    let paramCount = 1

    Object.entries(bookData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    })

    if (fields.length === 0) {
      return await getBookById(id)
    }

    values.push(id)
    const query = `UPDATE books SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`

    const result = await pool.query(query, values)
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error updating book:", error)
    throw error
  }
}

export const deleteBook = async (id: string): Promise<boolean> => {
  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1", [id])
    return result.rowCount !== null && result.rowCount > 0
  } catch (error) {
    console.error("Error deleting book:", error)
    throw error
  }
}
