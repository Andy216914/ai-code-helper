package com.andy.aicodehelper.ai;

import com.andy.aicodehelper.ai.tools.InterviewQuestionTool;
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeHelperServiceFactory {

    @Resource // injects the auto-configured Qwen ChatModel bean
    private ChatModel qwenChatModel;

    @Resource
    private ContentRetriever contentRetriever;

    @Resource
    private McpToolProvider mcpToolProvider;

    @Bean
    public AiCodeHelperService aiCodeHelperService() {
        // Store only the latest 10 chat messages in memory
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        // Build AI service with model and memory
        AiCodeHelperService aiCodeHelperService = AiServices.builder(AiCodeHelperService.class)
                .chatModel(qwenChatModel)
                .chatMemory(chatMemory)
                .contentRetriever(contentRetriever) // RAG
                .tools(new InterviewQuestionTool()) // tool calling
                .toolProvider(mcpToolProvider) // MCP tool calling
                .build();
        return aiCodeHelperService;
    }
}
