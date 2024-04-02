import axios from "axios";
import { HOST_API } from "../config";

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error?.response?.data?.content || error?.response?.data?.message || error?.message) || 'Something went wrong')
);

export default axiosInstance;