import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/authors`;
let cachedAuthors = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000;

const AuthorService = {
  getAuthors: async (forceRefresh = false) => {
    const now = new Date().getTime();

    if (!forceRefresh && cachedAuthors && (now - lastFetched < CACHE_DURATION)) {
      return cachedAuthors;
    }
    try {
      const response = await axios.get(baseUrl, { withCredentials: true });
      console.log(baseUrl);
      cachedAuthors = response.data.data;
      lastFetched = now;
      return cachedAuthors;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },
  addAuthor: async (authorData) => {
    try {
      const response = await axios.post(baseUrl, authorData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error adding author:", error);
      throw error;
    }
  },

  updateAuthor: async (authorId, authorData) => {
    try {
      const response = await axios.patch(`${baseUrl}/${authorId}`, authorData, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error("Error updating author:", error);
      throw error;
    }
  },

  deleteAuthor: async (authorId) => {
    try {
      // const response = await axios.delete(`${baseUrl}/${authorId}`, { withCredentials: true });
      // return response.data;
      console.log("API missing")
    } catch (error) {
      console.error("Error deleting author:", error);
      throw error;
    }
  },
};

export default AuthorService;
