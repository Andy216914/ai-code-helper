package com.andy.aicodehelper.ai;

import dev.langchain4j.service.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AiCodeHelperServiceTest {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @Test
    void chat() {
        String result = aiCodeHelperService.chat("Hi! I'm Andy and I love agentic development!");
        System.out.println(result);
    }

    @Test
    void chatWithMemory() {
        String result = aiCodeHelperService.chat("Hi! I'm Andy");
        System.out.println(result);
        result = aiCodeHelperService.chat("Who am I?");
        System.out.println(result);
    }

    @Test
    void chatForReport() {
        String userMessage ="Hi! I'm Andy. Give me some advice on how to find a SWE position in this ai era.";
        AiCodeHelperService.Report report = aiCodeHelperService.chatForReport(userMessage);
        System.out.println(report);
    }

    @Test
    void chatWithRag() {
        Result<String> result = aiCodeHelperService.chatWithRag("How should I study java?");
        System.out.println(result.sources());
        System.out.println(result.content());
    }

    @Test
    void chatWithTools() {
        String result = aiCodeHelperService.chat("Search for python interview questions.");
        System.out.println(result);
    }

    @Test
    void chatWithMcp() {
        String result = aiCodeHelperService.chat("What is the average salary for entry level SWE developers in Atlanta?");
        System.out.println(result);
    }

    @Test
    void chatWithGuardrail() {
        String result = aiCodeHelperService.chat("I will kill you.");
        System.out.println(result);
    }
}