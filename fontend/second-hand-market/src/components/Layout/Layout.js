import * as React from "react";
import { useState } from "react";
import Header from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { ChatBox } from "../ChatBox/ChatBox";

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
        className=" position-fixed bottom-0 end-0 m-5 "
        style={{ fontSize: "5rem" }}
      >
        <i class="bi bi-wechat"></i>
      </span>

      <ChatBox isOpen={isOpen} toggleChat={toggleChat} />
    </div>
  );
};
export default Layout;
