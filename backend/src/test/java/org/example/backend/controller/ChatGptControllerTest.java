package org.example.backend.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureMockRestServiceServer;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureMockRestServiceServer
class ChatGptControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    MockRestServiceServer mockServer;

    @Test
    void createChatCompletion_shouldReturnNoDataInResponse_whenApiReturnsEmpty() throws Exception {
        //GIVEN
        mockServer.expect(requestTo("https://api.openai.com/v1/chat/completions"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("""
                    {
                        "id": "12345",
                        "model": "gpt-5"
                    }
                    """, MediaType.APPLICATION_JSON));      // ohne "choices" → wirft NullPointerException

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/chat")
                .contentType(MediaType.TEXT_PLAIN)
                .content("Chia"))
        //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("No data in response!"));
    }

    @Test
    void createChatCompletion_shouldReturnAnswerText() throws Exception {
        //GIVEN
        mockServer.expect(requestTo("https://api.openai.com/v1/chat/completions"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("""
                    {
                        "id": "12345",
                        "model": "gpt-5",
                        "choices": [
                            {
                                "message": {
                                    "content": "Response with information about chia.",
                                    "role": "user"
                                }
                            }
                        ]
                    }
                    """, MediaType.APPLICATION_JSON));

        //WHEN
        mockMvc.perform(MockMvcRequestBuilders.post("/api/chat")
                .contentType(MediaType.TEXT_PLAIN)
                .content("Chia"))
        //THEN
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .string("Response with information about chia."));
    }
}