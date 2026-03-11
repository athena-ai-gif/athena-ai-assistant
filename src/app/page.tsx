"use client";
import React, { useState, useEffect, useRef } from 'react';
import { generateResponse } from '@/ai/flows/generate-response';

export default function SweetyChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hiiii! I'm Sweety! 🌸 I'm so happy you're here! How can I make your day special? ✨" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Calling your Firebase Genkit Flow
      const response = await generateResponse({ query: input });
      setMessages((prev) => [...prev, { role: 'assistant', text: response.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', text: "Oh no! My brain feels a bit sleepy. Please check if the API Key is added to Vercel! 🎀" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0D1117] text-white font-sans">
      {/* Sidebar - Desktop Only */}
      <div className="w-72 bg-[#161B22] border-r border-gray-800 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-emerald-500/20">
            S
          </div>
          <h1 className="text-xl font-bold tracking-tight">Athena AI</h1>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Chat Mode</p>
          <div className="bg-[#21262D] p-3 rounded-lg border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Sweety (Active)
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] md:max-w-2xl p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-[#21262D] border border-gray-700 text-gray-100 rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#21262D] p-4 rounded-2xl rounded-tl-none border border-gray-700">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0D1117] via-[#0D1117] to-transparent">
          <div className="max-w-4xl mx-auto flex gap-3 bg-[#161B22] p-2 rounded-2xl border border-gray-700 focus-within:border-emerald-500/50 transition-all shadow-2xl">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Sweety..."
              className="flex-1 bg-transparent p-3 outline-none text-gray-100 placeholder:text-gray-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 text-black font-bold px-6 rounded-xl transition-colors flex items-center justify-center"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-600 mt-4">Athena AI Assistant • Powered by Genkit & Gemini</p>
        </div>
      </div>
    </div>
  );
}
