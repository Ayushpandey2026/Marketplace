import api from './api';

export const authService = {
  register: async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const productService = {
  getProducts: async (search, category, page = 1, limit = 10) => {
    try {
      const response = await api.get('/products', {
        params: { search, category, page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch products';
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch product';
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create product';
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update product';
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete product';
    }
  },

  addToFavorites: async (productId) => {
    try {
      const response = await api.post(`/favorites/${productId}/favorite`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to add to favorites';
    }
  },

  removeFromFavorites: async (productId) => {
    try {
      const response = await api.delete(`/favorites/${productId}/favorite`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to remove from favorites';
    }
  },

  getFavorites: async () => {
    try {
      const response = await api.get('/favorites/user/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch favorites';
    }
  },
};
