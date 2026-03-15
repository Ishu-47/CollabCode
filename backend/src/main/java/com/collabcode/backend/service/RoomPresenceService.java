package com.collabcode.backend.service;

import java.util.*;

import org.springframework.stereotype.Service;

@Service
public class RoomPresenceService {
    
    private final Map<String, Set<String>> roomUsers = new HashMap<>();

    public void addUser(String roomCode, String username){
        roomUsers.computeIfAbsent(roomCode, k -> new HashSet<>())
        .add(username);
    }
    public Set<String> getUsers(String roomCode){
        return roomUsers.getOrDefault(roomCode, new HashSet<>());
    }
}
