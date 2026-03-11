package com.collabcode.backend.util;

import java.util.Random;

public class RoomCodeGenerator {
    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int LENGTH = 6;

    public static String generateCode(){
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for(int i = 0; i < LENGTH; i++){
            code.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return code.toString();
    }
}
