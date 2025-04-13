import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/borrowers`;
let cachedBorrowers = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000;

const BorrowerService = {
  getBorrowers: async (forceRefresh = false) => {
    const now = new Date().getTime();

    if (!forceRefresh && cachedBorrowers && (now - lastFetched < CACHE_DURATION)) {
      return cachedBorrowers;
    }
    try {
      const response = await axios.get(baseUrl, { withCredentials: true });
      cachedBorrowers = response.data.data;
      lastFetched = now;
      return cachedBorrowers;
    } catch (error) {
      console.error("Error fetching borrowers:", error);
      throw error;
    }
  },
  updateBorrower: async (borrower_id, borrower_data) => {
    try {
      const response = await axios.patch(`${baseUrl}/${borrower_id}`, borrower_data, { withCredentials: true });
      console.log('Inside update borower');
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  },
  deleteBorrower: async (borrower_id) => {
    try {
      const response = await axios.delete(`${baseUrl}/${borrower_id}/setActive/false`, { withCredentials: true });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error deleting borrower:", error);
    }
  },

}

export default BorrowerService;