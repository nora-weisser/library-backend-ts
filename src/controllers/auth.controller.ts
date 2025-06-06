import type { Request, Response } from "express"
import { findUserByUsername, createUser, generateToken } from "../services/user.service"

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" })
    }

    const user = await findUserByUsername(username)

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" })
    }

    const token = generateToken(user)
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, role } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" })
    }

    const existingUser = await findUserByUsername(username)
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" })
    }

    const newUser = await createUser(username, password, role)
    const token = generateToken(newUser)

    res.status(201).json({
      token,
      user: { id: newUser.id, username: newUser.username, role: newUser.role },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
