import { useEffect, useRef, useState } from "react";
import { runCode } from "../api/api";
import Editor from "../components/Editor";
import Chat from "../components/Chat";
import { connectWebSocket, disconnectWebSocket, sendCodeUpdate, subscribeChat } from "../services/websocket";


export default function Room() {

    const params = new URLSearchParams(window.location.search);
    const isRemoteUpdate = useRef(false);
    const roomCode = params.get("roomCode");
    const username = params.get("username");
    const language = params.get("language");

    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [messages, setMessages] = useState([])

    useEffect(() => {
        connectWebSocket(roomCode, (data) => {
            isRemoteUpdate.current = true;
            setCode(data.code);
        });
        subscribeChat(roomCode, (data) => {
            setMessages((prev) => [...prev, data]);
        });
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
            <div className="flex justify-between items-center p-4 bg-gray-800">
                <h2 className="text-lg font-semibold">
                    Room: {roomCode}
                </h2>
            </div>

            <button onClick={handleRun} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                Run Code
            </button>
            <div className="flex flex-1">
                <div className="flex-1 p-2" >
                    <Editor code={code} setCode={handleCodeChange} language={language} />
                </div>
                <div className="w-80 bg-gray-800 border-l border-gray-700">
                    <Chat
                        username={username}
                        roomCode={roomCode}
                        messages={messages}
                        setMessages={setMessages}
                    />
                </div>
            </div>
            <div className="h-40 bg-black p-3 overflow-auto">
                <h3 className="text-sm text-gray-400 mb-2">
                    Output
                </h3>
                <pre className="text-green-400 text-sm">
                    {output}
                </pre>
            </div>
        </div>
    );
}