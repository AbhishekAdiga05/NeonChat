import { Response } from "@/components/ai-elements/response";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { MessageSquareIcon } from "lucide-react";
import React from "react";

const UserMessage = ({ content }) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card
        className={
          "rounded-lg bg-muted p-2 shadow-none border-none max-w-[80%] wrap-break-word"
        }
      >
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({ content, createdAt, type }) => {
  const formattedDate = createdAt
    ? format(new Date(createdAt), "HH:mm 'on' MMM dd, yyyy")
    : null;

  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === "ERROR" && "text-red-700 dark:text-red-500",
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <MessageSquareIcon className="h-4 w-4" />
        {formattedDate && (
          <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            {formattedDate}
          </span>
        )}
      </div>

      <div className="pl-8.5 flex flex-col gap-y-4">
        <Response>{content}</Response>
      </div>
    </div>
  );
};

const MessageCard = ({ content, type, role, createdAt }) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage content={content} type={type} createdAt={createdAt} />
    );
  }

  return (
    <div className="mt-5">
      <UserMessage content={content} />
    </div>
  );
};

export default MessageCard;
