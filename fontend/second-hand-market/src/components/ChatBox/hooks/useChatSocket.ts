import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage, ChatPartner } from "../types/ChatBox.types";

interface UseChatSocketProps {
  userId: string;
  onMessageReceived: (message: ChatMessage) => void;
  onUserOnline: (userId: string) => void;
  onUserOffline: (userId: string) => void;
}

export const useChatSocket = ({
  userId,
  onMessageReceived,
  onUserOnline,
  onUserOffline,
}: UseChatSocketProps) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    socketRef.current = io("http://localhost:3001", {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection handlers
    socket?.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket?.on("disconnect", (reason: string) => {
      console.log("❌ Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket?.on("connect_error", (error: any) => {
      console.error("❌ Connection error:", error);
      setIsConnected(false);
    });

    socket?.on("reconnect", (attemptNumber: number) => {
      console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
    });

    // Message handlers
    socket?.on("receiveMessage", (message: any) => {
      console.log("📩 Received message:", message);
      onMessageReceived(message);
    });

    // User status handlers
    socket?.on("user-online", (userId: string) => {
      console.log("🟢 User online:", userId);
      onUserOnline(userId);
    });

    socket?.on("user-offline", (userId: string) => {
      console.log("🔴 User offline:", userId);
      onUserOffline(userId);
    });

    // Cleanup
    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("connect_error");
      socket?.off("reconnect");
      socket?.off("receiveMessage");
      socket?.off("user-online");
      socket?.off("user-offline");
      socket?.disconnect();
    };
  }, [userId, onMessageReceived, onUserOnline, onUserOffline]);

  const sendMessage = (message: {
    senderId: string;
    receiverId: string;
    content: string;
    media: any[];
    type: string;
  }) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("sendMessage", message);
      console.log("📤 Sending message:", message);
    } else {
      console.error("❌ Socket not connected. Cannot send message.");
    }
  };

  const deleteMessage = (messageId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("deleteMessage", { messageId });
      console.log("🗑️ Deleting message:", messageId);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    deleteMessage,
  };
};
