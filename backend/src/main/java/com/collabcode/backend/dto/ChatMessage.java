package com.collabcode.backend.dto;

import lombok.Data;

@Data
public class ChatMessage {
    private String roomCode;
    private String sender;
    private String message;
}
