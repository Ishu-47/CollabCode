import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import api from "../api/api";

let stompClient = null;

export const connectWebSocket = async(
    roomCode,
    onCodeReceived,
    onChatReceived,
    onUsersUpdate,
    onCursorReceived
) => {
    const res = await api.get("/rooms/me");
    const username = res.data;

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
        webSocketFactory: () => socket,
        debug: () => {},
        reconnectDelay: 5000
    });

    client.onConnect = () => {

        console.log("Connected:", username);

        client.subscribe(`/topic/room/${roomCode}`, (message) => {
            const data = JSON.parse(message.body);
            onCodeReceived(data);
        });

        client.subscribe(`/topic/chat/${roomCode}`, (message) => {
            const data = JSON.parse(message.body);
            onChatReceived(data);
        });

        client.subscribe(`/topic/users/${roomCode}`, (message) => {
            const users = JSON.parse(message.body);
            onUsersUpdate(users);
        });

        client.subscribe(`/topic/cursor/${roomCode}`, (message) => {
            const data = JSON.parse(message.body);
            

           ///console.log("📥 RAW CURSOR RECEIVED:", data);

            //Ignore self
            // if (data.username.toLowerCase() === username.toLowerCase()) {
            //     console.log("🚫 Ignored self cursor:", data.username);
            //     return;
            // }

          //  console.log("✅ PROCESSING CURSOR FROM:", data.username);

            onCursorReceived(data);
        });


        client.publish({
            destination: "/app/join",
            body: JSON.stringify({
                roomCode,
                username
            })
        });
    };

    client.activate();

    stompClient = client;
};

export const sendCodeUpdate = (roomCode, code) => {
    if (!stompClient) return;

    stompClient.publish({
        destination: "/app/code",
        body: JSON.stringify({
            roomCode,
            code
        })
    });
};

export const sendChatMessage = (roomCode, username, message) => {
    if (!stompClient) {
       // console.log("❌ STOMP NOT CONNECTED");
        return;
    }
    //console.log("📤 SENDING MESSAGE:", roomCode, username, message);
    stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({
            roomCode,
            username,
            message
        })
    });
};

export const sendCursorPosition = (roomCode, username, lineNumber, column, timestamp) => {
    if (!stompClient) return;

    console.log("📤 SENDING CURSOR:", username, lineNumber, column);

    stompClient.publish({
        destination: "/app/cursor",
        body: JSON.stringify({
            roomCode,
            username,
            lineNumber,
            column,
            timestamp
        })
    });
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};