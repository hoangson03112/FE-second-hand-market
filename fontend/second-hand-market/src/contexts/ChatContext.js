import React, { createContext, useContext } from 'react';
import axios from "axios";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  // Các phương thức API
  const getChat = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return { message: "Chưa đăng nhập", status: 401 };
      }

      const response = await axios.get(
        "http://localhost:2000/eco-market/messages",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Trả về dữ liệu JSON từ server
    } catch (error) {
      console.error("Error fetching data:", error);
      return { message: "Đã xảy ra lỗi khi xác thực.", status: 500 };
    }
  };

  // Các giá trị và phương thức để cung cấp thông qua context
  const contextValue = {
    getChat
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
