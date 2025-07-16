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
} from "@mui/material";
import {
  Visibility,
  ContactSupport,
  Cancel,
  LocalShipping,
  CheckCircle,
  Refresh,
  Star,
} from "@mui/icons-material";
import { formatPrice } from "../../../utils/function";
import { useProduct } from "../../../contexts/ProductContext";
import { useOrder } from "../../../contexts/OrderContext";
import AccountContext from "../../../contexts/AccountContext";
import { useChat } from "../../../contexts/ChatContext";
import CancelOrderModal from "./CancelOrderModal";
import { ghnService } from "../../../services/ghnService";

const OrderItem = ({ order, setOrders }) => {
  const { findOrCreateWithOrder } = useChat();
  const { getProduct } = useProduct();
  const { updateOrder } = useOrder();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (order?.products?.length > 0) {
          const productPromises = order.products.map((item) =>
            getProduct(item.productId)
          );
          const productsData = await Promise.all(productPromises);
          setProducts(productsData);
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

  const handleCancelOrder = async (orderId, reason, status) => {
    try {
      const data = await updateOrder(orderId, reason, status);
      if (order.ghnOrderCode) {
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

  const getStatusConfig = (status) => {
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
        label: "Đang vận chuyển",
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
      refund: {
        label: "Trả hàng",
        color: "error",
        icon: <Refresh fontSize="small" />,
        bgColor: "#ffebee",
        textColor: "#d32f2f",
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

  const renderStatusButtons = () => {
    const buttonStyles = {
      borderRadius: 2,
      textTransform: "none",
      fontWeight: 500,
      px: 2.5,
      py: 1,
    };

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
              color="primary"
              size="small"
              startIcon={<Refresh />}
              sx={buttonStyles}
            >
              Yêu cầu trả hàng
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
              variant="contained"
              color="success"
              size="small"
              startIcon={<CheckCircle />}
              sx={buttonStyles}
            >
              Đã nhận được hàng
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
              startIcon={<Refresh />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Mua lại
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
            >
              Đánh giá
            </Button>
          </Stack>
        );
      case "cancelled":
      case "refund":
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
              startIcon={<Refresh />}
              sx={{ ...buttonStyles, borderColor: "#757575", color: "#757575" }}
            >
              Mua lại
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
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(order.status);

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
        {/* Header with Seller Info and Status */}
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
                {/* Bên trái: Shop */}
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
                {/* Chip trạng thái sát lề phải */}
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
                {formatPrice(order.totalAmount)}
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
                {formatPrice(order.totalAmount + order.shippingFee)}
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OrderItem;
