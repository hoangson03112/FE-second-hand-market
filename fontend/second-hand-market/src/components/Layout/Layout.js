import * as React from "react";
import { useState } from "react";
import Header from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { ChatBox } from "../ChatBox/ChatBox";
import "./Layout.css";
import { useChat } from "../../contexts/ChatContext";

const Layout = ({ children }) => {
  const { openChat, toggleChat } = useChat();

  return (
    <div>
      <Header />
      <div className="bg-body-secondary mt-0" style={{ minHeight: "100vh" }}>
        {children}
      </div>
      <span
        onClick={toggleChat}
        className="position-fixed bottom-0 end-0 m-5 icon-primary"
        style={{ fontSize: "5rem" }}
      >
        <i className="bi bi-wechat"></i>
      </span>

      <ChatBox />
    </div>
  );
};
export default Layout;
