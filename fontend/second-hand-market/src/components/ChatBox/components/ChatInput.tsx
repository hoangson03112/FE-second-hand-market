import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";
import { Send, AttachFile, Close } from "@mui/icons-material";
import { ChatInputProps } from "../types/ChatBox.types";
import { AttachmentPreviewContainer, AttachmentPreviewItem } from "../styles/ChatBox.styles";

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  attachments,
  isSending,
  onMessageChange,
  onSendMessage,
  onAttachFile,
  onRemoveAttachment,
  fileInputRef,
  onFileInputChange,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <Box>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <AttachmentPreviewContainer>
          {attachments.map((attachment) => (
            <AttachmentPreviewItem key={attachment.id}>
              {attachment.type.startsWith("image/") ? (
                <img
                  src={attachment.preview}
                  alt={attachment.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 1,
                  }}
                >
                  <AttachFile sx={{ fontSize: 24, color: "#324155" }} />
                  <Box
                    sx={{
                      fontSize: "0.65rem",
                      color: "#666",
                      textAlign: "center",
                      mt: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {attachment.name}
                  </Box>
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => onRemoveAttachment(attachment.id)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#fff",
                  width: 20,
                  height: 20,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <Close sx={{ fontSize: 14 }} />
              </IconButton>
            </AttachmentPreviewItem>
          ))}
        </AttachmentPreviewContainer>
      )}

      {/* Input Field */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          padding: "16px 20px",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={onFileInputChange}
          style={{ display: "none" }}
        />

        <IconButton
          onClick={onAttachFile}
          disabled={isSending}
          sx={{
            color: "#324155",
            "&:hover": { backgroundColor: "rgba(50, 65, 85, 0.08)" },
          }}
        >
          <AttachFile />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isSending}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "#f8f9fa",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "rgba(50, 65, 85, 0.2)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#324155",
              },
            },
          }}
        />

        <IconButton
          onClick={onSendMessage}
          disabled={isSending || (!message.trim() && attachments.length === 0)}
          sx={{
            backgroundColor: "#324155",
            color: "#fff",
            "&:hover": { backgroundColor: "#455a74" },
            "&:disabled": {
              backgroundColor: "#e0e0e0",
              color: "#999",
            },
          }}
        >
          {isSending ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : <Send />}
        </IconButton>
      </Box>
    </Box>
  );
};
