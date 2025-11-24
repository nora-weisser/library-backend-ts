# Test Plan

## 1. TEST-001: Admin User Registration and Login
### Steps:
- **[Admin]** register new user with admin role (`POST /api/auth/register`)
- Verify user creation and extract ID
- **[Admin]** Retrieve the newly created admin user by ID (`GET /api/users/{id}`)
- **[Newly created Admin]** Login (`POST /api/auth/login`) and verify token in response

---

## 2. TEST-002: Book Creation, Update, and Deletion
### Steps:
- **[Admin]** Add book (`POST /api/books`)
- Verify book creation and extract ID
- **[Admin]** Update book (`PUT /api/books/{id}`)
- Verify book update (`GET /api/books/{id}`)
- **[Admin]** Delete book (`DELETE /api/books/{id}`)
- Verify book deletion (`GET /api/books/{id} -> 404`)

---

## 3. TEST-003: Book Borrow and Return
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book
- Verify book is borrowed (`GET /api/borrowed-books`)
- **[User]** Return book
- Verify book is returned
- **[User]** Delete book

---

## 4. TEST-004: Book Unavailability (Multiple Borrow Requests)
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book
- **[User]** Attempts to borrow the same book again
- Verify message: "Sorry, the book copy you requested is currently unavailable."
- **[User]** Return book
- **[Admin]** Deletes book

---

## 5. TEST-005: Prevent Book Deletion While Borrowed
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book
- **[Admin]** Attempts to delete book
- Verify message: "Cannot delete book. It is currently borrowed."
- Verify book deletion was unsuccessful (`GET /api/books/{id} -> 200`)
- **[User]** Return book
- **[Admin]** Delete book
- Verify book deletion is successful (`GET /api/books/{id} -> 404`)

---

## 6. TEST-006: Prevent Book Copy Deletion While Borrowed
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[User]** Borrow book
- **[Admin]** Attempts to delete book copy
- Verify message: "Cannot delete book copy. It is currently borrowed."
- Verify book deletion was unsuccessful
- **[User]** Return book
- **[Admin]** Delete book copy
- Verify book copy deletion is successful

---

## 7. TEST-007: Book Remark Update
### Steps:
- **[Admin]** Create book (`POST /api/books`)
- **[Admin]** Update book remark (`PUT /api/books/{id}/remark`)
- **[User]** Verify if the user sees updated remark
- **[Admin]** Delete book
