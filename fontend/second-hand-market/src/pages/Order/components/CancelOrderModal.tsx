import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Alert,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const CancelOrderModal = ({ orderId, onConfirm, onClose, requireBankInfo = false }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Thêm state cho bank info
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const cancelReasons = [
    { id: "wrong_product", label: "Đặt nhầm sản phẩm" },
    { id: "change_mind", label: "Đổi ý không muốn mua nữa" },
    { id: "found_better_price", label: "Tìm được giá tốt hơn" },
    { id: "delivery_too_long", label: "Thời gian nhận hàng quá lâu" },
    { id: "change_address", label: "Muốn thay đổi địa chỉ nhận hàng" },
    { id: "other", label: "Lý do khác" },
  ];

  const handleSubmit = async () => {
    const finalReason =
      selectedReason === "other"
        ? otherReason
        : cancelReasons.find((r) => r.id === selectedReason)?.label;

    if (!finalReason?.trim()) {
      setError("Vui lòng chọn hoặc nhập lý do hủy đơn hàng");
      return;
    }
    // Validate bank info nếu cần
    if (requireBankInfo) {
      if (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()) {
        setError("Vui lòng nhập đầy đủ thông tin tài khoản ngân hàng để hoàn tiền");
        return;
      }
    }
    setIsSubmitting(true);
    try {
      // Truyền thêm bankInfo nếu cần
      const bankInfo = requireBankInfo
        ? { bankName, accountNumber, accountHolder }
        : undefined;
      onConfirm(orderId, finalReason, "cancelled", bankInfo);
      onClose();
    } catch (error) {
      setError("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
        <WarningAmberIcon color="warning" sx={{ fontSize: 32 }} />
        <Typography variant="h6" fontWeight={700}>
          Xác nhận hủy đơn hàng
        </Typography>
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography sx={{ mb: 2 }}>
          Bạn có chắc chắn muốn hủy đơn hàng này?
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Lý do hủy đơn hàng:
        </Typography>
        <RadioGroup
          value={selectedReason}
          onChange={(e) => {
            setSelectedReason(e.target.value);
            setError("");
          }}
        >
          {cancelReasons.map((reason) => (
            <FormControlLabel
              key={reason.id}
              value={reason.id}
              control={<Radio size="medium" color="primary" />}
              label={
                <Typography sx={{ fontSize: 16 }}>{reason.label}</Typography>
              }
              sx={{
                mb: 1,
                borderRadius: 2,
                pl: 1,
                backgroundColor:
                  selectedReason === reason.id ? "#f5f5f5" : "transparent",
                transition: "background 0.2s",
              }}
            />
          ))}
        </RadioGroup>
        {selectedReason === "other" && (
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            placeholder="Vui lòng nhập lý do của bạn..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        )}
        {/* Thông tin tài khoản ngân hàng nếu cần */}
        {requireBankInfo && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Thông tin tài khoản ngân hàng để hoàn tiền:
            </Typography>
            <TextField
              fullWidth
              label="Tên ngân hàng"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Số tài khoản"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Chủ tài khoản"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" variant="outlined" disabled={isSubmitting}>
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={
            isSubmitting ||
            !selectedReason ||
            (selectedReason === "other" && !otherReason.trim()) ||
            (requireBankInfo && (!bankName.trim() || !accountNumber.trim() || !accountHolder.trim()))
          }
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelOrderModal;
