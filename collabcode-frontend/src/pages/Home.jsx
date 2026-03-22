import { useState, useEffect } from "react";
import { requestToJoin, createRoom } from "../api/api";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [roomCode, setRoomCode] = useState("");
    const [language, setLanguage] = useState("java");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ✅ Fetch logged-in user
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/rooms/me");
                setUsername(res.data.username);

                // optional: store
                localStorage.setItem("username", res.data.username);
            } catch (err) {
                console.error("Failed to fetch user", err);
            }
        };

        fetchUser();
    }, []);

    const handleJoin = async () => {
        try {
            setLoading(true);

            await requestToJoin(roomCode);

            // store language (important for editor later)
            localStorage.setItem("language", language);

            navigate(`/waiting/${roomCode}`);
        } catch (err) {
            alert(err.response?.data || "Error joining room");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            setLoading(true);

            const res = await createRoom(language);
            const code = res.data.roomCode;

            // store language
            localStorage.setItem("language", language);

            navigate(`/room/${code}`);
        } catch (err) {
            console.error(err);
            alert("Error creating room");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-white">

            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">

                <h1 className="text-3xl font-bold text-center mb-6">
                    CollabCode 🚀
                </h1>

                {/* Show username (fetched) */}
                <div className="text-center text-gray-400 mb-4">
                    Logged in as: <span className="text-white font-semibold">{username}</span>
                </div>

                {/* Room Code */}
                <input
                    type="text"
                    placeholder="Enter Room Code"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 outline-none mb-4"
                />

                {/* Language */}
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 outline-none mb-4"
                >
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                </select>

                <button
                    onClick={handleJoin}
                    className="w-full bg-blue-500 hover:bg-blue-600 transition p-3 rounded-lg mb-3"
                >
                    {loading ? "Joining..." : "Request to Join"}
                </button>

                <div className="text-center text-gray-400 mb-2">OR</div>

                <button
                    onClick={handleCreate}
                    className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-lg"
                >
                    {loading ? "Creating..." : "Create Room"}
                </button>

            </div>
        </div>
    );
}