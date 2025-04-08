import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/authors`;

const AuthorService = {
  getAuthors: async () => {
    try {
        const response = await axios.get(baseUrl);
        console.log(baseUrl);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
      }
  }
};

export default AuthorService;
