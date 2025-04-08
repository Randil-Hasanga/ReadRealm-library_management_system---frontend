import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/fines`;

const FineService = {
  getFines: async () => {
    try {
      const response = await axios.get(baseUrl);
      console.log(baseUrl);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching fines:", error);
      throw error;
    }
  },
  getFineByBbId: async (bb_id) => {
    try {
      const response = await axios.get(`${baseUrl}/bb/${bb_id}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching fine with bb_ID ${bb_id}:`, error);
      throw error;
    }
  },
  payFine: async(fineId) => {
    try {
      const response = await axios.patch(`${baseUrl}/${fineId}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error fetching fine with bb_ID ${fineId}:`, error);
      throw error;
    }
  }
};

export default FineService;