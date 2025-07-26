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

// Custom Hooks
import { useCheckoutData } from "../../hooks/useCheckoutData";
import { useAddressManagement } from "../../hooks/useAddressManagement";
import { useOrderPlacement } from "../../hooks/useOrderPlacement";
import { useShippingCalculation } from "../../hooks/useShippingCalculation";
import { useOrderTypeCalculation } from "../../hooks/useOrderTypeCalculation";
import { usePersonalDiscount } from "../../contexts/PersonalDiscountContext";
import { applyPersonalDiscountsToProducts } from "../../utils/checkoutUtils";

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

  const { discounts } = usePersonalDiscount();
  const productsWithDiscount = applyPersonalDiscountsToProducts(products, discounts);

  // Tính toán tổng tiền hàng, tiết kiệm, tổng sau giảm giá, ...
  let originalTotalAmount = 0;
  let totalAmount = 0;
  let totalProductSavings = 0;
  productsWithDiscount.forEach(product => {
    const original = product.originalPrice || product.price;
    originalTotalAmount += original * product.quantity;
    totalAmount += product.price * product.quantity;
    totalProductSavings += (original - product.price) * product.quantity;
  });
  const totalSavings = totalProductSavings;
  const finalAmount = totalAmount + (getTotalShippingFee() || 0); 

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

  const { isPlacingOrder, handlePlaceOrder: originalHandlePlaceOrder } =
    useOrderPlacement(products);

  const {
    directMeetingCount,
    codShippingCount,
    bankTransferCount,
    totalOrders,
    hasMixedOrders,
    directMeetingProducts,
    codShippingProducts,
    bankTransferProducts,
    directMeetingAmount,
    codShippingAmount,
    bankTransferAmount,
    directMeetingOriginalAmount,
    codShippingOriginalAmount,
    bankTransferOriginalAmount,
    directMeetingSavings,
    codShippingSavings,
    bankTransferSavings,
    getCodShippingFee,
  } = useOrderTypeCalculation(
    products,
    getSelectedShippingMethods(),
    paymentMethod
  );

  // Wrapper function for place order
  const handlePlaceOrder = async () => {
    await originalHandlePlaceOrder({
      products,
      finalAmount,
      shippingMethod,
      selectedAddress,
      selectedVoucher: null,
      selectedShippingMethods: getSelectedShippingMethods(),
      paymentMethod,
    });
  };

  // Handle shipping method selection for individual shops
  const handleShippingMethodChange = (sellerId, method) => {
    updateSelectedShipping(sellerId, method.code);
  };

  // Check if any order uses COD delivery (ship-cod)
  const hasShipCodOrders = () => {
    const selectedMethods = getSelectedShippingMethods();
    return Object.values(selectedMethods).some(
      (method) => method.id === "ship-cod"
    );
  };

  // Handler functions
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  const handleAddressChange = (e) => {
    handleNewAddressChange(e);
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
            <Link href="/my-cart" underline="none">
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
              href="/my-cart"
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

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <AddressSection
              selectedAddress={selectedAddress}
              onChangeAddress={() => setShowAddressModal(true)}
            />
          </Grid>

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

          {/* Mixed Order Info - Show if there are different order types */}
          {hasMixedOrders && (
            <Grid item xs={12}>
              {/* XÓA: <MixedOrderInfo
                directMeetingCount={directMeetingCount}
                codShippingCount={codShippingCount}
                bankTransferCount={bankTransferCount}
              /> */}
            </Grid>
          )}

          {/* Payment Method Section - Only show if there are COD orders */}
          {hasShipCodOrders() && (
            <Grid item xs={12}>
              <PaymentMethodSection
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                shippingFee={getTotalShippingFee()}
                finalAmount={finalAmount}
                codShippingAmount={codShippingAmount}
                codShippingOriginalAmount={codShippingOriginalAmount}
                hasMixedOrders={hasMixedOrders}
              />
            </Grid>
          )}

          {/* Payment Summary */}
          <Grid item xs={12}>
            <PaymentSummary
              products={productsWithDiscount}
              originalTotalAmount={originalTotalAmount}
              totalAmount={totalAmount}
              totalProductSavings={totalProductSavings}
              totalSavings={totalSavings}
              shippingMethod={shippingMethod}
              shippingFee={getTotalShippingFee()}
              finalAmount={finalAmount}
              voucherDiscount={0} // hoặc giá trị thực tế nếu có
              hasMixedOrders={hasMixedOrders}
              directMeetingCount={directMeetingCount}
              codShippingCount={codShippingCount}
              bankTransferCount={bankTransferCount}
              directMeetingAmount={directMeetingAmount}
              codShippingAmount={codShippingAmount}
              bankTransferAmount={bankTransferAmount}
              directMeetingOriginalAmount={directMeetingOriginalAmount}
              codShippingOriginalAmount={codShippingOriginalAmount}
              bankTransferOriginalAmount={bankTransferOriginalAmount}
              directMeetingSavings={directMeetingSavings}
              codShippingSavings={codShippingSavings}
              bankTransferSavings={bankTransferSavings}
              codShippingFee={getCodShippingFee()}
            />
          </Grid>

          {/* Checkout Footer */}
          <Grid item xs={12}>
            <CheckoutFooter
              onPlaceOrder={handlePlaceOrder}
              isLoading={isPlacingOrder}
              hasPaymentOrders={hasShipCodOrders()}
              finalAmount={finalAmount}
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
