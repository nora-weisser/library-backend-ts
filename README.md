# Library Management System Backend

A RESTful API backend for a library management system built with Express and TypeScript. This system allows for book management, user authentication, and borrowing functionality with role-based access control.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin and User roles)
  - Secure routes with middleware

- **Book Management**
  - List all books
  - Get book details
  - Add new books (Admin only)
  - Update book information (Admin only)
  - Delete books (Admin only)

- **Borrowing System**
  - Borrow books
  - Return books
  - View borrowing history
  - Track book availability

- **API Documentation**
  - Interactive Swagger documentation

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety and better developer experience
- **JWT** - Authentication mechanism
- **UUID** - Generating unique identifiers
- **Swagger** - API documentation

## Project Structure

\`\`\`
src/
├── controllers/       # Request handlers
│   ├── authController.ts
│   ├── bookController.ts
│   └── borrowController.ts
├── middleware/        # Express middleware
│   └── auth.ts
├── routes/            # API routes
│   ├── authRoutes.ts
│   ├── bookRoutes.ts
│   └── borrowRoutes.ts
├── services/          # Business logic and data access
│   ├── bookService.ts
│   ├── borrowService.ts
│   └── userService.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── swagger.ts         # Swagger configuration
├── app.ts             # Express app setup
└── server.ts          # Entry point
\`\`\`

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/library-management-backend.git
   cd library-management-backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set environment variables:
   Create a `.env` file in the root directory with the following variables:
   \`\`\`
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Build for production:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## API Documentation

The API is documented using Swagger. Once the server is running, you can access the interactive documentation at:

\`\`\`
http://localhost:3000/api-docs
\`\`\`

This provides a user-friendly interface to:
- Explore available endpoints
- Understand request/response formats
- Test API calls directly from the browser
- View models and schemas

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username and password
- `POST /api/auth/register` - Register a new user

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Add a new book (Admin only)
- `PUT /api/books/:id` - Update a book (Admin only)
- `DELETE /api/books/:id` - Delete a book (Admin only)

### Borrowing

- `GET /api/borrow` - Get borrowing records (all for admin, personal for users)
- `POST /api/borrow/borrow` - Borrow a book
- `POST /api/borrow/return/:borrowId` - Return a borrowed book

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Obtain a token by logging in or registering
2. Include the token in the Authorization header of your requests:
   \`\`\`
   Authorization: Bearer your_token_here
   \`\`\`

### Default Users

The system comes with two default users for testing:

1. Admin User:
   - Username: `admin`
   - Password: `admin123`

2. Regular User:
   - Username: `user`
   - Password: `user123`

## Data Models

### User

\`\`\`typescript
interface User {
  id: string;
  username: string;
  password: string; // In a real app, this would be hashed
  role: "admin" | "user";
}
\`\`\`

### Book

\`\`\`typescript
interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  availableQuantity: number;
}
\`\`\`

### BorrowRecord

\`\`\`typescript
interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: Date;
  returnDate: Date | null;
  isReturned: boolean;
}
\`\`\`

## Data Storage

Currently, the application uses in-memory data storage for simplicity. In a production environment, you would want to replace this with a proper database.

### Replacing In-Memory Storage

To replace the in-memory storage with a database:

1. Install the appropriate database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Create database models/schemas
3. Update the service files to use the database instead of in-memory arrays
4. Update functions to be async where needed

## Future Improvements

- Add a real database (MongoDB, PostgreSQL, etc.)
- Implement password hashing with bcrypt
- Add input validation with a library like Joi or Zod
- Add comprehensive error handling
- Implement pagination for book and borrow record listings
- Add unit and integration tests
- Add book categories and search functionality
- Implement book reservation system
- Add fine calculation for late returns

## License

MIT
