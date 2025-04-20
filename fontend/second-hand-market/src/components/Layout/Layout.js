import * as React from "react";
import { useState } from "react";
import Header from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { ChatBox } from "../ChatBox/ChatBox";
import "../../../src/styles/theme.css";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChat = () => setIsOpen(!isOpen);
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

      <ChatBox isOpen={isOpen} toggleChat={toggleChat} currentUserId="66f43a1b878581d4a9743ad1" receiverId="67dce27d1b92a5370ca424df"  />
    </div>
  );
};
export default Layout;
