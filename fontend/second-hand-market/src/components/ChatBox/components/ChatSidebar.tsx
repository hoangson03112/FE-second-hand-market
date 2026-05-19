import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { ChatSidebarProps } from "../types/ChatBox.types";
import { Sidebar, EmptyStateContainer } from "../styles/ChatBox.styles";

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chatPartners,
  selectedUserId,
  searchQuery,
  onSearchChange,
  onSelectUser,
}) => {
  const formatLastMessageTime = (timestamp: string | Date | number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <Sidebar>
      {/* Search */}
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#999" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fff",
            },
          }}
        />
      </Box>

      {/* Chat Partners List */}
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {chatPartners.length === 0 ? (
          <EmptyStateContainer>
            <Typography variant="body2" color="textSecondary">
              No conversations yet
            </Typography>
          </EmptyStateContainer>
        ) : (
          chatPartners.map((partner) => (
            <Box
              key={partner._id}
              onClick={() => onSelectUser(partner)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "12px 16px",
                borderBottom: "1px solid #f0f0f0",
                backgroundColor:
                  selectedUserId === partner._id ? "rgba(50, 65, 85, 0.08)" : "transparent",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(50, 65, 85, 0.04)",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={partner.avatar?.url}
                  alt={partner.fullName}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                {partner.isOnline && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 2,
                      right: 18,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: "#4caf50",
                      border: "2px solid #fff",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "#324155",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {partner.fullName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#999",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {partner.lastMessage || "No messages yet"}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right", ml: 1 }}>
                <Typography variant="caption" sx={{ color: "#999", fontSize: "0.7rem" }}>
                  {formatLastMessageTime(partner.lastMessageTime || "")}
                </Typography>
                {partner.unreadCount && partner.unreadCount > 0 && (
                  <Box
                    sx={{
                      mt: 0.5,
                      backgroundColor: "#324155",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      ml: "auto",
                    }}
                  >
                    {partner.unreadCount}
                  </Box>
                )}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Sidebar>
  );
};
