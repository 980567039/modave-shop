// hooks/useProducts.js
import { useQuery } from '@tanstack/react-query';
import api from '../api/axiosInstance'; // Your interceptor file

const fetchProducts = async () => {
  return await api.get('/products'); // This will go through your Axios interceptors
};

export const useProducts = () => {
  return useQuery(['products'], fetchProducts, {
    staleTime: 1000 * 60 * 5, // 5 minutes caching
    retry: 2, // Retry on failure
    refetchOnWindowFocus: false, // Disable refetch on focus if you prefer
  });
};