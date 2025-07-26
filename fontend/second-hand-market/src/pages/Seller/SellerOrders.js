import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Stack,
  Paper,
  Container,
  Fade,
  Tooltip,
  Skeleton,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  LocalShipping as LocalShippingIcon,
  Person as PersonIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  Notes as NotesIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import axios from "axios";
import { ghnService } from "../../services/ghnService";
import orderService from "./../../services/orderService";
import { useOrder } from "../../contexts/OrderContext";

// Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const SellerOrders = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { updateOrder } = useOrder();
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    reason: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [rejectRefundDialog, setRejectRefundDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Mock data
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await axios.get("/orders/seller/my");
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;
    if (searchQuery) {
      filtered = orders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.shippingAddress.fullName
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((order) => order.status === filterStatus);
    }
    setFilteredOrders(filtered);
  }, [searchQuery, filterStatus, orders]);

  // Status options
  const statusOptions = [
    {
      value: "pending",
      label: "Chờ xử lý",
      color: "warning",
      gradient: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
      textColor: "#E65100",
      icon: <HourglassEmptyIcon />,
      bgColor: "#FFF3E0",
      stepIndex: 0,
    },
    {
      value: "confirmed",
      label: "Đã xác nhận",
      color: "info",
      gradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
      textColor: "#1976D2",
      icon: <CheckCircleIcon />,
      bgColor: "#E3F2FD",
      stepIndex: 1,
    },
    {
      value: "shipped",
      label: "Đã gửi cho vận chuyển",
      color: "secondary",
      gradient: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
      textColor: "#7B1FA2",
      icon: <LocalShippingIcon />,
      bgColor: "#F3E5F5",
      stepIndex: 2,
    },
    {
      value: "shipping",
      label: "Đang giao hàng",
      color: "secondary",
      gradient: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)",
      textColor: "#C2185B",
      icon: <LocalShippingIcon />,
      bgColor: "#FCE4EC",
      stepIndex: 3,
    },
    {
      value: "delivered",
      label: "Đã giao hàng",
      color: "success",
      gradient: "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
      textColor: "#2E7D32",
      icon: <CheckCircleIcon />,
      bgColor: "#E8F5E8",
      stepIndex: 4,
    },
    {
      value: "completed",
      label: "Hoàn thành",
      color: "primary",
      gradient: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
      textColor: "#1976D2",
      icon: <CheckCircleIcon />,
      bgColor: "#E3F2FD",
      stepIndex: 5,
    },
    {
      value: "cancelled",
      label: "Đã hủy",
      color: "error",
      gradient: "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
      textColor: "#D32F2F",
      icon: <CancelIcon />,
      bgColor: "#FFEBEE",
      stepIndex: -1,
    },
    {
      value: "refund",
      label: "Hoàn hàng",
      color: "warning",
      gradient: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
      textColor: "#FFA000",
      icon: <RefreshIcon />,
      bgColor: "#FFF3E0",
      stepIndex: 7,
    },
  ];

  // const canUpdateOrder = (orderStatus) =>
  //   orderStatus !== "completed" && orderStatus !== "cancelled";

  // const getAvailableStatusOptions = (currentStatus) => {
  //   if (currentStatus === "completed") {
  //     return [];
  //   }
  //   if (currentStatus === "cancelled") {
  //     return [];
  //   }
  //   return statusOptions;
  // };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      reason: order.reason || "",
    });
    setUpdateDialog(true);
  };

  const handleSaveUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/orders/seller/update/${selectedOrder._id}`,
        updateData
      );

      if (selectedOrder.ghnOrderCode) {
        await ghnService.cancelOrderGHN(selectedOrder.ghnOrderCode);
      }
      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id ? response.data.order : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Có lỗi xảy ra khi cập nhật đơn hàng");
    } finally {
      setLoading(false);
      setUpdateDialog(false);
      setSelectedOrder(null);
      setUpdateData({ status: "", reason: "" });
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await axios.patch(`/orders/seller/update/${orderId}`, {
        status: "confirmed",
        reason: "",
      });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? response.data.order : order
        )
      );
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const data = await updateOrder(orderId, updateData.reason, "cancelled");
    setOrders(data.orders);
  };

  const handleAcceptRefund = async (orderId) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/orders/refund/update/${orderId}`, {
        refundDecision: "approved",
        refundDecisionReason: "",
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? response.data.order : order
        )
      );
    } catch (error) {
      setError("Có lỗi xảy ra khi chấp nhận hoàn tiền");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRefund = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `/orders/refund/update/${selectedOrder._id}`,
        {
          refundDecision: "rejected",
          refundDecisionReason: rejectReason,
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrder._id ? response.data.order : order
        )
      );
    } catch (error) {
      setError("Có lỗi xảy ra khi chấp nhận hoàn tiền");
    } finally {
      setLoading(false);
      setRejectReason("");
      setRejectRefundDialog(false);
    }
  };

  const getStatusChip = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return (
      <Chip
        icon={statusOption?.icon}
        label={statusOption?.label || status}
        sx={{
          background: statusOption?.gradient,
          color: statusOption?.textColor,
          fontWeight: 600,
          borderRadius: 2,
          px: 1,
          animation: status === "pending" ? `${pulse} 2s infinite` : "none",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: `0 4px 10px ${
              statusOption?.textColor
                ? alpha(statusOption.textColor, 0.3)
                : "#ccc"
            }`,
          },
          "& .MuiChip-icon": {
            color: statusOption?.textColor,
          },
        }}
      />
    );
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getOrderStatusStep = (status) =>
    statusOptions.find((opt) => opt.value === status)?.stepIndex || 0;

  const directMeetingSteps = [
    statusOptions.find((opt) => opt.value === "pending"),
    statusOptions.find((opt) => opt.value === "confirmed"),
    statusOptions.find((opt) => opt.value === "completed"),
    statusOptions.find((opt) => opt.value === "cancelled"),
  ];

  const OrderProgressStepper = ({ currentStatus, shippingMethod }) => {
    let steps, currentStep;
    if (shippingMethod === "direct-meeting") {
      steps = directMeetingSteps;
      // Tìm index của status hiện tại trong directMeetingSteps
      currentStep = steps.findIndex((step) => step.value === currentStatus);
      // Nếu là cancelled thì activeStep là cuối cùng
      if (currentStatus === "cancelled") currentStep = steps.length - 1;
    } else {
      steps = statusOptions.filter((opt) => opt.stepIndex >= 0);
      currentStep = steps.findIndex((step) => step.value === currentStatus);
    }
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((step) => (
            <Step key={step.value}>
              <StepLabel
                StepIconComponent={() => (
                  <Avatar
                    sx={{
                      bgcolor:
                        currentStep >=
                        steps.findIndex((s) => s.value === step.value)
                          ? step.textColor
                          : "grey.300",
                      width: 32,
                      height: 32,
                      animation:
                        currentStep ===
                        steps.findIndex((s) => s.value === step.value)
                          ? `${pulse} 1.5s infinite`
                          : "none",
                    }}
                  >
                    {step.icon}
                  </Avatar>
                )}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      currentStep >=
                      steps.findIndex((s) => s.value === step.value)
                        ? step.textColor
                        : "text.secondary",
                    fontWeight:
                      currentStep >=
                      steps.findIndex((s) => s.value === step.value)
                        ? 600
                        : 400,
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    );
  };

  const StatCard = ({ title, value, icon, color, delay }) => (
    <Fade in timeout={800} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(
            color,
            0.05
          )} 100%)`,
          border: `1px solid ${alpha(color, 0.3)}`,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 24px ${alpha(color, 0.2)}`,
          },
        }}
      >
        <CardContent sx={{ p: 2, textAlign: "center" }}>
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
              mx: "auto",
              mb: 1,
              animation: `${float} 3s ease-in-out infinite`,
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" fontWeight={700} color={color}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: orders.length,
      icon: <ShoppingCartIcon />,
      color: theme.palette.primary.main,
    },
    {
      title: "Chờ xử lý",
      value: orders.filter((o) => o.status === "pending").length,
      icon: <HourglassEmptyIcon />,
      color: theme.palette.warning.main,
    },
    {
      title: "Đã xác nhận",
      value: orders.filter((o) => o.status === "confirmed").length,
      icon: <CheckCircleIcon />,
      color: theme.palette.info.main,
    },
    {
      title: "Đang chuẩn bị",
      value: orders.filter((o) => o.status === "processing").length,
      icon: <EditIcon />,
      color: "#0277BD",
    },
    {
      title: "Đã gửi vận chuyển",
      value: orders.filter((o) => o.status === "shipped").length,
      icon: <LocalShippingIcon />,
      color: theme.palette.secondary.main,
    },
    {
      title: "Đang giao hàng",
      value: orders.filter((o) => o.status === "in_transit").length,
      icon: <LocalShippingIcon />,
      color: "#C2185B",
    },
    {
      title: "Đã giao hàng",
      value: orders.filter((o) => o.status === "delivered").length,
      icon: <CheckCircleIcon />,
      color: theme.palette.success.main,
    },
    {
      title: "Hoàn hàng",
      value: orders.filter((o) => o.status === "refund").length,
      icon: <RefreshIcon />,
      color: theme.palette.warning.main,
    },
  ];

  // Map shipping/payment method to friendly name
  const getShippingMethodLabel = (method) => {
    if (!method) return "N/A";
    switch (method) {
      case "ship-cod":
        return "Giao hàng COD";
      case "direct-meeting":
        return "Giao dịch trực tiếp";
      default:
        return method;
    }
  };
  const getPaymentMethodLabel = (method) => {
    if (!method) return "N/A";
    switch (method) {
      case "direct-meeting":
        return "Giao dịch trực tiếp";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "cod":
        return "Thanh toán khi nhận hàng";
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mx: "auto" }} />
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} key={i}>
              <Card sx={{ p: 3, borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={100} />
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={30} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={1000}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quản lý đơn hàng
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Theo dõi và quản lý đơn hàng một cách hiệu quả
          </Typography>
        </Box>
      </Fade>

      {/* Search and Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <TextField
          label="Tìm kiếm đơn hàng"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, minWidth: 200 }}
          variant="outlined"
        />
        <TextField
          select
          label="Lọc theo trạng thái"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StatCard {...stat} delay={index * 150} />
          </Grid>
        ))}
      </Grid>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            background: `linear-gradient(135deg, ${
              theme.palette.background.paper
            } 0%, ${alpha(theme.palette.grey[200], 0.5)} 100%)`,
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 80, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Không tìm thấy đơn hàng
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order, index) => {
            return (
              <Grid item xs={12} key={order._id}>
                <Fade
                  in
                  timeout={600}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: "white",
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.grey[400],
                        0.2
                      )}`,
                      "&:hover": {
                        boxShadow: `0 8px 30px ${alpha(
                          theme.palette.grey[400],
                          0.3
                        )}`,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        background: statusOptions.find(
                          (opt) => opt.value === order.status
                        )?.gradient,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          #{order.ghnOrderCode ? order.ghnOrderCode : order._id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {order.createdAt
                            ? formatDate(order.createdAt)
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 1.5,
                          alignItems: "center",
                        }}
                      >
                        {getStatusChip(order.status)}
                        {order.status === "pending" && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 1.5,
                                px: 2,
                                py: 0.5,
                                boxShadow: "0 2px 8px rgba(76, 175, 80, 0.2)",
                                "&:hover": {
                                  boxShadow:
                                    "0 4px 12px rgba(76, 175, 80, 0.3)",
                                  transform: "translateY(-1px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => handleConfirmOrder(order._id)}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 1.5,
                                px: 2,
                                py: 0.5,
                                borderWidth: 1.5,
                                "&:hover": {
                                  borderWidth: 2,
                                  transform: "translateY(-1px)",
                                },
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => handleCancelOrder(order._id)}
                            >
                              Hủy đơn
                            </Button>
                          </Box>
                        )}

                        <Tooltip title="Cập nhật trạng thái">
                          <IconButton
                            onClick={() => handleUpdateOrder(order)}
                            sx={{
                              color: theme.palette.primary.main,
                              borderRadius: 1.5,
                              "&:hover": {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.08
                                ),
                                transform: "scale(1.05)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <OrderProgressStepper
                      sx={{ mt: 4 }}
                      currentStatus={order.status}
                      shippingMethod={order.shippingMethod}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Thông tin khách hàng
                            </Typography>
                            <Stack spacing={1}>
                              <Typography>
                                <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                                {order.shippingAddress?.fullName ||
                                  order.buyerId?.fullName ||
                                  "N/A"}
                              </Typography>
                              <Typography>
                                <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                                {order.shippingAddress?.phoneNumber ||
                                  order.buyerId?.phoneNumber ||
                                  "N/A"}
                              </Typography>
                              <Typography>
                                <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                                {order.buyerId?.email || "N/A"}
                              </Typography>
                              <Typography>
                                <LocationOnIcon
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                />
                                {order.shippingAddress?.specificAddress || ""},{" "}
                                {order.shippingAddress?.ward || ""},{" "}
                                {order.shippingAddress?.district || ""},{" "}
                                {order.shippingAddress?.province || ""}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Thông tin đơn hàng
                            </Typography>
                            <Stack spacing={1}>
                              <Typography>
                                <LocalShippingIcon
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                />
                                {getShippingMethodLabel(order.shippingMethod)}
                              </Typography>
                              <Typography>
                                <AttachMoneyIcon
                                  fontSize="small"
                                  sx={{ mr: 1 }}
                                />
                                {getPaymentMethodLabel(order.paymentMethod)}
                              </Typography>
                              {order.shippingMethod === "bank_transfer" && (
                                <Typography>
                                  <Chip
                                    size="small"
                                    label={
                                      order.statusPayment
                                        ? "Đã thanh toán"
                                        : "Chưa thanh toán"
                                    }
                                    color={
                                      order.statusPayment
                                        ? "success"
                                        : "warning"
                                    }
                                    variant="outlined"
                                    sx={{ ml: 1 }}
                                  />
                                </Typography>
                              )}
                              {/* Note section in order info */}
                              {order.note && (
                                <Alert
                                  icon={<NotesIcon fontSize="inherit" />}
                                  severity="info"
                                  sx={{
                                    background:
                                      "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
                                    color: "#1976D2",
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    mt: 1,
                                  }}
                                >
                                  <b>Ghi chú:</b> {order.note}
                                </Alert>
                              )}
                            </Stack>
                          </Paper>
                        </Grid>
                        <Grid item xs={12}>
                          <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                              Sản phẩm
                            </Typography>
                            <Stack spacing={1}>
                              {order.products && order.products.length > 0 ? (
                                order.products.map((item, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      p: 1,
                                      backgroundColor: "#f5f5f5",
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Typography>
                                      {item.productId?.name || "Sản phẩm"} x
                                      {item.quantity}
                                    </Typography>
                                    <Typography>
                                      {formatCurrency(
                                        (item.productId?.price || 0) *
                                          (item.quantity || 0)
                                      )}
                                    </Typography>
                                  </Box>
                                ))
                              ) : (
                                <Typography color="text.secondary">
                                  Không có sản phẩm
                                </Typography>
                              )}
                            </Stack>
                          </Paper>
                        </Grid>
                        {/* Tổng tiền section */}
                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "#fff8e1",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography variant="subtitle1" fontWeight={600}>
                                Tổng tiền
                              </Typography>
                              <Typography
                                variant="h6"
                                color="error"
                                fontWeight={700}
                              >
                                {formatCurrency(order.totalAmount || 0)}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              mt={1}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Đã bao gồm phí vận chuyển:
                              </Typography>
                              <Typography variant="body2">
                                {formatCurrency(order.shippingFee || 0)}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Grid>
                        {/* Yêu cầu hoàn tiền - chuyển xuống dưới tổng tiền */}
                        {order.status === "refund" && (
                          <Grid item xs={12}>
                            {order.refundDecision === "pending" && (
                              <Box sx={{ my: 0.5 }}>
                                <Alert
                                  icon={false}
                                  sx={{
                                    p: 1,
                                    width: "100%",
                                    borderRadius: 1.5,
                                    fontSize: 13,
                                    display: "block",
                                    alignItems: "center",
                                    boxShadow: "0 1px 4px rgba(255,193,7,0.06)",
                                    background:
                                      "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)",
                                    border: "1px solid #FFD600",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      width: "100%",
                                      gap: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        fontSize: 13,
                                        textAlign: "left",
                                        flex: 1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      <RefreshIcon fontSize="small" />
                                      <b>Lý do:</b>{" "}
                                      {order.refundReason ||
                                        order.reason ||
                                        "Không có"}
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 0.5,
                                      }}
                                    >
                                      <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        onClick={() =>
                                          handleAcceptRefund(order._id)
                                        }
                                        sx={{
                                          minWidth: 80,
                                          fontWeight: 600,
                                          fontSize: 11,
                                          py: 0.2,
                                          borderRadius: 1,
                                        }}
                                      >
                                        Chấp nhận
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                          setSelectedOrder(order);
                                          setRejectReason("");
                                          setRejectRefundDialog(true);
                                        }}
                                        sx={{
                                          minWidth: 80,
                                          fontWeight: 600,
                                          fontSize: 11,
                                          py: 0.2,
                                          borderRadius: 1,
                                        }}
                                      >
                                        Từ chối
                                      </Button>
                                    </Box>
                                  </Box>
                                </Alert>
                              </Box>
                            )}
                            {order.refundDecision === "approved" && (
                              <Alert
                                icon={<CheckCircleIcon />}
                                severity="success"
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
                                  color: "#2E7D32",
                                  fontWeight: 500,
                                  borderRadius: 2,
                                  mt: 1,
                                }}
                              >
                                <b>Đã duyệt hoàn tiền.</b>
                              </Alert>
                            )}
                            {order.refundDecision === "rejected" && (
                              <Alert
                                icon={<CancelIcon />}
                                severity="error"
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)",
                                  color: "#D32F2F",
                                  fontWeight: 500,
                                  borderRadius: 2,
                                  mt: 1,
                                }}
                              >
                                <b>Đã từ chối hoàn tiền.</b>
                                <br />
                                <b>Lý do:</b>{" "}
                                {order.refundDecisionReason || "Không có"}
                              </Alert>
                            )}
                          </Grid>
                        )}
                        {order.status === "cancelled" && (
                          <Grid item xs={12}>
                            <Alert severity="error">
                              <b>Lý do hủy:</b> {order.reason || "Không có"}
                            </Alert>
                          </Grid>
                        )}
                        {order.status === "delivered" && (
                          <Grid item xs={12}>
                            <Alert
                              severity="success"
                              sx={{
                                background:
                                  "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)",
                                border: "1px solid #4CAF50",
                                color: "#2E7D32",
                                "& .MuiAlert-icon": {
                                  color: "#2E7D32",
                                },
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                  gutterBottom
                                >
                                  ✅ Đã giao hàng thành công
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Ngày giao:</strong>{" "}
                                  {order.deliveredAt
                                    ? formatDate(order.deliveredAt)
                                    : "N/A"}
                                </Typography>
                                {order.trackingNumber && (
                                  <Typography variant="body2">
                                    <strong>Mã vận chuyển:</strong>{" "}
                                    {order.trackingNumber}
                                  </Typography>
                                )}
                              </Box>
                            </Alert>
                          </Grid>
                        )}
                        {order.status === "in_transit" && (
                          <Grid item xs={12}>
                            <Alert
                              severity="info"
                              sx={{
                                background:
                                  "linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 100%)",
                                border: "1px solid #C2185B",
                                color: "#C2185B",
                                "& .MuiAlert-icon": {
                                  color: "#C2185B",
                                },
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                  gutterBottom
                                >
                                  🚚 Đang giao hàng
                                </Typography>
                                <Typography variant="body2">
                                  Đơn hàng đang được vận chuyển đến địa chỉ của
                                  bạn
                                </Typography>
                                {order.trackingNumber && (
                                  <Typography variant="body2">
                                    <strong>Mã vận chuyển:</strong>{" "}
                                    {order.trackingNumber}
                                  </Typography>
                                )}
                              </Box>
                            </Alert>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Update Dialog */}
      <Dialog
        open={updateDialog}
        onClose={() => setUpdateDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background:
              updateData.status === "cancelled"
                ? "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)"
                : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
            color: updateData.status === "cancelled" ? "#d32f2f" : "#1976d2",
            fontWeight: 700,
            textAlign: "center",
            borderBottom:
              updateData.status === "cancelled"
                ? "2px solid #ffcdd2"
                : "2px solid #bbdefb",
          }}
        >
          {updateData.status === "cancelled"
            ? "Hủy đơn hàng"
            : "Cập nhật trạng thái"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600}>
                Trạng thái hiện tại:
              </Typography>
              <Chip
                icon={
                  statusOptions.find((opt) => opt.value === updateData.status)
                    ?.icon
                }
                label={
                  statusOptions.find((opt) => opt.value === updateData.status)
                    ?.label || updateData.status
                }
                sx={{
                  background: statusOptions.find(
                    (opt) => opt.value === updateData.status
                  )?.gradient,
                  color: statusOptions.find(
                    (opt) => opt.value === updateData.status
                  )?.textColor,
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 1,
                  animation:
                    updateData.status === "pending"
                      ? `${pulse} 2s infinite`
                      : "none",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 10px ${
                      statusOptions.find(
                        (opt) => opt.value === updateData.status
                      )?.textColor
                        ? alpha(
                            statusOptions.find(
                              (opt) => opt.value === updateData.status
                            ).textColor,
                            0.3
                          )
                        : "#ccc"
                    }`,
                  },
                  "& .MuiChip-icon": {
                    color: statusOptions.find(
                      (opt) => opt.value === updateData.status
                    )?.textColor,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600}>
                Trạng thái mới:
              </Typography>
              <Grid container spacing={2}>
                {statusOptions.map((option) => (
                  <Grid item xs={12} sm={6} key={option.value}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border:
                          updateData.status === option.value
                            ? `2px solid ${option.textColor}`
                            : "1px solid #e0e0e0",
                        background:
                          updateData.status === option.value
                            ? option.gradient
                            : "white",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 12px ${alpha(
                            option.textColor,
                            0.2
                          )}`,
                        },
                      }}
                      onClick={() =>
                        setUpdateData({ ...updateData, status: option.value })
                      }
                    >
                      <CardContent sx={{ p: 2, textAlign: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: option.textColor,
                            width: 40,
                            height: 40,
                            mx: "auto",
                            mb: 1,
                          }}
                        >
                          {option.icon}
                        </Avatar>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color={option.textColor}
                        >
                          {option.label}
                        </Typography>
                        {updateData.status === option.value && (
                          <CheckCircleIcon
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: option.textColor,
                              fontSize: 20,
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600}>
                Lý do (nếu có):
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={updateData.reason}
                onChange={(e) =>
                  setUpdateData({ ...updateData, reason: e.target.value })
                }
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialog(false)} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleSaveUpdate}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog từ chối hoàn tiền */}
      <Dialog
        open={rejectRefundDialog}
        onClose={() => setRejectRefundDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Từ chối yêu cầu hoàn tiền</DialogTitle>
        <DialogContent>
          <Typography>Lý do từ chối:</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectRefundDialog(false)} color="primary">
            Hủy
          </Button>
          <Button
            onClick={handleRejectRefund}
            variant="contained"
            color="error"
            disabled={loading || !rejectReason.trim()}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Xác nhận từ chối"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SellerOrders;
