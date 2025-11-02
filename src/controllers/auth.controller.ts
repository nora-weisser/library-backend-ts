import type { Request, Response } from "express"
import { findUserByUsername, createUser, generateToken, getUserByID, getAllUsers } from "../services/user.service"

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  const user = findUserByUsername(username)

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" })
  }

  const token = generateToken(user)
  res.json({ token, user: { id: user.id, username: user.username, role: user.role } })
}

export const register = (req: Request, res: Response) => {
  const { username, password, role } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }

  if (findUserByUsername(username)) {
    return res.status(409).json({ message: "Username already exists" })
  }

  const newUser = createUser(username, password, role)
  const token = generateToken(newUser)

  res.status(201).json({
    token,
    user: { id: newUser.id, username: newUser.username, role: newUser.role },
  })
}

export const getUser = async (req: Request, res: Response) => {
  const user = getUserByID(req.params.id);  

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
}

export const getUsers = (_req: Request, res: Response) => {
  const users = getAllUsers()
  res.json(users)
}