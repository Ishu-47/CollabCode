package com.collabcode.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.collabcode.backend.entity.JoinStatus;
import com.collabcode.backend.entity.Role;
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

    public Room createRoom(String language) {
        User user = getCurrentUser();
        Room room = Room.builder()
                .roomCode(RoomCodeGenerator.generateCode())
                .language(language)
                .createdAt(LocalDateTime.now())
                .lastActiveAt(LocalDateTime.now())
                .host(user)
                .build();

        Room savedRoom = roomRepository.save(room);

        RoomMember member = RoomMember.builder()
                .user(user)
                .room(savedRoom)
                .joinedAt(LocalDateTime.now())
                .active(true)
                .joinStatus(JoinStatus.APPROVED)
                .role(Role.HOST)
                .build();
        roomMemberRepository.save(member);

        return savedRoom;
    }
    // public RoomMember joinRoom(String roomCode, String username){
    // Room room = roomRepository.findByRoomCode(roomCode)
    // .orElseThrow(() -> new RuntimeException("Room not found"));

    // User user = userRepository.findByUsername(username).
    // orElseGet(() -> {
    // User newUser = User.builder()
    // .username(username)
    // .build();
    // return userRepository.save(newUser);
    // });

    // RoomMember existing = roomMemberRepository.findByRoomAndUser(room, user);
    // if(existing != null){
    // existing.setActive(true);
    // return roomMemberRepository.save(existing);
    // }

    // RoomMember member = RoomMember.builder()
    // .user(user)
    // .joinedAt(LocalDateTime.now())
    // .active(true)
    // .room(room)
    // .build();

    // return roomMemberRepository.save(member);
    // }
    public RoomMember requestToJoin(String roomCode) {
        User user = getCurrentUser();
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        var existingOpt = roomMemberRepository.findByRoomAndUser(room, user);
        if (existingOpt.isPresent()) {
            RoomMember existing = existingOpt.get();

            if (existing.getJoinStatus() == JoinStatus.REJECTED) {
                throw new RuntimeException("You were rejected");
            }
            return existing;
        }
        RoomMember member = RoomMember.builder()
                .user(user)
                .room(room)
                .joinedAt(LocalDateTime.now())
                .active(false)
                .joinStatus(JoinStatus.PENDING)
                .role(Role.USER)
                .build();

        return roomMemberRepository.save(member);
    }

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void approveUser(UUID memberId) {

        User user = getCurrentUser();

        RoomMember member = roomMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Room room = member.getRoom();
        if (!room.getHost().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        member.setJoinStatus(JoinStatus.APPROVED);
        member.setActive(true);

        roomMemberRepository.save(member);
    }

    public void rejectUser(UUID memberId) {

        User user = getCurrentUser();

        RoomMember member = roomMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Room room = member.getRoom();

        if (!room.getHost().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        member.setJoinStatus(JoinStatus.REJECTED);

        roomMemberRepository.save(member);
    }

    public List<RoomMember> getPendingUsers(String roomCode) {

        User user = getCurrentUser();

        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHost().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        return roomMemberRepository.findByRoomAndJoinStatus(room, JoinStatus.PENDING);
    }

    public JoinStatus getMyJoinStatus(String roomCode){
        User user = getCurrentUser();

        Room room = roomRepository.findByRoomCode(roomCode)
                    .orElseThrow(() -> new RuntimeException("Room not found"));

        RoomMember member = roomMemberRepository.findByRoomAndUser(room, user).orElseThrow(() -> new RuntimeException("Not a member of this room"));

        return member.getJoinStatus();
    }

}
