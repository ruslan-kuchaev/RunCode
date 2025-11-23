"use client";

import React, { useState, useEffect } from "react";
import { useTerminalStore } from "@/store/terminalStore";

interface TypedTextProps {
  text: string;
  speed?: number;
  className?: string;
}

function TypedText({ text, speed = 20, className = "" }: TypedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return <span className={className}>{displayedText}</span>;
}

export default function TerminalOutput() {
  const { history } = useTerminalStore();

  const getTextColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "success":
        return "text-green-400";
      case "info":
        return "text-blue-400";
      case "warning":
        return "text-yellow-400";
      case "command":
        return "text-white";
      default:
        return "text-gray-300";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return "✗";
      case "success":
        return "✓";
      case "info":
        return "ℹ";
      case "warning":
        return "⚠";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-1">
      {history.map((entry, index) => (
        <div key={entry.id} className="leading-relaxed animate-fadeIn">
          {entry.type === "command" && (
            <div className="flex items-start">
              <span className="text-green-400 mr-2">$</span>
              <span className="text-white">{entry.command}</span>
            </div>
          )}
          {entry.output && (
            <div
              className={`ml-4 whitespace-pre-wrap ${getTextColor(entry.type)}`}
            >
              {typeof entry.output === "string" ? (
                // Use typing animation only for the last entry
                index === history.length - 1 && entry.output.length < 500 ? (
                  <TypedText
                    text={entry.output}
                    className={getTextColor(entry.type)}
                  />
                ) : (
                  entry.output
                )
              ) : (
                entry.output
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
