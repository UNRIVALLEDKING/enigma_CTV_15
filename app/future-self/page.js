"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, ArrowLeft, Loader2, Database, Zap } from "lucide-react";
import Link from "next/link";
import LoadingTerminal from "@/components/LoadingTerminal";

export default function FutureSelfChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isCached, setIsCached] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("futureTwinProfile");
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      
      // Load LOCAL history for instant access
      const localChatKey = `localChat_${p.name}_${p.age}`;
      const savedLocalMessages = localStorage.getItem(localChatKey);
      if (savedLocalMessages) {
        setMessages(JSON.parse(savedLocalMessages));
        setIsCached(true);
      }

      // Persona-specific chat ID to sync with MongoDB
      const chatIdKey = `chatId_${p.name}_${p.age}`;
      const savedUserId = localStorage.getItem(chatIdKey);
      if (savedUserId) {
        setUserId(savedUserId);
        fetchChatHistory(savedUserId, p);
      } else {
          setIsSyncing(false);
      }
    } else {
        setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChatHistory = async (id, p) => {
    try {
      const res = await fetch(`/api/chat?userId=${id}`);
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
        // Sync local storage
        localStorage.setItem(`localChat_${p.name}_${p.age}`, JSON.stringify(data.messages));
      }
    } catch (err) {
      console.error("Failed to sync history", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    
    // Optimistic local update
    const localChatKey = `localChat_${profile.name}_${profile.age}`;
    localStorage.setItem(localChatKey, JSON.stringify(updatedMessages));
    
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: input,
          profile: profile,
          userId: userId,
        }),
      });
      const data = await res.json();
      
      if (data.response) {
        const aiMsg = { role: "ai", content: data.response, timestamp: new Date() };
        const finalMessages = [...updatedMessages, aiMsg];
        setMessages(finalMessages);
        
        // Final local persistent update
        localStorage.setItem(localChatKey, JSON.stringify(finalMessages));
        
        if (data.userId && !userId) {
          setUserId(data.userId);
          const chatIdKey = `chatId_${profile.name}_${profile.age}`;
          localStorage.setItem(chatIdKey, data.userId);
        }
      }
    } catch (err) {
      console.error("Chat error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSyncing && !isCached) {
    return <LoadingTerminal message="Establishing Temporal Link..." />;
  }

  return (
    <div className="flex h-screen flex-col bg-[#00040d]/50 backdrop-blur-xl">
      {/* Header */}
      <header className="glass flex items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/50 transition-colors hover:text-white">
          <ArrowLeft className="h-5 w-5" />
          <span>Exit Simulation</span>
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold text-primary">Future Self</h1>
          {isCached ? (
             <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-primary/60">
                <Database className="h-3 w-3" />
                Local Neural Sync Active
             </div>
          ) : (
            <span className="text-xs uppercase tracking-widest text-white/30">Temporal Uplink Active</span>
          )}
        </div>
        <div className="w-24 h-8 bg-white/5 rounded-full flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse mr-2" />
            <span className="text-[10px] text-primary/80 font-mono">2035 AD</span>
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-white">Transmission Ready</h2>
            <p className="max-w-md text-white/40">
              Your future self is waiting to connect. Ask about your career, family, or the state of the world in 2035.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex max-w-[80%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center border ${
                msg.role === "user" ? "bg-white/5 border-white/10" : "bg-primary/10 border-primary/20"
              }`}>
                {msg.role === "user" ? <User className="h-5 w-5 text-white/50" /> : <Bot className="h-5 w-5 text-primary" />}
              </div>
              <div className={`rounded-3xl p-4 md:p-6 ${
                msg.role === "user" 
                  ? "bg-white/10 text-white rounded-tr-none" 
                  : "glass text-white/90 rounded-tl-none border-primary/10"
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className="mt-2 text-[10px] text-white/20">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div className="flex justify-start">
             <div className="flex gap-3">
               <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <Loader2 className="h-5 w-5 text-primary animate-spin" />
               </div>
               <div className="glass h-12 w-24 rounded-3xl rounded-tl-none flex items-center justify-center">
                 <div className="flex gap-1">
                   <motion.div className="h-1.5 w-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} />
                   <motion.div className="h-1.5 w-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                   <motion.div className="h-1.5 w-1.5 rounded-full bg-primary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                 </div>
               </div>
             </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-8">
        <form 
          onSubmit={handleSend}
          className="glass relative flex items-center rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary/50"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your future self something..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder:text-white/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-black transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
        <div className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/20">
          Encrypted temporal connection secured
        </div>
      </div>
    </div>
  );
}
