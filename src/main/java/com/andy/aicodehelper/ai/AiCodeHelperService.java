package com.andy.aicodehelper.ai;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;

// Interface only — langchain4j generates the implementation at runtime (high-level API).
// @AiService (not versatile)
public interface AiCodeHelperService {

    @SystemMessage(fromResource = "system-prompt.txt")
    // arg -> UserMessage, return <- AiMessage.text()
    String chat(String userMessage);
}
