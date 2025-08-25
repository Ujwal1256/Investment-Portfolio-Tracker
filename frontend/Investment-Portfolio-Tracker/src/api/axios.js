import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://investment-portfolio-backend-4rr0.onrender.com/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
