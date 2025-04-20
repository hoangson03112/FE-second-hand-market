import React, { useRef, useEffect, useState } from "react";
import { Send, Close, Search } from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  List,
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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { io } from "socket.io-client";
import AccountContext from "../../contexts/AccountContext";
import axios from "axios";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";

const socket = io("http://localhost:2000");

export const ChatBox = ({ isOpen, toggleChat, initialPartner = null }) => {
  const [hasScroll, setHasScroll] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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

  useEffect(() => {
    const fetchChatPartners = async () => {
      try {
        const response = await axios.get(
          "http://localhost:2000/eco-market/chat/partners",
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Format date function for consistent display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toLocaleString();
    }
    return date.toLocaleString();
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedUser || !account?.accountID) {
      console.warn("[ACTION] Không thể gửi: thiếu dữ liệu", {
        message,
        selectedUser,
        account,
      });
      return;
    }

    const newMsg = {
      senderId: account.accountID,
      receiverId: selectedUser.id,
      text: message,
    };

    socket.emit("send-message", newMsg);
    setMessage("");
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchChatHistory(user.id);
  };

  useEffect(() => {
    console.log("[SOCKET] Component mounted, ensuring connection");

    // Ensure connection is established
    if (!socket.connected) {
      console.log("[SOCKET] Connecting socket...");
      socket.connect();
    }

    // Handle socket connect/disconnect events
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

    // Cleanup on component unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);

      // Don't disconnect on unmount to maintain connection across app
      // socket.disconnect();
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

    // Handle sent messages (confirmation)
    const handleMessageSent = (msg) => {
      console.log("[SOCKET] Message sent confirmation:", msg);
      setMessages((prev) => {
        // Check if message already exists
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    // Handle receiving messages
    const handleReceiveMessage = (msg) => {
      console.log("[SOCKET] Received new message:", msg);

      // Only add if from current selected user AND it's a message to us
      if (
        account?.accountID === msg.receiverId &&
        selectedUser &&
        selectedUser.id === msg.senderId
      ) {
        setMessages((prev) => {
          // Check if message already exists
          const exists = prev.some((m) => m._id === msg._id);
          if (exists) return prev;

          // Mark as read if we're viewing this conversation and it's visible
          if (selectedUser && selectedUser.id === msg.senderId && isOpen) {
            socket.emit("mark-as-read", {
              messageId: msg._id,
              userId: account.accountID,
            });
          }

          return [...prev, msg];
        });
      }

      // Update chat partners list regardless of whether message is displayed
      if (account?.accountID === msg.receiverId) {
        setChatPartners((prev) => {
          const partnerIndex = prev.findIndex((p) => p.id === msg.senderId);
          if (partnerIndex === -1) {
            // Partner not in list, fetch updated list
            // (In a real implementation, you might want to make an API call here)
            return prev;
          }

          // Update unread count
          const newPartners = [...prev];
          newPartners[partnerIndex] = {
            ...newPartners[partnerIndex],
            lastMessage: msg.text,
            lastMessageAt: msg.createdAt,
            unread: (newPartners[partnerIndex].unread || 0) + 1,
          };
          return newPartners;
        });
      }
    };

    socket.on("message-sent", handleMessageSent);
    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("message-sent", handleMessageSent);
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [account?.accountID, selectedUser?.id, isOpen]);

  const fetchChatHistory = async (receiver) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:2000/eco-market/chat/messages/${receiver}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("[ERROR] Chi tiết lỗi:", error);
    } finally {
      setIsLoading(false);
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

    if (isOpen) {
      scrollToBottom();
      checkForScroll();
    }
  }, [isOpen]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
    if (!token) {
      console.log("No token found, redirecting to login");
      // Redirect to login
    }
  }, []);

  // Clear typing indicator when switching conversations
  useEffect(() => {
    if (selectedUser && account?.accountID) {
      socket.emit("stop-typing", {
        senderId: account.accountID,
        receiverId: selectedUser.id,
      });
    }
  }, [selectedUser, account]);

  // Handle online users - update to support new events
  useEffect(() => {
    // Initial online users list
    socket.on("online-users", (users) => {
      console.log("[SOCKET] Online users:", users);
      setOnlineUsers(users);
    });

    // Individual user connects
    socket.on("user-connected", (userId) => {
      console.log("[SOCKET] User connected:", userId);
      setOnlineUsers((prev) => [...prev, userId]);
    });

    // Individual user disconnects
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

  // Handle typing indicator
  useEffect(() => {
    socket.on("user-typing", (data) => {
      // Only show typing indicator if:
      // 1. We have a selected user
      // 2. The sender is the selected user
      // 3. The receiver is the current user
      if (
        selectedUser &&
        data.senderId === selectedUser.id &&
        data.receiverId === account?.accountID
      ) {
        console.log("[SOCKET] User typing:", data);
        setTypingUsers((prev) => ({ ...prev, [data.senderId]: data.typing }));
      }
    });

    return () => {
      socket.off("user-typing");
    };
  }, [selectedUser, account?.accountID]);

  // Handle marking messages as read - update to send own user ID
  useEffect(() => {
    const markMessagesAsRead = () => {
      if (selectedUser && messages.length > 0 && isOpen) {
        messages.forEach((msg) => {
          if (!msg.isRead && msg.senderId === selectedUser.id) {
            console.log(`[SOCKET] Marking message as read: ${msg._id}`);
            socket.emit("mark-as-read", {
              messageId: msg._id,
              userId: account?.accountID, // Include current user ID
            });
          }
        });
      }
    };

    markMessagesAsRead();
  }, [messages, selectedUser, isOpen, account?.accountID]);

  // Handle new message notifications
  useEffect(() => {
    socket.on("new-message-notification", (data) => {
      // Update unread count for the relevant user
      setChatPartners((prev) => {
        return prev.map((partner) => {
          if (partner.id === data.senderId) {
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

  // Handle message read status
  useEffect(() => {
    socket.on("message-read", (data) => {
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg._id === data.messageId) {
            return { ...msg, isRead: true };
          }
          return msg;
        });
      });
    });

    return () => {
      socket.off("message-read");
    };
  }, []);

  const MessageBubble = styled(Box)(({ theme, sender }) => ({
    maxWidth: "70%",
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    backgroundColor:
      sender === "me" ? theme.palette.primary.main : theme.palette.grey[200],
    color:
      sender === "me"
        ? theme.palette.primary.contrastText
        : theme.palette.text.primary,
    alignSelf: sender === "me" ? "flex-end" : "flex-start",
    wordBreak: "break-word",
  }));

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

    // Send typing indicator
    if (selectedUser && account?.accountID) {
      // Clear existing timeout
      if (typingTimeout) clearTimeout(typingTimeout);

      // Emit typing event
      socket.emit("typing", {
        senderId: account.accountID,
        receiverId: selectedUser.id,
      });

      // Set timeout to stop typing
      const timeout = setTimeout(() => {
        socket.emit("stop-typing", {
          senderId: account.accountID,
          receiverId: selectedUser.id,
        });
      }, 2000);

      setTypingTimeout(timeout);
    }
  };

  return (
    <>
      {isOpen && (
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
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader
              title="Chat"
              action={
                <IconButton onClick={toggleChat}>
                  <Close />
                </IconButton>
              }
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: "flex", height: "500px" }}>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "40%" },
                    borderRight: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {chatPartners.map((partner) => (
                    <ListItem
                      key={partner.id}
                      button
                      selected={selectedUser?.id === partner.id}
                      onClick={() => handleSelectUser(partner)}
                      sx={{ position: "relative" }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={partner.unread}
                          color="error"
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        >
                          <Avatar
                            src={partner.avatar}
                            alt={partner.name}
                            sx={{
                              border: onlineUsers.includes(partner.id)
                                ? "2px solid #4caf50"
                                : "none",
                            }}
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={partner.name}
                        secondary={
                          <>
                            <Typography noWrap component="span">
                              {partner.lastMessage}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {new Date(partner.lastMessageAt).toLocaleString()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </Box>

                {/* Chat Area */}
                <Box
                  sx={{
                    width: { xs: "100%", sm: "60%" },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Messages list */}
                  <Box
                    ref={chatContainerRef}
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {isLoading ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Close />
                      </Box>
                    ) : (
                      <>
                        {messages?.map((message, index) => {
                          const isMe = message.senderId === account?.accountID;

                          return (
                            <Box
                              key={message._id}
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
                                <Avatar
                                  src={
                                    message.senderAvatar ||
                                    "https://i.pravatar.cc/150?img=3"
                                  }
                                  sx={{ mr: 1 }}
                                />
                              )}

                              <MessageBubble sender={isMe ? "me" : "other"}>
                                <Typography
                                  variant="body2"
                                  sx={{ wordBreak: "break-word" }}
                                >
                                  {message.text}
                                </Typography>
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
                                  {isMe && (
                                    <MarkChatReadIcon
                                      fontSize="small"
                                      sx={{
                                        fontSize: 14,
                                        color: message.isRead
                                          ? "#4caf50"
                                          : "inherit",
                                        opacity: 0.7,
                                      }}
                                    />
                                  )}
                                </Box>
                              </MessageBubble>

                              {isMe && (
                                <Avatar
                                  src={
                                    message.senderAvatar ||
                                    "https://i.pravatar.cc/150?img=1"
                                  }
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          );
                        })}
                        {typingUsers[selectedUser?.id] && (
                          <Box sx={{ display: "flex", ml: 2, mb: 1 }}>
                            <div className="typing-indicator">
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

                  {/* Input area */}
                  <Box
                    sx={{
                      p: 2,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        fullWidth
                        placeholder="Type a message"
                        variant="outlined"
                        size="small"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        sx={{ mr: 1 }}
                        disabled={!selectedUser || isLoading}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || !selectedUser || isLoading}
                        sx={{ minWidth: "auto", p: 1 }}
                      >
                        <Send />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
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
    </>
  );
};

export default ChatBox;
