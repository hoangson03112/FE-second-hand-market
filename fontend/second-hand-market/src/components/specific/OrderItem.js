import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Divider, Paper } from "@mui/material";
import CancelOrderModal from "./CancelOrderModal";
import { formatPrice } from "../../utils/function";
import { useProduct } from "../../contexts/ProductContext";
import { useOrder } from "../../contexts/OrderContext";
import AccountContext from "../../contexts/AccountContext";
import { useChat } from "../../contexts/ChatContext";

const OrderItem = ({ order, setOrders }) => {
  const { findOrCreateWithOrder } = useChat();
  const { getProduct } = useProduct();
  const { updateOrder } = useOrder();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
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
    setTotalAmount(
      products.reduce((total, product) => {
        const orderProduct = order.products.find(
          (p) => p.productId === product?._id
        );
        return total + product?.price * (orderProduct?.quantity || 0);
      }, 0)
    );
  }, [products, order]);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const sellerIds = [
          ...new Set(products.map((product) => product?.sellerId)),
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

  const renderStatusButtons = () => {
    switch (order.status) {
      case "PENDING":
        return (
          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{
                mr: 2,
                color: "text.secondary",
                borderColor: "text.secondary",
              }}
              onClick={() => handleContactSeller(order)}
            >
              Liên hệ với người bán
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => setShowCancelModal(true)}
            >
              Hủy đơn hàng
            </Button>
          </Box>
        );
      case "SHIPPING":
        return (
          <Box>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{ mr: 2 }}
            >
              Yêu cầu trả hàng
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ mr: 2 }}
              onClick={() => handleContactSeller(order)}
            >
              Liên hệ người bán
            </Button>
            <Button variant="outlined" color="error" size="small">
              Đã nhận được hàng
            </Button>
          </Box>
        );
      case "COMPLETED":
        return (
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{ mr: 2 }}
            >
              Mua lại
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ mr: 2 }}
              onClick={() => handleContactSeller(order)}
            >
              Liên hệ người bán
            </Button>
            <Button variant="outlined" color="error" size="small">
              Đánh giá
            </Button>
          </Box>
        );
      case "CANCELLED":
      case "REFUND":
        return (
          <Box>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              sx={{ mr: 2 }}
            >
              Mua lại
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleContactSeller(order)}
            >
              Liên hệ người bán
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Paper elevation={0} sx={{ mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        {Object.values(sellers).map((seller) => {
          const sellerProducts = products.filter(
            (product) => product?.sellerId === seller?._id
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
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <Box
                  component="img"
                  src={seller?.avatar || "https://default-avatar-url.png"}
                  alt="User"
                  sx={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    mr: 2,
                  }}
                />
                <Typography fontWeight="bold">{seller.fullName}</Typography>
              </Box>
              <Typography variant="h6">
                {{
                  PENDING: "Chờ xác nhận",
                  SHIPPING: "Đang vận chuyển",
                  CANCELLED: "Đã hủy",
                  COMPLETED: "Hoàn thành",
                  REFUND: "Trả hàng",
                }[order.status] || "Trạng thái không xác định"}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 1 }} />

      {products?.map((product) => (
        <Box
          key={product?._id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={product?.avatar || "/path/to/default-product-image.png"}
              alt={product?.name || "Product"}
              sx={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "5px",
                mr: 2,
              }}
            />
            <Box>
              <Box
                component="a"
                href={`/eco-market/product?productID=${product?._id}`}
                sx={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <Typography fontWeight="bold" gutterBottom>
                  {product?.name}
                </Typography>
                <Typography>
                  Số Lượng:{" "}
                  {
                    order?.products.find((p) => p?.productId === product?._id)
                      ?.quantity
                  }
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography>
            Giá:{" "}
            <Typography
              component="span"
              color="error"
              fontWeight="bold"
              sx={{ mr: 3 }}
            >
              {formatPrice(product?.price)}
            </Typography>
          </Typography>
        </Box>
      ))}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography>Thành tiền:</Typography>
        <Typography variant="h5" color="error" fontWeight="bold" sx={{ mx: 2 }}>
          {formatPrice(totalAmount)}
        </Typography>
      </Box>

      <Box sx={{ float: "right" }}>
        {showCancelModal && (
          <CancelOrderModal
            orderId={order?._id}
            onConfirm={handleCancelOrder}
            onClose={() => setShowCancelModal(false)}
          />
        )}
        <Box sx={{ my: 2 }}> {renderStatusButtons()}</Box>
      </Box>
    </Paper>
  );
};

export default OrderItem;
