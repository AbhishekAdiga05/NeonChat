"use client";

import React, { useState } from "react";
import { Sparkles, Newspaper, Code, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    tabName: "Explore",
    icon: <Newspaper className="h-4 w-4" />,
    messages: [
      "Good books for fans of Rick Rubin",
      "Countries ranked by number of corgis",
      "Most successful companies in the world",
      "How much does Claude cost?",
    ],
  },
  {
    tabName: "Code",
    icon: <Code className="h-4 w-4" />,
    messages: [
      "Write code to invert a binary search tree in Python",
      "What is the difference between Promise.all and Promise.allSettled?",
      "Explain React's useEffect cleanup function",
      "Best practices for error handling in async/await",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Beginner's guide to TypeScript",
      "Explain the CAP theorem in distributed systems",
      "Why is AI so expensive?",
      "Are black holes real?",
    ],
  },
];

function ChatWelcomeTabs({ userName = "John Doe", onMessageSelect }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center px-4 w-full min-h-0 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-full max-w-3xl space-y-10">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-blue-500">
            How can I help you,
          </span>
          <br />
          <span className="text-foreground/90">
            {userName.slice(0, userName.indexOf(" ")) || userName}?
          </span>
        </h1>

        <div className="flex flex-wrap gap-3 w-full">
          {CHAT_TAB_MESSAGE.map((tab, index) => (
            <Button
              key={tab.tabName}
              variant={activeTab === index ? "default" : "outline"}
              onClick={() => setActiveTab(index)}
              className={`flex-1 min-w-[110px] justify-center py-6 rounded-2xl transition-all duration-300 ${
                activeTab === index
                  ? "shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-105 border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-bold"
                  : "hover:scale-105 hover:border-primary/50 hover:bg-sidebar/50 bg-sidebar/30 backdrop-blur-md"
              }`}
            >
              {tab.icon}
              <span className="ml-2 font-semibold">{tab.tabName}</span>
            </Button>
          ))}
        </div>

        <div className="w-full min-h-[200px] bg-card/40 backdrop-blur-2xl rounded-3xl p-4 border border-border/50 shadow-2xl relative overflow-hidden group/container">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10 mix-blend-screen transition-all duration-1000 group-hover/container:bg-primary/10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] -z-10 mix-blend-screen transition-all duration-1000 group-hover/container:bg-blue-500/10" />
          
          <div className="space-y-2 relative z-10">
            {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
              <button
                key={index}
                onClick={() => onMessageSelect(message)}
                className="group flex w-full items-center justify-between p-4 rounded-xl text-left text-sm text-foreground/70 hover:text-foreground transition-all duration-300 ease-out border border-transparent hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:-translate-y-0.5"
              >
                <span className="font-medium">{message}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 text-primary">
                  &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWelcomeTabs;
