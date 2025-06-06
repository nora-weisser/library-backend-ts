import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { AuthRequest, User } from "../types"
import { findUserById } from "../services/user.service"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    // Fetch fresh user data from database
    const user = await findUserById(decoded.id)

    if (!user) {
      return res.status(403).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" })
  }
}

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" })
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }

  next()
}
