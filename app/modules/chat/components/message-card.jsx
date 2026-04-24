import { Response } from "@/components/ai-elements/response";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { MessageSquareIcon, PaperclipIcon } from "lucide-react";
import React from "react";

const AttachmentList = ({ attachments = [] }) => {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <a
          key={`${attachment.url}-${index}`}
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs hover:bg-background"
        >
          <PaperclipIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-48">
            {attachment.filename || "Attachment"}
          </span>
        </a>
      ))}
    </div>
  );
};

const UserMessage = ({ content, attachments }) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card
        className={
          "rounded-lg bg-muted p-2 shadow-none border-none max-w-[80%] wrap-break-word"
        }
      >
        <div className="flex flex-col gap-2">
          {content ? <div>{content}</div> : null}
          <AttachmentList attachments={attachments} />
        </div>
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

const MessageCard = ({ content, type, role, createdAt, attachments = [] }) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage content={content} type={type} createdAt={createdAt} />
    );
  }

  return (
    <div className="mt-5">
      <UserMessage content={content} attachments={attachments} />
    </div>
  );
};

export default MessageCard;
