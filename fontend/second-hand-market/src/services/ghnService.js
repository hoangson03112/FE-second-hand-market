import axios from "axios";

class GHNService {
  constructor() {
    this.baseURL = "https://dev-online-gateway.ghn.vn/shiip/public-api";
    this.token = process.env.REACT_APP_GHN_TOKEN;
    this.shopId = 196531;
  }
  async createOrder(ghnOrderData) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/shipping-order/create`,
        ghnOrderData,
        {
          headers: {
            Token: this.token,
            ShopId: this.shopId,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("GHN API Error:", error);
      throw error;
    }
  }

  async calculateShippingFee({
    fromWard,
    fromDistrict,
    toWard,
    toDistrict,
    weight,
    length = 20,
    width = 20,
    height = 10,
    insuranceValue = 0,
  }) {
    try {
      if (!fromWard || !fromDistrict || !toWard || !toDistrict) {
        console.error("Missing address parameters:", {
          fromWard,
          fromDistrict,
          toWard,
          toDistrict,
        });
        throw new Error("Thiếu thông tin địa chỉ");
      }

      // Lấy danh sách service hợp lệ
      const services = await this.getAvailableServices(
        fromDistrict,
        toDistrict
      );
      let serviceId = null;
      if (services && services.length > 0) {
        serviceId = services[0].service_id;
      }

      if (!serviceId) {
        // Không có service hợp lệ, trả về phí ship mặc định 30k
        return {
          total: 30000,
          service_fee: 30000,
          insurance_fee: 0,
          pickup_fee: 0,
          coupon_value: 0,
          expected_delivery_time: "3-5 ngày",
          isFallback: true,
        };
      }

      const response = await axios.post(
        `${this.baseURL}/v2/shipping-order/fee`,
        {
          service_id: serviceId,
          insurance_value: insuranceValue,
          coupon: null,
          from_ward_code: fromWard,
          from_district_id: parseInt(fromDistrict),
          to_ward_code: toWard,
          to_district_id: parseInt(toDistrict),
          weight: parseInt(weight),
          length: parseInt(length),
          width: parseInt(width),
          height: parseInt(height),
        },
        {
          headers: {
            Token: this.token,
            ShopId: this.shopId,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.code === 200) {
        return {
          total: data.data.total,
          service_fee: data.data.service_fee,
          insurance_fee: data.data.insurance_fee,
          pickup_fee: data.data.pickup_fee,
          coupon_value: data.data.coupon_value,
          expected_delivery_time: data.data.expected_delivery_time,
        };
      } else {
        // Nếu lỗi từ GHN, trả về phí ship mặc định 30k
        return {
          total: 30000,
          service_fee: 30000,
          insurance_fee: 0,
          pickup_fee: 0,
          coupon_value: 0,
          expected_delivery_time: "3-5 ngày",
          isFallback: true,
        };
      }
    } catch (error) {
      console.error("GHN API Error:", error);
      // Nếu lỗi, trả về phí ship mặc định 30k
      return {
        total: 30000,
        service_fee: 30000,
        insurance_fee: 0,
        pickup_fee: 0,
        coupon_value: 0,
        expected_delivery_time: "3-5 ngày",
        isFallback: true,
      };
    }
  }

  async getAvailableServices(fromDistrict, toDistrict) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/shipping-order/available-services`,
        {
          shop_id: parseInt(this.shopId),
          from_district: parseInt(fromDistrict),
          to_district: parseInt(toDistrict),
        },
        {
          headers: {
            Token: this.token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.code === 200 && data.data.length > 0) {
        return data.data;
      } else {
        console.warn("No GHN services available, using fallback");
        return this.getFallbackServices();
      }
    } catch (error) {
      console.error("GHN Services Error:", error);
      return this.getFallbackServices();
    }
  }
  async getServicesWithPricing(params) {
    try {
      const {
        fromWard,
        fromDistrict,
        toWard,
        toDistrict,
        weight = 500,
        length = 20,
        width = 20,
        height = 10,
      } = params;

      // Validate required parameters
      if (!fromWard || !fromDistrict || !toWard || !toDistrict) {
        console.error("Missing required address parameters:", {
          fromWard,
          fromDistrict,
          toWard,
          toDistrict,
        });
        throw new Error("Thiếu thông tin địa chỉ gửi hàng hoặc nhận hàng");
      }

      // First get available services
      const availableServices = await this.getAvailableServices(
        fromDistrict,
        toDistrict
      );

      if (!availableServices || availableServices.length === 0) {
        console.warn("No services available, returning fallback");
        return this.getFormattedFallbackServices();
      }

      // Calculate pricing for each service
      const servicesWithPricing = await Promise.allSettled(
        availableServices.map(async (service) => {
          try {
            const pricing = await this.calculateShippingFee({
              fromWard,
              fromDistrict,
              toWard,
              toDistrict,
              weight,
              length,
              width,
              height,
              serviceId: service.service_id,
            });

            return {
              id: service.service_id,
              code: service.service_id.toString(),
              name: service.service_name,
              shortName: service.short_name,
              type: this.getServiceTypeName(service.service_type_id),
              fee: pricing.total,
              serviceFee: pricing.service_fee,
              insuranceFee: pricing.insurance_fee,
              pickupFee: pricing.pickup_fee,
              estimatedTime: pricing.expected_delivery_time,
              description: this.getServiceDescription(service.service_id),
              icon: this.getServiceIcon(service.service_id),
              isRecommended: service.service_id === 53320, // Standard service
            };
          } catch (error) {
            console.warn(
              `Failed to calculate pricing for service ${service.service_id}:`,
              error
            );
            // Return service with fallback pricing
            const fallbackPricing = this.getFallbackPricing(service.service_id);
            return {
              id: service.service_id,
              code: service.service_id.toString(),
              name: service.service_name,
              shortName: service.short_name,
              type: this.getServiceTypeName(service.service_type_id),
              fee: fallbackPricing.total,
              serviceFee: fallbackPricing.total,
              insuranceFee: 0,
              pickupFee: 0,
              estimatedTime: fallbackPricing.expected_delivery_time,
              description: this.getServiceDescription(service.service_id),
              icon: this.getServiceIcon(service.service_id),
              isRecommended: service.service_id === 53320,
              isFallback: true,
            };
          }
        })
      );

      // Filter successful results and sort by fee
      const validServices = servicesWithPricing
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
        .sort((a, b) => a.fee - b.fee);

      // Mark first service as selected
      if (validServices.length > 0) {
        validServices[0].isSelected = true;
        validServices[0].isFirstService = true;
      }

      return validServices.length > 0
        ? validServices
        : this.getFormattedFallbackServices();
    } catch (error) {
      console.error("Error getting services with pricing:", error);
      return this.getFormattedFallbackServices();
    }
  }

  async getServicesForRoute(sellerAddress, deliveryAddress, products = []) {
    try {
      if (!sellerAddress?.ward || !sellerAddress?.district) {
        throw new Error("Thiếu thông tin địa chỉ người bán");
      }

      if (!deliveryAddress?.ward || !deliveryAddress?.district) {
        throw new Error("Thiếu thông tin địa chỉ giao hàng");
      }

      const weight = this.calculateWeight(products);
      const dimensions = this.calculateDimensions(products);

      const services = await this.getServicesWithPricing({
        fromWard: sellerAddress.ward, // From seller address
        fromDistrict: sellerAddress.district, // From seller address
        toWard: deliveryAddress.ward, // To user delivery address
        toDistrict: deliveryAddress.district, // To user delivery address
        weight,
        ...dimensions,
      });

      return services;
    } catch (error) {
      console.error("Error getting services for route:", error);
      return this.getFormattedFallbackServices();
    }
  }

  async getFirstServiceWithPricing(params) {
    try {
      const {
        fromWard,
        fromDistrict,
        toWard,
        toDistrict,
        weight = 500,
        length = 20,
        width = 20,
        height = 10,
      } = params;

      if (!fromWard || !fromDistrict || !toWard || !toDistrict) {
        console.error("Missing required address parameters:", {
          fromWard,
          fromDistrict,
          toWard,
          toDistrict,
        });
        throw new Error("Thiếu thông tin địa chỉ gửi hàng hoặc nhận hàng");
      }

      // Get available services
      const availableServices = await this.getAvailableServices(
        fromDistrict,
        toDistrict
      );

      if (!availableServices || availableServices.length === 0) {
        console.warn("No services available, using fallback");
        const fallbackService = this.getFormattedFallbackServices()[0];
        return {
          ...fallbackService,
          isFallback: true,
        };
      }

      // Get the first service
      const firstService = availableServices[0];

      try {
        // Calculate pricing for the first service
        const pricing = await this.calculateShippingFee({
          fromWard,
          fromDistrict,
          toWard,
          toDistrict,
          weight,
          length,
          width,
          height,
          serviceId: firstService.service_id,
        });

        return {
          id: firstService.service_id,
          code: firstService.service_id.toString(),
          name: firstService.service_name,
          shortName: firstService.short_name,
          type: this.getServiceTypeName(firstService.service_type_id),
          fee: pricing.total,
          serviceFee: pricing.service_fee,
          insuranceFee: pricing.insurance_fee,
          pickupFee: pricing.pickup_fee,
          estimatedTime: pricing.expected_delivery_time,
          description: this.getServiceDescription(firstService.service_id),
          icon: this.getServiceIcon(firstService.service_id),
          isRecommended: firstService.service_id === 53320,
          isFirstService: true,
        };
      } catch (error) {
        console.warn(
          `Failed to calculate pricing for first service ${firstService.service_id}:`,
          error
        );
        // Return first service with fallback pricing
        const fallbackPricing = this.getFallbackPricing(
          firstService.service_id
        );
        return {
          id: firstService.service_id,
          code: firstService.service_id.toString(),
          name: firstService.service_name,
          shortName: firstService.short_name,
          type: this.getServiceTypeName(firstService.service_type_id),
          fee: fallbackPricing.total,
          serviceFee: fallbackPricing.total,
          insuranceFee: 0,
          pickupFee: 0,
          estimatedTime: fallbackPricing.expected_delivery_time,
          description: this.getServiceDescription(firstService.service_id),
          icon: this.getServiceIcon(firstService.service_id),
          isRecommended: firstService.service_id === 53320,
          isFirstService: true,
          isFallback: true,
        };
      }
    } catch (error) {
      console.error("Error getting first service with pricing:", error);
      const fallbackService = this.getFormattedFallbackServices()[0];
      return {
        ...fallbackService,
        isFallback: true,
        isFirstService: true,
      };
    }
  }

  async getFirstServiceForRoute(sellerAddress, deliveryAddress, products = []) {
    try {
      // Validate addresses
      if (!sellerAddress?.ward || !sellerAddress?.district) {
        throw new Error("Thiếu thông tin địa chỉ người bán");
      }

      if (!deliveryAddress?.ward || !deliveryAddress?.district) {
        throw new Error("Thiếu thông tin địa chỉ giao hàng");
      }

      const weight = this.calculateWeight(products);
      const dimensions = this.calculateDimensions(products);

      const firstService = await this.getFirstServiceWithPricing({
        fromWard: sellerAddress.ward, // From seller address
        fromDistrict: sellerAddress.district, // From seller address
        toWard: deliveryAddress.ward, // To user delivery address
        toDistrict: deliveryAddress.district, // To user delivery address
        weight,
        ...dimensions,
      });

      return firstService;
    } catch (error) {
      console.error("Error getting first service for route:", error);
      const fallbackService = this.getFormattedFallbackServices()[0];
      return {
        ...fallbackService,
        isFallback: true,
        isFirstService: true,
      };
    }
  }

  getFirstServiceFromList(services) {
    if (!services || services.length === 0) {
      const fallbackService = this.getFormattedFallbackServices()[0];
      return {
        ...fallbackService,
        isSelected: true,
        isFirstService: true,
        isFallback: true,
      };
    }

    // Get the first service and mark it as selected
    const firstService = { ...services[0] };
    firstService.isSelected = true;
    firstService.isFirstService = true;

    return firstService;
  }

  async calculateShippingFeeWithFirstService(params) {
    try {
      const firstService = await this.getFirstServiceWithPricing(params);

      return {
        service: firstService,
        fee: firstService.fee,
        estimatedTime: firstService.estimatedTime,
        serviceId: firstService.id,
        isFallback: firstService.isFallback || false,
      };
    } catch (error) {
      console.error(
        "Error calculating shipping fee with first service:",
        error
      );
      const fallbackService = this.getFormattedFallbackServices()[0];
      return {
        service: fallbackService,
        fee: fallbackService.fee,
        estimatedTime: fallbackService.estimatedTime,
        serviceId: fallbackService.id,
        isFallback: true,
      };
    }
  }
  extractSellerAddress(product, seller = null) {
    const sellerData = seller || product.seller;

    if (!sellerData) {
      throw new Error("Không tìm thấy thông tin người bán");
    }

    const address = sellerData.address;
    if (!address) {
      throw new Error("Người bán chưa cập nhật địa chỉ");
    }

    if (!address.ward || !address.district) {
      throw new Error(
        "Địa chỉ người bán không đầy đủ (thiếu phường/xã hoặc quận/huyện)"
      );
    }

    return {
      ward: address.ward,
      district: address.district,
      province: address.province,
      address: address.address,
      fullAddress: `${address.address}, ${address.ward}, ${address.district}, ${address.province}`,
    };
  }
  validateDeliveryAddress(deliveryAddress) {
    if (!deliveryAddress) {
      throw new Error("Chưa chọn địa chỉ giao hàng");
    }

    if (!deliveryAddress.ward || !deliveryAddress.district) {
      throw new Error(
        "Địa chỉ giao hàng không đầy đủ (thiếu phường/xã hoặc quận/huyện)"
      );
    }

    return {
      ward: deliveryAddress.ward,
      district: deliveryAddress.district,
      province: deliveryAddress.province,
      address: deliveryAddress.address,
      fullAddress: `${deliveryAddress.address}, ${deliveryAddress.ward}, ${deliveryAddress.district}, ${deliveryAddress.province}`,
    };
  }

  async calculateProductShipping(product, deliveryAddress, seller = null) {
    try {
      const sellerAddress = this.extractSellerAddress(product, seller);

      const validatedDeliveryAddress =
        this.validateDeliveryAddress(deliveryAddress);

      const firstService = await this.getFirstServiceForRoute(
        sellerAddress,
        validatedDeliveryAddress,
        [product]
      );

      return {
        productId: product._id,
        sellerId: seller?._id || product.seller?._id,
        sellerAddress,
        deliveryAddress: validatedDeliveryAddress,
        service: firstService,
        fee: firstService.fee,
        estimatedTime: firstService.estimatedTime,
        isFallback: firstService.isFallback || false,
      };
    } catch (error) {
      console.error("Error calculating product shipping:", error);
      throw error;
    }
  }
  async calculateMultiProductShipping(products, deliveryAddress) {
    try {
      const productsBySeller = products.reduce((acc, product) => {
        const sellerId = product.seller?._id;
        if (!acc[sellerId]) {
          acc[sellerId] = [];
        }
        acc[sellerId].push(product);
        return acc;
      }, {});

      const results = {};

      // Calculate shipping for each seller
      for (const [sellerId, sellerProducts] of Object.entries(
        productsBySeller
      )) {
        try {
          const firstProduct = sellerProducts[0];
          const sellerAddress = this.extractSellerAddress(firstProduct);
          const validatedDeliveryAddress =
            this.validateDeliveryAddress(deliveryAddress);

          const firstService = await this.getFirstServiceForRoute(
            sellerAddress,
            validatedDeliveryAddress,
            sellerProducts
          );

          results[sellerId] = {
            sellerId,
            sellerAddress,
            deliveryAddress: validatedDeliveryAddress,
            products: sellerProducts,
            service: firstService,
            fee: firstService.fee,
            estimatedTime: firstService.estimatedTime,
            isFallback: firstService.isFallback || false,
          };
        } catch (error) {
          console.error(
            `Error calculating shipping for seller ${sellerId}:`,
            error
          );
          results[sellerId] = {
            sellerId,
            error: error.message,
            isFallback: true,
          };
        }
      }

      return results;
    } catch (error) {
      console.error("Error calculating multi-product shipping:", error);
      throw error;
    }
  }
  getServiceTypeName(typeId) {
    const typeNames = {
      1: "Giao hàng nội thành",
      2: "Giao hàng tiêu chuẩn",
      3: "Giao hàng tiết kiệm",
      4: "Giao hàng siêu tốc",
      5: "Giao hàng nhanh",
    };
    return typeNames[typeId] || "Giao hàng tiêu chuẩn";
  }
  getServiceDescription(serviceId) {
    const descriptions = {
      53320: "Giao hàng trong 3-5 ngày làm việc, phù hợp với hầu hết đơn hàng",
      53321: "Giao hàng trong 1-2 ngày làm việc, ưu tiên tốc độ",
      100039: "Giao hàng tiết kiệm trong 5-7 ngày làm việc",
    };
    return descriptions[serviceId] || "Dịch vụ giao hàng đáng tin cậy";
  }
  getServiceIcon(serviceId) {
    const icons = {
      53320: "🚚", // Standard
      53321: "⚡", // Express
      100039: "💰", // Economy
    };
    return icons[serviceId] || "📦";
  }
  getFormattedFallbackServices() {
    return [
      {
        id: 53320,
        code: "53320",
        name: "Giao hàng tiêu chuẩn",
        shortName: "Tiêu chuẩn",
        type: "Giao hàng tiêu chuẩn",
        fee: 30000,
        serviceFee: 30000,
        insuranceFee: 0,
        pickupFee: 0,
        estimatedTime: "3-5 ngày",
        description:
          "Giao hàng trong 3-5 ngày làm việc, phù hợp với hầu hết đơn hàng",
        icon: "🚚",
        isRecommended: true,
        isFallback: true,
      },
      {
        id: 53321,
        code: "53321",
        name: "Giao hàng nhanh",
        shortName: "Nhanh",
        type: "Giao hàng nhanh",
        fee: 45000,
        serviceFee: 45000,
        insuranceFee: 0,
        pickupFee: 0,
        estimatedTime: "1-2 ngày",
        description: "Giao hàng trong 1-2 ngày làm việc, ưu tiên tốc độ",
        icon: "⚡",
        isRecommended: false,
        isFallback: true,
      },
    ];
  }

  getAllServiceTypes() {
    return [
      {
        id: 1,
        name: "Giao hàng nội thành",
        description: "Giao hàng trong cùng thành phố",
        icon: "🏙️",
        typicalTime: "1-2 ngày",
      },
      {
        id: 2,
        name: "Giao hàng tiêu chuẩn",
        description: "Dịch vụ giao hàng phổ biến nhất",
        icon: "🚚",
        typicalTime: "3-5 ngày",
      },
      {
        id: 3,
        name: "Giao hàng tiết kiệm",
        description: "Giao hàng với chi phí thấp nhất",
        icon: "💰",
        typicalTime: "5-7 ngày",
      },
      {
        id: 4,
        name: "Giao hàng siêu tốc",
        description: "Giao hàng trong ngày hoặc ngày hôm sau",
        icon: "🚀",
        typicalTime: "1 ngày",
      },
      {
        id: 5,
        name: "Giao hàng nhanh",
        description: "Giao hàng nhanh hơn dịch vụ tiêu chuẩn",
        icon: "⚡",
        typicalTime: "1-2 ngày",
      },
    ];
  }

  async checkShippingAvailability(sellerAddress, deliveryAddress) {
    try {
      if (!sellerAddress?.district || !deliveryAddress?.district) {
        return {
          available: false,
          message: "Thiếu thông tin địa chỉ người bán hoặc địa chỉ giao hàng",
          services: [],
        };
      }

      const services = await this.getAvailableServices(
        sellerAddress.district, // From seller address
        deliveryAddress.district // To user delivery address
      );

      if (services && services.length > 0) {
        return {
          available: true,
          message: `Có ${services.length} dịch vụ vận chuyển khả dụng`,
          services: services,
        };
      } else {
        return {
          available: false,
          message: "Không có dịch vụ vận chuyển khả dụng cho tuyến đường này",
          services: [],
        };
      }
    } catch (error) {
      console.error("Error checking shipping availability:", error);
      return {
        available: false,
        message: "Lỗi kiểm tra dịch vụ vận chuyển",
        services: [],
      };
    }
  }

  getServiceDetails(serviceId) {
    const serviceDetails = {
      53320: {
        id: 53320,
        code: "53322",
        name: "Giao hàng tiêu chuẩn",
        shortName: "Tiêu chuẩn",
        type: "Giao hàng tiêu chuẩn",
        description:
          "Giao hàng trong 3-5 ngày làm việc, phù hợp với hầu hết đơn hàng",
        icon: "🚚",
        features: [
          "Đảm bảo thời gian giao hàng",
          "Bảo hiểm hàng hóa",
          "Theo dõi đơn hàng",
        ],
        restrictions: [
          "Không giao hàng vào chủ nhật",
          "Không giao hàng sau 18h",
        ],
      },
      53321: {
        id: 53321,
        code: "53321",
        name: "Giao hàng nhanh",
        shortName: "Nhanh",
        type: "Giao hàng nhanh",
        description: "Giao hàng trong 1-2 ngày làm việc, ưu tiên tốc độ",
        icon: "⚡",
        features: ["Giao hàng nhanh", "Ưu tiên xử lý", "Bảo hiểm hàng hóa"],
        restrictions: [
          "Phí vận chuyển cao hơn",
          "Không giao hàng vào chủ nhật",
        ],
      },
      100039: {
        id: 100039,
        code: "100039",
        name: "Giao hàng tiết kiệm",
        shortName: "Tiết kiệm",
        type: "Giao hàng tiết kiệm",
        description: "Giao hàng tiết kiệm trong 5-7 ngày làm việc",
        icon: "💰",
        features: [
          "Chi phí thấp nhất",
          "Bảo hiểm cơ bản",
          "Phù hợp hàng hóa không khẩn cấp",
        ],
        restrictions: [
          "Thời gian giao hàng lâu",
          "Không giao hàng vào cuối tuần",
        ],
      },
    };

    return (
      serviceDetails[serviceId] || {
        id: serviceId,
        code: serviceId.toString(),
        name: "Dịch vụ giao hàng",
        shortName: "Giao hàng",
        type: "Giao hàng tiêu chuẩn",
        description: "Dịch vụ giao hàng đáng tin cậy",
        icon: "📦",
        features: ["Giao hàng an toàn", "Theo dõi đơn hàng"],
        restrictions: ["Không giao hàng vào chủ nhật"],
      }
    );
  }

  async getProvinces() {
    try {
      const response = await axios.get(`${this.baseURL}/master-data/province`, {
        headers: {
          Token: this.token,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.error("GHN Provinces Error:", error);
      return [];
    }
  }

  async getDistricts(provinceId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/master-data/district`,
        {
          province_id: parseInt(provinceId),
        },
        {
          headers: {
            Token: this.token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.error("GHN Districts Error:", error);
      return [];
    }
  }

  async getWards(districtId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/master-data/ward`,
        {
          district_id: parseInt(districtId),
        },
        {
          headers: {
            Token: this.token,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      return data.code === 200 ? data.data : [];
    } catch (error) {
      console.error("GHN Wards Error:", error);
      return [];
    }
  }

  getFallbackPricing(serviceId) {
    const fallbackPrices = {
      53320: { total: 30000, expected_delivery_time: "3-5 ngày" }, // Standard
      53321: { total: 45000, expected_delivery_time: "1-2 ngày" }, // Express
      100039: { total: 25000, expected_delivery_time: "5-7 ngày" }, // Economy
    };

    return (
      fallbackPrices[serviceId] || {
        total: 30000,
        expected_delivery_time: "3-5 ngày",
      }
    );
  }

  getFallbackServices() {
    return [
      {
        service_id: 53320,
        short_name: "Tiêu chuẩn",
        service_name: "Giao hàng tiêu chuẩn",
        service_type_id: 2,
      },
      {
        service_id: 53321,
        short_name: "Nhanh",
        service_name: "Giao hàng nhanh",
        service_type_id: 5,
      },
    ];
  }

  calculateDimensions(products) {
    const totalProducts = products.reduce(
      (sum, product) => sum + product.quantity,
      0
    );

    return {
      length: Math.min(50, 10 + totalProducts * 5),
      width: Math.min(40, 10 + totalProducts * 3),
      height: Math.min(30, 5 + totalProducts * 2),
    };
  }

  calculateWeight(products) {
    return products.reduce((total, product) => {
      const productWeight = product.weight || 500; // Default 500g if weight not specified
      return total + productWeight * product.quantity;
    }, 0);
  }

  async cancelOrderGHN(orderCode) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/switch-status/cancel`,
        {
          order_codes: [orderCode],
        },
        {
          headers: {
            Token: this.token,
            ShopId: this.shopId,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  }
  async returnOrderGHN(orderCode) {
    try {
      const response = await axios.post(
        `${this.baseURL}/v2/switch-status/return`,
        {
          order_codes: [orderCode],
        },
        {
          headers: {
            Token: this.token,
            ShopId: this.shopId,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  }
}

export const ghnService = new GHNService();
