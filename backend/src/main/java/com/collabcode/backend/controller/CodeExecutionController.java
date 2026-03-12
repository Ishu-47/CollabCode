package com.collabcode.backend.controller;

import com.collabcode.backend.service.CodeExecutionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.backend.dto.CodeExecutionRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/execute")
@RequiredArgsConstructor
public class CodeExecutionController {
    
    private final CodeExecutionService codeExecutionService;

    @PostMapping
    public String execute(@RequestBody CodeExecutionRequest request){
        return codeExecutionService.executeCode(request);
    }
}
