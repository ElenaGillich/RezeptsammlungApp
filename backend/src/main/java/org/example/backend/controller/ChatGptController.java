package org.example.backend.controller;

import org.example.backend.service.ChatGptService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatGptController {
    private final ChatGptService chatGptService;

    public ChatGptController(ChatGptService chatGptService) {
        this.chatGptService = chatGptService;
    }

    @PostMapping
    public String createChatCompletion(@RequestBody String ingredient) {
        return chatGptService.getAiExplanation(ingredient);
    }
}
