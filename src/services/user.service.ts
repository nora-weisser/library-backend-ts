import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import type { User } from "../types"

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

export const findUserByUsername = (username: string): User | undefined => {
  return users.find((user) => user.username === username)
}

export const createUser = (username: string, password: string, role: "admin" | "user" = "user"): User => {
  const newUser: User = {
    userID: uuidv4(),
    username,
    password, 
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
