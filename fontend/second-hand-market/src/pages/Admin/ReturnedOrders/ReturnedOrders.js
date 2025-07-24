import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
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
} from "@mui/material";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Assessment as AssessmentIcon,
  Inbox as InboxIcon,
  ReceiptLong as ReceiptLongIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  LocalShippingOutlined as LocalShippingOutlinedIcon,
} from "@mui/icons-material";
import orderService from "../../../services/orderService";
import { formatDate } from "../../../utils/helpers";
import { QRCodeSVG } from "qrcode.react";

const bankCodeToBin = {
  VCB: "970436",
  TCB: "970407",
  BIDV: "970418",
  MB: "970422",
  VPB: "970432",
  ACB: "970416",
};

function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).padStart(4, "0");
}

function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

function emv(id, value) {
  const v = Array.isArray(value) ? value.join("") : value;
  return pad2(id) + pad2(v.length) + v;
}

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[ \u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Z0-9 ]/gi, "")
    .toUpperCase();
}

function buildVietQR({ bin, accountNumber, accountName, amount, addInfo }) {
  // Merchant Account Information - VietQR
  const vietqr = [
    emv("00", "A000000727"),
    emv("01", bin),
    emv("02", accountNumber),
    emv("08", removeVietnameseTones(accountName)),
  ];
  const mai = emv("38", vietqr);

  // Additional Data Field Template
  const addData = addInfo ? emv("08", addInfo) : "";

  // Build payload
  let payload =
    emv("00", "01") +
    emv("01", "12") +
    mai +
    emv("52", "0000") +
    emv("53", "704") +
    (amount ? emv("54", amount.toString()) : "") +
    emv("58", "VN") +
    (addData ? emv("62", addData) : "");

  // CRC16-CCITT
  payload += "6304";
  payload += crc16(payload).toUpperCase();

  return payload;
}

export default function ReturnedOrders() {
  const [orderRefundInfo, setOrderRefundInfo] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await orderService.getAllOrderRefund();
        setOrderRefundInfo(response.bankInfos || []);
      } catch (error) {
        setOrderRefundInfo([]);
      }
    };
    fetchData();
  }, []);

  const filteredOrders = orderRefundInfo.filter((info) => {
    const order = info.orderId || {};
    const user = info.userId || {};
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      order._id?.toLowerCase().includes(lowerCaseQuery) ||
      user.fullName?.toLowerCase().includes(lowerCaseQuery) ||
      order.products?.some((product) =>
        product.productId?.name?.toLowerCase().includes(lowerCaseQuery)
      )
    );
  });

  const stats = {
    total: orderRefundInfo.length,
    refunded: orderRefundInfo.length,
  };

  const handleOpenDetail = (info) => {
    setSelectedOrder(info);
    setOpenDetailDialog(true);
  };
  const handleCloseDetail = () => {
    setOpenDetailDialog(false);
    setSelectedOrder(null);
  };

  // Phân loại đơn đã hoàn tiền và chưa hoàn tiền
  const completedOrders = filteredOrders.filter(
    (info) => info.status === "completed"
  );
  const pendingOrders = filteredOrders.filter(
    (info) => info.status !== "completed"
  );

  // Hàm xác nhận hoàn tiền
  const handleConfirmRefund = async (orderId) => {
    const response = await orderService.confirmRefund(orderId);
    setOrderRefundInfo((prev) =>
      prev.map((info) => (info.orderId._id === orderId ? response.order : info))
    );

    setOpenDetailDialog(false);
    setSelectedOrder(null);
  };

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
              Quản lý Đơn hoàn tiền đã xác nhận (Admin)
            </Typography>
   
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Paper
              elevation={2}
              sx={{ p: 2.5, display: "flex", alignItems: "center" }}
            >
              <Avatar
                sx={{
                  bgcolor: "success.main",
                  color: "white",
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                💰
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {stats.refunded}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đơn đã xác nhận hoàn tiền
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            <Paper
              elevation={2}
              sx={{ p: 2.5, display: "flex", alignItems: "center" }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  width: 48,
                  height: 48,
                  mr: 2,
                }}
              >
                📝
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tổng đơn hoàn tiền
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                label="Tìm kiếm đơn hoàn"
                placeholder="Tìm theo mã đơn, sản phẩm, người nhận..."
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
          </Grid>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: "block" }}
          >
            Hiển thị {filteredOrders.length} / {orderRefundInfo.length} đơn hoàn
            tiền
          </Typography>
        </Paper>

        {/* Danh sách đơn hoàn tiền */}
        <Box>
          {/* Đơn chưa hoàn tiền */}
          {pendingOrders.length > 0 && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, mt: 2, color: "#FBC02D" }}
              >
                Đơn CHƯA hoàn tiền
              </Typography>
              <Grid container spacing={3}>
                {pendingOrders.map((info) => {
                  const order = info.orderId || {};
                  const user = info.userId || {};
                  return (
                    <Grid item xs={12} key={info._id}>
                      <Card
                        elevation={2}
                        sx={{ transition: "0.3s", "&:hover": { boxShadow: 6 } }}
                      >
                        <CardActionArea onClick={() => handleOpenDetail(info)}>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={1.5}>
                                <Avatar
                                  variant="rounded"
                                  src={
                                    order.products?.[0]?.productId?.avatar
                                      ?.url ||
                                    order.products?.[0]?.productId?.images?.[0]
                                      ?.url
                                  }
                                  sx={{ width: 64, height: 64 }}
                                />
                              </Grid>
                              <Grid item xs={12} md={5.5}>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  noWrap
                                >
                                  {order.products?.[0]?.productId?.name ||
                                    "Sản phẩm không xác định"}
                                  {order.products?.length > 1 && (
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
                                    {user.fullName || "Không xác định"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 1,
                                    color: "text.secondary",
                                  }}
                                >
                                  <Typography variant="caption">
                                    Danh mục:{" "}
                                    {order.products?.[0]?.productId?.categoryId
                                      ?.name || "-"}
                                  </Typography>
                                  <Typography variant="caption">
                                    | Phân loại:{" "}
                                    {order.products?.[0]?.productId
                                      ?.subcategoryId?.name || "-"}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <Box sx={{ mb: 1 }}>
                                  <Chip
                                    label="Chờ hoàn tiền"
                                    color="warning"
                                    icon={<ReceiptLongIcon />}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3} textAlign="right">
                                <Typography
                                  variant="h6"
                                  color="error"
                                  fontWeight="bold"
                                >
                                  {(
                                    (order.totalAmount || 0) +
                                    (order.shippingFee || 0)
                                  ).toLocaleString("vi-VN")}{" "}
                                  ₫
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {formatDate(order.createdAt)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
          {/* Đơn đã hoàn tiền */}
          {completedOrders.length > 0 && (
            <>
              <Typography
                variant="subtitle1"
                sx={{ mb: 1, mt: 4, color: "#388E3C" }}
              >
                Đơn ĐÃ hoàn tiền
              </Typography>
              <Grid container spacing={3}>
                {completedOrders.map((info) => {
                  const order = info.orderId || {};
                  const user = info.userId || {};
                  return (
                    <Grid item xs={12} key={info._id}>
                      <Card
                        elevation={2}
                        sx={{ transition: "0.3s", "&:hover": { boxShadow: 6 } }}
                      >
                        <CardActionArea onClick={() => handleOpenDetail(info)}>
                          <CardContent>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} md={1.5}>
                                <Avatar
                                  variant="rounded"
                                  src={
                                    order.products?.[0]?.productId?.avatar
                                      ?.url ||
                                    order.products?.[0]?.productId?.images?.[0]
                                      ?.url
                                  }
                                  sx={{ width: 64, height: 64 }}
                                />
                              </Grid>
                              <Grid item xs={12} md={5.5}>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  noWrap
                                >
                                  {order.products?.[0]?.productId?.name ||
                                    "Sản phẩm không xác định"}
                                  {order.products?.length > 1 && (
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
                                    {user.fullName || "Không xác định"}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 1,
                                    color: "text.secondary",
                                  }}
                                >
                                  <Typography variant="caption">
                                    Danh mục:{" "}
                                    {order.products?.[0]?.productId?.categoryId
                                      ?.name || "-"}
                                  </Typography>
                                  <Typography variant="caption">
                                    | Phân loại:{" "}
                                    {order.products?.[0]?.productId
                                      ?.subcategoryId?.name || "-"}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <Box sx={{ mb: 1 }}>
                                  <Chip
                                    label="Đã hoàn tiền"
                                    color="success"
                                    icon={<ReceiptLongIcon />}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={3} textAlign="right">
                                <Typography
                                  variant="h6"
                                  color="error"
                                  fontWeight="bold"
                                >
                                  {(
                                    (order.totalAmount || 0) +
                                    (order.shippingFee || 0)
                                  ).toLocaleString("vi-VN")}{" "}
                                  ₫
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {formatDate(order.createdAt)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </Box>
      </Container>

      {/* Modal chi tiết đơn hoàn tiền */}
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
              <Typography variant="h6">
                Chi tiết đơn hoàn tiền #{selectedOrder.orderId?._id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(selectedOrder.orderId?.createdAt)} - Chế độ xem
                (Admin)
              </Typography>
            </Box>
            <IconButton onClick={handleCloseDetail}>
              <CloseIcon />
            </IconButton>
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
                    {selectedOrder.userId?.fullName || "Không xác định"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.userId?.email || "Không có email"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.userId?.phoneNumber ||
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
                    {selectedOrder.orderId?.sellerId?.fullName ||
                      "Không xác định"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.orderId?.sellerId?.email || "Không có email"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.orderId?.sellerId?.phoneNumber ||
                      "Không có số điện thoại"}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Sản phẩm ({selectedOrder.orderId?.products?.length || 0})
            </Typography>
            <List>
              {selectedOrder.orderId?.products?.map((product, index) => (
                <ListItem key={index} divider alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={
                        product.productId?.avatar?.url ||
                        product.productId?.images?.[0]?.url
                      }
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 2,
                        border: "1px solid #eee",
                        mr: 2,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        fontWeight={700}
                        fontSize={16}
                        sx={{ mb: 0.5 }}
                        noWrap
                      >
                        {product.productId?.name || "Sản phẩm không xác định"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Số lượng: <b>{product.quantity}</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Giá:{" "}
                          <b>
                            {product.productId?.price?.toLocaleString(
                              "vi-VN"
                            ) || "-"}{" "}
                            ₫
                          </b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Danh mục:{" "}
                          <b>{product.productId?.categoryId?.name || "-"}</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phân loại:{" "}
                          <b>{product.productId?.subcategoryId?.name || "-"}</b>
                        </Typography>
                      </>
                    }
                  />
                  <Typography
                    fontWeight="bold"
                    color="error"
                    fontSize={18}
                    sx={{ minWidth: 90, textAlign: "right" }}
                  >
                    {product.productId?.price?.toLocaleString("vi-VN")} ₫
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <ReceiptLongIcon sx={{ verticalAlign: "bottom", mr: 1 }} />
                  Thông tin hoàn tiền
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography>
                    <strong>Ngân hàng:</strong> {selectedOrder.bankName || "-"}
                  </Typography>
                  <Typography>
                    <strong>Số tài khoản:</strong>{" "}
                    {selectedOrder.accountNumber || "-"}
                  </Typography>
                  <Typography>
                    <strong>Tên chủ TK:</strong>{" "}
                    {selectedOrder.accountHolder || "-"}
                  </Typography>

                  {selectedOrder.orderId?.totalAmount &&
                    selectedOrder.accountNumber &&
                    selectedOrder.bankName &&
                    (() => {
                      const bin = bankCodeToBin[selectedOrder.bankName];
                      if (!bin) {
                        return (
                          <Typography color="error">
                            Không tìm thấy BIN cho mã ngân hàng:{" "}
                            {selectedOrder.bankName}
                          </Typography>
                        );
                      }
                      const qrData = buildVietQR({
                        bin,
                        accountNumber: selectedOrder.accountNumber,
                        accountName: selectedOrder.accountHolder,
                        amount:
                          (selectedOrder.orderId.totalAmount || 0) +
                          (selectedOrder.orderId.shippingFee || 0),
                        addInfo: `Refund_${selectedOrder.orderId._id}`,
                      });
                      return (
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            QR chuyển khoản nhanh
                          </Typography>
                          <QRCodeSVG
                            value={qrData}
                            size={180}
                            includeMargin={true}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: "block" }}
                          >
                            Quét QR để chuyển khoản đúng thông tin
                          </Typography>
                        </Box>
                      );
                    })()}
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <LocalShippingOutlinedIcon
                    sx={{ verticalAlign: "bottom", mr: 1 }}
                  />
                  Thông tin vận chuyển
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography>
                    <strong>Người nhận:</strong>{" "}
                    {selectedOrder.orderId?.shippingAddress?.fullName ||
                      "Không xác định"}
                  </Typography>
                  <Typography>
                    <strong>Điện thoại:</strong>{" "}
                    {selectedOrder.orderId?.shippingAddress?.phoneNumber ||
                      "Không xác định"}
                  </Typography>
                  <Typography>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedOrder.orderId?.shippingAddress?.specificAddress ||
                      "Không xác định"}
                    , {selectedOrder.orderId?.shippingAddress?.ward || ""},{" "}
                    {selectedOrder.orderId?.shippingAddress?.district || ""},{" "}
                    {selectedOrder.orderId?.shippingAddress?.province || ""}
                  </Typography>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, bgcolor: "grey.50", mt: 2 }}
                >
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Tổng tiền hoàn:&nbsp;
                      {(selectedOrder.orderId?.totalAmount || 0).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (Tiền sản phẩm:{" "}
                      {(
                        selectedOrder.orderId?.totalAmount -
                          selectedOrder.orderId?.shippingFee || 0
                      ).toLocaleString("vi-VN")}{" "}
                      ₫ + Phí ship:{" "}
                      {(selectedOrder.orderId?.shippingFee || 0).toLocaleString(
                        "vi-VN"
                      )}{" "}
                      ₫)
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Cập nhật lần cuối:{" "}
                {formatDate(selectedOrder.orderId?.updatedAt)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: "16px 24px" }}>
            {selectedOrder.status !== "completed" && (
              <Button
                variant="contained"
                color="success"
                sx={{ float: "right" }}
                onClick={() => handleConfirmRefund(selectedOrder.orderId?._id)}
              >
                Xác nhận đã hoàn tiền
              </Button>
            )}
            <Button variant="outlined" onClick={handleCloseDetail}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
