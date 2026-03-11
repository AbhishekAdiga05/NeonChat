"use client";

import React, { useEffect } from "react";
import {
  useGetChatById,
  useCreateMessageInChat,
} from "@/app/modules/chat/hooks/chat";
import { useChatStore } from "@/app/modules/chat/store/chat-store";
import { useSearchParams } from "next/navigation";

export default function ActiveChatLoader({ chatId }) {
  const {
    setActiveChatId,
    setMessages,
    addChat,
    chats,
    markChatAsTriggered,
    hasChatBeenTriggered,
  } = useChatStore();
  const searchParams = useSearchParams();
  const autoTrigger = searchParams.get("autoTrigger") === "true";

  const { data, isLoading } = useGetChatById(chatId);
  const { mutateAsync: sendMessage } = useCreateMessageInChat(chatId);

  useEffect(() => {
    if (!chatId) return;
    setActiveChatId(chatId);
  }, [chatId, setActiveChatId]);

  useEffect(() => {
    if (!data || !data.success || !data.data) return;

    const chat = data.data;

    // populate messages
    setMessages(chat.messages || []);

    if (!chats?.some((c) => c.id === chat.id)) {
      addChat(chat);
    }
  }, [data, setMessages, addChat, chats]);

  // Auto-trigger AI response for newly created chats
  useEffect(() => {
    if (!autoTrigger || !data?.data || isLoading) return;
    if (hasChatBeenTriggered(chatId)) return;

    const chat = data.data;
    const messages = chat.messages || [];
    // Only trigger if there's exactly one user message and no assistant response yet
    const userMessages = messages.filter((m) => m.messageRole === "USER");
    const assistantMessages = messages.filter(
      (m) => m.messageRole === "ASSISTANT",
    );

    if (userMessages.length === 1 && assistantMessages.length === 0) {
      markChatAsTriggered(chatId);
      const lastUserMessage = userMessages[0];
      sendMessage({
        content: lastUserMessage.content,
        model: chat.model,
      }).catch((err) => console.error("Auto-trigger error:", err));
    }
  }, [
    autoTrigger,
    data,
    isLoading,
    chatId,
    sendMessage,
    markChatAsTriggered,
    hasChatBeenTriggered,
  ]);

  return null;
}
