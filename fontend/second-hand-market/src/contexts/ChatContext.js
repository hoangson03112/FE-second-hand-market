import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:2000";
const BASE_URL = `${API_URL}/eco-market`;
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/chat/conversations/findOrCreateWithProduct`,
        {
          productId,
          sellerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/chat/conversations/findOrCreateWithOrder`,
        {
          orderId,
          sellerId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
