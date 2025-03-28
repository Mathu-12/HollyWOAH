import axios from "axios";

//const API_URL = "http://10.0.2.2:5001/api/auth";
//const API_URL = "http://localhost:5001/api/auth"; 
const API_URL = "https://0505-2401-4900-4dea-3798-d96a-e953-99ad-ca87.ngrok-free.app/api/auth";



export const registerUser = async (name, email, password) => {
  return axios.post(`${API_URL}/signup`, { name, email, password });
};

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
