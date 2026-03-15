import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
 export const connectWebSocket = (roomCode, onCodeReceived, onChatReceived) => {

    const socket = new SockJS("http://localhost:8080/ws");

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,

        onConnect: () => {

            console.log("Connected to WebSocket");

            stompClient.subscribe(`/topic/room/${roomCode}`, (message) => {
                const data = JSON.parse(message.body);
                onCodeReceived(data);
            });

            stompClient.subscribe(`/topic/chat/${roomCode}`, (message) => {
                const data = JSON.parse(message.body);
                onChatReceived(data);
            });

        }
    });

    stompClient.activate();
};
 export const sendCodeUpdate = (roomCode, code) => {
    if(!stompClient){
        return;
    }
    stompClient.publish({
        destination: "/app/code",
        body: JSON.stringify({
            roomCode: roomCode,
            code: code,
        }),
    });
 };

 export const disconnectWebSocket = () => {
    if(stompClient) {
        stompClient.deactivate();
    }
 };

 

 export const sendChatMessage = (roomCode, username, message) => {
    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({
            roomCode,
            username,
            message
        }),
    });
 };
 