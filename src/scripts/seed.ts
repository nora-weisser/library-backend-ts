import pool from "../config/database"
import { createTables } from "./migrate"

const seedData = async () => {
  try {
    console.log("🌱 Seeding database with initial data...")

    // First run migrations to ensure tables exist
    await createTables()

    // Insert default users
    await pool.query(`
      INSERT INTO users (id, username, password, role) VALUES 
      ('550e8400-e29b-41d4-a716-446655440001', 'admin', 'admin123', 'admin'),
      ('550e8400-e29b-41d4-a716-446655440002', 'user', 'user123', 'user')
      ON CONFLICT (username) DO NOTHING
    `)

    // Insert sample books
    await pool.query(`
      INSERT INTO books (id, title, author, isbn, quantity, available_quantity) VALUES 
      ('550e8400-e29b-41d4-a716-446655440003', 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 5, 5),
      ('550e8400-e29b-41d4-a716-446655440004', 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', 3, 3),
      ('550e8400-e29b-41d4-a716-446655440005', '1984', 'George Orwell', '9780451524935', 4, 4)
      ON CONFLICT (isbn) DO NOTHING
    `)

    console.log("✅ Database seeded successfully")
  } catch (error) {
    console.error("❌ Seeding failed:", error)
    throw error
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log("🎉 Database seeding completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error)
      process.exit(1)
    })
}

export { seedData }