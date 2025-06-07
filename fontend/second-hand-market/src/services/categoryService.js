import ApiService from './ApiService';

const categoryService = {
  getAllCategories: async () => {
    return await ApiService.get('/categories');
  },

  getCategoryById: async (id) => {
    return await ApiService.get(`/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    return await ApiService.post('/categories', categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await ApiService.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await ApiService.delete(`/categories/${id}`);
  },
};

export default categoryService;
