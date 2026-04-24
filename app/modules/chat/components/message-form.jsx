"use client";

import { useMemo, useRef, useState } from "react";
import { Send, Paperclip, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";

import { cn } from "@/lib/utils";
import { useAIModels } from "@/app/modules/ai-agent/hook/ai-agent";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";

export default function MessageForm({
  model,
  chatId,
  input = "",
  handleInputChange,
  handleSubmit,
  isLoading,
}) {
  const { data: models, isPending } = useAIModels();

  const [useWebSearch, setUseWebSearch] = useState(false);
  const [selectedModelOverride, setSelectedModelOverride] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const selectedModel =
    selectedModelOverride ?? model ?? models?.models?.[0]?.id ?? null;
  const hasInput = input.trim().length > 0 || selectedFiles.length > 0;
  const attachmentLabel = useMemo(() => {
    if (selectedFiles.length === 0) {
      return "Attach file";
    }

    if (selectedFiles.length === 1) {
      return selectedFiles[0].name;
    }

    return `${selectedFiles.length} files selected`;
  }, [selectedFiles]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setSelectedFiles((currentFiles) => {
      const existingKeys = new Set(
        currentFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
      );

      const dedupedNewFiles = files.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        return !existingKeys.has(key);
      });

      return [...currentFiles, ...dedupedNewFiles];
    });

    resetFileInput();
  };

  const removeSelectedFile = (fileToRemove) => {
    setSelectedFiles((currentFiles) =>
      currentFiles.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    );
  };

  const onFormSubmit = (e) => {
    if (!hasInput) {
      e?.preventDefault();
      return;
    }

    handleSubmit(e, {
      files: selectedFiles,
      body: {
        chatId,
        model: selectedModel,
        useWebSearch,
      },
    });

    setSelectedFiles([]);
    resetFileInput();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <form onSubmit={onFormSubmit} className="relative group/form">
        {/* Main Input Container - Floating Glassmorphism */}
        <div className={cn(
          "relative rounded-3xl border border-border/50 bg-card/60 backdrop-blur-2xl shadow-2xl transition-all duration-500",
          "focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary/50 focus-within:shadow-[0_0_30px_rgba(0,240,255,0.15)]",
          "hover:border-border group-hover/form:shadow-xl"
        )}>
          {/* File Previews */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
              {selectedFiles.map((file) => (
                <div
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="inline-flex max-w-full items-center gap-2 rounded-xl border border-border/40 bg-background/50 backdrop-blur-md px-3 py-1.5 text-xs animate-in zoom-in duration-300"
                >
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(file)}
                    className="rounded-full p-1 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea */}
          <TextareaAutosize
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            maxRows={8}
            className="w-full resize-none border-0 bg-transparent px-6 py-5 text-base outline-none focus:ring-0 placeholder:text-muted-foreground/60 leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onFormSubmit(e);
              }
            }}
          />

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            onChange={handleFileSelection}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/30">
            {/* Left side tools */}
            <div className="flex items-center gap-2">
              <Button
                disabled={isLoading}
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                onClick={() => fileInputRef.current?.click()}
                title={attachmentLabel}
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseWebSearch(!useWebSearch)}
                className={cn(
                  "h-10 px-3 gap-2 rounded-xl transition-all active:scale-95",
                  useWebSearch 
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]" 
                    : "hover:bg-primary/5 hover:text-primary"
                )}
              >
                <Globe className={cn("h-4 w-4", useWebSearch && "animate-pulse")} />
                <span className="text-xs font-bold uppercase tracking-wider">Search</span>
              </Button>

              <div className="h-6 w-px bg-border/40 mx-1" />

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
              disabled={!hasInput || isLoading}
              className={cn(
                "h-12 w-12 p-0 rounded-2xl transition-all duration-300 active:scale-90",
                hasInput 
                  ? "bg-primary text-primary-foreground shadow-[0_4px_15px_rgba(0,240,255,0.3)] hover:shadow-[0_4px_25px_rgba(0,240,255,0.5)] hover:scale-105" 
                  : "bg-muted text-muted-foreground opacity-50"
              )}
            >
              {isLoading ? (
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
