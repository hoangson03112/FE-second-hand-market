import axios from "axios";
import { ghnService } from "./ghnService";

const SHIPPING_API_BASE_URL =
  process.env.REACT_APP_SHIPPING_API_URL || "https://api.shipping-provider.com";
const BACKEND_API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:2000/eco-market";

class ShippingService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_GHN_CAL_FEE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.backendApi = axios.create({
      baseURL: BACKEND_API_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = process.env.REACT_APP_GHN_TOKEN;
      if (token) {
        config.headers.Token = token;
      }
      return config;
    });
  }

  async calculateShippingFee(params) {
    try {
      const { from, to, items, serviceType } = params;

      // Nếu là gặp mặt trực tiếp thì miễn phí
      if (serviceType === "direct-meeting") {
        return {
          fee: 0,
          estimatedTime: "Thỏa thuận",
          service: {
            code: "direct-meeting",
            name: "Gặp mặt trực tiếp",
          },
          details: {
            serviceFee: 0,
            insuranceFee: 0,
            pickupFee: 0,
          },
        };
      }

      // Nếu là ship-cod thì tính phí GHN
      const serviceId = 53320; // GHN Standard

      // Validate địa chỉ trước khi gọi API
      if (
        !from.districtId ||
        !from.wardCode ||
        !to.districtId ||
        !to.wardCode
      ) {
        console.error("Missing address information:", { from, to });
        throw new Error("Thiếu thông tin địa chỉ gửi hoặc nhận");
      }

      // Calculate weight and dimensions
      const weight = this.calculateTotalWeight(items);
      const dimensions = ghnService.calculateDimensions(items);

      // Call GHN API
      console.log("Calling GHN API with params:", {
        fromWard: String(from.wardCode),
        fromDistrict: parseInt(from.districtId),
        toWard: String(to.wardCode),
        toDistrict: parseInt(to.districtId),
        weight: weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        serviceId: serviceId,
        insuranceValue: this.calculateTotalValue(items),
      });

      const ghnResult = await ghnService.calculateShippingFee({
        fromWard: String(from.wardCode),
        fromDistrict: parseInt(from.districtId),
        toWard: String(to.wardCode),
        toDistrict: parseInt(to.districtId),
        weight: weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        serviceId: serviceId,
        insuranceValue: this.calculateTotalValue(items),
      });

      return {
        fee: ghnResult.total,
        estimatedTime:
          ghnResult.expected_delivery_time ||
          this.getEstimatedTime(serviceType),
        service: {
          code: serviceType,
          name: this.getServiceName(serviceType),
        },
        details: {
          serviceFee: ghnResult.service_fee,
          insuranceFee: ghnResult.insurance_fee,
          pickupFee: ghnResult.pickup_fee,
        },
      };
    } catch (error) {
      console.error("Shipping calculation error:", error);

      // Kiểm tra các loại lỗi GHN API
      if (
        error.message &&
        (error.message.includes("route not found") ||
          error.message.includes("calculate service fee error") ||
          error.message.includes("GHN API error"))
      ) {
        console.warn(
          "GHN không hỗ trợ tuyến đường này hoặc có lỗi API, sử dụng phí mặc định"
        );
        const fallbackServiceType = params.serviceType || "ship-cod";
        return {
          fee: this.getFallbackFee(fallbackServiceType),
          estimatedTime: this.getEstimatedTime(fallbackServiceType),
          service: {
            code: fallbackServiceType,
            name: this.getServiceName(fallbackServiceType),
          },
          details: {
            serviceFee: this.getFallbackFee(fallbackServiceType),
            insuranceFee: 0,
            pickupFee: 0,
          },
        };
      }

      // Return fallback pricing cho các lỗi khác
      const fallbackServiceType = params.serviceType || "ship-cod";
      return {
        fee: this.getFallbackFee(fallbackServiceType),
        estimatedTime: this.getEstimatedTime(fallbackServiceType),
        service: {
          code: fallbackServiceType,
          name: this.getServiceName(fallbackServiceType),
        },
      };
    }
  }

  async getAvailableServices(from, to) {
    try {
      // Trả về 2 dịch vụ: gặp mặt trực tiếp và giao hàng COD
      return [
        {
          code: "direct-meeting",
          name: "Gặp mặt trực tiếp",
          description:
            "Seller và buyer tự hẹn gặp mặt bên ngoài và tự giao dịch",
          fee: 0,
          estimatedTime: "Thỏa thuận",
          icon: "bi-people",
          serviceId: 0,
        },
        {
          code: "ship-cod",
          name: "Giao hàng COD",
          description:
            "Giao hàng tận nơi, có thể nhận hàng rồi thanh toán hoặc thanh toán tất cả",
          fee: 0, // Sẽ được tính từ GHN API
          estimatedTime: "2-5 ngày",
          icon: "bi-truck",
          serviceId: 53320,
        },
      ];
    } catch (error) {
      console.error("Get services error:", error);
      return this.getFallbackServices();
    }
  }

  async calculateMultiShopShipping(shops, products, deliveryAddress) {
    console.log("Products:", products);
    console.log("Shops:", shops);
    console.log("Delivery Address:", deliveryAddress);

    // Nhóm products theo seller
    const productsBySeller = {};
    products.forEach((product) => {
      const sellerId = product.seller._id;
      if (!productsBySeller[sellerId]) {
        productsBySeller[sellerId] = [];
      }
      productsBySeller[sellerId].push(product);
    });

    console.log("Products grouped by seller:", productsBySeller);

    const calculations = await Promise.allSettled(
      Object.entries(productsBySeller).map(
        async ([sellerId, sellerProducts]) => {
          try {
            console.log(`Calculating shipping for seller ${sellerId}:`);
            console.log(`Seller products:`, sellerProducts);

            // Lấy địa chỉ từ product đầu tiên của seller (giả sử cùng seller có cùng địa chỉ)
            const firstProduct = sellerProducts[0];
            const fromDistrictId = firstProduct.seller.from_district_id;
            const fromWardCode = firstProduct.seller.from_ward_code;

            console.log("Product address info:", {
              from_district_id: fromDistrictId,
              from_ward_code: fromWardCode,
            });

            console.log("Full product data for debugging:", {
              productId: firstProduct._id,
              productName: firstProduct.name,
              seller: firstProduct.seller,
              sellerAddress: firstProduct.seller?.address,
              from_district_id: fromDistrictId,
              from_ward_code: fromWardCode,
            });

            // Kiểm tra thông tin địa chỉ product
            if (!fromDistrictId || !fromWardCode) {
              console.warn(
                `Product ${firstProduct._id} thiếu thông tin địa chỉ:`,
                {
                  from_district_id: fromDistrictId,
                  from_ward_code: fromWardCode,
                }
              );

              // Sử dụng địa chỉ mặc định nếu thiếu
              const defaultFromAddress = {
                districtId: fromDistrictId || 1442, // Quận Ba Đình
                wardCode: fromWardCode || "10001", // Phường Phúc Xá
              };

              const toAddress = {
                districtId: deliveryAddress.districtId,
                wardCode: deliveryAddress.wardCode,
              };

              console.log("Using default from address:", defaultFromAddress);
              console.log("To address:", toAddress);

              // Get available services first
              const services = await this.getAvailableServices(
                defaultFromAddress,
                toAddress
              );

              // Calculate fees for each service
              const servicesWithFees = await Promise.allSettled(
                services.map(async (service) => {
                  try {
                    const feeResult = await this.calculateShippingFee({
                      from: defaultFromAddress,
                      to: toAddress,
                      items: sellerProducts,
                      serviceType: service.code,
                    });

                    return {
                      ...service,
                      fee: feeResult.fee,
                      estimatedTime: feeResult.estimatedTime,
                    };
                  } catch (error) {
                    console.error(
                      `Failed to calculate fee for service ${service.code}:`,
                      error
                    );
                    return {
                      ...service,
                      fee: this.getFallbackFee(service.code),
                      estimatedTime: this.getEstimatedTime(service.code),
                    };
                  }
                })
              );

              return {
                shopId: sellerId,
                services: servicesWithFees
                  .filter((result) => result.status === "fulfilled")
                  .map((result) => result.value),
              };
            }

            // Tạo object from và to đúng format từ product
            const fromAddress = {
              districtId: fromDistrictId,
              wardCode: fromWardCode,
            };

            const toAddress = {
              districtId: deliveryAddress.districtId,
              wardCode: deliveryAddress.wardCode,
            };

            console.log("From address (from product):", fromAddress);
            console.log("To address:", toAddress);

            // Get available services first
            const services = await this.getAvailableServices(
              fromAddress,
              toAddress
            );

            // Calculate fees for each service
            const servicesWithFees = await Promise.allSettled(
              services.map(async (service) => {
                try {
                  const feeResult = await this.calculateShippingFee({
                    from: fromAddress,
                    to: toAddress,
                    items: sellerProducts,
                    serviceType: service.code,
                  });

                  return {
                    ...service,
                    fee: feeResult.fee,
                    estimatedTime: feeResult.estimatedTime,
                  };
                } catch (error) {
                  console.error(
                    `Failed to calculate fee for service ${service.code}:`,
                    error
                  );
                  return {
                    ...service,
                    fee: this.getFallbackFee(service.code),
                    estimatedTime: this.getEstimatedTime(service.code),
                  };
                }
              })
            );

            return {
              shopId: sellerId,
              services: servicesWithFees
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value),
            };
          } catch (error) {
            console.error(
              `Failed to calculate shipping for seller ${sellerId}:`,
              error
            );
            return {
              shopId: sellerId,
              services: this.getFallbackServices(),
            };
          }
        }
      )
    );

    return calculations
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);
  }

  extractSellerAddress(seller) {
    return {
      province: seller.address?.province,
      district: seller.address?.district,
      ward: seller.address?.ward,
      address: seller.address?.address,
      // Include IDs if available
      provinceId: seller.address?.provinceId,
      districtId: seller.address?.districtId,
      wardCode: seller.address?.wardCode,
    };
  }

  calculateTotalWeight(items) {
    console.log("Calculating weight for items:", items);
    return items.reduce((total, item) => {
      // Kiểm tra và lấy weight từ estimatedWeight hoặc sử dụng default
      let weight = 500; // Default 500g

      if (item.estimatedWeight && item.estimatedWeight.value) {
        weight = parseInt(item.estimatedWeight.value);
      } else if (item.weight) {
        weight = parseInt(item.weight);
      }

      return total + weight * item.quantity;
    }, 0);
  }

  calculateTotalValue(items) {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  getServiceTypeId(serviceType) {
    const serviceMap = {
      "direct-meeting": 0, // Special case
      "ship-cod": 53320, // GHN Standard
      standard: 53320,
      express: 53321,
      economy: 100039,
    };
    return serviceMap[serviceType] || 53320;
  }

  /**
   * Get service name by type
   */
  getServiceName(serviceType) {
    const nameMap = {
      "direct-meeting": "Giao dịch trực tiếp",
      "ship-cod": "Giao hàng COD",
      standard: "Giao hàng tiêu chuẩn",
      express: "Giao hàng nhanh",
      economy: "Giao hàng tiết kiệm",
    };
    return nameMap[serviceType] || "Giao hàng tiêu chuẩn";
  }

  getEstimatedTime(serviceType) {
    const timeMap = {
      "direct-meeting": "Thỏa thuận",
      "ship-cod": "2-5 ngày",
      53320: "3-5 ngày",
      53321: "1-2 ngày",
      100039: "5-7 ngày",
    };
    return timeMap[serviceType] || "2-5 ngày";
  }

  /**
   * Get service icon
   */
  getServiceIcon(serviceType) {
    const iconMap = {
      "direct-meeting": "bi-people",
      "ship-cod": "bi-truck",
      53320: "bi-truck",
      53321: "bi-lightning",
      100039: "bi-clock",
    };
    return iconMap[serviceType] || "bi-truck";
  }

  /**
   * Get fallback fee for service
   */
  getFallbackFee(serviceCode) {
    if (serviceCode === "direct-meeting") return 0;
    return 30000; // Default 30k VND
  }

  /**
   * Fallback services when API fails
   */
  getFallbackServices() {
    return [
      {
        code: "direct-meeting",
        name: "Giao dịch trực tiếp",
        description: "Gặp mặt trực tiếp, thanh toán tại chỗ",
        fee: 0,
        estimatedTime: "Thỏa thuận",
        icon: "bi-people",
      },
      {
        code: "ship-cod",
        name: "Giao hàng COD",
        description: "Giao hàng tận nơi, thanh toán khi nhận",
        fee: 30000,
        estimatedTime: "2-5 ngày",
        icon: "bi-truck",
      },
    ];
  }

  /**
   * Handle and format shipping API errors
   */
  handleShippingError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || "Lỗi tính phí vận chuyển",
        code: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: "Không thể kết nối đến dịch vụ vận chuyển",
        code: "NETWORK_ERROR",
      };
    } else {
      return {
        message: "Lỗi không xác định khi tính phí vận chuyển",
        code: "UNKNOWN_ERROR",
      };
    }
  }
}

export const shippingService = new ShippingService();
export default ShippingService;
