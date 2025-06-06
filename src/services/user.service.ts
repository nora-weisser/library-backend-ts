import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import pool from "../config/database"
import type { User } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const findUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error finding user by username:", error)
    throw error
  }
}

export const findUserById = async (id: string): Promise<User | null> => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    return result.rows.length > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("Error finding user by ID:", error)
    throw error
  }
}

export const createUser = async (
  username: string,
  password: string,
  role: "admin" | "user" = "user",
): Promise<User> => {
  try {
    const id = uuidv4()
    const result = await pool.query(
      "INSERT INTO users (id, username, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, username, password, role],
    )
    return result.rows[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const generateToken = (user: User): string => {
  const { password, ...userWithoutPassword } = user
  return jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: "24h" })
}
