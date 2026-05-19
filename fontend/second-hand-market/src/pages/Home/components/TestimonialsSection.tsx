import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CardContent,
  Avatar,
  Slide,
  useTheme,
} from "@mui/material";
import { Star } from "@mui/icons-material";
import { SectionBox, GlassmorphismCard } from "./StyledComponents";

const TestimonialsSection = () => {
  const theme = useTheme();

  const testimonials = [
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
  ];

  return (
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
          {testimonials.map((testimonial, index) => (
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
  );
};

export default TestimonialsSection;
