import ApiService from "./ApiService";
import { CartItem, ApiResponse } from "../types/api.types";

interface AddToCartResponse {
  message: string;
  cart: CartItem[];
}

const cartService = {
  /**
   * Add product to cart
   * BE endpoint: POST /cart/add
   */
  async addToCart(
    productId: string,
    quantity: number = 1
  ): Promise<AddToCartResponse> {
    return await ApiService.post<AddToCartResponse>("/cart/add", {
      productId,
      quantity,
    });
  },

  /**
   * Purchase now (skip cart, go directly to checkout)
   * BE endpoint: POST /cart/purchase-now
   */
  async purchaseNow(
    productId: string,
    quantity: number = 1
  ): Promise<AddToCartResponse> {
    return await ApiService.post<AddToCartResponse>("/cart/purchase-now", {
      productId,
      quantity,
    });
  },

  /**
   * Delete item from cart
   * BE endpoint: DELETE /cart/delete-item
   */
  async deleteItem(cartItemId: string): Promise<ApiResponse> {
    return await ApiService.delete<ApiResponse>("/cart/delete-item", {
      data: { cartItemId },
    });
  },

  /**
   * Update item quantity in cart
   * BE endpoint: PUT /cart/update-quantity
   */
  async updateQuantity(
    cartItemId: string,
    quantity: number
  ): Promise<AddToCartResponse> {
    return await ApiService.put<AddToCartResponse>("/cart/update-quantity", {
      cartItemId,
      quantity,
    });
  },

  /**
   * Clear all items from cart
   * BE endpoint: DELETE /cart/clear
   */
  async clearCart(): Promise<ApiResponse> {
    return await ApiService.delete<ApiResponse>("/cart/clear");
  },
};

export default cartService;
