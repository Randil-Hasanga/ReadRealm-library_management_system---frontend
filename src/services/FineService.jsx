import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/fines`;
let cachedFines = null;
let lastFetched = null;
const CACHE_DURATION = 5 * 60 * 1000;

const FineService = {
  getFines: async (forceRefresh = false) => {
    const now = new Date().getTime();

    if (!forceRefresh && cachedFines && (now - lastFetched < CACHE_DURATION)) {
      return cachedFines;
    }
    try {
      const response = await axios.get(baseUrl,  { withCredentials: true });
      console.log(baseUrl)
      cachedFines = response.data.data;
      lastFetched = now;
      return cachedFines;
    } catch (error) {
      console.error("Error fetching fines:", error);
      throw error;
    }
  },
  getFineByBbId: async (bb_id) => {
    try {
      const response = await axios.get(`${baseUrl}/bb/${bb_id}`,  { withCredentials: true });
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching fine with bb_ID ${bb_id}:`, error);
      throw error;
    }
  },
  payFine: async (fineId) => {
    try {
      const response = await axios.patch(`${baseUrl}/${fineId}`,  { withCredentials: true });
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching fine with bb_ID ${fineId}:`, error);
      throw error;
    }
  }
};

export default FineService;