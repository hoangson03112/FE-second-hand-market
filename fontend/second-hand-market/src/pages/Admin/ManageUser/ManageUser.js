import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CssBaseline,
  Divider,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  TablePagination,
  Chip,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  InputAdornment,
  Avatar,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Home,
  LocationCity,
  Phone,
  Email,
  AccountCircle,
  Person,
} from "@mui/icons-material";
import AccountContext from "../../../contexts/AccountContext";
import { formatDate } from "../../../utils/function";
import {
  Close as CloseIcon,
  DeleteForever as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

export default function UserManagement() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

  const getUserList = async () => {
    try {
      const res = await AccountContext.getAccounts();
      setUsers(res.accounts);
      setFilteredUsers(res.accounts);
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    let result = [...users];

    // Search functionality
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          (user.fullName &&
            user.fullName.toLowerCase().includes(lowerCaseQuery)) ||
          (user.email && user.email.toLowerCase().includes(lowerCaseQuery)) ||
          (user.phoneNumber && user.phoneNumber.includes(searchQuery))
      );
    }

    // Filter functionality
    if (activeFilters.length > 0) {
      // Separate filters by category
      const statusFilters = ["active", "inactive", "pending"].filter((status) =>
        activeFilters.includes(status)
      );

      const roleFilters = ["admin", "user", "seller"].filter((role) =>
        activeFilters.includes(role)
      );

      // If we have status filters, only include users with matching status
      if (statusFilters.length > 0) {
        result = result.filter((user) => statusFilters.includes(user.status));
      }

      // If we have role filters, only include users with matching role
      if (roleFilters.length > 0) {
        result = result.filter((user) => roleFilters.includes(user.role));
      }
    }

    setFilteredUsers(result);
  }, [users, searchQuery, activeFilters]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterSelect = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
    setPage(0);
    handleFilterMenuClose();
  };

  const handleAddUser = () => {
    setCurrentUser({
      fullName: "",
      email: "",
      phoneNumber: "",
      status: "pending",
      role: "user",
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser({ ...user });
    setDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setCurrentUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setCurrentUser(null);
  };

  const handleUserSave = async () => {
    if (currentUser._id) {
      const data = await AccountContext.updateAccountByAdmin(
        currentUser._id,
        currentUser.role,
        currentUser.status
      );


      if (data.account) {
        getUserList();
        setDialogOpen(false);
        setCurrentUser(null);
        setSnackbar({
          open: true,
          message: "Người dùng đã được cập nhật",
          severity: "success",
        });
      }
    } else {
      try {
        const data = await AccountContext.createAccountByAdmin(currentUser);
        if (data.status === "success") {
          getUserList();
          setSnackbar({
            open: true,
            message: "Người dùng đã được thêm",
            severity: "success",
          });
          setDialogOpen(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error saving user:", error);
        setSnackbar({
          open: true,
          message: "Đã xảy ra lỗi, vui lòng thử lại sau.",
          severity: "error",
        });
      }
    }
  };

  const handleUserDelete = () => {
    const updatedUsers = users.filter((user) => user._id !== currentUser._id);
    setUsers(updatedUsers);
    setSnackbar({
      open: true,
      message: "Người dùng đã được xóa",
      severity: "success",
    });
    setDeleteDialogOpen(false);
    setCurrentUser(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };
  const handleInputChangeAddress = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prevUser) => ({
      ...prevUser,
      address: {
        ...prevUser.address,
        [name]: value,
      },
    }));
  };
  const statusChipColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      default:
        return status;
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "user":
        return "Người dùng";
      case "seller":
        return "Người bán";
      default:
        return role;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Quản lý người dùng
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          sx={{ bgcolor: "primary.main", color: "white" }}
        >
          Thêm người dùng
        </Button>
      </Box>

      <Paper sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="medium"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterMenuOpen}
              sx={{ height: "56px" }}
            >
              Lọc {activeFilters.length > 0 && `(${activeFilters.length})`}
            </Button>
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={handleFilterMenuClose}
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                Trạng thái
              </Typography>
              <MenuItem onClick={() => handleFilterSelect("active")}>
                {activeFilters.includes("active") ? "✓ " : ""}Đang hoạt động
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("inactive")}>
                {activeFilters.includes("inactive") ? "✓ " : ""}Không hoạt động
              </MenuItem>

              <Divider />
              <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                Vai trò
              </Typography>
              <MenuItem onClick={() => handleFilterSelect("admin")}>
                {activeFilters.includes("admin") ? "✓ " : ""}Quản trị viên
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("user")}>
                {activeFilters.includes("user") ? "✓ " : ""}Người dùng
              </MenuItem>
              <MenuItem onClick={() => handleFilterSelect("seller")}>
                {activeFilters.includes("seller") ? "✓ " : ""}Người bán
              </MenuItem>

              {activeFilters.length > 0 && (
                <>
                  <Divider />
                  <MenuItem onClick={() => setActiveFilters([])}>
                    <Typography color="error">Xóa tất cả bộ lọc</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Grid>
        </Grid>

        {activeFilters.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter}
                label={
                  filter === "active"
                    ? "Hoạt động"
                    : filter === "inactive"
                    ? "Không hoạt động"
                    : filter === "admin"
                    ? "Quản trị viên"
                    : filter === "user"
                    ? "Người dùng"
                    : filter
                }
                onDelete={() => handleFilterSelect(filter)}
                color="primary"
                variant="outlined"
                size="medium"
              />
            ))}
            <Chip
              label="Xóa tất cả bộ lọc"
              onClick={() => setActiveFilters([])}
              color="default"
              size="medium"
            />
          </Box>
        )}
      </Paper>

      {/* User List Section */}
      <Grid container spacing={2}>
        {filteredUsers.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Không tìm thấy người dùng nào
              </Typography>
              {searchQuery && (
                <Button
                  variant="text"
                  onClick={() => setSearchQuery("")}
                  sx={{ mt: 1 }}
                >
                  Xóa tìm kiếm
                </Button>
              )}
            </Paper>
          </Grid>
        ) : (
          filteredUsers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {user?.fullName?.split(" ").pop().charAt(0) || "U"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{user.fullName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">
                    <strong>Số điện thoại:</strong> {user.phoneNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Trạng thái:</strong>{" "}
                    <Chip
                      label={getStatusText(user.status)}
                      color={statusChipColor(user.status)}
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Vai trò:</strong> {getRoleText(user.role)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Ngày tham gia:</strong>{" "}
                    {formatDate(user?.createdAt)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Sửa lần cuối:</strong>
                    {user?.updatedAt
                      ? new Date(user.updatedAt).toLocaleString("vi-VN")
                      : ""}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditUser(user)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteUser(user)}
                    >
                      Xóa
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 0 }}>
        <TablePagination
          rowsPerPageOptions={[6, 12]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số lượng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </Box>

      {/* Dialog Add/Edit User */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle variant="h5">
          {currentUser && currentUser._id
            ? "Sửa thông tin người dùng"
            : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent>
          {currentUser && currentUser._id ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Trạng thái"
                  name="status"
                  value={currentUser ? currentUser.status : "pending"}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Vai trò"
                  name="role"
                  value={currentUser ? currentUser.role : "user"}
                  onChange={handleInputChange}
                >
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="user">Người dùng</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {currentUser && currentUser._id ? (
                ""
              ) : (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Personal Information Section */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="#000000"
                        gutterBottom
                      >
                        Thông tin cơ bản
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Họ tên"
                        name="fullName"
                        value={currentUser?.fullName || ""}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="#000000" />
                            </InputAdornment>
                          ),
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Tên đăng nhập"
                        name="username"
                        value={currentUser?.username || ""}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle color="#000000" />
                            </InputAdornment>
                          ),
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={currentUser?.email || ""}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="#000000" />
                            </InputAdornment>
                          ),
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="phoneNumber"
                        value={currentUser?.phoneNumber || ""}
                        onChange={handleInputChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone color="#000000" />
                            </InputAdornment>
                          ),
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Trạng thái"
                        name="status"
                        value={currentUser ? currentUser.status : "pending"}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="active">Hoạt động</MenuItem>
                        <MenuItem value="inactive">Không hoạt động</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Vai trò"
                        name="role"
                        value={currentUser ? currentUser.role : "user"}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="admin">Quản trị viên</MenuItem>
                        <MenuItem value="user">Người dùng</MenuItem>
                      </TextField>
                    </Grid>
                    {/* Address Section */}
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle1"
                        color="#000000"
                        gutterBottom
                      >
                        Thông tin địa chỉ
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Tỉnh/Thành phố"
                        name="province"
                        value={currentUser?.address?.province || ""}
                        onChange={handleInputChangeAddress}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationCity color="#000000" />
                            </InputAdornment>
                          ),
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Quận/Huyện"
                        name="district"
                        value={currentUser?.address?.district || ""}
                        onChange={handleInputChangeAddress}
                        required
                        variant="outlined"
                        InputProps={{
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Phường/Xã"
                        name="ward"
                        value={currentUser?.address?.ward || ""}
                        onChange={handleInputChangeAddress}
                        required
                        variant="outlined"
                        InputProps={{
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Địa chỉ cụ thể"
                        name="specificAddress"
                        variant="outlined"
                        multiline
                        rows={1}
                        value={currentUser?.address?.specificAddress || ""}
                        onChange={handleInputChangeAddress}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Home color="#000000" />
                            </InputAdornment>
                          ),
                          sx: { color: "#000000" },
                        }}
                        InputLabelProps={{ sx: { color: "#000000" } }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hủy</Button>
          <Button onClick={handleUserSave} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Delete Confirmation */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f5f5f5",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              component="span"
              sx={{ color: "#000000", fontWeight: 600 }}
            >
              Xác nhận xóa
            </Typography>
          </Box>
          <IconButton
            onClick={handleDeleteDialogClose}
            size="small"
            aria-label="close"
            sx={{ color: "#000000" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "#ffebee",
                color: "#f44336",
                width: 70,
                height: 70,
                mb: 2,
              }}
            >
              <DeleteIcon fontSize="large" />
            </Avatar>

            <Typography
              sx={{
                color: "#000000",
                textAlign: "center",
                fontWeight: 500,
                mb: 1,
              }}
            >
              Bạn có chắc chắn muốn xóa người dùng này?
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#000000",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "1.1rem",
                mb: 1,
              }}
            >
              "{currentUser?.fullName || "Không xác định"}"
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#666666",
                textAlign: "center",
              }}
            >
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến
              người dùng này sẽ bị xóa vĩnh viễn.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleDeleteDialogClose}
            variant="outlined"
            sx={{
              minWidth: 100,
              color: "#000000",
              borderColor: "#cccccc",
              "&:hover": {
                borderColor: "#999999",
                bgcolor: "#f5f5f5",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUserDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{
              minWidth: 100,
              fontWeight: 500,
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
