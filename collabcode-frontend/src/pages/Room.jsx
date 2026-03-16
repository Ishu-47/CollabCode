import { useEffect, useState } from "react";
import { runCode } from "../api/api";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import axios from "axios";

import useRoomSocket from "../hooks/useRoomSocket";
import useCodeSync from "../hooks/useCodeSync";
import useCursorSync from "../hooks/useCursorSync";
import { useSearchParams } from "react-router-dom";

export default function Room() {

    const[searchParams, setSearchParams] = useSearchParams();

    const roomCode = searchParams.get("roomCode");
    const username = searchParams.get("username");
    const language = searchParams.get("language");

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [output, setOutput] = useState("");

    // code sync hook
    const { code, handleCodeChange, handleRemoteCode } = useCodeSync(roomCode);

    // cursor hook
    const { remoteCursors, handleCursorUpdate } = useCursorSync();

    // websocket connection
    useRoomSocket(
        roomCode,
        username,
        handleRemoteCode,
        (msg) => setMessages((prev) => [...prev, msg]),
        setUsers,
        handleCursorUpdate
    );

    // load chat history
    useEffect(() => {
        axios
            .get(`http://localhost:8080/chat/history/${roomCode}`)
            .then((res) => setMessages(res.data));
    }, []);

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

                <h2 className="text-lg font-semibold tracking-wide">
                    🚀 Room: {roomCode}
                </h2>

                <span className="text-xs font-semibold text-gray-400 ml-3">
                    {language}
                </span>

                <button
                    onClick={handleRun}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition"
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
                            username={username}
                            remoteCursors={remoteCursors}
                        />

                    </div>
                </div>

                {/* Chat */}
                <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">

                    <Chat
                        username={username}
                        roomCode={roomCode}
                        messages={messages}
                        users={users}
                    />

                </div>

            </div>

            {/* Output Console */}
            <div className="h-40 bg-black border-t border-gray-800 p-3 overflow-auto">

                <h3 className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                    Console Output
                </h3>

                <pre className="text-green-400 text-sm whitespace-pre-wrap">
                    {output}
                </pre>

            </div>

        </div>
    );
}