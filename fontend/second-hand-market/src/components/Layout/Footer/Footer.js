// @flow
import React from "react";
import { Box, Container, Grid, Typography, Link, Stack, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: "#222", color: "#b0b0b0", pt: 5, pb: 2, fontSize: 14 }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Cột 1: Logo & mô tả */}
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Box
                component="img"
                src="/images/logi.png"
                alt="Logo"
                sx={{ width: 48, height: 48, bgcolor: "#fff", borderRadius: 2, p: 0.5 }}
              />
              <Typography variant="h6" fontWeight={700} color="#fff" sx={{ fontSize: 20 }}>
                Eco-Market
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#b0b0b0", fontSize: 13, mb: 2 }}>
              Nền tảng mua bán đồ cũ uy tín, kết nối người mua và người bán trên toàn quốc.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="inherit" href="https://facebook.com" target="_blank" rel="noopener" size="small">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton color="inherit" href="mailto:support@example.com" size="small">
                <EmailIcon fontSize="small" />
              </IconButton>
              <IconButton color="inherit" href="tel:0123456789" size="small">
                <PhoneIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>

          {/* Cột 2: Liên kết nhanh */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 1, textTransform: "uppercase" }}>
              Liên kết nhanh
            </Typography>
            <Stack spacing={0.5}>
              <Link href="/eco-market/about" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Giới thiệu
              </Link>
              <Link href="/eco-market/policy" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Chính sách
              </Link>
              <Link href="/eco-market/terms" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Điều khoản
              </Link>
            </Stack>
          </Grid>

          {/* Cột 3: Tin tức */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 1, textTransform: "uppercase" }}>
              Tin tức
            </Typography>
            <Stack spacing={0.5}>
              <Link href="/eco-market/news" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Tin tức
              </Link>
            </Stack>
          </Grid>

          {/* Cột 4: Hỗ trợ khách hàng */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 1, textTransform: "uppercase" }}>
              Hỗ trợ khách hàng
            </Typography>
            <Stack spacing={0.5}>
              <Link href="/eco-market/contact" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Liên hệ hỗ trợ
              </Link>
              <Link href="/eco-market/faq" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Câu hỏi thường gặp
              </Link>
              <Link href="/eco-market/guide" color="inherit" underline="hover" sx={{ fontSize: 13 }}>
                Hướng dẫn mua bán
              </Link>
            </Stack>
          </Grid>

          {/* Cột 5: Thông tin liên hệ */}
          <Grid item xs={6} sm={6} md={3}>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: 13, mb: 1, textTransform: "uppercase" }}>
              Thông tin liên hệ
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                123 Đường ABC, Quận 1, TP.HCM
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                0123 456 789
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 13 }}>
                support@example.com
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: "#333", my: 3 }} />
        <Typography variant="body2" align="center" sx={{ color: "#888", fontSize: 12 }}>
          © 2024 Eco-Market. Mọi quyền được bảo lưu.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
