import axios from 'axios';

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://localhost:5000';

const normalizedBaseUrl = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  signup: (userData: any) => api.post('/auth/signup', userData),
};

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (productData: any) => api.post('/products', productData),
  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  delete: (id: string) => api.delete(`/products/${id}`),
  uploadImage: (formData: any) => api.post('/products/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const orderApi = {
  create: (orderData: any) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders/user'),
  getAllOrders: () => api.get('/orders'),
  updateOrder: (id: string, orderData: { status?: string; paymentStatus?: string }) => 
    api.put(`/orders/${id}`, orderData),
};

// Helper to prepend backend base URL to relative image paths
export const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return 'https://via.placeholder.com/600';
  if (imagePath.startsWith('http')) return imagePath;
  return `${rawBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default api;