package com.collabcode.backend.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    
    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true)
    private String roomCode;

    private String language;

    private LocalDateTime createdAt;

    private LocalDateTime lastActiveAt;

    @ManyToOne
    @JoinColumn(name = "host_id")
    private User host;
}
