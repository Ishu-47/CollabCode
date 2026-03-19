import { useState } from "react";

export default function useCursorSync() {

    const [remoteCursors, setRemoteCursors] = useState({});

    const handleCursorUpdate = (cursorData) => {
    setRemoteCursors((prev) => {
        return {
            ...prev,
            [cursorData.username]: cursorData
        };
    });
};

    return {
        remoteCursors,
        handleCursorUpdate
    };
}