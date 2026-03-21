package com.collabcode.backend.websocket;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import com.collabcode.backend.dto.ChatMessage;
import com.collabcode.backend.entity.ChatMessageEntity;
import com.collabcode.backend.repository.ChatMessageRepository;

@Controller
public class ChatController {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatRepo;

    public ChatController(SimpMessagingTemplate messagingTemplate, ChatMessageRepository chatRepo){
        this.messagingTemplate = messagingTemplate;
        this.chatRepo = chatRepo;
    }

    @MessageMapping("/chat")
    public void sendMessage(ChatMessage message){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        message.setUsername(username);
        ChatMessageEntity entity = new ChatMessageEntity();
        entity.setRoomCode(message.getRoomCode());
        entity.setUsername(message.getUsername());
        entity.setMessage(message.getMessage());
        entity.setTimestamp(LocalDateTime.now());
        chatRepo.save(entity);

        messagingTemplate.convertAndSend("/topic/chat/" + message.getRoomCode(), message);
        
    }
}
