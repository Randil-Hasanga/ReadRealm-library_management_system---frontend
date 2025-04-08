import axios from "axios";

const baseUrl = `${import.meta.env.VITE_BASE_URL}/auth`;

const AuthService = {
    login: async (credencials) => {
        try {
            axios.defaults.withCredentials = true;
            const response = await axios.post(`${baseUrl}/login`, credencials);
            return response.status;
        } catch (error) {
            
        }
    }
}

export default AuthService;