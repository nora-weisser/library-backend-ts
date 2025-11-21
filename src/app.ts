import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { specs } from "./swagger"
import authRoutes from "./routes/auth.routes"
import bookRoutes from "./routes/book.routes"
import userRoutes from "./routes/user.routes"
import borrowRoutes from "./routes/borrow.routes"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.get('/api-docs.json', (req, res) => {
  res.json(specs)
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)
app.use("/api/users", userRoutes)
app.use("/api/borrow", borrowRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

export default app
