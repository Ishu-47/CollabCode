import { useState } from "react";
import { sendChatMessage } from "../services/websocket";

export default function Chat({ username, roomCode, messages, users }) {

    const [text, setText] = useState("");
    const sendMessage = () => {
        if (!text.trim()) return;

        sendChatMessage(roomCode, username, text);
        setText("");
    };

    return (
        <div className="flex flex-col h-full">

            {/* USERS ONLINE */}
            <div className="p-3 border-b border-gray-800">

                <div className="text-xs text-gray-400 mb-2 uppercase">
                    Users Online
                </div>

                <div className="space-y-1 text-sm">

                    {users.map((u, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-green-400">●</span>
                            {u}
                        </div>
                    ))}

                </div>

            </div>

            {/* CHAT HEADER */}
            <div className="p-3 border-b border-gray-800 text-sm font-semibold">
                💬 Chat
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 p-3 overflow-auto space-y-2">

                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={`p-2 rounded-md text-sm max-w-[85%]
                        ${m.username === username
                                ? "bg-blue-600 ml-auto"
                                : "bg-gray-700"
                            }`}
                    >
                        <div className="text-xs opacity-70">
                            {m.username}
                        </div>

                        <div>{m.message}</div>

                    </div>
                ))}

            </div>

            {/* MESSAGE INPUT */}
            <div className="p-2 border-t border-gray-800 flex gap-2">

                <input
                    className="flex-1 bg-gray-800 p-2 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    value={text}
                    placeholder="Type a message..."
                    onChange={(e) => setText(e.target.value)}
                />

                <button
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 px-3 rounded-md text-sm"
                >
                    Send
                </button>

            </div>

        </div>
    );
}