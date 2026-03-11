package com.collabcode.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.collabcode.backend.entity.Room;
import com.collabcode.backend.entity.RoomMember;
import com.collabcode.backend.repository.RoomMemberRepository;
import com.collabcode.backend.repository.RoomRepository;
import com.collabcode.backend.util.RoomCodeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;

    public Room createRoom(String language){
        Room room = Room.builder()
                    .roomCode(RoomCodeGenerator.generateCode())
                    .language(language)
                    .createdAt(LocalDateTime.now())
                    .lastActiveAt(LocalDateTime.now())
                    .build();
        return roomRepository.save(room);
    }
    public RoomMember joinRoom(String roomCode, String username){
        Room room = roomRepository.findByRoomCode(roomCode)
        .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomMember member = RoomMember.builder()
                            .username(username)
                            .joinedAt(LocalDateTime.now())
                            .active(true)
                            .room(room)
                            .build();

        return roomMemberRepository.save(member);
    }
}
