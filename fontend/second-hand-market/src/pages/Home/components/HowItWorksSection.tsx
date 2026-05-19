import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Fade,
} from "@mui/material";
import { SectionBox } from "./StyledComponents";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Đăng ký tài khoản",
      description: "Tạo tài khoản miễn phí và xác thực thông tin của bạn",
      icon: "👤",
      color: "primary.main",
    },
    {
      step: "02",
      title: "Đăng tin/Tìm kiếm",
      description: "Đăng tin bán hoặc tìm kiếm sản phẩm yêu thích của bạn",
      icon: "📝",
      color: "success.main",
    },
    {
      step: "03",
      title: "Giao dịch an toàn",
      description: "Liên hệ và thực hiện giao dịch được bảo mật hoàn toàn",
      icon: "🤝",
      color: "warning.main",
    },
  ];

  return (
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
          {steps.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Fade in timeout={600 + index * 200}>
                <Box sx={{ textAlign: "center", position: "relative", px: 2 }}>
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
  );
};

export default HowItWorksSection;
