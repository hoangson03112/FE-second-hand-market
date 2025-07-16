import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Divider,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import {
  QrCode,
  Timer,
  Payment,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const QRPaymentDialog = ({
  onConfirm,
  onCancel,
  qrCodeUrl,
  totalAmount,
  transactionId,
  timeLimit = 900, // 15 minutes in seconds
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    setTimeRemaining(timeLimit);
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onCancel(); // Auto cancel when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLimit, onCancel]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancel();
    } finally {
      setIsCancelling(false);
    }
  };

  const progressPercentage = ((timeLimit - timeRemaining) / timeLimit) * 100;

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 3,
        p: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Payment color="primary" />
        <Typography variant="h6" fontWeight="600">
          Thanh toán chuyển khoản
        </Typography>
      </Box>
      {/* Timer */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: timeRemaining < 300 ? "error.light" : "warning.light",
          color:
            timeRemaining < 300 ? "error.contrastText" : "warning.contrastText",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Timer />
          <Typography variant="subtitle1" fontWeight="600">
            Thời gian thanh toán còn lại: {formatTime(timeRemaining)}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.3)",
            "& .MuiLinearProgress-bar": {
              bgcolor: timeRemaining < 300 ? "error.main" : "warning.main",
            },
          }}
        />
      </Paper>
      {/* QR Code */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: 3,
            display: "inline-block",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <img
            src={qrCodeUrl}
            alt="QR Code thanh toán"
            style={{
              maxWidth: "280px",
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Paper>
        <Box sx={{ mt: 2 }}>
          <QrCode sx={{ fontSize: 20, color: "text.secondary", mb: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            Quét mã QR bằng ứng dụng ngân hàng để thanh toán
          </Typography>
        </Box>
      </Box>
      {/* Payment Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
          Thông tin thanh toán
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Tổng tiền:
            </Typography>
            <Typography variant="h6" fontWeight="600" color="primary">
              {new Intl.NumberFormat("vi-VN").format(totalAmount)}₫
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mã giao dịch:
            </Typography>
            <Chip
              label={transactionId}
              size="small"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                bgcolor: "grey.100",
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* Instructions */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: "info.light",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Typography variant="subtitle2" fontWeight="600" gutterBottom>
          Hướng dẫn thanh toán:
        </Typography>
        <Typography variant="body2" component="div">
          <ol style={{ margin: 0, paddingLeft: "1.2rem" }}>
            <li>Mở ứng dụng ngân hàng trên điện thoại</li>
            <li>Quét mã QR code phía trên</li>
            <li>Kiểm tra thông tin và xác nhận thanh toán</li>
            <li>Nhấn "Đã thanh toán" sau khi chuyển khoản thành công</li>
          </ol>
        </Typography>
      </Paper>
      {timeRemaining < 60 && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "error.light",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Typography variant="body2" color="error.main" fontWeight="600">
            ⚠️ Thời gian thanh toán sắp hết! Vui lòng hoàn tất thanh toán trong{" "}
            {formatTime(timeRemaining)}.
          </Typography>
        </Paper>
      )}
      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancel}
          disabled={isConfirming || isCancelling}
          startIcon={isCancelling ? null : <Cancel />}
          sx={{ minWidth: 140 }}
        >
          {isCancelling ? "Đang hủy..." : "Hủy đơn hàng"}
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleConfirm}
          disabled={isConfirming || isCancelling}
          startIcon={isConfirming ? null : <CheckCircle />}
          sx={{ minWidth: 140 }}
        >
          {isConfirming ? "Đang xác nhận..." : "Đã thanh toán"}
        </Button>
      </Box>
    </Box>
  );
};

export default QRPaymentDialog;
