"use client";

import { useState } from "react";
import { Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { GPTLogo } from "@/components/gpt-logo";
import { Button } from "@/components/ui/button";
import { Send, Plus, Settings } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", role: "assistant", text: "Welcome to Sweety AI Studio. How can I assist you today?" }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), role: "user", text: input }]);
    setInput("");
    // AI logic hum baad mein connect karenge
  };

  return (
    <div className="flex h-screen w-full bg-[#0d1117] text-gray-200">
      {/* Sidebar - Jo aapne banaya hai */}
      <Sidebar conversations={[]} activeId={null} />
      
      <SidebarInset className="flex flex-col">
        {/* Header - Firebase Style */}
        <header className="flex h-14 items-center justify-between border-b border-gray-800 px-4 shrink-0">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div className="h-4 w-[1px] bg-gray-800 mx-2" />
            <GPTLogo className="w-6 h-6" />
            <span className="font-semibold text-sm">Sweety AI / Chat</span>
          </div>
          <Button variant="ghost" size="icon">
            <Settings size={18} />
          </Button>
        </header>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative max-w-[85%] p-4 rounded-xl ${
                  m.role === 'user' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'bg-[#161b22] border border-gray-800 text-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Input Area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent">
          <div className="max-w-3xl mx-auto relative group">
            <textarea 
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Ask Sweety anything..."
              className="w-full bg-[#161b22] border border-gray-800 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none shadow-2xl"
            />
            <Button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-colors"
            >
              <Send size={18} />
            </Button>
          </div>
          <p className="text-[10px] text-center text-gray-500 mt-3">
            Sweety AI can make mistakes. Check important info.
          </p>
        </div>
      </SidebarInset>
    </div>
  );
}
