import { useEffect, useRef, useState } from "react";
import { runCode } from "../api/api";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import { connectWebSocket, disconnectWebSocket,  sendCodeUpdate } from "../services/websocket";
import axios from "axios";

export default function Room() {

    const params = new URLSearchParams(window.location.search);
    const isRemoteUpdate = useRef(false);
    const roomCode = params.get("roomCode");
    const username = params.get("username");
    const language = params.get("language");

    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8080/chat/history/${roomCode}`)
            .then((res) => {
                setMessages(res.data);
            });
        connectWebSocket(roomCode, username, (data) => {
            isRemoteUpdate.current = true;
            setCode(data.code);
        }, (data) => {
            setMessages((prev) => [...prev, data]);
        },
            (users) => {
                setUsers(users);
            }
        );
        return () => {
            disconnectWebSocket();
        };
    }, []);

    const handleCodeChange = (value) => {
        if (value === undefined) return;

        setCode(value);
        if (!isRemoteUpdate.current) {
            sendCodeUpdate(roomCode, value);
        }
        isRemoteUpdate.current = false;
    };


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
                <span className="text-xs text-gray-400 ml-3">
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
                        />
                    </div>
                </div>

                {/* Chat Panel */}
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