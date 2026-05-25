package com.andy.aicodehelper.ai;

import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.UserMessage;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AiCodeHelperTest {

    @Resource
    private AiCodeHelper aiCodeHelper;

    @Test
    void chat() {
        aiCodeHelper.chat("Hi! I'm Andy and I love agentic development!");
    }

    @Test
    void chatWithMessage() {
        UserMessage userMessage = UserMessage.from(
                TextContent.from("Please describe the image"),
                ImageContent.from("https://static.wikia.nocookie.net/gensin-impact/images/5/5a/Arlecchino_Profile.png")
        );
        aiCodeHelper.chatWithMessage(userMessage);
    }
}