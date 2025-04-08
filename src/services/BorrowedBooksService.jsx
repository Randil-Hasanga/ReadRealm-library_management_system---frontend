import axios from "axios";
import FineService from "./FineService";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/borrowed-books`;

const BorrowedBooksService = {
  getBorrowedBooks: async () => {
    try {
      const response = await axios.get(baseUrl);
      console.log(baseUrl);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },
  getOverdueBooks: async () => {
    try {
      const response = await axios.get(`${baseUrl}/over-due`);
      console.log(baseUrl);
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