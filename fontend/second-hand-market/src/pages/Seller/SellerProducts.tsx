import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm import này
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Tooltip,
  Stack,
  Avatar,
  Divider,
  ButtonGroup,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  PhotoCamera as PhotoIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import SellerApi from "./SellerApi";

import UpdateProductModal from "./UpdateProductModal";
import ApiService from "../../services/ApiService";

const SellerProducts = () => {
  const navigate = useNavigate(); // Khởi tạo hook navigate
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    product: null,
  });
  const [viewDialog, setViewDialog] = useState({ open: false, product: null });

  const [updateDialog, setUpdateDialog] = useState({
    open: false,
    product: null,
  });

  // State for resubmit loading
  const [resubmitLoadingId, setResubmitLoadingId] = useState(null);

  // Function to request admin re-approval
  const handleResubmit = async (productId) => {
    setResubmitLoadingId(productId);
    setError("");
    try {
      await ApiService.patch("/products/update-status", {
        productId: productId,
        status: "pending",
      });

      await loadProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setResubmitLoadingId(null);
    }
  };

  const statusConfig = {
    pending: {
      color: "warning",
      label: "Chờ duyệt",
      sx: {
        bgcolor: "#fff3e0",
        color: "#e65100",
        fontWeight: 500,
      },
    },
    approved: {
      color: "success",
      label: "Đang bán",
      sx: {
        bgcolor: "#e8f5e8",
        color: "#2e7d32",
        fontWeight: 500,
      },
    },
    pending_review: {
      color: "warning",
      label: "Chờ duyệt",
      sx: {
        bgcolor: "#fff3e0",
        color: "#e65100",
        fontWeight: 500,
      },
    },
    rejected: {
      color: "error",
      label: "Từ chối",
      sx: {
        bgcolor: "#ffebee",
        color: "#c62828",
        fontWeight: 500,
      },
    },
    inactive: {
      color: "default",
      label: "Ngừng",
      sx: {
        bgcolor: "#f5f5f5",
        color: "#757575",
        fontWeight: 500,
      },
    },
    sold: {
      color: "info",
      label: "Hết hàng",
      sx: {
        bgcolor: "#e3f2fd",
        color: "#1565c0",
        fontWeight: 500,
      },
    },
    active: {
      color: "primary",
      label: "Đang hoạt động",
      sx: {
        bgcolor: "#e3f2fd",
        color: "#0d47a1",
        fontWeight: 500,
      },
    },
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await SellerApi.getMyProducts();
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    try {
      await SellerApi.deleteProduct(deleteDialog.product._id);
      setDeleteDialog({ open: false, product: null });
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateSuccess = async () => {
    setUpdateDialog({ open: false, product: null });
    await loadProducts(); // Reload danh sách sản phẩm
  };

  // Thêm function để xử lý navigation
  const handleAddProduct = () => {
    navigate("/eco-market/seller/products/create");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStats = () => {
    const total = products.length;
    const approved = products.filter((p) => p.status === "approved").length;
    const sold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
    return { total, approved, sold };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header với Stats */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="primary">
              Sản phẩm của tôi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý {stats.total} sản phẩm
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProduct} // Thêm onClick handler
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Thêm mới
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Search & Filter */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            size="small"
            placeholder="Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <TextField
            size="small"
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đang bán</MenuItem>
            <MenuItem value="rejected">Từ chối</MenuItem>
            <MenuItem value="inactive">Ngừng bán</MenuItem>
            <MenuItem value="sold">Hết hàng</MenuItem>
          </TextField>
          <IconButton onClick={loadProducts} size="small">
            <RefreshIcon />
          </IconButton>
        </Stack>
      </Paper>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <InventoryIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {searchTerm || statusFilter !== "all"
              ? "Không tìm thấy sản phẩm"
              : "Chưa có sản phẩm nào"}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                  },
                  borderRadius: 2,
                }}
              >
                {/* Product Image */}
                <Box
                  sx={{
                    position: "relative",
                    height: 160,
                    bgcolor: "grey.100",
                  }}
                >
                  {product.avatar?.url ? (
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.avatar.url}
                      alt={product.name}
                      sx={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PhotoIcon
                        sx={{ fontSize: 40, color: "text.disabled" }}
                      />
                    </Box>
                  )}

                  {/* Status Badge */}
                  <Chip
                    label={
                      statusConfig[product.status]?.label || "Không xác định"
                    }
                    color={statusConfig[product.status]?.color || "default"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: "0.7rem",
                      height: 20,
                      ...statusConfig[product.status]?.sx,
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2 }}>
                  {/* Product Name */}
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Price & Stock */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(product.price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      SL: {product.stock}
                    </Typography>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Đã bán: {product.soldCount || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(product.createdAt)}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 1.5 }} />

                  {/* Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <ButtonGroup size="small" variant="outlined">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => setViewDialog({ open: true, product })}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {/* Ẩn nút sửa nếu đã bán hết */}
                      {product.status !== "sold" && (
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setUpdateDialog({ open: true, product })
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </ButtonGroup>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {/* Ẩn nút xóa nếu đã bán hết */}
                      {product.status !== "sold" && (
                        <Tooltip title="Xóa sản phẩm">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              setDeleteDialog({ open: true, product })
                            }
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {/* Nút yêu cầu duyệt lại cho sản phẩm bị từ chối */}
                      {product.status === "rejected" && (
                        <Tooltip title="Yêu cầu admin duyệt lại">
                          <span>
                            <Button
                              size="small"
                              variant="contained"
                              color="warning"
                              disabled={!!resubmitLoadingId}
                              onClick={() => handleResubmit(product._id)}
                              sx={{ fontWeight: 600, minWidth: 120 }}
                            >
                              {resubmitLoadingId === product._id ? (
                                <CircularProgress size={18} color="inherit" />
                              ) : (
                                "Yêu cầu duyệt lại"
                              )}
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Dialog - Compact */}
      <Dialog
        open={viewDialog.open}
        onClose={() => setViewDialog({ open: false, product: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6">Chi tiết sản phẩm</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {viewDialog.product && (
            <Box>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Avatar
                  src={viewDialog.product.avatar?.url}
                  sx={{ width: 180, height: 180 }}
                  variant="rounded"
                >
                  <PhotoIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {viewDialog.product.name}
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    {formatPrice(viewDialog.product.price)}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Số lượng
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {viewDialog.product.stock}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Đã bán
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {viewDialog.product.soldCount || 0}
                  </Typography>
                </Grid>
              </Grid>

              {viewDialog.product.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Mô tả
                  </Typography>
                  <Typography variant="body2">
                    {viewDialog.product.description}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog({ open: false, product: null })}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog - Compact */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, product: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Xóa "{deleteDialog.product?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, product: null })}
          >
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
      <UpdateProductModal
        open={updateDialog.open}
        onClose={() => setUpdateDialog({ open: false, product: null })}
        product={updateDialog.product}
        onSuccess={handleUpdateSuccess}
      />
    </Box>
  );
};

export default SellerProducts;
