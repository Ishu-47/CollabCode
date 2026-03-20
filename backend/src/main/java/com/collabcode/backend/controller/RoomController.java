package com.collabcode.backend.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public Room createRoom(@RequestParam String language) {
        return roomService.createRoom(language);
    }

    @PostMapping("/join/{roomCode}")
    public ResponseEntity<?> requestJoin(@PathVariable String roomCode) {
        roomService.requestToJoin(roomCode);
        return ResponseEntity.ok("Request sent");
    }

    @GetMapping("/pending/{roomCode}")
    public ResponseEntity<?> getPending(@PathVariable String roomCode) {
        return ResponseEntity.ok(roomService.getPendingUsers(roomCode));
    }

    @PostMapping("/approve/{memberId}")
    public ResponseEntity<?> approve(@PathVariable UUID memberId) {
        roomService.approveUser(memberId);
        return ResponseEntity.ok("Approved");
    }

    @PostMapping("/reject/{memberId}")
    public ResponseEntity<?> reject(@PathVariable UUID memberId) {
        roomService.rejectUser(memberId);
        return ResponseEntity.ok("Rejected");
    }

    @GetMapping("/me")
    public String getMe() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
