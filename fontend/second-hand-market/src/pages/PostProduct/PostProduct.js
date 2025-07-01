import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Divider,
  Alert,
  Stack,
  Autocomplete,
  InputAdornment,
  Fab,
  Backdrop,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import {
  CloudUpload,
  Delete,
  Add,
  Send,
  ArrowBack,
  Image,
  VideoLibrary,
  AttachMoney,
  Inventory,
  Category,
  Description,
  Label,
} from "@mui/icons-material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useCategory } from "../../contexts/CategoryContext";
import { useProduct } from "../../contexts/ProductContext";
import ButtonBack from "./../../components/common/Button/ButtonBack";
import { useAuth } from "../../contexts/AuthContext";
import SellerIntroPage from "../../components/SellerIntroPage/SellerIntroPage";
import { useNotification } from "../../hooks/useNotification";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6b7280",
      light: "#9ca3af",
      dark: "#4b5563",
    },
    secondary: {
      main: "#e5e7eb",
      light: "#f3f4f6",
      dark: "#d1d5db",
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
    success: {
      main: "#10b981",
    },
    text: {
      primary: "#374151",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h3: {
      fontWeight: 600,
      color: "#374151",
    },
    h4: {
      fontWeight: 600,
      color: "#374151",
    },
    h6: {
      fontWeight: 500,
      color: "#6b7280",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
            "& fieldset": {
              borderColor: "#e5e7eb",
              borderWidth: 1,
            },
            "&:hover fieldset": {
              borderColor: "#d1d5db",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#6b7280",
              boxShadow: "0 0 0 3px rgba(107, 114, 128, 0.1)",
            },
          },
          "& input[type=number]": {
            "-moz-appearance": "textfield",
          },
          "& input[type=number]::-webkit-outer-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
          "& input[type=number]::-webkit-inner-spin-button": {
            "-webkit-appearance": "none",
            margin: 0,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#ffffff",
          border: "1px solid #f3f4f6",
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          textTransform: "none",
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: "0.95rem",
        },
        contained: {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          "&:hover": {
            backgroundColor: "#4b5563",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
  },
});

const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed #d1d5db`,
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: "#fafafa",
  "&:hover": {
    borderColor: "#9ca3af",
    backgroundColor: "#f3f4f6",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
}));

const PreviewCard = styled(Card)(({ theme }) => ({
  position: "relative",
  height: 200,
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: "#ffffff",
  border: "1px solid #f3f4f6",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
}));

const PostProduct = () => {
  const { getCategories } = useCategory();
  const { postProduct } = useProduct();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { currentUser } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { notification, showSuccess, showError, showInfo, hideNotification } =
    useNotification();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stock: 0,
    description: "",
    categoryId: "",
    subcategoryId: "",
    attributes: [],
  });

  const [newAttribute, setNewAttribute] = useState({
    key: "",
    value: "",
  });

  const categoryOptions = categories.map((cate) => ({
    id: cate._id,
    label: cate.name,
    ...cate,
  }));

  const subCategoryOptions =
    categories
      .find(
        (cate) => product.categoryId !== "" && cate._id === product.categoryId
      )
      ?.subcategories.map((sub) => ({
        id: sub._id,
        label: sub.name,
        ...sub,
      })) || [];

  const handleCategoryChange = (event, newValue) => {
    setProduct({
      ...product,
      categoryId: newValue?.id || "",
      subcategoryId: "",
    });
  };

  const handleSubCategoryChange = (event, newValue) => {
    setProduct({ ...product, subcategoryId: newValue?.id || "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttributeInputChange = (e) => {
    const { name, value } = e.target;
    setNewAttribute((prev) => ({ ...prev, [name]: value }));
  };

  const addAttribute = () => {
    if (newAttribute.key.trim() && newAttribute.value.trim()) {
      setProduct((prev) => ({
        ...prev,
        attributes: [
          ...prev.attributes,
          {
            ...newAttribute,
            id: Date.now(), // ID tạm cho React key và delete function, sẽ bị loại bỏ khi gửi server
          },
        ],
      }));
      setNewAttribute({ key: "", value: "" });
    }
  };

  const removeAttribute = (id) => {
    setProduct((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.id !== id),
    }));
  };

  const createFormData = (productData, files) => {
    const formData = new FormData();

    // Thêm các trường text
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("stock", productData.stock);
    formData.append("description", productData.description);
    formData.append("categoryId", productData.categoryId);
    formData.append("subcategoryId", productData.subcategoryId);
    formData.append("attributes", JSON.stringify(productData.attributes));

    // Thêm files với kiểm tra type
    files.forEach((file, index) => {
      // Validate file type
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        formData.append("images", file);
      } else {
        console.warn(
          `File ${file.name} không được hỗ trợ (type: ${file.type})`
        );
      }
    });

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);

    try {
      // Validation
      if (!product.name.trim()) {
        throw new Error("Tên sản phẩm không được để trống");
      }
      if (!product.price || product.price <= 0) {
        throw new Error("Giá sản phẩm phải lớn hơn 0");
      }
      if (!product.categoryId) {
        throw new Error("Vui lòng chọn danh mục");
      }
      if (files.length === 0) {
        throw new Error("Vui lòng thêm ít nhất 1 hình ảnh");
      }

      // Tạo FormData
      const formData = createFormData(product, files);

      // Gửi request với FormData và progress tracking
      const response = await postProduct(formData, true, (progress) => {
        setUploadProgress(progress);
      });

      if (response.message) {
        showSuccess(response.message);
        // navigate("/");
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm lên:", error);
      showError(error.message || "Có lỗi xảy ra khi đăng sản phẩm");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        document.getElementById("fileInput").value = "";
      }
      return newFiles;
    });
  };

  if (currentUser?.role === "buyer" || !currentUser) {
    return <SellerIntroPage />;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#fafafa",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Simple Header */}
          <Box sx={{ mb: 4 }}>
            <ButtonBack url="/eco-market/home" />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                mt: 2,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Đăng sản phẩm mới
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600 }}
            >
              Điền thông tin chi tiết để khách hàng hiểu rõ về sản phẩm của bạn
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            {/* Elegant Card Layout */}
            <Box sx={{ maxWidth: 900, mx: "auto" }}>
              {/* Progress Bar */}
              {loading && uploadProgress > 0 && (
                <Paper sx={{ p: 2, mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Đang tải lên... {uploadProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ borderRadius: 2, height: 8 }}
                  />
                </Paper>
              )}

              {/* Step Progress */}
              <Box sx={{ mb: 6 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "10%",
                      right: "10%",
                      height: 1,
                      backgroundColor: "divider",
                      display: { xs: "none", sm: "block" },
                      zIndex: 0,
                    },
                  }}
                >
                  {[
                    {
                      number: "01",
                      title: "Hình ảnh",
                      icon: <Image />,
                      active: true,
                    },
                    {
                      number: "02",
                      title: "Thông tin",
                      icon: <Inventory />,
                      active: false,
                    },
                    {
                      number: "03",
                      title: "Thuộc tính",
                      icon: <Label />,
                      active: false,
                    },
                  ].map((step, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "background.paper",
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: step.active ? "primary.main" : "divider",
                        position: "relative",
                        zIndex: 1,
                        minWidth: 140,
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        sx={{
                          mr: 1.5,
                          color: step.active
                            ? "primary.main"
                            : "text.secondary",
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: step.active
                              ? "primary.main"
                              : "text.secondary",
                            fontWeight: 600,
                            display: "block",
                            lineHeight: 1,
                          }}
                        >
                          {step.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: step.active
                              ? "primary.main"
                              : "text.secondary",
                            fontWeight: step.active ? 600 : 400,
                            lineHeight: 1,
                          }}
                        >
                          {step.title}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Upload Section */}
              <Paper sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Image sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="text.primary"
                    >
                      Hình ảnh sản phẩm{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thêm ít nhất 1 hình ảnh để khách hàng dễ dàng nhận diện
                      sản phẩm
                    </Typography>
                  </Box>
                </Box>

                {files.length > 0 && (
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {files.map((file, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <PreviewCard>
                          {file.type.startsWith("image/") ? (
                            <CardMedia
                              component="img"
                              height="200"
                              image={URL.createObjectURL(file)}
                              alt="Preview"
                              sx={{ objectFit: "cover" }}
                            />
                          ) : file.type.startsWith("video/") ? (
                            <CardMedia
                              component="video"
                              height="200"
                              controls
                              sx={{ objectFit: "cover" }}
                            >
                              <source
                                src={URL.createObjectURL(file)}
                                type={file.type}
                              />
                            </CardMedia>
                          ) : null}
                          <IconButton
                            onClick={() => handleRemoveFile(index)}
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              bgcolor: "error.main",
                              color: "white",
                              "&:hover": { bgcolor: "error.dark" },
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </PreviewCard>
                      </Grid>
                    ))}
                  </Grid>
                )}

                <UploadBox
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <CloudUpload
                    sx={{ fontSize: 40, color: "primary.main", mb: 2 }}
                  />
                  <Typography variant="h6" color="primary" gutterBottom>
                    Tải lên hình ảnh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kéo thả hoặc nhấn để chọn ảnh/video
                  </Typography>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </UploadBox>
              </Paper>

              {/* Product Information */}
              <Paper sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: "success.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Inventory sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="text.primary"
                    >
                      Thông tin sản phẩm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cung cấp thông tin chi tiết về sản phẩm
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Tên sản phẩm *"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Giá *"
                      name="price"
                      type="number"
                      value={product.price}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">VNĐ</InputAdornment>
                        ),
                      }}
                      sx={{
                        "& input[type=number]": {
                          "-moz-appearance": "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số lượng"
                      name="stock"
                      type="number"
                      value={product.stock}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={categoryOptions}
                      getOptionLabel={(option) => option.label}
                      value={
                        categoryOptions.find(
                          (option) => option.id === product.categoryId
                        ) || null
                      }
                      onChange={handleCategoryChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Danh mục *"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {subCategoryOptions.length > 0 && (
                      <Autocomplete
                        options={subCategoryOptions}
                        getOptionLabel={(option) => option.label}
                        value={
                          subCategoryOptions.find(
                            (option) => option.id === product.subcategoryId
                          ) || null
                        }
                        onChange={handleSubCategoryChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Danh mục phụ"
                            variant="outlined"
                          />
                        )}
                      />
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Mô tả sản phẩm"
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Attributes Section */}
              <Paper sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      backgroundColor: "#fbbf24",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Label sx={{ color: "white", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="text.primary"
                    >
                      Thuộc tính sản phẩm
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thêm các thông số kỹ thuật của sản phẩm
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    mb: 3,
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Tên thuộc tính"
                        name="key"
                        value={newAttribute.key}
                        onChange={handleAttributeInputChange}
                        variant="outlined"
                        placeholder="VD: Màu sắc, Kích thước..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Giá trị"
                        name="value"
                        value={newAttribute.value}
                        onChange={handleAttributeInputChange}
                        variant="outlined"
                        placeholder="VD: Đỏ, Size L..."
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={addAttribute}
                        disabled={
                          !newAttribute.key.trim() || !newAttribute.value.trim()
                        }
                        startIcon={<Add />}
                        sx={{ height: 40 }}
                      >
                        Thêm thuộc tính
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                {product.attributes.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Danh sách thuộc tính:
                    </Typography>
                    <Grid container spacing={2}>
                      {product.attributes.map((attr) => (
                        <Grid item xs={12} sm={6} key={attr.id}>
                          <Paper
                            sx={{
                              p: 2,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                boxShadow: 2,
                                transform: "translateX(4px)",
                              },
                            }}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                              >
                                {attr.key}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {attr.value}
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => removeAttribute(attr.id)}
                              color="error"
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Paper>

              {/* Submit Section */}
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Send />
                  }
                  sx={{ px: 6, py: 2 }}
                >
                  {loading ? "Đang đăng..." : "Đăng sản phẩm"}
                </Button>
              </Box>
            </Box>
          </form>

          {/* Loading Backdrop */}
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress color="inherit" />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Đang xử lý...
              </Typography>
              {uploadProgress > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {uploadProgress}% đã hoàn thành
                </Typography>
              )}
            </Box>
          </Backdrop>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default PostProduct;
