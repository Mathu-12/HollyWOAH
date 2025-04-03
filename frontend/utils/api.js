import axios from "axios";

//const API_URL = "http://10.0.2.2:5001/api/auth";
const API_URL = "backend url"; 
//const API_URL = "https://d272-2409-40f4-1112-df29-6dfc-345a-8da0-7be7.ngrok-free/api/auth";



export const registerUser = async (name, email, password) => {
  return axios.post(`${API_URL}/signup`, { name, email, password });
};

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password });
};
