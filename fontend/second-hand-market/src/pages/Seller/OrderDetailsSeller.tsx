import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
  Divider,
  Button,
  Chip,
  StepConnector,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  LocalShipping,
  Inventory,
  CheckCircle,
  LocationOn,
  Person,
  Phone,
  EventNote,
  CreditCard,
  Assignment,
  ShoppingBag,
} from "@mui/icons-material";
import ApiService from "../../services/ApiService";

// Custom styled stepper connector
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.MuiStepConnector-alternativeLabel`]: {
    top: 22,
  },
  [`&.MuiStepConnector-active`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage:
        "linear-gradient(95deg, #ff4d4d 0%, #ee4d2d 50%, #ff6f43 100%)",
    },
  },
  [`&.MuiStepConnector-completed`]: {
    [`& .MuiStepConnector-line`]: {
      backgroundImage:
        "linear-gradient(95deg, #ff4d4d 0%, #ee4d2d 50%, #ff6f43 100%)",
    },
  },
  [`& .MuiStepConnector-line`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));

// Custom styled step icon
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0 4px 10px 0 rgba(0,0,0,.1)",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(136deg, #ff6f43 0%, #ee4d2d 50%, #ff4d4d 100%)",
    boxShadow: "0 4px 10px 0 rgba(238, 77, 45, 0.4)",
    animation: "pulse 1.5s infinite",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(136deg, #ff6f43 0%, #ee4d2d 50%, #ff4d4d 100%)",
  }),
}));

// Custom step icon component
function ColorlibStepIcon(props) {
  const { active, completed, className, icon } = props;

  const icons = {
    1: <ShoppingBag />,
    2: <Assignment />,
    3: <LocalShipping />,
    4: <LocalShipping />,
    5: <CheckCircle />,
    6: <CheckCircle />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

export default function OrderDetailsSeller() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const respone = await ApiService.get(` /orders/order-details/${orderId}`);

      setOrder(respone.data.order);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Helper functions
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  // Chỉ lấy ngày/tháng/năm
  const formatDateOnly = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusText = (status, refundDecision) => {
    if (status === "refund") {
      if (refundDecision === "pending") return "Chờ duyệt hoàn tiền";
      if (refundDecision === "approved") return "Đã duyệt hoàn tiền";
      if (refundDecision === "rejected") return "Từ chối hoàn tiền";
      return "Trả hàng/Hoàn tiền";
    }
    if (status === "refunded" && refundDecision === "approved") {
      return "Đã hoàn tiền";
    }
    if (status === "delivered") {
      return "Đã giao hàng";
    }
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipped":
        return "Đã gửi cho vận chuyển";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Đã nhận hàng";
      case "cancelled":
        return "Đã hủy";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status, refundDecision) => {
    if (status === "refund") {
      if (refundDecision === "pending") return "warning";
      if (refundDecision === "approved") return "success";
      if (refundDecision === "rejected") return "error";
      return "info";
    }
    if (status === "refunded" && refundDecision === "approved") {
      return "success";
    }
    if (status === "delivered") {
      return "info";
    }
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "success";
      case "shipped":
        return "info";
      case "shipping":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "refunded":
        return "success";
      default:
        return "default";
    }
  };

  const getActiveStep = (status, refundDecision) => {
    if (status === "refund") {
      if (refundDecision === "pending") return 5;
      if (refundDecision === "approved") return 6;
      if (refundDecision === "rejected") return 7;
      return 5;
    }
    if (status === "refunded" && refundDecision === "approved") {
      return 8;
    }
    if (status === "delivered") {
      return 4; // chỉ sáng đến "Đã giao hàng"
    }
    if (status === "completed") {
      return 5; // sáng luôn cả "Đã nhận hàng"
    }
    switch (status) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "shipped":
        return 2;
      case "shipping":
        return 3;
      case "cancelled":
        return -1;
      case "refunded":
        return 8;
      default:
        return 0;
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="container py-4 order-details-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Chi tiết đơn hàng</h3>
      </div>

      {/* Order Status Tracking */}
      <Paper elevation={3} className="p-4 mb-4 status-tracker">
        <div className="status-header">
          <Typography variant="h6" className="fw-bold mb-0">
            Trạng thái đơn hàng
          </Typography>
          <Chip
            label={getStatusText(order?.status, order?.refundDecision)}
            color={getStatusColor(order?.status, order?.refundDecision)}
            className="status-chip"
            sx={{
              background:
                order.status === "shipping"
                  ? "linear-(136deg, #ff6f43 0%, #ee4d2d 50%, #ff4d4d 100%)"
                  : order.status === "refund" &&
                    order.refundDecision === "approved"
                  ? "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)"
                  : order.status === "refund" &&
                    order.refundDecision === "rejected"
                  ? "linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)"
                  : order.status === "refund" &&
                    order.refundDecision === "pending"
                  ? "linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)"
                  : order.status === "refunded" &&
                    order.refundDecision === "approved"
                  ? "linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)"
                  : order.status === "delivered"
                  ? "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)"
                  : "",
              boxShadow:
                order.status === "shipping"
                  ? "0 4px 10px rgba(238, 77, 45, 0.3)"
                  : "",
              fontWeight: "bold",
              color:
                order.status === "shipping"
                  ? "white"
                  : order.status === "refund" &&
                    order.refundDecision === "approved"
                  ? "#2e7d32"
                  : order.status === "refund" &&
                    order.refundDecision === "rejected"
                  ? "#d32f2f"
                  : order.status === "refund" &&
                    order.refundDecision === "pending"
                  ? "#fbc02d"
                  : order.status === "refunded" &&
                    order.refundDecision === "approved"
                  ? "#2e7d32"
                  : order.status === "delivered"
                  ? "#1976d2"
                  : "",
            }}
          />
        </div>

        {/* Alert cho trạng thái đã hoàn tiền */}
        {order.status === "refunded" && order.refundDecision === "approved" && (
          <Alert severity="success" sx={{ mb: 2, fontWeight: 600 }}>
            Đã hoàn tiền thành công vào tài khoản ngân hàng.
            {order.refundCompletedAt && (
              <>
                <br />
                <b>Thời gian hoàn tiền:</b>{" "}
                {new Date(order.refundCompletedAt).toLocaleString("vi-VN")}
              </>
            )}
          </Alert>
        )}
        {/* Alert cho các trạng thái refund */}
        {order.status === "refund" && order.refundDecision === "pending" && (
          <Alert severity="warning" sx={{ mb: 2, fontWeight: 600 }}>
            Yêu cầu hoàn tiền đang chờ duyệt bởi người bán
          </Alert>
        )}
        {order.status === "refund" && order.refundDecision === "rejected" && (
          <Alert severity="error" sx={{ mb: 2, fontWeight: 600 }}>
            Yêu cầu hoàn tiền đã bị từ chối. Lý do:{" "}
            {order.refundDecisionReason || "Không có lý do"}
          </Alert>
        )}
        {order.status === "refund" && order.refundDecision === "approved" && (
          <Alert severity="info" sx={{ mb: 2, fontWeight: 600 }}>
            Yêu cầu hoàn tiền đã được chấp nhận. Vui lòng chờ tiền hoàn về tài
            khoản ngân hàng.
          </Alert>
        )}
        {order.status === "cancelled" &&
          order.shippingMethod === "ship-cod" &&
          order.statusPayment === true &&
          order.refundDecision === "pending" && (
            <Alert severity="info" sx={{ mb: 2, fontWeight: 600 }}>
              Đơn hàng đang được hoàn tiền
            </Alert>
          )}
        {/* Alert nhỏ gọn, không chứa nút xác nhận */}
        {order.status === "delivered" && (
          <Alert severity="info" sx={{ mb: 2, fontWeight: 500 }}>
            Đơn hàng đã được giao thành công. Vui lòng xác nhận nếu bạn đã nhận
            được hàng.
          </Alert>
        )}

        {order.status !== "cancelled" ? (
          <Box sx={{ width: "100%", mt: 4 }} className="order-status-stepper">
            {order.shippingMethod === "direct-meeting" ? (
              <Stepper
                alternativeLabel
                activeStep={
                  order.status === "pending"
                    ? 0
                    : order.status === "confirmed"
                    ? 1
                    : order.status === "completed"
                    ? 2
                    : 0
                }
                connector={<ColorlibConnector />}
              >
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đơn hàng đã đặt</div>
                    <small className="text-muted step-date">
                      {formatDate(order.createdAt)}
                    </small>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đã xác nhận</div>
                    <small className="text-muted step-date">
                      {order.status === "confirmed" &&
                        formatDate(order.updatedAt || order.confirmedAt)}
                    </small>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Hoàn thành</div>
                    <small className="text-muted step-date">
                      {order.status === "completed" &&
                        formatDate(order.completedAt)}
                    </small>
                  </StepLabel>
                </Step>
              </Stepper>
            ) : (
              <Stepper
                alternativeLabel
                activeStep={getActiveStep(order.status, order.refundDecision)}
                connector={<ColorlibConnector />}
              >
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đơn hàng đã đặt</div>
                    <small className="text-muted step-date">
                      {order.status === "pending"
                        ? "Đang chờ xác nhận"
                        : formatDate(order.createdAt)}
                    </small>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đã xác nhận</div>
                    <small className="text-muted step-date">
                      {order.status === "confirmed" && "Đang chuẩn bị hàng"}
                    </small>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đã gửi cho vận chuyển</div>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đang giao hàng</div>
                    <small className="text-muted step-date">
                      {order.status === "shipping" &&
                        "Dự kiến: " +
                          formatDateOnly(order.expectedDeliveryTime)}
                    </small>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đã giao hàng</div>
                    <small className="text-muted step-date">
                      {order.status === "delivered" &&
                        "Đã giao lúc " + formatDate(order.deliveredAt)}
                    </small>
                  </StepLabel>
                </Step>
                <Step>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <div className="step-label">Đã nhận hàng</div>
                    <small className="text-muted step-date">
                      {order.status === "completed" &&
                        "Đã nhận lúc " + formatDate(order.completedAt)}
                    </small>
                  </StepLabel>
                </Step>
              </Stepper>
            )}
          </Box>
        ) : (
          <div className="text-center py-3 cancelled-order mt-3">
            <div className="cancelled-icon mb-3">
              <i className="fa fa-times-circle fa-4x text-danger"></i>
            </div>
            <Typography color="error" variant="h6">
              Đơn hàng đã bị hủy
            </Typography>
            <Typography variant="body2" className="text-muted mt-2">
              Đơn hàng đã bị hủy vào {formatDate(order.updatedAt)}
            </Typography>
          </div>
        )}
      </Paper>

      <div className="row">
        <div className="col-md-8">
          {/* Order Information */}
          <Paper elevation={3} className="p-4 mb-4 order-info">
            <div className="d-flex align-items-center mb-3">
              <EventNote color="primary" className="me-2" />
              <Typography variant="h6" className="fw-bold mb-0">
                Thông tin đơn hàng
              </Typography>
            </div>
            {/* Sử dụng Grid để chia đều 2 cột */}
            <Box sx={{ px: 1 }}>
              <Box component={Divider} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mã đơn hàng
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ mb: 2 }}>
                    #{order.ghnOrderCode || order._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ngày đặt hàng
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    lúc {formatDate(order.createdAt)}
                  </Typography>
                  {order.shippingMethod === "ship-cod" && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        Thời gian giao hàng dự kiến
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {formatDateOnly(order.expectedDeliveryTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phương thức thanh toán
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        <CreditCard fontSize="small" className="me-1" />
                        {order.paymentMethod === "bank_transfer"
                          ? "Chuyển khoản"
                          : "Thanh toán khi nhận hàng"}
                      </Typography>
                    </>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography variant="body2" color="text.secondary">
                    Phương thức vận chuyển
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", mb: 2 }}
                  >
                    <LocalShipping fontSize="small" className="me-1" />
                    {order.shippingMethod === "ship-cod"
                      ? "Giao hàng tận nơi"
                      : "Giao dịch trực tiếp"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Trạng thái thanh toán
                  </Typography>
                  <Chip
                    size="small"
                    label={
                      order.statusPayment ? "Đã thanh toán" : "Chưa thanh toán"
                    }
                    color={order.statusPayment ? "success" : "warning"}
                    variant="outlined"
                    sx={{ mt: 1, mb: 2 }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Shipping Information */}
          <Paper elevation={3} className="p-4 mb-4 shipping-info">
            <div className="d-flex align-items-center mb-3">
              <LocalShipping color="primary" className="me-2" />
              <Typography variant="h6" className="fw-bold mb-0">
                Thông tin giao hàng
              </Typography>
            </div>
            <div className="address-details p-3 border rounded">
              <div className="d-flex align-items-start mb-2">
                <Person color="action" className="me-2" />
                <div>
                  <Typography variant="body1" className="fw-bold">
                    {order.shippingAddress.fullName}
                  </Typography>
                </div>
              </div>
              <div className="d-flex align-items-start mb-2">
                <Phone color="action" className="me-2" />
                <Typography variant="body1">
                  {order.shippingAddress.phoneNumber}
                </Typography>
              </div>
              <div className="d-flex align-items-start">
                <LocationOn color="action" className="me-2" />
                <Typography variant="body1">
                  {order.shippingAddress.specificAddress},{" "}
                  {order.shippingAddress.district},{" "}
                  {order.shippingAddress.province}
                </Typography>
              </div>
            </div>
          </Paper>

          {/* Products */}
          <Paper elevation={3} className="p-4 mb-4 products-section">
            <div className="d-flex align-items-center mb-3">
              <Inventory color="primary" className="me-2" />
              <Typography variant="h6" className="fw-bold mb-0">
                Sản phẩm ({order.products.length})
              </Typography>
            </div>

            <div className="product-list">
              {order.products.map((item) => (
                <div key={item.id} className="product-item p-3 border-bottom">
                  <div className="row align-items-center">
                    <div className="col-md-2 col-3">
                      <img
                        src={item.productId.avatar.url}
                        alt={item.productId.name}
                        className="img-fluid rounded product-image"
                      />
                    </div>
                    <div className="col-md-5 col-9">
                      <Typography variant="body1" className="product-name">
                        {item.productId.name}
                      </Typography>
                      {/* <Typography variant="body2" className="text-muted">
                        Phân loại: {item?.variation}
                      </Typography> */}
                      <Typography
                        variant="body2"
                        className="d-md-none text-danger fw-bold mt-1"
                      >
                        {formatCurrency(item.productId.price)}
                      </Typography>
                    </div>
                    <div className="col-md-2 d-none d-md-block text-center">
                      <Typography
                        variant="body1"
                        className="text-danger fw-bold"
                      >
                        {formatCurrency(item.productId.price)}
                      </Typography>
                    </div>
                    <div className="col-md-1 d-none d-md-block text-center">
                      <Typography variant="body1">x{item.quantity}</Typography>
                    </div>
                    <div className="col-md-2 d-none d-md-block text-end">
                      <Typography
                        variant="body1"
                        className="text-danger fw-bold"
                      >
                        {formatCurrency(item.productId.price * item.quantity)}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Paper>
        </div>

        <div className="col-md-4">
          {/* Order Summary */}
          <Paper elevation={3} className="p-4 mb-4 order-summary">
            <Typography variant="h6" className="fw-bold mb-3">
              Tổng thanh toán
            </Typography>

            <div className="d-flex justify-content-between mb-2">
              <Typography variant="body1">Tổng tiền hàng</Typography>
              <Typography variant="body1">
                {formatCurrency(order.totalAmount - order.shippingFee)}
              </Typography>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <Typography variant="body1">Phí vận chuyển</Typography>
              <Typography variant="body1">
                {formatCurrency(order.shippingFee)}
              </Typography>
            </div>

            <Divider className="mb-3" />

            <div className="d-flex justify-content-between mb-3">
              <Typography variant="h6" className="fw-bold">
                Thành tiền
              </Typography>
              <Typography variant="h6" className="text-danger fw-bold">
                {formatCurrency(order.totalAmount)}
              </Typography>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}
