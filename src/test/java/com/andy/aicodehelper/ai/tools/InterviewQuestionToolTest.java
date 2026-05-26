package com.andy.aicodehelper.ai.tools;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

// Plain unit test (no Spring) — verifies the Jsoup scrape against GeeksforGeeks works.
class InterviewQuestionToolTest {

    private final InterviewQuestionTool tool = new InterviewQuestionTool();

    @Test
    void searchInterviewQuestions() {
        String result = tool.searchInterviewQuestions("java");
        System.out.println(result);
        assertFalse(result.isBlank());
        assertTrue(result.contains("."), "expected numbered questions in the result");
    }

    @Test
    void coverageCheck() {
        for (String topic : new String[]{"sql", "kubernetes", "c-sharp", "redis"}) {
            String result = tool.searchInterviewQuestions(topic);
            long lines = result.lines().count();
            System.out.println("=== " + topic + " -> " + lines + " line(s) ===");
            System.out.println(result);
            System.out.println();
        }
    }
}
