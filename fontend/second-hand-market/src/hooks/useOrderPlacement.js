import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

import { useCart } from "../contexts/CartContext";
import { useCoin } from "../contexts/CoinProvider";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "./useNotification";
import { groupProductsBySeller } from "../utils/checkoutUtils";
import { FORM_VALIDATION_MESSAGES } from "../constants/checkout";
import { ghnService } from "../services/ghnService";
import { useCheckoutData } from "./useCheckoutData";

export const useOrderPlacement = (selectedItems) => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [qrPaymentDialog, setQrPaymentDialog] = useState({
    open: false,
    qrCodeUrl: "",
    totalAmount: 0,
    transactionId: "",
    orderIds: [],
  });
  const navigate = useNavigate();
  const { sellers } = useCheckoutData();
  const { clearCart, deleteItem } = useCart();
  const { token } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { coinService } = useCoin();

  // Handle direct meeting only orders
  const handleDirectMeetingOrder = async (order, selectedAddress, token) => {
    const orderPayload = {
      totalAmount: order.products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      ),
      shippingMethod: "direct-meeting",
      paymentMethod: "direct-meeting",
      shippingAddress: selectedAddress?._id,
      sellerId: order.sellerId,
      products: order.products,
    };
    console.log(orderPayload);
    const orderResponse = await axios.post("/orders", orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return orderResponse.data;
  };

  // Handle COD with shipping orders
  const handleCodWithShippingOrder = async (
    order,
    selectedAddress,
    selectedShipping,
    paymentMethod,
    products,
    token
  ) => {
    const orderPayload = {
      totalAmount:
        order.products.reduce((sum, p) => sum + p.price * p.quantity, 0) +
        selectedShipping?.fee,
      shippingMethod: "ship-cod",
      paymentMethod: paymentMethod,
      shippingAddress: selectedAddress?._id,
      sellerId: order.sellerId,
      products: order.products,
      shippingFee: selectedShipping?.fee || 0,
    };

    // Create order in database
    const orderResponse = await axios.post("/orders", orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const createdOrder = orderResponse.data;
    // Create GHN shipping order if needed

    if (selectedShipping?.id === "ship-cod") {
      try {
        const product = products.find((p) => p.seller._id === order.sellerId);

        if (product) {
          // Get available services from GHN
          const availableServices = await ghnService.getAvailableServices(
            product.seller.from_district_id,
            selectedAddress.districtId
          );

          const serviceId =
            availableServices && availableServices.length > 0
              ? availableServices[0].service_id
              : 53320;

          const serviceTypeId =
            availableServices && availableServices.length > 0
              ? availableServices[0].service_type_id
              : 2;

          const ghnOrderData = {
            to_name: selectedAddress.fullName,
            to_phone: selectedAddress.phoneNumber,
            to_address: selectedAddress.specificAddress,
            to_ward_code: selectedAddress.wardCode,
            to_district_id: selectedAddress.districtId,
            cod_amount:
              paymentMethod === "cod"
                ? orderPayload.totalAmount - selectedShipping.fee
                : 0,
            content: "Hàng hóa",

            from_name: product.seller.fullName,
            from_ward_code: product.seller.from_ward_code,
            from_district_id: product.seller.from_district_id,
            weight: products.reduce(
              (a, b) =>
                a + b.estimatedWeight.value * b.quantity || 600 * b.quantity,
              0
            ),
            length: 20,
            width: 15,
            height: 10,
            service_id: serviceId,
            service_type_id: serviceTypeId,
            payment_type_id: paymentMethod === "cod" ? 2 : 1,
            note: `Đơn hàng #${createdOrder.order?._id || createdOrder._id}`,
            required_note: "CHOTHUHANG",
            items: order.products.map((product) => ({
              name: product.name,
              quantity: product.quantity,
              price: product.price,
            })),
          };

          const ghnResponse = await ghnService.createOrder(ghnOrderData);

          if (ghnResponse.code === 200) {
            await axios.put(
              `/orders/${createdOrder.order?._id}/ghn-order`,
              {
                ghnOrderCode: ghnResponse.data.order_code,
                ghnSortCode: ghnResponse.data.sort_code,
                expectedDeliveryTime: ghnResponse.data.expected_delivery_time,
                transType: ghnResponse.data.trans_type,
                shippingFee: ghnResponse.data.fee.main_service,
                insuranceFee: ghnResponse.data.fee.insurance,
                codFee: ghnResponse.data.fee.cod_fee,
                totalShippingFee: ghnResponse.data.total_fee,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
        }
      } catch (ghnError) {
        console.error("Error creating GHN order:", ghnError);
        // Continue without GHN - order still created
      }
    }

    return createdOrder;
  };

  // Handle bank transfer with shipping orders
  const handleBankTransferWithShippingOrder = async (
    order,
    selectedAddress,
    selectedShipping,
    paymentMethod,
    products,
    token
  ) => {
    const orderPayload = {
      totalAmount: order.products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      ),
      shippingMethod: "ship-cod",
      paymentMethod: paymentMethod,
      shippingAddress: selectedAddress?._id,
      sellerId: order.sellerId,
      products: order.products,
    };
    let ghnResponse;
    // Create order in database
    const orderResponse = await axios.post("/orders", orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const createdOrder = orderResponse.data;

    if (selectedShipping?.id === "ship-cod") {
      try {
        const product = products.find((p) => p.seller._id === order.sellerId);

        if (product) {
          const availableServices = await ghnService.getAvailableServices(
            product.seller.from_district_id,
            selectedAddress.districtId
          );

          const serviceId =
            availableServices && availableServices.length > 0
              ? availableServices[0].service_id
              : 53320;

          const serviceTypeId =
            availableServices && availableServices.length > 0
              ? availableServices[0].service_type_id
              : 2;

          const ghnOrderData = {
            to_name: selectedAddress.fullName,
            to_phone: selectedAddress.phoneNumber,
            to_address: selectedAddress.specificAddress,
            to_ward_code: selectedAddress.wardCode,
            to_district_id: selectedAddress.districtId,
            cod_amount: 0,
            content: "Hàng hóa",
            from_name: product.seller.fullName,
            from_ward_code: product.seller.from_ward_code,
            from_district_id: product.seller.from_district_id,
            weight: products.reduce(
              (a, b) =>
                a + b.estimatedWeight.value * b.quantity || 600 * b.quantity,
              0
            ),
            length: 20,
            width: 15,
            height: 10,
            service_id: serviceId,
            service_type_id: serviceTypeId,
            payment_type_id: 1,
            note: `Đơn hàng #${createdOrder.order?._id || createdOrder._id}`,
            required_note: "CHOTHUHANG",
            items: order.products.map((product) => ({
              name: product.name,
              quantity: product.quantity,
              price: product.price,
            })),
          };

          ghnResponse = await ghnService.createOrder(ghnOrderData);

          if (ghnResponse.code === 200) {
            // Update order with GHN order code
            await axios.put(
              `/orders/${createdOrder.order?._id}/ghn-order`,
              {
                ghnOrderCode: ghnResponse.data.order_code,
                ghnSortCode: ghnResponse.data.sort_code,
                expectedDeliveryTime: ghnResponse.data.expected_delivery_time,
                transType: ghnResponse.data.trans_type,
                shippingFee: ghnResponse.data.fee.main_service,
                insuranceFee: ghnResponse.data.fee.insurance,
                codFee: ghnResponse.data.fee.cod_fee,
                totalShippingFee: ghnResponse.data.total_fee,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
        }
      } catch (ghnError) {
        console.error("Error creating GHN order:", ghnError);
        // Continue without GHN - order still created
      }
    }

    return {
      ...createdOrder,
      selectedShipping,
      order_code: ghnResponse?.data?.order_code,
    };
  };

  // Handle QR payment dialog confirm
  const handleQRPaymentConfirm = async () => {
    try {
      await axios.put(
        "/payments/bank-transfer/confirm",
        {
          transactionId: qrPaymentDialog.transactionId,
          orderIds: qrPaymentDialog.orderIds,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Close dialog
      setQrPaymentDialog({
        open: false,
        qrCodeUrl: "",
        totalAmount: 0,
        transactionId: "",
        orderIds: [],
      });

      showSuccess(
        "Thanh toán thành công! Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm nhất."
      );

      // Clear cart and navigate
      clearCart();
      navigate("/user/orders");
    } catch (error) {
      console.error("Error confirming payment:", error);
      showError("Lỗi xác nhận thanh toán. Vui lòng thử lại.");
    }
  };

  // Handle QR payment dialog cancel
  const handleQRPaymentCancel = async () => {
    try {
      // Cancel orders
      await Promise.all(
        qrPaymentDialog.orderIds.map((orderId) =>
          axios.put(
            `/orders/${orderId}/cancel`,
            {
              reason: "Payment cancelled by user",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        )
      );

      // Close dialog
      setQrPaymentDialog({
        open: false,
        qrCodeUrl: "",
        totalAmount: 0,
        transactionId: "",
        orderIds: [],
      });

      showSuccess("Đơn hàng đã được hủy do không thanh toán.");
    } catch (error) {
      console.error("Error cancelling orders:", error);
      showError("Lỗi hủy đơn hàng. Vui lòng thử lại.");
    }
  };

  const handlePlaceOrder = async ({
    selectedAddress,
    selectedShippingMethods = {},
    coinDiscount,
    paymentMethod = "cod",
  }) => {
    setIsPlacingOrder(true);
    if (isPlacingOrder) return;
    try {
      if (!selectedAddress) {
        throw new Error(FORM_VALIDATION_MESSAGES.ADDRESS_REQUIRED);
      }

      const products = Array.isArray(selectedItems) ? selectedItems : [];

      if (products.length === 0) {
        throw new Error(FORM_VALIDATION_MESSAGES.NO_ITEMS_SELECTED);
      }

      // Apply coin discount if specified
      if (coinDiscount > 0) {
        const coinResult = await coinService(coinDiscount);
        if (coinResult.status !== "success") {
          throw new Error(
            coinResult.message || FORM_VALIDATION_MESSAGES.COIN_USAGE_FAILED
          );
        }
      }

      // Group products by seller
      const groupedProducts = groupProductsBySeller(products);

      const createdOrders = [];
      const bankTransferOrders = [];
      const directMeetingOrders = [];
      const codShippingOrders = [];

      // Process each order individually based on its shipping method
      for (const order of groupedProducts) {
        const selectedShipping = selectedShippingMethods[order.sellerId];

        // Determine individual order flow
        let orderFlow;
        if (!selectedShipping || selectedShipping.id !== "ship-cod") {
          orderFlow = "direct-meeting-only";
        } else if (paymentMethod === "bank_transfer") {
          orderFlow = "bank-transfer-with-shipping";
        } else {
          orderFlow = "cod-with-shipping";
        }

        let createdOrder;

        try {
          if (orderFlow === "direct-meeting-only") {
            // Flow 1: Direct meeting only
            createdOrder = await handleDirectMeetingOrder(
              order,
              selectedAddress,
              token
            );
          } else if (orderFlow === "cod-with-shipping") {
            // Flow 2: COD with shipping
            createdOrder = await handleCodWithShippingOrder(
              order,
              selectedAddress,
              selectedShipping,
              paymentMethod,
              products,
              token
            );
          } else if (orderFlow === "bank-transfer-with-shipping") {
            // Flow 3: Bank transfer with shipping
            createdOrder = await handleBankTransferWithShippingOrder(
              order,
              selectedAddress,
              selectedShipping,
              paymentMethod,
              products,
              token
            );
            const response = await axios.post("/payments/create-payment-link", {
              orderId: createdOrder.order._id,
              amount:
                createdOrder.order.totalAmount +
                createdOrder.selectedShipping.fee,
              items: products,
            });

            const { checkoutUrl } = response.data;

            if (checkoutUrl) {
              window.location.href = checkoutUrl; // ✅ Tự động chuyển hướng người dùng
            } else {
              alert("Không lấy được link thanh toán");
            }
            // Thêm log và alert để debug

            // Điều hướng sang trang QR Payment
            // navigate(`/payment/${createdOrder.order?._id || createdOrder._id}`);
          }

          if (createdOrder) {
            createdOrders.push(createdOrder);
            if (orderFlow === "direct-meeting-only") {
              directMeetingOrders.push(createdOrder);
            } else if (orderFlow === "cod-with-shipping") {
              codShippingOrders.push(createdOrder);
            } else if (orderFlow === "bank-transfer-with-shipping") {
              bankTransferOrders.push(createdOrder);
            }
          }
        } catch (error) {
          console.error(
            `❌ Debug: Error creating order for seller ${order.sellerId}:`,
            error
          );
          throw error; // Re-throw to handle in outer catch
        }
      }

      // Nếu có đơn bank transfer thì không clear cart/chuyển trang ở đây, sẽ xử lý khi polling thấy đã thanh toán
      if (bankTransferOrders.length > 0) {
        // Đã show QR, FE sẽ chờ user thanh toán
      } else {
        // Show success cho các flow khác
        let successMessage;
        if (directMeetingOrders.length > 0 && codShippingOrders.length > 0) {
          successMessage = `${createdOrders.length} đơn hàng đã được tạo thành công! Gồm ${directMeetingOrders.length} đơn giao dịch trực tiếp và ${codShippingOrders.length} đơn vận chuyển COD.`;
        } else if (directMeetingOrders.length > 0) {
          successMessage = `${directMeetingOrders.length} đơn hàng đã được tạo thành công! Vui lòng liên hệ với người bán để hẹn gặp mặt.`;
        } else {
          successMessage = `${codShippingOrders.length} đơn hàng đã được tạo thành công! Đơn hàng sẽ được giao đến địa chỉ của bạn.`;
        }
        showSuccess(successMessage);
        deleteItem(products.map((product) => product._id));
        navigate("/eco-market/customer/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      showError(
        error.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleDeleteItems = async (itemIds) => {
    try {
      // Implementation for deleting items
      console.log("Deleting items:", itemIds);
    } catch (error) {
      console.error("Error deleting items:", error);
      showError("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  return {
    isPlacingOrder,
    handlePlaceOrder,
    handleDeleteItems,
    qrPaymentDialog,
    handleQRPaymentConfirm,
    handleQRPaymentCancel,
    setQrPaymentDialog,
  };
};
