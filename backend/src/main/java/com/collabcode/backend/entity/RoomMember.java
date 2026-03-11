package com.collabcode.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomMember {
    
    @Id
    @GeneratedValue
    private UUID id;

    private String username;

    private LocalDateTime joinedAt;

    private boolean active;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
}
