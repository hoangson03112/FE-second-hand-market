import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Chip,
  Avatar,
  Card,
  CardContent,
  Stack,
  Alert,
} from "@mui/material";
import {
  Visibility,
  ContactSupport,
  Cancel,
  LocalShipping,
  CheckCircle,
  Refresh,
  Star,
  ReportProblem,
} from "@mui/icons-material";
import { formatPrice } from "../../../utils/function";
import { useProduct } from "../../../contexts/ProductContext";
import { useOrder } from "../../../contexts/OrderContext";
import AccountContext from "../../../contexts/AccountContext";
import { useChat } from "../../../contexts/ChatContext";
import CancelOrderModal from "./CancelOrderModal";
import { ghnService } from "../../../services/ghnService";
import ReturnOrderModal from "./ReturnOrderModal";
import axios from "axios";
import ReportOrderModal from "./ReportOrderModal";
import reportApi from "../../../services/reportService";
import { usePersonalDiscount } from "../../../contexts/PersonalDiscountContext";
import { applyPersonalDiscountsToProducts } from "../../../utils/checkoutUtils";

const OrderItem = ({ order, setOrders }) => {
  const { findOrCreateWithOrder } = useChat();
  const { getProduct } = useProduct();
  const { updateOrder } = useOrder();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");
  const [hasReview, setHasReview] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const { discounts } = usePersonalDiscount();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (order?.products?.length > 0) {
          const productPromises = order.products.map((item) =>
            getProduct(item.productId)
          );
          const productsData = await Promise.all(productPromises);
          const productsWithDiscount = applyPersonalDiscountsToProducts(
            productsData,
            discounts
          );

          setProducts(productsWithDiscount);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [getProduct, order]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const sellerIds = [
          ...new Set(products.map((product) => product?.seller._id)),
        ];
        const sellerPromises = sellerIds.map((id) =>
          AccountContext.getAccount(id)
        );
        const sellersData = await Promise.all(sellerPromises);

        const sellersMap = {};
        sellersData.forEach((seller) => {
          sellersMap[seller?._id] = seller;
        });

        setSellers(sellersMap);
      } catch (err) {
        console.error("Error fetching sellers:", err);
      }
    };

    if (products.length > 0) {
      fetchSellers();
    }
  }, [products]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`/seller-reviews/by-order/${order._id}`);
        if (res.data.review) {
          setHasReview(true);
          setReviewId(res.data.review._id);
        } else {
          setHasReview(false);
          setReviewId(null);
        }
      } catch (e) {
        setHasReview(false);
        setReviewId(null);
      }
    };
    fetchReview();
  }, [order._id]);

  const handleCancelOrder = async (orderId, reason, status, bankInfo) => {
    try {
      if (bankInfo) {
        await axios.post(`/bank-info`, {
          orderId,
          bankName: bankInfo.bankName,
          accountNumber: bankInfo.accountNumber,
          accountHolder: bankInfo.accountHolder,
        });
      }
      const data = await updateOrder(orderId, reason, status);
      if (order.ghnOrderCode && order.shippingMethod === "ship-cod") {
        await ghnService.cancelOrderGHN(order.ghnOrderCode);
      }
      setOrders(data.orders);
      setShowCancelModal(false);
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

      const response = await findOrCreateWithOrder(order._id, order.sellerId);
      if (!response || !response.success) {
        console.error("Failed to create chat conversation:", response);
        alert("Không thể kết nối với người bán. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error creating chat conversation:", error);
      alert("Có lỗi xảy ra khi kết nối với người bán. Vui lòng thử lại sau.");
    }
  };

  const handleViewDetails = () => {
    navigate(`/eco-market/order-details/${order._id}`);
  };

  const handlePayment = async () => {
    try {
      const items = products.map((product) => ({
        name: product.name,
        quantity:
          order.products.find((p) => p.productId === product._id)?.quantity ||
          1,
        price: product.price,
      }));
      const response = await axios.post("/payments/create-payment-link", {
        orderId: order._id,
        amount: order.totalAmount,
        items,
      });
      const { checkoutUrl } = response.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      alert("Không thể tạo link thanh toán. Vui lòng thử lại!");
    }
  };
  const handleViewFeedback = () => {
    navigate(`/eco-market/feedback-seller/${order._id}#feedback`);
  };

  const getStatusConfig = (status, refundDecision) => {
    if (status === "refund") {
      if (refundDecision === "pending") {
        return {
          label: "Chờ duyệt hoàn tiền",
          color: "warning",
          icon: <Refresh fontSize="small" />,
          bgColor: "#fffde7",
          textColor: "#fbc02d",
        };
      }
      if (refundDecision === "approved") {
        return {
          label: "Đã duyệt hoàn tiền",
          color: "success",
          icon: <CheckCircle fontSize="small" />,
          bgColor: "#e8f5e8",
          textColor: "#2e7d32",
        };
      }
      if (refundDecision === "rejected") {
        return {
          label: "Từ chối hoàn tiền",
          color: "error",
          icon: <Cancel fontSize="small" />,
          bgColor: "#ffebee",
          textColor: "#d32f2f",
        };
      }
      // fallback
      return {
        label: "Trả hàng/Hoàn tiền",
        color: "info",
        icon: <Refresh fontSize="small" />,
        bgColor: "#e3f2fd",
        textColor: "#1976d2",
      };
    }
    if (status === "refunded" && refundDecision === "approved") {
      return {
        label: "Đã hoàn tiền",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        bgColor: "#e8f5e8",
        textColor: "#2e7d32",
      };
    }
    const configs = {
      pending: {
        label: "Chờ xác nhận",
        color: "warning",
        icon: <LocalShipping fontSize="small" />,
        bgColor: "#fff3e0",
        textColor: "#e65100",
      },
      confirmed: {
        label: "Đã xác nhận",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        bgColor: "#e8f5e8",
        textColor: "#2e7d32",
      },
      shipped: {
        label: "Đã gửi cho vận chuyển",
        color: "info",
        icon: <LocalShipping fontSize="small" />,
        bgColor: "#e3f2fd",
        textColor: "#1976d2",
      },
      shipping: {
        label: "Đang giao hàng",
        color: "info",
        icon: <LocalShipping fontSize="small" />,
        bgColor: "#e3f2fd",
        textColor: "#1976d2",
      },
      delivered: {
        label: "Đã giao hàng",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        bgColor: "#e8f5e8",
        textColor: "#2e7d32",
      },
      completed: {
        label: "Hoàn thành",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        bgColor: "#e8f5e8",
        textColor: "#2e7d32",
      },
      cancelled: {
        label: "Đã hủy",
        color: "error",
        icon: <Cancel fontSize="small" />,
        bgColor: "#ffebee",
        textColor: "#d32f2f",
      },
      refunded: {
        label: "Đã hoàn tiền",
        color: "success",
        icon: <CheckCircle fontSize="small" />,
        bgColor: "#e8f5e8",
        textColor: "#2e7d32",
      },
    };
    return (
      configs[status] || {
        label: "Trạng thái không xác định",
        color: "default",
      }
    );
  };

  const handleCompleteOrder = async (order) => {
    try {
      const data = await updateOrder(order._id, "", "completed");
      setOrders(data.orders);
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };
  const handleReturnOrder = async (order, reason) => {
    try {
      await axios.post(`/bank-info`, {
        orderId: order._id,
        bankName: reason.bankName,
        accountNumber: reason.accountNumber,
        accountHolder: reason.accountHolder,
      });
      const data = await updateOrder(order._id, reason.reason, "refund");
      setOrders(data.orders);
      setShowReturnModal(false);
    } catch (error) {
      console.error("Error returning order:", error);
    }
  };

  const canReturn = (order) => {
    if (order.status === "delivered") return true;
    if (order.status === "completed" && order.completedAt) {
      const completedDate = new Date(order.completedAt);
      const completedTimeUTC = completedDate.getTime();
      const completedTimeVN = completedTimeUTC + 7 * 60 * 60 * 1000;
      const nowVN = Date.now() + 7 * 60 * 60 * 1000;
      return nowVN - completedTimeVN < 3 * 24 * 60 * 60 * 1000;
    }
    return false;
  };

  const handleSubmitReport = async (formData) => {
    try {
      formData.append("type", "order");
      formData.append("targetId", order._id);

      await reportApi.createReport(formData);
      setReportSuccess(true);
      setShowReportModal(false);
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (err) {
      setReportError("Gửi báo cáo thất bại. Vui lòng thử lại.");
      setTimeout(() => setReportError(""), 3000);
    }
  };
  const renderStatusButtons = () => {
    const buttonStyles = {
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 500,
      px: 2.5,
      py: 1,
    };

    if (order.status === "refunded" && order.refundDecision === "approved") {
      return (
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            size="small"
            onClick={handleViewDetails}
            startIcon={<Visibility />}
            sx={{
              ...buttonStyles,
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleContactSeller(order)}
            startIcon={<ContactSupport />}
            sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
          >
            Liên hệ người bán
          </Button>
          <Button
            variant="outlined"
            color="warning"
            size="small"
            startIcon={<Star />}
            sx={buttonStyles}
            onClick={
              hasReview
                ? handleViewFeedback
                : () => navigate(`/eco-market/feedback-seller/${order._id}`)
            }
          >
            Đánh giá
          </Button>
        </Stack>
      );
    }
    switch (order.status) {
      case "pending":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleContactSeller(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Liên hệ người bán
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setShowCancelModal(true)}
              startIcon={<Cancel />}
              sx={buttonStyles}
            >
              Hủy đơn hàng
            </Button>
            {order.statusPayment === false &&
              order.paymentMethod === "bank_transfer" && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handlePayment}
                  startIcon={<CheckCircle />}
                  sx={{
                    ...buttonStyles,
                    bgcolor: "#43a047",
                    "&:hover": { bgcolor: "#388e3c" },
                  }}
                >
                  Thanh toán
                </Button>
              )}
          </Stack>
        );
      case "confirmed":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => handleContactSeller(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Liên hệ người bán
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setShowCancelModal(true)}
              startIcon={<Cancel />}
              sx={buttonStyles}
            >
              Hủy đơn hàng
            </Button>
          </Stack>
        );
      case "shipping":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => handleContactSeller(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Liên hệ người bán
            </Button>
          </Stack>
        );
      case "delivered":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleCompleteOrder(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Đã nhận hàng
            </Button>
            {canReturn(order) && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setShowReturnModal(true)}
                startIcon={<Refresh />}
                sx={buttonStyles}
              >
                Hoàn hàng/Hoàn tiền
              </Button>
            )}
          </Stack>
        );
      case "shipped":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleContactSeller(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Liên hệ người bán
            </Button>
          </Stack>
        );
      case "completed":
        const canReturnCompleted = canReturn(order);
        return (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>
            {canReturnCompleted && order.shippingMethod === "ship-cod" && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setShowReturnModal(true)}
                startIcon={<Refresh />}
                sx={buttonStyles}
              >
                Trả hàng
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleContactSeller(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Liên hệ người bán
            </Button>
            <Button
              variant="outlined"
              color="warning"
              size="small"
              startIcon={<Star />}
              sx={buttonStyles}
              onClick={() =>
                navigate(`/eco-market/feedback-seller/${order._id}`)
              }
            >
              Đánh giá
            </Button>

            {canReturnCompleted && order.shippingMethod === "ship-cod" && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ mt: 1, width: "100%" }}
              >
                Bạn có thể trả hàng trong vòng 3 ngày kể từ khi nhận hàng.
              </Typography>
            )}
          </Stack>
        );
      case "cancelled":
      case "refund":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => setShowReportModal(true)}
              startIcon={<ReportProblem />}
              sx={{
                ...buttonStyles,
                "&:hover": {
                  bgcolor: "#b71c1c",
                },
              }}
            >
              Báo cáo
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={{
                ...buttonStyles,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Xem chi tiết
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleContactSeller(order)}
              startIcon={<ContactSupport />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Liên hệ người bán
            </Button>
          </Stack>
        );
      case "refunded":
        return (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<Visibility />}
              sx={buttonStyles}
            >
              Xem chi tiết
            </Button>
          </Stack>
        );
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(order.status, order.refundDecision);

  return (
    <Card
      elevation={2}
      sx={{
        mb: 3,
        borderRadius: 3,
        border: "1px solid #f0f0f0",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {order.status === "cancelled" &&
          order.shippingMethod === "ship-cod" &&
          order.statusPayment === true &&
          order.refundDecision === "pending" && (
            <Alert severity="info" sx={{ mb: 2, fontWeight: 600 }}>
              Đơn hàng đang được hoàn tiền
            </Alert>
          )}
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
        {reportSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Gửi báo cáo thành công!
          </Alert>
        )}
        {reportError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {reportError}
          </Alert>
        )}
        <Box
          sx={{
            position: "relative",
            minHeight: 48,
            mb: 3,
          }}
        >
          {Object.values(sellers).map((seller) => {
            const sellerProducts = products.filter(
              (product) => product?.seller._id === seller?._id
            );

            if (sellerProducts.length === 0) {
              return null;
            }

            return (
              <Box
                key={seller?._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={seller?.avatar?.url}
                    alt={seller?.fullName}
                    sx={{
                      width: 48,
                      height: 48,
                      mr: 2,
                      border: "2px solid #f0f0f0",
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    className="seller-name"
                    fontWeight="600"
                    fontSize="16px"
                    sx={{
                      transition: "color 0.2s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: { xs: 120, sm: 200, md: 300 },
                    }}
                  >
                    {seller?.fullName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    right: 24,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Chip
                    icon={statusConfig.icon}
                    label={statusConfig.label}
                    sx={{
                      bgcolor: statusConfig.bgColor,
                      color: statusConfig.textColor,
                      fontWeight: 600,
                      fontSize: "13px",
                      height: 32,
                      "& .MuiChip-icon": { color: statusConfig.textColor },
                    }}
                  />
                  {order.shippingMethod === "ship-cod" &&
                    order.statusPayment === false &&
                    order.paymentMethod === "bank_transfer" && (
                      <Chip
                        label="Chưa thanh toán"
                        color="warning"
                        sx={{ fontWeight: 600, fontSize: "13px", height: 32 }}
                      />
                    )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Ngày đặt ở góc dưới bên phải */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Ngày đặt:{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("vi-VN")
              : ""}
          </Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: "#f0f0f0" }} />

        {/* Products List */}
        <Stack spacing={2} sx={{ mb: 3 }}>
          {products?.map((product) => {
            const orderProduct = order.products.find(
              (p) => p.productId === product?._id
            );
            const quantity = orderProduct?.quantity || 0;
            const originalPrice = product?.price || 0;

            return (
              <Box
                key={product?._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fafafa",
                  border: "1px solid #f0f0f0",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "#f5f5f5",
                    borderColor: "#e0e0e0",
                  },
                }}
              >
                <Box
                  component="img"
                  src={
                    product?.avatar?.url || "/path/to/default-product-image.png"
                  }
                  alt={product?.name || "Product"}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 2,
                    mr: 2,
                    border: "1px solid #e0e0e0",
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    component="a"
                    href={`/eco-market/product?productID=${product?._id}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                      "&:hover": {
                        color: "#1976d2",
                      },
                    }}
                  >
                    <Typography
                      fontWeight="600"
                      fontSize="16px"
                      sx={{
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product?.name}
                    </Typography>
                    <Typography color="text.secondary" fontSize="14px">
                      Số lượng: {quantity}
                    </Typography>
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right", ml: 2 }}>
                  <Typography color="text.secondary" fontSize="14px">
                    Giá
                  </Typography>
                  <Typography color="error" fontWeight="700" fontSize="16px">
                    {formatPrice(originalPrice)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>

        {/* Price Summary */}
        <Box
          sx={{
            bgcolor: "#f8f9fa",
            borderRadius: 2,
            p: 2.5,
            mb: 3,
            border: "1px solid #e9ecef",
          }}
        >
          <Stack spacing={1.5} alignItems="flex-end">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: 300,
              }}
            >
              <Typography color="text.secondary">Tổng tiền hàng:</Typography>
              <Typography fontWeight="600">
                {formatPrice(order.totalAmount - order.shippingFee)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: 300,
              }}
            >
              <Typography color="text.secondary">Phí vận chuyển:</Typography>
              <Typography fontWeight="600">
                {formatPrice(order.shippingFee)}
              </Typography>
            </Box>
            {totalDiscount > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  maxWidth: 300,
                }}
              >
                <Typography color="text.secondary">Tổng giảm giá:</Typography>
                <Typography fontWeight="600" color="success.main">
                  -{formatPrice(totalDiscount)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ width: "100%", maxWidth: 300, my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: 300,
              }}
            >
              <Typography fontSize="18px" fontWeight="600">
                Thành tiền:
              </Typography>
              <Typography fontSize="20px" color="error" fontWeight="700">
                {formatPrice(order.totalAmount)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {renderStatusButtons()}
        </Box>

        {/* Cancel Modal */}
        {showCancelModal && (
          <CancelOrderModal
            orderId={order?._id}
            onConfirm={handleCancelOrder}
            onClose={() => setShowCancelModal(false)}
            requireBankInfo={
              order.statusPayment === true &&
              order.shippingMethod === "ship-cod"
            }
          />
        )}
        {/* Modal hoàn hàng */}
        {showReturnModal && (
          <ReturnOrderModal
            open={showReturnModal}
            onClose={() => setShowReturnModal(false)}
            onConfirm={(reason) => handleReturnOrder(order, reason)}
          />
        )}
        <ReportOrderModal
          open={showReportModal}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitReport}
        />
      </CardContent>
    </Card>
  );
};

export default OrderItem;
