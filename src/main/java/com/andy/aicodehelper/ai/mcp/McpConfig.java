package com.andy.aicodehelper.ai.mcp;

import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.mcp.client.DefaultMcpClient;
import dev.langchain4j.mcp.client.McpClient;
import dev.langchain4j.mcp.client.transport.McpTransport;
import dev.langchain4j.mcp.client.transport.stdio.StdioMcpTransport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class McpConfig {

    @Value("${tavily.api-key}")
    private String apiKey;

    @Bean
    public McpToolProvider mcpToolProvider() {

        // Launch the Tavily MCP server locally via npx and talk to it over stdio.
        McpTransport transport = new StdioMcpTransport.Builder()
                .command(List.of("npx", "-y", "tavily-mcp@latest"))
                .environment(Map.of("TAVILY_API_KEY", apiKey))
                .logEvents(true) // log MCP traffic for easier debugging
                .build();

        // Create the MCP client
        McpClient mcpClient = new DefaultMcpClient.Builder()
                .key("yupiMcpClient")
                .transport(transport)
                .build();

        // Retrieve tools from the MCP client
        McpToolProvider toolProvider = McpToolProvider.builder()
                .mcpClients(mcpClient)
                .build();

        return toolProvider;
    }
}