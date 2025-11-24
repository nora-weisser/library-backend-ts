# Test Plan

## 1. User Registration (POST /api/users/register)

### Test Cases:

1. **Valid Registration:**
   - **Test:** Register a new user with valid details.
   - **Expected Outcome:** Success response with message `User registered successfully.`. Status code: 201.

2. **Email Already Exists:**
   - **Test:** Register with an username that already exists.
   - **Expected Outcome:** Error response with message `Username already exists.`. Status code: 409.

---

## 2. User Login (POST /api/users/login)

### Test Cases:

1. **Valid Login:**
   - **Test:** Login with valid credentials.
   - **Expected Outcome:** Success response with JWT token.

2. **Invalid Email or Password:**
   - **Test:** Login with incorrect email or password.
   - **Expected Outcome:** Error response with message `Invalid email or password.`

3. **Expired JWT Token (in protected routes):**
   - **Test:** Attempt to access a protected route with an expired token.
   - **Expected Outcome:** Error response with `Unauthorized.` message.

---

## 3. Admin Creates a Book (POST /api/admin/books)

### Test Cases:

1. **Valid Book Creation:**
   - **Test:** Admin creates a book with valid data (ISBN, title, author, etc.). 
   - **Expected Outcome:** Success response with message `Book created successfully.`. Status code: 201.

2. **Book Already Exists (ISBN Conflict):**
   - **Test:** Try to create a book with an already existing ISBN.
   - **Expected Outcome:** Error response with message `Failed to add book. ISBN might already exist.`

---

## 4. Admin Updates a Book (PUT /api/admin/books/{bookID})

### Test Cases:

1. **Valid Book Update:**
   - **Test:** Admin updates book information with valid data (ISBN, title, author, etc.).
   - **Expected Outcome:** Success response with message `Book information updated successfully.`

2. **Book Not Found:**
   - **Test:** Admin tries to update a non-existent book.
   - **Expected Outcome:** Error response with message `Book not found.`

---

## 5. Admin Deletes a Book (DELETE /api/admin/books/{bookID})

### Test Cases:

1. **Valid Book Deletion:**
   - **Test:** Admin deletes a book by `bookID`.
   - **Expected Outcome:** Success response with message `Book deleted successfully.`

2. **Book Not Found:**
   - **Test:** Admin tries to delete a non-existent book.
   - **Expected Outcome:** Error response with message `Book not found or unable to delete.`

3. **Book with Borrowed Instances:**
   - **Test:** Admin tries to delete a book that still has borrowed instances.
   - **Expected Outcome:** Error response with message `Cannot delete book. Some copies are currently borrowed.`

---

## 6. User Borrows a Book (POST /api/users/borrow)

### Test Cases:

1. **Valid Book Borrow:**
   - **Test:** User borrows a book that is available.
   - **Expected Outcome:** Success response with details like book title, borrowed by, and deadline.

2. **Book Not Available:**
   - **Test:** User attempts to borrow a book that is already borrowed.
   - **Expected Outcome:** Error response with message `Sorry, the book copy you requested is currently unavailable.`

3. **Invalid Book or Instance ID:**
   - **Test:** User tries to borrow a book with an invalid `bookID` or `bookInstanceID`.
   - **Expected Outcome:** Error response with message `Book not found.`

---

## 7. User Returns a Book (POST /api/users/return)

### Test Cases:

1. **Valid Book Return:**
   - **Test:** User returns a book they have borrowed.
   - **Expected Outcome:** Success response with message `The book has been successfully returned.`

2. **Book Not Borrowed by User:**
   - **Test:** User tries to return a book that was not borrowed by them.
   - **Expected Outcome:** Error response with message `This book was not borrowed by you.`

3. **Overdue Return:**
   - **Test:** User returns a book after the due date.
   - **Expected Outcome:** Success response with message indicating late return and fine.

4. **Invalid Book Instance ID:**
   - **Test:** User tries to return a non-existent book instance.
   - **Expected Outcome:** Error response with message `Book instance not found.`
   - 
---

## 8. List All Books (GET /api/admin/books)

### Test Cases:

1. **Valid Books List Retrieval:**
   - **Test:** Admin retrieves a list of all books in the library.
   - **Expected Outcome:** Success response with a list of books, their availability, and stock.

---

## 9. Get All Book Instances (GET /api/books/{bookID}/instances) - NOT IMPLEMENTED YET

### Test Cases:

1. **Valid Request for Book Instances:**
   - **Test:** User or admin retrieves all instances of a specific book by `bookID`.
   - **Expected Outcome:** Success response with an array of book instances showing availability, borrower, and deadlines.

2. **Invalid BookID:**
   - **Test:** Request for book instances with a non-existent `bookID`.
   - **Expected Outcome:** Error response with message `Book not found.`

---
