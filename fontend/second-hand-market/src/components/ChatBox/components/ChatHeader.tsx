import React from "react";
import { Box, CardHeader, Avatar, IconButton, Typography, Chip } from "@mui/material";
import { Close, ArrowBack } from "@mui/icons-material";
import { ChatHeaderProps } from "../types/ChatBox.types";
import { StyledAvatar } from "../styles/ChatBox.styles";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  onBack,
  onClose,
}) => {
  if (!selectedUser) {
    return (
      <CardHeader
        title="Messages"
        sx={{
          background: "linear-gradient(135deg, #324155 0%, #455a74 100%)",
          color: "#fff",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        action={
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <Close />
          </IconButton>
        }
      />
    );
  }

  return (
    <CardHeader
      avatar={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={onBack}
            sx={{
              color: "#fff",
              display: { xs: "flex", md: "none" },
            }}
          >
            <ArrowBack />
          </IconButton>
          <StyledAvatar
            src={selectedUser.avatar?.url}
            alt={selectedUser.fullName}
            isonline={selectedUser.isOnline ? "true" : "false"}
          />
        </Box>
      }
      title={
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#fff" }}>
          {selectedUser.fullName}
        </Typography>
      }
      subheader={
        <Chip
          label={selectedUser.isOnline ? "Online" : "Offline"}
          size="small"
          sx={{
            height: 20,
            fontSize: "0.7rem",
            backgroundColor: selectedUser.isOnline
              ? "rgba(76, 175, 80, 0.2)"
              : "rgba(158, 158, 158, 0.2)",
            color: selectedUser.isOnline ? "#4caf50" : "#9e9e9e",
            border: "none",
          }}
        />
      }
      action={
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <Close />
        </IconButton>
      }
      sx={{
        background: "linear-gradient(135deg, #324155 0%, #455a74 100%)",
        color: "#fff",
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    />
  );
};
