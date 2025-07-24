import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Select,
  MenuItem,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import reportService from "../../../services/reportService";

const statusColor = {
  pending: "warning",
  processing: "info",
  resolved: "success",
  rejected: "error",
};

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editResult, setEditResult] = useState("");
  const [error, setError] = useState("");
  const [mediaModal, setMediaModal] = useState({
    open: false,
    media: null,
    index: 0,
  });

  useEffect(() => {
    const fetchReports = async () => {
      const res = await reportService.getAllReports();
      setReports(res);
    };
    fetchReports();
  }, []);

  const handleOpen = (report) => {
    setSelected(report);
    setEditStatus(report.status);
    setEditResult(report.result || "");
  };

  const handleClose = () => {
    setSelected(null);
  };

  const handleSave = () => {
    // TODO: Gọi API cập nhật trạng thái/kết quả
    setReports((prev) =>
      prev.map((r) =>
        r._id === selected._id
          ? { ...r, status: editStatus, result: editResult }
          : r
      )
    );
    handleClose();
  };

  const handleDecisionApprovedRefund = async (orderId) => {
    const res = await reportService.updateReportRefund(orderId, "approved", "");
    setReports((prev) =>
      prev.map((r) =>
        r._id === selected._id
          ? { ...r, status: "resolved", result: "approved" }
          : r
      )
    );
    setError("");
    handleClose();
  };
  const handleDecisionRejectRefund = async (orderId) => {
    if (!editResult.trim()) {
      setError("Vui lòng nhập lời giải thích trước khi quyết định!");
      return;
    }
    const res = await reportService.updateReportRefund(
      orderId,
      "rejected",
      editResult
    );
    setReports((prev) =>
      prev.map((r) =>
        r._id === selected._id
          ? { ...r, status: "resolved", result: editResult }
          : r
      )
    );
    setError("");
    handleClose();
  };
  const handleMediaClick = (media, index) => {
    setMediaModal({ open: true, media, index });
  };

  const handleCloseMediaModal = () => {
    setMediaModal({ open: false, media: null, index: 0 });
  };

  const handleNextMedia = () => {
    if (selected && selected.images.length > 0) {
      const nextIndex = (mediaModal.index + 1) % selected.images.length;
      setMediaModal({
        open: true,
        media: selected.images[nextIndex],
        index: nextIndex,
      });
    }
  };

  const handlePrevMedia = () => {
    if (selected && selected.images.length > 0) {
      const prevIndex =
        mediaModal.index === 0
          ? selected.images.length - 1
          : mediaModal.index - 1;
      setMediaModal({
        open: true,
        media: selected.images[prevIndex],
        index: prevIndex,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (mediaModal.open) {
      if (event.key === "Escape") {
        handleCloseMediaModal();
      } else if (event.key === "ArrowRight") {
        handleNextMedia();
      } else if (event.key === "ArrowLeft") {
        handlePrevMedia();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [mediaModal]);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, bgcolor: "#f7f8fa", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        letterSpacing={2}
        mb={4}
        color="#222"
      >
        Quản lý Báo Cáo
      </Typography>
      <Grid container spacing={4}>
        {reports.map((report) => {
          const isPending = report.status === "pending";
          return (
            <Grid item xs={12} sm={6} md={4} key={report._id}>
              <Card
                variant="outlined"
                sx={{
                  borderLeft: 4,
                  borderColor: (theme) =>
                    theme.palette[statusColor[report.status]].main,
                  borderRadius: 3,
                  boxShadow: 2,
                  cursor: isPending ? "pointer" : "not-allowed",
                  transition: "box-shadow 0.2s, opacity 0.2s",
                  opacity: isPending ? 1 : 0.5,
                  "&:hover": isPending ? { boxShadow: 6 } : {},
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={isPending ? () => handleOpen(report) : undefined}
              >
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Chip
                      label={report.type.toUpperCase()}
                      color={statusColor[report.status]}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary" ml={1}>
                      {new Date(report.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    {report.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      sx={{ width: 28, height: 28, fontSize: 16 }}
                      src={report.reporterId?.avatar}
                    >
                      {report.reporterId?.fullName?.[0]}
                    </Avatar>
                    <Typography variant="body2">
                      {report.reporterId?.fullName}
                    </Typography>
                    <Chip
                      label={report.status}
                      color={statusColor[report.status]}
                      size="small"
                      sx={{ ml: "auto", textTransform: "capitalize" }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Dialog open={!!selected} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          <span>Chi tiết báo cáo</span>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {selected && (
          <DialogContent sx={{ pt: 1 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{ width: 54, height: 54, fontSize: 28 }}
                      src={selected.reporterId?.avatar}
                    >
                      {selected.reporterId?.fullName?.[0]}
                    </Avatar>
                    <Box>
                      <Typography fontWeight={600}>
                        {selected.reporterId?.fullName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selected.reporterId?.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selected.reporterId?.phoneNumber}
                      </Typography>
                    </Box>
                  </Stack>
                  <Divider />
                  <Typography variant="subtitle2" color="text.secondary">
                    Mô tả báo cáo
                  </Typography>
                  <Typography variant="body1">
                    {selected.description}
                  </Typography>
                  {selected.images.length > 0 && (
                    <Stack
                      direction="row"
                      spacing={2}
                      flexWrap="wrap"
                      sx={{ mt: 1 }}
                    >
                      {selected.images.map((file, idx) => {
                        const url = file.url || "";
                        // Nhận diện ảnh/video chỉ dựa vào đuôi file trong url
                        const isImage =
                          /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
                        const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(url);
                        const isPending = selected.status === "pending";
                        return (
                          <Box
                            key={idx}
                            sx={{
                              width: 110,
                              height: 110,
                              borderRadius: 3,
                              border: "1px solid #e0e0e0",
                              overflow: "hidden",
                              position: "relative",
                              boxShadow: 3,
                              cursor: isPending ? "pointer" : "not-allowed",
                              bgcolor: "#f8f9fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition:
                                "transform 0.18s, box-shadow 0.18s, opacity 0.2s",
                              opacity: isPending ? 1 : 0.5,
                              "&:hover": isPending
                                ? {
                                    transform: "scale(1.08)",
                                    boxShadow: 6,
                                    zIndex: 2,
                                  }
                                : {},
                            }}
                            onClick={
                              isPending
                                ? () => handleMediaClick(file, idx)
                                : undefined
                            }
                          >
                            {isImage && (
                              <img
                                src={url}
                                alt={`evidence-${idx}`}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: 12,
                                  transition: "opacity 0.2s",
                                }}
                              />
                            )}
                            {isVideo && (
                              <>
                                <video
                                  src={url}
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 12,
                                    filter: "brightness(0.7)",
                                  }}
                                  muted
                                  preload="metadata"
                                />
                                <PlayCircleOutlineIcon
                                  sx={{
                                    position: "absolute",
                                    color: "#fff",
                                    fontSize: 44,
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                    opacity: 0.85,
                                    pointerEvents: "none",
                                  }}
                                />
                              </>
                            )}
                            {/* Overlay info on hover */}
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: "100%",
                                bgcolor: "rgba(0,0,0,0.45)",
                                color: "#fff",
                                fontSize: 12,
                                px: 1,
                                py: 0.5,
                                opacity: 0,
                                transition: "opacity 0.2s",
                                pointerEvents: "none",
                                "&:hover": { opacity: 1 },
                              }}
                            >
                              {file.originalname ||
                                (isImage ? "Ảnh" : isVideo ? "Video" : "")}
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack spacing={2}>
                  {selected.type === "order" && selected.targetId && (
                    <Box sx={{ bgcolor: "#f7f7fa", borderRadius: 2, p: 2 }}>
                      <Typography fontWeight={600}>
                        Đơn hàng:{" "}
                        {selected.targetId.orderId || selected.targetId._id}
                      </Typography>
                      <Typography>
                        Người bán: {selected.targetId.sellerId}
                      </Typography>
                      <Typography>
                        Người mua: {selected.targetId.buyerId}
                      </Typography>
                      <Typography>
                        Tổng tiền:{" "}
                        {selected.targetId.totalAmount?.toLocaleString()}đ
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography fontWeight={500}>
                        Thông tin vận chuyển:
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
                        <Typography variant="body2">
                          Phí ship:{" "}
                          {selected.targetId.shippingFee?.toLocaleString()}đ
                        </Typography>
                        <Typography variant="body2">
                          Phí bảo hiểm:{" "}
                          {selected.targetId.insuranceFee?.toLocaleString()}đ
                        </Typography>
                        <Typography variant="body2">
                          Phí COD: {selected.targetId.codFee?.toLocaleString()}đ
                        </Typography>
                        <Typography variant="body2">
                          Tổng phí ship:{" "}
                          {selected.targetId.totalShippingFee?.toLocaleString()}
                          đ
                        </Typography>
                        <Typography variant="body2">
                          Phương thức ship: {selected.targetId.shippingMethod}
                        </Typography>
                        <Typography variant="body2">
                          Phương thức thanh toán:{" "}
                          {selected.targetId.paymentMethod}
                        </Typography>
                        <Typography variant="body2">
                          Đã thanh toán:{" "}
                          {selected.targetId.statusPayment ? "✔️" : "❌"}
                        </Typography>
                        <Typography variant="body2">
                          Địa chỉ giao: {selected.targetId.shippingAddress}
                        </Typography>
                        <Typography variant="body2">
                          Mã vận đơn GHN: {selected.targetId.ghnOrderCode}
                        </Typography>
                        <Typography variant="body2">
                          Mã kho GHN: {selected.targetId.ghnSortCode}
                        </Typography>
                        <Typography variant="body2">
                          Loại vận chuyển: {selected.targetId.transType}
                        </Typography>
                        <Typography variant="body2">
                          Trạng thái GHN: {selected.targetId.ghnStatus}
                        </Typography>
                        <Typography variant="body2">
                          Link tracking:{" "}
                          {selected.targetId.ghnTrackingUrl ? (
                            <a
                              href={selected.targetId.ghnTrackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Xem
                            </a>
                          ) : (
                            "-"
                          )}
                        </Typography>
                        <Typography variant="body2">
                          Thời gian dự kiến giao:{" "}
                          {selected.targetId.expectedDeliveryTime
                            ? new Date(
                                selected.targetId.expectedDeliveryTime
                              ).toLocaleString()
                            : "-"}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                      <Typography fontWeight={500}>
                        Trạng thái đơn hàng:
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap" mb={1}>
                        <Typography variant="body2">
                          Trạng thái: {selected.targetId.status}
                        </Typography>
                        <Typography variant="body2">
                          Lý do: {selected.targetId.reason}
                        </Typography>
                        <Typography variant="body2">
                          Quyết định hoàn tiền:{" "}
                          {selected.targetId.refundDecision}
                        </Typography>
                        <Typography variant="body2">
                          Lý do quyết định:{" "}
                          {selected.targetId.refundDecisionReason || "-"}
                        </Typography>
                      </Stack>
                      <Divider sx={{ my: 1 }} />
                      <Typography fontWeight={500}>Mốc thời gian:</Typography>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        <li>
                          Tạo đơn:{" "}
                          {selected.targetId.createdAt
                            ? new Date(
                                selected.targetId.createdAt
                              ).toLocaleString()
                            : "-"}
                        </li>
                        {selected.targetId.deliveredAt && (
                          <li>
                            Giao hàng:{" "}
                            {new Date(
                              selected.targetId.deliveredAt
                            ).toLocaleString()}
                          </li>
                        )}
                        {selected.targetId.completedAt && (
                          <li>
                            Hoàn thành:{" "}
                            {new Date(
                              selected.targetId.completedAt
                            ).toLocaleString()}
                          </li>
                        )}
                        {selected.targetId.refundCompletedAt && (
                          <li>
                            Hoàn tiền:{" "}
                            {new Date(
                              selected.targetId.refundCompletedAt
                            ).toLocaleString()}
                          </li>
                        )}
                      </ul>
                      <Divider sx={{ my: 1 }} />
                      <Typography fontWeight={500}>Sản phẩm:</Typography>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {selected.targetId.products?.map((p, i) => (
                          <li key={i}>
                            {p.productId} x{p.quantity}
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}
                  {selected.type === "product" && selected.targetId && (
                    <Box sx={{ bgcolor: "#f7f7fa", borderRadius: 2, p: 2 }}>
                      <Typography fontWeight={600}>
                        Sản phẩm: {selected.targetId.name}
                      </Typography>
                      <Typography>
                        Người bán: {selected.targetId.sellerId}
                      </Typography>
                      <Typography>
                        Giá: {selected.targetId.price?.toLocaleString()}đ
                      </Typography>
                    </Box>
                  )}
                  {/* Disable thao tác nếu không phải pending */}
                  {selected.status !== "pending" ? (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      Báo cáo này đã được xử lý. Bạn không thể thao tác thêm.
                    </Typography>
                  ) : (
                    <>
                      <TextField
                        label="Kết quả xử lý / Lời giải thích"
                        multiline
                        minRows={3}
                        value={editResult}
                        onChange={(e) => setEditResult(e.target.value)}
                        placeholder="Nhập ghi chú quyết định..."
                        fullWidth
                        error={!!error}
                        helperText={error}
                      />
                      {selected.type === "order" ? (
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="success"
                            size="large"
                            sx={{ borderRadius: 2, fontWeight: 600, flex: 1 }}
                            onClick={() =>
                              handleDecisionApprovedRefund(
                                selected.targetId._id
                              )
                            }
                          >
                            Chấp nhận hoàn tiền
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="large"
                            sx={{ borderRadius: 2, fontWeight: 600, flex: 1 }}
                            onClick={() =>
                              handleDecisionRejectRefund(selected.targetId._id)
                            }
                          >
                            Từ chối hoàn tiền
                          </Button>
                        </Stack>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          sx={{ borderRadius: 2, fontWeight: 600 }}
                          onClick={handleSave}
                        >
                          Lưu quyết định
                        </Button>
                      )}
                    </>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
        )}
      </Dialog>

      {/* Full Screen Media Modal */}
      <Dialog
        open={mediaModal.open && selected && selected.status === "pending"}
        onClose={handleCloseMediaModal}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(0,0,0,0.95)",
            boxShadow: "none",
            m: 0,
            height: "100vh",
            maxHeight: "100vh",
            borderRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Close button */}
          <IconButton
            onClick={handleCloseMediaModal}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "#fff",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Navigation buttons */}
          {selected && selected.images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevMedia}
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                  zIndex: 10,
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={handleNextMedia}
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#fff",
                  bgcolor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    bgcolor: "rgba(0,0,0,0.7)",
                  },
                  zIndex: 10,
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </>
          )}

          {/* Media content */}
          {mediaModal.media && (
            <Box
              sx={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {(() => {
                const url = mediaModal.media.url || "";
                // Nhận diện ảnh/video chỉ dựa vào đuôi file trong url
                const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
                const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(url);

                if (isImage) {
                  return (
                    <img
                      src={url}
                      alt={`evidence-${mediaModal.index}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                  );
                } else if (isVideo) {
                  return (
                    <video
                      src={url}
                      controls
                      autoPlay
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        borderRadius: 8,
                      }}
                    />
                  );
                }
                return null;
              })()}
            </Box>
          )}

          {/* Media counter */}
          {selected && selected.images.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                color: "#fff",
                bgcolor: "rgba(0,0,0,0.5)",
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: 14,
              }}
            >
              {mediaModal.index + 1} / {selected.images.length}
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
