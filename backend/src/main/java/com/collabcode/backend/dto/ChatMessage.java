package com.collabcode.backend.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private String roomCode;
    private String username;
    private String message;
}
