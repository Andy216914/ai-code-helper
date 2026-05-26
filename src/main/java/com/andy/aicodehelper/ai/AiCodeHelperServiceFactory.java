package com.andy.aicodehelper.ai;

import com.andy.aicodehelper.ai.tools.InterviewQuestionTool;
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeHelperServiceFactory {

    @Resource // injects the auto-configured Qwen ChatModel bean
    private ChatModel myQwenChatModel;

    @Resource
    private ContentRetriever contentRetriever;

    @Resource
    private McpToolProvider mcpToolProvider;

    @Resource
    private StreamingChatModel qwenStreamingChatModel;

    @Bean
    public AiCodeHelperService aiCodeHelperService() {
        // Store only the latest 10 chat messages in memory
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        // Build AI service with model and memory
        AiCodeHelperService aiCodeHelperService = AiServices.builder(AiCodeHelperService.class)
                .chatModel(myQwenChatModel)
                .streamingChatModel(qwenStreamingChatModel) // Streaming chat conversation
                .chatMemory(chatMemory)
                .chatMemoryProvider(memory -> MessageWindowChatMemory.withMaxMessages(10)) // Configure a separate chat memory window for each user/session
                .contentRetriever(contentRetriever) // RAG
                .tools(new InterviewQuestionTool()) // tool calling
                .toolProvider(mcpToolProvider) // MCP tool calling
                .build();
        return aiCodeHelperService;
    }
}
