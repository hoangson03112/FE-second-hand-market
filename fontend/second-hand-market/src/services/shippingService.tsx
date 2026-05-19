import axios, { AxiosInstance } from "axios";
import { ghnService } from "./ghnService";

const SHIPPING_API_BASE_URL =
  process.env.REACT_APP_SHIPPING_API_URL || "https://api.shipping-provider.com";
const BACKEND_API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:2000/eco-market";

interface Address {
  districtId: string | number;
  wardCode: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  provinceId?: string | number;
}

interface ShippingItem {
  _id?: string;
  quantity: number;
  price: number;
  weight?: number;
  estimatedWeight?: {
    value: number | string;
  };
  seller?: {
    _id: string;
    from_district_id?: string | number;
    from_ward_code?: string;
    address?: Address;
  };
}

interface ShippingParams {
  from: Address;
  to: Address;
  items: ShippingItem[];
  serviceType: string;
}

interface ShippingResult {
  fee: number;
  estimatedTime: string;
  service: {
    code: string;
    name: string;
  };
  details?: {
    serviceFee: number;
    insuranceFee: number;
    pickupFee: number;
  };
}

interface ServiceOption {
  code: string;
  name: string;
  description: string;
  fee: number;
  estimatedTime: string;
  icon: string;
  serviceId?: number;
}

class ShippingService {
  private api: AxiosInstance;
  private backendApi: AxiosInstance;

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
      if (token && config.headers) {
        config.headers.Token = token;
      }
      return config;
    });
  }

  async calculateShippingFee(params: ShippingParams): Promise<ShippingResult> {
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

      const ghnResult = await ghnService.calculateShippingFee({
        fromWard: String(from.wardCode),
        fromDistrict: parseInt(String(from.districtId)),
        toWard: String(to.wardCode),
        toDistrict: parseInt(String(to.districtId)),
        weight: weight,
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height,
        insuranceValue: this.calculateTotalValue(items),
        serviceId: serviceId, // Optional: GHN service ID
      } as any); // Cast to any since ghnService doesn't have proper TypeScript types

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
    } catch (error: unknown) {
      console.error("Shipping calculation error:", error);

      // Kiểm tra các loại lỗi GHN API
      if (
        error instanceof Error &&
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

  async getAvailableServices(from: Address, to: Address): Promise<ServiceOption[]> {
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

  async calculateMultiShopShipping(
    shops: any,
    products: ShippingItem[],
    deliveryAddress: Address
  ): Promise<any[]> {
    // Nhóm products theo seller
    const productsBySeller: Record<string, ShippingItem[]> = {};
    products.forEach((product: ShippingItem) => {
      const sellerId = product.seller?._id;
      if (!sellerId) return;
      if (!productsBySeller[sellerId]) {
        productsBySeller[sellerId] = [];
      }
      productsBySeller[sellerId].push(product);
    });

    const calculations = await Promise.allSettled(
      Object.entries(productsBySeller).map(
        async ([sellerId, sellerProducts]: [string, ShippingItem[]]) => {
          try {
            // Lấy địa chỉ từ product đầu tiên của seller (giả sử cùng seller có cùng địa chỉ)
            const firstProduct = sellerProducts[0];
            const fromDistrictId = firstProduct.seller?.from_district_id;
            const fromWardCode = firstProduct.seller?.from_ward_code;

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
              const defaultFromAddress: Address = {
                districtId: fromDistrictId || 1442, // Quận Ba Đình
                wardCode: fromWardCode || "10001", // Phường Phúc Xá
              };

              const toAddress: Address = {
                districtId: deliveryAddress.districtId,
                wardCode: deliveryAddress.wardCode,
              };

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
                  .map((result) => (result as PromiseFulfilledResult<ServiceOption>).value),
              };
            }

            // Tạo object from và to đúng format từ product
            const fromAddress: Address = {
              districtId: fromDistrictId,
              wardCode: fromWardCode,
            };

            const toAddress: Address = {
              districtId: deliveryAddress.districtId,
              wardCode: deliveryAddress.wardCode,
            };

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
                .map((result) => (result as PromiseFulfilledResult<ServiceOption>).value),
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
      .map((result) => (result as PromiseFulfilledResult<any>).value);
  }

  extractSellerAddress(seller: any): Address {
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

  calculateTotalWeight(items: ShippingItem[]): number {
    return items.reduce((total, item) => {
      // Kiểm tra và lấy weight từ estimatedWeight hoặc sử dụng default
      let weight = 500; // Default 500g

      if (item.estimatedWeight && item.estimatedWeight.value) {
        weight = parseInt(String(item.estimatedWeight.value));
      } else if (item.weight) {
        weight = parseInt(String(item.weight));
      }

      return total + weight * item.quantity;
    }, 0);
  }

  calculateTotalValue(items: ShippingItem[]): number {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  getServiceTypeId(serviceType: string): number {
    const serviceMap: Record<string, number> = {
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
  getServiceName(serviceType: string): string {
    const nameMap: Record<string, string> = {
      "direct-meeting": "Giao dịch trực tiếp",
      "ship-cod": "Giao hàng COD",
      standard: "Giao hàng tiêu chuẩn",
      express: "Giao hàng nhanh",
      economy: "Giao hàng tiết kiệm",
    };
    return nameMap[serviceType] || "Giao hàng tiêu chuẩn";
  }

  getEstimatedTime(serviceType: string | number): string {
    const timeMap: Record<string | number, string> = {
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
  getServiceIcon(serviceType: string | number): string {
    const iconMap: Record<string | number, string> = {
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
  getFallbackFee(serviceCode: string): number {
    if (serviceCode === "direct-meeting") return 0;
    return 30000; // Default 30k VND
  }

  /**
   * Fallback services when API fails
   */
  getFallbackServices(): ServiceOption[] {
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
  handleShippingError(error: any): { message: string; code: string | number; details?: any } {
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
