import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import type { User } from "../types"
import { getUserBorrowRecords } from "./borrow.service"

// In-memory user store (replace with database in production)
const users: User[] = [
  {
    userID: uuidv4(),
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    userID: uuidv4(),
    username: "user",
    password: "user123",
    role: "user",
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const SALT_ROUNDS = 10

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const findUserByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username)
}

export const createUser = async (
  username: string,
  password: string,
  role: "admin" | "user" = "user",
): Promise<User> => {
  const hashedPassword = await hashPassword(password)
  const newUser: User = {
    userID: uuidv4(),
    username,
    password: hashedPassword, // In production: await hashPassword(password)
    role,
  }

  users.push(newUser)
  return newUser
}

export const generateToken = (user: User): string => {
  const { password, ...userWithoutPassword } = user
  return jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: "24h" })
}

export const getUserByID = (id: string): User | undefined => {
  return users.find((user) => user.userID === id)
}

export const getAllUsers = (): User[] => {
  return users
}

export const getUserDashboard = (userId: string) => {
  const user = getUserByID(userId)
  if (!user) return null

  const borrowedBooks = getUserBorrowRecords(userId)
  const currentlyBorrowed = borrowedBooks.filter((record) => !record.isAvailable)

  return {
    userID: user.userID,
    username: user.username,
    role: user.role,
    borrowedBooks: currentlyBorrowed,
    totalBorrowed: currentlyBorrowed.length,
  }
}