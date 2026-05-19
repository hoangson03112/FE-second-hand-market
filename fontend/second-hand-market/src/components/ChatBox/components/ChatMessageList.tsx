import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ChatMessageListProps } from "../types/ChatBox.types";
import { MessagesContainer, LoadingContainer, EmptyStateContainer } from "../styles/ChatBox.styles";
import { MessageItem } from "./MessageItem";

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentUserId,
  isLoadingMessages,
  messagesEndRef,
  onDeleteMessage,
  onSetFullscreenImage,
}) => {
  if (isLoadingMessages) {
    return (
      <MessagesContainer>
        <LoadingContainer>
          <CircularProgress sx={{ color: "#324155" }} />
          <Typography variant="body2" sx={{ mt: 2, color: "#999" }}>
            Loading messages...
          </Typography>
        </LoadingContainer>
      </MessagesContainer>
    );
  }

  if (messages.length === 0) {
    return (
      <MessagesContainer>
        <EmptyStateContainer>
          <Typography variant="h6" sx={{ color: "#324155", mb: 1 }}>
            No messages yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#999" }}>
            Start a conversation by sending a message
          </Typography>
        </EmptyStateContainer>
      </MessagesContainer>
    );
  }

  return (
    <MessagesContainer>
      {messages.map((message) => (
        <MessageItem
          key={message._id}
          message={message}
          isMe={message.sender._id === currentUserId}
          onDelete={onDeleteMessage}
          onSetFullscreenImage={onSetFullscreenImage}
        />
      ))}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};
