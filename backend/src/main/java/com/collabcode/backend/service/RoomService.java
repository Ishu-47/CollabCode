package com.collabcode.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.collabcode.backend.entity.Room;
import com.collabcode.backend.entity.RoomMember;
import com.collabcode.backend.entity.User;
import com.collabcode.backend.repository.RoomMemberRepository;
import com.collabcode.backend.repository.RoomRepository;
import com.collabcode.backend.repository.UserRepository;
import com.collabcode.backend.util.RoomCodeGenerator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;

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

        User user = userRepository.findByUsername(username).
                    orElseGet(() -> {
                    User newUser = User.builder()
                                   .username(username)
                                   .build();
                    return userRepository.save(newUser);
                });

        RoomMember existing = roomMemberRepository.findByRoomMemberAndUser(room, user);
        if(existing != null){
            existing.setActive(true);
            return roomMemberRepository.save(existing);
        }

        RoomMember member = RoomMember.builder()
                            .user(user)
                            .joinedAt(LocalDateTime.now())
                            .active(true)
                            .room(room)
                            .build();

        return roomMemberRepository.save(member);
    }
}
