"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useGetChatById } from "../hooks/chat";
import { Spinner } from "@/components/ui/spinner";
import MessageCard from "./message-card";
import MessageForm from "./message-form";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const MessageViewWithForm = ({ chatId }) => {
  const { data, isPending, isError, error } = useGetChatById(chatId);
  const searchParams = useSearchParams();
  const autoTrigger = searchParams.get("autoTrigger") === "true";
  const hasAutoTriggeredRef = useRef(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const queryClient = useQueryClient();
  const storedMessages = data?.data?.messages;

  const initialMessages = React.useMemo(
    () => {
      if (!storedMessages) {
        return [];
      }

      return storedMessages.map((msg) => {
      let parts = [{ type: "text", text: msg.content }];
      try {
        const parsed = JSON.parse(msg.content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
          parts = parsed;
        }
      } catch {
        // Fallback to treating content as plain text.
      }

      return {
        id: msg.id,
        role: msg.messageRole.toLowerCase(),
        content: msg.content,
        parts: parts,
        createdAt: msg.createdAt,
      };
      });
    },
    [storedMessages],
  );

  const {
    messages,
    sendMessage,
    regenerate: reload,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    initialMessages,
    body: {
      chatId,
      model: data?.data?.model,
    },
    onError: (e) => {
      console.error(e);
      toast.error(e.message || "Failed to generate AI response.");
    },
    onFinish: () => {
      // Invalidate the chat list to update any sidebars when AI is done
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chats", chatId] });
    },
  });

  const [input, setInput] = useState("");
  const handleInputChange = (e) => setInput(e.target.value);
  const handleSubmit = (e, options) => {
    e?.preventDefault?.();
    if (!input) return;
    sendMessage({ text: input }, options);
    setInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  // Ensure initial messages are set perfectly when data finishes loading, without overwriting history
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, messages.length, setMessages]);

  useEffect(() => {
    if (
      autoTrigger &&
      !hasAutoTriggeredRef.current &&
      initialMessages.length === 1 &&
      initialMessages[0].role === "user"
    ) {
      hasAutoTriggeredRef.current = true;
      reload({ body: { skipUserMessage: true, chatId, model: data?.data?.model } });
    }
  }, [autoTrigger, initialMessages, reload, chatId, data?.data?.model]);

  // Check if we are waiting for an AI response
  const lastMessage = messages[messages.length - 1];
  const isWaitingForAi = isLoading && lastMessage?.role === "user";

  useEffect(() => {
    if (messagesEndRef.current) {
      // Auto-scroll to bottom as text arrives
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isWaitingForAi]);

  if (isPending && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className={"text-primary"} />
      </div>
    );
  }

  if (isError && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error: {error?.message || "Failed to load messages"}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              content={
                message.parts
                  ?.filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("\n") ?? message.content
              }
              role={message.role === "assistant" ? "ASSISTANT" : "USER"}
              type="NORMAL"
              createdAt={message.createdAt}
            />
          ))}

          {/* AI Generating Indicator */}
          {isWaitingForAi && (
            <div className="flex items-center gap-2 px-2 py-4">
              <Spinner className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground animate-pulse">
                Generating response...
              </span>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Form with gradient overlay */}
      <div className="relative border-t bg-background">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-4 pt-1">
          <MessageForm
            model={data?.data?.model}
            chatId={chatId}
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageViewWithForm;
