import axios from "axios";

const API_URL = "http://localhost:5001/api/auth"; // Change to backend URL if deployed

export const registerUser = async (name, email, password) => {
  return axios.post(`${API_URL}/signup`, { name, email, password });
};

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
