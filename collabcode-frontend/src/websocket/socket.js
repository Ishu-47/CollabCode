import SockJS from "sockjs-client";
import { Stomp } from "stompjs";

let stompClient = null;

export const connectSocket = (onConnected) => {
    const socket = new SockJS(import.meta.env.VITE_WS_URL);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        onConnected();
    });
};
export const getClient = () => stompClient;