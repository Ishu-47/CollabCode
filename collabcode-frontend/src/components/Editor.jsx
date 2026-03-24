import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { sendCursorPosition } from "../services/websocket";
import throttle from "lodash.throttle";

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
    const sendCursorRef = useRef(null);

    useEffect(() => {
        sendCursorRef.current = throttle((line, column) => {
            if (!username) return;   // ✅ prevent null

            sendCursorPosition(
                roomCode,
                username,
                line,
                column,
                Date.now()
            );
        }, 200);

        return () => {
            sendCursorRef.current?.cancel();
        };
    }, [roomCode, username]);

    const handleEditorDidMount = (editor, monaco) => {

        editorRef.current = editor;
        monacoRef.current = monaco;

        const cursorDisposable = editor.onDidChangeCursorPosition((event) => {
            const pos = event.position;
            sendCursorRef.current?.(pos.lineNumber, pos.column);
        });

        editor.onDidDispose(() => {
            cursorDisposable.dispose();
        });
    };

    useEffect(() => {

        if (!editorRef.current || !monacoRef.current) return;

        const editor = editorRef.current;
        const monaco = monacoRef.current;

        const newDecorations = Object.values(remoteCursors)
            .filter((c) => c.username !== username)
            .map((c) => ({
                range: new monaco.Range(
                    c.lineNumber,
                    c.column,
                    c.lineNumber,
                    c.column + 1
                ),
                options: {
                    className: "remote-cursor",
                    after: {
                        content: c.username,
                        inlineClassName: "remote-cursor-label"
                    }
                }
            }));

        decorationsRef.current = editor.deltaDecorations(
            decorationsRef.current,
            newDecorations
        );

    }, [remoteCursors, username]);

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