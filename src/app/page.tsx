"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Bot, Plus, Search, Trash2, User, Send, Loader2, Menu, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { generateResponse } from "@/ai/flows/generate-response";

// Simple UI Components integrated to avoid "Module Not Found"
const Button = ({ className, variant, size, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";
  const variants: any = {
    ghost: "hover:bg-accent hover:text-accent-foreground",
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    outline: "border border-input bg-background hover:bg-accent",
  };
  return <button className={`${baseStyles} ${variants[variant || 'primary']} ${className}`} {...props} />;
};

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("sweety_chats");
    if (saved) {
      const parsed = JSON.parse(saved);
      setConversations(parsed);
      if (parsed.length > 0) setActiveId(parsed[0].id);
    } else {
      createNewChat();
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem("sweety_chats", JSON.stringify(conversations));
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversations]);

  const createNewChat = () => {
    const newChat = { id: uuidv4(), title: "New Chat", messages: [], createdAt: new Date() };
    setConversations([newChat, ...conversations]);
    setActiveId(newChat.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { id: uuidv4(), role: 'user', text: inputValue };
    const currentId = activeId;

    setConversations(prev => prev.map(c => 
      c.id === currentId ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length === 0 ? inputValue.slice(0, 20) : c.title } : c
    ));
    
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await generateResponse({ query: userMsg.text });
      const aiMsg = { id: uuidv4(), role: 'assistant', text: response.text };
      setConversations(prev => prev.map(c => 
        c.id === currentId ? { ...c, messages: [...c.messages, aiMsg] } : c
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeChat = conversations.find(c => c.id === activeId);

  return (
    <div className="flex h-screen bg-[#0d1117] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-[#161b22] border-r border-gray-800 flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <Bot size={24} /> <span>Sweety AI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={createNewChat}><Plus size={20}/></Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(c => (
            <div 
              key={c.id} 
              onClick={() => setActiveId(c.id)}
              className={`p-3 rounded-lg cursor-pointer flex items-center justify-between group ${activeId === c.id ? 'bg-[#21262d]' : 'hover:bg-[#21262d]/50'}`}
            >
              <span className="truncate text-sm">{c.title}</span>
              <Trash2 size={14} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400" 
                onClick={(e) => { e.stopPropagation(); setConversations(conversations.filter(chat => chat.id !== c.id)); }} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        <header className="p-4 border-b border-gray-800 flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          <h1 className="font-semibold">{activeChat?.title || "New Conversation"}</h1>
        </header>

        {/* Chat Area */}
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {activeChat?.messages.map((m: any) => (
            <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${m.role === 'user' ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                {m.role === 'user' ? <User size={16}/> : <Bot size={16}/>}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl ${m.role === 'user' ? 'bg-emerald-600/10 border border-emerald-600/20' : 'bg-[#161b22] border border-gray-800'}`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-pulse">
              <div className="p-2 rounded-full bg-gray-700 h-8 w-8 flex items-center justify-center"><Bot size={16}/></div>
              <div className="bg-[#161b22] p-4 rounded-2xl border border-gray-800"><Loader2 className="animate-spin text-emerald-500" size={18}/></div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 bg-gradient-to-t from-[#0d1117] via-[#0d1117] to-transparent">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative">
            <textarea
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Message Sweety..."
              className="w-full bg-[#161b22] border border-gray-700 rounded-xl py-4 pl-4 pr-14 focus:outline-none focus:border-emerald-500 transition-all resize-none overflow-hidden"
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
            />
            <button type="submit" disabled={!inputValue.trim() || isLoading} className="absolute right-3 bottom-3 p-2 bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:bg-gray-700 transition-all">
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[10px] text-gray-500 mt-2">Athena AI Assistant • Powered by Genkit & Gemini</p>
        </div>
      </div>
    </div>
  );
}
