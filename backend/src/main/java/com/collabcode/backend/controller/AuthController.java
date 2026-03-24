package com.collabcode.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.backend.auth.service.AuthService;
import com.collabcode.backend.dto.LoginRequest;
import com.collabcode.backend.dto.RegisterRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){
    //     System.out.println("USERNAME: " + request.getUsername());
    // System.out.println("PASSWORD: " + request.getPassword());
        authService.register(request);
        return ResponseEntity.ok("User register successfully");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        String token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}
