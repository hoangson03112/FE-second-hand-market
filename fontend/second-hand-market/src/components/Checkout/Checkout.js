import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ShoppingCart,
  Payment,
  CheckCircle,
  Home,
  Security,
  VerifiedUser,
} from "@mui/icons-material";

import { CheckoutSkeleton } from "../../pages/Cart/components/SkeletonLoader.js";

// Custom Hooks
import { useCheckoutData } from "../../hooks/useCheckoutData";
import { usePaymentCalculation } from "../../hooks/usePaymentCalculation";
import { useAddressManagement } from "../../hooks/useAddressManagement";
import { useOrderPlacement } from "../../hooks/useOrderPlacement";
import { useShippingCalculation } from "../../hooks/useShippingCalculation";

// Components
import AddressSection from "./AddressSection";
import AddressModal from "./AddressModal";
import ProductList from "./ProductList";

import PaymentMethodSection from "./PaymentMethodSection";
import PaymentSummary from "./PaymentSummary";
import CheckoutFooter from "./CheckoutFooter";

// Constants
import { SHIPPING_METHODS, PAYMENT_METHODS } from "../../constants/checkout";

const Checkout = () => {
  const location = useLocation();
  const { selectedItems } = location.state || {};

  // Existing state
  const [shippingMethod, setShippingMethod] = useState(
    SHIPPING_METHODS.EXPRESS
  );
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.COD);
  const [useCoins, setUseCoins] = useState(false);

  // Custom hooks
  const {
    products,
    sellers,
    addresses,
    loading,
    selectedAddress,
    setSelectedAddress,
    refreshAddresses,
  } = useCheckoutData(selectedItems);

  // New shipping calculation hook
  const {
    shippingData,
    loading: shippingLoading,
    error: shippingError,
    getTotalShippingFee,
    getSelectedShippingMethods,
    updateSelectedShipping,
  } = useShippingCalculation(sellers, products, selectedAddress);

  const {
    totalAmount,
    originalTotalAmount,
    totalProductSavings,
    coinDiscount,
    platformFee,
    finalAmount,
    depositAmount,
    totalSavings,
  } = usePaymentCalculation({
    products,
    useCoins,
    shippingMethod,
    paymentMethod,
    selectedShippingMethods: getSelectedShippingMethods(),
    totalShippingFee: getTotalShippingFee(),
  });

  const {
    showAddressModal,
    showNewAddressForm,
    newAddress,
    filteredProvinces,
    filteredDistricts,
    filteredWards,
    showProvinceDropdown,
    showDistrictDropdown,
    showWardDropdown,
    setShowAddressModal,
    setShowNewAddressForm,
    handleNewAddressChange,
    handleSelectProvince,
    handleSelectDistrict,
    handleSelectWard,
    handleLocationFocus,
    handleLocationBlur,
    handleAddNewAddress,
  } = useAddressManagement(refreshAddresses);

  const { isPlacingOrder, handlePlaceOrder } = useOrderPlacement({
    products,
    selectedAddress,
    shippingMethod,
    paymentMethod,
    useCoins,
    finalAmount,
    depositAmount,
    selectedShippingMethods: getSelectedShippingMethods(), // Use API-calculated methods
  });

  // Handle shipping method selection for individual shops
  const handleShippingMethodChange = (sellerId, method) => {
    updateSelectedShipping(sellerId, method.code);
  };

  // Handler functions
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressChange = (e) => {
    handleNewAddressChange(e);
  };

  const handleCoinUsageToggle = (useCoin) => {
    setUseCoins(useCoin);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!products.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 6, textAlign: "center" }}>
          <ShoppingCart sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Không có sản phẩm để thanh toán
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Bạn chưa chọn sản phẩm nào từ giỏ hàng. Hãy quay lại giỏ hàng để
            chọn sản phẩm bạn muốn mua.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Link href="/cart" underline="none">
              <Chip
                label="Quay lại giỏ hàng"
                color="primary"
                size="large"
                icon={<ShoppingCart />}
                clickable
                sx={{ px: 2, py: 1 }}
              />
            </Link>
            <Link href="/" underline="none">
              <Chip
                label="Về trang chủ"
                variant="outlined"
                size="large"
                icon={<Home />}
                clickable
                sx={{ px: 2, py: 1 }}
              />
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        py: 3,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Simple Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="text.primary"
            gutterBottom
          >
            Thanh toán
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hoàn tất đơn hàng của bạn
          </Typography>
        </Box>

        {/* Breadcrumb */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs separator="›">
            <Link
              href="/"
              color="inherit"
              underline="hover"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <Home sx={{ fontSize: 16 }} />
              Trang chủ
            </Link>
            <Link
              href="/cart"
              color="inherit"
              underline="hover"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <ShoppingCart sx={{ fontSize: 16 }} />
              Giỏ hàng
            </Link>
            <Typography
              color="primary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontWeight: "500",
              }}
            >
              <Payment sx={{ fontSize: 16 }} />
              Thanh toán
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Shipping Error Alert */}
        {shippingError && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="warning" variant="outlined">
              <Typography variant="body2">
                <strong>Cảnh báo:</strong> {shippingError}. Hệ thống đang sử
                dụng phí vận chuyển mặc định.
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Address Section */}
          <Grid item xs={12}>
            <AddressSection
              selectedAddress={selectedAddress}
              onChangeAddress={() => setShowAddressModal(true)}
            />
          </Grid>

          {/* Products by Shop with Shipping Calculation */}
          <Grid item xs={12}>
            <ProductList
              products={products}
              sellers={sellers}
              deliveryAddress={selectedAddress}
              onShippingMethodChange={handleShippingMethodChange}
              selectedShippingMethods={getSelectedShippingMethods()}
              shippingData={shippingData}
              shippingLoading={shippingLoading}
            />
          </Grid>

          {/* Payment Method Section */}
          <Grid item xs={12}>
            <PaymentMethodSection
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              shippingFee={getTotalShippingFee()}
              finalAmount={finalAmount}
            />
          </Grid>

          {/* Payment Summary */}
          <Grid item xs={12}>
            <PaymentSummary
              totalAmount={totalAmount}
              originalTotalAmount={originalTotalAmount}
              totalProductSavings={totalProductSavings}
              totalSavings={totalSavings}
              useCoins={useCoins}
              onCoinUsageToggle={handleCoinUsageToggle}
              coinDiscount={coinDiscount}
              shippingMethod={shippingMethod}
              shippingFee={getTotalShippingFee()}
              platformFee={platformFee}
              finalAmount={finalAmount}
              paymentMethod={paymentMethod}
              depositAmount={depositAmount}
            />
          </Grid>

          {/* Checkout Footer */}
          <Grid item xs={12}>
            <CheckoutFooter
              onPlaceOrder={handlePlaceOrder}
              isLoading={isPlacingOrder}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Address Modal */}
      <AddressModal
        show={showAddressModal}
        onHide={() => {
          setShowAddressModal(false);
          setShowNewAddressForm(false);
        }}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={handleSelectAddress}
        showNewAddressForm={showNewAddressForm}
        onToggleNewAddressForm={setShowNewAddressForm}
        onAddNewAddress={handleAddNewAddress}
        addressFormProps={{
          newAddress,
          onAddressChange: handleAddressChange,
          onSelectProvince: handleSelectProvince,
          onSelectDistrict: handleSelectDistrict,
          onSelectWard: handleSelectWard,
          onLocationFocus: handleLocationFocus,
          onLocationBlur: handleLocationBlur,
          filteredProvinces,
          filteredDistricts,
          filteredWards,
          showProvinceDropdown,
          showDistrictDropdown,
          showWardDropdown,
        }}
        onAddressAdded={handleSelectAddress}
      />
    </Box>
  );
};

export default Checkout;
