import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!config.url.includes("/auth") && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const createRoom = (language) =>
  api.post(`/rooms/create?language=${language}`);

export const requestToJoin = (roomCode) =>
  api.post(`/rooms/join/${roomCode}`);

export const getPendingUsers = (roomCode) =>
  api.get(`/rooms/pending/${roomCode}`);

export const approveUser = (memberId) =>
  api.post(`/rooms/approve/${memberId}`);

export const rejectUser = (memberId) =>
  api.post(`/rooms/reject/${memberId}`);

export const getMyStatus = (roomCode) =>
  api.get(`/rooms/my-status/${roomCode}`);

export const runCode = (code, language) =>
  api.post(`/execute`, { code, language });

export const registerUser = (data) =>
  api.post(`/auth/register`, data);

export const loginUser = (data) =>
  api.post(`/auth/login`, data);

export default api;