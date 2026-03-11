package com.collabcode.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collabcode.backend.entity.Room;

public interface RoomRepository extends JpaRepository<Room,UUID> {
    Optional<Room> findByRoomCode(String roomCode);
}
