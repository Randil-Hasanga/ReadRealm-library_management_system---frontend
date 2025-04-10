import axios from "axios";
import BorrowedBooksService from "./BorrowedBooksService";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/books`;

const BookService = {
  getBooks: async () => {
    try {
      const response = await axios.get(baseUrl, {withCredentials: true});
      return response.data.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  addBook: async (bookData) => {
    try {
      console.log(bookData);
      const response = await axios.post(baseUrl, bookData, {withCredentials:true});
      console.log("Book added:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await axios.patch(`${baseUrl}/${bookId}`, bookData);
      console.log("Book updated:", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const borrowed = await BorrowedBooksService.getBorrowedBookByBookID(bookId);
      console.log(JSON.stringify(borrowed, null, 2));
    
      if (borrowed.length > 0) {
        return "Someone still borrowed the book";
      } else {
        const response = await axios.delete(`${baseUrl}/${bookId}`);
        console.log("Book deleted:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  },
};

export default BookService;
