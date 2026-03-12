package com.collabcode.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.collabcode.backend.dto.CodeMessage;

@Controller
public class CodeSyncController {
    
    private final SimpMessagingTemplate messagingTemplate;

    public CodeSyncController(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }


    @MessageMapping("/code")
    public void syncCode(CodeMessage message){

        messagingTemplate.convertAndSend("/topic/room/" + message.getRoomCode(), message);
    }
}
