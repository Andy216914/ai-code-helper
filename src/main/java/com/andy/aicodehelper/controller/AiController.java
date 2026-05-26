package com.andy.aicodehelper.controller;

import com.andy.aicodehelper.ai.AiCodeHelper;
import com.andy.aicodehelper.ai.AiCodeHelperService;
import com.andy.aicodehelper.ai.vision.FileToImageContent;
import dev.langchain4j.data.message.ImageContent;
import jakarta.annotation.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.util.List;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @Resource
    private AiCodeHelper aiCodeHelper;

    @Resource
    private FileToImageContent fileToImageContent;

    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chat(int memoryId, String message) {
        return aiCodeHelperService.chatStream(memoryId, message)
                .map(chunk -> ServerSentEvent.<String>builder()
                        .data(chunk)
                        .build())
                // Explicit end-of-stream marker so the client can PROVE the reply finished.
                // concatWith only runs after the model stream completes normally; if it errors,
                // the marker is not sent and the client treats the reply as interrupted.
                .concatWith(Flux.just(ServerSentEvent.<String>builder()
                        .event("done")
                        .data("")
                        .build()));
    }

    // Multimodal chat: upload an image or PDF (screenshot, resume) + a question.
    // Streamed over SSE; consume from the browser with fetch() (EventSource is GET-only).
    @PostMapping(value = "/chat/vision",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chatVision(@RequestParam String message,
                                                    @RequestParam MultipartFile file) {
        List<ImageContent> images = fileToImageContent.convert(file);
        return aiCodeHelper.chatWithImagesStream(message, images)
                .map(chunk -> ServerSentEvent.<String>builder()
                        .data(chunk)
                        .build())
                // Same end-of-stream marker as the text endpoint (see chat()).
                .concatWith(Flux.just(ServerSentEvent.<String>builder()
                        .event("done")
                        .data("")
                        .build()));
    }
}
