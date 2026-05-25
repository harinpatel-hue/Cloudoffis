const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { ListToolsRequestSchema, CallToolRequestSchema } = require("@modelcontextprotocol/sdk/types.js");
const { chromium } = require("playwright");

const server = new Server(
  {
    name: "playwright-server",
    version: "1.0.0"
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "openPage",
      description: "Open a URL in a headless/headed browser session",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The URL to navigate to"
          }
        },
        required: ["url"]
      }
    }
  ]
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "openPage") {
    const { url } = request.params.arguments;
    
    // Launch browser (headed for visibility, or headless if preferred)
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      await page.goto(url);
      return {
        content: [
          {
            type: "text",
            text: `Successfully opened ${url} in a new browser window.`
          }
        ]
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Failed to open ${url}: ${error.message}`
          }
        ]
      };
    }
  }
  
  throw new Error(`Tool not found: ${request.params.name}`);
});

const transport = new StdioServerTransport();

server.connect(transport).then(() => {
  // Use console.error (stderr) for logging to prevent stdio protocol channel corruption
  console.error("MCP Playwright server successfully started and listening on stdio.");
}).catch((error) => {
  console.error("Failed to start MCP Playwright server:", error);
});