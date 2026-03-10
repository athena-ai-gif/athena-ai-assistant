"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Bot, Plus, Search, Trash2, User, X, Send, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { Conversation, Message } from "@/lib/types";
import { generateResponse, type GenerateResponseInput } from "@/ai/flows/generate-response";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { GptLogo } from "@/components/gpt-logo";
import { SettingsDialog, SUPPORTED_VOICES } from "@/components/settings-dialog";
import { useToast } from "@/hooks/use-toast";

type ScrollAreaRef = React.ElementRef<typeof ScrollArea>;

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [voice, setVoice] = useState("algenib");
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();
  const scrollAreaRef = useRef<ScrollAreaRef>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleNewConversation = (setActive = true) => {
    const newConversation: Conversation = {
      id: uuidv4(),
      title: "New Conversation",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setConversations(prev => [newConversation, ...prev]);
    if (setActive) {
      setActiveConversationId(newConversation.id);
    }
    return newConversation;
  };

  useEffect(() => {
    let loadedConvos: Conversation[] = [];
    try {
      const storedConversations = localStorage.getItem("Sweety-conversations");
      if (storedConversations) {
        const parsed = JSON.parse(storedConversations);
        if (Array.isArray(parsed)) {
            loadedConvos = parsed as Conversation[];
        }
      }
    } catch (error) {
      console.error("Failed to parse conversations from local storage:", error);
    }
    
    if (loadedConvos.length > 0) {
      const sortedConvos = loadedConvos.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setConversations(sortedConvos);
      setActiveConversationId(sortedConvos[0].id);
    } else {
      handleNewConversation();
    }

    const storedVoice = localStorage.getItem("Sweety-voice");
    if (storedVoice && SUPPORTED_VOICES.map(v => v.toLowerCase()).includes(storedVoice.toLowerCase())) {
        setVoice(storedVoice);
    } else {
        const defaultVoice = "algenib";
        setVoice(defaultVoice);
        localStorage.setItem("Sweety-voice", defaultVoice);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (conversations.length > 0) {
        localStorage.setItem("Sweety-conversations", JSON.stringify(conversations));
      } else {
        localStorage.removeItem("Sweety-conversations");
      }
    } catch (error) {
      console.error("Failed to save conversations to local storage:", error);
    }
  }, [conversations]);

  useEffect(() => {
    if (scrollAreaRef.current?.viewport) {
      scrollAreaRef.current.viewport.scrollTo({
        top: scrollAreaRef.current.viewport.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [conversations, activeConversationId, isLoading]);


  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId);
  }, [conversations, activeConversationId]);
  
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [conversations, searchTerm]);

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => {
        const remaining = prev.filter(c => c.id !== id);
        if (activeConversationId === id) {
            if (remaining.length > 0) {
                const sorted = remaining.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setActiveConversationId(sorted[0].id);
            } else {
                setActiveConversationId(null);
            }
        }
        return remaining;
    });
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || cooldown > 0) return;
  
    let currentConversationId = activeConversationId;
    let isNewConversation = false;
  
    if (!currentConversationId || !activeConversation || activeConversation.messages.length === 0) {
      const newConvo = handleNewConversation();
      currentConversationId = newConvo.id;
      isNewConversation = true;
    }
  
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      text: messageText.trim(),
    };
  
    setConversations(prev =>
      prev.map(c =>
        c.id === currentConversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              title: isNewConversation ? messageText.substring(0, 30) : c.title,
            }
          : c
      )
    );
    
    setInputValue('');
    setIsLoading(true);
  
    try {
      const response = await generateResponse({
        query: messageText.trim(),
      });
  
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        text: response.text,
      };
  
      setConversations(prev =>
        prev.map(c =>
          c.id === currentConversationId
            ? { ...c, messages: [...c.messages, assistantMessage] }
            : c
        )
      );
    } catch (error: any) {
      console.error('AI Error:', error);
      
      if (error.message && error.message.includes('429')) {
        const retryMatch = error.message.match(/Please retry in (\d+\.?\d*)/);
        const retrySeconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;
        setCooldown(retrySeconds);
        toast({
          variant: 'destructive',
          title: 'Rate Limit Exceeded',
          description: `You've made too many requests. Please wait ${retrySeconds} seconds.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'An unexpected error occurred. Please try again.',
        });
      }
  
      setConversations(prev =>
        prev.map(c =>
          c.id === currentConversationId
            ? { ...c, messages: c.messages.filter(m => m.id !== userMessage.id) }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const isInputDisabled = isLoading || cooldown > 0;

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar variant="sidebar" collapsible="icon" className="bg-sidebar">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <GptLogo className="size-8 text-primary" />
              <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                Sweety
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="group-data-[collapsible=icon]:hidden"
              onClick={() => handleNewConversation()}
            >
              <Plus />
            </Button>
          </SidebarHeader>
          <SidebarContent>
            <div className="relative p-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 bg-background/50 focus-visible:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <SidebarMenu className="p-2">
              {filteredConversations.map((convo) => (
                <SidebarMenuItem key={convo.id} className="group/item">
                  <SidebarMenuButton
                    onClick={() => setActiveConversationId(convo.id)}
                    isActive={activeConversationId === convo.id}
                    className="truncate"
                  >
                    {convo.title}
                  </SidebarMenuButton>
                   <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 size-7 opacity-0 group-hover/item:opacity-100 group-data-[collapsible=icon]:hidden"
                      onClick={() => handleDeleteConversation(convo.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SettingsDialog voice={voice} setVoice={setVoice} />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col max-h-screen">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="md:hidden"/>
              <h2 className="text-lg font-semibold">
                {activeConversation?.title || "Sweety AI Assistant"}
              </h2>
            </div>
          </header>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" viewportRef={scrollAreaRef}>
              <div className="p-4 md:p-6 space-y-6">
                {activeConversation && activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start gap-4",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "assistant" && (
                        <AvatarIcon>
                          <Bot className="text-primary" />
                        </AvatarIcon>
                      )}
                      <div
                        className={cn(
                          "max-w-prose rounded-lg p-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </div>
                      {message.role === "user" && (
                        <AvatarIcon>
                          <User />
                        </AvatarIcon>
                      )}
                    </div>
                  ))
                ) : (
                  null
                )}
                {isLoading && (
                  <div className="flex items-start gap-4">
                     <AvatarIcon>
                        <Bot className="text-primary" />
                      </AvatarIcon>
                      <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                         <Loader2 className="size-4 animate-spin text-primary" />
                         <span className="text-sm text-muted-foreground">Sweety is thinking...</span>
                      </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleFormSubmit} className="relative">
              <Textarea
                placeholder={cooldown > 0 ? `Rate limit exceeded. Please wait ${cooldown}s...` : "Ask Sweety anything..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleFormSubmit(e);
                  }
                }}
                className="pr-24 min-h-[48px] resize-none"
                disabled={isInputDisabled}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <Button
                  type="submit"
                  size="icon"
                  disabled={isInputDisabled || !inputValue.trim()}
                >
                  <Send className="size-5" />
                </Button>
              </div>
            </form>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-shrink-0 size-8 flex items-center justify-center rounded-full bg-muted border">
    {children}
  </div>
);
