import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Rating,
  TextField,
  Button,
  Chip,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  Star,
  Store,
  Schedule,
  Verified,
  Send,
  Close,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import ApiService from "../../services/ApiService";
import { useParams, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function FeedBackSeller() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const [reviewId, setReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      setFetching(true);
      try {
        const response = await ApiService.get(`/orders/${orderId}`);
        setOrderData(response.data.order);
      } catch (e) {
        setSnackbar({
          open: true,
          message: "Không thể tải dữ liệu đơn hàng!",
          severity: "error",
        });
      }
      setFetching(false);
    };
    const fetchReview = async () => {
      try {
        const res = await ApiService.get(`/seller-reviews/by-order/${orderId}`);
        if (res.data.review) {
          setRating(res.data.review.rating);
          setComment(res.data.review.comment);
          setReviewId(res.data.review._id);
        }
      } catch (e) {}
    };
    fetchOrderData();
    fetchReview();
  }, [orderId]);

  const handleSubmit = () => {
    if (rating === 0) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn số sao đánh giá!",
        severity: "warning",
      });
      return;
    }
    if (reviewId) {
      setShowUpdateConfirm(true);
    } else {
      setShowDialog(true);
    }
  };

  const handleConfirmUpdate = async () => {
    setShowUpdateConfirm(false);
    await confirmSubmit();
  };

  const confirmSubmit = async () => {
    setShowDialog(false);
    setLoading(true);
    try {
      if (reviewId) {
        await ApiService.put(`/seller-reviews/${reviewId}`, {
          rating,
          comment,
        });
        setSnackbar({
          open: true,
          message: "Cập nhật đánh giá thành công!",
          severity: "success",
        });
      } else {
        await ApiService.post("/seller-reviews", {
          sellerId: orderData?.sellerId?._id,
          orderId: orderData?._id,
          rating,
          comment,
        });
        setSnackbar({
          open: true,
          message: "Gửi đánh giá thành công!",
          severity: "success",
        });
      }
      setSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setComment("");
        setSubmitted(false);
        setLoading(false);
        navigate("/eco-market/customer/orders");
      }, 1200);
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.message ||
          "Gửi đánh giá thất bại. Vui lòng thử lại!",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const ratingLabels = {
    1: "Rất không hài lòng",
    2: "Không hài lòng",
    3: "Bình thường",
    4: "Hài lòng",
    5: "Rất hài lòng",
  };

  if (fetching) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <LinearProgress sx={{ width: 300 }} />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: "#f5f5f5", minHeight: "100vh" }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={orderData?.sellerId?.avatar}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                <Box>
                  <Box display="flex" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {orderData?.sellerId?.fullName}
                    </Typography>
                    {orderData?.sellerId?.verified && (
                      <Verified
                        sx={{ ml: 1, color: "primary.main", fontSize: 20 }}
                      />
                    )}
                  </Box>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Rating
                      value={Number(orderData?.sellerId?.avgRating) || 0}
                      readOnly
                      precision={0.1}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      ({orderData?.sellerId?.totalReviews || 0} đánh giá)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" mb={1}>
                <Store sx={{ mr: 1, color: "text.secondary", fontSize: 20 }} />
                <Typography variant="body2">
                  {orderData?.sellerId?.productCount || 0} sản phẩm
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <Schedule
                  sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                />
                <Typography variant="body2">
                  {/* Nếu có responseTime từ backend thì dùng, không thì bỏ qua */}
                  {orderData?.sellerId?.responseTime || ""}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {orderData?.sellerId?.createdAt
                  ? `Tham gia từ ${new Date(
                      orderData.sellerId.createdAt
                    ).toLocaleDateString("vi-VN")}`
                  : ""}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Form đánh giá */}
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                gutterBottom
                fontWeight="bold"
                color="primary"
              >
                Đánh giá Seller
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
                  Cảm ơn bạn đã đánh giá! Đánh giá của bạn sẽ giúp ích cho cộng
                  đồng.
                </Alert>
              )}

              <Box mb={4}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Đánh giá
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Rating
                    value={rating}
                    onChange={(event, newValue) => setRating(newValue)}
                    size="large"
                    sx={{ mr: 2 }}
                  />
                  {rating > 0 && (
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {ratingLabels[rating]}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box mb={4}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Nhận xét
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Chia sẻ trải nghiệm của bạn với seller này..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  inputProps={{ maxLength: 500 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  {comment.length}/500 ký tự
                </Typography>
              </Box>

              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleSubmit}
                  disabled={submitted || loading}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  {reviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => {
                    setRating(0);
                    setComment("");
                  }}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Làm mới
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog xác nhận */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="bold">
              Xác nhận đánh giá
            </Typography>
            <IconButton onClick={() => setShowDialog(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" mb={2}>
            Bạn có chắc chắn muốn gửi đánh giá này không?
          </Typography>

          <Card variant="outlined" sx={{ bgcolor: "grey.50", p: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              <strong>Đánh giá:</strong> {rating} sao - {ratingLabels[rating]}
            </Typography>
            {comment && (
              <Typography variant="body2" color="text.secondary">
                <strong>Nhận xét:</strong> "{comment.substring(0, 100)}
                {comment.length > 100 ? "..." : ""}"
              </Typography>
            )}
          </Card>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowDialog(false)}
            variant="outlined"
            size="large"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmSubmit}
            variant="contained"
            startIcon={<CheckCircle />}
            size="large"
            disabled={loading}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog xác nhận cập nhật đánh giá */}
      <Dialog
        open={showUpdateConfirm}
        onClose={() => setShowUpdateConfirm(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận cập nhật đánh giá</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn cập nhật lại đánh giá này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateConfirm(false)} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}
