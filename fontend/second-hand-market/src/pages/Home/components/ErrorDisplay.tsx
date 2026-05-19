import React from "react";
import {
  Container,
  Alert,
  AlertTitle,
  Button,
  Slide,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Slide direction="up" in={!!error}>
        <Alert
          severity="error"
          sx={{ borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={onRetry}
            >
              Thử lại
            </Button>
          }
        >
          <AlertTitle>Đã xảy ra lỗi</AlertTitle>
          {error}
        </Alert>
      </Slide>
    </Container>
  );
};

export default ErrorDisplay;
