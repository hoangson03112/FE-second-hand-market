import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Assessment as AssessmentIcon,
  ShoppingCart as ShoppingCartIcon,
  HourglassEmpty as HourglassEmptyIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  Store as StoreIcon,
  Person as PersonIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
  ReceiptLong as ReceiptLongIcon,
  Inbox as InboxIcon,
} from "@mui/icons-material";
import orderService from "./../../../services/orderService";
import { formatDate } from "../../../utils/helpers";
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders();

        setOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Thống kê đơn hàng
  const getOrderStats = () => ({
    total: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    processing: orders.filter((order) => order.status === "processing").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    completed: orders.filter((order) => order.status === "delivered").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
    paid: orders.filter((order) => order.statusPayment).length,
    unpaid: orders.filter((order) => !order.statusPayment).length,
    cod: orders.filter((order) => order.shippingMethod === "ship-cod").length,
    direct: orders.filter((order) => order.shippingMethod === "direct-meeting")
      .length,
  });

  const getStatusDetails = (status) => {
    const statusMap = {
      pending: {
        label: "Chờ xử lý",
        bgColor: "#FFF8E1",
        textColor: "#F57C00",
        borderColor: "#FFCC02",
        icon: "⏳",
      },
      processing: {
        label: "Đang xử lý",
        bgColor: "#E1F5FE",
        textColor: "#0277BD",
        borderColor: "#29B6F6",
        icon: "🚚",
      },
      delivered: {
        label: "Đã giao",
        bgColor: "#E8F5E8",
        textColor: "#2E7D32",
        borderColor: "#66BB6A",
        icon: "✅",
      },
      cancelled: {
        label: "Đã hủy",
        bgColor: "#FFEBEE",
        textColor: "#C62828",
        borderColor: "#EF5350",
        icon: "❌",
      },
      rejected: {
        label: "Từ chối",
        bgColor: "#FCE4EC",
        textColor: "#AD1457",
        borderColor: "#EC407A",
        icon: "🚫",
      },
      confirmed: {
        label: "Đã xác nhận",
        bgColor: "#E0F2F1",
        textColor: "#00695C",
        borderColor: "#4DB6AC",
        icon: "✅",
      },
      shipped: {
        label: "Đã gửi hàng",
        bgColor: "#F3E5F5",
        textColor: "#7B1FA2",
        borderColor: "#AB47BC",
        icon: "📦",
      },
      returned: {
        label: "Đã hoàn trả",
        bgColor: "#FFF3E0",
        textColor: "#EF6C00",
        borderColor: "#FF9800",
        icon: "🔄",
      },
      refunded: {
        label: "Đã hoàn tiền",
        bgColor: "#E0F2F1",
        textColor: "#00695C",
        borderColor: "#4DB6AC",
        icon: "💰",
      },
    };
    return (
      statusMap[status] || {
        label: "Không xác định",
        bgColor: "#FAFAFA",
        textColor: "#616161",
        borderColor: "#E0E0E0",
        icon: "❓",
      }
    );
  };

  // Định dạng phương thức vận chuyển
  const getShippingMethod = (method) => {
    const methodMap = {
      "ship-cod": "Giao hàng COD",
      "direct-meeting": "Gặp mặt trực tiếp",
    };
    return methodMap[method] || "Không xác định";
  };

  // Định dạng phương thức thanh toán
  const getPaymentMethod = (method) => {
    const methodMap = {
      bank_transfer: "Chuyển khoản ngân hàng",
      "direct-meeting": "Thanh toán trực tiếp",
      cod: "Thanh toán khi nhận hàng",
    };
    return methodMap[method] || "Không xác định";
  };

  // Format tiền VNĐ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính tổng doanh thu
  const getTotalRevenue = () => {
    return orders
      .filter((order) => order.status === "delivered" && order.statusPayment)
      .reduce((total, order) => total + (order.totalAmount || 0), 0);
  };

  const filteredOrders = orders.filter((order) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchesSearch =
      order.products.some((product) =>
        product.productId.name.toLowerCase().includes(lowerCaseQuery)
      ) ||
      order.buyerId.fullName.toLowerCase().includes(lowerCaseQuery) ||
      order.sellerId.fullName.toLowerCase().includes(lowerCaseQuery) ||
      order._id.toLowerCase().includes(lowerCaseQuery);
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  const handleCloseDetail = () => {
    setOpenDetailDialog(false);
    setSelectedOrder(null);
  };

  const stats = getOrderStats();

  // Component hiển thị trạng thái tùy chỉnh
  const StatusChip = ({ status, size = "medium" }) => {
    const statusDetails = getStatusDetails(status);
    const sizeStyles = {
      small: {
        px: 1,
        py: 0.25,
        fontSize: "0.625rem",
        iconSize: "0.75rem",
      },
      medium: {
        px: 1.5,
        py: 0.5,
        fontSize: "0.75rem",
        iconSize: "0.875rem",
      },
      large: {
        px: 2,
        py: 0.75,
        fontSize: "0.875rem",
        iconSize: "1rem",
      },
    };

    const currentSize = sizeStyles[size];

    return (
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          px: currentSize.px,
          py: currentSize.py,
          borderRadius: 2,
          backgroundColor: statusDetails.bgColor,
          color: statusDetails.textColor,
          border: `1px solid ${statusDetails.borderColor}`,
          fontSize: currentSize.fontSize,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          transition: "all 0.2s ease-in-out",
          cursor: "default",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          },
        }}
      >
        <span style={{ fontSize: currentSize.iconSize }}>
          {statusDetails.icon}
        </span>
        {statusDetails.label}
      </Box>
    );
  };

  // Component thống kê
  const StatCard = ({ title, value, color, icon }) => (
    <Grid item xs={12} sm={6} md={4} lg={2.4}>
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: `${color}.main`,
            color: "white",
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h5" component="div" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ bgcolor: "grey.100", minHeight: "100vh" }}>
      <AppBar
        position="static"
        elevation={1}
        sx={{ bgcolor: "background.paper" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AssessmentIcon sx={{ color: "primary.main", mr: 1 }} />
            <Typography
              variant="h6"
              sx={{ color: "text.primary", flexGrow: 1 }}
            >
              Xem Đơn hàng (Admin)
            </Typography>
            <Typography variant="body2" color="text.secondary">
             
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Thống kê tổng quan */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <StatCard
            title="Tổng đơn hàng"
            value={stats.total}
            color="primary"
            icon={<ShoppingCartIcon />}
          />
          <StatCard
            title="Chờ xử lý"
            value={stats.pending}
            color="warning"
            icon={<HourglassEmptyIcon />}
          />
          <StatCard
            title="Đang xử lý"
            value={stats.processing}
            color="info"
            icon={<LocalShippingIcon />}
          />
          <StatCard
            title="Hoàn thành"
            value={stats.completed}
            color="success"
            icon={<CheckCircleIcon />}
          />
          <StatCard
            title="Đã hủy"
            value={stats.cancelled}
            color="error"
            icon={<CancelIcon />}
          />
          <StatCard
            title="Đã thanh toán"
            value={stats.paid}
            color="success"
            icon={<ReceiptLongIcon />}
          />
        </Grid>

        {/* Bộ lọc và tìm kiếm */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                label="Tìm kiếm đơn hàng"
                placeholder="Tìm theo mã, sản phẩm, người mua, người bán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Tất cả</MenuItem>
                  <MenuItem value="pending">Chờ xử lý</MenuItem>
                  <MenuItem value="processing">Đang xử lý</MenuItem>
                  <MenuItem value="shipped">Đã gửi hàng</MenuItem>
                  <MenuItem value="delivered">Đã giao</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                  <MenuItem value="returned">Đã hoàn trả</MenuItem>
                  <MenuItem value="refunded">Đã hoàn tiền</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </Typography>
        </Paper>

        {/* Danh sách đơn hàng */}
        <Box>
          {filteredOrders.length === 0 ? (
            <Paper sx={{ textAlign: "center", p: 8 }}>
              <InboxIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy đơn hàng
              </Typography>
              <Typography color="text.secondary">
                Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredOrders.map((order) => (
                <Grid item xs={12} key={order._id}>
                  <Card
                    elevation={2}
                    sx={{
                      transition: "0.3s",
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <CardActionArea onClick={() => handleOpenDetail(order)}>
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={1.5}>
                            <Avatar
                              variant="rounded"
                              src={
                                order.products[0]?.productId?.avatar?.url ||
                                order.products[0]?.productId?.images?.[0]?.url
                              }
                              sx={{ width: 80, height: 80 }}
                            />
                          </Grid>
                          <Grid item xs={12} md={5.5}>
                            {order.ghnOrderCode && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                #{order.ghnOrderCode}
                              </Typography>
                            )}
                            <Typography
                              variant="h6"
                              component="div"
                              fontWeight="bold"
                              noWrap
                            >
                              {order.products[0]?.productId?.name ||
                                "Sản phẩm không xác định"}
                              {order.products.length > 1 && (
                                <Chip
                                  label={`+${order.products.length - 1}`}
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 1,
                                color: "text.secondary",
                              }}
                            >
                              <PersonIcon fontSize="small" />
                              <Typography variant="body2">
                                {order.buyerId?.fullName || "Không xác định"}
                              </Typography>
                              <StoreIcon fontSize="small" />
                              <Typography variant="body2">
                                {order.sellerId?.fullName || "Không xác định"}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={2}>
                            <Box sx={{ mb: 1 }}>
                              <StatusChip status={order.status} />
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              <Chip
                                label={getShippingMethod(order.shippingMethod)}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                              <Chip
                                label={getPaymentMethod(order.paymentMethod)}
                                size="small"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            </Box>
                            <Chip
                              label={order.statusPayment ? "Đã TT" : "Chưa TT"}
                              color={
                                order.statusPayment ? "success" : "warning"
                              }
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Grid>
                          <Grid item xs={12} md={3} textAlign="right">
                            <Typography
                              variant="h5"
                              color="error"
                              fontWeight="bold"
                            >
                              {formatCurrency(order.totalAmount)}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {formatDate(order.createdAt)}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDetail(order);
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <Dialog
          open={openDetailDialog}
          onClose={handleCloseDetail}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" component="div">
                Chi tiết đơn hàng{" "}
                {selectedOrder.ghnOrderCode && `#${selectedOrder.ghnOrderCode}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(selectedOrder.createdAt)} - Chế độ xem (Admin)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <StatusChip status={selectedOrder.status} size="large" />
              <IconButton onClick={handleCloseDetail}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <PersonIcon /> Người mua
                  </Typography>
                  <Typography>
                    {selectedOrder.buyerId?.fullName || "Không xác định"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.buyerId?.email || "Không có email"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.buyerId?.phoneNumber ||
                      "Không có số điện thoại"}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <StoreIcon /> Người bán
                  </Typography>
                  <Typography>
                    {selectedOrder.sellerId?.fullName || "Không xác định"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.sellerId?.email || "Không có email"}
                  </Typography>
                  {selectedOrder.sellerId?.seller && (
                    <Typography variant="body2" color="text.secondary">
                      {selectedOrder.sellerId.seller.province},{" "}
                      {selectedOrder.sellerId.seller.district}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Sản phẩm ({selectedOrder.products.length})
            </Typography>
            <List>
              {selectedOrder.products.map((product, index) => (
                <ListItem key={index} divider>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={
                        product.productId?.avatar?.url ||
                        product.productId?.images?.[0]?.url
                      }
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      product.productId?.name || "Sản phẩm không xác định"
                    }
                    secondary={`Số lượng: ${product.quantity} | Danh mục: ${
                      product.productId?.categoryId?.name || "Không xác định"
                    }`}
                  />
                  <Typography fontWeight="bold" color="error">
                    {formatCurrency(product.productId?.price || 0)}
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <LocalShippingOutlinedIcon
                    sx={{ verticalAlign: "bottom", mr: 1 }}
                  />
                  Thông tin vận chuyển
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography>
                    <strong>Phương thức:</strong>{" "}
                    {getShippingMethod(selectedOrder.shippingMethod)}
                  </Typography>
                  <Typography>
                    <strong>Người nhận:</strong>{" "}
                    {selectedOrder.shippingAddress?.fullName ||
                      "Không xác định"}
                  </Typography>
                  <Typography>
                    <strong>Điện thoại:</strong>{" "}
                    {selectedOrder.shippingAddress?.phoneNumber ||
                      "Không xác định"}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedOrder.shippingAddress?.specificAddress ||
                      "Không xác định"}
                    , {selectedOrder.shippingAddress?.ward || ""},{" "}
                    {selectedOrder.shippingAddress?.district || ""},{" "}
                    {selectedOrder.shippingAddress?.province || ""}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <ReceiptLongIcon sx={{ verticalAlign: "bottom", mr: 1 }} />
                  Thông tin thanh toán
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography>
                    <strong>Phương thức:</strong>{" "}
                    {getPaymentMethod(selectedOrder.paymentMethod)}
                  </Typography>
                  <Typography>
                    <strong>Trạng thái:</strong>{" "}
                    <Chip
                      label={
                        selectedOrder.statusPayment
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"
                      }
                      color={
                        selectedOrder.statusPayment ? "success" : "warning"
                      }
                      size="small"
                    />
                  </Typography>
                  {selectedOrder.statusPayment && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      <strong>Thông tin chuyển khoản:</strong>
                      <br />
                      Ngân hàng:{" "}
                      {selectedOrder.bankInfo?.bankName || "Không xác định"}
                      <br />
                      Số tài khoản:{" "}
                      {selectedOrder.bankInfo?.accountNumber ||
                        "Không xác định"}
                      <br />
                      Chủ tài khoản:{" "}
                      {selectedOrder.bankInfo?.accountHolder ||
                        "Không xác định"}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Cập nhật lần cuối: {formatDate(selectedOrder.updatedAt)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            <Box sx={{ flexGrow: 1, textAlign: "left" }}>
              <Typography variant="h5" fontWeight="bold">
                Tổng cộng:
              </Typography>
              <Typography variant="h4" color="error" fontWeight="bold">
                {formatCurrency(selectedOrder.totalAmount)}
              </Typography>
            </Box>
            <Button variant="outlined" onClick={handleCloseDetail}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default OrderManagement;
