import { styled, keyframes } from "@mui/material/styles";
import { Box, Card, Avatar, IconButton } from "@mui/material";
import {
  TypingDotProps,
  FullscreenImageProps,
  StyledAvatarProps,
  MessageBubbleProps,
} from "../types/ChatBox.types";

// Keyframe Animations
export const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pulse = keyframes`
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

export const typing = keyframes`
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-4px);
  }
  50% {
    transform: translateY(0);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled Components
export const MainContainer = styled(Box)({
  position: "fixed",
  bottom: 20,
  right: 20,
  zIndex: 9999,
  fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
});

export const ChatContainer = styled(Card)({
  width: 900,
  height: 600,
  display: "flex",
  boxShadow: "0 12px 48px rgba(0, 0, 0, 0.15)",
  borderRadius: 16,
  overflow: "hidden",
  animation: `${slideUp} 0.3s ease-out`,
  "@media (max-width: 768px)": {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
    bottom: 0,
    right: 0,
  },
});

export const Sidebar = styled(Box)({
  width: 300,
  borderRight: "1px solid #e0e0e0",
  display: "flex",
  flexDirection: "column",
  background: "#f8f9fa",
  "@media (max-width: 768px)": {
    width: "100%",
    borderRight: "none",
  },
});

export const ChatArea = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: "#fff",
});

export const MessagesContainer = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%)",
  "&::-webkit-scrollbar": {
    width: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#ccc",
    borderRadius: 3,
    "&:hover": {
      background: "#aaa",
    },
  },
});

export const MessageBubble = styled(Box)<MessageBubbleProps>(({ sender, isAI }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius: sender === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
  marginBottom: 8,
  wordWrap: "break-word",
  animation: `${fadeIn} 0.2s ease-in`,
  background:
    sender === "me"
      ? "linear-gradient(135deg, #324155 0%, #455a74 100%)"
      : isAI
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "#e9ecef",
  color: sender === "me" || isAI ? "#fff" : "#333",
  boxShadow:
    sender === "me"
      ? "0 2px 8px rgba(50, 65, 85, 0.2)"
      : "0 2px 8px rgba(0, 0, 0, 0.08)",
}));

export const StyledAvatar = styled(Avatar)<StyledAvatarProps>(({ isonline }) => ({
  width: 40,
  height: 40,
  border: isonline === "true" ? "2px solid #4caf50" : "2px solid transparent",
  animation: isonline === "true" ? `${pulse} 2s infinite` : "none",
}));

export const ChatButton = styled(IconButton)({
  width: 60,
  height: 60,
  backgroundColor: "#324155",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(50, 65, 85, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#455a74",
    transform: "scale(1.05)",
    boxShadow: "0 6px 16px rgba(50, 65, 85, 0.4)",
  },
  animation: `${pulse} 2s infinite`,
});

export const BackButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("md")]: {
    display: "flex",
  },
}));

export const TypingDot = styled("span")<TypingDotProps>(({ delay }) => ({
  display: "inline-block",
  width: 6,
  height: 6,
  borderRadius: "50%",
  backgroundColor: "#999",
  margin: "0 2px",
  animation: `${typing} 1.4s infinite`,
  animationDelay: delay,
}));

export const FullscreenImageContainer = styled(Box)<FullscreenImageProps>(
  ({ zoomLevel }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
    cursor: zoomLevel > 1 ? "grab" : "default",
    overflow: "hidden",
    "&:active": {
      cursor: zoomLevel > 1 ? "grabbing" : "default",
    },
  })
);

export const AttachmentPreviewContainer = styled(Box)({
  display: "flex",
  gap: 8,
  padding: "8px 16px",
  overflowX: "auto",
  backgroundColor: "#f8f9fa",
  borderTop: "1px solid #e0e0e0",
  "&::-webkit-scrollbar": {
    height: 4,
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#ccc",
    borderRadius: 2,
  },
});

export const AttachmentPreviewItem = styled(Box)({
  position: "relative",
  minWidth: 80,
  height: 80,
  borderRadius: 8,
  overflow: "hidden",
  backgroundColor: "#e9ecef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const LoadingContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#324155",
});

export const EmptyStateContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  color: "#999",
  padding: 20,
  textAlign: "center",
});
