import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createRoom = (language) =>
  api.post(`http://localhost:8080/rooms/create?language=${language}`);

export const requestToJoin = (roomCode) =>
  api.post(
    `http://localhost:8080/rooms/join/${roomCode}`
  );

export const getPendingUsers = (roomCode) =>
  api.post(
    `http://localhost:8080/rooms/pending/${roomCode}`
  );
export const approveUser = (memberId) =>
  api.post(
    `http://localhost:8080/rooms/approve/${memberId}`
  );
export const rejectUser = (memberId) =>
  api.post(
    `http://localhost:8080/rooms/reject/${memberId}`
  );
export const getMyStatus = (roomCode) =>
  api.get(`http://localhost:8080/rooms/my-status/${roomCode}`);

export const runCode = (code, language) =>
  api.post(`http://localhost:8080/execute`, { code, language });

export const registerUser = (data) => 
  api.post(`http://localhost:8080/auth/register`, data);

export const loginUser = (data) =>
  api.post(`http://localhost:8080/auth/login`, data);

export default api;