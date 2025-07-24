import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

const REASONS = [
  "Sản phẩm lỗi/hỏng",
  "Không đúng mô tả",
  "Thiếu phụ kiện/quà tặng",
  "Đóng gói kém, sản phẩm bị ảnh hưởng",
  "Người mua đổi ý",
  "Khác",
];

export default function ReturnOrderModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const handleConfirm = () => {
    let finalReason = reason === "Khác" ? customReason.trim() : reason;
    if (!finalReason) {
      setError("Vui lòng chọn hoặc nhập lý do hoàn hàng.");
      return;
    }
    if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
      setError(
        "Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng để nhận tiền hoàn."
      );
      return;
    }
    setError("");
    onConfirm({ reason: finalReason, bankName, accountNumber, accountHolder });
    setReason("");
    setCustomReason("");
    setBankName("");
    setAccountNumber("");
    setAccountHolder("");
  };

  const handleClose = () => {
    setReason("");
    setCustomReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 0, boxShadow: 6 },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
        <ReplayIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Lý do hoàn hàng/hoàn tiền
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Vui lòng chọn hoặc nhập lý do để chúng tôi hỗ trợ bạn tốt nhất.
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          sx={{ mb: 2, justifyContent: "center" }}
        >
          {REASONS.map((r) => (
            <Chip
              key={r}
              label={r}
              clickable
              color={reason === r ? "error" : "default"}
              variant={reason === r ? "filled" : "outlined"}
              onClick={() => {
                setReason(r);
                setError("");
              }}
              sx={{
                mb: 1,
                fontWeight: 500,
                fontSize: 15,
                borderWidth: reason === r ? 2 : 1,
                borderStyle: "solid",
                borderColor: reason === r ? "error.main" : "grey.300",
                bgcolor: reason === r ? "error.lighter" : "background.paper",
                color: "text.primary",
                boxShadow: 0,
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: reason === r ? "error.lighter" : "grey.50",
                },
              }}
            />
          ))}
        </Stack>
        {reason === "Khác" && (
          <TextField
            fullWidth
            label="Nhập lý do chi tiết"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            multiline
            minRows={2}
            sx={{ mb: 2 }}
            autoFocus
          />
        )}
        {/* Thông tin tài khoản ngân hàng */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Thông tin tài khoản ngân hàng nhận tiền hoàn
          </Typography>
          <Stack spacing={1.5}>
            <TextField
              fullWidth
              label="Tên ngân hàng"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Số tài khoản"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              size="small"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            />
            <TextField
              fullWidth
              label="Chủ tài khoản"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              size="small"
            />
          </Stack>
        </Box>
        {error && (
          <Box sx={{ color: "error.main", mb: 1, textAlign: "center" }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2, px: 3, fontWeight: 600 }}
        >
          Xác nhận hoàn hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
