"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useTerminalStore } from '@/store/terminalStore';

export default function TerminalInput() {
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    executeCommand, 
    isProcessing, 
    commandHistory,
    getCommandSuggestions,
    loadHistoryFromStorage
  } = useTerminalStore();

  // Auto-focus input on mount and load history
  useEffect(() => {
    inputRef.current?.focus();
    loadHistoryFromStorage();
  }, [loadHistoryFromStorage]);

  // Update suggestions when input changes
  useEffect(() => {
    if (input.trim()) {
      const newSuggestions = getCommandSuggestions(input);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [input, getCommandSuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;

    setShowSuggestions(false);
    await executeCommand(input.trim());
    setInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Navigate command history with arrow keys
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setShowSuggestions(false);
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setShowSuggestions(false);
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete command
      if (suggestions.length === 1) {
        setInput(suggestions[0]);
        setShowSuggestions(false);
      } else if (suggestions.length > 1) {
        // Show all suggestions
        setShowSuggestions(true);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex items-center mt-2">
        <span className="text-green-400 mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-white outline-none"
          autoComplete="off"
          spellCheck={false}
          disabled={isProcessing}
        />
        {isProcessing && (
          <span className="text-gray-500 animate-pulse ml-2">Processing...</span>
        )}
      </form>

      {/* Command suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="ml-4 mt-1 text-gray-400 text-xs">
          <div className="flex items-center gap-2">
            <span>Suggestions:</span>
            {suggestions.map((suggestion, index) => (
              <span 
                key={index}
                className="text-blue-400 cursor-pointer hover:text-blue-300"
                onClick={() => {
                  setInput(suggestion);
                  setShowSuggestions(false);
                  inputRef.current?.focus();
                }}
              >
                {suggestion}
              </span>
            ))}
          </div>
          <div className="text-gray-500 mt-0.5">
            Press Tab to autocomplete
          </div>
        </div>
      )}
    </div>
  );
}
