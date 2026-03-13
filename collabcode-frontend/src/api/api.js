import axios from "axios";

export const createRoom = (language) =>
  axios.post(`http://localhost:8080/rooms/create?language=${language}`);

export const joinRoom = (roomCode, username) =>
  axios.post(
    `http://localhost:8080/rooms/join?roomCode=${roomCode}&username=${username}`
  );

export const runCode = (code, language) =>
  axios.post(`http://localhost:8080/execute`, { code, language });