import { useState, useCallback, useEffect } from "react";
import { ChatMessage } from "../types/ChatBox.types";
import ApiService from "../../../services/ApiService";

export const useChatMessages = (selectedUserId: string | null, currentUserId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Fetch messages when user is selected
  useEffect(() => {
    if (!selectedUserId || !currentUserId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const response = await ApiService.get(
          `/conversations/${currentUserId}/${selectedUserId}/messages`
        );

        const processedMessages = response.data.data.map((message: any) => {
          const media = message.media || [];
          return {
            ...message,
            media: media.map((item: any) => ({
              id: item._id || Date.now() + Math.random(),
              type: item.type || "application/octet-stream",
              url: item.url || "",
              name: item.name || "",
              _id: item._id,
            })),
          };
        });

        setMessages(processedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUserId, currentUserId]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  }, []);

  const updateMessage = useCallback((messageId: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, ...updates } : msg))
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoadingMessages,
    addMessage,
    removeMessage,
    updateMessage,
    clearMessages,
  };
};
