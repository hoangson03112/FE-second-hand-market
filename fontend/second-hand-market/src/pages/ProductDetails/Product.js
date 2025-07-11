import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import emitter from "../../utils/mitt";
import AccountContext from "../../contexts/AccountContext";
import { useProduct } from "../../contexts/ProductContext";
import { useCart } from "../../contexts/CartContext";
import { useChat } from "../../contexts/ChatContext";
import { useNotification } from "../../hooks/useNotification";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
  Container,
  Breadcrumbs,
  Link,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  Chat,
  LocationOn,
  Person,
  Security,
  LocalShipping,
  Remove,
  Add,
  FlashOn,
  Favorite,
  FavoriteBorder,
  Share,
  Storefront,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
} from "@mui/icons-material";

// Constants
const TABS = [
  { id: "description", label: "Mô tả sản phẩm" },
  { id: "specs", label: "Thông số kỹ thuật" },
  { id: "reviews", label: "Đánh giá" },
];

const SAFETY_TIPS = [
  "Gặp mặt tại nơi công cộng",
  "Kiểm tra hàng trước khi thanh toán",
  "Không chuyển khoản trước",
  "Báo cáo nếu có vấn đề",
];

const PURCHASE_TIPS = [
  "Kiểm tra kỹ sản phẩm trước khi nhận",
  "Thử nghiệm đầy đủ chức năng",
  "Bảo hành theo chính sách của shop",
];

// Sample related products data
const relatedProducts = [
  {
    id: 1,
    image:
      "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
    name: "(Thanh lý chính hãng) Máy sưởi điện 3 bóng Halogen",
    price: 399000,
    location: "Hà Nội",
  },
  {
    id: 2,
    image:
      "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
    name: "(Thanh lý chính hãng) Kính UNIQLO chống tia UV nội địa Nhật",
    price: 119000,
    location: "Hà Nội",
  },
  {
    id: 3,
    image:
      "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
    name: "(Thanh lý chính hãng) Máy rửa mặt Foreo Luna Mini 2",
    price: 649000,
    location: "Hà Nội",
  },
  {
    id: 4,
    image:
      "https://static.oreka.vn/250-250_8efd61a6-25e2-490f-977f-63bec8c95ca2",
    name: "(Thanh lý chính hãng) Vòng tay trang sức bạc s925",
    price: 286000,
    location: "Hà Nội",
  },
];

// Utility functions
const formatPrice = (price) => {
  if (!price) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

// Custom TabPanel component for MUI
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Custom hook for product image gallery
const useImageGallery = (images = []) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  return {
    currentImageIndex,
    setCurrentImageIndex,
    imageLoading,
    setImageLoading,
    nextImage,
    prevImage,
    handleImageLoad,
  };
};

// Main component
export const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { findOrCreateWithProduct } = useChat();
  const { showSuccess, showWarning, showError } = useNotification();

  const queryParams = new URLSearchParams(location.search);
  const productID = queryParams.get("productID");

  const { getProduct } = useProduct();
  const { addToCart } = useCart();

  // State
  const [product, setProduct] = useState({});
  const [account, setAccount] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Custom hooks
  const { currentImageIndex, setCurrentImageIndex, nextImage, prevImage } =
    useImageGallery(product?.images || []);

  // Memoized values
  const attributesOfProduct = useMemo(() => {
    const baseAttributes = [
      {
        label: "Danh mục",
        value: product?.category?.name || "Chưa xác định",
      },
      {
        label: "Danh mục con",
        value: product?.subcategory?.name || "Chưa xác định",
      },
    ];

    const customAttributes =
      product?.attributes?.map((att) => ({
        label: att.key,
        value: att.value,
      })) || [];

    return [...baseAttributes, ...customAttributes];
  }, [
    product?.category?.name,
    product?.subcategory?.name,
    product?.attributes,
  ]);

  // API calls
  const fetchAccount = useCallback(async (accountId) => {
    try {
      const response = await AccountContext.getAccount(accountId);
      setAccount(response);
    } catch (error) {
      console.error("Error fetching account:", error);
      setError("Error fetching account");
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    if (!productID) return;

    try {
      setLoading(true);
      const productData = await getProduct(productID);

      if (productData?.seller?._id) {
        await fetchAccount(productData.seller._id);
      }

      setProduct(productData);
      setError("");
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [productID, getProduct, fetchAccount]);

  // Event handlers
  const handleQuantityChange = useCallback(
    (newQuantity) => {
      if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
        setQuantity(newQuantity);
      }
    },
    [product?.stock]
  );

  const handleAddToCart = useCallback(async () => {
    try {
      setActionLoading(true);
      const data = await AccountContext.Authentication();

      if (!data?.data) {
        showWarning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }

      if (data.data.account) {
        const messageAddToCart = await addToCart(
          product._id,
          quantity,
          account._id
        );

        if (messageAddToCart.status === "success") {
          emitter.emit("CART_UPDATED");
          showSuccess("Thêm sản phẩm vào giỏ hàng thành công!");
        } else {
          showError("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    } finally {
      setActionLoading(false);
    }
  }, [
    product._id,
    quantity,
    account._id,
    addToCart,
    showSuccess,
    showWarning,
    showError,
  ]);

  const handlePurchaseNow = useCallback(async () => {
    try {
      setActionLoading(true);
      const data = await AccountContext.Authentication();

      if (!data?.data) {
        showWarning("Vui lòng đăng nhập để mua sản phẩm!");
        return;
      }

      navigate("/eco-market/checkout", {
        state: {
          selectedItems: [{ ...product, productId: product._id, quantity }],
        },
      });
    } catch (error) {
      console.error("Error during purchase:", error);
      showError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  }, [product, quantity, navigate, showWarning, showError]);

  const handleOpenChat = useCallback(async () => {
    try {
      const authData = await AccountContext.Authentication();

      if (!authData?.data) {
        showWarning("Vui lòng đăng nhập để chat với người bán!");
        setTimeout(() => navigate("/eco-market/login"), 2000);
        return;
      }

      const response = await findOrCreateWithProduct(productID, account._id);

      if (!response?.success) {
        console.error("Failed to create chat conversation:", response);
        showError("Không thể kết nối với người bán. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error creating chat conversation:", error);
      showError(
        "Có lỗi xảy ra khi kết nối với người bán. Vui lòng thử lại sau."
      );
    }
  }, [
    productID,
    account._id,
    findOrCreateWithProduct,
    navigate,
    showWarning,
    showError,
  ]);

  const handleToggleLike = useCallback(() => {
    setIsLiked((prev) => !prev);
  }, []);

  // Effects
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProduct}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Breadcrumb */}
      <Paper elevation={0} sx={{ borderBottom: "1px solid #e2e8f0", py: 2 }}>
        <Container
          maxWidth={false}
          sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}
        >
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="/">
              Trang chủ
            </Link>
            <Link underline="hover" color="inherit" href="/category">
              Điện thoại
            </Link>
            <Typography color="text.primary" fontWeight={600}>
              iPhone
            </Typography>
          </Breadcrumbs>
        </Container>
      </Paper>

      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1400px",
          mx: "auto",
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Grid container spacing={4}>
          {/* Product Images & Details */}
          <Grid item xs={12} lg={9}>
            <Card elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardContent sx={{ p: 0 }}>
                <Grid container spacing={0}>
                  {/* Image Gallery */}
                  <Grid item xs={12} md={7} sx={{ p: 4 }}>
                    <Box sx={{ position: "relative", mb: 3 }}>
                      <Box
                        sx={{
                          position: "relative",
                          bgcolor: "#f1f5f9",
                          borderRadius: 3,
                          overflow: "hidden",
                          aspectRatio: "4/3",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Box
                          component="img"
                          src={product?.images?.[currentImageIndex]?.url || ""}
                          alt={product?.name || "Product image"}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 2,
                          }}
                          onError={(e) => {}}
                        />

                        {/* Navigation Arrows */}
                        {product?.images?.length > 1 && (
                          <>
                            <IconButton
                              onClick={prevImage}
                              sx={{
                                position: "absolute",
                                left: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                bgcolor: "rgba(255,255,255,0.9)",
                                "&:hover": { bgcolor: "white" },
                              }}
                            >
                              <ChevronLeft />
                            </IconButton>
                            <IconButton
                              onClick={nextImage}
                              sx={{
                                position: "absolute",
                                right: 8,
                                top: "50%",
                                transform: "translateY(-50%)",
                                bgcolor: "rgba(255,255,255,0.9)",
                                "&:hover": { bgcolor: "white" },
                              }}
                            >
                              <ChevronRight />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Thumbnails */}
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-start"
                    >
                      {product?.images?.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          sx={{
                            width: 80,
                            height: 60,
                            borderRadius: 2,
                            overflow: "hidden",
                            border: index === currentImageIndex ? 3 : 2,
                            borderColor:
                              index === currentImageIndex
                                ? "primary.main"
                                : "grey.300",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow:
                              index === currentImageIndex
                                ? "0 2px 8px rgba(25,118,210,0.3)"
                                : "none",
                            "&:hover": {
                              transform: "scale(1.05)",
                              boxShadow: "0 2px 8px rgba(25,118,210,0.2)",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={image?.url || ""}
                            alt={`Thumbnail ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Grid>

                  {/* Product Info */}
                  <Grid item xs={12} md={5} sx={{ p: 4, bgcolor: "#fafafa" }}>
                    <Stack spacing={3}>
                      {/* Title & Badges */}
                      <Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom>
                          {product?.name || "Tên sản phẩm"}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={product?.condition || "Mới"}
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                          <Chip
                            label={`Còn ${product?.stock || 0} sản phẩm`}
                            color="info"
                            variant="outlined"
                            size="small"
                          />
                        </Stack>
                      </Box>

                      {/* Price */}
                      <Box>
                        <Stack
                          direction="row"
                          alignItems="baseline"
                          spacing={2}
                        >
                          <Typography
                            variant="h4"
                            color="error.main"
                            fontWeight={700}
                          >
                            {formatPrice(product?.price || 0)}
                          </Typography>
                          {product?.originalPrice && (
                            <Typography
                              variant="h6"
                              color="text.secondary"
                              sx={{ textDecoration: "line-through" }}
                            >
                              {formatPrice(product.originalPrice)}
                            </Typography>
                          )}
                        </Stack>
                        <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LocationOn color="error" fontSize="small" />
                            <Typography variant="body2">
                              {product?.seller?.location || "Chưa xác định"}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LocalShipping color="success" fontSize="small" />
                            <Typography variant="body2">
                              Miễn phí ship
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Quantity */}
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          gutterBottom
                        >
                          Số lượng:
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <IconButton
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            sx={{
                              border: "1px solid #e2e8f0",
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                            }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            sx={{ minWidth: 40, textAlign: "center" }}
                          >
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= (product?.stock || 0)}
                            sx={{
                              border: "1px solid #e2e8f0",
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                            }}
                          >
                            <Add />
                          </IconButton>
                        </Stack>
                      </Box>

                      {/* Action Buttons */}
                      <Stack spacing={2}>
                        <Button
                          onClick={handlePurchaseNow}
                          variant="contained"
                          size="large"
                          startIcon={<FlashOn />}
                          disabled={actionLoading}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {actionLoading ? "Đang xử lý..." : "Mua ngay"}
                        </Button>
                        <Button
                          onClick={handleAddToCart}
                          variant="outlined"
                          size="large"
                          startIcon={<ShoppingCart />}
                          disabled={actionLoading}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                            fontWeight: 600,
                          }}
                        >
                          {actionLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                        </Button>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Seller Info */}
          <Grid item xs={12} lg={3}>
            <Stack spacing={3}>
              {/* Seller Card */}
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <Person />
                    Thông tin người bán
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Avatar
                      src={product?.seller?.avatar || account?.avatar}
                      sx={{
                        width: 60,
                        height: 60,
                        border: "2px solid #e2e8f0",
                      }}
                    />
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {product?.seller?.name || account?.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mb: 0.5,
                        }}
                      >
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {product?.seller?.location ||
                            account?.location ||
                            "Chưa xác định"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Rating
                          value={
                            product?.seller?.rating || account?.rating || 5
                          }
                          readOnly
                          size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({product?.seller?.rating || account?.rating || 5})
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: "#f8fafc",
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          {product?.seller?.responseRate ||
                            account?.responseRate ||
                            95}
                          %
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phản hồi
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          bgcolor: "#f8fafc",
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          {product?.seller?.joinDate ||
                            account?.joinDate ||
                            "2023"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tham gia
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Button
                    onClick={handleOpenChat}
                    variant="contained"
                    fullWidth
                    startIcon={<Chat />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      bgcolor: "success.main",
                      "&:hover": { bgcolor: "success.dark" },
                    }}
                  >
                    Chat với người bán
                  </Button>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Alert
                severity="warning"
                icon={<Security />}
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                  "& .MuiAlert-message": { p: 1 },
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Mẹo an toàn khi mua đồ cũ
                </Typography>
                <Typography variant="body2" component="div">
                  • Gặp mặt tại nơi công cộng
                  <br />
                  • Kiểm tra hàng trước khi thanh toán
                  <br />
                  • Không chuyển khoản trước
                  <br />• Báo cáo nếu có vấn đề
                </Typography>
              </Alert>
            </Stack>
          </Grid>
        </Grid>

        {/* Product Details Tabs */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mt: 5,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              <Tab label="Mô tả sản phẩm" />
              <Tab label="Thông số kỹ thuật" />
              <Tab label="Đánh giá" />
            </Tabs>
          </Box>

          <CardContent>
            <TabPanel value={activeTab} index={0}>
              <Typography variant="body1" paragraph>
                {product?.description || "Không có mô tả"}
              </Typography>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Lưu ý khi mua đồ cũ:
                </Typography>
                <Typography variant="body2">
                  • Kiểm tra kỹ sản phẩm trước khi nhận
                  <br />
                  • Thử nghiệm đầy đủ chức năng
                  <br />• Bảo hành theo chính sách của shop
                </Typography>
              </Alert>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              {attributesOfProduct?.length > 0 ? (
                <Table>
                  <TableBody>
                    {attributesOfProduct.map((spec, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ fontWeight: 500, width: "50%" }}>
                          {spec.label}
                        </TableCell>
                        
                        <TableCell sx={{  width: "50%" }}>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 6 }}
                >
                  Không có thông số kỹ thuật
                </Typography>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Star sx={{ fontSize: 60, color: "grey.300", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Chưa có đánh giá
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hãy là người đầu tiên đánh giá sản phẩm này
                </Typography>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

        {/* Related Products */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            mt: 5,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
            >
              <Storefront />
              Sản phẩm tương tự
            </Typography>

            <Grid container spacing={3}>
              {relatedProducts.map((item) => (
                <Grid key={item.id} item xs={12} sm={6} md={3}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio: "1/1",
                        bgcolor: "#f1f5f9",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.05)" },
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="error.main"
                        fontWeight={700}
                        gutterBottom
                      >
                        {formatPrice(item.price)}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {item.location}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Product;
