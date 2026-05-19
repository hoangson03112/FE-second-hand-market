import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Zoom,
  useTheme,
} from "@mui/material";
import { ArrowForward, Visibility } from "@mui/icons-material";
import ProductCard from "../../../components/common/ProductCard/ProductCard";
import { ProductSection as ProductSectionStyled, GradientButton } from "./StyledComponents";

const ProductsSection = ({ products, loading }) => {
  const theme = useTheme();

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

  return (
    <ProductSectionStyled>
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
          {loading
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
    </ProductSectionStyled>
  );
};

export default ProductsSection;
