import React from "react";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip,
} from "@mui/material";
import {
  AccountBalanceWallet,
  CreditCard,
  CheckCircle,
  LocalShipping,
  Security,
  Speed,
} from "@mui/icons-material";
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_CONFIG,
} from "../../constants/checkout";
import { formatPrice } from "../../utils/checkoutUtils";

const PaymentOption = ({
  method,
  config,
  isSelected,
  onSelect,
  shippingFee,
  finalAmount,
  codShippingAmount,
  hasMixedOrders,
}) => {

  // Use COD shipping amount if mixed orders, otherwise use full amount
  // Add shipping fee to COD shipping amount for mixed orders
  const displayAmount = hasMixedOrders ? (codShippingAmount + shippingFee) : finalAmount;

  const getBreakdownData = () => {
    switch (method) {
      case PAYMENT_METHODS.COD:
        return {
          immediate: {
            label: "Thanh toán ngay:",
            amount: 0,
            sublabel: hasMixedOrders ? "Chỉ tính cho đơn ship COD" : "Không cần trả trước",
          },
          cod: {
            label: "Thanh toán khi nhận:",
            amount: displayAmount,
            sublabel: hasMixedOrders ? "Chỉ áp dụng cho đơn ship COD" : "Tổng tiền hàng + phí ship",
          },
        };
      case PAYMENT_METHODS.BANK_TRANSFER:
        return {
          immediate: {
            label: "Chuyển khoản ngay:",
            amount: displayAmount,
            sublabel: hasMixedOrders ? "Chỉ áp dụng cho đơn ship COD" : "Tổng đơn hàng + phí ship",
          },
          cod: {
            label: "COD khi nhận:",
            amount: 0,
            sublabel: hasMixedOrders ? "Đã thanh toán trước cho đơn ship COD" : "Đã thanh toán trước",
          },
        };
      default:
        return null;
    }
  };

  const breakdown = getBreakdownData();

  return (
    <Card
      variant="outlined"
      sx={{
        cursor: "pointer",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        border: "2px solid",
        borderColor: isSelected ? "primary.main" : "grey.300",
        backgroundColor: isSelected ? "grey.50" : "white",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 1,
        },
      }}
      onClick={() => onSelect(method)}
    >
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {method === PAYMENT_METHODS.COD ? (
              <AccountBalanceWallet
                sx={{
                  mr: 2,
                  color: "text.primary",
                  fontSize: 28,
                  p: 0.5,
                  borderRadius: 1,
                  backgroundColor: "grey.100",
                }}
              />
            ) : (
              <CreditCard
                sx={{
                  mr: 2,
                  color: "text.primary",
                  fontSize: 28,
                  p: 0.5,
                  borderRadius: 1,
                  backgroundColor: "grey.100",
                }}
              />
            )}
            <Box>
              <Typography variant="h6" fontWeight="600">
                {config.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {method === PAYMENT_METHODS.COD
                  ? "Thanh toán khi nhận hàng"
                  : "Chuyển khoản ngân hàng"}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={config.badge.text}
            color="default"
            variant={isSelected ? "filled" : "outlined"}
          />
        </Box>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {config.description}
        </Typography>

        {/* Payment Breakdown */}
        {breakdown && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ p: 1.5, backgroundColor: "grey.50", borderRadius: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2">
                  {breakdown.immediate.label}
                </Typography>
                <Typography
                  variant="body2"
                  color={
                    breakdown.immediate.amount > 0
                      ? "primary.main"
                      : "text.primary"
                  }
                  fontWeight="bold"
                >
                  {formatPrice(breakdown.immediate.amount)}₫
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {breakdown.immediate.sublabel}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2">{breakdown.cod.label}</Typography>
                <Typography
                  variant="body2"
                  color={
                    breakdown.cod.amount > 0 ? "primary.main" : "text.primary"
                  }
                  fontWeight="bold"
                >
                  {formatPrice(breakdown.cod.amount)}₫
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {breakdown.cod.sublabel}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Benefits */}
        <List dense sx={{ p: 0 }}>
          {config.benefits?.slice(0, 3).map((benefit, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle sx={{ fontSize: 16, color: "text.secondary" }} />
              </ListItemIcon>
              <ListItemText
                primary={benefit}
                primaryTypographyProps={{ variant: "body2" }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const PaymentMethodSection = ({
  paymentMethod,
  onPaymentMethodChange,
  shippingFee,
  finalAmount,
  codShippingAmount,
  codShippingOriginalAmount,
  hasMixedOrders,
}) => {
  return (
    <Paper
      elevation={1}
      sx={{ p: 4, backgroundColor: "white", borderRadius: 2 }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <CreditCard sx={{ mr: 2, color: "text.primary", fontSize: 24 }} />
        <Box>
          <Typography variant="h6" component="h2" fontWeight="600">
            Phương thức thanh toán
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hasMixedOrders 
              ? "Chọn phương thức thanh toán cho các đơn hàng ship COD"
              : "Chọn cách thức thanh toán phù hợp với bạn"
            }
          </Typography>
        </Box>
      </Box>

      {/* Mixed Order Notice */}
      {hasMixedOrders && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" variant="outlined">
            <Typography variant="body2">
              <strong>Lưu ý:</strong> Phương thức thanh toán này chỉ áp dụng cho các đơn hàng 
              <strong> ship COD</strong>. Các đơn hàng giao dịch trực tiếp sẽ thanh toán khi gặp mặt.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Payment Options */}
      <RadioGroup
        value={paymentMethod}
        onChange={(e) => onPaymentMethodChange(e.target.value)}
      >
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          }}
        >
          {[PAYMENT_METHODS.COD, PAYMENT_METHODS.BANK_TRANSFER].map(
            (method) => (
              <FormControlLabel
                key={method}
                value={method}
                control={<Radio sx={{ display: "none" }} />}
                label={
                  <PaymentOption
                    method={method}
                    config={PAYMENT_METHOD_CONFIG[method]}
                    isSelected={paymentMethod === method}
                    onSelect={onPaymentMethodChange}
                    shippingFee={shippingFee}
                    finalAmount={finalAmount}
                    codShippingAmount={codShippingAmount}
                    hasMixedOrders={hasMixedOrders}
                  />
                }
                sx={{ margin: 0, width: "100%" }}
              />
            )
          )}
        </Box>
      </RadioGroup>

      {/* Additional Information */}
      <Box sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>Lưu ý:</strong> Phí vận chuyển có thể thay đổi tùy theo địa
          chỉ giao hàng và phương thức vận chuyển được chọn.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PaymentMethodSection;
