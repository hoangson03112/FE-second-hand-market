import ApiService from "./ApiService";
import { Category, SubCategory, ApiResponse } from "../types/api.types";

interface CategoryCreateData {
  name: string;
  slug?: string;
  description?: string;
  image?: FormData;
}

interface SubCategoryCreateData {
  name: string;
  slug?: string;
  description?: string;
}

const categoryService = {
  // ==================== CATEGORIES ====================

  /**
   * Get all categories
   * BE endpoint: GET /categories
   */
  getAllCategories: async (): Promise<Category[]> => {
    return await ApiService.get<Category[]>("/categories");
  },

  /**
   * Get category by ID
   * BE endpoint: GET /categories/:id
   */
  getCategoryById: async (id: string): Promise<Category> => {
    return await ApiService.get<Category>(`/categories/${id}`);
  },

  /**
   * Create new category
   * BE endpoint: POST /categories
   */
  createCategory: async (categoryData: CategoryCreateData): Promise<Category> => {
    return await ApiService.post<Category>("/categories", categoryData);
  },

  /**
   * Update category
   * BE endpoint: PUT /categories/update
   */
  updateCategory: async (
    id: string,
    categoryData: Partial<CategoryCreateData>
  ): Promise<Category> => {
    return await ApiService.put<Category>("/categories/update", {
      id,
      ...categoryData,
    });
  },

  /**
   * Delete category
   * BE endpoint: DELETE /categories/:id
   */
  deleteCategory: async (id: string): Promise<ApiResponse> => {
    return await ApiService.delete<ApiResponse>(`/categories/${id}`);
  },

  // ==================== SUB-CATEGORIES ====================

  /**
   * Get all subcategories
   * BE endpoint: GET /categories/sub
   */
  getSubCategories: async (): Promise<SubCategory[]> => {
    return await ApiService.get<SubCategory[]>("/categories/sub");
  },

  /**
   * Create new subcategory
   * BE endpoint: POST /categories/sub/:parentCategoryId
   */
  createSubCategory: async (
    parentCategoryId: string,
    subCategoryData: SubCategoryCreateData
  ): Promise<SubCategory> => {
    return await ApiService.post<SubCategory>(
      `/categories/sub/${parentCategoryId}`,
      subCategoryData
    );
  },

  /**
   * Update subcategory
   * BE endpoint: PUT /categories/sub/update
   */
  updateSubCategory: async (
    id: string,
    subCategoryData: Partial<SubCategoryCreateData>
  ): Promise<SubCategory> => {
    return await ApiService.put<SubCategory>("/categories/sub/update", {
      id,
      ...subCategoryData,
    });
  },

  /**
   * Delete subcategory
   * BE endpoint: DELETE /categories/:categoryId/sub/:subcategoryId
   */
  deleteSubCategory: async (
    categoryId: string,
    subcategoryId: string
  ): Promise<ApiResponse> => {
    return await ApiService.delete<ApiResponse>(
      `/categories/${categoryId}/sub/${subcategoryId}`
    );
  },
};

export default categoryService;
