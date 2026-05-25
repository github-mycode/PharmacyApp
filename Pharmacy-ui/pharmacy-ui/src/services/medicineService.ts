import axios from 'axios';
import type { Medicine } from '../types/medicine';

const API_BASE_URL = 'https://localhost:7052/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export interface SaleRecord {
  medicineId: number | string;
  quantity: number;
}

export const medicineService = {
  getAll: async (name: string = ''): Promise<Medicine[]> => {
    const params = name ? { name } : {};

    const response = await api.get<Medicine[]>(
      '/medicines',
      { params }
    );

    return response.data;
  },

  getById: async (
    id: number | string
  ): Promise<Medicine> => {
    const response = await api.get<Medicine>(
      `/medicines/${id}`
    );

    return response.data;
  },

  create: async (
    medicine: Medicine
  ): Promise<Medicine> => {
    const response = await api.post<Medicine>(
      '/medicines',
      medicine
    );

    return response.data;
  },

  update: async (
    id: number | string,
    medicine: Medicine
  ): Promise<Medicine> => {
    const response = await api.put<Medicine>(
      `/medicines?id=${id}`,
      medicine
    );

    return response.data;
  },

  delete: async (
    id: number | string
  ): Promise<void> => {
    await api.delete(`/medicines/${id}`);
  },

  recordSale: async (
    medicineId: number | string,
    quantity: number
  ): Promise<SaleRecord> => {
    const response = await api.post<SaleRecord>(
      '/medicines/sale',
      {
        medicineId,
        quantity,
      }
    );

    return response.data;
  },

  getSalesHistory: async (): Promise<SaleRecord[]> => {
    const response = await api.get<SaleRecord[]>(
      '/medicines/sales'
    );

    return response.data;
  },
};