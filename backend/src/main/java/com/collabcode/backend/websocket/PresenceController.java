package com.collabcode.backend.websocket;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.collabcode.backend.dto.UserJoinMessage;
import com.collabcode.backend.service.RoomPresenceService;

@Controller
public class PresenceController {

    private final RoomPresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    public PresenceController(RoomPresenceService presenceService, SimpMessagingTemplate messagingTemplate) {
        this.presenceService = presenceService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/join")
    public void joinRoom(UserJoinMessage message) {
        presenceService.addUser(message.getRoomCode(),
                message.getUsername());
    messagingTemplate.convertAndSend("/topic/users/" + message.getRoomCode(), presenceService.getUsers(message.getRoomCode()));
    }
}
