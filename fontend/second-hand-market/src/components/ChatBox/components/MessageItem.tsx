import React, { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { Delete, MoreVert } from "@mui/icons-material";
import { MessageItemProps } from "../types/ChatBox.types";
import { MessageBubble } from "../styles/ChatBox.styles";
import ImageMessage from "../MessageTypes/ImageMessage";
import VideoMessage from "../MessageTypes/VideoMessage";
import FileMessage from "../MessageTypes/FileMessage";
import ProductMessage from "../MessageTypes/ProductMessage";
import OrderMessage from "../MessageTypes/OrderMessage";

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMe,
  onDelete,
  onSetFullscreenImage,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(message._id);
    handleMenuClose();
  };

  const formatMessageTime = (timestamp: string | Date | number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessageContent = () => {
    // Handle special message types
    if (message.type === "product" && message.payload) {
      return <ProductMessage product={message.payload} />;
    }

    if (message.type === "order" && message.payload) {
      return <OrderMessage order={message.payload} />;
    }

    // Handle media attachments
    if (message.media && message.media.length > 0) {
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {message.content && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              {message.content}
            </Typography>
          )}
          {message.media.map((attachment) => {
            if (attachment.type.startsWith("image/")) {
              return (
                <ImageMessage
                  key={attachment.id}
                  attachment={attachment}
                  setFullscreenImage={onSetFullscreenImage}
                />
              );
            } else if (attachment.type.startsWith("video/")) {
              return <VideoMessage key={attachment.id} attachment={attachment} />;
            } else {
              return <FileMessage key={attachment.id} attachment={attachment} />;
            }
          })}
        </Box>
      );
    }

    // Default text message
    return (
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
        {message.content}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMe ? "flex-end" : "flex-start",
        mb: 2,
        position: "relative",
        "&:hover .message-actions": {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ maxWidth: "70%" }}>
        <MessageBubble sender={isMe ? "me" : "other"} isAI={message.isAI}>
          {renderMessageContent()}

          {/* Message Actions */}
          {isMe && (
            <Box
              className="message-actions"
              sx={{
                position: "absolute",
                top: 0,
                right: -40,
                opacity: 0,
                transition: "opacity 0.2s",
              }}
            >
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleDelete}>
                  <Delete fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </Box>
          )}
        </MessageBubble>

        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "#999",
            mt: 0.5,
            textAlign: isMe ? "right" : "left",
            fontSize: "0.7rem",
          }}
        >
          {formatMessageTime(message.timestamp || message.createdAt || Date.now())}
        </Typography>
      </Box>
    </Box>
  );
};
