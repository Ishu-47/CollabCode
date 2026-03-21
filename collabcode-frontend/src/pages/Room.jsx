import { useEffect, useState } from "react";
import { runCode, getMyStatus } from "../api/api";
import Editor from "../components/Editor";
import Chat from "../components/Chat";

import useRoomSocket from "../hooks/useRoomSocket";
import useCodeSync from "../hooks/useCodeSync";
import useCursorSync from "../hooks/useCursorSync";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Room() {

    const { roomCode } = useParams();
    const navigate = useNavigate();

    const language = localStorage.getItem("language") || "java";

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [output, setOutput] = useState("");

    // ================= SECURITY CHECK =================
    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await getMyStatus(roomCode);

                if (res.data !== "APPROVED") {
                    navigate("/");
                }
            } catch (err) {
                navigate("/");
            }
        };

        checkAccess();
    }, [roomCode]);

    // ================= CODE SYNC =================
    const { code, handleCodeChange, handleRemoteCode } = useCodeSync(roomCode);

    // ================= CURSOR =================
    const { remoteCursors, handleCursorUpdate } = useCursorSync();

    // ================= SOCKET =================
    useRoomSocket(
        roomCode,
        handleRemoteCode,
        (msg) => setMessages((prev) => [...prev, msg]),
        setUsers,
        handleCursorUpdate
    );

    // ================= CHAT HISTORY =================
    useEffect(() => {
        axios
            .get(`http://localhost:8080/chat/history/${roomCode}`)
            .then((res) => setMessages(res.data));
    }, [roomCode]);

    // ================= RUN CODE =================
    const handleRun = async () => {
        const res = await runCode(code, language);

        setOutput(
            res.data.stdout ||
            res.data.stderr ||
            res.data.compile_output ||
            "No Output"
        );
    };

    return (
        <div className="h-screen bg-gray-950 text-white flex flex-col">

            {/* Top Bar */}
            <div className="flex justify-between items-center px-6 py-3 bg-gray-900 border-b border-gray-700">

                <h2 className="text-lg font-semibold">
                    🚀 Room: {roomCode}
                </h2>

                <span className="text-xs text-gray-400">
                    {language}
                </span>

                <button
                    onClick={handleRun}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
                >
                    ▶ Run Code
                </button>

            </div>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">

                {/* Editor */}
                <div className="flex-1 p-3">
                    <div className="h-full rounded-lg overflow-hidden border border-gray-800">
                        <Editor
                            code={code}
                            setCode={handleCodeChange}
                            language={language}
                            roomCode={roomCode}
                            remoteCursors={remoteCursors}
                        />
                    </div>
                </div>

                {/* Chat */}
                <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
                    <Chat
                        roomCode={roomCode}
                        messages={messages}
                        users={users}
                    />
                </div>

            </div>

            {/* Output */}
            <div className="h-40 bg-black border-t border-gray-800 p-3 overflow-auto">

                <h3 className="text-xs text-gray-400 mb-2">
                    Console Output
                </h3>

                <pre className="text-green-400 text-sm whitespace-pre-wrap">
                    {output}
                </pre>

            </div>

        </div>
    );
}