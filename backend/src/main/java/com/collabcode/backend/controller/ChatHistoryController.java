package com.collabcode.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.backend.entity.ChatMessageEntity;
import com.collabcode.backend.repository.ChatMessageRepository;

@RestController
@RequestMapping("/chat")
public class ChatHistoryController {
    
    private final ChatMessageRepository chatRepo;

    public ChatHistoryController(ChatMessageRepository chatRepo){
        this.chatRepo = chatRepo;
    }

    @GetMapping("/history/{roomCode}")
    public List<ChatMessageEntity> getChatHistory(@PathVariable String roomCode){
        return chatRepo.findByRoomCodeOrderByTimestampAsc(roomCode);
    }
}
