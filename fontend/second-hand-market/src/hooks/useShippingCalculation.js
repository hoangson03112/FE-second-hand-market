import { useState, useEffect, useCallback } from "react";
import { shippingService } from "../services/shippingService";

export const useShippingCalculation = (sellers, products, deliveryAddress) => {
  const [shippingData, setShippingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calculate shipping for all shops when address changes
   */
  const calculateAllShipping = useCallback(async () => {
    if (!deliveryAddress || !sellers.length || !products.length) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const shippingResults = await shippingService.calculateMultiShopShipping(
        sellers,
        products,
        deliveryAddress
      );
      const shippingByShop = shippingResults.reduce((acc, result) => {
        if (result.services && result.services.length > 0) {
          acc[result.shopId] = {
            services: result.services,
            selectedService: result.services[0], // Auto-select first service
            loading: false,
            error: null,
          };
        } else {
          acc[result.shopId] = {
            services: shippingService.getFallbackServices(),
            selectedService: shippingService.getFallbackServices()[0],
            loading: false,
            error: "Không có dịch vụ vận chuyển khả dụng",
          };
        }
        return acc;
      }, {});

      setShippingData(shippingByShop);
    } catch (err) {
      console.error("Shipping calculation failed:", err);
      setError(err.message || "Không thể tính phí vận chuyển");
      const fallbackData = sellers.reduce((acc, seller) => {
        acc[seller._id] = {
          services: shippingService.getFallbackServices(),
          selectedService: shippingService.getFallbackServices()[0],
          loading: false,
          error: "Sử dụng phí mặc định",
        };
        return acc;
      }, {});

      setShippingData(fallbackData);
    } finally {
      setLoading(false);
    }
  }, [deliveryAddress, sellers, products]);

  /**
   * Calculate shipping for a specific shop
   */
  const calculateShopShipping = useCallback(
    async (sellerId) => {
      const seller = sellers.find((s) => s._id === sellerId);
      if (!seller || !deliveryAddress) return;

      setShippingData((prev) => ({
        ...prev,
        [sellerId]: { ...prev[sellerId], loading: true, error: null },
      }));

      try {
        const sellerProducts = products.filter(
          (p) => p.seller._id === sellerId
        );
        const sellerAddress = {
          province: seller.address?.province,
          district: seller.address?.district,
          ward: seller.address?.ward,
          address: seller.address?.address,
        };

        const services = await shippingService.getAvailableServices(
          sellerAddress,
          deliveryAddress
        );

        const feeCalculations = await Promise.allSettled(
          services.map((service) =>
            shippingService.calculateShippingFee({
              from: sellerAddress,
              to: deliveryAddress,
              items: sellerProducts,
              serviceType: service.code,
            })
          )
        );

        const servicesWithFees = services.map((service, index) => ({
          ...service,
          fee:
            feeCalculations[index].status === "fulfilled"
              ? feeCalculations[index].value.fee
              : service.fee || 30000,
          estimatedTime:
            feeCalculations[index].status === "fulfilled"
              ? feeCalculations[index].value.estimatedTime
              : service.estimatedTime,
        }));

        setShippingData((prev) => ({
          ...prev,
          [sellerId]: {
            services: servicesWithFees,
            selectedService: servicesWithFees[0],
            loading: false,
            error: null,
          },
        }));
      } catch (err) {
        console.error(
          `Shipping calculation failed for seller ${sellerId}:`,
          err
        );

        setShippingData((prev) => ({
          ...prev,
          [sellerId]: {
            services: shippingService.getFallbackServices(),
            selectedService: shippingService.getFallbackServices()[0],
            loading: false,
            error: err.message || "Lỗi tính phí vận chuyển",
          },
        }));
      }
    },
    [sellers, products, deliveryAddress]
  );

  /**
   * Update selected shipping method for a shop
   */
  const updateSelectedShipping = useCallback((sellerId, service) => {
    console.log("updateSelectedShipping", sellerId, service);
    setShippingData((prev) => {
      const shopData = prev[sellerId];
      if (!shopData) return prev;

      // If service is passed as object, use it directly
      // If service is passed as code string, find the service
      const selectedService =
        typeof service === "object"
          ? service
          : shopData.services.find((s) => s.code === service);

      if (!selectedService) return prev;

      return {
        ...prev,
        [sellerId]: {
          ...shopData,
          selectedService,
        },
      };
    });
  }, []);

  /**
   * Get total shipping fee across all shops
   */
  const getTotalShippingFee = useCallback(() => {
    return Object.values(shippingData).reduce((total, shopData) => {
      return total + (shopData.selectedService?.fee || 0);
    }, 0);
  }, [shippingData]);

  /**
   * Get selected shipping methods in format expected by existing code
   */
  const getSelectedShippingMethods = useCallback(() => {
    return Object.keys(shippingData).reduce((acc, sellerId) => {
      const shopData = shippingData[sellerId];
      if (shopData.selectedService) {
        acc[sellerId] = {
          id: shopData.selectedService.code,
          name: shopData.selectedService.name,
          fee: shopData.selectedService.fee,
          estimatedTime: shopData.selectedService.estimatedTime,
        };
      }
      return acc;
    }, {});
  }, [shippingData]);

  // Auto-calculate when dependencies change
  useEffect(() => {
    calculateAllShipping();
  }, [calculateAllShipping]);

  return {
    shippingData,
    loading,
    error,
    calculateAllShipping,
    calculateShopShipping,
    updateSelectedShipping,
    getTotalShippingFee,
    getSelectedShippingMethods,
  };
};
