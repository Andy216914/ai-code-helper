package com.andy.aicodehelper.ai;

import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeHelperServiceFactory {

    @Resource // injects the auto-configured Qwen ChatModel bean
    private ChatModel qwenChatModel;

    @Bean
    public AiCodeHelperService aiCodeHelperService() {
        // Builds the proxy backing AiCodeHelperService; swap to AiServices.builder() to add memory/tools
        return AiServices.create(AiCodeHelperService.class, qwenChatModel);
    }
}
