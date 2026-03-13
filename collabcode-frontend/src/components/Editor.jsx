import MonacoEditor from "@monaco-editor/react";

export default function Editor({ code, setCode, language }) {
    return (
        <MonacoEditor
            height="400px"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => {
                if (value !== undefined) {
                    setCode(value);
                }
            }}
        />
    );
}