// hooks/useProductMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axiosInstance'; // Your Axios instance with interceptors

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (newProduct) => api.post('/products', newProduct),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']); // Refetch product list
      }
    }
  );
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, data }) => api.put(`/products/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
      }
    }
  );
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (id) => api.delete(`/products/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
      }
    }
  );
};
