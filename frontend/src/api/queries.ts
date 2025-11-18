import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import {
  authResponseSchema,
  todosResponseSchema,
  todoResponseSchema
} from '../schemas';
import type {
  LoginForm,
  SignupForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  TodoForm
} from '../schemas';
import { useAuthStore } from '../store/authStore';

// Auth API
export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiClient.post('/api/auth/login', data);
      return authResponseSchema.parse(response.data);
    },
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
    }
  });
};

export const useSignup = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiClient.post('/api/auth/signup', data);
      return authResponseSchema.parse(response.data);
    },
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.token);
    }
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordForm) => {
      const response = await apiClient.post('/api/auth/forgot-password', data);
      return response.data;
    }
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordForm) => {
      const response = await apiClient.post('/api/auth/reset-password', data);
      return response.data;
    }
  });
};

// Todo API
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await apiClient.get('/api/todos');
      return todosResponseSchema.parse(response.data);
    }
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TodoForm) => {
      const response = await apiClient.post('/api/todos', data);
      return todoResponseSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TodoForm> }) => {
      const response = await apiClient.put(`/api/todos/${id}`, data);
      return todoResponseSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/api/todos/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/todos/${id}/toggle`);
      return todoResponseSchema.parse(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
  });
};