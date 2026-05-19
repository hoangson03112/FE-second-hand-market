import * as React from "react";
import { useRef, useLayoutEffect, useState } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import ChatBox from "../ChatBox";
import { useChat } from "../../contexts/ChatContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { toggleChat } = useChat() as any;
  const headerRef = useRef<HTMLDivElement>(null);
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
    <div className="box-border m-0 p-0">
      <Header ref={headerRef} />
      <div
        className="bg-gray-50 min-h-screen"
        style={{ marginTop: headerHeight }}
      >
        {children}
      </div>
      <Footer />
      
      {/* Chat Icon Button - TailwindCSS */}
      <span
        onClick={toggleChat}
        className="fixed bottom-[100px] right-[70px] text-[5rem] cursor-pointer z-[1000] text-[#344960] transition-all duration-300 ease-in-out hover:text-[#667eea] hover:scale-110"
      >
        <i className="bi bi-wechat"></i>
      </span>

      <ChatBox />
    </div>
  );
};

export default Layout;
