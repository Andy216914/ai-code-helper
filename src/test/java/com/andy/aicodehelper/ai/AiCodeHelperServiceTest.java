package com.andy.aicodehelper.ai;

import com.andy.aicodehelper.ai.vision.FileToImageContent;
import dev.langchain4j.data.message.ImageContent;
import dev.langchain4j.service.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import reactor.core.publisher.Flux;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AiCodeHelperServiceTest {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @Resource
    private AiCodeHelper aiCodeHelper;

    @Resource
    private FileToImageContent fileToImageContent;

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

    @Test
    void chatWithImage() throws Exception {
        String path = "/Users/andyjin/Downloads/anime-profile.png";
        byte[] bytes = Files.readAllBytes(Path.of(path));
        MockMultipartFile file = new MockMultipartFile("file", "image.png", "image/png", bytes);
        List<ImageContent> images = fileToImageContent.convert(file);
        Flux<String> stream = aiCodeHelper.chatWithImagesStream("Describe this image in detail.", images);
        // Block and print each streamed token — easy to watch / breakpoint in the IDE.
        stream.doOnNext(System.out::print).blockLast();
        System.out.println("\n--- stream complete ---");
    }

    @Test
    void chatWithPdf() throws Exception {
        String path = "/Users/andyjin/Downloads/CV_2026.pdf";
        byte[] bytes = Files.readAllBytes(Path.of(path));
        MockMultipartFile file = new MockMultipartFile("file", "resume.pdf", "application/pdf", bytes);
        List<ImageContent> images = fileToImageContent.convert(file);
        Flux<String> stream = aiCodeHelper.chatWithImagesStream(
                "This is a resume. Summarize the candidate and suggest improvements.", images);
        stream.doOnNext(System.out::print).blockLast();
        System.out.println("\n--- stream complete ---");
    }
}