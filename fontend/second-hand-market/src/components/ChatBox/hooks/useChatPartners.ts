import { useState, useEffect, useCallback } from "react";
import { ChatPartner } from "../types/ChatBox.types";
import ApiService from "../../../services/ApiService";

export const useChatPartners = (currentUserId: string) => {
  const [chatPartners, setChatPartners] = useState<ChatPartner[]>([]);
  const [isLoadingPartners, setIsLoadingPartners] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch chat partners
  useEffect(() => {
    if (!currentUserId) return;

    const fetchChatPartners = async () => {
      setIsLoadingPartners(true);
      try {
        const response = await ApiService.get(`/conversations/${currentUserId}`);
        const conversations = response.data.data || [];

        const partners = conversations.map((conv: any) => {
          const partner = conv.participants?.find(
            (p: any) => p._id !== currentUserId
          );
          return {
            _id: partner?._id || "",
            fullName: partner?.fullName || "Unknown",
            avatar: partner?.avatar,
            isOnline: false,
            lastMessage: conv.lastMessage?.content || "",
            lastMessageTime: conv.lastMessage?.timestamp || conv.updatedAt,
            unreadCount: 0,
          };
        });

        setChatPartners(partners);
      } catch (error) {
        console.error("Error fetching chat partners:", error);
        setChatPartners([]);
      } finally {
        setIsLoadingPartners(false);
      }
    };

    fetchChatPartners();
  }, [currentUserId]);

  const updatePartnerStatus = useCallback((userId: string, isOnline: boolean) => {
    setChatPartners((prev) =>
      prev.map((partner) =>
        partner._id === userId ? { ...partner, isOnline } : partner
      )
    );
  }, []);

  const updatePartnerLastMessage = useCallback(
    (partnerId: string, message: string, timestamp: string | Date | number) => {
      setChatPartners((prev) => {
        const updated = prev.map((partner) =>
          partner._id === partnerId
            ? { ...partner, lastMessage: message, lastMessageTime: timestamp }
            : partner
        );
        // Move updated partner to top
        const updatedPartner = updated.find((p) => p._id === partnerId);
        const others = updated.filter((p) => p._id !== partnerId);
        return updatedPartner ? [updatedPartner, ...others] : updated;
      });
    },
    []
  );

  const filteredPartners = chatPartners.filter((partner) =>
    partner.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    chatPartners: filteredPartners,
    isLoadingPartners,
    searchQuery,
    setSearchQuery,
    updatePartnerStatus,
    updatePartnerLastMessage,
  };
};
