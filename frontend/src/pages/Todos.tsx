import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useToggleTodo
} from '../api/queries';
import { useAuthStore } from '../store/authStore';
import { todoFormSchema } from '../schemas';
import type { TodoForm, Todo } from '../schemas';

export const Todos: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: todosData, isLoading } = useTodos();
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const toggleTodoMutation = useToggleTodo();

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TodoForm>({
    resolver: zodResolver(todoFormSchema)
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    setValue: setEditValue
  } = useForm<TodoForm>({
    resolver: zodResolver(todoFormSchema)
  });

  const onCreateSubmit = async (data: TodoForm) => {
    try {
      await createTodoMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error('Create todo error:', error);
    }
  };

  const onEditSubmit = async (data: TodoForm) => {
    if (!editingTodo) return;
    try {
      await updateTodoMutation.mutateAsync({
        id: editingTodo._id,
        data
      });
      setEditingTodo(null);
    } catch (error) {
      console.error('Update todo error:', error);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditValue('title', todo.title);
    setEditValue('description', todo.description || '');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await deleteTodoMutation.mutateAsync(id);
    }
  };

  const handleToggle = async (id: string) => {
    await toggleTodoMutation.mutateAsync(id);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const todos = todosData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Todo App</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Todo</h2>
            <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
              <div>
                <input
                  {...register('title')}
                  type="text"
                  placeholder="Todo title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>
              <div>
                <textarea
                  {...register('description')}
                  placeholder="Description (optional)"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={createTodoMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createTodoMutation.isPending ? 'Creating...' : 'Create Todo'}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Your Todos</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {todos.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  No todos yet. Create your first one above!
                </div>
              ) : (
                todos.map((todo) => (
                  <div key={todo._id} className="px-6 py-4">
                    {editingTodo?._id === todo._id ? (
                      <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
                        <input
                          {...registerEdit('title')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <textarea
                          {...registerEdit('description')}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTodo(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggle(todo._id)}
                            className="mt-1 h-5 w-5 text-blue-600 rounded"
                          />
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                todo.completed
                                  ? 'line-through text-gray-500'
                                  : 'text-gray-900'
                              }`}
                            >
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="mt-1 text-sm text-gray-600">{todo.description}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(todo)}
                            className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(todo._id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};