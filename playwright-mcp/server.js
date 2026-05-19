const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
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

const transport = new StdioServerTransport();

server.connect(transport);

console.log("MCP Playwright server started");