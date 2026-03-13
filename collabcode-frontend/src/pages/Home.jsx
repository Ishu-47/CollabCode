import { useState } from "react";
import { createRoom, joinRoom } from "../api/api";

export default function Home() {

    const [username, setUsername] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [language, setLanguage] = useState("java");

    const handleCreateRoom = async () => {
        const res = await createRoom(language);
        const code = res.data.roomCode;

        window.location.href = `/room?roomCode=${code}&username=${username}&language=${language}`;
    };

    const handleJoinRoom = async () => {
        await joinRoom(roomCode, username);

        window.location.href = `/room?roomCode=${roomCode}&username=${username}&language=${language}`;
    };

    return (
        <div className="h-screen bg-gray-950 flex items-center justify-center text-white">
            <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-96">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    CollabCode
                </h1>
                <input
                    className="w-full p-2 mb-3 rounded bg-gray-700"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <select
                    className="w-full p-2 mb-3 rounded bg-gray-700"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                </select>
                <button
                    onClick={handleCreateRoom}
                    className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded mb-4"
                >
                    Create Room
                </button>
                <input
                    className="w-full p-2 mb-3 rounded bg-gray-700"
                    placeholder="Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                />

                <button
                    onClick={handleJoinRoom}
                    className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
                >
                    Join Room
                </button>

            </div>
        </div>
    );
}