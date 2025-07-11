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
import { useCoin } from "../../contexts/CoinProvider";
import { SHIPPING_METHODS, PAYMENT_METHODS } from "../../constants/checkout";
import { formatPrice } from "../../utils/checkoutUtils";

const SummaryRow = ({
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

const CoinUsageSection = ({
  useCoins,
  onCoinUsageToggle,
  coinDiscount,
  balance,
}) => {
  if (balance <= 0) return null;

  return (
    <Box sx={{ my: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={useCoins}
            onChange={(e) => onCoinUsageToggle(e.target.checked)}
          />
        }
        label={`Sử dụng ${formatPrice(balance)} xu có sẵn (tiết kiệm 30%)`}
      />
      {useCoins && coinDiscount > 0 && (
        <Box sx={{ mt: 1, pl: 4 }}>
          <SummaryRow
            label="Tiết kiệm từ xu"
            amount={-coinDiscount}
            isPositive={true}
          />
        </Box>
      )}
    </Box>
  );
};

const PaymentMethodSummary = ({
  paymentMethod,
  finalAmount,
  depositAmount,
  shippingFee,
}) => {
  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case PAYMENT_METHODS.COD:
        return {
          title: "Thanh toán khi nhận hàng (COD)",
          breakdown: [
            { label: "Thanh toán ngay:", amount: 0 },
            { label: "COD khi nhận:", amount: finalAmount },
          ],
          subtitle: "Kiểm tra hàng trước khi thanh toán",
          icon: <AccountBalanceWallet />,
        };
      case PAYMENT_METHODS.BANK_TRANSFER:
        return {
          title: "Chuyển khoản 100%",
          breakdown: [
            { label: "Chuyển khoản ngay:", amount: finalAmount },
            { label: "COD khi nhận:", amount: 0 },
          ],
          subtitle: "Giao hàng nhanh, không cần COD",
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

const PaymentSummary = ({
  totalAmount,
  originalTotalAmount,
  totalProductSavings,
  totalSavings,
  voucherDiscount,
  useCoins,
  onCoinUsageToggle,
  coinDiscount,
  shippingMethod,
  shippingFee,
  finalAmount,
  paymentMethod,
  depositAmount,
}) => {
  const { balance } = useCoin();

  return (
    <Paper
      elevation={1}
      sx={{ p: 4, backgroundColor: "white", borderRadius: 2 }}
    >
      <Typography variant="h6" component="h2" fontWeight="600" sx={{ mb: 3 }}>
        Chi tiết thanh toán
      </Typography>

      <Box>
        {/* Show original total if there are product discounts */}
        {totalProductSavings > 0 && (
          <SummaryRow
            label="Tổng tiền hàng (gốc)"
            amount={originalTotalAmount}
          />
        )}

        {totalProductSavings > 0 && (
          <SummaryRow
            label="Giảm giá sản phẩm"
            amount={-totalProductSavings}
            isPositive={true}
          />
        )}

        <SummaryRow
          label={
            totalProductSavings > 0 ? "Tổng sau giảm giá" : "Tổng tiền hàng"
          }
          amount={totalAmount}
          isBold={totalProductSavings > 0}
        />

        {voucherDiscount > 0 && (
          <SummaryRow
            label="Voucher giảm giá"
            amount={-voucherDiscount}
            isPositive={true}
          />
        )}

        <CoinUsageSection
          useCoins={useCoins}
          onCoinUsageToggle={onCoinUsageToggle}
          coinDiscount={coinDiscount}
          balance={balance}
        />

        {shippingMethod !== SHIPPING_METHODS.DIRECT && (
          <SummaryRow label="Phí vận chuyển" amount={shippingFee} />
        )}

        {totalSavings > 0 && (
          <Box
            sx={{
              my: 2,
              p: 2,
              backgroundColor: "primary.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "primary.200",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Savings sx={{ mr: 1, color: "primary.main", fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  color="primary.main"
                  fontWeight="600"
                >
                  Tổng tiết kiệm
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                color="primary.main"
                fontWeight="bold"
              >
                {formatPrice(totalSavings)}₫
              </Typography>
            </Box>
          </Box>
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
        depositAmount={depositAmount}
        shippingFee={shippingFee}
      />
    </Paper>
  );
};

export default PaymentSummary;
