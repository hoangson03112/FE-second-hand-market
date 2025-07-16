import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  LinearProgress,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  ReceiptLong as ReceiptLongIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingCart as ShoppingCartIcon,
  Storefront as StorefrontIcon,
  Recycling as RecyclingIcon,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useOrder } from "../../contexts/OrderContext";
import { useNavigate } from "react-router-dom";
// Tạo một theme cơ bản để sử dụng màu sắc nhất quán
const theme = createTheme({
  palette: {
    success: {
      main: "#4CAF50",
      light: "#e8f5e9",
      contrastText: "#fff",
    },
    error: {
      main: "#F44336",
      light: "#ffebee",
    },
    warning: {
      main: "#FF9800",
    },
  },
});

// Mock functions for demo purposes
const useQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    get: (key) =>
      params.get(key) ||
      (key === "orderId"
        ? "ECO123456"
        : key === "status"
        ? "success"
        : key === "id"
        ? "TXN789012"
        : key === "orderCode"
        ? "PAYOS345678"
        : key === "code"
        ? "CONF999"
        : null),
  };
};

const PaymentSuccessPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("pending");
  const [countdown, setCountdown] = useState(5);
  const { updatePaymentStatus } = useOrder();
  const orderId = query.get("orderId");
  const code = query.get("code");
  const id = query.get("id");
  const status = query.get("status");
  const orderCode = query.get("orderCode");

  // Simulate API call - Logic remains the same
  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        setLoading(true);
        const updateOrder = await updatePaymentStatus(orderId, "success");
        console.log(updateOrder);
        setApiStatus("success");
      } catch (error) {
        console.error("Error updating order status:", error);
        setApiStatus("error");
      } finally {
        setLoading(false);
      }
    };
    updateOrderStatus();
  }, []);

  // Countdown timer - Logic remains the same
  useEffect(() => {
    if (apiStatus === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (apiStatus === "success" && countdown === 0) {
      navigate("/eco-market/customer/orders");
    }
  }, [apiStatus, countdown, navigate]);

  const formatOrderId = (id) => (id ? `#${id.toUpperCase()}` : "N/A");

  // Helper function to map status to MUI color props
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  // --- Render Functions for different states ---

  const renderLoading = () => (
    <Container maxWidth="sm">
      <Card sx={{ mt: 8, p: 4, textAlign: "center" }}>
        <CardContent>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" component="h2" gutterBottom>
            Đang xử lý thanh toán...
          </Typography>
          <Typography color="text.secondary">
            Vui lòng chờ trong giây lát, hệ thống đang cập nhật đơn hàng của
            bạn.
          </Typography>
          <LinearProgress sx={{ mt: 4 }} />
        </CardContent>
      </Card>
    </Container>
  );

  const renderError = () => (
    <Container maxWidth="sm">
      <Card
        sx={{
          mt: 8,
          p: 4,
          textAlign: "center",
          backgroundColor: "error.light",
        }}
      >
        <CardContent>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography
            variant="h5"
            component="h2"
            color="error.dark"
            gutterBottom
          >
            Có lỗi xảy ra!
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Không thể cập nhật trạng thái đơn hàng. Vui lòng liên hệ bộ phận hỗ
            trợ để được giúp đỡ.
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => navigate("/eco-market/customer/orders")}
          >
            Về trang đơn hàng
          </Button>
        </CardContent>
      </Card>
    </Container>
  );

  const renderSuccess = () => (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Grid container spacing={3}>
        {/* Main Success Card */}
        <Grid item xs={12}>
          <Card
            sx={{
              textAlign: "center",
              p: 4,
              bgcolor: "success.main",
              color: "white",
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 80, mb: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Thanh toán thành công!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
              Cảm ơn bạn đã mua sắm tại EcoMarket
            </Typography>
            <Chip
              icon={<RecyclingIcon />}
              label="Bạn đã góp phần bảo vệ môi trường bằng cách tái sử dụng!"
              color="success"
              sx={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            />
            {countdown > 0 && (
              <Typography sx={{ mt: 2, opacity: 0.8 }}>
                Tự động chuyển đến trang đơn hàng trong {countdown}s
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Order Details Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <ReceiptLongIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Thông tin đơn hàng
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailItem
                    label="Mã đơn hàng"
                    value={formatOrderId(orderId)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Mã giao dịch" value={id || "N/A"} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailItem label="Mã PayOS" value={orderCode || "N/A"} />
                </Grid>
                {code && (
                  <Grid item xs={12} sm={6}>
                    <DetailItem label="Mã xác thực" value={code} />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    textTransform="uppercase"
                  >
                    Trạng thái
                  </Typography>
                  <Chip
                    label={status || "Unknown"}
                    color={getStatusColor(status)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Next Steps Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                <LocalShippingIcon color="warning" />
                <Typography variant="h6" component="h3">
                  Bước tiếp theo
                </Typography>
              </Stack>
              <Divider sx={{ mb: 3 }} />
              <Stack spacing={2}>
                <StepItem
                  text="Đơn hàng đã được xác nhận"
                  color="success.main"
                />
                <StepItem
                  text="Người bán đang chuẩn bị hàng"
                  color="warning.main"
                />
                <StepItem text="Đang vận chuyển" color="grey.400" />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            mt={2}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate("/eco-market/customer/orders")}
            >
              Xem đơn hàng của tôi
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<StorefrontIcon />}
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );

  if (loading) return renderLoading();
  if (apiStatus === "error") return renderError();
  return renderSuccess();
};

// --- Helper Components for cleaner rendering ---

const DetailItem = ({ label, value }) => (
  <Box>
    <Typography
      variant="caption"
      color="text.secondary"
      display="block"
      textTransform="uppercase"
    >
      {label}
    </Typography>
    <Typography fontWeight="medium" sx={{ wordBreak: "break-all" }}>
      {value}
    </Typography>
  </Box>
);

const StepItem = ({ text, color }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
    <Typography
      variant="body2"
      sx={{ color: color === "grey.400" ? "text.disabled" : "text.primary" }}
    >
      {text}
    </Typography>
  </Stack>
);

// The final export wraps the component with ThemeProvider
const PaymentSuccessPageWithTheme = () => (
  <ThemeProvider theme={theme}>
    <PaymentSuccessPage />
  </ThemeProvider>
);

export default PaymentSuccessPageWithTheme;
