package com.collabcode.backend.dto;

import lombok.Data;

@Data
public class CodeMessage {
    private String roomCode;
    private String code;
    private String language;
}
