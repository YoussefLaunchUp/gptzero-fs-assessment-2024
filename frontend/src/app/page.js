"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChatResponse, ChatPrompt, TextArea } from "../components/chat";

const agentTypes = {
  user: "User",
  richieRich: "RichieRich",
};

export default function Home() {
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [collectionError, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const wsRef = useRef(null);

  const handleTextAreaChange = (event) => {
    setPrompt(event.target.value);
  };

  const addMessage = (message, agent) => {
    setMessages((prev) => [
      ...prev,
      {
        agent,
        contents: message,
      },
    ]);
  };

  const addResponseMessage = (response) => {
    console.log("response", response);
    setMessages((prev) => {
      // Check if the last message is from richieRich
      const lastMessageIndex = prev.length - 1;
      if (
        lastMessageIndex >= 0 &&
        prev[lastMessageIndex].agent === agentTypes.richieRich
      ) {
        // Append to the last message
        const updatedMessages = [...prev];
        updatedMessages[lastMessageIndex].contents += response;
        return updatedMessages;
      } else {
        // Create a new message
        return [
          ...prev,
          {
            agent: agentTypes.richieRich,
            contents: response,
          },
        ];
      }
    });
  };

  const handleSubmit = () => {
    if (!prompt) {
      setError("Please enter a prompt.");
      return;
    }
    setError(null);
    setIsLoadingResponse(true);
    addMessage(prompt, agentTypes.user);

    // Close the previous WebSocket connection if it exists
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Establish WebSocket connection
    const ws = new WebSocket("ws://localhost:8083");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(prompt);
      setPrompt("");
    };

    ws.onmessage = (event) => {
      console.log("WebSocket message:", event.data);
      addResponseMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("An error occurred. Please try again.");
      setIsLoadingResponse(false);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsLoadingResponse(false);
      wsRef.current = null;
    };
  };

  useEffect(() => {
    return () => {
      // Close the WebSocket connection when the component unmounts
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col items-center w-full bg-gray-100 h-[93vh]">
      <div
        ref={scrollContainerRef}
        className="flex flex-col overflow-y-scroll p-20 w-full mb-40"
      >
        {messages.map((message, index) =>
          message.agent === agentTypes.user ? (
            <ChatPrompt key={index} prompt={message.contents} />
          ) : (
            <ChatResponse key={index} response={message.contents} />
          )
        )}
      </div>
      <TextArea
        onChange={handleTextAreaChange}
        onSubmit={handleSubmit}
        isLoading={isLoadingResponse}
        hasError={collectionError !== null}
      />
      {collectionError && (
        <div className="absolute bottom-0 mb-2 text-red-500">
          {collectionError}
        </div>
      )}
    </main>
  );
}
