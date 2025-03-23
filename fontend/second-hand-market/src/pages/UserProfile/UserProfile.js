import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
} from "@mui/icons-material";
import Swal from "sweetalert2";
import AccountContext from "../../contexts/AccountContext";
import { formatDate } from "./../../utils/function";

const UserProfile = () => {
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

  const [userProducts, setUserProducts] = useState([
    {
      id: 1,
      name: "Điện thoại iPhone 12 Pro",
      price: "10.500.000đ",
      status: "Đang bán",
      image: "https://via.placeholder.com/100",
      postedDate: "15/02/2025",
    },
    {
      id: 2,
      name: "Laptop Dell XPS 13",
      price: "15.000.000đ",
      status: "Đang bán",
      image: "https://via.placeholder.com/100",
      postedDate: "10/02/2025",
    },
    {
      id: 3,
      name: "Máy ảnh Canon EOS 850D",
      price: "8.200.000đ",
      status: "Đã bán",
      image: "https://via.placeholder.com/100",
      postedDate: "05/01/2025",
    },
  ]);
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
    const { data } = await AccountContext.Authentication();
    if (data.status === "success") {
      setAccount(data?.account);
      setAccountUpdate(data?.account);
    }
  };
  useEffect(() => {
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
      await AccountContext.updateAccountInfo(accountUpdate);
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

  const renderInfoSection = () => {
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
                value={accountUpdate.fullName}
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
                value={accountUpdate.phoneNumber}
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
                value={accountUpdate.email}
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
                value={accountUpdate.address.province}
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
                value={accountUpdate.address.district}
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
                value={accountUpdate.address.ward}
                onChange={(e) =>
                  setAccountUpdate({
                    ...accountUpdate,
                    address: { ...accountUpdate.address, ward: e.target.value },
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
                value={accountUpdate.address.specificAddress}
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
        <Box component="form" xs={{ mt: 0 }}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <Box component="form" sx={{ mt: 1 }}>
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  p: 2,
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
          }}
        >
          <Typography variant="h5" component="h2">
            {account.fullName}
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => setEditing(true)}
              sx={{ mx: 2 }}
            >
              Chỉnh sửa
            </Button>
            <Button
              startIcon={<LockIcon />}
              variant="outlined"
              onClick={() => setOpenChangePassword(true)}
            >
              Đổi mật khẩu
            </Button>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EmailIcon color="danger" sx={{ mr: 1 }} />
                <Typography variant="body1">{account.email}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PhoneIcon color="danger" sx={{ mr: 1 }} />
                <Typography variant="body1">{account.phoneNumber}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationIcon color="danger" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {[
                    account.address?.specificAddress,
                    account.address?.ward,
                    account.address?.district,
                    account.address?.province,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WatchIcon color="danger" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  Tham gia từ: {formatDate(account?.createdAt)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  const renderProductsTab = () => {
    return (
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {userProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <Box sx={{ position: "relative" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor:
                        product.status === "Đã bán"
                          ? "error.main"
                          : "success.main",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption">{product.status}</Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{ fontWeight: "bold" }}
                  >
                    {product.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đăng ngày: {product.postedDate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderSnackbar = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
    >
      <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  const renderReviewsTab = () => {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Đánh giá ({reviews.length})
        </Typography>
        <List>
          {reviews.map((review) => (
            <React.Fragment key={review.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={review.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography variant="subtitle1" sx={{ mr: 1 }}>
                        {review.name}
                      </Typography>
                      <Rating value={review.rating} size="small" readOnly />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {review.date}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }} elevation={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mr: { md: 4 },
            }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar sx={{ width: 150, height: 150 }} alt={account.fullName} />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }}>{renderInfoSection()}</Box>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="profile tabs"
            >
              <Tab
                icon={<ShoppingBagIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Sản phẩm"
              />
              <Tab
                icon={<StarIcon sx={{ mr: 1 }} />}
                iconPosition="start"
                label="Đánh giá"
              />
            </Tabs>
          </Box>
          <Box sx={{ py: 2 }}>
            {activeTab === 0 && renderProductsTab()}
            {activeTab === 1 && renderReviewsTab()}
          </Box>
        </Box>
      </Paper>

      {renderSnackbar()}
    </Container>
  );
};

export default UserProfile;
