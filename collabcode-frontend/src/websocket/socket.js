import SockJS from "sockjs-client";
import { Stomp } from "stompjs";

let stompClient = null;

export const connectSocket = (onConnected) => {
    const socket = new SockJS("wss://codeorbit-o6cd.onrender.com/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        onConnected();
    });
};
export const getClient = () => stompClient;