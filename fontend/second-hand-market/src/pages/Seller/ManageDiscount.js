import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";

export default function ManageDiscount() {
  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    buyerId: "",
    price: "",
    endDate: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [prodRes, buyerRes, dealRes] = await Promise.all([
        axios.get("/products/by-user"),
        axios.get("/sellers/buyers-chatted"),
        axios.get("/sellers/personal-discount"),
      ]);
      setProducts(prodRes.data.data || []);
      setBuyers(buyerRes.data.data || []);
      setDeals(dealRes.data.data || []);
    } catch (err) {
      setMessage("Không thể tải dữ liệu!");
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/sellers/personal-discount", form);
      setMessage("Tạo deal thành công!");
      setMessageType("success");
      setForm({ productId: "", buyerId: "", price: "", endDate: "" });
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra");
      setMessageType("error");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy deal này?")) return;
    setSubmitting(true);
    try {
      await axios.delete(`/sellers/personal-discount/${id}`);
      setMessage("Đã hủy deal thành công!");
      setMessageType("success");
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra");
      setMessageType("error");
    }
    setSubmitting(false);
  };

  const getProductInfo = (id) => products.find((p) => p._id === id) || {};
  const getBuyerInfo = (id) => buyers.find((b) => b._id === id) || {};

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 1, md: 3 },
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">
        Quản lý Deal Giá Riêng
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        mb={4}
        textAlign="center"
      >
        Tạo và quản lý các deal giá riêng cho từng khách hàng đã trò chuyện.
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader
              avatar={<AddCircleOutlineIcon color="primary" />}
              title={<Typography variant="h6">Tạo deal mới</Typography>}
            />
            <CardContent>
              <Box
                component="form"
                onSubmit={handleSubmit}
                autoComplete="off"
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  select
                  label="Sản phẩm"
                  name="productId"
                  value={form.productId}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {products
                    .filter(
                      (p) => p.status === "active" || p.status === "approved"
                    )
                    .map((p) => (
                      <MenuItem key={p._id} value={p._id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {p.avatar?.url && (
                            <Avatar
                              src={p.avatar.url}
                              alt={p.name}
                              sx={{ width: 28, height: 28 }}
                            />
                          )}
                          <Tooltip title={p.name} arrow>
                            <span
                              style={{
                                maxWidth: 120,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                display: "inline-block",
                              }}
                            >
                              {p.name}
                            </span>
                          </Tooltip>
                          <span style={{ color: "#888" }}>
                            {p.price?.toLocaleString()}₫
                          </span>
                          {p.stock !== undefined && (
                            <span style={{ color: "#888" }}>
                              | SL: {p.stock}
                            </span>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  select
                  label="Buyer"
                  name="buyerId"
                  value={form.buyerId}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  {buyers.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {b.avatar && (
                          <Avatar
                            src={b.avatar}
                            alt={b.fullName}
                            sx={{ width: 28, height: 28 }}
                          />
                        )}
                        <span>{b.fullName || b.name}</span>
                        <span style={{ color: "#888", fontSize: 12 }}>
                          {b.email}
                        </span>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Giá deal (VNĐ)"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  fullWidth
                  inputProps={{ min: 0 }}
                />
                <TextField
                  label="Ngày hết hạn"
                  name="endDate"
                  type="datetime-local"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} /> : "Tạo deal"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bảng danh sách deal nằm dưới cùng, full width */}
      <Box sx={{ mt: 5 }}>
        <Card elevation={2}>
          <CardHeader
            title={<Typography variant="h6">Danh sách deal đã tạo</Typography>}
          />
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table
          
                sx={{  overflowX: "auto", width: "100%" }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell>Buyer</TableCell>
                      <TableCell align="center">Giá deal</TableCell>
                      <TableCell align="center">Hết hạn</TableCell>
                      <TableCell align="center">Trạng thái</TableCell>
                      <TableCell align="center"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deals.map((deal) => {
                      const expired =
                        !deal.isActive || new Date(deal.endDate) <= new Date();
                      const product =
                        deal.productId || getProductInfo(deal.productId);
                      const buyer = deal.buyerId || getBuyerInfo(deal.buyerId);

                      return (
                        <TableRow key={deal._id} hover>
                          {/* Cột Sản phẩm */}
                          <TableCell
                            sx={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {product?.avatar?.url && (
                                <Avatar
                                  src={product.avatar.url}
                                  alt={product.name}
                                  sx={{ width: 28, height: 28 }}
                                />
                              )}
                              <Tooltip title={product?.name || ""} arrow>
                                <span>{product?.name}</span>
                              </Tooltip>
                            </Box>
                          </TableCell>

                          {/* Cột Buyer */}
                          <TableCell
                            sx={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              {buyer?.avatar && (
                                <Avatar
                                  src={buyer.avatar}
                                  alt={buyer.fullName}
                                  sx={{ width: 28, height: 28 }}
                                />
                              )}
                              <Box>
                                <Tooltip
                                  title={buyer?.fullName || buyer?.name || ""}
                                  arrow
                                >
                                  <div>{buyer?.fullName || buyer?.name}</div>
                                </Tooltip>
                                <Tooltip title={buyer?.email || ""} arrow>
                                  <div style={{ color: "#888", fontSize: 12 }}>
                                    {buyer?.email}
                                  </div>
                                </Tooltip>
                              </Box>
                            </Box>
                          </TableCell>

                          {/* Cột Giá deal */}
                          <TableCell align="center">
                            {deal.price?.toLocaleString()}₫
                          </TableCell>

                          {/* Cột Hết hạn */}
                          <TableCell align="center">
                            {new Date(deal.endDate).toLocaleString()}
                          </TableCell>

                          {/* Cột Trạng thái */}
                          <TableCell align="center">
                            <Chip
                              label={
                                expired ? "Hết hạn/Đã hủy" : "Còn hiệu lực"
                              }
                              color={expired ? "default" : "success"}
                              size="small"
                            />
                          </TableCell>

                          {/* Cột thao tác (xóa) */}
                          <TableCell align="center">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(deal._id)}
                              disabled={submitting}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Table>
            )}
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={!!message}
        autoHideDuration={3500}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={messageType} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
