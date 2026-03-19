package com.collabcode.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.collabcode.backend.dto.RoomMemberDTO;
import com.collabcode.backend.entity.Room;
import com.collabcode.backend.entity.RoomMember;
import com.collabcode.backend.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
    
    private final RoomService roomService;

    @PostMapping("/create")
    public Room createRoom(@RequestParam String language){
        return roomService.createRoom(language);
    }

    @PostMapping("/join")
    public RoomMemberDTO joinRoom(@RequestParam String roomCode, @RequestParam String username){
        RoomMember member = roomService.joinRoom(roomCode, username);
        return new RoomMemberDTO(member.getUser().getUsername());
    }
}
