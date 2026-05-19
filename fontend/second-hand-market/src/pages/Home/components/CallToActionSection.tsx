import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import {
  Add,
  Explore,
  CheckCircle,
  Security,
  Support,
} from "@mui/icons-material";
import { SectionBox, GradientButton } from "./StyledComponents";

const CallToActionSection = () => {
  const theme = useTheme();

  return (
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
            Tham gia cộng đồng hàng triệu người dùng đang kinh doanh và mua sắm
            thông minh
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
  );
};

export default CallToActionSection;
