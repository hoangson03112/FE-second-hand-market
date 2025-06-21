import React from "react";
import { Snackbar, Alert, AlertTitle, Slide } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom transition for slide up effect
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

// Styled Alert for better appearance
const StyledAlert = styled(Alert)(({ theme, severity }) => ({
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  minWidth: 300,
  fontSize: "0.95rem",
  fontWeight: 500,
  "& .MuiAlert-icon": {
    fontSize: "1.5rem",
  },
  "& .MuiAlert-message": {
    padding: "4px 0",
  },
  // Custom colors for different severity levels
  ...(severity === "success" && {
    backgroundColor: "#e8f5e8",
    color: "#2e7d32",
    "& .MuiAlert-icon": {
      color: "#2e7d32",
    },
  }),
  ...(severity === "error" && {
    backgroundColor: "#ffeaea",
    color: "#d32f2f",
    "& .MuiAlert-icon": {
      color: "#d32f2f",
    },
  }),
  ...(severity === "warning" && {
    backgroundColor: "#fff3e0",
    color: "#f57c00",
    "& .MuiAlert-icon": {
      color: "#f57c00",
    },
  }),
  ...(severity === "info" && {
    backgroundColor: "#e3f2fd",
    color: "#1976d2",
    "& .MuiAlert-icon": {
      color: "#1976d2",
    },
  }),
}));

const NotificationSnackbar = ({
  open,
  message,
  severity = "info",
  autoHideDuration = 6000,
  onClose,
  title,
  action,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        mt: 2,
        "& .MuiSnackbar-root": {
          top: "24px !important",
        },
      }}
    >
      <StyledAlert
        onClose={onClose}
        severity={severity}
        variant="filled"
        action={action}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </StyledAlert>
    </Snackbar>
  );
};

export default NotificationSnackbar;
