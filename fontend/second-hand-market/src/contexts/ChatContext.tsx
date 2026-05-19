import React, { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../services/ApiService";
const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [openChat, setOpenChat] = useState(false);
  const [selectedUserToShow, setSelectedUserToShow] = useState(null);
  const toggleChat = () => setOpenChat(!openChat);
  useEffect(() => {
    if (!openChat) {
      setSelectedUserToShow(null);
    }
  }, [openChat]);

  const findOrCreateWithProduct = async (productId, sellerId) => {
    try {
      const response = await ApiService.post(
        `/chat/conversations/findOrCreateWithProduct`,
        {
          productId,
          sellerId,
        },
      );

      if (response.data && response.data.success) {
        if (response.data.partner) {
          setSelectedUserToShow({
            _id: response.data.partner._id,
            name: response.data.partner.name,
            avatar: response.data.partner.avatar,
          });
        }
        setOpenChat(true);

        return response.data;
      }
    } catch (error) {
      console.error("Error in findOrCreateWithProduct:", error);
      throw error;
    }
  };

  const findOrCreateWithOrder = async (orderId, sellerId) => {
    try {
      // Token automatically added by ApiService
      const response = await ApiService.post(
        `/chat/conversations/findOrCreateWithOrder`,
        {
          orderId,
          sellerId,
        },
      );

      if (response.data && response.data.success) {
        if (response.data.partner) {
          setSelectedUserToShow({
            _id: response.data.partner._id,
            name: response.data.partner.name,
            avatar: response.data.partner.avatar,
          });
        }
        setOpenChat(true);
        return response.data;
      }
    } catch (error) {
      console.error("Error in findOrCreateWithProduct:", error);
      throw error;
    }
  };
  const contextValue = {
    openChat,
    setOpenChat,
    selectedUserToShow,
    setSelectedUserToShow,
    toggleChat,
    findOrCreateWithProduct,
    findOrCreateWithOrder,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export default ChatContext;
