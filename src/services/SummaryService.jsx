import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/summary`;

const SummaryService = {
    getDashboardSummary: async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.get(baseUrl, { withCredentials: true });
            return response.data.data;
        } catch (error) {
            throw new Error("Error fetching dashboard summary: " + error.message);
        }
    }
}

export default SummaryService;