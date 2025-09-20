"use client";

import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine } from '@/store/terminalStore';

export default function TerminalInterface() {
  

  return (
    <div className="bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center space-x-2 border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-gray-400 text-xs">
          Terminal — user@RunCode
        </div>
      </div>

      {/* Terminal Content */}
      <div
        className="p-4 h-64 md:h-80 overflow-y-auto bg-gray-900 text-green-400"
      >
       

        {/* Input Line */}
        <form  className="flex items-center">
          <span className="text-green-400 mr-2"></span>
          <input
            type="text"
            className="flex-1 bg-transparent text-white outline-none caret-transparent"
            autoComplete="off"
            spellCheck={false}
            autoFocus
          />
          <span 
            ></span>
        </form>
      </div>
    </div>
  );
}