import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
  TablePagination,
  Fade,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  AccountBalance as BankIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Done as DoneIcon,
  Block as BlockIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import sellerService from "../../../services/sellerService";
import { useNotification } from "../../../hooks/useNotification";
import DialogDetails from "./components/DialogDetails";
import DialogConfirm from "./components/DialogConfirm";

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 12,
    total: 0,
  });
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const { showNotification } = useNotification();
  const statusFilters = ["", "pending", "approved", "rejected"];

  useEffect(() => {
    fetchSellers();
  }, [pagination.page, pagination.rowsPerPage, currentTab, searchQuery]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const status = statusFilters[currentTab];
      const response = await sellerService.getAllSellers({
        page: pagination.page + 1,
        limit: pagination.rowsPerPage,
        search: searchQuery,
        status: status,
      });

      setSellers(response.data);
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.totalItems,
      }));
      setStatistics(response.statistics);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      showNotification("Lỗi khi tải danh sách seller", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setPagination({
      page: 0,
      rowsPerPage: newRowsPerPage,
      total: pagination.total,
    });
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setDetailsDialogOpen(true);
  };

  const handleApproveSeller = async () => {
    try {
      await sellerService.updateSellerStatus(selectedSeller._id, "approved");
      showNotification("Đã duyệt seller thành công", "success");
      setConfirmDialogOpen(false);
      setDetailsDialogOpen(false);
      fetchSellers();
    } catch (error) {
      console.error("Error approving seller:", error);
      showNotification("Lỗi khi duyệt seller", "error");
    }
  };

  const handleRejectSeller = async () => {
    if (!rejectionReason.trim()) {
      showNotification("Vui lòng nhập lý do từ chối", "warning");
      return;
    }

    try {
      await sellerService.updateSellerStatus(
        selectedSeller._id,
        "rejected",
        rejectionReason
      );
      showNotification("Đã từ chối seller", "success");
      setConfirmDialogOpen(false);
      setDetailsDialogOpen(false);
      setRejectionReason("");
      fetchSellers();
    } catch (error) {
      console.error("Error rejecting seller:", error);
      showNotification("Lỗi khi từ chối seller", "error");
    }
  };

  const openConfirmDialog = (type) => {
    setActionType(type);
    setConfirmDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#27AE60";
      case "pending":
        return "#E67E22";
      case "rejected":
        return "#E74C3C";
      default:
        return "#6c757d";
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: "Chờ duyệt", color: "warning", icon: <ScheduleIcon /> },
      approved: { label: "Đã duyệt", color: "success", icon: <CheckIcon /> },
      rejected: { label: "Đã từ chối", color: "error", icon: <CancelIcon /> },
    };

    const config = statusConfig[status] || {
      label: "Không xác định",
      color: "default",
      icon: null,
    };

    return (
      <Chip
        label={config.label}
        color={config.color}
        variant="filled"
        size="small"
        icon={config.icon}
        sx={{ fontWeight: 600 }}
      />
    );
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Clean Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2a3b4c 0%, #3e5871 100%)",
          py: { xs: 6, sm: 8, md: 10 },
          px: { xs: 2, sm: 3, md: 4 },
          color: "white",
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: { xs: 60, sm: 80, md: 100 },
              height: { xs: 60, sm: 80, md: 100 },
              borderRadius: "20px",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            🏪
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Quản lý Seller
          </Typography>
          <Typography
            variant="h6"
            sx={{
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
            }}
          >
            Hệ thống quản lý và duyệt seller chuyên nghiệp
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          mt: { xs: -4, sm: -5, md: -6 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Statistics Cards */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
          {[
            {
              label: "Tổng số",
              value: statistics.total,
              icon: <PeopleIcon />,
              color: "#2a3b4c",
            },
            {
              label: "Chờ duyệt",
              value: statistics.pending,
              icon: <ScheduleIcon />,
              color: "#E67E22",
            },
            {
              label: "Đã duyệt",
              value: statistics.approved,
              icon: <DoneIcon />,
              color: "#27AE60",
            },
            {
              label: "Đã từ chối",
              value: statistics.rejected,
              icon: <BlockIcon />,
              color: "#E74C3C",
            },
          ].map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Card
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Box
                    sx={{
                      width: { xs: 40, sm: 50 },
                      height: { xs: 40, sm: 50 },
                      borderRadius: "12px",
                      backgroundColor: `${stat.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {React.cloneElement(stat.icon, {
                      sx: {
                        color: stat.color,
                        fontSize: { xs: 20, sm: 24 },
                      },
                    })}
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: stat.color,
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6c757d",
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Search Section */}
        <Card
          sx={{
            mb: 3,
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <SearchIcon sx={{ color: "#2a3b4c", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#2a3b4c",
                }}
              >
                Tìm kiếm seller
              </Typography>
            </Box>
            <TextField
              fullWidth
              placeholder="Nhập tên, email hoặc số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  backgroundColor: "#f8f9fa",
                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2a3b4c",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2a3b4c",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#6c757d" }} />
                  </InputAdornment>
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <Card
          sx={{
            mb: 4,
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <FilterListIcon sx={{ color: "#2a3b4c", mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#2a3b4c",
                }}
              >
                Lọc theo trạng thái
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {[
                {
                  label: "Tất cả",
                  value: statistics.total,
                  color: "#2a3b4c",
                  icon: <PeopleIcon />,
                },
                {
                  label: "Chờ duyệt",
                  value: statistics.pending,
                  color: "#E67E22",
                  icon: <ScheduleIcon />,
                },
                {
                  label: "Đã duyệt",
                  value: statistics.approved,
                  color: "#27AE60",
                  icon: <DoneIcon />,
                },
                {
                  label: "Đã từ chối",
                  value: statistics.rejected,
                  color: "#E74C3C",
                  icon: <BlockIcon />,
                },
              ].map((tab, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Button
                    fullWidth
                    variant={currentTab === index ? "contained" : "outlined"}
                    onClick={() => handleTabChange(null, index)}
                    sx={{
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 600,
                      backgroundColor:
                        currentTab === index ? tab.color : "transparent",
                      borderColor: tab.color,
                      color: currentTab === index ? "white" : tab.color,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          currentTab === index ? tab.color : `${tab.color}10`,
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {React.cloneElement(tab.icon, {
                        sx: { fontSize: { xs: 16, sm: 18 } },
                      })}
                      <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1rem", sm: "1.1rem" },
                          }}
                        >
                          {tab.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.8,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          {tab.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Sellers Grid */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                border: "3px solid #f3f3f3",
                borderTopColor: "#2a3b4c",
                animation: "spin 1s linear infinite",
                mx: "auto",
                mb: 3,
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
            <Typography variant="h6" sx={{ color: "#6c757d" }}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "#2a3b4c",
              }}
            >
              Danh sách Seller ({pagination.total})
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
              {sellers.map((seller, index) => (
                <Grid item xs={12} sm={6} lg={4} key={seller._id}>
                  <Card
                    sx={{
                      borderRadius: "16px",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {/* Status indicator */}
                    <Box
                      sx={{
                        height: "4px",
                        backgroundColor: getStatusColor(
                          seller.verificationStatus
                        ),
                      }}
                    />

                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Avatar
                          src={seller.accountId?.avatar?.url}
                          sx={{
                            width: { xs: 50, sm: 60 },
                            height: { xs: 50, sm: 60 },
                            mr: 2,
                            backgroundColor: "#2a3b4c",
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              color: "#2a3b4c",
                              fontSize: { xs: "1rem", sm: "1.1rem" },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {seller.accountId?.fullName || "Chưa cập nhật"}
                          </Typography>
                          {getStatusChip(seller.verificationStatus)}
                        </Box>
                      </Box>

                      <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <EmailIcon
                            sx={{
                              color: "#6c757d",
                              mr: 1.5,
                              fontSize: { xs: 18, sm: 20 },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#495057",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}
                          >
                            {seller.accountId?.email || "Chưa cập nhật"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PhoneIcon
                            sx={{
                              color: "#6c757d",
                              mr: 1.5,
                              fontSize: { xs: 18, sm: 20 },
                            }}
                          />
                          <Typography variant="body2" sx={{ color: "#495057" }}>
                            {seller.phoneNumber || "Chưa cập nhật"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BusinessIcon
                            sx={{
                              color: "#6c757d",
                              mr: 1.5,
                              fontSize: { xs: 18, sm: 20 },
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#495057",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}
                          >
                            {seller.shopName || "Chưa cập nhật"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: { xs: "column", sm: "row" },
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(seller)}
                          sx={{
                            flex: 1,
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 500,
                            borderColor: "#2a3b4c",
                            color: "#2a3b4c",
                            "&:hover": {
                              borderColor: "#2a3b4c",
                              backgroundColor: "rgba(42, 59, 76, 0.04)",
                            },
                          }}
                        >
                          Chi tiết
                        </Button>
                        {seller.verificationStatus === "pending" && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                setSelectedSeller(seller);
                                openConfirmDialog("approve");
                              }}
                              sx={{
                                minWidth: 40,
                                borderRadius: "8px",
                                backgroundColor: "green",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "#27AE60",
                                },
                              }}
                            >
                              <CheckIcon sx={{ fontSize: 18 }} />
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                setSelectedSeller(seller);
                                openConfirmDialog("reject");
                              }}
                              sx={{
                                minWidth: 40,
                                borderRadius: "8px",
                                backgroundColor: "red",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "red",
                                },
                              }}
                            >
                              <CancelIcon sx={{ fontSize: 18 }} />
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {sellers.length === 0 && (
              <Card
                sx={{
                  p: { xs: 4, sm: 6, md: 8 },
                  textAlign: "center",
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#6c757d",
                    mb: 2,
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
                >
                  🔍 Không tìm thấy seller nào
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#6c757d",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </Typography>
              </Card>
            )}

            {sellers.length > 0 && (
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <TablePagination
                  component="div"
                  count={pagination.total}
                  page={pagination.page}
                  onPageChange={handlePageChange}
                  rowsPerPage={pagination.rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  labelRowsPerPage="Số dòng mỗi trang:"
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 2,
                    "& .MuiTablePagination-toolbar": {
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: 2, sm: 0 },
                    },
                  }}
                />
              </Card>
            )}
          </>
        )}

        {/* Detailed Dialog */}
        <DialogDetails
          detailsDialogOpen={detailsDialogOpen}
          setDetailsDialogOpen={setDetailsDialogOpen}
          selectedSeller={selectedSeller}
          openConfirmDialog={openConfirmDialog}
          getStatusChip={getStatusChip}
        />

        {/* Confirmation Dialog */}
        <DialogConfirm
          confirmDialogOpen={confirmDialogOpen}
          setConfirmDialogOpen={setConfirmDialogOpen}
          actionType={actionType}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          handleApproveSeller={handleApproveSeller}
          handleRejectSeller={handleRejectSeller}
        />
      </Box>
    </Box>
  );
}
