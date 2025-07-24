import { useMemo } from "react";
import { useCoin } from "../contexts/CoinProvider";
import { SHIPPING_METHODS, PAYMENT_METHODS } from "../constants/checkout";
import {
  calculateProductDiscount,
  calculateTotalWithDiscounts,
} from "../utils/checkoutUtils";

export const usePaymentCalculation = ({
  products = [],
  selectedVoucher = null,
  shippingMethod = SHIPPING_METHODS.EXPRESS,
  paymentMethod = PAYMENT_METHODS.COD,
  selectedShippingMethods = {},
}) => {
  // Xóa mọi logic liên quan đến coin/xu trong hook này

  const calculations = useMemo(() => {
    const productTotals = calculateTotalWithDiscounts(products);
    const totalAmount = productTotals.finalTotal;
    const originalTotalAmount = productTotals.originalTotal;
    const totalProductSavings = productTotals.totalSavings;

    let voucherDiscount = 0;
    if (selectedVoucher) {
      if (selectedVoucher.discountType === "percentage") {
        voucherDiscount = Math.min(
          (totalAmount * selectedVoucher.discountValue) / 100,
          selectedVoucher.maxDiscount || Infinity
        );
      } else {
        voucherDiscount = Math.min(selectedVoucher.discountValue, totalAmount);
      }
    }

    // Calculate multi-shop shipping fee
    let shippingFee = 0;
    if (shippingMethod !== SHIPPING_METHODS.DIRECT) {
      // Sum up shipping fees from all selected shipping methods
      shippingFee = Object.values(selectedShippingMethods).reduce(
        (total, method) => total + (method?.fee || 0),
        0
      );

      // Fallback to default shipping if no methods selected
      if (
        shippingFee === 0 &&
        Object.keys(selectedShippingMethods).length === 0
      ) {
        // Group products by seller and calculate default shipping
        const sellerGroups = products.reduce((groups, product) => {
          const sellerId = product.seller._id;
          if (!groups[sellerId]) {
            groups[sellerId] = [];
          }
          groups[sellerId].push(product);
          return groups;
        }, {});

        // Default shipping per seller
        const defaultShippingPerSeller =
          shippingMethod === SHIPPING_METHODS.EXPRESS ? 35000 : 25000;
        shippingFee =
          Object.keys(sellerGroups).length * defaultShippingPerSeller;
      }
    }

    // Calculate final amount
    const finalAmount = Math.max(
      0,
      totalAmount - voucherDiscount + shippingFee
    );
    // Calculate deposit amount based on payment method
    let depositAmount = 0;
    switch (paymentMethod) {
      case PAYMENT_METHODS.COD:
        depositAmount = 0; // No upfront payment for COD
        break;
      case PAYMENT_METHODS.BANK_TRANSFER:
        depositAmount = finalAmount; // Full payment upfront for bank transfer
        break;
      default:
        depositAmount = 0;
    }

    return {
      totalAmount,
      originalTotalAmount,
      totalProductSavings,
      voucherDiscount,
      shippingFee,
      finalAmount,
      depositAmount,
      numberOfShops:
        Object.keys(selectedShippingMethods).length ||
        new Set(products.map((p) => p.seller._id)).size,
      shippingBreakdown: selectedShippingMethods,

      totalSavings: totalProductSavings + voucherDiscount,
    };
  }, [
    products,
    selectedVoucher,
    shippingMethod,
    paymentMethod,
    selectedShippingMethods,
  ]);

  return calculations;
};
