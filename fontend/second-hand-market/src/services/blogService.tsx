import ApiService from "./ApiService";

const blogService = {
  async getAllBlogs(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await ApiService.get(`/blogs?${queryParams}`);
  },

  async getBlogById(id) {
    return await ApiService.get(`/blogs/${id}`);
  },

  async createBlog(blogData) {
    return await ApiService.post("/blogs", blogData);
  },

  async updateBlog(id, blogData) {
    return await ApiService.put(`/blogs/${id}`, blogData);
  },

  async deleteBlog(id) {
    return await ApiService.delete(`/blogs/${id}`);
  },
};

export default blogService;
