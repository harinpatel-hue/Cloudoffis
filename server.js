import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { chromium } from "playwright";

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

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "openPage",
      description: "Open a URL"
    }
  ]
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "openPage") {
    const browser = await chromium.launch({
      headless: false
    });

    const page = await browser.newPage();

    await page.goto(request.params.arguments.url);

    return {
      content: [{
        type: "text",
        text: `Opened ${request.params.arguments.url}`
      }]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);