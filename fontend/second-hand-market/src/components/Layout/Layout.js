import * as React from "react";
import { useRef, useLayoutEffect, useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { ChatBox } from "../ChatBox/ChatBox";
import "./Layout.css";
import { useChat } from "../../contexts/ChatContext";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  const { toggleChat } = useChat();
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    let count = 0;
    function updateHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
      count++;
      if (count < 10) {
        setTimeout(updateHeight, 100);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div>
      <Header ref={headerRef} />
      <div
        className="bg-body-secondary "
        style={{ minHeight: "100vh", marginTop: headerHeight }}
      >
        {children}
      </div>
      <Footer />
      <Box
        component="span"
        onClick={toggleChat}
        sx={{
          position: "fixed",
          bottom: "100px",
          right: "70px",
          fontSize: "5rem",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <i className="bi bi-wechat"></i>
      </Box>

      <ChatBox />
    </div>
  );
};
export default Layout;
