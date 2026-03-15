package com.collabcode.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.collabcode.backend.entity.ChatMessageEntity;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity,Long> {
    
    List<ChatMessageEntity> findByRoomCodeOrderByTimestampAsc(String roomCode);

}