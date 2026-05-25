package com.andy.aicodehelper.ai;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AiCodeHelper {

    @Resource
    private ChatModel qwenChatModel;

    // system prompt
    private static final String SYSTEM_MESSAGE = """
            You are a helpful assistant in the field of programming, helping users with questions
            related to programming study and job interviews, and offering advice. Focus on 4 areas:
            1. Plan clear programming learning paths
            2. Provide project-based learning suggestions
            3. Give a full-process guide for programmers' job hunting (e.g., resume optimization, application tips)
            4. Share high-frequency interview questions and interview techniques
            Please answer in clear, easy-to-understand language to help users study and find jobs efficiently.
            """;

    // text prompt
    public String chat(String message) {
        SystemMessage systemMessage = SystemMessage.from(SYSTEM_MESSAGE);
        UserMessage userMessage = UserMessage.from(message);
        ChatResponse chatResponse = qwenChatModel.chat(systemMessage, userMessage);
        AiMessage aiMessage = chatResponse.aiMessage();
        log.info("AI output " + aiMessage.toString());
        return aiMessage.text();
    }

    // customized prompt (check model capability)
    public String chatWithMessage(UserMessage userMessage) {
        ChatResponse chatResponse = qwenChatModel.chat(userMessage);
        AiMessage aiMessage = chatResponse.aiMessage();
        log.info("AI output " + aiMessage.toString());
        return aiMessage.text();
    }
}