import React from "react";
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import { AccountBalanceWallet, CreditCard, Savings } from "@mui/icons-material";
import { SHIPPING_METHODS, PAYMENT_METHODS } from "../../constants/checkout";
import { formatPrice } from "../../utils/checkoutUtils";
import { 
  SummaryRowProps, 
  PaymentMethodSummaryProps, 
  PaymentSummaryMainProps 
} from "./types/PaymentSummary.types";

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  amount,
  isPositive = false,
  isBold = false,
  isTotal = false,
}) => {
  const color = isTotal
    ? "primary.main"
    : isPositive
    ? "text.primary"
    : "text.primary";
  const fontWeight = isTotal || isBold ? "600" : "400";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 0.5,
      }}
    >
      <Typography variant="body2" color="text.primary">
        {label}
      </Typography>
      <Typography variant="body2" color={color} fontWeight={fontWeight}>
        {formatPrice(amount)}₫
      </Typography>
    </Box>
  );
};

const PaymentMethodSummary: React.FC<PaymentMethodSummaryProps> = ({
  paymentMethod,
  finalAmount,
  shippingFee,
  hasMixedOrders,
  codShippingAmount,
}) => {
  const getPaymentMethodDisplay = () => {
    // Use COD shipping amount if mixed orders, otherwise use full amount
    // Add shipping fee to COD shipping amount for mixed orders
    const displayAmount = hasMixedOrders ? (codShippingAmount + shippingFee) : finalAmount;

    switch (paymentMethod) {
      case PAYMENT_METHODS.COD:
        return {
          title: hasMixedOrders
            ? "Thanh toán COD (chỉ đơn ship)"
            : "Thanh toán khi nhận hàng (COD)",
          breakdown: [
            { label: "Thanh toán ngay:", amount: 0 },
            { label: "COD khi nhận:", amount: displayAmount },
          ],
          subtitle: hasMixedOrders
            ? "Chỉ áp dụng cho đơn hàng ship COD"
            : "Kiểm tra hàng trước khi thanh toán",
          icon: <AccountBalanceWallet />,
        };
      case PAYMENT_METHODS.BANK_TRANSFER:
        return {
          title: hasMixedOrders
            ? "Chuyển khoản (chỉ đơn ship)"
            : "Chuyển khoản 100%",
          breakdown: [
            { label: "Chuyển khoản ngay:", amount: displayAmount },
            { label: "COD khi nhận:", amount: 0 },
          ],
          subtitle: hasMixedOrders
            ? "Chỉ áp dụng cho đơn hàng ship COD"
            : "Giao hàng nhanh, không cần COD",
          icon: <CreditCard />,
        };
      default:
        return null;
    }
  };

  const paymentDisplay = getPaymentMethodDisplay();
  if (!paymentDisplay) return null;

  return (
    <Box sx={{ mt: 3, p: 2, backgroundColor: "grey.50", borderRadius: 1 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ mr: 2, color: "text.primary" }}>{paymentDisplay.icon}</Box>
        <Typography variant="subtitle1" fontWeight="600">
          {paymentDisplay.title}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        {paymentDisplay.breakdown?.map((item, index) => (
          <Box
            key={index}
            sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}
          >
            <Typography variant="body2">{item.label}</Typography>
            <Typography
              variant="body2"
              color={item.amount > 0 ? "primary.main" : "text.primary"}
              fontWeight="600"
            >
              {formatPrice(item.amount)}₫
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary">
        {paymentDisplay.subtitle}
      </Typography>
    </Box>
  );
};

const PaymentSummary: React.FC<PaymentSummaryMainProps> = ({
  products,
  shippingMethod,
  shippingFee,
  finalAmount: finalAmountProp,
  paymentMethod,
  depositAmount,
  hasMixedOrders,
  codShippingAmount,
}) => {

  let totalAmount = 0;
  let totalProductSavings = 0;
  products.forEach((product: any) => {
    const original = product.originalPrice || product.price;
    const price = product.price;
    totalAmount += price * product.quantity;
    totalProductSavings += (original - price) * product.quantity;
  });
  const finalAmount = finalAmountProp !== undefined ? finalAmountProp : totalAmount;

  return (
    <Paper
      elevation={1}
      sx={{ p: 4, backgroundColor: "white", borderRadius: 2 }}
    >
      <Typography variant="h6" component="h2" fontWeight="600" sx={{ mb: 3 }}>
        Chi tiết thanh toán
      </Typography>

      <Box>


 

        <SummaryRow
          label={
            totalProductSavings > 0 ? "Tổng tiền hàng" : "Tổng tiền hàng"
          }
          amount={totalAmount}
          isBold={totalProductSavings > 0}
        />



        {shippingMethod !== SHIPPING_METHODS.DIRECT && (
          <SummaryRow label="Phí vận chuyển" amount={shippingFee} />
        )}

   

        <Divider sx={{ my: 2 }} />

        <SummaryRow
          label="Số tiền cần thanh toán"
          amount={finalAmount}
          isTotal={true}
        />
      </Box>

      <PaymentMethodSummary
        paymentMethod={paymentMethod}
        finalAmount={finalAmount}
        shippingFee={shippingFee}
        hasMixedOrders={hasMixedOrders}
        codShippingAmount={codShippingAmount}
      />
    </Paper>
  );
};

export default PaymentSummary;
