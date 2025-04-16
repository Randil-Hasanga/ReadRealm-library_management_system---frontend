import axios from "axios";
import BorrowedBooksService from "./BorrowedBooksService";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/books`;
let cachedBooks = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000;

const BookService = {
  getBooks: async (forceRefresh = false) => {
    const now = new Date().getTime();

    if (!forceRefresh && cachedBooks && (now - lastFetched < CACHE_DURATION)) {
      return cachedBooks;
    }
    try {
      const response = await axios.get(baseUrl, { withCredentials: true });
      cachedBooks = response.data.data;
      lastFetched = now;
      return cachedBooks;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  getBookCountByAuthor: async (author_id) => {
    try {
      const count = await axios.get(`${baseUrl}/count/${author_id}`)
      return count.data.BookCount;
    } catch (error) {
      console.error("Error fetching book count:", error);
      throw error;
    }
  },

  addBook: async (bookData) => {
    try {
      const response = await axios.post(baseUrl, bookData, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await axios.patch(`${baseUrl}/${bookId}`, bookData, { withCredentials: true });
      return response.data.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const borrowed = await BorrowedBooksService.getBorrowedBookByBookID(bookId);

      if (borrowed.length > 0) {
        return "Someone still borrowed the book";
      } else {
        const response = await axios.delete(`${baseUrl}/${bookId}`);
        return response.data;
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  },
};

export default BookService;
