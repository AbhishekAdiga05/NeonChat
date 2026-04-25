"use client";

import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";
import { useAIModels } from "@/app/modules/ai-agent/hook/ai-agent";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useCreateChat } from "../hooks/chat";

export default function ChatMessageForm({ initialMessage, onMessageChange }) {
  const { data: models, isPending } = useAIModels();

  const [message, setMessage] = useState("");
  const [selectedModelOverride, setSelectedModelOverride] = useState(null);
  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  const selectedModel = selectedModelOverride ?? models?.models?.[0]?.id ?? null;

  const [prevInitialMessage, setPrevInitialMessage] = useState(initialMessage);

  // Sync initial message from parent during render to avoid useEffect cascading renders
  if (initialMessage !== prevInitialMessage) {
    setMessage(initialMessage);
    setPrevInitialMessage(initialMessage);
    // Use an effect for the callback to ensure it happens after render
  }

  useEffect(() => {
    if (initialMessage && initialMessage === message) {
      onMessageChange?.("");
    }
  }, [initialMessage, message, onMessageChange]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    try {
      await mutateAsync({ content: message, model: selectedModel });
      toast.success("Message sent successfully");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-8">
      <form onSubmit={handleSubmit} className="relative group/form">
        {/* Main Input Container - Floating Glassmorphism */}
        <div className={cn(
          "relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-2xl shadow-2xl transition-all duration-500",
          "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 focus-within:shadow-[0_0_30px_rgba(0,240,255,0.15)]",
          "hover:border-border group-hover/form:shadow-xl"
        )}>
          {/* Textarea */}
          <TextareaAutosize
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            maxRows={6}
            className="w-full resize-none border-0 bg-transparent px-6 py-5 text-base outline-none focus:ring-0 placeholder:text-muted-foreground/60 leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/30">
            {/* Left side tools */}
            <div className="flex items-center gap-2">
              {isPending ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModelOverride}
                  className="bg-transparent hover:bg-primary/5 border-none h-10 px-3 rounded-xl transition-all"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isChatPending}
              className={cn(
                "h-12 w-12 p-0 rounded-2xl transition-all duration-300 active:scale-90",
                message.trim() 
                  ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(0,240,255,0.3)] hover:shadow-[0_4px_25px_rgba(0,240,255,0.5)] hover:scale-105" 
                  : "bg-muted text-muted-foreground opacity-50"
              )}
            >
              {isChatPending ? (
                <Spinner className="h-5 w-5" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </form>
      <p className="mt-3 text-center text-[10px] text-muted-foreground/50 font-medium uppercase tracking-[0.2em]">
        Neon Chat can make mistakes. Check important info.
      </p>
    </div>
  );
}
