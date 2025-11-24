# Test Plan

## 1. TEST-001: Admin User Registration and Login
### Steps:
- Register new user with admin role (`POST /api/auth/register`)
- Verify user creation and extract ID
- Retrieve the newly created admin user by ID (`GET /api/users/{id}`)
- Login with admin user (`POST /api/auth/login`) and verify token in response

---

## 2. TEST-002: Book Creation, Update, and Deletion
### Steps:
- Add book (`POST /api/books`)
- Verify book creation and extract ID
- Update book (`PUT /api/books/{id}`)
- Verify book update (`GET /api/books/{id}`)
- Delete book (`DELETE /api/books/{id}`)
- Verify book deletion (`GET /api/books/{id} -> 404`)

---

## 3. TEST-003: Book Borrow and Return
### Steps:
- Admin creates book (`POST /api/books`)
- User borrows book
- Verify book is borrowed (`GET /api/borrowed-books`)
- User returns book
- Verify book is returned
- Admin deletes book

---

## 4. TEST-004: Book Unavailability (Multiple Borrow Requests)
### Steps:
- Admin creates book (`POST /api/books`)
- User borrows book
- User attempts to borrow the same book again
- Verify message: "Sorry, the book copy you requested is currently unavailable."
- User returns book
- Admin deletes book

---

## 5. TEST-005: Prevent Book Deletion While Borrowed
### Steps:
- Admin creates book (`POST /api/books`)
- User borrows book
- Admin attempts to delete book
- Verify message: "Cannot delete book. It is currently borrowed."
- User returns book
- Admin deletes book

---

## 6. TEST-006: Prevent Book Copy Deletion While Borrowed
### Steps:
- Admin creates book (`POST /api/books`)
- User borrows book
- Admin attempts to delete book copy
- Verify message: "Cannot delete book copy. It is currently borrowed."
- User returns book
- Admin deletes book copy

---

## 7. TEST-007: Book Remark Update
### Steps:
- Admin creates book (`POST /api/books`)
- Admin updates book remark (`PUT /api/books/{id}/remark`)
- Verify book remark update
- Admin deletes book
