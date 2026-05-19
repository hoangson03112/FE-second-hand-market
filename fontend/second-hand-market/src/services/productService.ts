import ApiService from "./ApiService";
import {
  Product,
  ProductQueryParams,
  PaginatedResponse,
  ApiResponse,
} from "../types/api.types";

const productService = {
  /**
   * Get all products (admin only)
   * BE endpoint: GET /products (requires admin role)
   */
  getAllProducts: async (
    params: ProductQueryParams = {}
  ): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return await ApiService.get<PaginatedResponse<Product>>(
      `/products?${queryParams}`
    );
  },

  /**
   * Get product by ID
   * BE endpoint: GET /products/:productID
   */
  getProductById: async (id: string): Promise<Product> => {
    return await ApiService.get<Product>(`/products/${id}`);
  },

  /**
   * Get products by category
   * BE endpoint: GET /products/categories
   * Uses categorySlug or subCategorySlug in query params
   */
  getProductsByCategory: async (
    params: ProductQueryParams
  ): Promise<PaginatedResponse<Product>> => {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    return await ApiService.get<PaginatedResponse<Product>>(
      `/products/categories?${queryParams}`
    );
  },

  /**
   * Get products by user ID
   * BE endpoint: GET /products/users/:userId
   */
  getUserProducts: async (userId: string): Promise<Product[]> => {
    return await ApiService.get<Product[]>(`/products/users/${userId}`);
  },

  /**
   * Get my product listings
   * BE endpoint: GET /products/my/listings (requires auth)
   */
  getMyProducts: async (): Promise<Product[]> => {
    return await ApiService.get<Product[]>("/products/my/listings");
  },

  /**
   * Get seller's products (if user is seller)
   * BE endpoint: GET /products/my/seller (requires auth)
   */
  getSellerProducts: async (): Promise<Product[]> => {
    return await ApiService.get<Product[]>("/products/my/seller");
  },

  /**
   * Create new product
   * BE endpoint: POST /products (requires auth)
   * Accepts FormData for file uploads
   */
  createProduct: async (productData: FormData): Promise<Product> => {
    return await ApiService.post<Product>("/products", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update product
   * BE endpoint: PUT /products/:productId (requires auth)
   * Accepts FormData for file uploads
   */
  updateProduct: async (id: string, productData: FormData): Promise<Product> => {
    return await ApiService.put<Product>(`/products/${id}`, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Update product status
   * BE endpoint: PATCH /products/:productId/status (requires auth)
   */
  updateProductStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse<Product>> => {
    return await ApiService.patch<ApiResponse<Product>>(
      `/products/${id}/status`,
      { status }
    );
  },

  /**
   * Delete product
   * BE endpoint: DELETE /products/:productId (requires auth)
   */
  deleteProduct: async (id: string): Promise<ApiResponse> => {
    return await ApiService.delete<ApiResponse>(`/products/${id}`);
  },

  /**
   * Search products
   * BE endpoint: GET /products/categories with search param
   */
  searchProducts: async (query: string): Promise<PaginatedResponse<Product>> => {
    return await ApiService.get<PaginatedResponse<Product>>(
      `/products/categories?search=${encodeURIComponent(query)}`
    );
  },
};

export default productService;
