import type { Request } from "express"

// User related types
export interface User {
  id: string
  username: string
  password: string // In a real app, this would be hashed
  role: "admin" | "user"
}

export interface AuthRequest extends Request {
  user?: User
}

// Book related types
export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  quantity: number
  availableQuantity: number
}

// Borrow related types
export interface BorrowRecord {
  id: string
  userId: string
  bookId: string
  borrowDate: Date
  returnDate: Date | null
  isReturned: boolean
}
