import { useAuthStore } from "@/store/AuthStore";
import axios from "axios";

export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8080';

// Axios instances
export const Axios = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: Attach token to every request ──
// Axios.interceptors.request.use(
//   (config) => {
//     const authData = useAuthStore.getState().authData;

//     if (authData?.token) {
//       config.headers.Authorization = `Bearer ${authData.token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ── Response Interceptor: Handle 401 (token expired) ──
// Axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useAuthStore.getState().logout(); // clear auth data
//       window.location.href = "/login";  // redirect to login
//     }

//     return Promise.reject(error);
//   }
// );