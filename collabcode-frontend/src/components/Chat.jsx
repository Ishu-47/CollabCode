import { useState } from "react";
import { sendChatMessage } from "../services/websocket";

export default function Chat({ username, roomCode, messages }) {

    const [text, setText] = useState("");

    const sendMessage = () => {

        if (!text.trim()) return;

        sendChatMessage(roomCode, username, text);

        setText("");
    };

    return (
        <div className="flex flex-col h-full">

            <div className="flex-1 p-3 overflow-auto">
                {messages.map((m, i) => (
                    <div key={i} className="mb-2">
                        <b>{m.username}</b>: {m.message}
                    </div>
                ))}
            </div>

            <div className="p-2 flex">

                <input
                    className="flex-1 p-2 bg-gray-700 rounded"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 px-3 rounded"
                >
                    Send
                </button>

            </div>

        </div>
    );
}