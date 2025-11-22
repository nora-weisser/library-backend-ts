import { getAllBooks } from '../../src/services/book.service'; 


describe('Book Service - getAllBooks', () => {

    it('should return the list of books', () => {
        const books = getAllBooks();

        expect(books).toBeDefined();
        expect(Array.isArray(books)).toBe(true);

        expect(books.length).toBe(2);

        expect(books[0]).toHaveProperty('bookID');
        expect(books[0]).toHaveProperty('title');
        expect(books[0]).toHaveProperty('author');
        expect(books[0].bookID).toBe('1');
        expect(books[0].title).toBe('The Great Gatsby');
        expect(books[0].author).toBe('F. Scott Fitzgerald');
    });

    it('should return books in the correct format', () => {
        const books = getAllBooks();

        books.forEach(book => {
            expect(book).toHaveProperty('bookID');
            expect(book).toHaveProperty('title');
            expect(book).toHaveProperty('author');
            expect(book).toHaveProperty('isbn');
            expect(book).toHaveProperty('description');
        });
    });
});
