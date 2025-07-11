import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useCart } from '../contexts/CartContext';
import { useCoin } from '../contexts/CoinProvider';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from './useNotification';
import { groupProductsBySeller } from '../utils/checkoutUtils';
import { FORM_VALIDATION_MESSAGES } from '../constants/checkout';

export const useOrderPlacement = (selectedItems) => {
  const navigate = useNavigate();
  const { deleteItem } = useCart();
  const { useCoins: coinService } = useCoin();
  const { currentUser } = useAuth();
  const { showWarning, showError } = useNotification();

  const handleDeleteItems = async () => {
    const ids = selectedItems.map((item) => item._id);
    await deleteItem(ids);
  };

  const handlePlaceOrder = async ({
    products,
    finalAmount,
    shippingMethod,
    selectedAddress,
    selectedVoucher,
    useCoins,
    coinDiscount
  }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarning(FORM_VALIDATION_MESSAGES.LOGIN_REQUIRED);
        navigate("/login");
        return;
      }

      // Use coins if enabled
      if (useCoins && coinDiscount > 0) {
        const coinResult = await coinService(coinDiscount);
        if (coinResult.status !== "success") {
          throw new Error(coinResult.message || FORM_VALIDATION_MESSAGES.COIN_USAGE_FAILED);
        }
      }

      // Group products by seller
      const ordersBySeller = groupProductsBySeller(products);

      // Create orders for each seller
      for (const order of ordersBySeller) {
        const orderPayload = {
          totalAmount: finalAmount,
          shippingMethod,
          paymentMethod: "cod",
          shippingAddress: selectedAddress?._id,
          sellerId: order.sellerId,
          products: order.products,
        };

        await axios.post("/orders", orderPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Update voucher usage if applicable
      if (selectedVoucher && selectedVoucher.id) {
        try {
          await axios.post(
            "/vouchers/use",
            { voucherId: selectedVoucher.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (voucherError) {
          console.error("Error updating voucher usage:", voucherError);
        }
      }

      // Show success message
      Swal.fire({
        title: "Thông báo!",
        text: FORM_VALIDATION_MESSAGES.ORDER_SUCCESS,
        icon: "success",
        confirmButtonText: "OK",
      });

      // Navigate to orders page and delete cart items
      navigate("/eco-market/customer/orders");
      await handleDeleteItems();
      
    } catch (error) {
      console.error("Error creating order:", error);
      showError(FORM_VALIDATION_MESSAGES.ORDER_FAILED);
    }
  };

  return {
    handlePlaceOrder,
    handleDeleteItems
  };
}; 