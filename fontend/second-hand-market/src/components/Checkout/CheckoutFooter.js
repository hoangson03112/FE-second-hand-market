import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Security,
  Lock,
  ShieldOutlined,
  VerifiedUser,
} from "@mui/icons-material";

const CheckoutFooter = ({
  onPlaceOrder,
  isLoading = false,
  hasPaymentOrders = true,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 4,
        mt: 3,
        backgroundColor: "white",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Security Information */}
        <Box sx={{ flex: 1, mb: { xs: 2, md: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <ShieldOutlined
              sx={{ mr: 1, color: "text.primary", fontSize: 20 }}
            />
            <Typography variant="subtitle1" fontWeight="600">
              {hasPaymentOrders
                ? "Cam kết bảo mật thanh toán"
                : "Cam kết bảo mật giao dịch"}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            Nhấn "{hasPaymentOrders ? "Đặt hàng" : "Xác nhận đơn hàng"}" đồng
            nghĩa với việc bạn đồng ý tuân theo{" "}
            <Typography
              component="a"
              href="/terms"
              color="primary"
              sx={{ textDecoration: "none" }}
            >
              Điều khoản sử dụng
            </Typography>{" "}
            và{" "}
            <Typography
              component="a"
              href="/privacy"
              color="primary"
              sx={{ textDecoration: "none" }}
            >
              Chính sách bảo mật
            </Typography>{" "}
            của chúng tôi.
          </Typography>
        </Box>

        {/* Order Action */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", md: "center" },
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Security />
              )
            }
            onClick={isLoading ? undefined : onPlaceOrder}
            disabled={isLoading}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1rem",
              fontWeight: "600",
              minWidth: { xs: "auto", md: 200 },
              "&:disabled": {
                backgroundColor: "grey.300",
              },
            }}
          >
            {isLoading
              ? "Đang xử lý..."
              : hasPaymentOrders
              ? "Đặt hàng"
              : "Xác nhận đơn hàng"}
          </Button>
        </Box>
      </Box>

      {/* Security Badges */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mt: 2,
          pt: 2,
          borderTop: "1px solid",
          borderColor: "grey.200",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <VerifiedUser sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            SSL Encrypted
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Security sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            {hasPaymentOrders ? "Safe Payment" : "Safe Transaction"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ShieldOutlined sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Data Protection
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CheckoutFooter;
