"use client";
import React, { useState } from 'react';

export default function SweetyAI() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hiiii there, sweetie pie! 🌸 It’s so lovely to hear from you! I’m Sweety, and I’m super happy to be here. How can I make your day extra warm and fuzzy today? ✨' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Yahan hum AI ka 'Thinking' state dikha sakte hain
    setTimeout(() => {
      setMessages([...newMessages, { role: 'assistant', content: "Oh, hello there! I'm thinking... (Connect your API for real answers!)" }]);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#1e1e1e] p-4 hidden md:block border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="p-2 bg-emerald-500 rounded-lg text-xs">S</span> Sweety
        </h2>
        <button className="w-full py-2 px-4 border border-gray-700 rounded-md text-left hover:bg-gray-800 transition">+ New Conversation</button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#0070f3] text-white' : 'bg-[#2a2a2a] text-gray-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-6 bg-[#121212]">
          <div className="max-w-3xl mx-auto relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Sweety anything..."
              className="w-full bg-[#2a2a2a] border-none rounded-xl p-4 pr-12 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button onClick={handleSend} className="absolute right-3 top-3 p-2 bg-emerald-500 rounded-lg hover:bg-emerald-600">
              ✈️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
