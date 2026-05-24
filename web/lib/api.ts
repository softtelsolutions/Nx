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
};

export const orderApi = {
  create: (orderData: any) => api.post('/orders', orderData),
  getUserOrders: () => api.get('/orders/user'),
};

export default api;