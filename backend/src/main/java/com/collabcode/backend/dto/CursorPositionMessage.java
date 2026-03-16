package com.collabcode.backend.dto;

import lombok.Data;

@Data
public class CursorPositionMessage {
    
    private String roomCode;
    private String username;

    private int lineNumber;
    private int column;
}
