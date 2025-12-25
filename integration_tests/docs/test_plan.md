# Test Plan

## 1. TEST-001: Admin User Registration and Login
### Steps:
- **[Admin]** register new user with admin role (`POST /api/auth/register`)
- **[Admin]** Get all users (`GET /api/users`) and extract ID
- **[Admin]** Retrieve the newly created admin user by ID (`GET /api/users/{id}`)
- **[Newly created Admin]** Login (`POST /api/auth/login`) and verify token in response

---

## 2. TEST-002: Book Creation, Update, and Deletion
### Steps:
- **[Admin]** Add book (`POST /api/books`)
- **[Admin]** Get all books (`GET /api/books`) and extract ID
- **[Admin]** Update book (`PUT /api/books/{id}`)
- **[Admin]** Verify book update (`GET /api/books/{id}`)
- **[Admin]** Delete book (`DELETE /api/books/{id}`)
- **[Admin]** Verify book deletion (`GET /api/books/{id} -> 404`)

---

## 3. TEST-003: Book Borrow and Return
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book `POST api/borrow/borrow` 
- **[Admin]** Verify book is borrowed (`GET /api/borrowed-books`)
- **[User]** Return book `POST api/borrow/return`
- **[Admin]** Verify book is returned (`GET /api/borrowed-books`)
- **[User]** Delete book `DELETE api/books/{id}`
- **[Admin]** Verify book deletion (`GET /api/books/{id} -> 404`)

---

## 4. TEST-004: Book Unavailability (Multiple Borrow Requests)
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book `POST api/borrow/borrow` 
- **[User]** Attempts to borrow the same book again `POST api/borrow/borrow`. Verify message: "Sorry, the book copy you requested is currently unavailable."
- **[User]** Return book `POST api/borrow/return`
- **[Admin]** Deletes book `DELETE api/books/{id}`
- **[Admin]** Verify book deletion (`GET /api/books/{id} -> 404`)
---

## 5. TEST-005: Prevent Book Deletion While Borrowed
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book `POST api/borrow/borrow` 
- **[Admin]** Attempts to delete book. Verify message: "Cannot delete book. It is currently borrowed."
- **[Admin]** Verify book deletion was unsuccessful (`GET /api/books/{id} -> 200`)
- **[User]** Return book `POST api/borrow/return`
- **[Admin]** Delete book `DELETE api/books/{id}`
- **[Admin]** Verify book deletion is successful (`GET /api/books/{id} -> 404`)

---

## 6. TEST-006: Prevent Book Copy Deletion While Borrowed
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book `POST api/borrow/borrow` 
- **[Admin]** Attempts to delete book copy. Verify message: "Cannot delete book copy. It is currently borrowed."
- **[Admin]** Verify book deletion was unsuccessful (`GET /api/books/{id} -> 200`)
- **[User]** Return book `POST api/borrow/return`
- **[Admin]** Delete book copy `DELETE api/books/copies/{copyId}`
- **[Admin]** Verify book copy deletion is successful `GET api/books/copies/{copyId} -> 404`

---

## 7. TEST-007: Book Remark Update
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[Admin]** Update book remark (`PUT /api/books/{id}/remark`)
- **[User]** Verify if the user sees updated remark (`GET /api/books/{id}`)
- **[Admin]** Delete book `DELETE api/books/{id}`
- **[Admin]** Verify book deletion is successful (`GET /api/books/{id} -> 404`)
