import axios from "axios";
import FineService from "./FineService";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/borrowed-books`;
let cachedBorrowedBooks = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000;

const BorrowedBooksService = {
  getBorrowedBooks: async (forceRefresh = false) => {
    const now = new Date().getTime();

    if (!forceRefresh && cachedBorrowedBooks && (now - lastFetched < CACHE_DURATION)) {
      return cachedBorrowedBooks;
    }
    try {
      const response = await axios.get(baseUrl, { withCredentials: true });
      cachedBorrowedBooks = response.data.data;
      console.log(baseUrl)
      lastFetched = now;
      return cachedBorrowedBooks;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },
  getOverdueBooks: async () => {
    try {
      const response = await axios.get(`${baseUrl}/over-due`, { withCredentials: true });
      // console.log(`${baseUrl}/over-due`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },
  getBorrowedBookByBookID: async (bookID) => {
    try {
      const response = await axios.get(`${baseUrl}/books/${bookID}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching book with ID ${bookID}:`, error);
      throw error;
    }
  },
  returnBorrowedBook: async (bb_id) => {
    try {
      const response = await axios.patch(`${baseUrl}/return/${bb_id}`);
      console.log("Response Data:", response.data);  // Log full response

      // Check if the response contains the expected data
      if (response.data.error) {
        return response.data.error; // Return the error message from the backend
      }

      return response.data.data; // Return the success data
    } catch (error) {
      console.error("Error returning book:", error);
      throw error; // Rethrow or handle as needed
    }
  }


}

export default BorrowedBooksService;