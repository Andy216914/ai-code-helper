package com.andy.aicodehelper.ai;

import com.andy.aicodehelper.ai.guardrail.SafeInputGuardrail;
import dev.langchain4j.service.Result;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.guardrail.InputGuardrails;

import java.util.List;

// Interface only — langchain4j generates the implementation at runtime (high-level API).
// @AiService (not versatile)
@InputGuardrails({ SafeInputGuardrail.class })
public interface AiCodeHelperService {

    @SystemMessage(fromResource = "system-prompt.txt")
    // arg -> UserMessage, return <- AiMessage.text()
    String chat(String userMessage);

    // Structured output: non-String return makes langchain4j ask the model for JSON and parse it into a Report.
    @SystemMessage(fromResource = "system-prompt.txt")
    Report chatForReport(String userMessage);

    // Immutable data shape the AI fills in (auto-generates constructor + name()/suggestionList() accessors).
    record Report(String name, List<String> suggestionList){}

    @SystemMessage(fromResource = "system-prompt.txt")
    Result<String> chatWithRag(String userMessage);
}
