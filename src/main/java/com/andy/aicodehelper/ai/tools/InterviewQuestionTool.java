package com.andy.aicodehelper.ai.tools;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class InterviewQuestionTool {

    // GeeksforGeeks serves interview questions as static HTML (no JS), reachable globally.
    private static final String BASE_URL = "https://www.geeksforgeeks.org/";
    private static final int MAX_QUESTIONS = 20;

    /**
     * Retrieves a list of interview questions related to the given keyword
     * from GeeksforGeeks (skill/technology-focused, e.g. Java, Python, SQL).
     *
     * @param keyword Search keyword (e.g. "java", "python", "spring boot")
     * @return A list of interview questions, or a message explaining why none were found
     */
    @Tool(name = "interviewQuestionSearch", value = """
            Retrieves relevant technical interview questions from GeeksforGeeks based on a keyword.
            Use this tool when the user asks for interview questions about a specific technology,
            programming language, or framework (e.g. Java, Python, SQL, Spring Boot, React).
            The input should be a single clear technology/topic name.
            """
    )
    public String searchInterviewQuestions(@P(value = "the technology/topic to search, e.g. 'java'") String keyword) {
        // GeeksforGeeks uses per-topic URLs like ".../java-interview-questions/".
        // Slugify the keyword: lowercase, trim, spaces -> hyphens.
        String slug = keyword.trim().toLowerCase().replaceAll("\\s+", "-");
        String url = BASE_URL + slug + "-interview-questions/";

        Document doc;
        try {
            doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                            + "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36")
                    .timeout(10000)
                    .get();
        } catch (IOException e) {
            log.error("Failed to fetch interview questions from {}", url, e);
            return "Could not reach the interview-question source for '" + keyword + "' ("
                    + e.getMessage() + ").";
        }

        // Questions are numbered headings, e.g. <h3><span>1. What is JVM?</span></h3>.
        // Select all h2/h3 and keep only those whose text starts with "N." (a numbered question).
        List<String> questions = new ArrayList<>();
        Elements headings = doc.select("h2, h3");
        for (Element heading : headings) {
            String text = heading.text().trim();
            if (text.matches("^\\d+\\..*")) {
                questions.add(text);
                if (questions.size() >= MAX_QUESTIONS) {
                    break;
                }
            }
        }

        if (questions.isEmpty()) {
            return "No interview questions found for '" + keyword + "'. "
                    + "Try a common technology name like 'java', 'python', or 'sql'.";
        }
        return String.join("\n", questions);
    }
}
