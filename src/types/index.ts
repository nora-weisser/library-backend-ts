import type { Request } from "express"

// User related types
export interface User {
  userID: string
  username: string
  password: string // In a real app, this would be hashed
  role: "admin" | "user"
}

export interface AuthRequest extends Request {
  user?: User
}

// Book related types
export interface Book {
  bookID: string
  isbn: string
  title: string
  author: string
  description: string
}

// Book Instance related types
export interface BookCopy {
  bookCopyID: string
  bookID: string
  isAvailable: boolean
  borrowedAt: Date | null
  borrowedBy: string | null
  deadline: Date | null
  remark: string | null
}