import pool from "../config/database"

const createTables = async () => {
  try {
    console.log("🔄 Running database migrations...")

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create books table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity >= 0),
        available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create borrow_records table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS borrow_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        borrow_date TIMESTAMP NOT NULL DEFAULT NOW(),
        return_date TIMESTAMP,
        is_returned BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_borrow_user ON borrow_records(user_id);
      CREATE INDEX IF NOT EXISTS idx_borrow_book ON borrow_records(book_id);
      CREATE INDEX IF NOT EXISTS idx_borrow_returned ON borrow_records(is_returned);
      CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    `)

    console.log("✅ Database migrations completed successfully")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log("🎉 All migrations completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Migration failed:", error)
      process.exit(1)
    })
}

export { createTables }