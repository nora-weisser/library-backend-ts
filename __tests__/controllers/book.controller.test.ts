import request from 'supertest';
import express from 'express';
import { getBooks } from '../../src/controllers/book.controller';
import { getAllBooks } from '../../src/services/book.service';

jest.mock('../../src/services/book.service'); 

const app = express();
app.get('/books', getBooks);

describe('GET /books', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of books when books are available', async () => {
    const mockBooks = [
      { id: 1, title: 'Book 1', author: 'Author 1' },
      { id: 2, title: 'Book 2', author: 'Author 2' },
    ];

    (getAllBooks as jest.Mock).mockReturnValue(mockBooks);

    const response = await request(app).get('/books');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockBooks);
    expect(getAllBooks).toHaveBeenCalledTimes(1); 
  });

  it('should return an empty list when no books are available', async () => {
    (getAllBooks as jest.Mock).mockReturnValue([]);

    const response = await request(app).get('/books');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); 
    expect(getAllBooks).toHaveBeenCalledTimes(1);
  });

  it('should handle errors gracefully', async () => {
    (getAllBooks as jest.Mock).mockImplementation(() => { throw new Error('Database error'); });

    const response = await request(app).get('/books');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Internal server error');
    expect(getAllBooks).toHaveBeenCalledTimes(1);
  });
});
