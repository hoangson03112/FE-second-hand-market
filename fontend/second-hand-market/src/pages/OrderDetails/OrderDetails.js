import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";
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
  Payment,
  Inventory,
  CheckCircle,
  AccessTime,
  LocationOn,
  Person,
  Phone,
  EventNote,
  ReceiptLong,
  CreditCard,
  DeliveryDining,
  Pending,
  Assignment,
  ShoppingBag,
} from "@mui/icons-material";
import axios from "axios";
import AccountContext from "../../contexts/AccountContext";
import { useChat } from "../../contexts/ChatContext";
import CancelOrderModal from "../Order/components/CancelOrderModal";
import { useOrder } from "../../contexts/OrderContext";

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
    4: <CheckCircle />,
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

export default function OrderDetails() {
  const { findOrCreateWithOrder } = useChat();
  const { updateOrder } = useOrder();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fetchOrder = async () => {
    try {
      const respone = await axios.get(
        `http://localhost:2000/eco-market/orders/order-details/${orderId}`
      );

      setOrder(respone.data.order);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order:", error);
      setLoading(false);
    }
  };
  const handleCancelOrder = async (orderId, reason, status) => {
    try {
      await updateOrder(orderId, reason, status);
      fetchOrder();
      setShowCancelModal(false);
      setShowToast(true);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };
  const handleContactSeller = async (order) => {
    try {
      const authData = await AccountContext.Authentication();
      if (!authData || !authData.data || !authData.data.account) {
        navigate("/eco-market/login");
        return;
      }

      const response = await findOrCreateWithOrder(
        order._id,
        order.sellerId._id
      );
      if (!response || !response.success) {
        console.error("Failed to create chat conversation:", response);
        alert("Không thể kết nối với người bán. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error creating chat conversation:", error);
      alert("Có lỗi xảy ra khi kết nối với người bán. Vui lòng thử lại sau.");
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipping":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "processing":
        return 1;
      case "shipping":
        return 2;
      case "completed":
        return 3;
      case "cancelled":
        return -1;
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

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <div className="alert alert-danger" role="alert">
          Không tìm thấy thông tin đơn hàng!
        </div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/eco-market/orders")}
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4 order-details-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Chi tiết đơn hàng</h3>
        <Button
          variant="outlined"
          startIcon={<ReceiptLong />}
          onClick={() => navigate("/eco-market/orders")}
        >
          Danh sách đơn hàng
        </Button>
      </div>

      {/* Order Status Tracking */}
      <Paper elevation={3} className="p-4 mb-4 status-tracker">
        <div className="status-header">
          <Typography variant="h6" className="fw-bold mb-0">
            Trạng thái đơn hàng
          </Typography>
          <Chip
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
            className="status-chip"
            sx={{
              background:
                order.status === "shipping"
                  ? "linear-(136deg, #ff6f43 0%, #ee4d2d 50%, #ff4d4d 100%)"
                  : "",
              boxShadow:
                order.status === "shipping"
                  ? "0 4px 10px rgba(238, 77, 45, 0.3)"
                  : "",
              fontWeight: "bold",
              color: order.status === "shipping" ? "white" : "",
            }}
          />
        </div>

        {order.status !== "cancelled" ? (
          <Box sx={{ width: "100%", mt: 4 }} className="order-status-stepper">
            <Stepper
              alternativeLabel
              activeStep={getStatusStep(order.status)}
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
                    {order.status === "processing" && "Đang chuẩn bị hàng"}
                  </small>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <div className="step-label">Đang giao hàng</div>
                  <small className="text-muted step-date">
                    {order.status === "shipping" && "Dự kiến giao trong 24h"}
                  </small>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <div className="step-label">Đã nhận hàng</div>
                  <small className="text-muted step-date">
                    {order.status === "completed" &&
                      formatDate(order.deliveredAt || order.createdAt)}
                  </small>
                </StepLabel>
              </Step>
            </Stepper>

            {order.status === "shipping" && (
              <div className="delivery-progress-bar">
                <div className="progress mt-4">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{
                      width: "65%",
                      backgroundColor: "#ee4d2d",
                    }}
                    aria-valuenow="65"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="d-flex justify-content-between mt-2 text-muted">
                  <small>Đã giao hàng cho đơn vị vận chuyển</small>
                  <small>Đang giao đến bạn</small>
                  <small>Hoàn thành</small>
                </div>
              </div>
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
              Đơn hàng đã bị hủy vào{" "}
              {formatDate(order.updatedAt || order.createdAt)}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              className="mt-3"
              size="small"
            >
              Đặt hàng lại
            </Button>
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
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <Typography variant="body2" className="text-muted">
                    Mã đơn hàng
                  </Typography>
                  <Typography variant="body1" className="fw-bold">
                    {order._id}
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography variant="body2" className="text-muted">
                    Ngày đặt hàng
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(order.createdAt)}
                  </Typography>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <Typography variant="body2" className="text-muted">
                    Phương thức thanh toán
                  </Typography>
                  <Typography
                    variant="body1"
                    className="d-flex align-items-center"
                  >
                    <CreditCard fontSize="small" className="me-1" />
                    Thanh toán khi nhận hàng
                  </Typography>
                </div>
                <div className="mb-3">
                  <Typography variant="body2" className="text-muted">
                    Trạng thái thanh toán
                  </Typography>
                  <Chip
                    size="small"
                    label={"Chưa thanh toán"}
                    color={
                      order.paymentStatus === "pending" ? "warning" : "success"
                    }
                    variant="outlined"
                  />
                </div>
              </div>
            </div>
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
                {formatCurrency(order.totalAmount)}
              </Typography>
            </div>

            {/* <div className="d-flex justify-content-between mb-2">
              <Typography variant="body1">Phí vận chuyển</Typography>
              <Typography variant="body1">
                {formatCurrency(order.shippingFee)}
              </Typography>
            </div> */}

            {/* <div className="d-flex justify-content-between mb-3">
              <Typography variant="body1">Giảm giá</Typography>
              <Typography variant="body1" className="text-success">
                -{formatCurrency(order.discount)}
              </Typography>
            </div> */}

            <Divider className="mb-3" />

            <div className="d-flex justify-content-between mb-3">
              <Typography variant="h6" className="fw-bold">
                Thành tiền
              </Typography>
              <Typography variant="h6" className="text-danger fw-bold">
                {formatCurrency(order.totalAmount)}
              </Typography>
            </div>

            <div className="d-flex flex-column gap-2">
              {order.status === "completed" && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<CheckCircle />}
                >
                  Đánh giá sản phẩm
                </Button>
              )}

              {order.status === "shipping" && (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<CheckCircle />}
                >
                  Đã nhận được hàng
                </Button>
              )}

              {order.status === "pending" && (
                <Button
                  onClick={() => setShowCancelModal(true)}
                  variant="outlined"
                  color="error"
                  fullWidth
                >
                  Hủy đơn hàng
                </Button>
              )}
              {showCancelModal && (
                <CancelOrderModal
                  orderId={order?._id}
                  onConfirm={handleCancelOrder}
                  onClose={() => setShowCancelModal(false)}
                />
              )}
              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                className="mt-2"
                onClick={() => handleContactSeller(order)}
              >
                Liên hệ người bán
              </Button>
            </div>
          </Paper>
        </div>
      </div>

      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          position: "fixed",
          bottom: "40px",
          right: "20px",
          minWidth: "350px",
        }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          <Box className="d-flex align-items-center">
            <i className="bi bi-cart-check text-success fs-4 me-2"></i>
            <Typography>Cập nhật đơn hàng thành công!</Typography>
          </Box>
        </Alert>
      </Snackbar>
    </div>
  );
}
