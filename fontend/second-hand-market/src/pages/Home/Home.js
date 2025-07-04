import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Alert,
  AlertTitle,
  Chip,
  Stack,
  IconButton,
  Paper,
  Fade,
  Grow,
  Slide,
  Zoom,
  useTheme,
  styled,
  Avatar,
  Divider,
  Badge,
  Tooltip,
  CardActions,
  LinearProgress,
  Fab,
} from "@mui/material";
import {
  Explore,
  Add,
  Refresh,
  TrendingUp,
  People,
  Inventory,
  CheckCircle,
  Star,
  ArrowForward,
  LocalOffer,
  Favorite,
  FavoriteOutlined,
  Share,
  Visibility,
  VisibilityOutlined,
  AccessTime,
  ArrowUpward,
  AutoAwesome,
  Verified,
  TrendingDown,
  ShoppingCart,
  Security,
  Speed,
  Support,
  Shield,
  RecyclingOutlined,
  StarOutlined,
} from "@mui/icons-material";
import axios from "axios";
import productService from "../../services/productService";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import CategoryCard from "../../components/common/CategoryCard/CategoryCard";

import CheckInModal from "../../components/Checkin/CheckInModal";
import { useAuth } from "../../contexts/AuthContext";

// Enhanced Styled Components with Keyframes
const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "80vh",
  display: "flex",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  borderRadius: "0 0 32px 32px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0.2) 30%,
        rgba(0, 0, 0, 0.1) 70%,
        rgba(0, 0, 0, 0.4) 100%
      )
    `,
    zIndex: 2,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%),
      linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)
    `,
    zIndex: 3,
    opacity: 0.8,
    animation: "subtleShimmer 8s ease-in-out infinite",
  },
  "@keyframes subtleShimmer": {
    "0%, 100%": {
      opacity: 0.8,
      transform: "translateX(0)",
    },
    "50%": {
      opacity: 1,
      transform: "translateX(10px)",
    },
  },
}));

const SliderContainer = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 1,
}));

const SliderImage = styled("img")(({ isActive }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  opacity: isActive ? 1 : 0,
  transition: "opacity 1.5s ease-in-out",
}));

const SliderDots = styled(Box)(() => ({
  position: "absolute",
  bottom: 30,
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 8,
  zIndex: 4,
  padding: "12px 20px",
  borderRadius: 20,
  backdropFilter: "blur(10px)",
  background: "rgba(0,0,0,0.2)",
  border: "1px solid rgba(255,255,255,0.1)",
}));

const SliderDot = styled(Box)(({ isActive }) => ({
  width: isActive ? 32 : 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
  cursor: "pointer",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: isActive ? "0 2px 8px rgba(255,255,255,0.3)" : "none",
  "&:hover": {
    backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.8)",
    transform: "scale(1.2)",
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  padding: theme.spacing(8, 0),
  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
  "@keyframes pulse": {
    "0%": { transform: "scale(1)", opacity: 1 },
    "50%": { transform: "scale(1.05)", opacity: 0.8 },
    "100%": { transform: "scale(1)", opacity: 1 },
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0px)" },
    "50%": { transform: "translateY(-10px)" },
  },
  "@keyframes fadeInUp": {
    "0%": { opacity: 0, transform: "translateY(30px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const GlassmorphismCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-12px) scale(1.02)",
    boxShadow: "0 20px 40px 0 rgba(31, 38, 135, 0.5)",
    background: "rgba(255, 255, 255, 0.15)",
  },
}));

const SectionBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
    animation: "shimmer 3s infinite",
  },
  "@keyframes shimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" },
  },
}));

const CategorySection = styled(SectionBox)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.background.paper} 0%, 
    ${theme.palette.grey[50]} 50%, 
    ${theme.palette.background.paper} 100%
  )`,
}));

const ProductSection = styled(SectionBox)(({ theme }) => ({
  background: `linear-gradient(45deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.grey[50]} 100%
  )`,
}));

const StatsSection = styled(SectionBox)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main} 0%, 
    ${theme.palette.primary.dark} 25%,
    ${theme.palette.secondary.main} 50%,
    ${theme.palette.secondary.dark} 75%,
    ${theme.palette.primary.main} 100%
  )`,
  backgroundSize: "400% 400%",
  animation: "gradientShift 8s ease infinite",
  color: "white",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.1,
  },
  "@keyframes gradientShift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

const EnhancedStatCard = styled(GlassmorphismCard)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

const FloatingElement = styled(Box)(({ theme, delay = 0 }) => ({
  position: "absolute",
  animation: `float 6s ease-in-out infinite ${delay}s`,
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px) rotate(0deg)",
    },
    "50%": {
      transform: "translateY(-30px) rotate(5deg)",
    },
  },
}));

const PulsatingDot = styled(Box)(({ theme, size = 8 }) => ({
  width: size,
  height: size,
  borderRadius: "50%",
  background: theme.palette.primary.main,
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: `0 0 0 0 ${theme.palette.primary.main}40`,
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: `0 0 0 10px ${theme.palette.primary.main}00`,
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: `0 0 0 0 ${theme.palette.primary.main}00`,
    },
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[12],
    borderColor: theme.palette.primary.main,
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  color: "white",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
  transition: "all 0.3s ease",
  "&:hover": {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    boxShadow: `0 8px 30px ${theme.palette.primary.main}60`,
    transform: "translateY(-2px)",
  },
}));

export const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
const { isAuthenticated } = useAuth();

  // Slider images data
  const sliderImages = [
    {
      url: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1750437501/slide1_zvuhld.jpg",
      alt: "Chợ đồ cũ truyền thống",
    },
    {
      url: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1750437501/slide2_b1pgxu.jpg",
      alt: "Cửa hàng thời trang second-hand",
    },
  ];

  // Hard-coded hot products data with high-quality images
  const hotProducts = [
    {
      _id: "hot1",
      name: "iPhone 14 Pro Max 256GB Deep Purple",
      price: 25000000,
      originalPrice: 30000000,
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=400&fit=crop&auto=format&q=80",
      ],
      category: "Điện tử",
      condition: "Như mới",
      location: "Hà Nội",
      seller: {
        name: "Nguyễn Văn Anh",
        rating: 4.8,
      },
      createdAt: new Date().toISOString(),
      views: 1250,
      likes: 89,
      description:
        "iPhone 14 Pro Max 256GB màu Deep Purple, còn nguyên hộp, bảo hành 6 tháng",
    },
    {
      _id: "hot2",
      name: "MacBook Air M2 2022 Midnight",
      price: 22000000,
      originalPrice: 28000000,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop&auto=format&q=80",
      ],
      category: "Laptop",
      condition: "Tốt",
      location: "TP.HCM",
      seller: {
        name: "Trần Thị Bình",
        rating: 4.9,
      },
      createdAt: new Date().toISOString(),
      views: 980,
      likes: 67,
      description: "MacBook Air M2 13 inch, 8GB RAM, 256GB SSD, màu Midnight",
    },
    {
      _id: "hot3",
      name: "Samsung Galaxy S23 Ultra 512GB",
      price: 18000000,
      originalPrice: 24000000,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=400&fit=crop&auto=format&q=80",
      ],
      category: "Điện tử",
      condition: "Như mới",
      location: "Đà Nẵng",
      seller: {
        name: "Lê Văn Cường",
        rating: 4.7,
      },
      createdAt: new Date().toISOString(),
      views: 756,
      likes: 45,
      description:
        "Samsung Galaxy S23 Ultra 512GB, màu Phantom Black, kèm S Pen",
    },
    {
      _id: "hot4",
      name: "iPad Pro 11 inch M2 Space Gray",
      price: 15000000,
      originalPrice: 20000000,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=400&fit=crop&auto=format&q=80",
      ],
      category: "Tablet",
      condition: "Tốt",
      location: "Hà Nội",
      seller: {
        name: "Phạm Thị Dung",
        rating: 4.6,
      },
      createdAt: new Date().toISOString(),
      views: 623,
      likes: 38,
      description:
        "iPad Pro 11 inch M2 WiFi 128GB, màu Space Gray, kèm Apple Pencil",
    },
  ];

  useEffect(() => {

    fetchLatestProducts();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [sliderImages.length]);





  const fetchLatestProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productService.getAllProducts({
        limit: 12,
        sort: "createdAt",
        order: "desc",
      });
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);

    fetchLatestProducts();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderCategorySkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Grid item xs={6} sm={4} md={2} key={index}>
        <Grow in timeout={500 + index * 100}>
          <Card sx={{ height: 180, borderRadius: 2 }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
                  mb: 2,
                  animation: "pulse 1.5s ease-in-out infinite alternate",
                }}
              />
              <Box
                sx={{
                  width: "80%",
                  height: 16,
                  borderRadius: 1,
                  background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
                  animation: "pulse 1.5s ease-in-out infinite alternate",
                }}
              />
            </CardContent>
          </Card>
        </Grow>
      </Grid>
    ));
  };

  const renderProductSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
        <Zoom in timeout={300 + index * 100}>
          <Card sx={{ height: 320, borderRadius: 2 }}>
            <Box
              sx={{
                height: 200,
                background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
                animation: "pulse 1.5s ease-in-out infinite alternate",
              }}
            />
            <CardContent>
              <Box
                sx={{
                  width: "100%",
                  height: 16,
                  borderRadius: 1,
                  background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
                  mb: 1,
                  animation: "pulse 1.5s ease-in-out infinite alternate",
                }}
              />
              <Box
                sx={{
                  width: "60%",
                  height: 16,
                  borderRadius: 1,
                  background: "linear-gradient(45deg, #f0f0f0, #e0e0e0)",
                  animation: "pulse 1.5s ease-in-out infinite alternate",
                }}
              />
            </CardContent>
          </Card>
        </Zoom>
      </Grid>
    ));
  };

  const statsData = [
    {
      icon: <People fontSize="large" />,
      number: "10K+",
      label: "Người dùng",
      color: theme.palette.info.main,
      description: "Cộng đồng tin tưởng",
    },
    {
      icon: <Inventory fontSize="large" />,
      number: "50K+",
      label: "Sản phẩm",
      color: theme.palette.success.main,
      description: "Đa dạng lựa chọn",
    },
    {
      icon: <CheckCircle fontSize="large" />,
      number: "25K+",
      label: "Đã bán",
      color: theme.palette.warning.main,
      description: "Giao dịch thành công",
    },
    {
      icon: <Star fontSize="large" />,
      number: "4.8",
      label: "Đánh giá",
      color: theme.palette.error.main,
      description: "Chất lượng cao",
    },
  ];

  const featuresData = [
    {
      icon: <Security fontSize="large" />,
      title: "An toàn & Bảo mật",
      description: "Giao dịch được bảo vệ với công nghệ mã hóa hiện đại",
      color: theme.palette.success.main,
    },
    {
      icon: <Speed fontSize="large" />,
      title: "Nhanh chóng",
      description: "Đăng tin và tìm kiếm sản phẩm chỉ trong vài phút",
      color: theme.palette.info.main,
    },
    {
      icon: <RecyclingOutlined fontSize="large" />,
      title: "Thân thiện môi trường",
      description: "Góp phần bảo vệ môi trường bằng việc tái sử dụng",
      color: theme.palette.success.main,
    },
    {
      icon: <Support fontSize="large" />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn",
      color: theme.palette.primary.main,
    },
  ];

  return (
    <Box>

      {isAuthenticated && (
  <button
    onClick={() => setShowCheckInModal(true)}
    style={{
      position: "fixed",
      top: "72%",
      right: "85px", 
      transform: "translateY(-50%)", 
      zIndex: 1000,
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      background: "linear-gradient(135deg, #FFD700, #FFA500)",
      color: "white",
      border: "none",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    }}
    title="Điểm danh nhận xu"
  >
    <i className="bi bi-coin" style={{ fontSize: "1.5rem" }}></i>
  </button>
)}
      {/* Hero Section - Redesigned */}
      <HeroSection>
        {/* Clean Background with Subtle Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
        linear-gradient(-45deg, #ffffff 0%, #f9fafb 25%, #f3f4f6 50%, #e5e7eb 75%, #f9fafb 100%),
        radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.03) 0%, transparent 40%),
        radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.03) 0%, transparent 40%)
      `,
            backgroundSize: "400% 400%, 100% 100%, 100% 100%",
            animation: "gradientShift 20s ease infinite",
            zIndex: 1,
            "@keyframes gradientShift": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" },
            },
          }}
        />

        {/* Geometric Decorations */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px solid",
            borderColor: "grey.200",
            opacity: 0.3,
            zIndex: 2,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "8%",
            width: 80,
            height: 80,
            borderRadius: 2,
            border: "2px solid",
            borderColor: "grey.300",
            opacity: 0.2,
            transform: "rotate(45deg)",
            zIndex: 2,
          }}
        />

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 4, py: 12 }}
        >
          <Grid container spacing={6} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={800}>
                <Box>
                  {/* Subtitle Badge */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label="Nền tảng mua bán đồ cũ"
                      size="small"
                      sx={{
                        backgroundColor: "grey.100",
                        color: "grey.700",
                        borderRadius: 2,
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  {/* Main Title */}
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                      fontWeight: 700,
                      lineHeight: 1.1,
                      color: "grey.900",
                      mb: 3,
                      "& span": {
                        color: "primary.main",
                      },
                    }}
                  >
                    Chợ Đồ Cũ
                    <br />
                    <Box component="span">Thông Minh</Box>
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1.1rem", md: "1.25rem" },
                      fontWeight: 400,
                      color: "grey.600",
                      lineHeight: 1.6,
                      mb: 4,
                      maxWidth: 500,
                    }}
                  >
                    Kết nối người mua và người bán, tạo ra giá trị mới cho những
                    món đồ cũ. An toàn, tiện lợi và thân thiện với môi trường.
                  </Typography>

                  {/* Action Buttons */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ mb: 4 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      component={Link}
                      to="/eco-market/product-list"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        },
                      }}
                    >
                      Khám phá sản phẩm
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/eco-market/post-product"
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderColor: "grey.300",
                        color: "grey.700",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "primary.50",
                        },
                      }}
                    >
                      Đăng tin bán
                    </Button>
                  </Stack>

                  {/* Trust Indicators */}
                  <Stack direction="row" spacing={4} sx={{ color: "grey.500" }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "grey.800" }}
                      >
                        10K+
                      </Typography>
                      <Typography variant="body2">Sản phẩm</Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "grey.800" }}
                      >
                        5K+
                      </Typography>
                      <Typography variant="body2">Người dùng</Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "grey.800" }}
                      >
                        4.8★
                      </Typography>
                      <Typography variant="body2">Đánh giá</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Fade>
            </Grid>

            {/* Right Content - Feature Cards */}
            <Grid item xs={12} md={6}>
              <Fade in timeout={1200}>
                <Box sx={{ position: "relative" }}>
                  {/* Main Feature Card */}
                  <Card
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                      border: "1px solid",
                      borderColor: "grey.100",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <RecyclingOutlined
                        sx={{
                          fontSize: 48,
                          color: "success.main",
                          mb: 2,
                        }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        Thân thiện môi trường
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Góp phần giảm thiểu rác thải, tái sử dụng tài nguyên một
                        cách hiệu quả
                      </Typography>
                    </Box>
                  </Card>

                  {/* Secondary Feature Cards */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                          border: "1px solid",
                          borderColor: "grey.50",
                          textAlign: "center",
                        }}
                      >
                        <Shield
                          sx={{ fontSize: 32, color: "primary.main", mb: 1 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          An toàn
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Giao dịch được bảo mật
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
                          border: "1px solid",
                          borderColor: "grey.50",
                          textAlign: "center",
                        }}
                      >
                        <Support
                          sx={{ fontSize: 32, color: "warning.main", mb: 1 }}
                        />
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          Hỗ trợ 24/7
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Chăm sóc khách hàng
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Grid>
          </Grid>

          {/* Categories Preview Only */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                color: "grey.600",
                mb: 4,
                fontWeight: 500,
              }}
            >
              Danh mục phổ biến
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {[
                { name: "Đồ điện tử", icon: "📱" },
                { name: "Thời trang", icon: "👕" },
                { name: "Nội thất", icon: "🪑" },
                { name: "Sách & Văn phòng", icon: "📚" },
                { name: "Xe cộ", icon: "🚗" },
                { name: "Khác", icon: "🎯" },
              ].map((category, index) => (
                <Grid item key={index}>
                  <Chip
                    label={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </Box>
                    }
                    variant="outlined"
                    sx={{
                      py: 2,
                      px: 1,
                      borderRadius: 2,
                      borderColor: "grey.200",
                      color: "grey.700",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        backgroundColor: "primary.50",
                        cursor: "pointer",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </HeroSection>

      {/* How It Works Section */}
      <SectionBox sx={{ py: 10, backgroundColor: "white" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 700, color: "grey.800", mb: 3 }}
            >
              🚀 Cách thức hoạt động
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.6 }}
            >
              Chỉ với 3 bước đơn giản, bạn có thể mua bán đồ cũ một cách dễ dàng
            </Typography>
          </Box>

          <Grid container spacing={6} sx={{ mt: 4 }}>
            {[
              {
                step: "01",
                title: "Đăng ký tài khoản",
                description:
                  "Tạo tài khoản miễn phí và xác thực thông tin của bạn",
                icon: "👤",
                color: "primary.main",
              },
              {
                step: "02",
                title: "Đăng tin/Tìm kiếm",
                description:
                  "Đăng tin bán hoặc tìm kiếm sản phẩm yêu thích của bạn",
                icon: "📝",
                color: "success.main",
              },
              {
                step: "03",
                title: "Giao dịch an toàn",
                description:
                  "Liên hệ và thực hiện giao dịch được bảo mật hoàn toàn",
                icon: "🤝",
                color: "warning.main",
              },
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={600 + index * 200}>
                  <Box
                    sx={{ textAlign: "center", position: "relative", px: 2 }}
                  >
                    {/* Step Number */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -15,
                        right: "50%",
                        transform: "translateX(50%)",
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        backgroundColor: item.color,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        zIndex: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {item.step}
                    </Box>

                    {/* Icon Circle */}
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        backgroundColor: "grey.50",
                        border: "4px solid",
                        borderColor: item.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "3rem",
                        mx: "auto",
                        mb: 4,
                        mt: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      {item.icon}
                    </Box>

                    {/* Content */}
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mb: 2, color: "grey.800" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "grey.600",
                        lineHeight: 1.7,
                        maxWidth: 280,
                        mx: "auto",
                      }}
                    >
                      {item.description}
                    </Typography>

                    {/* Connector Arrow */}
                    {index < 2 && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 60,
                          right: -40,
                          width: 80,
                          height: 3,
                          backgroundColor: "grey.300",
                          display: { xs: "none", md: "block" },
                          "&::after": {
                            content: '"→"',
                            position: "absolute",
                            right: -20,
                            top: -12,
                            color: "grey.400",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    )}
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionBox>

      {/* Error Display */}
      {error && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Slide direction="up" in={!!error}>
            <Alert
              severity="error"
              sx={{ borderRadius: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  startIcon={<Refresh />}
                  onClick={handleRetry}
                >
                  Thử lại
                </Button>
              }
            >
              <AlertTitle>Đã xảy ra lỗi</AlertTitle>
              {error}
            </Alert>
          </Slide>
        </Container>
      )}

      {/* Features Section */}
      <SectionBox sx={{ py: 8, background: theme.palette.background.default }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" component="h2" gutterBottom>
              Tại sao chọn chúng tôi?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Những lý do khiến hàng ngàn người dùng tin tưởng lựa chọn nền tảng
              của chúng tôi
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {featuresData.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Fade in timeout={500 + index * 200}>
                  <FeatureCard>
                    <CardContent sx={{ textAlign: "center", p: 4 }}>
                      <Avatar
                        sx={{
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 3,
                          background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                          color: feature.color,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" gutterBottom fontWeight={600}>
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        lineHeight={1.6}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionBox>

      {/* Trending Products Section */}
      <SectionBox
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.02" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.5,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Fade in timeout={600}>
            <Box textAlign="center" mb={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "grey.800",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                🔥 Sản phẩm đang hot
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Những sản phẩm được quan tâm và tìm kiếm nhiều nhất trong tuần
              </Typography>
            </Box>
          </Fade>

          {/* Hot Products Grid */}
          <Grid container spacing={3}>
            {hotProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                <Card
                  sx={{
                    position: "relative",
                    height: 400,
                    borderRadius: 2,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  {/* HOT Badge */}
                  <Chip
                    label="HOT"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 2,
                      backgroundColor: "#ff4444",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                    }}
                  />

                  {/* View Count */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      zIndex: 2,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <VisibilityOutlined sx={{ fontSize: "0.8rem" }} />
                    {product.views}
                  </Box>

                  {/* Product Image */}
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.images[0]}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />

                  {/* Product Content */}
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        mb: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product.name}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "error.main",
                          fontWeight: "bold",
                          fontSize: "1rem",
                        }}
                      >
                        {product.price.toLocaleString("vi-VN")} đ
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          fontSize: "0.8rem",
                        }}
                      >
                        {product.originalPrice.toLocaleString("vi-VN")} đ
                      </Typography>
                    </Box>

                    {/* Tags */}
                    <Box sx={{ display: "flex", gap: 0.5, mb: 1 }}>
                      <Chip
                        label={product.condition}
                        size="small"
                        sx={{ fontSize: "0.6rem", height: 20 }}
                      />
                      <Chip
                        label={product.location}
                        size="small"
                        sx={{ fontSize: "0.6rem", height: 20 }}
                      />
                    </Box>

                    {/* Seller Info */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar
                        sx={{ width: 20, height: 20, fontSize: "0.7rem" }}
                      >
                        {product.seller.name.charAt(0)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.7rem", flexGrow: 1 }}
                      >
                        {product.seller.name}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.2 }}
                      >
                        <StarOutlined
                          sx={{ fontSize: "0.8rem", color: "orange" }}
                        />
                        <Typography variant="body2" sx={{ fontSize: "0.7rem" }}>
                          {product.seller.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Favorite Button */}
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "white",
                      boxShadow: 1,
                      width: 32,
                      height: 32,
                      "&:hover": {
                        backgroundColor: "error.main",
                        color: "white",
                      },
                    }}
                  >
                    <FavoriteOutlined sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<TrendingUp />}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 2,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                  boxShadow: "0 8px 25px rgba(238, 90, 36, 0.3)",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 35px rgba(238, 90, 36, 0.4)",
                    background:
                      "linear-gradient(135deg, #ff5252 0%, #d63031 100%)",
                  },
                }}
              >
                🔥 Xem tất cả Hot Items
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Explore />}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 2,
                  borderWidth: 2,
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.2)",
                    backgroundColor: "primary.50",
                  },
                }}
              >
                Khám phá thêm
              </Button>
            </Stack>
          </Box>
        </Container>
      </SectionBox>

      {/* Latest Products Section */}
      <ProductSection>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={8}
            flexDirection={{ xs: "column", md: "row" }}
            gap={3}
          >
            <Box textAlign={{ xs: "center", md: "left" }}>
              <Typography variant="h2" component="h2" gutterBottom>
                Sản phẩm mới đăng
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Cập nhật liên tục mỗi ngày với những món đồ chất lượng nhất
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              component={Link}
              to="/eco-market"
              sx={{
                minWidth: 160,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateX(4px)",
                },
              }}
            >
              Xem tất cả
            </Button>
          </Box>

          {/* Products Grid */}
          <Grid container spacing={4}>
            {productsLoading
              ? renderProductSkeletons()
              : products?.slice(0, 8).map((product, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={product._id || index}
                  >
                    <Zoom in timeout={300 + index * 100}>
                      <Box>
                        <ProductCard product={product} />
                      </Box>
                    </Zoom>
                  </Grid>
                ))}
          </Grid>

          {/* Load More Button */}
          {products?.length > 8 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <GradientButton
                variant="outlined"
                size="large"
                component={Link}
                to="/eco-market"
                startIcon={<Visibility />}
                sx={{
                  background: "transparent",
                  border: `2px solid ${theme.palette.primary.main}`,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    background: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                Xem thêm sản phẩm
              </GradientButton>
            </Box>
          )}
        </Container>
      </ProductSection>

      {/* Statistics Section */}
      <StatsSection>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{ color: "white" }}
            >
              Thống kê ấn tượng
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "rgba(255,255,255,0.8)", maxWidth: 600, mx: "auto" }}
            >
              Những con số minh chứng cho sự tin tưởng và phát triển của cộng
              đồng
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {statsData.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Fade in timeout={500 + index * 200}>
                  <EnhancedStatCard>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 3,
                        background: `rgba(255,255,255,0.2)`,
                        color: "white",
                        fontSize: "2rem",
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      gutterBottom
                      sx={{ color: "white" }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {stat.description}
                    </Typography>
                  </EnhancedStatCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </StatsSection>

      {/* Testimonials Section */}
      <SectionBox sx={{ py: 10, background: theme.palette.background.paper }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={8}>
            <Typography variant="h2" component="h2" gutterBottom>
              Người dùng nói gì về chúng tôi
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Những phản hồi tích cực từ cộng đồng người dùng trên toàn quốc
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                name: "Nguyễn Thị Hoa",
                role: "Sinh viên",
                content:
                  "Tôi đã bán được nhiều đồ cũ và mua được những món đồ chất lượng với giá rẻ. Giao diện thân thiện, dễ sử dụng!",
                rating: 5,
                avatar: "H",
              },
              {
                name: "Trần Văn Nam",
                role: "Văn phòng",
                content:
                  "Nền tảng tuyệt vời để tìm kiếm đồ công nghệ cũ. Đã mua được laptop gaming với giá cực tốt.",
                rating: 5,
                avatar: "N",
              },
              {
                name: "Lê Thị Mai",
                role: "Chủ cửa hàng",
                content:
                  "Bán hàng trên đây rất thuận tiện. Khách hàng tin tưởng và giao dịch nhanh chóng, an toàn.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Slide direction="up" in timeout={500 + index * 200}>
                  <GlassmorphismCard sx={{ height: "100%", p: 4 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            fontSize: "1.5rem",
                            fontWeight: 600,
                          }}
                        >
                          {testimonial.avatar || testimonial.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.role}
                          </Typography>
                          <Box display="flex" mt={1}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                fontSize="small"
                                sx={{
                                  color:
                                    i < testimonial.rating
                                      ? theme.palette.warning.main
                                      : theme.palette.grey[300],
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ fontStyle: "italic", lineHeight: 1.6 }}
                      >
                        "{testimonial.content}"
                      </Typography>
                    </CardContent>
                  </GlassmorphismCard>
                </Slide>
              </Grid>
            ))}
          </Grid>
        </Container>
      </SectionBox>

      {/* Call to Action Section */}
      <SectionBox
        sx={{
          py: 12,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000" fill-opacity="0.02" fill-rule="evenodd"%3E%3Cpath d="m0 40l40-40h-40v40z"/%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center" position="relative" zIndex={2}>
            <Typography variant="h2" component="h2" gutterBottom>
              Bắt đầu hành trình của bạn
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 6, lineHeight: 1.6 }}
            >
              Tham gia cộng đồng hàng triệu người dùng đang kinh doanh và mua
              sắm thông minh
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <GradientButton
                size="large"
                startIcon={<Add />}
                component={Link}
                to="/eco-market/post-product"
                sx={{ minWidth: 250, py: 2 }}
              >
                Đăng tin ngay
              </GradientButton>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Explore />}
                component={Link}
                to="/eco-market"
                sx={{
                  minWidth: 250,
                  py: 2,
                  borderWidth: 2,
                  fontWeight: 600,
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                Tìm kiếm sản phẩm
              </Button>
            </Stack>

            <Box mt={6}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={4}
                justifyContent="center"
                alignItems="center"
                divider={<Divider orientation="vertical" flexItem />}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle color="success" />
                  <Typography variant="body1" fontWeight={500}>
                    Miễn phí đăng tin
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Security color="primary" />
                  <Typography variant="body1" fontWeight={500}>
                    Giao dịch an toàn
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Support color="info" />
                  <Typography variant="body1" fontWeight={500}>
                    Hỗ trợ tận tình
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Container>
      </SectionBox>

      {/* Floating Action Buttons */}
      <Box sx={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000 }}>
        <Stack spacing={2}>
          {/* Scroll to Top Button */}
          <Zoom in={showScrollTop}>
            <Fab
              color="primary"
              size="medium"
              onClick={scrollToTop}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  transform: "scale(1.1)",
                },
              }}
            >
              <ArrowUpward />
            </Fab>
          </Zoom>
        </Stack>
      </Box>
       <CheckInModal
        show={showCheckInModal}
        onHide={() => setShowCheckInModal(false)}
      />
    </Box>
  );
};