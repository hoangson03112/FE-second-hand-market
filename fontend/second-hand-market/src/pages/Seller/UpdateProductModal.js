import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  Avatar,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Paper,
  Stack,
} from "@mui/material";
import {
  PhotoCamera,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import SellerApi from "./SellerApi";
import { useCategory } from "../../contexts/CategoryContext";

const UpdateProductModal = ({ open, onClose, product, onSuccess }) => {
  const { getCategories, getCategory } = useCategory();
  console.log(product);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    status: "pending",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Image states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const statusOptions = [
    { value: "approved", label: "Đang bán", color: "success" },
    { value: "inactive", label: "Ngừng bán", color: "warning" },
  ];

  // Initialize form when product changes
  useEffect(() => {
    if (product && open) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        categoryId: product.categoryId._id || "",
        subcategoryId: product.subcategoryId._id || "",
        status: product.status || "pending",
      });

      // Set existing images - FIX: Reset all image states first
      setAvatarFile(null);
      setAvatarPreview(product.avatar?.url || "");
      setImageFiles([]);
      setExistingImages(product.images || []);
      setImagePreviews([]);

      // Load categories
      loadCategories();

      // Load subcategories if category exists
      if (product.categoryId) {
        loadSubcategories(product.categoryId);
      }
    }
  }, [product, open]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData || []);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadSubcategories = async () => {
    try {
      setSubcategories(product.categoryId?.subcategories || []);
    } catch (err) {
      console.error("Error loading subcategories:", err);
      setSubcategories([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Load subcategories when category changes
    if (field === "categoryId") {
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
      if (value) {
        loadSubcategories(value);
      } else {
        setSubcategories([]);
      }
    }
  };

  // Avatar handling
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
  };

  // Images handling - FIX: Separate new images from existing images
  const handleImagesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // FIX: Remove new image (not existing)
  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Tên sản phẩm không được để trống";
    if (!formData.price || formData.price <= 0)
      return "Giá sản phẩm phải lớn hơn 0";
    if (!formData.stock || formData.stock < 0) return "Số lượng không được âm";
    if (!formData.categoryId) return "Vui lòng chọn danh mục";
    if (!formData.subcategoryId) return "Vui lòng chọn danh mục con";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updateData = new FormData();

      // Thêm các trường dữ liệu cơ bản
      Object.keys(formData).forEach((key) => {
        updateData.append(key, formData[key]);
      });

      // Xử lý avatar
      if (avatarFile) {
        updateData.append("avatar", avatarFile);
      } else if (!avatarPreview && product.avatar) {
        // Nếu người dùng xóa avatar mà không thêm mới
        updateData.append("removeAvatar", "true");
      }

      // Xử lý ảnh bổ sung
      imageFiles.forEach((file) => {
        updateData.append("newImages", file);
      });

      // Gửi danh sách ảnh hiện tại cần giữ lại
      updateData.append("existingImages", JSON.stringify(existingImages));

      await SellerApi.updateProduct(product._id, updateData);
      onSuccess?.();
      handleClose();
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      name: "",
      price: "",
      stock: "",
      description: "",
      categoryId: "",
      subcategoryId: "",
      status: "pending",
    });
    setAvatarFile(null);
    setAvatarPreview("");
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setError("");
    setLoading(false);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Get available status options based on current status
  const getAvailableStatusOptions = () => {
    if (!product?.status) return statusOptions;
    switch (product.status) {
      case "selling":
        // Đang bán chỉ được chuyển sang ngừng bán hoặc hết hàng
        return statusOptions.filter(
          (opt) =>
            opt.value === "paused" ||
            opt.value === "sold" ||
            opt.value === "selling"
        );
      case "paused":
        // Ngừng bán chỉ được chuyển sang đang bán hoặc hết hàng
        return statusOptions.filter(
          (opt) =>
            opt.value === "selling" ||
            opt.value === "sold" ||
            opt.value === "paused"
        );
      case "sold":
        // Hết hàng không được chuyển lại trạng thái khác
        return statusOptions.filter((opt) => opt.value === "sold");
      default:
        return statusOptions;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1, pr: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Cập nhật sản phẩm
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column - Basic Info */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2.5}>
              {/* Product Name */}
              <TextField
                label="Tên sản phẩm"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                required
                variant="outlined"
              />

              {/* Price & Stock */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Giá bán"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2" color="text.secondary">
                          đ
                        </Typography>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Số lượng"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>

              {/* Category & Subcategory */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Danh mục</InputLabel>
                    <Select
                      value={formData.categoryId}
                      onChange={(e) =>
                        handleInputChange("categoryId", e.target.value)
                      }
                      label="Danh mục"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    required
                    disabled={!formData.categoryId}
                  >
                    <InputLabel>Danh mục con</InputLabel>
                    <Select
                      value={formData.subcategoryId}
                      onChange={(e) =>
                        handleInputChange("subcategoryId", e.target.value)
                      }
                      label="Danh mục con"
                    >
                      {subcategories.map((subcategory) => (
                        <MenuItem key={subcategory._id} value={subcategory._id}>
                          {subcategory.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Status */}
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  label="Trạng thái"
                  renderValue={(value) => (
                    <Chip
                      label={
                        statusOptions.find((opt) => opt.value === value)?.label
                      }
                      color={
                        statusOptions.find((opt) => opt.value === value)?.color
                      }
                      size="small"
                    />
                  )}
                >
                  {getAvailableStatusOptions().map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        label={option.label}
                        color={option.color}
                        size="small"
                      />
                    </MenuItem>
                  ))}
                </Select>
                {product?.status === "approved" && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Sản phẩm đã được duyệt, không thể thay đổi trạng thái này
                  </Typography>
                )}
              </FormControl>

              {/* Description */}
              <TextField
                label="Mô tả sản phẩm"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Stack>
          </Grid>

          {/* Right Column - Images */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              {/* Avatar */}
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" gutterBottom>
                  Ảnh đại diện
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 120, height: 120 }}
                    variant="rounded"
                  >
                    <PhotoCamera sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        size="small"
                        startIcon={<UploadIcon />}
                      >
                        Chọn ảnh
                      </Button>
                    </label>
                    {avatarPreview && (
                      <IconButton
                        size="small"
                        onClick={removeAvatar}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Paper>

              {/* Additional Images */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Ảnh bổ sung
                </Typography>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      gutterBottom
                    >
                      Ảnh hiện tại:
                    </Typography>
                    <Grid container spacing={1}>
                      {existingImages.map((image, index) => (
                        <Grid item xs={6} key={`existing-${index}`}>
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              src={image.url}
                              variant="rounded"
                              sx={{ width: "100%", height: 80 }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                bgcolor: "error.main",
                                color: "white",
                                "&:hover": { bgcolor: "error.dark" },
                              }}
                              onClick={() => removeExistingImage(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* New Images */}
                {imagePreviews.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      gutterBottom
                    >
                      Ảnh mới thêm:
                    </Typography>
                    <Grid container spacing={1}>
                      {imagePreviews.map((preview, index) => (
                        <Grid item xs={6} key={`new-${index}`}>
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              src={preview}
                              variant="rounded"
                              sx={{ width: "100%", height: 80 }}
                            />
                            <IconButton
                              size="small"
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                bgcolor: "error.main",
                                color: "white",
                                "&:hover": { bgcolor: "error.dark" },
                              }}
                              onClick={() => removeNewImage(index)}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Upload Button */}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="images-upload"
                  type="file"
                  multiple
                  onChange={handleImagesChange}
                />
                <label htmlFor="images-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<UploadIcon />}
                  >
                    Thêm ảnh
                  </Button>
                </label>
              </Paper>

              {/* Current Product Info */}
              {product && (
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Thông tin hiện tại
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Giá: {formatPrice(product.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Đã bán: {product.soldCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tạo:{" "}
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateProductModal;
