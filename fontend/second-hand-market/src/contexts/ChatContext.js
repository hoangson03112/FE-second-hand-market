import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [openChat, setOpenChat] = useState(false);

  const contextValue = {
    openChat,
    setOpenChat,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

export default ChatContext;
