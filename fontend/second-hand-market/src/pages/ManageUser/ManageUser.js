/* eslint-disable no-unused-vars */
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
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import AccountContext from "../../contexts/AccountContext";
import { formatDate } from "../../utils/function";

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
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
    console.log(searchQuery);

    if (searchQuery) {
      const lowerCaseQuery = searchQuery;
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery) ||
          user.phone.includes(searchQuery)
      );
    }

    if (activeFilters.length > 0) {
      result = result.filter(
        (user) =>
          activeFilters.includes(user.status) ||
          activeFilters.includes(user.role)
      );
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
      name: "",
      email: "",
      phone: "",
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

  const handleUserSave = () => {
    if (currentUser._id) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === currentUser._id ? currentUser : user
      );
      setUsers(updatedUsers);
      setSnackbar({
        open: true,
        message: "Người dùng đã được cập nhật",
        severity: "success",
      });
    } else {
      // Add new user
      const newUser = {
        ...currentUser,
        id: users.length + 1,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setUsers([...users, newUser]);
      setSnackbar({
        open: true,
        message: "Người dùng đã được thêm",
        severity: "success",
      });
    }
    setDialogOpen(false);
    setCurrentUser(null);
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

  // Map status and role to their display text
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "pending":
        return "Chờ xác nhận";
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

      {/* Header Section */}
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

      {/* Search and Filter Section */}
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
              <MenuItem onClick={() => handleFilterSelect("pending")}>
                {activeFilters.includes("pending") ? "✓ " : ""}Chờ xác nhận
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
                    : filter === "pending"
                    ? "Chờ xác nhận"
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
              <Grid item xs={12} sm={6} md={4} key={user.id}>
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
                      {user?.fullName?.split(" ").pop().charAt(0)}
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      </Box>

      {/* Dialogs and Snackbar */}
      {/* Dialog Add/Edit User */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {currentUser && currentUser._id
            ? "Sửa thông tin người dùng"
            : "Thêm người dùng mới"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {currentUser && currentUser._id ? (
              ""
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ tên"
                    name="name"
                    value={currentUser ? currentUser.fullName : ""}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={currentUser ? currentUser.email : ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={currentUser ? currentUser.phoneNumber : ""}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </>
            )}

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
                <MenuItem value="seller">Người bán</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Hủy</Button>
          <Button onClick={handleUserSave} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng "{currentUser?.name}" không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Hủy</Button>
          <Button onClick={handleUserDelete} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
