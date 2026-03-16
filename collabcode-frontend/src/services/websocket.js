import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
export const connectWebSocket = (roomCode, username, onCodeReceived, onChatReceived, onUsersUpdate, onCursorReceived) => {

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

            stompClient.subscribe(`/topic/users/${roomCode}`, (message) => {
                const users = JSON.parse(message.body);
                onUsersUpdate(users);
            });
            stompClient.publish({
                destination: "/app/join",
                body: JSON.stringify({
                    roomCode: roomCode,
                    username: username
                }),
            });
            stompClient.subscribe(`/topic/cursor/${roomCode}`, (message) => {
                const data = JSON.parse(message.body);

                if (data.username === username) return;

                onCursorReceived(data);
            });
        }
    });

    stompClient.activate();
};
export const sendCodeUpdate = (roomCode, code) => {
    if (!stompClient) {
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
    if (stompClient) {
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
export const sendCursorPosition = (roomCode, username, lineNumber, column) => {

    if (!stompClient) return;

    stompClient.publish({
        destination: "/app/cursor",
        body: JSON.stringify({
            roomCode,
            username,
            lineNumber,
            column
        }),
    });
};

