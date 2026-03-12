package com.collabcode.backend.dto;

import lombok.Data;

@Data
public class CodeExecutionRequest {
    
    private String code;
    private String language;
}
