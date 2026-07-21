"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "@/constants";
import { authApi } from "@/lib/api";

const notificationApi = {
  async list(page: number, limit: number) {
    const response = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to load notifications");
    }
    return { data: await response.json() };
  },
  async markAsRead(id: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
  },
  async markAllAsRead() {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }
  },
};

export type NotificationType = "contract" | "milestone" | "payment" | "dispute" | "system";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  contractId?: string;
}

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function normalizeNotification(payload: any): NotificationItem {
  const rawType = String(payload?.type ?? "system");
  const typeMap: Record<string, NotificationType> = {
    MILESTONE_SUBMITTED: "milestone",
    MILESTONE_APPROVED: "milestone",
    MILESTONE_REJECTED: "milestone",
    CONTRACT_SIGNED: "contract",
    PAYMENT_RELEASED: "payment",
    DISPUTE_OPENED: "dispute",
  };

  const type = typeMap[rawType] ?? "system";
  const metadata = payload?.metadata ?? {};

  return {
    id: payload?.id ?? `${Date.now()}`,
    type,
    title: payload?.title ?? "Bạn có thông báo mới",
    description: payload?.body ?? payload?.description ?? "Một sự kiện mới vừa xảy ra.",
    timestamp: payload?.createdAt ?? new Date().toISOString(),
    isRead: Boolean(payload?.isRead),
    contractId: metadata?.contractId ?? payload?.contractId,
  };
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);

  const refreshNotifications = async () => {
    try {
      const res = await notificationApi.list(1, 20);
      const items = (res.data ?? []).map(normalizeNotification);
      setNotifications(items);
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const socketBaseUrl = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    const socketInstance = io(socketBaseUrl, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token: accessToken },
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      authApi
        .me()
        .then((res) => {
          const userId = res.data?.id;
          if (userId) {
            socketInstance.emit("joinUserRoom", { userId });
          }
        })
        .catch((error) => console.error("Failed to resolve current user", error));
    });

    socketInstance.on("disconnect", () => setIsConnected(false));
    socketInstance.on("connect_error", () => setIsConnected(false));
    socketInstance.on("notification", (payload: any) => {
      const item = normalizeNotification(payload);
      setNotifications((prev) => [item, ...prev].slice(0, 30));

      const toastOptions = {
        description: item.description,
        action: {
          label: "Xem",
          onClick: () => {
            if (item.contractId) {
              window.location.assign(`/contracts/${item.contractId}`);
            } else {
              window.location.assign("/notifications");
            }
          },
        },
      } as const;

      if (item.type === "milestone") {
        toast.success(item.title, toastOptions);
      } else if (item.type === "payment") {
        toast.success(item.title, toastOptions);
      } else if (item.type === "dispute") {
        toast.warning(item.title, toastOptions);
      } else {
        toast.info(item.title, toastOptions);
      }
    });

    refreshNotifications().catch(() => undefined);

    return () => {
      socketInstance.disconnect();
      setSocket(null);
    };
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isConnected,
      markAsRead,
      markAllAsRead,
      refreshNotifications,
    }),
    [notifications, unreadCount, isConnected]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
