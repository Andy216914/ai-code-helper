package com.andy.aicodehelper.ai.guardrail;

import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.guardrail.InputGuardrail;
import dev.langchain4j.guardrail.InputGuardrailResult;

import java.util.Set;

/**
 * Security check input guardrail
 */
public class SafeInputGuardrail implements InputGuardrail {

    private static final Set<String> sensitiveWords = Set.of("evil", "weapon");

    /**
     * Check whether the user input is safe
     */
    @Override
    public InputGuardrailResult validate(UserMessage userMessage) {
        // Get user input and convert it to lowercase to ensure case-insensitive matching
        String inputText = userMessage.singleText().toLowerCase();
        // Split the input text into words using regex
        String[] words = inputText.split("\\W+");
        // Iterate and check for sensitive words
        for (String word : words) {
            if (sensitiveWords.contains(word)) {
                return fatal("Sensitive word detected: " + word);
            }
        }
        return success();
    }
}
