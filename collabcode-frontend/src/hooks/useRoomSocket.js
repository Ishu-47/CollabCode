import { useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket";

export default function useRoomSocket(
    roomCode,
    username,
    onCodeReceived,
    onChatReceived,
    onUsersUpdate,
    onCursorReceived
) {

    useEffect(() => {

        connectWebSocket(
            roomCode,
            username,
            onCodeReceived,
            onChatReceived,
            onUsersUpdate,
            onCursorReceived
        );

        return () => {
            disconnectWebSocket();
        };

    }, []);
}