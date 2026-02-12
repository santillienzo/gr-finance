import axios from 'axios';
import { Transaction, Entity, Box } from '../types';

const API_URL = process.env.REACT_APP_API_URL;

// Create Axios Instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Injects JWT Token into Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle expired/invalid token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.hash = '#/login';
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // --- AUTH ---
  auth: {
    login: async (username: string, password: string): Promise<{ token: string; user: { name: string; username: string } }> => {
      const response = await apiClient.post('/auth/login', { username, password });
      return response.data;
    },
  },

  // --- BOXES ---
  getBoxes: async (): Promise<Box[]> => {
    const response = await apiClient.get('/boxes');
    return response.data;
  },

  // --- CLIENTS ---
  getClients: async (): Promise<Entity[]> => {
    const response = await apiClient.get('/clients/active');
    return response.data;
  },

  getAllClients: async (): Promise<Entity[]> => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  createClient: async (data: { name: string }): Promise<Entity> => {
    const response = await apiClient.post('/clients', data);
    return response.data;
  },

  deactivateClient: async (id: string): Promise<Entity> => {
    const response = await apiClient.patch(`/clients/${id}/deactivate`);
    return response.data;
  },

  // --- PROVIDERS ---
  getProviders: async (): Promise<Entity[]> => {
    const response = await apiClient.get('/providers/active');
    return response.data;
  },

  getAllProviders: async (): Promise<Entity[]> => {
    const response = await apiClient.get('/providers');
    return response.data;
  },

  createProvider: async (data: { name: string }): Promise<Entity> => {
    const response = await apiClient.post('/providers', data);
    return response.data;
  },

  deactivateProvider: async (id: string): Promise<Entity> => {
    const response = await apiClient.patch(`/providers/${id}/deactivate`);
    return response.data;
  },

  // --- TRANSACTIONS ---
  getTransactions: async (): Promise<Transaction[]> => {
    const response = await apiClient.get('/transactions');
    return response.data;
  },

  createTransaction: async (data: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  // --- SETTINGS / INITIAL BALANCE ---
  setInitialBalance: async (data: { entityId: string; type: 'BOX' | 'CLIENT' | 'PROVIDER'; amount: number }): Promise<void> => {
    await apiClient.post('/initial-balance', data);
  }
};