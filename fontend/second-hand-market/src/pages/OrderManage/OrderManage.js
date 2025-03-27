import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Visibility,
  LocalShipping,
  CalendarToday,
  Update,
} from "@mui/icons-material";
import { format } from "date-fns";

const OrderManage = () => {
  const [orders, setOrders] = useState([
    {
      _id: "67e22e075320aab3a457329d",
      sellerId: "67dce27d1b92a5370ca424df",
      buyerId: "66f43a1b878581d4a9743ad1",
      products: [
        {
          productId: "64e1a0b1f4c1a4e64a8f7112",
          name: "iPhone 13 Pro Max 128GB",
          price: 799.99,
          quantity: 1,
          thumbnail: "/path/to/iphone-image.jpg",
        },
      ],
      totalAmount: 799.99,
      shippingMethod: "buyer",
      shippingAddress: {
        name: "Hoàng Sơn",
        phone: "(+84) 332454556",
        address:
          "132/50, Mễ Trì Thượng, Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội",
      },
      status: "CANCELLED",
      createdAt: "2025-03-25T04:16:07.919Z",
      updatedAt: "2025-03-25T04:16:30.628Z",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Xử lý trạng thái đơn hàng
  const getStatusDetails = (status) => {
    const statusMap = {
      PENDING: { label: "Chờ xử lý", color: "warning" },
      PROCESSING: { label: "Đang xử lý", color: "info" },
      COMPLETED: { label: "Hoàn thành", color: "success" },
      CANCELLED: { label: "Đã hủy", color: "error" },
    };
    return statusMap[status] || { label: "Không xác định", color: "default" };
  };

  // Định dạng phương thức vận chuyển
  const getShippingMethod = (method) => {
    return method === "buyer" ? "Người mua tự nhận" : "Giao hàng tận nơi";
  };

  // Lọc đơn hàng
  const filteredOrders = orders.filter((order) =>
    order.products.some((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  // Render card đơn hàng
  const renderOrderCard = (order) => {
    const status = getStatusDetails(order.status);
    const firstProduct = order.products[0];

    return (
      <Paper
        elevation={2}
        sx={{ p: 2, mb: 2, cursor: "pointer" }}
        onClick={() => {
          setSelectedOrder(order);
          setOpenDetailDialog(true);
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Hình ảnh sản phẩm */}
          <Grid item xs={3}>
            <Avatar
              src={firstProduct.thumbnail}
              variant="rounded"
              sx={{ width: 80, height: 80 }}
            />
          </Grid>

          {/* Thông tin chính */}
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              {firstProduct.name}
              {order.products.length > 1 && (
                <Typography
                  component="span"
                  variant="caption"
                  color="text.secondary"
                  ml={1}
                >
                  +{order.products.length - 1} sản phẩm
                </Typography>
              )}
            </Typography>

            <Stack direction="row" spacing={1} mt={1}>
              <Chip label={status.label} color={status.color} size="small" />
              <Typography variant="body2" color="text.secondary">
                {getShippingMethod(order.shippingMethod)}
              </Typography>
            </Stack>
          </Grid>

          {/* Giá và nút xem chi tiết */}
          <Grid item xs={3} sx={{ textAlign: "right" }}>
            <Typography variant="body1" color="primary" fontWeight="bold">
              ${order.totalAmount.toFixed(2)}
            </Typography>
            <Tooltip title="Xem chi tiết">
              <IconButton color="primary">
                <Visibility />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", px: 2, py: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
      >
        Quản lý Đơn hàng
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Tìm kiếm theo tên sản phẩm..."
        sx={{ mb: 3 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredOrders.map((order) => renderOrderCard(order))}

      {/* Dialog chi tiết đơn hàng */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ bgcolor: "#f5f5f5" }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  Đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}
                </Typography>
                <Chip
                  label={getStatusDetails(selectedOrder.status).label}
                  color={getStatusDetails(selectedOrder.status).color}
                />
              </Box>
            </DialogTitle>

            <DialogContent dividers>
              {/* Danh sách sản phẩm */}
              <Typography variant="subtitle1" gutterBottom>
                Sản phẩm ({selectedOrder.products.length})
              </Typography>

              {selectedOrder.products.map((product, index) => (
                <Paper key={index} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Avatar
                        src={product.thumbnail}
                        variant="rounded"
                        sx={{ width: "100%", height: "auto" }}
                      />
                    </Grid>

                    <Grid item xs={9}>
                      <Typography variant="body1" fontWeight="bold">
                        {product.name}
                      </Typography>
                      <Box mt={1} display="flex" justifyContent="space-between">
                        <Typography variant="body2">
                          Số lượng: {product.quantity}
                        </Typography>
                        <Typography variant="body1">
                          ${product.price.toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

              {/* Thông tin vận chuyển */}
              <Box mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
                <Typography variant="subtitle1" gutterBottom>
                  <LocalShipping sx={{ verticalAlign: "middle", mr: 1 }} />
                  Thông tin vận chuyển
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Phương thức:</strong>{" "}
                      {getShippingMethod(selectedOrder.shippingMethod)}
                    </Typography>
                    <Typography>
                      <strong>Người nhận:</strong>{" "}
                      {selectedOrder.shippingAddress.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography>
                      <strong>Điện thoại:</strong>{" "}
                      {selectedOrder.shippingAddress.phone}
                    </Typography>
                    <Typography>
                      <strong>Địa chỉ:</strong>{" "}
                      {selectedOrder.shippingAddress.address}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Thời gian và tổng giá */}
              <Box mt={3} display="flex" justifyContent="space-between">
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <CalendarToday sx={{ verticalAlign: "middle", mr: 1 }} />
                    {format(
                      new Date(selectedOrder.createdAt),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </Typography>
                  <Typography variant="body2">
                    <Update sx={{ verticalAlign: "middle", mr: 1 }} />
                    {format(
                      new Date(selectedOrder.updatedAt),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </Typography>
                </Stack>

                <Typography variant="h6">
                  Tổng cộng:
                  <span style={{ marginLeft: 8, color: "#1976d2" }}>
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OrderManage;
