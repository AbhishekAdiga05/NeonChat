"use client";

import { useState, useEffect } from "react";
import { Send, Paperclip, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";
import { useAIModels } from "@/app/modules/ai-agent/hook/ai-agent";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function MessageForm({
  model,
  chatId,
  input = "",
  handleInputChange,
  handleSubmit,
  isLoading,
}) {
  const { data: models, isPending, error } = useAIModels();

  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useMicrophone, setUseMicrophone] = useState(false);
  const [selectedModel, setSelectedModel] = useState(model ?? null);

  // Sync when the chat's stored model arrives from React Query
  useEffect(() => {
    if (model && !selectedModel) {
      setSelectedModel(model);
    }
  }, [model, selectedModel]);

  const onFormSubmit = (e) => {
    if (!input.trim()) {
      e.preventDefault();
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form onSubmit={onFormSubmit} className="relative">
        {/* Main Input Container */}
        <div className="relative rounded-2xl border border-border shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {/* Textarea */}
          <TextareaAutosize
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            maxRows={6}
            className="w-full resize-none border-0 bg-transparent px-4 py-3 text-base outline-none focus:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onFormSubmit(e);
              }
            }}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t">
            {/* Left side tools */}
            <div className="flex items-center gap-1">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Attach file"
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>

              <Button
                type="button"
                variant={useWebSearch ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setUseWebSearch(!useWebSearch)}
                aria-pressed={useWebSearch}
                aria-label="Toggle web search"
                title="Toggle web search"
                className={cn(
                  "h-8 px-2 gap-1",
                  useWebSearch && "ring-2 ring-ring/40",
                )}
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs">Search</span>
              </Button>

              {isPending ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                  className="ml-1"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!input.trim()}
              size="sm"
              variant={input.trim() ? "default" : "ghost"}
              className="h-8 w-8 p-0 rounded-full"
              aria-label="Send message"
              title={
                input.trim() ? "Send message" : "Enter a message to enable"
              }
            >
              {isLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
