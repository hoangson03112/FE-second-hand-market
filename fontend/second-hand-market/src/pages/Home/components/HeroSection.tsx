import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  Stack,
  Fade,
} from "@mui/material";
import { Shield, Support, RecyclingOutlined } from "@mui/icons-material";
import { HeroSection as HeroSectionStyled } from "./StyledComponents";

const HeroSection = () => {
  return (
    <HeroSectionStyled>
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
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 4, py: 12 }}>
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
                  Kết nối người mua và người bán, tạo ra giá trị mới cho những món
                  đồ cũ. An toàn, tiện lợi và thân thiện với môi trường.
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
                      Góp phần giảm thiểu rác thải, tái sử dụng tài nguyên một cách
                      hiệu quả
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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

        {/* Categories Preview */}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
    </HeroSectionStyled>
  );
};

export default HeroSection;
