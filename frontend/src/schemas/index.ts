import { z } from 'zod';

// User schemas
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    token: z.string(),
    user: userSchema
  })
});

// Todo schemas
export const todoSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const todosResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(todoSchema)
});

export const todoResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: todoSchema
});

// Form validation schemas
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signupFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
});

export const todoFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional()
});

// Types
export type User = z.infer<typeof userSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type Todo = z.infer<typeof todoSchema>;
export type TodosResponse = z.infer<typeof todosResponseSchema>;
export type TodoResponse = z.infer<typeof todoResponseSchema>;
export type LoginForm = z.infer<typeof loginFormSchema>;
export type SignupForm = z.infer<typeof signupFormSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
export type TodoForm = z.infer<typeof todoFormSchema>;