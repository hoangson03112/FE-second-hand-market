import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import productService from "../../services/productService";
import {
  HeroSection,
  HowItWorksSection,
  FeaturesSection,
  ProductsSection,
  StatisticsSection,
  TestimonialsSection,
  CallToActionSection,
  ScrollToTopButton,
  ErrorDisplay,
} from "./components";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchLatestProducts();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <Box>
      {/* Hero Section - Main landing area */}
      <HeroSection />

      {/* How It Works Section - 3 step process */}
      <HowItWorksSection />

      {/* Error Display */}
      <ErrorDisplay error={error} onRetry={handleRetry} />

      {/* Features Section - Why choose us */}
      <FeaturesSection />

      {/* Products Section - Latest products */}
      <ProductsSection products={products} loading={productsLoading} />



      {/* Testimonials Section - User feedback */}
      <TestimonialsSection />


      {/* Scroll to Top Button */}
      <ScrollToTopButton show={showScrollTop} />
    </Box>
  );
};
