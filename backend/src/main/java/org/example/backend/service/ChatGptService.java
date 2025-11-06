package org.example.backend.service;

import org.example.backend.model.ChatGptMessage;
import org.example.backend.model.ChatGptRequest;
import org.example.backend.model.ChatGptResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatGptService {
    private final RestClient restClient;

    public ChatGptService(
            RestClient.Builder restClientBuilder,
            @Value("${OPENAI_API_KEY}") String apiKey
    ) {
        this.restClient = restClientBuilder
                .baseUrl("https://api.openai.com/v1/chat/completions")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .build();
    }

    public String getAiExplanation(String text) {
        List<ChatGptMessage> messageList = new ArrayList<>(
                List.of(new ChatGptMessage("user", "Erzähle kurz und klar über den Zutat. " +
                        "Was ist das, wie wird das benutzt, wie kann man bei Bedarf ersetzen etc.?" +
                        "Wenn eine ungültige Anfrage kommt, muss man auf dies nur hinweisen." +
                        "Zutat ist : " + text)));

        ChatGptRequest request = new ChatGptRequest("gpt-5", messageList);

        ChatGptResponse aiResponse = restClient.post()
                .body(request)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(ChatGptResponse.class);
        try {
            return aiResponse.choices().get(0).message().content();
        } catch (NullPointerException exception) {
            return "No data in response!";
        }
    }
}

