const express = require("express");
const cors = require("cors");
const { WebSocketServer, WebSocket } = require("ws");

const { getRichieRichResponse } = require("./clients/richieRich");
const RRML2HTML = require("./utils/RRML2HTML");

const PORT = 8081;
const app = express();

app.use(cors());
app.use(express.json());

// HTTP endpoint for the existing functionality
app.post("/", async (req, res) => {
  const requestPrompt = req.body.prompt;
  const response = await getRichieRichResponse(requestPrompt);
  const responseHTML = RRML2HTML(response);
  res.send(responseHTML);
});

// Create a WebSocket server
const wss = new WebSocketServer({ port: 8083 });

wss.on("connection", function connection(ws) {
  console.log("WebSocket connection established");

  ws.on("message", async function message(data) {
    const requestPrompt = data.toString();
    console.log("Received:", requestPrompt);

    const externalWebSocket = new WebSocket("ws://localhost:8082/v1/stream");

    externalWebSocket.on("open", () => {
      // Forward the data to the external WebSocket server
      externalWebSocket.send(requestPrompt);
    });

    externalWebSocket.on("message", (externalData) => {
      const responseHTML = RRML2HTML(externalData.toString());
      ws.send(responseHTML);
    });

    externalWebSocket.on("error", (err) => {
      console.error("External WebSocket error:", err);
      ws.send(
        "Error occurred while connecting to the external WebSocket server."
      );
      ws.close();
    });

    externalWebSocket.on("close", () => {
      console.log("External WebSocket connection closed");
      ws.close();
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

app.listen(PORT, () => {
  console.log(`HTTP server started on port ${PORT}`);
});

console.log(`WebSocket server started on port 8083`);
