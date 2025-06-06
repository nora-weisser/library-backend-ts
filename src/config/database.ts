import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "library_management",
  password: process.env.DB_PASSWORD || "password",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
})

// Test the connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database")
})

pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err)
  process.exit(-1)
})

export default pool