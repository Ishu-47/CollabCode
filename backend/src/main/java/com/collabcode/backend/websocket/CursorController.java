package com.collabcode.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.collabcode.backend.dto.CursorPositionMessage;

@Controller
public class CursorController {
    
    private final SimpMessagingTemplate messagingTemplate;

    public CursorController(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }
    @MessageMapping("/cursor")
    public void broadcastCursor(CursorPositionMessage message){
        messagingTemplate.convertAndSend("/topic/cursor/" + message.getRoomCode(), message);
    }
}
