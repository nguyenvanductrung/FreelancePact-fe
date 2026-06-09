"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { NavBar } from "@/components/shared/NavBar";
import { Search, Send, Paperclip, Download, FileText, Archive, FileImage, ExternalLink } from "lucide-react";
import { ChatMessage } from "@/types";

// ─── Mock Data & Types ────────────────────────────────────────────────────────

const MY_USER_ID = "u-self";

interface Conversation {
  id: string; // Conversation ID (could be same as contractId)
  contractId: string;
  contractName: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  timestamp: string; // ISO
  unreadCount: number;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    contractId: "CTR-2024-892",
    contractName: "Website Redesign",
    partnerId: "u-1",
    partnerName: "Acme Corp",
    partnerAvatar: "AC",
    lastMessage: "I've uploaded the new assets.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    unreadCount: 2,
  },
  {
    id: "conv-2",
    contractId: "CTR-2024-893",
    contractName: "Mobile App MVP",
    partnerId: "u-2",
    partnerName: "Startup Inc",
    partnerAvatar: "SI",
    lastMessage: "Looking good! Let's schedule a call.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unreadCount: 0,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      contractId: "CTR-2024-892",
      senderId: "system",
      senderName: "System",
      type: "system",
      text: "Contract 'Website Redesign' was signed by both parties.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: "msg-2",
      contractId: "CTR-2024-892",
      senderId: "u-1",
      senderName: "Acme Corp",
      senderAvatar: "AC",
      type: "text",
      text: "Hi! We're excited to get started. Do you have the initial wireframes ready?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "msg-3",
      contractId: "CTR-2024-892",
      senderId: MY_USER_ID,
      senderName: "You",
      type: "text",
      text: "Yes, I'm putting the final touches on them now. I'll upload them shortly.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    },
    {
      id: "msg-4",
      contractId: "CTR-2024-892",
      senderId: MY_USER_ID,
      senderName: "You",
      type: "file",
      file: {
        name: "Home_Wireframes_v1.pdf",
        sizeBytes: 2500000,
        url: "#",
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    },
    {
      id: "msg-5",
      contractId: "CTR-2024-892",
      senderId: "u-1",
      senderName: "Acme Corp",
      senderAvatar: "AC",
      type: "text",
      text: "Thanks! I've uploaded the new assets we discussed.",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) return <FileImage className="w-5 h-5 text-blue-500" />;
  if (["zip", "rar", "7z"].includes(ext || "")) return <Archive className="w-5 h-5 text-yellow-600" />;
  return <FileText className="w-5 h-5 text-red-500" />;
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  ["#EDE9FE", "#7C3AED"], // Purple
  ["#D1FAE5", "#059669"], // Emerald
  ["#FEF3C7", "#D97706"], // Amber
  ["#DBEAFE", "#2563EB"], // Blue
];

function Avatar({ initials, id }: { initials: string; id: string }) {
  // Deterministic color based on id length/chars
  const idx = id.charCodeAt(id.length - 1) % AVATAR_COLORS.length;
  const [bg, fg] = AVATAR_COLORS[idx];
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 select-none"
      style={{ backgroundColor: bg, color: fg }}
    >
      {initials}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [search, setSearch] = useState("");
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: replace with real API call - GET /conversations
    setConversations(MOCK_CONVERSATIONS);
    setActiveConvId(MOCK_CONVERSATIONS[0]?.id || null);
  }, []);

  useEffect(() => {
    if (activeConvId) {
      // TODO: replace with real API call - GET /contracts/:contractId/messages
      setMessages(MOCK_MESSAGES[activeConvId] || []);
      
      // Mark as read locally
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, unreadCount: 0 } : c))
      );
    }
  }, [activeConvId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConvId) return;

    // TODO: upgrade to Socket.IO in Phase 2 for real-time sending
    // For now, simulate POST /contracts/:contractId/messages
    const newMsg: ChatMessage = {
      id: `msg-new-${Date.now()}`,
      contractId: activeConv!.contractId,
      senderId: MY_USER_ID,
      senderName: "You",
      type: "text",
      text: inputMsg.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");

    // Update conversation list preview
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? { ...c, lastMessage: newMsg.text!, timestamp: newMsg.createdAt }
          : c
      )
    );
  };

  const filteredConversations = conversations.filter((c) =>
    c.partnerName.toLowerCase().includes(search.toLowerCase()) ||
    c.contractName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] font-sans overflow-hidden">
      <NavBar activePage="Chat" />

      <main className="flex-1 flex max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 h-[calc(100vh-64px)]">
        
        {/* ─── Left Panel: Conversations List ──────────────────────────────── */}
        <div className="w-full md:w-[340px] flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
          {/* Header & Search */}
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F3F4F6] border-0 rounded-lg outline-none focus:ring-2 focus:ring-[#1B2A4A]/30 transition"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6">No conversations found.</p>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-start gap-3 p-4 border-b border-gray-50 transition-colors text-left relative ${
                    activeConvId === conv.id ? "bg-gray-50" : "hover:bg-gray-50/50"
                  }`}
                >
                  {/* Active Indigo Border Indicator */}
                  {activeConvId === conv.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#4F6AF5]" />
                  )}

                  <Avatar initials={conv.partnerAvatar || conv.partnerName.slice(0, 2).toUpperCase()} id={conv.partnerId} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-sm font-semibold text-gray-900 truncate pr-2">
                        {conv.partnerName}
                      </span>
                      <span className="text-[11px] text-gray-400 flex-shrink-0">
                        {formatTime(conv.timestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#4F6AF5] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ─── Right Panel: Message Thread ─────────────────────────────────── */}
        <div className="hidden md:flex flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex-col h-full overflow-hidden">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white z-10">
                <div className="flex items-center gap-3">
                  <Avatar initials={activeConv.partnerAvatar || activeConv.partnerName.slice(0, 2).toUpperCase()} id={activeConv.partnerId} />
                  <div>
                    <h3 className="font-bold text-gray-900">{activeConv.partnerName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                        {activeConv.contractName}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/contracts/${activeConv.contractId}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B2A4A] bg-[#1B2A4A]/5 hover:bg-[#1B2A4A]/10 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Contract
                </Link>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50/30 space-y-4">
                {messages.map((msg) => {
                  if (msg.type === "system") {
                    return (
                      <div key={msg.id} className="flex justify-center my-4">
                        <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isOwn = msg.senderId === MY_USER_ID;

                  return (
                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                        <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                          <span className="text-xs font-medium text-gray-800">{isOwn ? "You" : msg.senderName}</span>
                          <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
                        </div>
                        
                        {msg.type === "text" && (
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isOwn
                                ? "bg-[#1B2A4A] text-white rounded-tr-sm"
                                : "bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                        )}

                        {msg.type === "file" && msg.file && (
                          <div
                            className={`p-3 rounded-2xl border ${
                              isOwn
                                ? "bg-[#1B2A4A] border-[#1B2A4A] text-white rounded-tr-sm"
                                : "bg-white border-gray-200 shadow-sm rounded-tl-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-2">
                              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                {getFileIcon(msg.file.name)}
                              </div>
                              <div className="flex-1 min-w-0 pr-4">
                                <p className={`text-sm font-semibold truncate ${isOwn ? "text-white" : "text-gray-900"}`}>
                                  {msg.file.name}
                                </p>
                                <p className={`text-[11px] ${isOwn ? "text-gray-300" : "text-gray-500"}`}>
                                  {formatBytes(msg.file.sizeBytes)}
                                </p>
                              </div>
                              <button
                                className={`p-2 rounded-full transition-colors ${
                                  isOwn
                                    ? "bg-white/20 hover:bg-white/30 text-white"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                                }`}
                                aria-label="Download file"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    aria-label="Attach file"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-[#F3F4F6] border-0 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#1B2A4A]/30 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputMsg.trim()}
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#1B2A4A" }}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-gray-300" />
              </div>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
