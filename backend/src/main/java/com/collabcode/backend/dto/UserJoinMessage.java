package com.collabcode.backend.dto;

import lombok.Data;

@Data
public class UserJoinMessage {
    
    private String roomCode;
    private String username;
}
