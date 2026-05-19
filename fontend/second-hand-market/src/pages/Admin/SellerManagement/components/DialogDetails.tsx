import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  Avatar,
  Button,
  Chip,
  Paper,
  Zoom,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccountBalance as BankIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  CreditCard as CardIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  ZoomIn as ZoomInIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

const IDCardImage = ({ src, alt, title }) => {
  const [imageDialog, setImageDialog] = useState(false);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: (theme) => theme.shadows[8],
          },
        }}
        onClick={() => setImageDialog(true)}
      >
        <Box sx={{ position: "relative" }}>
          <img
            src={src}
            alt={alt}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
            sx={{
              maxHeight: { xs: "250px", sm: "300px", md: "350px", lg: "400px" },
              borderRadius: "8px",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              p: 0.5,
              color: "white",
            }}
          >
            <ZoomInIcon fontSize="small" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
              color: "white",
              p: 1.5,
              textAlign: "center",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {title}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Dialog hiển thị ảnh lớn */}
      <Dialog
        open={imageDialog}
        onClose={() => setImageDialog(false)}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Zoom}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            p: { xs: 1, sm: 2 },
          }}
        >
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "100%",
              maxHeight: "85vh",
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              objectFit: "contain",
            }}
          />
          <IconButton
            onClick={() => setImageDialog(false)}
            sx={{
              position: "absolute",
              top: -20,
              right: -20,
              backgroundColor: "white",
              color: "black",
              "&:hover": { backgroundColor: "#f5f5f5" },
              boxShadow: 3,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Dialog>
    </>
  );
};

export default function DialogDetails({
  detailsDialogOpen,
  setDetailsDialogOpen,
  selectedSeller,
  openConfirmDialog,
}) {
  const theme = useTheme();

  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: <VerifiedIcon />,
          color: "success",
          label: "Đã duyệt",
          bgColor: alpha(theme.palette.success.main, 0.1),
        };
      case "pending":
        return {
          icon: <PendingIcon />,
          color: "warning",
          label: "Chờ duyệt",
          bgColor: alpha(theme.palette.warning.main, 0.1),
        };
      case "rejected":
        return {
          icon: <ErrorIcon />,
          color: "error",
          label: "Từ chối",
          bgColor: alpha(theme.palette.error.main, 0.1),
        };
      case "banned":
        return {
          icon: <BlockIcon />,
          color: "error",
          label: "Bị Ban",
          bgColor: alpha(theme.palette.error.main, 0.1),
        };
      default:
        return {
          icon: <PendingIcon />,
          color: "default",
          label: "Không xác định",
          bgColor: alpha(theme.palette.grey[500], 0.1),
        };
    }
  };

  const statusConfig = getStatusConfig(selectedSeller?.verificationStatus);

  return (
    <Dialog
      open={detailsDialogOpen}
      onClose={() => setDetailsDialogOpen(false)}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "20px",
          mx: { xs: 1, sm: 2 },
          my: { xs: 1, sm: 2 },
          maxHeight: "95vh",
          background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)",
        },
      }}
    >
      {/* Header đơn giản */}
      <DialogTitle
        sx={{
          backgroundColor: "#f5f5f5",
          color: "#424242",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: { xs: 2.5, sm: 3 },
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor: "#e0e0e0",
              color: "#757575",
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.2rem", sm: "1.3rem" },
                color: "#424242",
              }}
            >
              Thông tin Seller
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#757575",
                fontSize: { xs: "0.8rem", sm: "0.85rem" },
              }}
            >
              Chi tiết đầy đủ và xác thực
            </Typography>
          </Box>
          {/* Trạng thái xác thực */}
          <Box sx={{ textAlign: "center", pt: 1 }}>
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              variant="outlined"
              sx={{
                fontSize: "0.9rem",
                fontWeight: 500,
                px: 2,
                py: 0.5,
                "& .MuiChip-icon": {
                  fontSize: 18,
                },
              }}
            />
          </Box>
        </Box>
        <IconButton
          onClick={() => setDetailsDialogOpen(false)}
          sx={{
            color: "#757575",
            "&:hover": {
              backgroundColor: "#eeeeee",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
        {selectedSeller && (
          <Grid container spacing={{ xs: 3, sm: 4 }}>
            {/* Thông tin cá nhân */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    fontWeight: 600,
                    color: "#424242",
                  }}
                >
                  <PersonIcon sx={{ mr: 2, color: "#757575", fontSize: 24 }} />
                  Thông tin cá nhân
                </Typography>

                <Stack spacing={3}>
                  {/* Avatar và tên */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={selectedSeller.accountId?.avatar?.url}
                      sx={{
                        width: { xs: 70, sm: 80 },
                        height: { xs: 70, sm: 80 },
                        mr: 3,
                        backgroundColor: "#e0e0e0",
                        border: "2px solid #f5f5f5",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40, color: "#757575" }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "1.1rem", sm: "1.2rem" },
                          color: "#424242",
                          mb: 0.5,
                        }}
                      >
                        {selectedSeller.accountId?.fullName || "Chưa cập nhật"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#757575",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        {selectedSeller.accountId?.email || "Chưa cập nhật"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Thông tin liên lạc */}
                  <Box
                    sx={{
                      backgroundColor: "#f8f8f8",
                      borderRadius: 2,
                      p: 2.5,
                      border: "1px solid #eeeeee",
                    }}
                  >
                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PhoneIcon
                          sx={{ color: "#757575", mr: 2, fontSize: 20 }}
                        />
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 500, color: "#424242" }}
                        >
                          {selectedSeller.accountId?.phoneNumber ||
                            "Chưa cập nhật"}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <LocationIcon
                          sx={{
                            color: "#757575",
                            mr: 2,
                            fontSize: 20,
                            mt: 0.2,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            lineHeight: 1.6,
                            color: "#424242",
                          }}
                        >
                          {selectedSeller.businessAddress +
                            ", " +
                            selectedSeller.district +
                            ", " +
                            selectedSeller.ward +
                            ", " +
                            selectedSeller.province || "Chưa cập nhật"}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* Thông tin ngân hàng */}
            <Grid item xs={12} lg={6}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    fontWeight: 600,
                    color: "#424242",
                  }}
                >
                  <BankIcon sx={{ mr: 2, color: "#757575", fontSize: 24 }} />
                  Thông tin ngân hàng
                </Typography>

                <Stack spacing={3}>
                  <Box
                    sx={{
                      backgroundColor: "#f8f8f8",
                      borderRadius: 2,
                      p: 2.5,
                      border: "1px solid #eeeeee",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <BankIcon sx={{ color: "#757575", mr: 2 }} />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#757575", display: "block" }}
                            >
                              Ngân hàng
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: "#424242" }}
                            >
                              {selectedSeller.bankInfo?.bankName ||
                                "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <CardIcon sx={{ color: "#757575", mr: 2 }} />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#757575", display: "block" }}
                            >
                              Số tài khoản
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: "#424242",
                                fontFamily: "monospace",
                              }}
                            >
                              {selectedSeller.bankInfo?.accountNumber ||
                                "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon sx={{ color: "#757575", mr: 2 }} />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{ color: "#757575", display: "block" }}
                            >
                              Chủ tài khoản
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: "#424242" }}
                            >
                              {selectedSeller.bankInfo?.accountHolder ||
                                "Chưa cập nhật"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            {/* Debug info */}
            {process.env.NODE_ENV === "development" &&
              selectedSeller.idCardImages && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      mb: 2,
                      p: 2,
                      backgroundColor: "#f0f0f0",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" component="pre">
                      {JSON.stringify(selectedSeller.idCardImages, null, 2)}
                    </Typography>
                  </Box>
                </Grid>
              )}

            {/* CCCD Mặt trước */}
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    fontWeight: 600,
                    color: "#424242",
                  }}
                >
                  <CardIcon sx={{ mr: 2, color: "#757575", fontSize: 24 }} />
                  CCCD - Mặt trước
                </Typography>

                {selectedSeller.idCardFront &&
                selectedSeller.idCardFront.url ? (
                  <IDCardImage
                    src={selectedSeller.idCardFront.url}
                    alt="CCCD mặt trước"
                    title="Mặt trước"
                  />
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: { xs: 3, sm: 4 },
                      backgroundColor: "#fff3e0",
                      borderRadius: 2,
                      border: "2px dashed #ffb74d",
                      minHeight: { xs: 200, sm: 230, md: 250, lg: 280 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardIcon
                      sx={{
                        fontSize: { xs: 36, sm: 42, md: 48 },
                        color: "#ffb74d",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#f57600",
                        fontWeight: 500,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      ⚠️ Chưa có ảnh mặt trước
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>

            {/* CCCD Mặt sau */}
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    fontWeight: 600,
                    color: "#424242",
                  }}
                >
                  <CardIcon sx={{ mr: 2, color: "#757575", fontSize: 24 }} />
                  CCCD - Mặt sau
                </Typography>

                {selectedSeller.idCardBack && selectedSeller.idCardBack.url ? (
                  <IDCardImage
                    src={selectedSeller.idCardBack.url}
                    alt="CCCD mặt sau"
                    title="Mặt sau"
                  />
                ) : (
                  <Box
                    sx={{
                      textAlign: "center",
                      p: { xs: 3, sm: 4 },
                      backgroundColor: "#fff3e0",
                      borderRadius: 2,
                      border: "2px dashed #ffb74d",
                      minHeight: { xs: 200, sm: 230, md: 250, lg: 280 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CardIcon
                      sx={{
                        fontSize: { xs: 36, sm: 42, md: 48 },
                        color: "#ffb74d",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#f57600",
                        fontWeight: 500,
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      ⚠️ Chưa có ảnh mặt sau
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>

      {/* Actions cho trạng thái pending */}
      {selectedSeller?.verificationStatus === "pending" && (
        <DialogActions
          sx={{
            p: { xs: 3, sm: 4 },
            backgroundColor: alpha(theme.palette.grey[50], 0.8),
            backdropFilter: "blur(10px)",
            borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={() => setDetailsDialogOpen(false)}
            variant="outlined"
            size="large"
            sx={{
              borderRadius: "12px",
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderColor: alpha(theme.palette.grey[400], 0.5),
              color: "#4a5568",
              "&:hover": {
                borderColor: theme.palette.grey[400],
                backgroundColor: alpha(theme.palette.grey[100], 0.5),
              },
            }}
          >
            Đóng
          </Button>

          <Box
            sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}
          >
            <Button
              onClick={() => openConfirmDialog("reject")}
              variant="outlined"
              size="large"
              startIcon={<CancelIcon />}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                flex: { xs: 1, sm: "none" },
              }}
            >
              Từ chối
            </Button>
            <Button
              onClick={() => openConfirmDialog("approve")}
              variant="contained"
              size="large"
              startIcon={<CheckIcon />}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                flex: { xs: 1, sm: "none" },
                background: "linear-gradient(135deg, #38a169 0%, #2f855a 100%)",
                boxShadow: "0 4px 12px rgba(56, 161, 105, 0.4)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2f855a 0%, #276749 100%)",
                  boxShadow: "0 6px 16px rgba(56, 161, 105, 0.5)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Duyệt
            </Button>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
}
