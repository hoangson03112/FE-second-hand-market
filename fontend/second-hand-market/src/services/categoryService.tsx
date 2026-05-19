import ApiService from './ApiService';

const categoryService = {
  // Categories
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
    return await ApiService.put('/categories/update', { id, ...categoryData });
  },

  deleteCategory: async (id) => {
    return await ApiService.delete(`/categories/${id}`);
  },

  // SubCategories
  getSubCategories: async () => {
    return await ApiService.get('/categories/sub');
  },

  createSubCategory: async (parentCategoryId, subCategoryData) => {
    return await ApiService.post(`/categories/sub/${parentCategoryId}`, subCategoryData);
  },

  updateSubCategory: async (id, subCategoryData) => {
    return await ApiService.put('/categories/sub/update', { id, ...subCategoryData });
  },

  deleteSubCategory: async (categoryId, subcategoryId) => {
    return await ApiService.delete(`/categories/${categoryId}/sub/${subcategoryId}`);
  },
};

export default categoryService;
