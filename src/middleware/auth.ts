import type { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import type { AuthRequest, User } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key" // Use environment variable in production

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" })
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as User
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
