package com.andy.aicodehelper.ai;

import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.Content;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import dev.langchain4j.model.chat.response.StreamingChatResponseHandler;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class AiCodeHelper {

    @Resource
    private ChatModel qwenChatModel;

    @Resource
    private StreamingChatModel qwenVisionStreamingChatModel;

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

    // Streaming multimodal chat: user text + image(s) -> Qwen-VL, streamed as a Flux.
    public Flux<String> chatWithImagesStream(String message, List<ImageContent> images) {
        List<Content> contents = new ArrayList<>();
        contents.add(TextContent.from(message));
        contents.addAll(images);
        UserMessage userMessage = UserMessage.from(contents);

        // Bridge the callback-based streaming model to a reactive Flux.
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();
        qwenVisionStreamingChatModel.chat(List.<ChatMessage>of(userMessage), new StreamingChatResponseHandler() {
            @Override
            public void onPartialResponse(String partialResponse) {
                sink.tryEmitNext(partialResponse);
            }

            @Override
            public void onCompleteResponse(ChatResponse completeResponse) {
                sink.tryEmitComplete();
            }

            @Override
            public void onError(Throwable error) {
                log.error("Vision streaming failed", error);
                sink.tryEmitError(error);
            }
        });
        return sink.asFlux();
    }
}