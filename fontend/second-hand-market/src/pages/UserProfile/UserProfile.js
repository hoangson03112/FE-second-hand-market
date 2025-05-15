import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Rating,
  Tab,
  Tabs,
  TextField,
  Typography,
  InputAdornment,
  Snackbar,
  Alert,
  Skeleton,
  Badge,
  createTheme,
  ThemeProvider,
  Pagination,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Watch as WatchIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  PhotoCamera,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import AccountContext from "../../contexts/AccountContext";
import { formatDate } from "./../../utils/function";
import { useProduct } from "../../contexts/ProductContext";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";


const theme = createTheme({
  palette: {
    primary: {
      main: "#344960",
      light: "#496883",
      dark: "#2a3b4c",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#a68a64",
      light: "#c8b6a6",
      dark: "#8a7253",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#d4ac6e",
    },
    error: {
      main: "#c26d66",
    },
    success: {
      main: "#698474",
    },
    info: {
      main: "#6e99b4",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#6c757d",
    },
  },
});

const UserProfile = () => {
  const { getProductsByUser } = useProduct();
  const { updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [account, setAccount] = useState({});
  const [accountUpdate, setAccountUpdate] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: {
      province: "",
      district: "",
      ward: "",
      specificAddress: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [userProducts, setUserProducts] = useState([]);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Thêm state cho phân trang
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(6);

  const reviews = [
    {
      id: 1,
      name: "Trần Thị B",
      avatar: "https://via.placeholder.com/50",
      rating: 5,
      comment:
        "Sản phẩm chất lượng tốt, giao hàng nhanh và đúng mô tả. Người bán rất thân thiện và hỗ trợ nhiệt tình!",
      date: "01/03/2025",
    },
    {
      id: 2,
      name: "Lê Văn C",
      avatar: "https://via.placeholder.com/50",
      rating: 4,
      comment:
        "Đóng gói cẩn thận, hàng đúng như mô tả. Tôi rất hài lòng với giao dịch này.",
      date: "15/02/2025",
    },
  ];

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setAccount(user);
      setAccountUpdate(user);
    } catch (error) {
      console.error("Error fetching user account:", error);
      setSnackbar({
        open: true,
        message: "Không thể tải thông tin tài khoản",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsOfUser = async () => {
    try {
      const data = await getProductsByUser();
      console.log(data);

      setUserProducts(data);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  useEffect(() => {
    fetchProductsOfUser();
    fetchAccount();
  }, []);

  const handleChangePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setSnackbar({
        open: true,
        message: "Mật khẩu mới không khớp!",
        severity: "error",
      });
      return;
    }

    try {
      const response = await AccountContext.changePassword({
        oldPassword,
        newPassword,
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: "Đổi mật khẩu thành công!",
          severity: "success",
        });
        setOpenChangePassword(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Đổi mật khẩu thất bại!",
        severity: "error",
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSaveChanges = async () => {
    try {
      await updateProfile(accountUpdate);
      await fetchAccount();
      setEditing(false);
      Swal.fire({
        title: "Thành Công!",
        icon: "success",
        draggable: true,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!" + error,
      });
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderInfoSection = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="80%" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="100%" />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="text" width="80%" />
            </Grid>
          </Grid>
        </Box>
      );
    }

    if (editing) {
      return (
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Nhóm thông tin cơ bản */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom color="primary">
                Thông tin cá nhân
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                value={accountUpdate.fullName || ""}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    fullName: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số điện thoại"
                variant="outlined"
                value={accountUpdate.phoneNumber || ""}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={accountUpdate.email || ""}
                onChange={(e) =>
                  setAccountUpdate({ ...accountUpdate, email: e.target.value })
                }
              />
            </Grid>

            {/* Nhóm thông tin địa chỉ */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Địa chỉ
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tỉnh/Thành phố"
                variant="outlined"
                value={accountUpdate.address?.province || ""}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    address: {
                      ...accountUpdate.address,
                      province: e.target.value,
                    },
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quận/Huyện"
                variant="outlined"
                value={accountUpdate.address?.district || ""}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    address: {
                      ...accountUpdate.address,
                      district: e.target.value,
                    },
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Phường/Xã"
                variant="outlined"
                value={accountUpdate.address?.ward || ""}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    address: {
                      ...accountUpdate.address,
                      ward: e.target.value,
                    },
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ cụ thể"
                variant="outlined"
                multiline
                rows={2}
                value={accountUpdate.address?.specificAddress || ""}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    address: {
                      ...accountUpdate.address,
                      specificAddress: e.target.value,
                    },
                  })
                }
              />
            </Grid>

            {/* Nhóm nút điều khiển */}
            <Grid
              item
              xs={12}
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setEditing(false)}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  order: { xs: 2, sm: 1 },
                }}
              >
                Hủy bỏ
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  order: { xs: 1, sm: 2 },
                }}
              >
                Lưu thay đổi
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    }

    if (openChangePassword) {
      return (
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8} sx={{ mx: "auto" }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Đổi mật khẩu
                </Typography>

                <TextField
                  margin="normal"
                  fullWidth
                  label="Mật khẩu cũ"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  label="Mật khẩu mới"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  label="Xác nhận mật khẩu mới"
                  type={showPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setOpenChangePassword(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={
                      !passwordData.oldPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword
                    }
                    onClick={handleChangePassword}
                  >
                    Xác nhận
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="500">
            {account.fullName}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => setEditing(true)}
              color="primary"
              size="small"
            >
              Chỉnh sửa
            </Button>
            <Button
              startIcon={<LockIcon />}
              variant="outlined"
              onClick={() => setOpenChangePassword(true)}
              color="primary"
              size="small"
            >
              Đổi mật khẩu
            </Button>
          </Box>
        </Box>

        <Paper sx={{ mt: 3, p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {account.email || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {account.phoneNumber || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <LocationIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body1">
                  {[
                    account.address?.specificAddress,
                    account.address?.ward,
                    account.address?.district,
                    account.address?.province,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Chưa cập nhật"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WatchIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Tham gia từ:{" "}
                  {formatDate(account?.createdAt) || "Không xác định"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  const renderProductsTab = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={30} width="80%" />
                    <Skeleton variant="text" height={24} width="40%" />
                    <Skeleton variant="text" height={20} width="30%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    if (userProducts.length === 0) {
      return (
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            p: 4,
          }}
        >
          <ShoppingBagIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Bạn chưa có sản phẩm nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy đăng sản phẩm để bắt đầu bán hàng
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              background:
                "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
              "&:hover": {
                background:
                  "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
                filter: "brightness(1.1)",
              },
            }}
          >
            Đăng sản phẩm mới
          </Button>
        </Box>
      );
    }

    // Tính toán phân trang
    const indexOfLastProduct = page * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = userProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );
    const totalPages = Math.ceil(userProducts.length / productsPerPage);

    return (
      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 5 },
                  borderTop: "3px solid #344960",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.avatar}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <Chip
                    label={
                      product.status === "pending"
                        ? "Chờ duyệt"
                        : product.status === "approved"
                        ? "Đã duyệt"
                        : "Từ chối"
                    }
                    color={
                      product.status === "pending"
                        ? "warning"
                        : product.status === "approved"
                        ? "success"
                        : "error"
                    }
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    noWrap
                    title={product.name}
                    sx={{ fontWeight: 500 }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {product?.price?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Số lượng: {product.stock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(product.createdAt)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button size="small" color="primary">
                    Chỉnh sửa
                  </Button>
                  <Button size="small" color="error">
                    Xóa
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Thêm phân trang */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    background:
                      "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
                    color: "white",
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  const renderSnackbar = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        severity={snackbar.severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  const renderReviewsTab = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 3 }}>
          {[1, 2, 3].map((item) => (
            <Box key={item} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ width: "100%" }}>
                  <Skeleton variant="text" width="30%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="20%" />
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
            </Box>
          ))}
        </Box>
      );
    }

    if (reviews.length === 0) {
      return (
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            p: 4,
          }}
        >
          <StarIcon sx={{ fontSize: 60, color: "primary.light", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Chưa có đánh giá nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đánh giá từ khách hàng sẽ xuất hiện ở đây
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <StarIcon color="secondary" />
            <Typography variant="h6" sx={{ ml: 1 }} color="primary">
              Đánh giá ({reviews.length})
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <List disablePadding>
            {reviews.map((review) => (
              <React.Fragment key={review.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={review.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 500 }}
                          color="primary"
                        >
                          {review.name}
                        </Typography>
                        <Rating
                          value={review.rating}
                          size="small"
                          readOnly
                          precision={0.5}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="div"
                          variant="body2"
                          color="text.primary"
                          sx={{ my: 1 }}
                        >
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {review.date}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {reviews.indexOf(review) < reviews.length - 1 && (
                  <Divider variant="inset" component="li" sx={{ my: 1 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 0, mb: 4, pt: 5 }}>
        <Paper
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            boxShadow: 2,
            overflow: "hidden",
          }}
          elevation={2}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              mb: 4,
              alignItems: { xs: "center", md: "flex-start" },
              gap: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ position: "relative" }}>
                {loading ? (
                  <Skeleton variant="circular" width={150} height={150} />
                ) : (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <IconButton
                        sx={{
                          background:
                            "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
                          color: "white",
                          "&:hover": {
                            background:
                              "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
                            filter: "brightness(1.1)",
                          },
                        }}
                        size="small"
                      >
                        <PhotoCamera fontSize="small" sx={{ color: "white" }} />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 150,
                        height: 150,
                        border: "4px solid white",
                        boxShadow: 2,
                      }}
                      alt={account.fullName}
                      src="/static/images/avatar/default.jpg"
                    />
                  </Badge>
                )}
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, width: "100%" }}>{renderInfoSection()}</Box>
          </Box>

          <Box sx={{ width: "100%", mt: 2 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="profile tabs"
                variant="fullWidth"
                sx={{
                  bgcolor: "background.paper",
                  "& .MuiTab-root": {
                    minHeight: "64px",
                    fontWeight: 500,
                  },
                  "& .MuiTabs-indicator": {
                    background:
                      "linear-gradient(to right, #2a3b4c, #344960, #3e5871, #496883)",
                  },
                }}
              >
                <Tab
                  icon={<ShoppingBagIcon />}
                  iconPosition="start"
                  label="Sản phẩm đã đăng"
                />
                <Tab
                  icon={<StarIcon />}
                  iconPosition="start"
                  label="Đánh giá"
                />
              </Tabs>
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                {activeTab === 0 && renderProductsTab()}
                {activeTab === 1 && renderReviewsTab()}
              </Box>
            </Paper>
          </Box>
        </Paper>

        {renderSnackbar()}
      </Container>
    </ThemeProvider>
  );
};

export default UserProfile;
