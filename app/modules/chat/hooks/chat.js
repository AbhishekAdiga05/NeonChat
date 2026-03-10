"use client";

import { useMutation } from "@tanstack/react-query";

export function useCreateChat() {
  return useMutation({
    mutationFn: async ({ content, model }) => {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, model }),
      });

      if (!res.ok) {
        throw new Error("Failed to create chat");
      }

      return res.json();
    },
  });
}
