import MonacoEditor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { sendCursorPosition } from "../services/websocket";

export default function Editor({ code, setCode, language, roomCode, username, remoteCursors }) {

    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const decorationsRef = useRef([]);


    useEffect(() => {
        if(!editorRef.current || !monacoRef.current){
            return;
        }
        const editor = editorRef.current;
        const monaco = monacoRef.current;

        const newDecorations = Object.values(remoteCursors).map((cursor) => {
             return {
                    range: new monaco.Range(
                        cursor.lineNumber,
                        cursor.column,
                        cursor.lineNumber,
                        cursor.column+1
                    ),
                    options: {
                        className: "remote-cursor",
                        after: {
                            content: cursor.username,
                            inlineClassName: "remote-cursor-label"
                        }
                    }
                };
        });
        decorationsRef.current = editor.deltaDecorations(
            decorationsRef.current,
            newDecorations
        );
    }, [remoteCursors]);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.onDidChangeCurorPosition((event) => {
            const pos = event.position;

            sendCursorPosition(
                roomCode,
                username,
                pos.lineNumber,
                pos.column
            );
        });
    };

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