import { useState, useRef } from "react";
import { sendCodeUpdate } from "../services/websocket";

export default function useCodeSync(roomCode) {

    const [code, setCode] = useState("");
    const isRemoteUpdate = useRef(false);

    const handleCodeChange = (value) => {

        if (value === undefined) return;

        setCode(value);

        if (!isRemoteUpdate.current) {
            sendCodeUpdate(roomCode, value);
        }

        isRemoteUpdate.current = false;
    };

    const handleRemoteCode = (data) => {
        isRemoteUpdate.current = true;
        setCode(data.code);
    };

    return {
        code,
        handleCodeChange,
        handleRemoteCode
    };
}