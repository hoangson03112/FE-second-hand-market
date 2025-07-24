import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";

const ReportOrderModal = ({ open, onClose, onSubmit, type }) => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("Vui lòng nhập chi tiết báo cáo.");
      return;
    }
    if (images.length === 0) {
      setError("Vui lòng cung cấp ít nhất 1 hình ảnh bằng chứng.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      // Chuẩn bị dữ liệu gửi lên parent
      const formData = new FormData();
      formData.append("description", description);
      // Thêm targetModel dựa vào prop type
      if (typeof type === 'string') {
        formData.append('targetModel', type === 'order' ? 'Order' : type === 'product' ? 'Product' : '');
      }
      images.forEach((img, idx) => {
        formData.append("images", img);
      });
      await onSubmit(formData);
      setDescription("");
      setImages([]);
      onClose();
    } catch (err) {
      setError("Có lỗi khi gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Báo cáo đơn hàng</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Vui lòng nhập chi tiết báo cáo và cung cấp đầy đủ hình ảnh hoặc video bằng chứng
          về đơn hàng.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Chi tiết báo cáo"
          multiline
          minRows={3}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PhotoCamera />}
          >
            Tải lên hình ảnh/video
            <input
              type="file"
              accept="image/*,video/mp4,video/webm,video/ogg,video/avi,video/mov"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        {images.length > 0 && (
          <ImageList cols={3} rowHeight={120} sx={{ mb: 2 }}>
            {images.map((file, idx) => {
              const isImage = file.type.startsWith('image/');
              const isVideo = file.type.startsWith('video/');
              return (
                <ImageListItem key={idx} sx={{ position: 'relative' }}>
                  {isImage && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`evidence-${idx}`}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  )}
                  {isVideo && (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                    />
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(idx)}
                    sx={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      bgcolor: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ImageListItem>
              );
            })}
          </ImageList>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={submitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={submitting}
        >
          {submitting ? "Đang gửi..." : "Gửi báo cáo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportOrderModal;
