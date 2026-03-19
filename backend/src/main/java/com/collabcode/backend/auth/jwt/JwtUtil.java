package com.collabcode.backend.auth.jwt;

import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {
    private final String SECRET = "my_secret_key";

    public String generateToken(String username){
        return Jwts.builder()
               .setSubject(username)
               .setIssuedAt(new Date())
               .setExpiration(new Date(System.currentTimeMillis() + 86400000))
               .signWith(SignatureAlgorithm.HS256, SECRET)
               .compact();
    }
    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }
    private Claims extractAllClaims(String token){
        return Jwts.parser()
               .setSigningKey(token)
               .parseClaimsJws(token)
               .getBody();
    }
    public boolean isTokenValid(String token, String username){
        return extractUsername(token).equals(username);
    }
}
