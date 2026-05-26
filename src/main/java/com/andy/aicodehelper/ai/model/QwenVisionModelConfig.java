package com.andy.aicodehelper.ai.model;

import dev.langchain4j.community.model.dashscope.QwenStreamingChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.listener.ChatModelListener;
import jakarta.annotation.Resource;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Streaming Qwen-VL (vision-language) model, used for image/PDF chat.
 * Bound to a separate config block so it can run a different model
 * (qwen-vl-max) than the text streaming model.
 */
@Configuration
@ConfigurationProperties(prefix = "langchain4j.community.dashscope.vision-streaming-chat-model")
@Data
public class QwenVisionModelConfig {

    private String baseUrl;

    private String modelName;

    private String apiKey;

    @Resource
    private ChatModelListener chatModelListener;

    @Bean
    public StreamingChatModel qwenVisionStreamingChatModel() {
        return QwenStreamingChatModel.builder()
                .baseUrl(baseUrl)
                .apiKey(apiKey)
                .modelName(modelName)
                .listeners(List.of(chatModelListener))
                .build();
    }
}
