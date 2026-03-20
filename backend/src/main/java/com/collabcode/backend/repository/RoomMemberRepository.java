package com.collabcode.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collabcode.backend.entity.JoinStatus;
import com.collabcode.backend.entity.Room;
import com.collabcode.backend.entity.RoomMember;
import com.collabcode.backend.entity.User;

public interface RoomMemberRepository extends JpaRepository<RoomMember, UUID> {

    List<RoomMember> findByRoomRoomCode(String roomCode);

    Optional <RoomMember> findByRoomAndUser(Room room, User user);
    List<RoomMember> findByRoomAndStatus(Room room, JoinStatus status);

}
