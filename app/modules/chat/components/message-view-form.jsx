"use client";
import React, { useEffect, useRef } from "react";

import { useGetChatById } from "../hooks/chat";
import { useChatStore } from "../store/chat-store";
import { Spinner } from "@/components/ui/spinner";
import MessageCard from "./message-card";
import MessageForm from "./message-form";

const MessageViewWithForm = ({ chatId }) => {
  const { data, isPending, isError, error } = useGetChatById(chatId);
  const storeMessages = useChatStore((s) => s.messages);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Use store messages (kept in sync by ActiveChatLoader + optimistic updates)
  // Fall back to query data if store is empty
  const messages =
    storeMessages.length > 0 ? storeMessages : (data?.data?.messages ?? []);

  const model = data?.data?.model;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              content={message.content}
              role={message.messageRole}
              type={message.messageType}
              createdAt={message.createdAt}
            />
          ))}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Form with gradient overlay */}
      <div className="relative border-t bg-background">
        <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 py-4 pt-1">
          <MessageForm model={model} chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default MessageViewWithForm;
