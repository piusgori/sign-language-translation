import axios from "axios";
import { SERVER_URL } from "../config";

const axiosInstance = axios.create({ baseURL: SERVER_URL });

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error?.response?.data?.content || error?.response?.data?.message || error?.message) || 'Something went wrong')
);

export default axiosInstance;