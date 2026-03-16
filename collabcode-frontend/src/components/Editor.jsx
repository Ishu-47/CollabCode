import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { sendCursorPosition } from "../services/websocket";
import throttle from "lodash.throttle";

function getUserColor(username) {
    const colors = [
        "#6366f1",
        "#22c55e",
        "#f97316",
        "#e11d48",
        "#0ea5e9",
        "#a855f7"
    ];

    let hash = 0;

    for (let i = 0; i < username.length; i++) {
        hash += username.charCodeAt(i);
    }

    return colors[hash % colors.length];
}

export default function Editor({
    code,
    setCode,
    language,
    roomCode,
    username,
    remoteCursors
}) {

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);

    const sendCursor = throttle((line, column) => {
        sendCursorPosition(roomCode, username, line, column);
    }, 80);

    const handleEditorDidMount = (editor, monaco) => {

        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.onDidChangeCursorPosition((event) => {

            const pos = event.position;

            sendCursor(pos.lineNumber, pos.column);

        });
    };

    useEffect(() => {

        if (!editorRef.current || !monacoRef.current) return;

        const editor = editorRef.current;
        const monaco = monacoRef.current;

        const newDecorations = Object.values(remoteCursors).map((cursor) => {

            const color = getUserColor(cursor.username);

            return {
                range: new monaco.Range(
                    cursor.lineNumber,
                    cursor.column,
                    cursor.lineNumber,
                    cursor.column
                ),
                options: {
                    className: "remote-cursor",
                    after: {
                        content: cursor.username,
                        inlineClassName: "remote-cursor-label",
                        inlineStyle: `background:${color};`
                    }
                }
            };
        });

        decorationsRef.current = editor.deltaDecorations(
            decorationsRef.current,
            newDecorations
        );

    }, [remoteCursors]);

    return (
        <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => {
                if (value !== undefined) {
                    setCode(value);
                }
            }}
            onMount={handleEditorDidMount}
        />
    );
}