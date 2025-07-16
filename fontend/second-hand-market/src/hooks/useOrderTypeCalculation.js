import { useMemo, useCallback } from "react";
import { groupProductsBySeller, calculateTotalWithDiscounts } from "../utils/checkoutUtils";

export const useOrderTypeCalculation = (products, selectedShippingMethods, paymentMethod) => {
  const orderTypeCounts = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        directMeetingCount: 0,
        codShippingCount: 0,
        bankTransferCount: 0,
        totalOrders: 0,
        hasMixedOrders: false,
        directMeetingProducts: [],
        codShippingProducts: [],
        bankTransferProducts: [],
        directMeetingAmount: 0,
        codShippingAmount: 0,
        bankTransferAmount: 0,
        directMeetingOriginalAmount: 0,
        codShippingOriginalAmount: 0,
        bankTransferOriginalAmount: 0,
        directMeetingSavings: 0,
        codShippingSavings: 0,
        bankTransferSavings: 0,
      };
    }

    const groupedProducts = groupProductsBySeller(products);
    let directMeetingCount = 0;
    let codShippingCount = 0;
    let bankTransferCount = 0;
    
    // Separate products by order type
    let directMeetingProducts = [];
    let codShippingProducts = [];
    let bankTransferProducts = [];

    groupedProducts.forEach((order) => {
      const selectedShipping = selectedShippingMethods[order.sellerId];
      const sellerProducts = products.filter(product => product.seller._id === order.sellerId);
      
      // Determine individual order flow based ONLY on shipping method, not payment method
      if (!selectedShipping || selectedShipping.id !== "ship-cod") {
        directMeetingCount++;
        directMeetingProducts = [...directMeetingProducts, ...sellerProducts];
      } else {
        // All ship-cod orders are considered COD shipping orders
        // Payment method only affects how they are paid, not their classification
        codShippingCount++;
        codShippingProducts = [...codShippingProducts, ...sellerProducts];
      }
    });

    // Calculate amounts for each order type
    const directMeetingTotals = calculateTotalWithDiscounts(directMeetingProducts);
    const codShippingTotals = calculateTotalWithDiscounts(codShippingProducts);
    const bankTransferTotals = calculateTotalWithDiscounts(bankTransferProducts);

    const totalOrders = directMeetingCount + codShippingCount + bankTransferCount;
    const hasMixedOrders = (directMeetingCount > 0 ? 1 : 0) + 
                          (codShippingCount > 0 ? 1 : 0) + 
                          (bankTransferCount > 0 ? 1 : 0) > 1;

    return {
      directMeetingCount,
      codShippingCount,
      bankTransferCount,
      totalOrders,
      hasMixedOrders,
      
      // Product arrays by type
      directMeetingProducts,
      codShippingProducts,
      bankTransferProducts,
      
      // Amount calculations by type
      directMeetingAmount: directMeetingTotals.finalTotal,
      codShippingAmount: codShippingTotals.finalTotal,
      bankTransferAmount: bankTransferTotals.finalTotal,
      
      directMeetingOriginalAmount: directMeetingTotals.originalTotal,
      codShippingOriginalAmount: codShippingTotals.originalTotal,
      bankTransferOriginalAmount: bankTransferTotals.originalTotal,
      
      directMeetingSavings: directMeetingTotals.totalSavings,
      codShippingSavings: codShippingTotals.totalSavings,
      bankTransferSavings: bankTransferTotals.totalSavings,
    };
  }, [products, selectedShippingMethods, paymentMethod]);

  // Function to calculate shipping fee only for COD orders
  const getCodShippingFee = useCallback(() => {
    if (!orderTypeCounts.codShippingProducts.length) return 0;
    
    const groupedProducts = groupProductsBySeller(orderTypeCounts.codShippingProducts);
    let totalShippingFee = 0;
    
    groupedProducts.forEach((order) => {
      const selectedShipping = selectedShippingMethods[order.sellerId];
      if (selectedShipping && selectedShipping.id === "ship-cod") {
        totalShippingFee += selectedShipping.fee || 0;
      }
    });
    
    return totalShippingFee;
  }, [orderTypeCounts.codShippingProducts, selectedShippingMethods]);

  return {
    ...orderTypeCounts,
    getCodShippingFee,
  };
}; 