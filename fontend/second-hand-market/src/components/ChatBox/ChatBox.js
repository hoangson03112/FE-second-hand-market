import React, { useRef, useEffect, useState } from "react";
import {
  Send,
  Close,
  Search,
  AttachFile,
  Image,
  VideoLibrary,
  InsertDriveFile,
  CheckCircle,
  Delete,
  ZoomOutMap,
  ZoomIn,
  ZoomOut,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
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
import { styled } from "@mui/material/styles";
import { io } from "socket.io-client";
import AccountContext from "../../contexts/AccountContext";
import axios from "axios";
import "./ChatBox.css";
import { useChat } from "../../contexts/ChatContext";
import ImageMessage from "./MessageTypes/ImageMessage";
import VideoMessage from "./MessageTypes/VideoMessage";
import FileMessage from "./MessageTypes/FileMessage";
import ProductMessage from "./MessageTypes/ProductMessage";
import OrderMessage from "./MessageTypes/OrderMessage";
const socket = io("http://localhost:2000");

// Styled components with enhanced design
const StyledChatCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
}));

const StyledAvatar = styled(Avatar)(({ theme, isonline }) => ({
  width: 48,
  height: 48,
  border: isonline === "true" ? "2px solid #4caf50" : "none",
  boxShadow: isonline === "true" ? "0 0 0 2px #fff" : "none",
  transition: "all 0.3s ease",
}));

const MessageBubble = styled(Box)(({ theme, sender }) => ({
  maxWidth: "70%",
  padding: theme.spacing(1.5),
  borderRadius: sender === "me" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
  marginBottom: theme.spacing(1),
  backgroundColor:
    sender === "me"
      ? "linear-gradient(135deg, #42a5f5, #1976d2)"
      : theme.palette.grey[50],
  color:
    sender === "me"
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
  alignSelf: sender === "me" ? "flex-end" : "flex-start",
  wordBreak: "break-word",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  border: sender === "me" ? "none" : "1px solid rgba(0, 0, 0, 0.08)",
  animation: "fadeIn 0.3s ease",
}));

const AIMessage = ({ message }) => {
  if (!message.productSuggestions) {
    return (
      <Typography
        variant="body2"
        sx={{ wordBreak: "break-word", color: "white" }}
      >
        {message.text}
      </Typography>
    );
  }

  return (
    <>
      <Typography
        variant="body2"
        sx={{ wordBreak: "break-word", mb: 2, color: "white" }}
      >
        {message.text}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {message.productSuggestions.map((product) => (
          <Box
            key={product.id}
            sx={{
              display: "flex",
              p: 1,
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(255,255,255,0.15)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.25)",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              },
            }}
            onClick={() => {
              // Handle product click - in a real app this would navigate to product page
              console.log(`Clicked on product: ${product.id}`);
            }}
          >
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                mr: 1.5,
                objectFit: "cover",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 500, color: "white" }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}
              >
                {product.price}
              </Typography>
            </Box>
          </Box>
        ))}
        <Button
          variant="contained"
          size="small"
          sx={{
            mt: 1,
            alignSelf: "flex-start",
            bgcolor: "white",
            color: "#36D1DC",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.9)",
            },
          }}
        >
          Xem thêm sản phẩm
        </Button>
      </Box>
    </>
  );
};

const MessageContent = ({ message, setFullscreenImage }) => {
  if (message.senderId === "ai-assistant") {
    return <AIMessage message={message} />;
  }

  if (
    (message.type === "product" && message.product) ||
    (message.type === "product" && message.productId)
  ) {
    // Nếu có trường product đã được populate, sử dụng nó
    // Nếu không có product nhưng có productId, tạo đối tượng product từ productId
    const productData = message.product || {
      id: message.productId,
      _id: message.productId,
      name: message.text || "Sản phẩm được chia sẻ",
      price: "",
      image:
        message.media && message.media.length > 0 ? message.media[0].url : null,
    };

    return <ProductMessage product={productData} />;
  } else if (message.type === "order" && message.order) {
    return <OrderMessage order={message.order} />;
  } else {
    return (
      <>
        {message.text && (
          <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
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
                    key={attachment.id || attachment._id}
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
                    key={attachment.id || attachment._id}
                    attachment={attachment}
                  />
                );
              } else {
                return (
                  <FileMessage
                    key={attachment.id || attachment._id}
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

export const ChatBox = () => {
  const { selectedUserToShow, openChat, toggleChat, setSelectedUserToShow } =
    useChat();
  const [hasScroll, setHasScroll] = useState(false);

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

  const [aiTyping, setAiTyping] = useState(false);

  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [pagination, setPagination] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  // Function to handle zoom in
  const handleZoomIn = (e) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  // Function to handle zoom out
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
        const response = await axios.get(
          "http://localhost:2000/eco-market/chat/conversations",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

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

      const tempMsgId = `temp-${Date.now()}`;
      const userMessage = {
        _id: tempMsgId,
        senderId: account.accountID,
        receiverId: selectedUserToShow._id,
        text: message.trim(),
        createdAt: new Date().toISOString(),
        isRead: true,
      };

      setMessages((prev) => [...prev, userMessage]);
      setTimeout(scrollToBottom, 100);
      setMessage("");

      // Show AI typing indicator after a short delay
      setTimeout(() => {
        setAiTyping(true);
      }, 500);

      return;
    }

    setIsLoading(true);

    try {
      const tempMsgId = `temp-${Date.now()}`;
      const tempMsg = {
        _id: tempMsgId,
        currentConversationId: currentConversationId,
        text: message.trim(),
        media: attachments.map((attachment) => ({
          id: attachment.id,
          type: attachment.type,
          name: attachment.name,
          url: attachment.preview,
        })),
        type: "text",
        createdAt: new Date().toISOString(),
        isRead: false,
        isPending: true,
      };

      setMessages((prev) => [...prev, tempMsg]);

      setTimeout(scrollToBottom, 100);

      setMessage("");

      if (attachments.length > 0) {
        const formData = new FormData();

        attachments.forEach((attachment) => {
          formData.append("files", attachment.file);
          formData.append("fileTypes", attachment.type);
          formData.append("fileNames", attachment.name);
        });

        formData.append("currentConversationId", currentConversationId);
        formData.append("receiverId", selectedUserToShow._id);
        formData.append("tempMsgId", tempMsgId);
        formData.append("text", message.trim());

        await axios.post(
          "http://localhost:2000/eco-market/chat/upload-and-send",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setTimeout(scrollToBottom, 100);
      } else {
        // Use the optimized send message endpoint if we have a conversation ID
        if (currentConversationId) {
          const response = await axios.post(
            "http://localhost:2000/eco-market/chat/optimized/send",
            {
              conversationId: currentConversationId,
              text: message.trim(),
              type: "text",
              tempMsgId: tempMsgId,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          console.log("Message sent via optimized endpoint:", response.data);
        } else {
          const newMsg = {
            senderId: account.accountID,
            receiverId: selectedUserToShow.id,
            text: message.trim(),
            type: "text",
            attachments: [],
            tempMsgId: tempMsgId,
          };
          socket.emit("send-message", newMsg);
        }
      }

      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 200);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUserToShow(user);
    setIsLoading(true);
    if (user?._id) {
      fetchChatHistory(user?._id).then(() => {
        setTimeout(scrollToBottom, 300);
      });
    }
  };

  useEffect(() => {
    console.log("[SOCKET] Component mounted, ensuring connection");

    if (!socket.connected) {
      console.log("[SOCKET] Connecting socket...");
      socket.connect();
    }

    const handleConnect = () => {
      console.log("[SOCKET] Connected with socket ID:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("[SOCKET] Disconnected");
    };

    const handleError = (error) => {
      console.error("[SOCKET] Connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, []);

  useEffect(() => {
    if (account?.accountID && socket.connected) {
      console.log("[SOCKET] Joining room with ID:", account.accountID);
      socket.emit("join-room", account.accountID);
    }
  }, [account?.accountID, socket.connected]);

  useEffect(() => {
    if (!account?.accountID) return;

    const handleMessageSent = (msg) => {
      setMessages((prev) => {
        const updatedMessages = prev.filter((m) => !m._id.startsWith("temp-"));

        const exists = updatedMessages.some((m) => m._id === msg._id);
        if (exists) return updatedMessages;

        // Store conversationId if it's included
        if (msg.conversationId && !currentConversationId) {
          setCurrentConversationId(msg.conversationId);
        }

        return [...updatedMessages, msg];
      });

      updateChatPartnerLastMessage(msg);
    };

    const handleReceiveMessage = (msg) => {
      console.log("[SOCKET] Received new message:", msg);

      if (
        account?.accountID === msg.receiverId &&
        selectedUserToShow &&
        selectedUserToShow.id === msg.senderId
      ) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;

          // Store conversationId if it's included
          if (msg.conversationId && !currentConversationId) {
            setCurrentConversationId(msg.conversationId);
          }

          if (
            selectedUserToShow &&
            selectedUserToShow.id === msg.senderId &&
            openChat
          ) {
            socket.emit("mark-as-read", {
              messageId: msg._id,
              userId: account.accountID,
            });
          }

          return [...prev, msg];
        });
      }

      updateChatPartnerLastMessage(msg);
    };

    socket.on("message-sent", handleMessageSent);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("message-sent", handleMessageSent);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [
    account?.accountID,
    selectedUserToShow?.id,
    openChat,
    currentConversationId,
  ]);

  const fetchChatHistory = async (receiver, page = 0) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:2000/eco-market/chat/optimized/messages/${receiver}?page=${page}&limit=50`,
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

        // Store conversation ID for sending messages
        setCurrentConversationId(response.data.conversationId);

        // If loading more messages (page > 0), prepend to existing messages
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
      socket.emit("stop-typing", {
        senderId: account.accountID,
        receiverId: selectedUserToShow.id,
      });
    }
  }, [selectedUserToShow, account]);

  useEffect(() => {
    socket.on("online-users", (users) => {
      console.log("[SOCKET] Online users:", users);
      setOnlineUsers(users);
    });

    socket.on("user-connected", (userId) => {
      console.log("[SOCKET] User connected:", userId);
      setOnlineUsers((prev) => [...prev, userId]);
    });

    socket.on("user-disconnected", (userId) => {
      console.log("[SOCKET] User disconnected:", userId);
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.off("online-users");
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, []);

  useEffect(() => {
    socket.on("user-typing", (data) => {
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
      socket.off("user-typing");
    };
  }, [selectedUserToShow, account?.accountID]);

  useEffect(() => {
    const markMessagesAsRead = () => {
      if (selectedUserToShow && messages.length > 0 && openChat) {
        messages.forEach((msg) => {
          if (!msg.isRead && msg.senderId === selectedUserToShow.id) {
            console.log(`[SOCKET] Marking message as read: ${msg._id}`);
            socket.emit("mark-as-read", {
              messageId: msg._id,
              userId: account?.accountID,
            });
          }
        });
      }
    };

    markMessagesAsRead();
  }, [messages, selectedUserToShow, openChat, account?.accountID]);

  useEffect(() => {
    socket.on("new-message-notification", (data) => {
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
      socket.off("new-message-notification");
    };
  }, []);

  useEffect(() => {
    socket.on("message-read", (data) => {
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg._id === data.messageId) {
            return { ...msg, status: "read" };
          }
          return msg;
        });
      });
    });

    return () => {
      socket.off("message-read");
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

      socket.emit("typing", {
        senderId: account.accountID,
        receiverId: selectedUserToShow.id,
      });

      const timeout = setTimeout(() => {
        socket.emit("stop-typing", {
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
    if (selectedUserToShow && account?.accountID) {
      setIsLoading(true);
      fetchChatHistory(selectedUserToShow._id).then(() => {
        setTimeout(scrollToBottom, 300);
        setIsLoading(false);
      });
    }
  }, [selectedUserToShow]);

  // Handle message deletion
  const handleDeleteMessage = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:2000/eco-market/chat/messages/${messageToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        // Remove message from UI
        setMessages((prev) =>
          prev.filter((msg) => msg._id !== messageToDelete)
        );

        // Emit delete event to socket
        socket.emit("delete-message", {
          messageId: messageToDelete,
          conversationId: currentConversationId,
        });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const cancelDeleteMessage = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  return (
    <>
      {openChat && (
        <Zoom in={openChat} timeout={300}>
          <Box
            className="bg-primary-gradient"
            ref={chatRef}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
              cursor: "default",
              width: { xs: "90%", sm: "80%", md: "900px" },
              maxWidth: "calc(100% - 40px)",
            }}
          >
            <StyledChatCard className="chat-container">
              <CardHeader
                title={
                  <Typography variant="h6" className="chat-header-title">
                    Tin nhắn hỗ trợ
                  </Typography>
                }
                action={
                  <IconButton onClick={toggleChat} sx={{ color: "white" }}>
                    <Close />
                  </IconButton>
                }
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                className="chat-header"
              />
              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{ display: "flex", height: { xs: "70vh", sm: "500px" } }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "40%" },
                      borderRight: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    className="chat-sidebar"
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
                          className: "message-input",
                        }}
                      />
                    </Box>

                    {/* AI Assistant chat button */}
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "rgba(25, 118, 210, 0.05)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: "rgba(25, 118, 210, 0.1)",
                        },
                      }}
                      onClick={() => {
                        setSelectedUserToShow({
                          id: "ai-assistant",
                          name: "AI Shopping Assistant",
                          avatar:
                            "https://cdn-icons-png.flaticon.com/512/4712/4712027.png",
                          isAI: true,
                        });
                        // Reset existing messages when switching to AI
                        setMessages([
                          {
                            _id: "ai-welcome",
                            senderId: "ai-assistant",
                            text: "Xin chào! Tôi là trợ lý mua sắm AI. Tôi có thể giúp bạn tìm kiếm sản phẩm dựa trên mô tả của bạn. Bạn muốn tìm sản phẩm gì?",
                            createdAt: new Date().toISOString(),
                            isRead: true,
                          },
                        ]);
                      }}
                    >
                      <Avatar
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                        alt="AI Assistant"
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          background:
                            "linear-gradient(135deg, #42a5f5, #1976d2)",
                          p: 0.5,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            color: "primary.main",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          AI Shopping Assistant
                          <Chip
                            label="AI"
                            size="small"
                            color="primary"
                            sx={{ ml: 1, height: 20, fontSize: "0.7rem" }}
                          />
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary", fontSize: "0.85rem" }}
                          noWrap
                        >
                          Tìm kiếm sản phẩm bằng trò chuyện thông minh
                        </Typography>
                      </Box>
                    </Box>

                    <div className="chat-partner-list">
                      {chatPartners.length > 0 ? (
                        chatPartners.map((partner) => (
                          <ListItem
                            key={partner._id}
                            button
                            selected={selectedUserToShow?._id === partner._id}
                            onClick={() => handleSelectUser(partner)}
                            sx={{ position: "relative" }}
                            className={`chat-partner-item ${
                              selectedUserToShow?._id === partner._id
                                ? "selected"
                                : ""
                            }`}
                          >
                            <ListItemAvatar>
                              <Badge
                                badgeContent={
                                  partner.unread > 0 ? partner.unread : null
                                }
                                color="error"
                                overlap="circular"
                                anchorOrigin={{
                                  vertical: "bottom",
                                  horizontal: "right",
                                }}
                              >
                                <StyledAvatar
                                  src={partner.avatar}
                                  alt={partner.name}
                                  isonline={
                                    onlineUsers.includes(partner.id)
                                      ? "true"
                                      : "false"
                                  }
                                  className={
                                    onlineUsers.includes(partner.id)
                                      ? "online-indicator"
                                      : ""
                                  }
                                />
                              </Badge>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography className="partner-name" noWrap>
                                  {partner.name}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography
                                    className="partner-last-message"
                                    noWrap
                                    component="span"
                                  >
                                    {formatLastMessage(partner)}
                                  </Typography>
                                  <Typography
                                    className="partner-timestamp"
                                    display="block"
                                  >
                                    {new Date(
                                      partner.lastMessageAt
                                    ).toLocaleString()}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
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
                    </div>
                  </Box>

                  <Box
                    sx={{
                      width: { xs: "100%", sm: "60%" },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      ref={chatContainerRef}
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        maxHeight: "100%",
                        height: "100%",
                      }}
                      className="chat-messages-container"
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
                        <div className="empty-chat-state">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/1067/1067566.png"
                            alt="Select a conversation"
                            className="empty-chat-illustration"
                          />
                          <Typography className="empty-chat-text">
                            Chọn một cuộc trò chuyện
                          </Typography>
                          <Typography className="empty-chat-subtext">
                            Chọn một người dùng từ danh sách bên trái để bắt đầu
                            trò chuyện
                          </Typography>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="empty-chat-state">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/1998/1998342.png"
                            alt="No messages"
                            className="empty-chat-illustration"
                          />
                          <Typography className="empty-chat-text">
                            Chưa có tin nhắn nào
                          </Typography>
                          <Typography className="empty-chat-subtext">
                            Hãy bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn
                            đầu tiên
                          </Typography>
                        </div>
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
                                <div
                                  className="messages-date-divider"
                                  key={`date-${message._id}`}
                                >
                                  <span>{messageDate}</span>
                                </div>
                              );
                            }

                            const isMe =
                              message.senderId === account?.accountID;
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
                                  {!isMe && (
                                    <StyledAvatar
                                      src={
                                        isAI
                                          ? "https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
                                          : message.senderAvatar ||
                                            "https://i.pravatar.cc/150?img=3"
                                      }
                                      sx={{ mr: 1 }}
                                      isonline={
                                        isAI ||
                                        onlineUsers.includes(message.senderId)
                                          ? "true"
                                          : "false"
                                      }
                                    />
                                  )}

                                  <MessageBubble
                                    sender={isMe ? "me" : "other"}
                                    className={`message-bubble ${
                                      isMe ? "sent" : isAI ? "ai" : "received"
                                    }`}
                                    sx={
                                      isAI
                                        ? {
                                            background:
                                              "linear-gradient(135deg, #5B86E5, #36D1DC)",
                                            color: "white",
                                            maxWidth: "80%",
                                          }
                                        : {}
                                    }
                                  >
                                    {isAI ? (
                                      <MessageContent
                                        message={message}
                                        setFullscreenImage={setFullscreenImage}
                                      />
                                    ) : (
                                      <MessageContent
                                        message={message}
                                        setFullscreenImage={setFullscreenImage}
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
                                        className="message-time"
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

                                      {isMe && !message.isPending && (
                                        <Tooltip title="Xóa tin nhắn">
                                          <IconButton
                                            size="small"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteMessage(message._id);
                                            }}
                                            sx={{
                                              opacity: 0.7,
                                              "&:hover": { opacity: 1 },
                                              color: "inherit",
                                              p: 0.3,
                                            }}
                                          >
                                            <Delete fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      )}
                                    </Box>
                                  </MessageBubble>

                                  {isMe && (
                                    <StyledAvatar
                                      src={
                                        message.senderAvatar ||
                                        "https://i.pravatar.cc/150?img=1"
                                      }
                                      sx={{ ml: 1 }}
                                      isonline={
                                        onlineUsers.includes(message.senderId)
                                          ? "true"
                                          : "false"
                                      }
                                    />
                                  )}
                                </Box>
                              </Fade>
                            );

                            return result;
                          }, [])}

                          {typingUsers[selectedUserToShow?.id] && (
                            <Box sx={{ display: "flex", ml: 2, mb: 1 }}>
                              <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </Box>
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
                              <div className="ai-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                              </div>
                            </Box>
                          )}
                        </>
                      )}
                      <div ref={messagesEndRef} />
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                      className="chat-input-container"
                    >
                      {attachments.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <div className="attachment-preview-container">
                            {attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="attachment-preview"
                              >
                                {attachment.type.startsWith("image/") ? (
                                  <img
                                    src={attachment.preview}
                                    alt={attachment.name}
                                  />
                                ) : attachment.type.startsWith("video/") ? (
                                  <video>
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
                                    }}
                                  >
                                    <InsertDriveFile />
                                  </Box>
                                )}
                                <button
                                  className="remove-attachment-btn"
                                  onClick={() =>
                                    removeAttachment(attachment.id)
                                  }
                                  title="Xóa tệp"
                                >
                                  <Delete fontSize="small" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </Box>
                      )}

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Tooltip title="Thêm tệp đính kèm" arrow>
                          <IconButton
                            className="attachment-btn"
                            onClick={handleAttachmentMenuOpen}
                            disabled={!selectedUserToShow || isLoading}
                            color="primary"
                          >
                            <AttachFile />
                          </IconButton>
                        </Tooltip>

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
                              }}
                            >
                              <Image
                                fontSize="medium"
                                color="primary"
                                sx={{ mb: 1 }}
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
                              }}
                            >
                              <VideoLibrary
                                fontSize="medium"
                                color="primary"
                                sx={{ mb: 1 }}
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
                            className: "message-input",
                          }}
                          sx={{ mr: 1 }}
                          disabled={!selectedUserToShow || isLoading}
                        />
                        <Tooltip title="Gửi tin nhắn" arrow>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={
                              (!message.trim() && attachments.length === 0) ||
                              !selectedUserToShow ||
                              isLoading
                            }
                            sx={{ minWidth: "auto", p: 1 }}
                            className="send-btn"
                          >
                            <Send />
                          </Button>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </StyledChatCard>
          </Box>
        </Zoom>
      )}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #bbb;
          border-radius: 50%;
          display: inline-block;
          margin: 0 2px;
          animation: typing 1.5s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
      {fullscreenImage && (
        <div
          className="custom-fullscreen-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleCloseFullscreen}
        >
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
            <img
              src={fullscreenImage}
              alt="Fullscreen"
              className="fullscreen-image-viewer"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.2s ease",
                userSelect: "none",
              }}
              onDoubleClick={handleDoubleClick}
              draggable="false"
            />

            <div
              style={{
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
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <Modal
          open={showDeleteConfirm}
          onClose={cancelDeleteMessage}
          aria-labelledby="delete-confirmation-modal"
          closeAfterTransition
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography
              id="delete-confirmation-modal"
              variant="h6"
              component="h2"
            >
              Xác nhận xóa
            </Typography>
            <Typography>Bạn có chắc chắn muốn xóa tin nhắn này?</Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                onClick={cancelDeleteMessage}
                color="inherit"
                variant="outlined"
              >
                Hủy
              </Button>
              <Button
                onClick={confirmDeleteMessage}
                color="error"
                variant="contained"
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default ChatBox;
