import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Modal, IconButton } from "@mui/material";
import { Chat, ZoomIn, ZoomOut, Close } from "@mui/icons-material";
import AccountContext from "../../contexts/AccountContext";
import { useChat } from "../../contexts/ChatContext";

// Custom Hooks
import { useChatSocket } from "./hooks/useChatSocket";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatAttachments } from "./hooks/useChatAttachments";
import { useChatPartners } from "./hooks/useChatPartners";

// Components
import { ChatHeader } from "./components/ChatHeader";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMessageList } from "./components/ChatMessageList";
import { ChatInput } from "./components/ChatInput";
import DeleteConfirm from "./DeleteConfirm/DeleteConfirm";

// Styles
import {
  MainContainer,
  ChatContainer,
  ChatArea,
  ChatButton,
  FullscreenImageContainer,
} from "./styles/ChatBox.styles";

// Types
import { ChatMessage, ChatPartner } from "./types/ChatBox.types";

const ChatBox: React.FC = () => {
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<ChatPartner | null>(null);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Context
  const { selectedUserToShow } = useChat() as any;

  // Custom Hooks
  const {
    chatPartners,
    isLoadingPartners,
    searchQuery,
    setSearchQuery,
    updatePartnerStatus,
    updatePartnerLastMessage,
  } = useChatPartners(currentUser?._id || "");

  const {
    messages,
    isLoadingMessages,
    addMessage,
    removeMessage,
    clearMessages,
  } = useChatMessages(selectedUser?._id || null, currentUser?._id || "");

  const {
    attachments,
    isUploading,
    fileInputRef,
    removeAttachment,
    clearAttachments,
    handleFileInputChange,
    uploadAttachments,
    openFileDialog,
  } = useChatAttachments();

  // Socket Handlers
  const handleMessageReceived = useCallback(
    (msg: ChatMessage) => {
      addMessage(msg);
      
      // Update last message in sidebar
      const senderId = msg.sender._id;
      if (senderId !== currentUser?._id) {
        updatePartnerLastMessage(senderId, msg.content, msg.timestamp);
      }
    },
    [addMessage, currentUser, updatePartnerLastMessage]
  );

  const handleUserOnline = useCallback(
    (userId: string) => {
      updatePartnerStatus(userId, true);
    },
    [updatePartnerStatus]
  );

  const handleUserOffline = useCallback(
    (userId: string) => {
      updatePartnerStatus(userId, false);
    },
    [updatePartnerStatus]
  );

  const { socket, isConnected, sendMessage: socketSendMessage, deleteMessage: socketDeleteMessage } = useChatSocket({
    userId: currentUser?._id || "",
    onMessageReceived: handleMessageReceived,
    onUserOnline: handleUserOnline,
    onUserOffline: handleUserOffline,
  });

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await AccountContext.Authentication();
        if (data?.data?.account) {
          setCurrentUser(data.data.account);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Handle selected user from context
  useEffect(() => {
    if (selectedUserToShow) {
      setSelectedUser(selectedUserToShow);
      setIsOpen(true);
    }
  }, [selectedUserToShow]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handlers
  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectUser = (user: ChatPartner) => {
    setSelectedUser(user);
    clearMessages();
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachments.length === 0) || !selectedUser || isSending) {
      return;
    }

    setIsSending(true);

    try {
      // Upload attachments if any
      let mediaFiles: any[] = [];
      if (attachments.length > 0) {
        mediaFiles = await uploadAttachments();
      }

      // Prepare message data
      const messageData = {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        content: message.trim(),
        media: mediaFiles,
        type: mediaFiles.length > 0 ? "media" : "text",
      };

      // Send via socket
      socketSendMessage(messageData);

      // Optimistically add message to UI
      const optimisticMessage: ChatMessage = {
        _id: `temp-${Date.now()}`,
        sender: {
          _id: currentUser._id,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar,
        },
        receiver: {
          _id: selectedUser._id,
          fullName: selectedUser.fullName,
          avatar: selectedUser.avatar,
        },
        content: message.trim(),
        media: mediaFiles.map((file, idx) => ({
          id: idx,
          type: file.type,
          url: file.url,
          name: file.name,
          _id: file._id,
        })),
        type: "text",
        timestamp: new Date().toISOString(),
      };

      addMessage(optimisticMessage);

      // Update last message in sidebar
      updatePartnerLastMessage(selectedUser._id, message.trim(), new Date().toISOString());

      // Clear input
      setMessage("");
      clearAttachments();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMessage = () => {
    if (messageToDelete) {
      socketDeleteMessage(messageToDelete);
      removeMessage(messageToDelete);
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
    }
  };

  const cancelDeleteMessage = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  const handleSetFullscreenImage = (src: string) => {
    setFullscreenImage(src);
    setZoomLevel(1);
  };

  const handleCloseFullscreenImage = () => {
    setFullscreenImage(null);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <MainContainer>
        {!isOpen ? (
          <ChatButton onClick={handleToggleChat}>
            <Chat />
          </ChatButton>
        ) : (
          <ChatContainer>
            {/* Sidebar - Always show on desktop, hide on mobile when user selected */}
            <ChatSidebar
              chatPartners={chatPartners}
              selectedUserId={selectedUser?._id || null}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectUser={handleSelectUser}
            />

            {/* Chat Area */}
            <ChatArea>
              <ChatHeader
                selectedUser={selectedUser}
                onBack={handleBackToList}
                onClose={handleToggleChat}
              />

              {selectedUser ? (
                <>
                  <ChatMessageList
                    messages={messages}
                    currentUserId={currentUser._id}
                    isLoadingMessages={isLoadingMessages}
                    messagesEndRef={messagesEndRef}
                    onDeleteMessage={handleDeleteMessage}
                    onSetFullscreenImage={handleSetFullscreenImage}
                  />

                  <ChatInput
                    message={message}
                    attachments={attachments}
                    isSending={isSending || isUploading}
                    onMessageChange={setMessage}
                    onSendMessage={handleSendMessage}
                    onAttachFile={openFileDialog}
                    onRemoveAttachment={removeAttachment}
                    fileInputRef={fileInputRef}
                    onFileInputChange={handleFileInputChange}
                  />
                </>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  Select a conversation to start messaging
                </Box>
              )}
            </ChatArea>
          </ChatContainer>
        )}
      </MainContainer>

      {/* Delete Confirmation Modal */}
      <DeleteConfirm
        showDeleteConfirm={showDeleteConfirm}
        cancelDeleteMessage={cancelDeleteMessage}
        confirmDeleteMessage={confirmDeleteMessage}
      />

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <Modal open={Boolean(fullscreenImage)} onClose={handleCloseFullscreenImage}>
          <FullscreenImageContainer zoomLevel={zoomLevel}>
            <IconButton
              onClick={handleCloseFullscreenImage}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <Close />
            </IconButton>

            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
              }}
            >
              <IconButton
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ZoomOut />
              </IconButton>
              <IconButton
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                sx={{
                  color: "#fff",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ZoomIn />
              </IconButton>
            </Box>

            <img
              src={fullscreenImage}
              alt="Fullscreen"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.3s",
              }}
            />
          </FullscreenImageContainer>
        </Modal>
      )}
    </>
  );
};

export default ChatBox;
