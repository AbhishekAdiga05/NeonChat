import React from "react";

export function Response({ children }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words">
      {children}
    </div>
  );
}
