"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("SocketProvider: Checking token", !!token);
    
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (socket?.connected) return;

    console.log("SocketProvider: Connecting to", SOCKET_URL);
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("SocketProvider: Connected with id", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("SocketProvider: Connection Error:", err.message);
    });

    setSocket(newSocket);

    // Fetch user info to join user room
    const initUserSocket = async () => {
      try {
        const response = await authApi.me();
        const userId = response.data.id;
        
        if (userId) {
          newSocket.emit("joinUserRoom", { userId });
        }
      } catch (error) {
        console.error("Failed to fetch user for socket:", error);
      }
    };

    initUserSocket();

    // Listen for global notifications
    newSocket.on("notification", (notification: any) => {
      // You can customize this toast based on notification type
      toast(notification.title || "New Notification", {
        description: notification.message || notification.content,
      });
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [pathname]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
