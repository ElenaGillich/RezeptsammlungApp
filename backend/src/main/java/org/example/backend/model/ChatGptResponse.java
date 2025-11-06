package org.example.backend.model;

import java.util.List;

public record ChatGptResponse(
        String id,
        String model,
        List<ChatGptChoice> choices) {
}
