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

const getMessageParts = (content) => {
  try {
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
      return parsed;
    }
  } catch {
    // Fall back to plain text messages.
  }

  return [{ type: "text", text: content }];
};

const getMessageTextContent = (message) =>
  message.parts
    ?.filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n") ?? message.content;

const getMessageAttachments = (message) =>
  message.parts?.filter((part) => part.type === "file") ?? [];

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
        const parts = getMessageParts(msg.content);

        return {
          id: msg.id,
          role: msg.messageRole.toLowerCase(),
          content: msg.content,
          parts,
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
    experimental_throttle: 50,
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
    const files = options?.files;
    if (!input.trim() && (!files || files.length === 0)) return;
    sendMessage({ text: input, files }, options);
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
              content={getMessageTextContent(message)}
              attachments={getMessageAttachments(message)}
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

      {/* Floating Message Form */}
      <div className="relative z-10">
        <div className="max-w-5xl mx-auto">
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
