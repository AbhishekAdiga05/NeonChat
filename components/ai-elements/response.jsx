import React from "react";

const normalizeLine = (line) => {
  let cleaned = line;

  // Strip common markdown markers so output reads like plain chat text.
  cleaned = cleaned.replace(/^\s{0,3}#{1,6}\s*/g, "");
  cleaned = cleaned.replace(/^\s*[-*+]\s+/g, "");
  cleaned = cleaned.replace(/^\s*\d+\.\s+/g, "");
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, "$1");
  cleaned = cleaned.replace(/__(.*?)__/g, "$1");
  cleaned = cleaned.replace(/`([^`]*)`/g, "$1");

  return cleaned.trimEnd();
};

export function Response({ children }) {
  const content =
    typeof children === "string" ? children : String(children ?? "");
  const lines = content.split(/\r?\n/).map(normalizeLine);

  return (
    <div className="max-w-none rounded-xl border bg-card/60 px-4 py-3 text-sm leading-7 shadow-sm">
      <div className="space-y-2 whitespace-pre-wrap wrap-break-word text-foreground/95">
        {lines.map((line, index) => (
          <p key={`line-${index}`} className="m-0">
            {line || " "}
          </p>
        ))}
      </div>
    </div>
  );
}
