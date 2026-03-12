package com.collabcode.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.collabcode.backend.dto.ChatMessage;

@Controller
public class ChatController {
    
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void sendMessage(ChatMessage message){
        messagingTemplate.convertAndSend("/topic/chat" + message.getRoomCode(), message);
        
    }
}
