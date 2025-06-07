import * as React from "react";
import { useRef, useLayoutEffect, useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { ChatBox } from "../ChatBox/ChatBox";
import "./Layout.css";
import { useChat } from "../../contexts/ChatContext";

const Layout = ({ children }) => {
  const { toggleChat } = useChat();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    let count = 0;
    function updateHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
        console.log('Header height:', headerRef.current.offsetHeight);
      }
      count++;
      if (count < 10) {
        setTimeout(updateHeight, 100);
      }
    }
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div>
      <Header ref={headerRef} />
      <div className="bg-body-secondary " style={{ minHeight: "100vh", marginTop: headerHeight }}>
        {children}
      </div>
      <Footer />
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
