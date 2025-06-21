// src/services/authService.js
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const signup = (userData) => {
  return axios.post(`${API}/auth/register`, userData);
};

export const login = (credentials) => {
  return axios.post(`${API}/auth/login`, credentials);
};
