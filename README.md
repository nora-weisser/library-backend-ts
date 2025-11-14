# Library Management System Backend

A backend library management system built with Express.js and TypeScript. This system provides APIs for managing books, book copies, user authentication, and borrowing operations.

## Features

- **User Authentication**: JWT-based authentication with role-based access control (Admin/User)
- **Book Management**: CRUD operations for books and book copies
- **Borrowing System**: Track book borrowing and returns with deadlines
- **Book Copy Management**: Delete book copies and update remarks (Admin only)
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **In-Memory Storage**: Simple data storage (ready to be replaced with a database)

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger UI with swagger-jsdoc
- **Testing**: Jest with ts-jest

## Prerequisites

- Node.js (v16 or higher)
- npm or pnpm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nora-weisser/library-backend-ts
cd library-backend-ts
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` with hot-reloading enabled.

### Production Mode
```bash
npm run build
npm start
```

## API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

## Database Schema

### Users Table
| Field      | Type   | Description                           |
|------------|--------|---------------------------------------|
| userID     | string | Primary key, unique ID for each user  |
| username   | string | The username of the user              |
| password   | string | The password (should be hashed)       |
| role       | string | Role of the user (admin/user)         |

### Books Table
| Field       | Type   | Description                           |
|-------------|--------|---------------------------------------|
| bookID      | string | Primary key, unique ID for each book  |
| ISBN        | string | ISBN number of the book               |
| title       | string | Title of the book                     |
| author      | string | Author of the book                    |
| description | string | Description of the book               |
| totalQuantity | number | Total number of copies available |

### BookCopy Table
| Field            | Type    | Description                                      |
|------------------|---------|--------------------------------------------------|
| bookCopyID       | string  | Primary key, unique ID for each book copy        |
| bookID           | string  | Foreign key to the Books Table                   |
| isAvailable      | boolean | Whether the book copy is available               |
| borrowedBy       | string  | Foreign key, userID of borrower (or NULL)        |
| borrowedAt       | Date    | Date when the book was borrowed (or NULL)        |
| deadline         | Date    | Due date for return (or NULL)                    |
| remark           | string  | Additional notes about the copy (or NULL)        |

## API Endpoints

### Authentication

#### Register a New User
```http
POST /api/auth/register
```

#### Login
```http
POST /api/auth/login
```


### Books

#### Get All Books
```http
GET /api/books
```

#### Get Book by ID
```http
GET /api/books/:id
```

#### Create a Book (Admin only)
```http
POST /api/books
```

#### Update a Book (Admin only)
```http
PUT /api/books/:id
```

#### Delete a Book (Admin only)
```http
DELETE /api/books/:id
```

**Note**: A book can only be deleted if none of its copies are currently borrowed.

### Book Copies

#### Delete a Book Copy (Admin only)
```http
DELETE /api/books/copies/:copyId
```

**Note**: A book copy can only be deleted if it is not currently borrowed.

#### Update Book Copy Remark (Admin only)
```http
PUT /api/books/copies/:copyId/remark
```

### Borrowing

#### Borrow a Book
```http
POST /api/borrow/borrow
```

#### Return a Book
```http
POST /api/borrow/return
```

#### Get Borrow Records
```http
GET /api/borrow
```

### Users (Admin only)

#### Get All Users
```http
GET /api/users
```

#### Get User by ID
```http
GET /api/users/:id
```

#### Get User Dashboard
```http
GET /api/users/dashboard
```

#### Delete User (Admin only)
```http
DELETE /api/users/:id
```

## System Flow

### 1. Admin Adds a Book
When an admin adds a book, the system:
1. Creates an entry in the Books table
2. Creates multiple BookCopy entries based on `totalQuantity`
3. All copies are initially marked as available

### 2. User Borrows a Book
When a user borrows a book:
1. System finds an available BookCopy for the requested book
2. Updates `isAvailable` to `false`
3. Sets `borrowedBy` to the user's ID
4. Sets `borrowedAt` to current date
5. Sets `deadline` to 30 days from now

### 3. User Returns a Book
When a user returns a book:
1. System verifies the user borrowed this copy
2. Updates `isAvailable` to `true`
3. Clears `borrowedBy`, `borrowedAt`, and `deadline`

### 4. Admin Manages Book Copies
Admins can:
- Delete individual book copies (only if not borrowed)
- Update remarks on book copies (e.g., note damage)
- Delete entire books (only if no copies are borrowed)

### 5. View Dashboard
When a user views their dashboard:
1. System retrieves all borrowed books for the user
2. Returns user info and currently borrowed books

## Future Enhancements

- [ ] Add password hashing (bcrypt)
- [ ] Implement database integration (PostgreSQL/MongoDB)
- [ ] Add fine calculation for overdue books
- [ ] Implement fine payment system
- [ ] Implement book reservation system
- [ ] Add email notifications for due dates
- [ ] Implement pagination for list endpoints
- [ ] Add search and filtering capabilities
- [ ] Add book categories/genres
- [ ] Implement user profiles with borrowing history
- [ ] Add book reviews and ratings
- [ ] Implement admin dashboard endpoints
- [ ] Add support for book images
- [ ] Implement audit logging

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue in the GitHub repository.
