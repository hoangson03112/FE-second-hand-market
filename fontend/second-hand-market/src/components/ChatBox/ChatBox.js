import React, { useRef, useEffect, useState } from "react";
import {
  Send,
  Close,
  Search,
  AttachFile,
  Image,
  VideoLibrary,
  InsertDriveFile,
  Delete,
  ZoomIn,
  ZoomOut,
  ArrowBack,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Badge,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Typography,
  Chip,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  CircularProgress,
  Zoom,
  Fade,
  Modal,
} from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { io } from "socket.io-client";
import AccountContext from "../../contexts/AccountContext";
import axios from "axios";
import { useChat } from "../../contexts/ChatContext";
import ImageMessage from "./MessageTypes/ImageMessage";
import VideoMessage from "./MessageTypes/VideoMessage";
import FileMessage from "./MessageTypes/FileMessage";
import OrderMessage from "./MessageTypes/OrderMessage";
import ProductMessage from "./MessageTypes/ProductMessage";

// Thêm các keyframes cho các animations
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(50, 65, 85, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(50, 65, 85, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(50, 65, 85, 0);
  }
`;

const typing = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const bubbleIn = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -300px 0;
  }
  100% {
    background-position: 300px 0;
  }
`;

// Thêm các styled-components cho các phần khác mà trước đây dùng CSS
const MessageContainerBox = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  maxHeight: "100%",
  height: "100%",
  background: "#f8f9fa",
  scrollBehavior: "smooth",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    background:
      "linear-gradient(180deg, rgba(248, 249, 250, 0.95) 0%, rgba(248, 249, 250, 0) 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },
  "&::-webkit-scrollbar": {
    width: 5,
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(248, 249, 250, 0.2)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(50, 65, 85, 0.15)",
    borderRadius: 10,
    border: "2px solid rgba(248, 249, 250, 0.2)",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(50, 65, 85, 0.25)",
  },
}));

const ChatBoxBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: 20,
  right: 20,
  zIndex: 1000,
  cursor: "default",
  width: "900px", // Cố định desktop
  height: "600px", // Cố định desktop
  maxWidth: "calc(100% - 40px)",
  maxHeight: "calc(100vh - 40px)",
  animation: `${slideUp} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
  filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))",
  [theme.breakpoints.down("sm")]: {
    width: "95%",
    height: "70vh",
    minWidth: 0,
    minHeight: 0,
  },
}));

const EmptyStateBox = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  padding: 32,
  textAlign: "center",
  background: "rgba(255, 255, 255, 0.5)",
  backdropFilter: "blur(10px)",
  borderRadius: 12,
  margin: "20px",
  border: "1px solid rgba(230, 230, 230, 0.7)",
  boxShadow: "0 3px 12px rgba(0, 0, 0, 0.04)",
}));

const EmptyStateImage = styled("img")(() => ({
  width: 110,
  marginBottom: 20,
  opacity: 0.8,
  filter: "grayscale(20%)",
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-3px)",
    filter: "grayscale(0%)",
  },
}));

const TypingIndicatorBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  marginBottom: 8,
  padding: "6px 14px",
  background: "rgba(255, 255, 255, 0.7)",
  borderRadius: 12,
  backdropFilter: "blur(8px)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
  border: "1px solid rgba(222, 226, 230, 0.7)",
  width: "fit-content",
}));

const TypingDot = styled("span")(({ delay }) => ({
  height: 6,
  width: 6,
  backgroundColor: "#435366",
  borderRadius: "50%",
  display: "inline-block",
  margin: "0 2px",
  opacity: 0.6,
  animation: `${typing} 1.5s infinite ease-in-out`,
  animationDelay: delay,
}));

const AITypingIndicator = styled(Box)(() => ({
  background: "rgba(242, 244, 247, 0.9)",
  padding: "10px 16px",
  borderRadius: 16,
  borderBottomLeftRadius: 4,
  display: "inline-flex",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(222, 226, 230, 0.7)",
  backdropFilter: "blur(8px)",
}));

const AITypingDot = styled("span")(({ delay }) => ({
  height: 6,
  width: 6,
  background: "#435366",
  borderRadius: "50%",
  display: "inline-block",
  margin: "0 3px",
  opacity: 0.6,
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  animation: `${typing} 1.5s infinite ease-in-out`,
  animationDelay: delay,
}));

const DateDividerSpan = styled("span")(() => ({
  background: "rgba(50, 65, 85, 0.03)",
  padding: "4px 12px",
  borderRadius: 8,
  fontSize: "0.75rem",
  color: "#324155",
  fontWeight: 500,
  letterSpacing: "0.01em",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
  border: "1px solid rgba(230, 230, 230, 0.7)",
  backdropFilter: "blur(8px)",
}));

const FullscreenModalBox = styled("div")(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(249, 250, 251, 0.98)",
  backdropFilter: "blur(16px)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const FullscreenImage = styled("img")(({ zoomLevel }) => ({
  maxWidth: "100%",
  maxHeight: "80vh",
  objectFit: "contain",
  transform: `scale(${zoomLevel})`,
  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  userSelect: "none",
  borderRadius: 8,
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
}));

const StyledChatCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 10px 35px rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  background: "rgba(252, 252, 252, 0.97)",
  backdropFilter: "blur(10px)",
  fontFamily: '"Inter", Roboto, Arial, sans-serif',
  border: "1px solid rgba(230, 230, 230, 0.7)",
}));

const SidebarBox = styled(Box)(({ theme }) => ({
  background: "#f8f9fa",
  borderRight: "1px solid rgba(230, 230, 230, 0.7)",
  borderTopLeftRadius: 12,
  borderBottomLeftRadius: 12,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(180deg, rgba(50, 65, 85, 0.01) 0%, rgba(50, 65, 85, 0.03) 100%)",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    pointerEvents: "none",
  },
}));

// Tạo một component chung cho card chat (dùng cho cả AIBox và user)
function ChatCardItem({
  avatar,
  name,
  subtitle,
  chipLabel,
  selected,
  onClick,
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        minHeight: 64,
        padding: "10px 16px",
        margin: "5px 8px",
        borderRadius: 2,
        background: selected
          ? "rgba(50, 65, 85, 0.06)"
          : "rgba(255, 255, 255, 0.5)",
        boxShadow: selected
          ? "0 2px 6px rgba(0, 0, 0, 0.04)"
          : "0 1px 2px rgba(0, 0, 0, 0.01)",
        border: selected
          ? "1px solid rgba(50, 65, 85, 0.1)"
          : "1px solid rgba(230, 230, 230, 0.6)",
        transition: "all 0.2s",
        "&:hover": {
          background: "rgba(50, 65, 85, 0.04)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          transform: "translateY(-1px)",
        },
      }}
    >
      <Avatar
        src={avatar}
        alt={name}
        sx={{ width: 45, height: 45, mr: 2, background: "#324155", p: 0.5 }}
      />
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "#324155",
            display: "flex",
            alignItems: "center",
          }}
        >
          {name}
          {chipLabel && (
            <Chip
              label={chipLabel}
              size="small"
              sx={{
                ml: 1,
                height: 20,
                fontSize: "0.7rem",
                bgcolor: "#324155",
                color: "#fff",
              }}
            />
          )}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#666", fontSize: "0.85rem" }}
          noWrap
        >
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

// Khôi phục lại các styled-components cần thiết cho các phần khác của file:
const StyledAvatar = styled(Avatar)(({ theme, isonline }) => ({
  width: 45,
  height: 45,
  border: isonline === "true" ? "2px solid #4a9f82" : "2px solid #e0e0e0",
  boxShadow:
    isonline === "true"
      ? "0 0 0 2px rgba(74, 159, 130, 0.15)"
      : "0 0 0 1px rgba(220, 220, 220, 0.4)",
  transition: "all 0.2s",
  background: "linear-gradient(135deg, #f4f6f8 0%, #ffffff 100%)",
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  left: 10,
  top: "50%",
  transform: "translateY(-50%)",
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.15)",
  color: "#fff",
  zIndex: 5,
  display: { xs: "flex", sm: "none" },
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.25)",
  },
}));

const DateDivider = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "20px 0 12px 0",
  position: "relative",
  zIndex: 2,
}));

const MessageBubble = styled(Box)(({ theme, sender, isAI }) => ({
  maxWidth: "75%",
  padding: theme.spacing(1.5, 2),
  borderRadius: sender === "me" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
  marginBottom: theme.spacing(1.5),
  background: isAI
    ? "rgba(50, 65, 85, 0.03)"
    : sender === "me"
    ? "#324155"
    : "rgba(255, 255, 255, 0.8)",
  color: isAI ? "#324155" : sender === "me" ? "#ffffff" : "#000000", // Đối phương: màu đen
  alignSelf: sender === "me" ? "flex-end" : "flex-start",
  wordBreak: "break-word",
  boxShadow: isAI
    ? "0 1px 3px rgba(0, 0, 0, 0.04)"
    : sender === "me"
    ? "0 2px 8px rgba(0, 0, 0, 0.1)"
    : "0 1px 3px rgba(0, 0, 0, 0.03)",
  border: isAI
    ? "1px solid rgba(230, 230, 230, 0.7)"
    : sender === "me"
    ? "none"
    : "1px solid rgba(230, 230, 230, 0.6)",
  backdropFilter: isAI || sender !== "me" ? "blur(8px)" : "none",
  animation:
    sender === "me"
      ? `${bubbleIn} 0.35s cubic-bezier(0.4, 0, 0.2, 1)`
      : `${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
  position: "relative",
  fontFamily: '"Inter", sans-serif',
  fontWeight: isAI ? 400 : 400,
  fontSize: "0.93rem",
  letterSpacing: "0.01em",
  lineHeight: 1.5,
  transition: "all 0.2s",
  "&:hover": {
    boxShadow: isAI
      ? "0 2px 8px rgba(0, 0, 0, 0.06)"
      : sender === "me"
      ? "0 3px 10px rgba(0, 0, 0, 0.12)"
      : "0 2px 8px rgba(0, 0, 0, 0.04)",
    transform: "translateY(-1px)",
  },
}));

// MessageContent là component cũ, giữ lại để dùng cho phần chat
// ... giữ nguyên định nghĩa MessageContent ...

const AttachmentPreview = styled("div")(() => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(108, 99, 255, 0.15)",
  marginRight: 10,
  marginBottom: 8,
  background: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  position: "relative",
  border: "1px solid rgba(108, 99, 255, 0.1)",
  minWidth: 80,
  minHeight: 80,
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 25px rgba(108, 99, 255, 0.25)",
  },
}));

const AttachIconButton = styled(IconButton)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "rgba(255, 255, 255, 0.7)",
  color: "#324155",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
  marginRight: 10,
  border: "1px solid rgba(230, 230, 230, 0.7)",
  transition: "all 0.2s",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.9)",
    color: "#324155",
    transform: "translateY(-1px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  width: 45,
  height: 45,
  borderRadius: "50%",
  background: "#324155",
  color: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  fontSize: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
  "&:hover": {
    background: "#455a74",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.12)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(1px)",
  },
}));

export const ChatBox = () => {
  const { selectedUserToShow, openChat, toggleChat, setSelectedUserToShow } =
    useChat();
  const [hasScroll, setHasScroll] = useState(false);

  const [aiTyping, setAiTyping] = useState(false);

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState({});

  const [chatPartners, setChatPartners] = useState([]);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [attachmentMenuAnchor, setAttachmentMenuAnchor] = useState(null);

  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [pagination, setPagination] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const socketRef = useRef();

  // Thêm các ref lưu state mới nhất
  const accountRef = useRef(account);
  const selectedUserToShowRef = useRef(selectedUserToShow);
  const openChatRef = useRef(openChat);
  const currentConversationIdRef = useRef(currentConversationId);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);
  useEffect(() => {
    selectedUserToShowRef.current = selectedUserToShow;
  }, [selectedUserToShow]);
  useEffect(() => {
    openChatRef.current = openChat;
  }, [openChat]);
  useEffect(() => {
    currentConversationIdRef.current = currentConversationId;
  }, [currentConversationId]);

  // Function to handle zoom in
  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  // Reset zoom level when closing the fullscreen view
  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
    setZoomLevel(1);
  };

  // Handle double click to toggle zoom
  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (zoomLevel > 1) {
      setZoomLevel(1);
    } else {
      setZoomLevel(2);
    }
  };

  useEffect(() => {
    const fetchChatPartners = async () => {
      try {
        const response = await axios.get("/chat/conversations", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setChatPartners(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chat partners:", error);
      }
    };

    fetchChatPartners();
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }

    // Ensure the container itself can be scrolled
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight > clientHeight) {
        chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
      }
    }
  };

  const handleAttachmentMenuOpen = (event) => {
    setAttachmentMenuAnchor(event.currentTarget);
  };

  const handleAttachmentMenuClose = () => {
    setAttachmentMenuAnchor(null);
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    const newAttachments = files.map((file) => {
      return {
        id: Date.now() + Math.random(),
        file,
        type: file.type,
        name: file.name,
        preview: URL.createObjectURL(file),
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    handleAttachmentMenuClose();
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => {
      const filtered = prev.filter((attachment) => attachment.id !== id);
      const removedItem = prev.find((attachment) => attachment.id === id);
      if (removedItem && removedItem.preview) {
        URL.revokeObjectURL(removedItem.preview);
      }
      return filtered;
    });
  };

  const handleSendMessage = async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      !selectedUserToShow ||
      !account?.accountID
    ) {
      return;
    }

    if (selectedUserToShow.isAI) {
      setIsLoading(true);
      const userMessage = message.trim();

      const userMsgId = `user-${Date.now()}`;
      const userMsg = {
        _id: userMsgId,
        senderId: account.accountID,
        text: userMessage,
        type: "text",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setMessage("");
      setTimeout(scrollToBottom, 100);

      // Hiển thị trạng thái AI đang nhập
      setAiTyping(true);

      try {
        const token = localStorage.getItem("token");
        const data = await axios.post(
          "/chat/send-message-with-AI",
          {
            message: userMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Thêm tin nhắn từ AI vào danh sách
        const aiMsgId = `ai-${Date.now()}`;
        const aiMsg = {
          _id: aiMsgId,
          senderId: "ai-assistant",
          currentConversationId: currentConversationId,
          text: data.data.reply,
          type: "text",
          createdAt: new Date().toISOString(),
        };

        // Thêm cả payload vào tin nhắn AI nếu có
        if (data.data.payload) {
          aiMsg.payload = data.data.payload;

          // Nếu có danh sách sản phẩm
          if (data.data.payload.type === "productList") {
            aiMsg.productSuggestions = data.data.payload.items;
          }
        }

        setMessages((prev) => [...prev, aiMsg]);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error getting AI response:", error);
        // Hiển thị thông báo lỗi dưới dạng tin nhắn từ AI
        const errorMsg = {
          _id: `error-${Date.now()}`,
          senderId: "ai-assistant",
          text: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
          type: "text",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        // Tắt trạng thái loading và typing
        setIsLoading(false);
        setAiTyping(false);
        setTimeout(scrollToBottom, 100);
      }

      return;
    }

    setIsLoading(true);

    try {
      if (attachments.length > 0) {
        // Đảm bảo join-room trước khi upload file
        if (socketRef.current && account?.accountID) {
          socketRef.current.emit("join-room", account.accountID);
        }
        const tempMsgId = `temp-${Date.now()}`;
        // Tạo message tạm cho media
        const tempMsg = {
          _id: tempMsgId,
          currentConversationId: currentConversationId,
          senderId: account.accountID,
          receiverId: selectedUserToShow._id,
          text: message.trim(),
          media: attachments.map((attachment) => {
            const mediaId = attachment.id || tempMsgId + "-" + Math.random();
            return {
              id: mediaId,
              _id: mediaId,
              type: attachment.type,
              name: attachment.name,
              url: attachment.preview,
            };
          }),
          type: attachments[0]?.type?.startsWith("image/") ? "image" : "file",
          createdAt: new Date().toISOString(),
          isPending: true,
          tempMsgId: tempMsgId,
        };
        setMessages((prev) => [...prev, tempMsg]);
        setTimeout(scrollToBottom, 100);
        setMessage("");
        const formData = new FormData();
        attachments.forEach((attachment) => {
          formData.append("files", attachment.file);
          formData.append("fileTypes", attachment.type);
          formData.append("fileNames", attachment.name);
        });
        if (currentConversationId && currentConversationId !== "null") {
          formData.append("currentConversationId", currentConversationId);
        }
        formData.append("receiverId", selectedUserToShow._id);
        formData.append("tempMsgId", tempMsgId);
        formData.append("text", message.trim());
        await axios.post("/chat/upload-and-send", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (socketRef.current && !socketRef.current.connected) {
          socketRef.current.connect();
        }
        if (socketRef.current && account?.accountID) {
          socketRef.current.emit("join-room", account.accountID);
        }
        setAttachments([]);
        setTimeout(scrollToBottom, 100);
      } else {
        if (currentConversationId) {
          const tempMsgId = `temp-${Date.now()}`;
          const receiverId = selectedUserToShow._id;
          const newMsg = {
            senderId: account.accountID,
            conversationId: currentConversationId,
            receiverId: receiverId,
            text: message.trim(),
            type: "text",
            tempMsgId: tempMsgId,
            media: [], // Đảm bảo luôn gửi trường media
          };
          // Tạo message tạm cho text
          const tempMsg = {
            _id: tempMsgId,
            currentConversationId: currentConversationId,
            senderId: account.accountID,
            receiverId: receiverId,
            text: message.trim(),
            media: [],
            type: "text",
            createdAt: new Date().toISOString(),
            isPending: true,
            tempMsgId: tempMsgId,
          };
          setMessages((prev) => [...prev, tempMsg]);
          setTimeout(scrollToBottom, 100);
          setMessage("");
          socketRef.current.emit("send-message", newMsg);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 200);
    }
  };

  const handleSelectUser = (user) => {
    // Chỉ reset messages nếu chọn user khác
    if (selectedUserToShow?._id !== user._id) {
      setSelectedUserToShow({
        ...user,
        id: user.id || user._id,
        _id: user._id,
      });
      setIsLoading(true);
      setCurrentConversationId(user.conversationId);
      setMessages([]);
      if (user?._id) {
        fetchChatHistory(user?._id).then(() => {
          setTimeout(scrollToBottom, 300);
        });
      }
    }
  };

  useEffect(() => {
    socketRef.current = io("https://localhost:2000", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ["websocket", "polling"],
      auth: { token: localStorage.getItem("token") },
      query: { clientTime: Date.now() },
      forceNew: true,
    });

    const socket = socketRef.current;

    const handleConnect = () => {
      setConnectionStatus("connected");
      if (account?.accountID) {
        socket.emit("join-room", account.accountID);
      }
    };
    const handleDisconnect = (reason) => {
      setConnectionStatus("disconnected");
      if (reason !== "io client disconnect") {
        setConnectionStatus("reconnecting");
        setTimeout(() => {
          if (!socket.connected) {
            socket.connect();
          }
        }, 1000);
      }
    };
    const handleError = (error) => {
      console.error("[SOCKET] Connection error:", error);
    };
    const handleReconnect = (attemptNumber) => {
      setConnectionStatus("connected");
      if (account?.accountID) {
        socket.emit("join-room", account.accountID);
      }
    };
    const handleMessageError = (error) => {
      console.error("[SOCKET] Message error:", error);
      // Identify and handle specific error types
      if (error.error === "Invalid message ID format" && error.messageId) {
        // Check for different message ID formats
        if (error.messageId.startsWith("temp-")) {
          return;
        } else if (error.messageId.startsWith("ai-")) {
          return;
        } else if (error.messageId.startsWith("user-")) {
          console.log(
            "[SOCKET] Ignoring user message ID error for:",
            error.messageId
          );
          return;
        }

        // For other invalid message IDs, log more details
        console.error(
          `[SOCKET] Invalid message ID format: ${error.messageId}. This ID is not being properly filtered.`
        );
      } else if (error.error === "Message not found") {
        console.log(
          `[SOCKET] Message not found: ${error.messageId}. It may have been deleted.`
        );
      } else if (error.error === "Missing required data for mark-as-read") {
        console.error(
          "[SOCKET] Missing required data for mark-as-read:",
          error
        );
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);
    socket.on("reconnect", handleReconnect);
    socket.on("message-error", handleMessageError);

    // Đăng ký event listener ngay sau khi khởi tạo socket
    const handleMessageSent = (msg) => {
      console.log("[FE] message-sent:", msg); // Log để kiểm tra nhận media
      setMessages((prev) => {
        // Ưu tiên thay thế message tạm dựa trên tempMsgId
        if (msg.tempMsgId) {
          const idx = prev.findIndex((m) => m._id === msg.tempMsgId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = msg;
            return updated;
          }
        }
        // Nếu không có tempMsgId, thử thay thế message tạm dựa trên các tiêu chí khác
        // (ví dụ: cùng senderId, cùng text, cùng thời gian gần nhau, isPending=true)
        const idx2 = prev.findIndex(
          (m) =>
            m.isPending &&
            m.senderId === msg.senderId &&
            m.text === msg.text &&
            Math.abs(new Date(m.createdAt) - new Date(msg.createdAt)) < 60000
        );
        if (idx2 !== -1) {
          const updated = [...prev];
          updated[idx2] = msg;
          return updated;
        }
        // Nếu không tìm thấy, kiểm tra trùng _id
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        // Nếu không trùng, append vào cuối
        return [...prev, msg];
      });
      updateChatPartnerLastMessage(msg);
    };
    const handleReceiveMessage = (msg) => {
      const accountID = accountRef.current?.accountID;
      const selectedUser = selectedUserToShowRef.current;
      if (
        accountID === msg.receiverId &&
        selectedUser &&
        selectedUser.id === msg.senderId
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;
          if (msg.conversationId && !currentConversationIdRef.current) {
            setCurrentConversationId(msg.conversationId);
          }
          return [...prev, msg];
        });
        updateChatPartnerLastMessage(msg);
      }
    };
    socket.on("message-sent", handleMessageSent);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
      socket.off("reconnect", handleReconnect);
      socket.off("message-error", handleMessageError);
      socket.off("message-sent", handleMessageSent);
      socket.off("receive-message", handleReceiveMessage);
      socket.disconnect();
    };
  }, [account?.accountID]);

  useEffect(() => {
    if (
      socketRef.current &&
      socketRef.current.connected &&
      account?.accountID
    ) {
      console.log("[SOCKET] FE join-room:", account.accountID);
      socketRef.current.emit("join-room", account.accountID);
    }
  }, [account?.accountID, socketRef.current && socketRef.current.connected]);

  useEffect(() => {
    if (!account?.accountID) return;

    const handleMessageSent = (msg) => {
      console.log("[FE] message-sent:", msg);
      setMessages((prev) => {
        // Nếu có tempMsgId, thay thế message tạm bằng message thật
        if (msg.tempMsgId) {
          const idx = prev.findIndex((m) => m._id === msg.tempMsgId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = msg;
            return updated;
          }
        }
        // Nếu không có tempMsgId hoặc không tìm thấy, kiểm tra trùng _id
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
      updateChatPartnerLastMessage(msg);
    };
    const handleReceiveMessage = (msg) => {
      const accountID = accountRef.current?.accountID;
      const selectedUser = selectedUserToShowRef.current;
      if (
        accountID === msg.receiverId &&
        selectedUser &&
        selectedUser.id === msg.senderId
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;
          if (msg.conversationId && !currentConversationIdRef.current) {
            setCurrentConversationId(msg.conversationId);
          }
          return [...prev, msg];
        });
        updateChatPartnerLastMessage(msg);
      }
    };
    if (socketRef.current) {
      socketRef.current.on("message-sent", handleMessageSent);
      socketRef.current.on("receive-message", handleReceiveMessage);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off("message-sent", handleMessageSent);
        socketRef.current.off("receive-message", handleReceiveMessage);
      }
    };
  }, []);

  const fetchChatHistoryAI = async () => {
    try {
      const response = await axios.get(`/chat/ai/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const processedMessages = response.data.data.map((message) => {
        const media = message.media || [];

        const processedMessage = {
          ...message,
          media: media.map((item) => ({
            id: item._id || Date.now() + Math.random(),
            type: item.type || "application/octet-stream",
            url: item.url || "",
            name: item.name || "Attached file",
          })),
        };

        // Nếu là message loại product nhưng không có product (có thể do API không populate)
        if (
          message.type === "product" &&
          !message.product &&
          message.productId
        ) {
          console.log("Processing product message:", message.productId);
        }

        if (message.type === "order" && !message.order && message.orderId) {
          console.log("Processing order message:", message.orderId);
        }

        return processedMessage;
      });
      setMessages(processedMessages);
    } catch (error) {
      console.error("[ERROR] Chi tiết lỗi:", error);
    }
  };

  const fetchChatHistory = async (receiver, page = 0) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `  /chat/optimized/messages/${receiver}?page=${page}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const processedMessages = response.data.data.map((message) => {
          const media = message.media || [];

          const processedMessage = {
            ...message,
            media: media.map((item) => ({
              id: item._id || Date.now() + Math.random(),
              type: item.type || "application/octet-stream",
              url: item.url || "",
              name: item.name || "Attached file",
            })),
          };

          return processedMessage;
        });

        if (page > 0) {
          setMessages((prev) => [...processedMessages, ...prev]);
        } else {
          // First page, replace existing messages
          setMessages(processedMessages);
        }

        // Store pagination info
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("[ERROR] Chi tiết lỗi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to load more messages when scrolling to top
  const loadMoreMessages = () => {
    if (
      pagination &&
      pagination.hasMore &&
      !isLoadingMore &&
      selectedUserToShow
    ) {
      setIsLoadingMore(true);
      fetchChatHistory(selectedUserToShow._id, pagination.page + 1).finally(
        () => {
          setIsLoadingMore(false);
        }
      );
    }
  };

  // Handle scroll to top to load more messages
  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop < 50 && !isLoadingMore && pagination && pagination.hasMore) {
      loadMoreMessages();
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data) {
          setAccount(data.data.account);
        }
      } catch (error) {
        localStorage.clear();
        console.error("Error fetching", error);
      }
    };
    checkAuthentication();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkForScroll = () => {
      if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    if (openChat) {
      scrollToBottom();
      checkForScroll();
    }
  }, [openChat]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
    }
  }, []);

  useEffect(() => {
    if (selectedUserToShow && account?.accountID) {
      socketRef.current.emit("stop-typing", {
        senderId: account.accountID,
        receiverId: selectedUserToShow.id,
      });
    }
  }, [selectedUserToShow, account]);

  useEffect(() => {
    socketRef.current.on("online-users", (users) => {
      console.log("[SOCKET] Online users:", users);
      setOnlineUsers(users);
    });

    socketRef.current.on("user-connected", (userId) => {
      console.log("[SOCKET] User connected:", userId);
      setOnlineUsers((prev) => [...prev, userId]);
    });

    socketRef.current.on("user-disconnected", (userId) => {
      console.log("[SOCKET] User disconnected:", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socketRef.current.off("online-users");
      socketRef.current.off("user-connected");
      socketRef.current.off("user-disconnected");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("user-typing", (data) => {
      if (
        selectedUserToShow &&
        data.senderId === selectedUserToShow.id &&
        data.receiverId === account?.accountID
      ) {
        console.log("[SOCKET] User typing:", data);
        setTypingUsers((prev) => ({ ...prev, [data.senderId]: data.typing }));
      }
    });

    return () => {
      socketRef.current.off("user-typing");
    };
  }, [selectedUserToShow, account?.accountID]);

  // Removed mark-as-read functionality

  useEffect(() => {
    socketRef.current.on("new-message-notification", (data) => {
      setChatPartners((prev) => {
        return prev.map((partner) => {
          if (partner._id === data.senderId) {
            return {
              ...partner,
              lastMessage: data.message,
              lastMessageAt: data.timestamp,
              unread: (partner.unread || 0) + 1,
            };
          }
          return partner;
        });
      });
    });

    return () => {
      socketRef.current.off("new-message-notification");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("message-deleted", (data) => {
      setMessages((prev) => {
        return prev.filter((msg) => msg._id !== data.messageId);
      });
    });

    return () => {
      socketRef.current.off("message-deleted");
    };
  }, []);

  useEffect(() => {
    return () => {
      attachments.forEach((attachment) => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, [attachments]);

  // Format message timestamp to readable time
  const formatMessageTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "";
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (selectedUserToShow && account?.accountID) {
      if (typingTimeout) clearTimeout(typingTimeout);

      socketRef.current.emit("typing", {
        senderId: account.accountID,
        receiverId: selectedUserToShow.id,
      });

      const timeout = setTimeout(() => {
        socketRef.current.emit("stop-typing", {
          senderId: account.accountID,
          receiverId: selectedUserToShow.id,
        });
      }, 2000);

      setTypingTimeout(timeout);
    }
  };

  // Format last message display in the chat partner list
  const formatLastMessage = (partner) => {
    if (!partner.lastMessage && !partner.lastMessageType) {
      return "Bắt đầu cuộc trò chuyện...";
    }

    // Hiển thị ai gửi tin nhắn
    const isFromMe = partner.lastMessageSenderId === account?.accountID;
    const prefix = isFromMe ? "Bạn: " : "";

    // Nếu có attachment type, hiển thị thông tin về loại file
    if (partner.lastMessageType) {
      if (partner.lastMessageType === "image") {
        return `${prefix}${partner.lastMessage || "Đã gửi một hình ảnh"}`;
      } else if (partner.lastMessageType === "video") {
        return `${prefix}${partner.lastMessage || "Đã gửi một video"}`;
      } else if (partner.lastMessageType === "product") {
        return `${prefix}${partner.lastMessage || "Đã gửi thông tin sản phẩm"}`;
      } else if (partner.lastMessageType === "order") {
        return `${prefix}${partner.lastMessage || "Đã gửi thông tin đơn hàng"}`;
      } else {
        return `${prefix}${partner.lastMessage}`;
      }
    }

    // Nếu chỉ có text
    return `${prefix}${partner.lastMessage}`;
  };

  // Update chat partner with new message
  const updateChatPartnerLastMessage = (msg) => {
    if (
      account?.accountID === msg.receiverId ||
      account?.accountID === msg.senderId
    ) {
      setChatPartners((prev) => {
        // Tìm partner tương ứng
        const partnerId =
          msg.senderId === account?.accountID ? msg.receiverId : msg.senderId;
        const partnerIndex = prev.findIndex((p) => p._id === partnerId);
        if (partnerIndex === -1) {
          return prev;
        }

        // Prepare last message display text
        let lastMessageText = msg.text || "";
        let lastMessageType = "";

        // Kiểm tra nếu có attachments
        if (msg.media && msg.media.length > 0) {
          lastMessageType = msg.media[0].type || "";
        }

        // Update unread count
        const newPartners = [...prev];
        newPartners[partnerIndex] = {
          ...newPartners[partnerIndex],
          lastMessage: lastMessageText,
          lastMessageAt: msg.createdAt,
          lastMessageSenderId: msg.senderId,
          lastMessageType: lastMessageType,
          unread:
            account?.accountID === msg.receiverId &&
            msg.senderId !== account?.accountID
              ? (newPartners[partnerIndex].unread || 0) + 1
              : newPartners[partnerIndex].unread || 0,
        };

        // Sắp xếp lại danh sách người chat theo thời gian tin nhắn mới nhất
        return newPartners.sort(
          (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
        );
      });
    }
  };

  useEffect(() => {
    if (selectedUserToShow && !selectedUserToShow.isAI && account?.accountID) {
      setIsLoading(true);
      fetchChatHistory(selectedUserToShow._id).then(() => {
        setTimeout(scrollToBottom, 300);
        setIsLoading(false);
      });
    } else if (selectedUserToShow && selectedUserToShow.isAI) {
      fetchChatHistoryAI();
    }
  }, [selectedUserToShow]);

  // Định kỳ kiểm tra kết nối socket
  useEffect(() => {
    const checkConnection = () => {
      if (socketRef.current && !socketRef.current.connected) {
        console.log("[SOCKET] Connection lost, attempting to reconnect...");
        setConnectionStatus("reconnecting");
        socketRef.current.connect();
      }
    };

    const intervalId = setInterval(checkConnection, 30000); // Kiểm tra mỗi 30 giây

    return () => clearInterval(intervalId);
  }, []);

  // Thêm trạng thái cho mobile view
  const [showSidebar, setShowSidebar] = useState(true);

  // Cập nhật hiển thị trên giao diện mobile
  useEffect(() => {
    // Kiểm tra nếu là mobile view và đã chọn người chat
    if (window.innerWidth < 600 && selectedUserToShow) {
      // Nếu là AI, không cần chuyển đổi view
      if (selectedUserToShow.isAI) {
        setShowSidebar(false);
      } else {
        setShowSidebar(false);
      }
    } else {
      setShowSidebar(true);
    }
  }, [selectedUserToShow]);

  // Thêm hàm để quay lại danh sách chat trên mobile
  const handleBackToList = () => {
    setShowSidebar(true);
  };

  // Khôi phục lại function MessageContent
  const MessageContent = ({ message, setFullscreenImage, isMe }) => {
    if (message.senderId === "ai-assistant") {
      return (
        <Typography
          variant="body2"
          sx={{ wordBreak: "break-word", color: "#324155", fontWeight: 400 }}
        >
          {message.text}
        </Typography>
      );
    }

    if (
      (message.type === "product" && message.product) ||
      (message.type === "product" && message.productId)
    ) {
      const productData = message.product || {
        id: message.productId,
        _id: message.productId,
        name: message.text || "Sản phẩm được chia sẻ",
        price: "",
        image:
          message.media && message.media.length > 0
            ? message.media[0].url
            : null,
      };
      return <ProductMessage product={productData} />;
    } else if (message.type === "order" && message.order) {
      return <OrderMessage order={message.order} />;
    } else {
      return (
        <>
          {message.text && (
            <Typography
              variant="body2"
              sx={{ wordBreak: "break-word", color: isMe ? "#fff" : "#000" }}
            >
              {message.text}
            </Typography>
          )}

          {message.media && message.media.length > 0 && (
            <div className="media-message-container">
              {message.media.map((attachment) => {
                const source = attachment.url || "";
                const fileType = attachment.type || "";

                if (
                  fileType.startsWith("image/") ||
                  source.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                ) {
                  return (
                    <ImageMessage
                      key={attachment.url || attachment.name}
                      attachment={attachment}
                      setFullscreenImage={setFullscreenImage}
                    />
                  );
                } else if (
                  fileType.startsWith("video/") ||
                  source.match(/\.(mp4|webm|ogg|mov)$/i)
                ) {
                  return (
                    <VideoMessage
                      key={attachment.url || attachment.name}
                      attachment={attachment}
                    />
                  );
                } else {
                  return (
                    <FileMessage
                      key={attachment.url || attachment.name}
                      attachment={attachment}
                    />
                  );
                }
              })}
            </div>
          )}
        </>
      );
    }
  };

  return (
    <>
      {openChat && (
        <Zoom in={openChat} timeout={300}>
          <ChatBoxBox ref={chatRef}>
            <StyledChatCard>
              <CardHeader
                title={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      position: "relative",
                    }}
                  >
                    {!showSidebar && (
                      <BackButton onClick={handleBackToList}>
                        <ArrowBack fontSize="small" />
                      </BackButton>
                    )}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#fff",
                        letterSpacing: "0.01em",
                        ml: !showSidebar ? 4 : 0,
                      }}
                    >
                      {!showSidebar && selectedUserToShow
                        ? selectedUserToShow.name
                        : "Tin nhắn hỗ trợ"}
                    </Typography>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor:
                          connectionStatus === "connected"
                            ? "#4a9f82"
                            : connectionStatus === "reconnecting"
                            ? "#f0b775"
                            : "#e57373",
                        animation:
                          connectionStatus === "reconnecting"
                            ? `${pulse} 1.5s infinite`
                            : "none",
                        boxShadow:
                          connectionStatus === "connected"
                            ? "0 0 6px rgba(74, 159, 130, 0.4)"
                            : connectionStatus === "reconnecting"
                            ? "0 0 6px rgba(240, 183, 117, 0.4)"
                            : "0 0 6px rgba(229, 115, 115, 0.4)",
                      }}
                    />
                  </Box>
                }
                action={
                  <IconButton
                    onClick={toggleChat}
                    sx={{
                      color: "white",
                      background: "rgba(255, 255, 255, 0.12)",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      transition: "all 0.2s",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 0.2)",
                        transform: "rotate(90deg)",
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                }
                sx={{
                  background: "#324155",
                  color: "#fff",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  padding: "10px 16px",
                  boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                  position: "relative",
                  zIndex: 2,
                }}
              />
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{ display: "flex", height: { xs: "70vh", sm: "500px" } }}
                >
                  {/* Hiển thị sidebar dựa vào trạng thái */}
                  {(showSidebar || window.innerWidth >= 600) && (
                    <SidebarBox
                      sx={{
                        width: { xs: "100%", sm: "40%" },
                        display: {
                          xs: showSidebar ? "flex" : "none",
                          sm: "flex",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <TextField
                          fullWidth
                          placeholder="Tìm kiếm..."
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search fontSize="small" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: 4, backgroundColor: "white" },
                          }}
                        />
                      </Box>

                      {/* AI Assistant chat button */}
                      <ChatCardItem
                        avatar="http://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                        name="Chăm sóc khách hàng"
                        subtitle="Hỗ trợ, giải đáp và tìm kiếm sản phẩm"
                        chipLabel="Hỗ trợ"
                        selected={selectedUserToShow?._id === "ai-assistant"}
                        onClick={() => {
                          if (window.innerWidth < 600) {
                            setShowSidebar(false);
                          } else {
                            setShowSidebar(true);
                          }
                          setSelectedUserToShow({
                            id: "ai-assistant",
                            _id: "ai-assistant",
                            name: "Chăm sóc khách hàng",
                            avatar:
                              "http://cdn-icons-png.flaticon.com/512/4712/4712027.png",
                            isAI: true,
                          });
                          setMessages([
                            {
                              _id: "ai-welcome",
                              senderId: "ai-assistant",
                              text: "Xin chào! Tôi là trợ lý chăm sóc khách hàng. Tôi có thể giúp bạn giải đáp thắc mắc hoặc tìm kiếm sản phẩm phù hợp. Bạn cần hỗ trợ gì?",
                              createdAt: new Date().toISOString(),
                              // Removed isRead field
                            },
                          ]);
                        }}
                      />

                      <Box
                        sx={{
                          overflowY: "auto",
                          overflowX: "hidden", // Thêm dòng này để loại bỏ thanh cuộn ngang
                          height: "calc(100% - 120px)",
                          "&::-webkit-scrollbar": {
                            width: 6,
                          },
                          "&::-webkit-scrollbar-track": {
                            background: "transparent",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(0, 0, 0, 0.2)",
                            borderRadius: 3,
                          },
                        }}
                      >
                        {chatPartners.length > 0 ? (
                          chatPartners.map((partner) => (
                            <ChatCardItem
                              key={partner._id}
                              avatar={partner.avatar}
                              name={partner.name}
                              subtitle={formatLastMessage(partner)}
                              selected={selectedUserToShow?._id === partner._id}
                              onClick={() => handleSelectUser(partner)}
                            />
                          ))
                        ) : (
                          <Box
                            sx={{
                              p: 3,
                              textAlign: "center",
                              color: "text.secondary",
                            }}
                          >
                            <Typography variant="body2">
                              Không có cuộc trò chuyện nào
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </SidebarBox>
                  )}

                  {/* Hiển thị phần tin nhắn dựa vào trạng thái */}
                  <Box
                    sx={{
                      width: {
                        xs: showSidebar ? "0%" : "100%",
                        sm: showSidebar ? "60%" : "100%", // Luôn giữ 60% khi có sidebar, 100% khi không có sidebar trên desktop
                      },
                      display: {
                        xs: showSidebar ? "none" : "flex",
                        sm: "flex",
                      },
                      flexDirection: "column",
                    }}
                  >
                    <MessageContainerBox
                      ref={chatContainerRef}
                      onScroll={handleScroll}
                    >
                      {isLoading && pagination?.page === 0 ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <CircularProgress size={40} color="primary" />
                        </Box>
                      ) : !selectedUserToShow ? (
                        <EmptyStateBox>
                          <EmptyStateImage
                            src="https://cdn-icons-png.flaticon.com/512/1067/1067566.png"
                            alt="Select a conversation"
                          />
                          <Typography
                            sx={{
                              fontSize: "1.2rem",
                              fontWeight: 600,
                              color: "#546e7a",
                              mb: 1,
                            }}
                          >
                            Chọn một cuộc trò chuyện
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              color: "#78909c",
                              maxWidth: 280,
                            }}
                          >
                            Chọn một người dùng từ danh sách bên trái để bắt đầu
                            trò chuyện
                          </Typography>
                        </EmptyStateBox>
                      ) : messages.length === 0 ? (
                        <EmptyStateBox>
                          <EmptyStateImage
                            src="https://cdn-icons-png.flaticon.com/512/1998/1998342.png"
                            alt="No messages"
                          />
                          <Typography
                            sx={{
                              fontSize: "1.2rem",
                              fontWeight: 600,
                              color: "#546e7a",
                              mb: 1,
                            }}
                          >
                            Chưa có tin nhắn nào
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "0.9rem",
                              color: "#78909c",
                              maxWidth: 280,
                            }}
                          >
                            Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn
                            đầu tiên
                          </Typography>
                        </EmptyStateBox>
                      ) : (
                        <>
                          {isLoadingMore && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                mb: 2,
                              }}
                            >
                              <CircularProgress size={24} color="primary" />
                            </Box>
                          )}

                          {messages.reduce((result, message, index, array) => {
                            const messageDate = new Date(
                              message.createdAt
                            ).toLocaleDateString();

                            if (
                              index === 0 ||
                              messageDate !==
                                new Date(
                                  array[index - 1].createdAt
                                ).toLocaleDateString()
                            ) {
                              result.push(
                                <DateDivider key={`date-${message._id}`}>
                                  <DateDividerSpan>
                                    {messageDate}
                                  </DateDividerSpan>
                                </DateDivider>
                              );
                            }

                            const isMe =
                              String(message.senderId) ===
                              String(account?.accountID);
                            const isAI = message.senderId === "ai-assistant";

                            result.push(
                              <Fade in={true} key={message._id} timeout={500}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    mb: 2,
                                    justifyContent: isMe
                                      ? "flex-end"
                                      : "flex-start",
                                  }}
                                >
                                  <MessageBubble
                                    sender={isMe ? "me" : "other"}
                                    isAI={isAI}
                                  >
                                    {isAI ? (
                                      <MessageContent
                                        message={message}
                                        setFullscreenImage={setFullscreenImage}
                                        isMe={isMe}
                                      />
                                    ) : (
                                      <MessageContent
                                        message={message}
                                        setFullscreenImage={setFullscreenImage}
                                        isMe={isMe}
                                      />
                                    )}

                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        alignItems: "center",
                                        mt: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: isMe
                                            ? "primary.contrastText"
                                            : "text.secondary",
                                          opacity: 0.7,
                                          mr: 0.5,
                                        }}
                                      >
                                        {formatMessageTime(message.createdAt)}
                                      </Typography>
                                    </Box>
                                  </MessageBubble>
                                </Box>
                              </Fade>
                            );

                            return result;
                          }, [])}

                          {typingUsers[selectedUserToShow?.id] && (
                            <TypingIndicatorBox sx={{ ml: 2, mb: 1 }}>
                              <TypingDot delay="0s" />
                              <TypingDot delay="0.2s" />
                              <TypingDot delay="0.4s" />
                            </TypingIndicatorBox>
                          )}

                          {/* AI typing indicator */}
                          {aiTyping && selectedUserToShow?.isAI && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 2,
                              }}
                            >
                              <StyledAvatar
                                src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                                sx={{ mr: 1 }}
                                isonline="true"
                              />
                              <AITypingIndicator>
                                <AITypingDot delay="0s" />
                                <AITypingDot delay="0.2s" />
                                <AITypingDot delay="0.4s" />
                              </AITypingIndicator>
                            </Box>
                          )}
                        </>
                      )}
                      <div ref={messagesEndRef} />
                    </MessageContainerBox>

                    <Box
                      sx={{
                        p: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        background: "#f8f9fa",
                      }}
                    >
                      {attachments.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                          >
                            {attachments.map((attachment) => (
                              <AttachmentPreview key={attachment.id}>
                                {attachment.type.startsWith("image/") ? (
                                  <img
                                    src={attachment.preview}
                                    alt={attachment.name}
                                    style={{
                                      width: 60,
                                      height: 60,
                                      objectFit: "contain", // Hiển thị full ảnh, không crop
                                      borderRadius: 8,
                                      background: "#fff",
                                      display: "block",
                                    }}
                                  />
                                ) : attachment.type.startsWith("video/") ? (
                                  <video
                                    style={{
                                      width: 60,
                                      height: 60,
                                      objectFit: "contain", // Hiển thị full video, không crop
                                      borderRadius: 8,
                                      background: "#fff",
                                      display: "block",
                                    }}
                                    controls={false}
                                    preload="metadata"
                                  >
                                    <source
                                      src={attachment.preview}
                                      type={attachment.type}
                                    />
                                  </video>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "100%",
                                      bgcolor: "grey.100",
                                      width: "100%",
                                    }}
                                  >
                                    <InsertDriveFile />
                                  </Box>
                                )}
                                <IconButton
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    color: "white",
                                    width: 24,
                                    height: 24,
                                    "&:hover": {
                                      backgroundColor: "rgba(255, 0, 0, 0.7)",
                                    },
                                  }}
                                  onClick={() =>
                                    removeAttachment(attachment.id)
                                  }
                                  size="small"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </AttachmentPreview>
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AttachIconButton
                          onClick={handleAttachmentMenuOpen}
                          disabled={!selectedUserToShow || isLoading}
                          color="primary"
                        >
                          <AttachFile />
                        </AttachIconButton>

                        <Menu
                          anchorEl={attachmentMenuAnchor}
                          open={Boolean(attachmentMenuAnchor)}
                          onClose={handleAttachmentMenuClose}
                          disableScrollLock={true}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          PaperProps={{
                            elevation: 4,
                            sx: {
                              borderRadius: 2,
                              mt: 0,
                              mb: 1,
                              width: { xs: "260px", sm: "280px" },
                              overflow: "visible",
                              "&:before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                bottom: -10,
                                left: 20,
                                width: 20,
                                height: 20,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                        >
                          <Divider sx={{ mb: 1 }} />
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 1,
                              p: 1,
                            }}
                          >
                            <MenuItem
                              onClick={() => {
                                if (fileInputRef.current) {
                                  fileInputRef.current.accept = "image/*";
                                  fileInputRef.current.click();
                                }
                              }}
                              sx={{
                                borderRadius: 1,
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: "#435366",
                              }}
                            >
                              <Image
                                fontSize="medium"
                                color="primary"
                                sx={{ mb: 1, color: "#435366" }}
                              />
                              Hình ảnh
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                if (fileInputRef.current) {
                                  fileInputRef.current.accept = "video/*";
                                  fileInputRef.current.click();
                                }
                              }}
                              sx={{
                                borderRadius: 1,
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                color: "#435366",
                              }}
                            >
                              <VideoLibrary
                                fontSize="medium"
                                color="primary"
                                sx={{ mb: 1, color: "#435366" }}
                              />
                              Video
                            </MenuItem>
                          </Box>
                        </Menu>

                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileInputChange}
                          multiple
                        />

                        <TextField
                          fullWidth
                          placeholder={
                            selectedUserToShow
                              ? "Nhập tin nhắn..."
                              : "Chọn người để bắt đầu trò chuyện"
                          }
                          variant="outlined"
                          size="small"
                          value={message}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          InputProps={{
                            sx: {
                              borderRadius: 8,
                              background: "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(222, 226, 230, 0.7)",
                              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.03)",
                              "& input": {
                                padding: "12px 16px",
                                fontSize: "0.95rem",
                                fontWeight: 400,
                                color: "#435366",
                                letterSpacing: "0.01em",
                              },
                              "&:hover": {
                                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
                                background: "rgba(255, 255, 255, 0.95)",
                              },
                              "&.Mui-focused": {
                                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                                border: "1px solid rgba(67, 83, 102, 0.3)",
                              },
                            },
                          }}
                          sx={{ mr: 1, flex: 1 }}
                          disabled={!selectedUserToShow || isLoading}
                        />
                        <Tooltip title="Gửi tin nhắn" arrow>
                          <SendButton
                            variant="contained"
                            onClick={handleSendMessage}
                            disabled={
                              (!message.trim() && attachments.length === 0) ||
                              !selectedUserToShow ||
                              isLoading
                            }
                          >
                            <Send />
                          </SendButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </StyledChatCard>
          </ChatBoxBox>
        </Zoom>
      )}

      {fullscreenImage && (
        <FullscreenModalBox onClick={handleCloseFullscreen}>
          <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 1500 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleCloseFullscreen();
              }}
              sx={{
                color: "#333",
                backgroundColor: "rgba(240, 240, 240, 0.8)",
                width: 40,
                height: 40,
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "90%",
              maxHeight: "80%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FullscreenImage
              src={fullscreenImage}
              alt="Fullscreen"
              zoomLevel={zoomLevel}
              onDoubleClick={handleDoubleClick}
              draggable="false"
            />

            <Box
              sx={{
                position: "absolute",
                bottom: -60,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "20px",
                padding: "8px 16px",
                borderRadius: "30px",
                backgroundColor: "rgba(240, 240, 240, 0.8)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <IconButton
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                sx={{
                  color: zoomLevel <= 1 ? "#BBB" : "#333",
                  backgroundColor: "white",
                  width: 40,
                  height: 40,
                }}
              >
                <ZoomOut />
              </IconButton>

              <IconButton
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                sx={{
                  color: zoomLevel >= 3 ? "#BBB" : "#333",
                  backgroundColor: "white",
                  width: 40,
                  height: 40,
                }}
              >
                <ZoomIn />
              </IconButton>
            </Box>
          </div>
        </FullscreenModalBox>
      )}
    </>
  );
};

export default ChatBox;
