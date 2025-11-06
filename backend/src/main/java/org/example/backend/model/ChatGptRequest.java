package org.example.backend.model;

import java.util.List;

public record ChatGptRequest(String model, List<ChatGptMessage> messages) {
}
