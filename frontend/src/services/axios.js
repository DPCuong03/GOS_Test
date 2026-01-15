import axios from "axios";

const axiosInstance = axios.create({
  // Thử dùng trực tiếp URL để loại trừ lỗi do import.meta.mode
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosInstance;
