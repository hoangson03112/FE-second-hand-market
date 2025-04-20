import ApiService from './ApiService';

const productService = {
  getAllProducts: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/products?${queryParams}`);
  },

  getProductById: async (id) => {
    return await ApiService.get(`/products/${id}`);
  },

  getProductsByCategory: async (categoryId) => {
    return await ApiService.get(`/products/category/${categoryId}`);
  },

  getProductsBySubCategory: async (subCategoryId) => {
    return await ApiService.get(`/products/subcategory/${subCategoryId}`);
  },
  
  getUserProducts: async (userId) => {
    return await ApiService.get(`/users/${userId}/products`);
  },

  createProduct: async (productData) => {
    return await ApiService.post('/products', productData);
  },

  updateProduct: async (id, productData) => {
    return await ApiService.put(`/products/${id}`, productData);
  },

  deleteProduct: async (id) => {
    return await ApiService.delete(`/products/${id}`);
  },

  searchProducts: async (query) => {
    return await ApiService.get(`/products/search?q=${query}`);
  }
};

export default productService; 