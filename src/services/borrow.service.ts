import { v4 as uuidv4 } from "uuid"
import pool from "../config/database"
import type { BorrowRecord } from "../types"

export const getAllBorrowRecords = async (): Promise<BorrowRecord[]> => {
  try {
    const result = await pool.query(`
      SELECT br.*, b.title as book_title, u.username 
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN users u ON br.user_id = u.id
      ORDER BY br.borrow_date DESC
    `)
    return result.rows
  } catch (error) {
    console.error("Error getting all borrow records:", error)
    throw error
  }
}

export const getUserBorrowRecords = async (userId: string): Promise<BorrowRecord[]> => {
  try {
    const result = await pool.query(
      `
      SELECT br.*, b.title as book_title 
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      WHERE br.user_id = $1
      ORDER BY br.borrow_date DESC
    `,
      [userId],
    )
    return result.rows
  } catch (error) {
    console.error("Error getting user borrow records:", error)
    throw error
  }
}

export const borrowBook = async (userId: string, bookId: string): Promise<BorrowRecord | null> => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Check if book is available
    const bookResult = await client.query("SELECT * FROM books WHERE id = $1", [bookId])
    const book = bookResult.rows[0]

    if (!book || book.available_quantity <= 0) {
      await client.query("ROLLBACK")
      return null
    }

    // Update book available quantity
    await client.query(
      "UPDATE books SET available_quantity = available_quantity - 1, updated_at = NOW() WHERE id = $1",
      [bookId],
    )

    // Create borrow record
    const borrowId = uuidv4()
    const borrowResult = await client.query(
      "INSERT INTO borrow_records (id, user_id, book_id, borrow_date, is_returned) VALUES ($1, $2, $3, NOW(), FALSE) RETURNING *",
      [borrowId, userId, bookId],
    )

    await client.query("COMMIT")
    return borrowResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error borrowing book:", error)
    throw error
  } finally {
    client.release()
  }
}

export const returnBook = async (userId: string, borrowId: string): Promise<BorrowRecord | null> => {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Find the borrow record
    const borrowResult = await client.query(
      "SELECT * FROM borrow_records WHERE id = $1 AND user_id = $2 AND is_returned = FALSE",
      [borrowId, userId],
    )

    if (borrowResult.rows.length === 0) {
      await client.query("ROLLBACK")
      return null
    }

    const borrowRecord = borrowResult.rows[0]

    // Update borrow record
    await client.query(
      "UPDATE borrow_records SET return_date = NOW(), is_returned = TRUE, updated_at = NOW() WHERE id = $1",
      [borrowId],
    )

    // Update book available quantity
    await client.query(
      "UPDATE books SET available_quantity = available_quantity + 1, updated_at = NOW() WHERE id = $1",
      [borrowRecord.book_id],
    )

    // Get updated borrow record
    const updatedResult = await client.query("SELECT * FROM borrow_records WHERE id = $1", [borrowId])

    await client.query("COMMIT")
    return updatedResult.rows[0]
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error returning book:", error)
    throw error
  } finally {
    client.release()
  }
}