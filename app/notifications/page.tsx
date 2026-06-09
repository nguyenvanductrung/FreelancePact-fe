"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { NavBar } from "@/components/shared/NavBar";
import { Briefcase, Target, DollarSign, AlertOctagon, Settings, CheckCheck, Bell } from "lucide-react";

// ─── Types & Mock Data ───────────────────────────────────────────────────────

export type NotificationType = "contract" | "milestone" | "payment" | "dispute" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string; // ISO string
  isRead: boolean;
  contractId?: string; // Target URL /contracts/:id
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "payment",
    title: "Payment Received",
    description: "Acme Corp has released $3,125 for Milestone 1.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    contractId: "CTR-2024-892",
  },
  {
    id: "notif-2",
    type: "milestone",
    title: "Milestone Approved",
    description: "Milestone 'Wireframes & Research' was approved by the client.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    contractId: "CTR-2024-892",
  },
  {
    id: "notif-3",
    type: "contract",
    title: "New Contract Offer",
    description: "Startup Inc has sent you a new contract offer.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // Yesterday
    isRead: true,
    contractId: "CTR-2024-893",
  },
  {
    id: "notif-4",
    type: "system",
    title: "System Maintenance",
    description: "FreelancePact will undergo scheduled maintenance on Sunday.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    isRead: true,
  },
  {
    id: "notif-5",
    type: "dispute",
    title: "Dispute Opened",
    description: "A dispute has been opened for contract 'Mobile App MVP'.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(), // Earlier
    isRead: true,
    contractId: "CTR-2024-893",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRelativeTime(isoString: string) {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const date = new Date(isoString);
  const diffInMs = date.getTime() - Date.now();
  const diffInMinutes = Math.round(diffInMs / (1000 * 60));
  const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, "minute");
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, "hour");
  return rtf.format(diffInDays, "day");
}

function getGroupLabel(isoString: string) {
  const date = new Date(isoString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  if (date >= today) return "Today";
  if (date >= yesterday) return "Yesterday";
  if (date >= weekAgo) return "This Week";
  return "Earlier";
}

function getIconForType(type: NotificationType) {
  switch (type) {
    case "contract":
      return <div className="p-2 bg-blue-50 text-blue-500 rounded-full"><Briefcase className="w-5 h-5" /></div>;
    case "payment":
      return <div className="p-2 bg-green-50 text-green-500 rounded-full"><DollarSign className="w-5 h-5" /></div>;
    case "milestone":
      return <div className="p-2 bg-amber-50 text-amber-500 rounded-full"><Target className="w-5 h-5" /></div>;
    case "dispute":
      return <div className="p-2 bg-red-50 text-red-500 rounded-full"><AlertOctagon className="w-5 h-5" /></div>;
    case "system":
    default:
      return <div className="p-2 bg-gray-100 text-gray-500 rounded-full"><Settings className="w-5 h-5" /></div>;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

type FilterTab = "All" | "Contracts" | "Milestones" | "Payments" | "System";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  useEffect(() => {
    // TODO: replace with real API - GET /notifications
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);

  const markAllAsRead = () => {
    // TODO: replace with real API - PATCH /notifications/read-all
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (id: string) => {
    // TODO: replace with real API - PATCH /notifications/:id/read
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n) => {
      if (activeFilter === "Contracts") return n.type === "contract";
      if (activeFilter === "Milestones") return n.type === "milestone";
      if (activeFilter === "Payments") return n.type === "payment";
      if (activeFilter === "System") return ["system", "dispute"].includes(n.type);
      return true;
    });
  }, [notifications, activeFilter]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      Earlier: [],
    };
    filtered.forEach((n) => {
      groups[getGroupLabel(n.timestamp)].push(n);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans">
      <NavBar activePage="Alerts" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">Stay updated on your freelance activity.</p>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.isRead)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 hide-scrollbar">
          {(["All", "Contracts", "Milestones", "Payments", "System"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                activeFilter === tab
                  ? "bg-[#1B2A4A] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List Content */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">You're all caught up! 🎉</h3>
            <p className="text-sm text-gray-500 mt-1">No notifications in this category right now.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {["Today", "Yesterday", "This Week", "Earlier"].map((groupLabel) => {
              const items = grouped[groupLabel];
              if (items.length === 0) return null;

              return (
                <div key={groupLabel}>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    {groupLabel}
                  </h3>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {items.map((item) => {
                      const ContentWrapper = item.contractId ? Link : "div";
                      return (
                        <ContentWrapper
                          key={item.id}
                          href={item.contractId ? `/contracts/${item.contractId}` : "#"}
                          onClick={() => handleNotificationClick(item.id)}
                          className={`flex items-start gap-4 p-4 transition-colors block ${
                            item.isRead ? "bg-white hover:bg-gray-50/50" : "bg-blue-50/20 hover:bg-blue-50/40"
                          }`}
                        >
                          {/* Unread Dot Indicator */}
                          <div className="w-2 flex-shrink-0 flex items-center justify-center mt-2.5">
                            {!item.isRead && <div className="w-2 h-2 rounded-full bg-[#4F6AF5]" />}
                          </div>

                          {/* Icon */}
                          <div className="flex-shrink-0">
                            {getIconForType(item.type)}
                          </div>

                          {/* Body */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <h4 className={`text-sm text-gray-900 ${item.isRead ? "font-medium" : "font-bold"}`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-0.5 leading-snug pr-4">
                              {item.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1.5 font-medium">
                              {getRelativeTime(item.timestamp)}
                            </p>
                          </div>
                        </ContentWrapper>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
