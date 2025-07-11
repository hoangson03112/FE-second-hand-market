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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Tooltip,
  Fade,
  Slide,
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
  Add as AddIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import Swal from "sweetalert2";
import AccountContext from "../../contexts/AccountContext";
import { formatDate } from "./../../utils/function";
import { useProduct } from "../../contexts/ProductContext";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import { useNotification } from "../../hooks/useNotification";


const theme = createTheme({
  palette: {
    primary: {
      main: "#2D1B69", // Deep purple
      light: "#4A3B8C",
      dark: "#1A0F3D",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#D4AF37", // Gold
      light: "#E6C866",
      dark: "#B8941F",
      contrastText: "#1A0F3D",
    },
    success: {
      main: "#2E7D32",
      light: "#4CAF50",
      dark: "#1B5E20",
    },
    warning: {
      main: "#FF8F00",
      light: "#FFB74D",
      dark: "#E65100",
    },
    error: {
      main: "#C62828",
      light: "#EF5350",
      dark: "#B71C1C",
    },
    background: {
      default: "#F8F6FF", // Very light purple
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A0F3D", // Dark purple
      secondary: "#6B5B95", // Medium purple
    },
    info: {
      main: "#6B5B95",
      light: "#9C89B8",
      dark: "#4A3B8C",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    // ... other shadow levels
  ],
});

const UserProfile = () => {
  const { getProductsByUser } = useProduct();
  const { updateProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
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

  // Thêm state cho phân trang
  const [page, setPage] = useState(1);
  const [productsPerPage] = useState(6);

  // State cho quản lý địa chỉ
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "home",
      label: "Nhà riêng",
      fullName: "Nguyễn Văn A",
      phoneNumber: "0123456789",
      province: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
      specificAddress: "123 Đường Lê Lợi",
      isDefault: true,
    },
    {
      id: 2,
      type: "office",
      label: "Văn phòng",
      fullName: "Nguyễn Văn A",
      phoneNumber: "0987654321",
      province: "TP. Hồ Chí Minh",
      district: "Quận 3",
      ward: "Phường Võ Thị Sáu",
      specificAddress: "456 Đường Cách Mạng Tháng 8",
      isDefault: false,
    },
  ]);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "home",
    label: "",
    fullName: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    specificAddress: "",
    isDefault: false,
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
    try {
      setLoading(true);
      const user = await authService.getCurrentUser();
      setAccount(user);
      setAccountUpdate(user);
    } catch (error) {
      console.error("Error fetching user account:", error);
      showError("Không thể tải thông tin tài khoản");
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
      showError("Mật khẩu mới không khớp!");
      return;
    }

    try {
      const response = await AccountContext.changePassword({
        oldPassword,
        newPassword,
      });

      if (response.success) {
        showSuccess("Đổi mật khẩu thành công!");
        setOpenChangePassword(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      showError(error.message || "Đổi mật khẩu thất bại!");
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

  // Functions cho quản lý địa chỉ
  const handleAddAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      type: "home",
      label: "",
      fullName: "",
      phoneNumber: "",
      province: "",
      district: "",
      ward: "",
      specificAddress: "",
      isDefault: false,
    });
    setOpenAddressDialog(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setOpenAddressDialog(true);
  };

  const handleSaveAddress = () => {
    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...newAddress, id: editingAddress.id } : addr
      ));
    } else {
      setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
    }
    setOpenAddressDialog(false);
    showSuccess(editingAddress ? "Cập nhật địa chỉ thành công!" : "Thêm địa chỉ thành công!");
  };

  const handleDeleteAddress = (addressId) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    showSuccess("Xóa địa chỉ thành công!");
  };

  const handleSetDefaultAddress = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
    showSuccess("Đã đặt làm địa chỉ mặc định!");
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

  const renderPersonalInfoTab = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Thông tin cá nhân
        </Typography>
        {renderInfoSection()}
      </Box>
    );
  };

  const renderAddressTab = () => {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Quản lý địa chỉ
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAddress}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Thêm địa chỉ mới
          </Button>
        </Box>

        <Grid container spacing={3}>
          {addresses.map((address) => (
            <Grid item xs={12} md={6} key={address.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: address.isDefault ? '2px solid' : '1px solid',
                  borderColor: address.isDefault ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {address.type === 'home' ? <HomeIcon color="primary" /> : <BusinessIcon color="primary" />}
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                        {address.label}
                      </Typography>
                    </Box>
                    {address.isDefault && (
                      <Chip 
                        label="Mặc định" 
                        color="primary" 
                        size="small"
                        icon={<CheckCircleIcon />}
                        sx={{ fontWeight: 500 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {address.fullName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {address.phoneNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${address.specificAddress}, ${address.ward}, ${address.district}, ${address.province}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditAddress(address)}
                      sx={{ textTransform: 'none' }}
                    >
                      Sửa
                    </Button>
                    {!address.isDefault && (
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          color="success"
                          onClick={() => handleSetDefaultAddress(address.id)}
                          sx={{ textTransform: 'none' }}
                        >
                          Đặt mặc định
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteAddress(address.id)}
                          sx={{ textTransform: 'none' }}
                        >
                          Xóa
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog thêm/sửa địa chỉ */}
        <Dialog 
          open={openAddressDialog} 
          onClose={() => setOpenAddressDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nhãn địa chỉ"
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  placeholder="VD: Nhà riêng, Văn phòng"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({...newAddress, fullName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  value={newAddress.phoneNumber}
                  onChange={(e) => setNewAddress({...newAddress, phoneNumber: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tỉnh/Thành phố"
                  value={newAddress.province}
                  onChange={(e) => setNewAddress({...newAddress, province: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quận/Huyện"
                  value={newAddress.district}
                  onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phường/Xã"
                  value={newAddress.ward}
                  onChange={(e) => setNewAddress({...newAddress, ward: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ cụ thể"
                  value={newAddress.specificAddress}
                  onChange={(e) => setNewAddress({...newAddress, specificAddress: e.target.value})}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                    />
                  }
                  label="Đặt làm địa chỉ mặc định"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setOpenAddressDialog(false)} sx={{ textTransform: 'none' }}>
              Hủy
            </Button>
            <Button 
              onClick={handleSaveAddress} 
              variant="contained"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderSecurityTab = () => {
    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
          Bảo mật tài khoản
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Đổi mật khẩu
              </Typography>
              
              {openChangePassword ? (
                <Box>
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

                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenChangePassword(false)}
                      sx={{ textTransform: 'none' }}
                    >
                      Hủy
                    </Button>
                    <Button
                      variant="contained"
                      disabled={
                        !passwordData.oldPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                      onClick={handleChangePassword}
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                      Đổi mật khẩu
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Để bảo mật tài khoản, bạn nên thay đổi mật khẩu định kỳ
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<LockIcon />}
                    onClick={() => setOpenChangePassword(true)}
                    sx={{ textTransform: 'none', fontWeight: 500 }}
                  >
                    Đổi mật khẩu
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
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
              background: "linear-gradient(135deg, #2D1B69, #4A3B8C)",
              "&:hover": {
                background: "linear-gradient(135deg, #1A0F3D, #2D1B69)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(45,27,105,0.3)",
              },
              transition: "all 0.3s ease",
              textTransform: "none",
              fontWeight: 600,
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
                  borderTop: "3px solid #2D1B69",
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
                    background: "linear-gradient(135deg, #2D1B69, #4A3B8C)",
                    color: "white",
                    "&:hover": {
                      background: "linear-gradient(135deg, #1A0F3D, #2D1B69)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "rgba(45,27,105,0.1)",
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>
    );
  };



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
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2D1B69 0%, #4A3B8C 50%, #6B5B95 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                transform: 'translate(50px, -50px)',
              }
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "center", md: "flex-start" },
                gap: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {loading ? (
                  <Skeleton variant="circular" width={120} height={120} />
                ) : (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <Tooltip title="Thay đổi ảnh đại diện">
                        <IconButton
                          sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            width: 40,
                            height: 40,
                            "&:hover": {
                              bgcolor: 'grey.100',
                            },
                            boxShadow: 2,
                          }}
                          size="small"
                        >
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        border: "4px solid rgba(255,255,255,0.3)",
                        boxShadow: 3,
                        fontSize: '3rem',
                        fontWeight: 600,
                      }}
                      alt={account.fullName}
                      src={account.avatar || "/static/images/avatar/default.jpg"}
                    >
                      {account.fullName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </Badge>
                )}
              </Box>
              
              <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {loading ? <Skeleton width={200} /> : account.fullName || 'Người dùng'}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {loading ? <Skeleton width={150} /> : account.email || 'email@example.com'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Chip 
                    icon={<WatchIcon />} 
                    label={`Tham gia từ ${formatDate(account?.createdAt) || '2024'}`}
                    sx={{ 
                      bgcolor: 'rgba(212,175,55,0.3)', 
                      color: 'white',
                      fontWeight: 500,
                      border: '1px solid rgba(212,175,55,0.5)',
                    }} 
                  />
                  <Chip 
                    icon={<ShoppingBagIcon />} 
                    label={`${userProducts.length} sản phẩm`}
                    sx={{ 
                      bgcolor: 'rgba(212,175,55,0.3)', 
                      color: 'white',
                      fontWeight: 500,
                      border: '1px solid rgba(212,175,55,0.5)',
                    }} 
                  />
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Main Content */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: '0 8px 32px rgba(45,27,105,0.15)',
              border: '1px solid rgba(212,175,55,0.1)',
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
                  textTransform: 'none',
                },
                "& .MuiTabs-indicator": {
                  background: "linear-gradient(90deg, #2D1B69, #D4AF37)",
                  height: 3,
                },
              }}
            >
              <Tab
                icon={<AccountCircleIcon />}
                iconPosition="start"
                label="Thông tin cá nhân"
              />
              <Tab
                icon={<ShoppingBagIcon />}
                iconPosition="start"
                label="Sản phẩm"
              />
              <Tab
                icon={<LocationIcon />}
                iconPosition="start"
                label="Địa chỉ"
              />
              <Tab
                icon={<StarIcon />}
                iconPosition="start"
                label="Đánh giá"
              />
              <Tab
                icon={<SecurityIcon />}
                iconPosition="start"
                label="Bảo mật"
              />
            </Tabs>
            
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {activeTab === 0 && renderPersonalInfoTab()}
              {activeTab === 1 && renderProductsTab()}
              {activeTab === 2 && renderAddressTab()}
              {activeTab === 3 && renderReviewsTab()}
              {activeTab === 4 && renderSecurityTab()}
            </Box>
          </Paper>

        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserProfile;
