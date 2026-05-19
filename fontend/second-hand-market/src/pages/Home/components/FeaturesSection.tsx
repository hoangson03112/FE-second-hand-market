import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CardContent,
  Avatar,
  Fade,
  useTheme,
} from "@mui/material";
import {
  Security,
  Speed,
  Support,
  RecyclingOutlined,
} from "@mui/icons-material";
import { SectionBox, FeatureCard } from "./StyledComponents";

const FeaturesSection = () => {
  const theme = useTheme();

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
            Những lý do khiến hàng ngàn người dùng tin tưởng lựa chọn nền tảng của
            chúng tôi
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
  );
};

export default FeaturesSection;
