import { useEffect } from "react";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket";

export default function useRoomSocket(
    roomCode,
    onCodeReceived,
    onChatReceived,
    onUsersUpdate,
    onCursorReceived
) {

    useEffect(() => {

        connectWebSocket(
            roomCode,
            onCodeReceived,
            onChatReceived,
            onUsersUpdate,
            onCursorReceived
        );

        return () => {
            disconnectWebSocket();
        };

    }, [roomCode]);
}