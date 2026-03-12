package com.collabcode.backend.service;

import com.collabcode.backend.dto.CodeExecutionRequest;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class CodeExecutionService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String executeCode(CodeExecutionRequest request) {

        String url = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("source_code", request.getCode());
        body.put("language_id", getLanguageId(request.getLanguage()));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(url, entity, String.class);

        return response.getBody();
    }

    private int getLanguageId(String language) {

        return switch (language.toLowerCase()) {
            case "java" -> 62;
            case "python" -> 71;
            case "cpp" -> 54;
            case "javascript" -> 63;
            default -> 62;
        };
    }
}