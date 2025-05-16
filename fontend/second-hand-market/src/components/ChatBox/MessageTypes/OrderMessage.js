import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { Assignment, LocalShipping } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import orderService from "../../../services/orderService";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
    case "chờ xử lý":
      return "warning";
    case "processing":
    case "đang xử lý":
      return "info";
    case "shipped":
    case "đang vận chuyển":
      return "primary";
    case "delivered":
    case "đã giao hàng":
      return "success";
    case "cancelled":
    case "đã hủy":
      return "error";
    default:
      return "default";
  }
};

const OrderMessage = ({ order }) => {
  const [open, setOpen] = useState(false);

  const handleCopy = () => {
    if (orderId) {
      navigator.clipboard
        .writeText(orderId)
        .then(() => {
          setOpen(true);
        })
        .catch((err) => {
          console.error("Lỗi khi copy: ", err);
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const fetchTotalAmount = async () => {
      const totalAmount = await orderService.getTotalAmountOfOrder(order.id);
      setTotalAmount(totalAmount.totalAmount);
    };
    fetchTotalAmount();
  }, [order]);
  const orderId = order._id || order.id;

  const handleViewOrder = () => {
    if (orderId) {
      navigate(`/eco-market/order/detail/${orderId}`);
    } else {
      console.error("Order ID not found in order object:", order);
    }
  };

  return (
    <Card
      className="order-message-card"
      variant="outlined"
      sx={{
        maxWidth: 320,
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <LocalShipping color="primary" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold">
            Đơn hàng #
            <Tooltip title={orderId} placement="top" sx={{ pl: 0 }}>
              <Button onClick={handleCopy}>
                {orderId ? orderId.slice(-6).toUpperCase() : "N/A"}
              </Button>
            </Tooltip>
            <Snackbar
              open={open}
              autoHideDuration={3000}
              onClose={handleClose}
              message={`Đã copy mã đơn hàng: ${orderId}`}
            />
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Tổng đơn:
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {totalAmount.toLocaleString("vi-VN")}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Trạng thái:
          </Typography>
          <Chip
            size="small"
            label={
              order.status === "CANCELLED"
                ? "Đã hủy"
                : order.status === "PENDING"
                ? "Chờ xác nhận"
                : order.status === "SHIPPING"
                ? "Đang vận chuyển"
                : order.status === "COMPLETED"
                ? "Hoàn thành"
                : order.status
            }
            color={getStatusColor(order.status)}
            variant="outlined"
          />
        </Box>

        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleViewOrder}
          startIcon={<Assignment fontSize="small" />}
        >
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  );
};

export default OrderMessage;
